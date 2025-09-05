import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get API key from Authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid API key" }, { status: 401 })
    }

    const apiKey = authHeader.substring(7) // Remove "Bearer " prefix

    // Verify API key exists and get user
    const { data: keyData, error: keyError } = await supabase
      .from("api_keys")
      .select("user_id")
      .eq("api_key", apiKey)
      .eq("is_active", true)
      .single()

    if (keyError || !keyData) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    const body = await request.json()
    const { metric_type, value, unit = "mV", device_id, raw_data } = body

    // Validate required fields
    if (!metric_type || value === undefined) {
      return NextResponse.json({ error: "Missing required fields: metric_type, value" }, { status: 400 })
    }

    // Insert health metric
    const { data, error } = await supabase
      .from("health_metrics")
      .insert([
        {
          user_id: keyData.user_id,
          metric_type,
          value: Number.parseFloat(value),
          unit,
          device_id: device_id || "ESP32",
          raw_data: raw_data || null,
          recorded_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to save health data" }, { status: 500 })
    }

    await supabase.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("api_key", apiKey)

    return NextResponse.json({
      success: true,
      message: "Health data saved successfully",
      data: data[0],
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const metric_type = searchParams.get("metric_type")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    // Get user from session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let query = supabase
      .from("health_metrics")
      .select("*")
      .eq("user_id", user.id)
      .order("recorded_at", { ascending: false })
      .limit(limit)

    if (metric_type) {
      query = query.eq("metric_type", metric_type)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: "Failed to fetch health data" }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
