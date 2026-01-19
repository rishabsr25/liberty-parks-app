import { createClient } from "@supabase/supabase-js"

const supabaseUrl = Deno.env.get("SUPABASE_URL")
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

const MAX_REQUESTS = 5
const ACTION = "submit_report"

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    })
  }

    // ---- DEBUG LOGGING ----
    console.log("==== submit-report called ====")
    console.log("Method:", req.method)
    console.log("URL:", req.url)

    const headers: Record<string, string> = {}
    req.headers.forEach((value, key) => {
      headers[key] = value
    })
    console.log("Headers:", headers)

  // Get IP address
  const rawForwardedFor = req.headers.get("x-forwarded-for")
  const cfIp = req.headers.get("cf-connecting-ip")

  const ip =
    rawForwardedFor?.split(",")[0]?.trim() ??
    cfIp ??
    "unknown"

  console.log("Resolved IP:", ip)
  console.log("x-forwarded-for:", rawForwardedFor)
  console.log("cf-connecting-ip:", cfIp)

  // Check rate limit - pass interval as PostgreSQL interval type
  const { data: allowed, error } = await supabase.rpc("check_rate_limit", {
    p_ip: ip,
    p_action: ACTION,
    p_max: MAX_REQUESTS,
    p_window: "1 hour"  // This should work as-is
  })

    console.log("Rate limit result:", allowed)
    console.log("Rate limit error:", error)


  if (error) {
    console.error("Rate limit error:", error)
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  if (!allowed) {
    return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Parse request body
  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const { park_id, type_of_issue, brief_description, detailed_description } = body

  if (!park_id || !type_of_issue || !brief_description || !detailed_description) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Your actual report submission logic here
  // For now, just return success
  return new Response(JSON.stringify({ 
    success: true,
    message: "Report submitted successfully" 
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
})