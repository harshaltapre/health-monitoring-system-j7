import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { ecgData, heartRate, timestamp } = await request.json()

    // Simple ML prediction logic (replace with actual ML model)
    const prediction = analyzeHealthData(ecgData, heartRate)

    // Save prediction to database
    const { error } = await supabase.from("ml_predictions").insert({
      user_id: user.id,
      prediction_type: "ecg_analysis",
      risk_level: prediction.riskLevel,
      confidence_score: prediction.confidence,
      prediction_data: {
        heart_rate: heartRate,
        ecg_variance: prediction.ecgVariance,
        anomaly_detected: prediction.anomalyDetected,
        recommendations: prediction.recommendations,
        timestamp,
      },
    })

    if (error) throw error

    return NextResponse.json(prediction)
  } catch (error) {
    console.error("ML Prediction error:", error)
    return NextResponse.json({ error: "Prediction failed" }, { status: 500 })
  }
}

function analyzeHealthData(ecgData: number[], heartRate: number) {
  // Simple health risk assessment (replace with actual ML model)
  const ecgVariance = calculateVariance(ecgData)
  const hrNormal = heartRate >= 60 && heartRate <= 100
  const ecgStable = ecgVariance < 0.1

  let riskLevel = "low"
  let confidence = 0.85
  let anomalyDetected = false
  const recommendations: string[] = []

  // Risk assessment logic
  if (!hrNormal) {
    riskLevel = heartRate > 120 || heartRate < 50 ? "high" : "medium"
    anomalyDetected = true
    recommendations.push(heartRate > 120 ? "Consider rest and hydration" : "Monitor for bradycardia")
  }

  if (!ecgStable) {
    riskLevel = riskLevel === "high" ? "critical" : "medium"
    anomalyDetected = true
    recommendations.push("ECG irregularity detected - consult healthcare provider")
  }

  if (ecgVariance > 0.2) {
    riskLevel = "critical"
    confidence = 0.95
    recommendations.push("Significant ECG abnormality - seek immediate medical attention")
  }

  return {
    riskLevel,
    confidence,
    ecgVariance,
    anomalyDetected,
    recommendations: recommendations.length > 0 ? recommendations : ["Continue normal monitoring"],
  }
}

function calculateVariance(data: number[]): number {
  if (data.length < 2) return 0
  const mean = data.reduce((a, b) => a + b, 0) / data.length
  const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length
  return variance
}
