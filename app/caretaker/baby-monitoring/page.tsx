import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BabyMonitorCard } from "@/components/baby-monitor-card"
import { BabyVitalChart } from "@/components/baby-vital-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Baby, Plus, AlertTriangle, Heart, Activity, Thermometer } from "lucide-react"

// Mock data for baby monitoring
const mockBabyVitals = {
  heart_rate: 125,
  temperature: 98.2,
  breathing_rate: 45,
  last_updated: new Date().toISOString(),
}

const mockHeartRateData = [
  { time: "10:00", value: 120 },
  { time: "10:05", value: 125 },
  { time: "10:10", value: 118 },
  { time: "10:15", value: 122 },
  { time: "10:20", value: 125 },
  { time: "10:25", value: 119 },
  { time: "10:30", value: 123 },
]

const mockTemperatureData = [
  { time: "10:00", value: 98.1 },
  { time: "10:05", value: 98.2 },
  { time: "10:10", value: 98.0 },
  { time: "10:15", value: 98.3 },
  { time: "10:20", value: 98.2 },
  { time: "10:25", value: 98.1 },
  { time: "10:30", value: 98.2 },
]

const mockBreathingData = [
  { time: "10:00", value: 42 },
  { time: "10:05", value: 45 },
  { time: "10:10", value: 40 },
  { time: "10:15", value: 44 },
  { time: "10:20", value: 45 },
  { time: "10:25", value: 41 },
  { time: "10:30", value: 43 },
]

export default async function BabyMonitoringPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get baby monitoring sessions for this caretaker
  const { data: monitoringSessions } = await supabase
    .from("baby_monitoring_sessions")
    .select(`
      *,
      baby:profiles!baby_monitoring_sessions_baby_id_fkey(*)
    `)
    .eq("caretaker_id", data.user.id)
    .order("created_at", { ascending: false })

  // Get alerts for baby monitoring
  const babyIds = monitoringSessions?.map((session) => session.baby_id) || []
  const { data: babyAlerts } = await supabase
    .from("health_alerts")
    .select("*")
    .in("user_id", babyIds)
    .eq("alert_type", "baby_vitals_alert")
    .eq("is_read", false)

  const activeSessions = monitoringSessions?.filter((session) => session.is_active) || []

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Baby Monitoring</h1>
          <p className="text-muted-foreground">Gentle monitoring with specialized thresholds for infant care</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Monitoring Session
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Baby className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSessions.length}</div>
            <p className="text-xs text-muted-foreground">Currently monitoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Baby Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{babyAlerts?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Heart Rate</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">122 BPM</div>
            <p className="text-xs text-muted-foreground">Within safe range</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monitoring Time</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2h</div>
            <p className="text-xs text-muted-foreground">Today's total</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Monitoring Sessions */}
      {monitoringSessions && monitoringSessions.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Monitoring Sessions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {monitoringSessions.map((session) => (
              <BabyMonitorCard
                key={session.id}
                session={session}
                baby={session.baby}
                currentVitals={mockBabyVitals}
                alertCount={babyAlerts?.filter((alert) => alert.user_id === session.baby_id).length || 0}
              />
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Baby className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Baby Monitoring Sessions</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start monitoring a baby's vital signs with our gentle, specialized monitoring system designed for infant
              care.
            </p>
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Create First Monitoring Session
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Real-time Charts for Active Sessions */}
      {activeSessions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Real-time Vital Signs</h2>
          <div className="grid gap-6">
            <BabyVitalChart
              title="Heart Rate Monitoring"
              description="Gentle heart rate tracking with baby-safe thresholds"
              data={mockHeartRateData}
              color="#ef4444"
              unit="BPM"
              thresholds={{ min: 100, max: 160 }}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <BabyVitalChart
                title="Temperature Monitoring"
                description="Continuous temperature tracking"
                data={mockTemperatureData}
                color="#3b82f6"
                unit="°F"
                thresholds={{ min: 96.8, max: 99.5 }}
              />

              <BabyVitalChart
                title="Breathing Rate"
                description="Respiratory monitoring"
                data={mockBreathingData}
                color="#10b981"
                unit="BrPM"
                thresholds={{ min: 30, max: 60 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Baby-Specific Alerts */}
      {babyAlerts && babyAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Baby Health Alerts
            </CardTitle>
            <CardDescription>Important notifications requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {babyAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-red-50 dark:bg-red-950/20"
                >
                  <div>
                    <h4 className="font-medium text-destructive">{alert.title}</h4>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{new Date(alert.created_at).toLocaleString()}</p>
                  </div>
                  <Badge variant="destructive">{alert.severity}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monitoring Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Baby Monitoring Guidelines</CardTitle>
          <CardDescription>Safe monitoring practices for infant care</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <Heart className="h-8 w-8 mb-2 text-red-500" />
              <h3 className="font-semibold mb-2">Heart Rate</h3>
              <p className="text-sm text-muted-foreground mb-2">Safe Range: 100-160 BPM</p>
              <p className="text-xs text-muted-foreground">
                Gentle monitoring every 30 seconds with immediate alerts for values outside safe range.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <Thermometer className="h-8 w-8 mb-2 text-blue-500" />
              <h3 className="font-semibold mb-2">Temperature</h3>
              <p className="text-sm text-muted-foreground mb-2">Safe Range: 96.8-99.5°F</p>
              <p className="text-xs text-muted-foreground">
                Non-invasive temperature monitoring with alerts for fever or hypothermia.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <Activity className="h-8 w-8 mb-2 text-green-500" />
              <h3 className="font-semibold mb-2">Breathing</h3>
              <p className="text-sm text-muted-foreground mb-2">Safe Range: 30-60 BrPM</p>
              <p className="text-xs text-muted-foreground">
                Gentle respiratory monitoring with immediate alerts for irregular patterns.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
