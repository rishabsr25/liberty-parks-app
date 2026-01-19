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
  // --- CORS Preflight ---
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*", // or your domain
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  }

  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // or your domain
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders,
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

  // Check rate limit
  const { data: allowed, error } = await supabase.rpc("check_rate_limit", {
    p_ip: ip,
    p_action: ACTION,
    p_max: MAX_REQUESTS,
    p_window: "1 hour"
  })

  console.log("Rate limit result:", allowed)
  console.log("Rate limit error:", error)

  if (error) {
    console.error("Rate limit error:", error)
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: corsHeaders,
    })
  }

  if (!allowed) {
    return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
      status: 429,
      headers: corsHeaders,
    })
  }

  // --- CLEANUP OLD RATE LIMIT ENTRIES ---
  try {
    const { error: cleanupError } = await supabase
      .from("rate_limits")
      .delete()
      .lt("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (cleanupError) {
      console.error("Error cleaning up rate_limits:", cleanupError);
    } else {
      console.log("Old rate_limits entries cleaned up.");
    }
  } catch (err) {
    console.error("Cleanup failed:", err);
  }

  // Parse request body
  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: corsHeaders,
    })
  }

  const { park_id, type_of_issue, brief_description, detailed_description } = body

  if (!park_id || !type_of_issue || !brief_description || !detailed_description) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: corsHeaders,
    })
  }

  // Insert the report into Supabase
  const { error: insertError } = await supabase.from("reports").insert({
    park_id,
    type_of_issue,
    brief_description,
    detailed_description,
    email: body.email || null,
    status: "pending", // default status
    created_at: new Date().toISOString(),
  })

  if (insertError) {
    console.error("Error inserting report:", insertError)
    return new Response(JSON.stringify({ error: "Failed to submit report" }), {
      status: 500,
      headers: corsHeaders,
    })
  }

  return new Response(JSON.stringify({ 
    success: true,
    message: "Report submitted successfully" 
  }), {
    status: 200,
    headers: corsHeaders,
  })
})
