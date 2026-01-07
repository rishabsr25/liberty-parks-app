//import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "@supabase/supabase-js"


const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

const _RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_REQUESTS = 5
const ACTION = "submit_report"

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    )
  }

  // Get client IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("cf-connecting-ip") ??
    "unknown"

const { data: allowed, error } = await supabase.rpc(
  "check_rate_limit",
  {
    p_ip: ip,
    p_action: ACTION,
    p_max: MAX_REQUESTS,
    p_window: "1 hour",
  }
)

if (error) {
  console.error("Rate limit error:", error)
  return new Response(
    JSON.stringify({ error: "Internal error" }),
    { status: 500, headers: { "Content-Type": "application/json" } }
  )
}

if (!allowed) {
  return new Response(
    JSON.stringify({ error: "Too many requests" }),
    { status: 429, headers: { "Content-Type": "application/json" } }
  )
}


  // 3️⃣ Parse body
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

  // 4️⃣ Continue with your normal logic here
  // (insert report, send email, etc.)

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { "Content-Type": "application/json" } }
  )
})
