import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { HealthChart } from "@/components/health-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, TrendingDown } from "lucide-react"

// Mock data for charts
const heartRateData = [
  { date: "Dec 25", value: 72 },
  { date: "Dec 26", value: 75 },
  { date: "Dec 27", value: 68 },
  { date: "Dec 28", value: 71 },
  { date: "Dec 29", value: 73 },
  { date: "Dec 30", value: 70 },
  { date: "Dec 31", value: 72 },
]

const bloodPressureData = [
  { date: "Dec 25", value: 120 },
  { date: "Dec 26", value: 118 },
  { date: "Dec 27", value: 122 },
  { date: "Dec 28", value: 119 },
  { date: "Dec 29", value: 121 },
  { date: "Dec 30", value: 117 },
  { date: "Dec 31", value: 120 },
]

const temperatureData = [
  { date: "Dec 25", value: 98.6 },
  { date: "Dec 26", value: 98.4 },
  { date: "Dec 27", value: 98.7 },
  { date: "Dec 28", value: 98.5 },
  { date: "Dec 29", value: 98.6 },
  { date: "Dec 30", value: 98.3 },
  { date: "Dec 31", value: 98.6 },
]

export default async function MetricsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get all health metrics for the user
  const { data: metrics } = await supabase
    .from("health_metrics")
    .select("*")
    .eq("user_id", data.user.id)
    .order("recorded_at", { ascending: false })

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Health Metrics</h1>
          <p className="text-muted-foreground">Track and analyze your health data over time</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Measurement
        </Button>
      </div>

      {/* Metrics Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Average Heart Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">71 BPM</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
              2% lower than last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Blood Pressure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">119/78</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Optimal
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Temperature Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5°F</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Normal
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6">
        <HealthChart
          title="Heart Rate Trends"
          description="Your heart rate measurements over the past week"
          data={heartRateData}
          color="#0891b2"
          unit="BPM"
        />

        <div className="grid gap-6 md:grid-cols-2">
          <HealthChart
            title="Blood Pressure (Systolic)"
            description="Systolic blood pressure readings"
            data={bloodPressureData}
            color="#059669"
            unit="mmHg"
          />
          <HealthChart
            title="Body Temperature"
            description="Daily temperature measurements"
            data={temperatureData}
            color="#ea580c"
            unit="°F"
          />
        </div>
      </div>

      {/* Recent Measurements Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Measurements</CardTitle>
          <CardDescription>All your health measurements in chronological order</CardDescription>
        </CardHeader>
        <CardContent>
          {metrics && metrics.length > 0 ? (
            <div className="space-y-3">
              {metrics.slice(0, 10).map((metric) => (
                <div key={metric.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium capitalize">{metric.metric_type.replace("_", " ")}</span>
                    <p className="text-sm text-muted-foreground">{new Date(metric.recorded_at).toLocaleString()}</p>
                    {metric.notes && <p className="text-xs text-muted-foreground mt-1">{metric.notes}</p>}
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold">
                      {metric.value} {metric.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No health measurements recorded yet</p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Record Your First Measurement
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
