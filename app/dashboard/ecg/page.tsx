"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Activity, Play, Pause, Download, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ECGData {
  timestamp: string
  value: number
  id: string
}

interface MLPrediction {
  riskLevel: string
  confidence: number
  ecgVariance: number
  anomalyDetected: boolean
  recommendations: string[]
}

export default function ECGMonitoringPage() {
  const [ecgData, setEcgData] = useState<ECGData[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [heartRate, setHeartRate] = useState<number | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("disconnected")
  const [alerts, setAlerts] = useState<string[]>([])
  const [mlPrediction, setMlPrediction] = useState<MLPrediction | null>(null)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchRecentECGData()

    if (autoSaveEnabled) {
      saveIntervalRef.current = setInterval(() => {
        if (ecgData.length > 0) {
          autoSaveToCSV()
        }
      }, 60000) // Auto-save every minute
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current)
      }
    }
  }, [autoSaveEnabled, ecgData.length])

  const fetchRecentECGData = async () => {
    try {
      const { data, error } = await supabase
        .from("health_metrics")
        .select("*")
        .eq("metric_type", "ecg")
        .order("recorded_at", { ascending: false })
        .limit(100)

      if (error) throw error

      const formattedData = (data || [])
        .map((item) => ({
          id: item.id,
          timestamp: new Date(item.recorded_at).toLocaleTimeString(),
          value: Number.parseFloat(item.value),
        }))
        .reverse()

      setEcgData(formattedData)
    } catch (error) {
      console.error("[v0] Error fetching ECG data:", error)
    }
  }

  const startMonitoring = () => {
    setIsMonitoring(true)
    setConnectionStatus("connecting")

    setTimeout(() => {
      setConnectionStatus("connected")
      toast({
        title: "ECG Monitoring Started",
        description: "Real-time ECG data streaming with ML analysis is now active",
      })
    }, 2000)

    intervalRef.current = setInterval(async () => {
      const now = new Date()
      const newDataPoint: ECGData = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: now.toLocaleTimeString(),
        value: Math.sin(Date.now() / 1000) * 0.5 + Math.random() * 0.3 - 0.15,
      }

      setEcgData((prev) => {
        const updated = [...prev, newDataPoint]
        return updated.slice(-50)
      })

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          await supabase.from("health_metrics").insert([
            {
              user_id: user.id,
              metric_type: "ecg",
              value: newDataPoint.value,
              unit: "mV",
              device_id: "Simulator",
              recorded_at: now.toISOString(),
            },
          ])
        }
      } catch (error) {
        console.error("[v0] Error saving ECG data:", error)
      }

      const recentValues = ecgData.slice(-10).map((d) => d.value)
      if (recentValues.length > 5) {
        const avgValue = recentValues.reduce((a, b) => a + b, 0) / recentValues.length
        const estimatedHR = Math.round(60 + avgValue * 20 + Math.random() * 10)
        setHeartRate(estimatedHR)

        if (ecgData.length % 20 === 0) {
          await runMLPrediction(recentValues, estimatedHR)
        }

        if (estimatedHR > 100 || estimatedHR < 60) {
          const alertMsg = estimatedHR > 100 ? "High heart rate detected" : "Low heart rate detected"
          setAlerts((prev) => {
            if (!prev.includes(alertMsg)) {
              return [...prev, alertMsg]
            }
            return prev
          })
        }
      }
    }, 500)
  }

  const runMLPrediction = async (ecgValues: number[], currentHR: number) => {
    try {
      const response = await fetch("/api/ml-predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ecgData: ecgValues,
          heartRate: currentHR,
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        const prediction = await response.json()
        setMlPrediction(prediction)

        if (prediction.anomalyDetected) {
          setAlerts((prev) => [...prev, ...prediction.recommendations])
        }
      }
    } catch (error) {
      console.error("[v0] ML Prediction error:", error)
    }
  }

  const stopMonitoring = () => {
    setIsMonitoring(false)
    setConnectionStatus("disconnected")
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    toast({
      title: "ECG Monitoring Stopped",
      description: "Real-time data streaming has been paused",
    })
  }

  const clearAlerts = () => {
    setAlerts([])
  }

  const exportData = () => {
    const csvContent = [
      "Timestamp,ECG Value,Heart Rate,Risk Level,Confidence,Recommendations",
      ...ecgData.map((row, index) => {
        const hr = index === ecgData.length - 1 ? heartRate : "--"
        const risk = mlPrediction?.riskLevel || "unknown"
        const confidence = mlPrediction?.confidence || 0
        const recommendations = mlPrediction?.recommendations?.join("; ") || "None"
        return `${row.timestamp},${row.value},${hr},${risk},${confidence},"${recommendations}"`
      }),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `ecg_data_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    toast({
      title: "Data Exported",
      description: `ECG data with ML predictions exported successfully`,
    })
  }

  const autoSaveToCSV = async () => {
    if (ecgData.length === 0) return

    try {
      const csvContent = [
        "Timestamp,ECG Value,Heart Rate,Risk Level,Auto-Saved",
        ...ecgData
          .slice(-10)
          .map(
            (row) =>
              `${row.timestamp},${row.value},${heartRate || "--"},${mlPrediction?.riskLevel || "unknown"},${new Date().toISOString()}`,
          ),
      ].join("\n")

      localStorage.setItem(`ecg_autosave_${Date.now()}`, csvContent)
      setLastSaveTime(new Date())

      console.log("[v0] Auto-saved ECG data to local storage")
    } catch (error) {
      console.error("[v0] Auto-save error:", error)
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ECG Monitoring</h1>
          <p className="text-muted-foreground">
            Real-time electrocardiogram monitoring with ML-powered health predictions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={
              connectionStatus === "connected" ? "default" : connectionStatus === "connecting" ? "secondary" : "outline"
            }
          >
            {connectionStatus === "connected" && "🟢"}
            {connectionStatus === "connecting" && "🟡"}
            {connectionStatus === "disconnected" && "🔴"}
            {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
          </Badge>
          {!isMonitoring ? (
            <Button onClick={startMonitoring}>
              <Play className="mr-2 h-4 w-4" />
              Start Monitoring
            </Button>
          ) : (
            <Button variant="outline" onClick={stopMonitoring}>
              <Pause className="mr-2 h-4 w-4" />
              Stop Monitoring
            </Button>
          )}
        </div>
      </div>

      {mlPrediction && (
        <Card
          className={`border-l-4 ${
            mlPrediction.riskLevel === "critical"
              ? "border-l-red-500 bg-red-50 dark:bg-red-950/20"
              : mlPrediction.riskLevel === "high"
                ? "border-l-orange-500 bg-orange-50 dark:bg-orange-950/20"
                : mlPrediction.riskLevel === "medium"
                  ? "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                  : "border-l-green-500 bg-green-50 dark:bg-green-950/20"
          }`}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              ML Health Prediction
              <Badge variant={mlPrediction.riskLevel === "low" ? "default" : "destructive"}>
                {mlPrediction.riskLevel.toUpperCase()}
              </Badge>
            </CardTitle>
            <CardDescription>
              Confidence: {(mlPrediction.confidence * 100).toFixed(1)}% | ECG Variance:{" "}
              {mlPrediction.ecgVariance.toFixed(4)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h4 className="font-medium">Recommendations:</h4>
              <ul className="list-disc list-inside space-y-1">
                {mlPrediction.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {alerts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="h-5 w-5" />
              Health Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-yellow-800 dark:text-yellow-200">{alert}</span>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={clearAlerts} className="mt-2 bg-transparent">
                Clear Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Current Heart Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{heartRate ? `${heartRate} BPM` : "--"}</div>
            <p className="text-xs text-muted-foreground">
              {isMonitoring ? "Live from ECG" : "Start monitoring to see live data"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Data Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ecgData.length}</div>
            <p className="text-xs text-muted-foreground">ECG readings collected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mlPrediction?.riskLevel.toUpperCase() || "UNKNOWN"}</div>
            <p className="text-xs text-muted-foreground">
              {mlPrediction
                ? `${(mlPrediction.confidence * 100).toFixed(0)}% confidence`
                : "Start monitoring for ML analysis"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Auto-Save</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{autoSaveEnabled ? "ON" : "OFF"}</div>
            <p className="text-xs text-muted-foreground">
              {lastSaveTime ? `Last: ${lastSaveTime.toLocaleTimeString()}` : "No saves yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Real-time ECG Waveform with ML Analysis
            </CardTitle>
            <CardDescription>Live electrocardiogram data with intelligent health predictions</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
              className="whitespace-nowrap"
            >
              {autoSaveEnabled ? "Disable" : "Enable"} Auto-Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportData}
              disabled={ecgData.length === 0}
              className="whitespace-nowrap bg-transparent"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ecgData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                <YAxis domain={[-1, 1]} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(3)}`, "ECG Value"]}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0891b2"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {!isMonitoring && ecgData.length === 0 && (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No ECG data available</p>
              <p className="text-sm text-muted-foreground">Start monitoring to see real-time ECG waveforms</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
