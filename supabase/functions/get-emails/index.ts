// @ts-nocheck
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SENDER_EMAIL = "noreply@civicplus.com";

// Month name → number map for parsing "March 02, 2026"
const MONTH_MAP: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

/** Exchange refresh token for a fresh access token */
async function getAccessToken(): Promise<string> {
  const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
  const refreshToken = Deno.env.get("GOOGLE_REFRESH_TOKEN");

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_REFRESH_TOKEN.");
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to refresh access token: ${err}`);
  }

  const { access_token } = await res.json();
  return access_token;
}

/** Decode a URL-safe base64 string to plain text */
function decodeBase64(encoded: string): string {
  const standard = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const padded = standard.padEnd(
    standard.length + ((4 - (standard.length % 4)) % 4),
    "="
  );
  try {
    return atob(padded);
  } catch {
    return "";
  }
}

/** Extract the text/plain body from a Gmail message payload */
function extractRawBody(payload: any): string {
  if (!payload) return "";
  if (payload.body?.data) return decodeBase64(payload.body.data);
  if (payload.parts && Array.isArray(payload.parts)) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return decodeBase64(part.body.data);
      }
    }
    for (const part of payload.parts) {
      const nested = extractRawBody(part);
      if (nested) return nested;
    }
  }
  return "";
}

/**
 * Parse "March 02, 2026" → "2026-03-02"
 */
function parseDateLine(line: string): string | null {
  const trimmed = line.replace(/[\t\r\n]+/g, " ").trim();
  const match = trimmed.match(/^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/);
  if (!match) return null;
  const [, monthName, day, year] = match;
  const monthIndex = MONTH_MAP[monthName.toLowerCase()];
  if (monthIndex === undefined) return null;
  const d = new Date(Number(year), monthIndex, Number(day));
  return d.toISOString().split("T")[0];
}

/**
 * Extract main content from a CivicPlus newsletter.
 * Returns { date, title, body } or null if parsing fails.
 */
function extractMainContent(raw: string): { date: string; title: string; body: string } | null {
  // Strip leading tabs/spaces from each line
  const lines = raw.split(/\r?\n/).map((l) => l.replace(/^[\t ]+/, "").trimEnd());

  let dateLineIdx = -1;
  let parsedDate: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const d = parseDateLine(lines[i]);
    if (d) {
      parsedDate = d;
      dateLineIdx = i;
      break;
    }
  }

  if (dateLineIdx === -1 || !parsedDate) return null;

  const contentLines: string[] = [];
  for (let i = dateLineIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (
      /^\*{2,}/.test(line.trim()) ||
      /unsubscribe/i.test(line) ||
      /civicplus/i.test(line) ||
      /you are receiving this/i.test(line) ||
      /view.*in.*browser/i.test(line) ||
      /complimentary message/i.test(line)
    ) {
      break;
    }
    contentLines.push(line);
  }

  while (contentLines.length && !contentLines[0].trim()) contentLines.shift();
  while (contentLines.length && !contentLines[contentLines.length - 1].trim()) contentLines.pop();
  if (contentLines.length === 0) return null;

  const title = contentLines[0].trim();
  // Strip inline "View it on website" that sometimes gets appended to the last sentence
  const body = contentLines.slice(1).join("\n")
    .replace(/View it on website\s*$/i, "")
    .trim();

  return { date: parsedDate, title, body };
}

/**
 * Returns true if the email is relevant to parks/recreation.
 * Checks title + body against a list of park-related keywords.
 */
const PARK_KEYWORDS = [
  "park", "parks", "trail", "trails", "playground", "pavilion",
  "recreation", "field", "athletic", "splash pad", "splash",
  "nature", "hiking", "greenway", "open space", "preserve",
  "conservancy", "picnic", "shelter", "disc golf", "fitness station",
  "dog park", "skate", "sports complex", "ballfield", "soccer",
  "baseball", "basketball", "tennis", "pool", "aquatic",
  "liberty township park", "liberty park",
];

function isParkRelated(title: string, body: string): boolean {
  const text = (title + " " + body).toLowerCase();
  return PARK_KEYWORDS.some((kw) => text.includes(kw));
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    const accessToken = await getAccessToken();

    // Search Gmail for CivicPlus newsletters
    const query = encodeURIComponent(`from:${SENDER_EMAIL}`);
    const listRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${query}&maxResults=20`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!listRes.ok) {
      const err = await listRes.text();
      throw new Error(`Gmail list request failed: ${err}`);
    }

    const listData = await listRes.json();
    const messages: { id: string }[] = listData.messages ?? [];

    if (messages.length === 0) {
      return new Response(JSON.stringify([]), {
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    // Fetch and parse each message sequentially to avoid rate limits
    const results: { id: string; title: string; date: string; body: string }[] = [];

    for (const { id } of messages) {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (!msgRes.ok) {
        console.warn(`Skipping message ${id}: HTTP ${msgRes.status}`);
        continue;
      }

      const msg = await msgRes.json();
      const headers: { name: string; value: string }[] = msg.payload?.headers ?? [];
      const subject = headers.find((h) => h.name.toLowerCase() === "subject")?.value ?? "(no subject)";

      const rawBody = extractRawBody(msg.payload);
      const content = extractMainContent(rawBody);

      if (!content) {
        console.warn(`Could not extract content from message ${id} — skipping.`);
        continue;
      }

      const title = content.title || subject;

      // Only include emails relevant to parks
      if (!isParkRelated(title, content.body)) {
        console.log(`Skipping non-park email: "${title}"`);
        continue;
      }

      results.push({
        id,
        title,
        date: content.date,
        body: content.body,
      });
    }

    // Sort newest first
    results.sort((a, b) => b.date.localeCompare(a.date));

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });

  } catch (err: any) {
    console.error("get-emails error:", err);
    return new Response(
      JSON.stringify({ error: err?.message ?? "Unknown error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      }
    );
  }
});
