import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { HealthMetricCard } from "@/components/health-metric-card"
import { HealthChart } from "@/components/health-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Activity, Thermometer, Droplets, Plus } from "lucide-react"

// Mock data for demonstration
const mockHealthData = [
  { date: "Jan 1", value: 72 },
  { date: "Jan 2", value: 75 },
  { date: "Jan 3", value: 68 },
  { date: "Jan 4", value: 71 },
  { date: "Jan 5", value: 73 },
  { date: "Jan 6", value: 70 },
  { date: "Jan 7", value: 72 },
]

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  console.log(
    "[v0] User authenticated:",
    data.user.email,
    "Email verified:",
    data.user.email_confirmed_at ? "Yes" : "No",
  )

  // Get user profile to determine role
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  if (profile?.role === "caretaker") {
    redirect("/caretaker")
  }

  // Get recent health metrics (mock data for now)
  const { data: recentMetrics } = await supabase
    .from("health_metrics")
    .select("*")
    .eq("user_id", data.user.id)
    .order("recorded_at", { ascending: false })
    .limit(10)

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Welcome back, {profile?.full_name || "Patient"}</h1>
          <p className="text-muted-foreground">Here's your health overview for today</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Record Measurement
        </Button>
      </div>

      {/* Health Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <HealthMetricCard
          title="Heart Rate"
          value="72"
          unit="BPM"
          change="+2% from yesterday"
          status="normal"
          icon={Heart}
          description="Resting heart rate"
        />
        <HealthMetricCard
          title="Blood Pressure"
          value="120/80"
          unit="mmHg"
          change="Stable"
          status="normal"
          icon={Activity}
          description="Systolic/Diastolic"
        />
        <HealthMetricCard
          title="Temperature"
          value="98.6"
          unit="°F"
          change="Normal range"
          status="normal"
          icon={Thermometer}
          description="Body temperature"
        />
        <HealthMetricCard
          title="Oxygen Saturation"
          value="98"
          unit="%"
          change="Excellent"
          status="normal"
          icon={Droplets}
          description="Blood oxygen level"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <HealthChart
          title="Heart Rate Trend"
          description="Your heart rate over the past week"
          data={mockHealthData}
          color="#0891b2"
          unit="BPM"
        />
        <HealthChart
          title="Blood Pressure Trend"
          description="Systolic pressure over the past week"
          data={mockHealthData.map((d) => ({ ...d, value: d.value + 48 }))}
          color="#059669"
          unit="mmHg"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Measurements</CardTitle>
            <CardDescription>Your latest recorded health data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMetrics && recentMetrics.length > 0 ? (
                recentMetrics.slice(0, 5).map((metric) => (
                  <div key={metric.id} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium capitalize">{metric.metric_type.replace("_", " ")}</span>
                      <p className="text-xs text-muted-foreground">
                        {new Date(metric.recorded_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      {metric.value} {metric.unit}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No measurements recorded yet</p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    Record your first measurement
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Insights</CardTitle>
            <CardDescription>Personalized recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-accent/50 rounded-lg">
                <h4 className="text-sm font-medium">Great Progress!</h4>
                <p className="text-xs text-muted-foreground">
                  Your heart rate has been consistently in the healthy range this week.
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h4 className="text-sm font-medium">Stay Hydrated</h4>
                <p className="text-xs text-muted-foreground">
                  Remember to drink water regularly to maintain optimal health.
                </p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <h4 className="text-sm font-medium">Exercise Reminder</h4>
                <p className="text-xs text-muted-foreground">
                  Consider a 30-minute walk today to boost your cardiovascular health.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
