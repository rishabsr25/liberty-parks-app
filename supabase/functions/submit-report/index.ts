import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const RATE_LIMIT_WINDOW_MS = 3_600_000 // 1 hour
const MAX_REQUESTS = 5

const ipHits = new Map<string, { count: number; timestamp: number }>()

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    )
  }

  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("cf-connecting-ip") ??
    "unknown"

  const now = Date.now()
  const record = ipHits.get(ip)

  if (record) {
    if (now - record.timestamp < RATE_LIMIT_WINDOW_MS) {
      if (record.count >= MAX_REQUESTS) {
        return new Response(
          JSON.stringify({ error: "Too many requests" }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        )
      }
      record.count++
    } else {
      ipHits.set(ip, { count: 1, timestamp: now })
    }
  } else {
    ipHits.set(ip, { count: 1, timestamp: now })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }

  const {
    park_id,
    type_of_issue,
    brief_description,
    detailed_description,
    email,
  } = body

  if (
    !park_id ||
    !type_of_issue ||
    !brief_description ||
    !detailed_description
  ) {
    return new Response(
      JSON.stringify({ error: "Missing required fields" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { "Content-Type": "application/json" } }
  )
})
