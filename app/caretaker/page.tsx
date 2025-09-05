import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PatientCard } from "@/components/patient-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, AlertTriangle, Heart, Activity, Plus } from "lucide-react"

export default async function CaretakerDashboard() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get caretaker profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get patients under this caretaker's care
  const { data: patientRelationships } = await supabase
    .from("caretaker_patients")
    .select(`
      *,
      patient:profiles!caretaker_patients_patient_id_fkey(*)
    `)
    .eq("caretaker_id", data.user.id)

  // Get recent alerts for all patients
  const patientIds = patientRelationships?.map((rel) => rel.patient_id) || []
  const { data: alerts } = await supabase
    .from("health_alerts")
    .select("*")
    .in("user_id", patientIds)
    .eq("is_read", false)
    .order("created_at", { ascending: false })

  // Mock recent metrics data
  const mockMetrics = {
    heart_rate: 72,
    blood_pressure: "120/80",
    temperature: 98.6,
    status: "normal" as const,
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Welcome back, {profile?.full_name}</h1>
          <p className="text-muted-foreground">Monitor and care for your patients' health</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patientRelationships?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active patients under care</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Unread notifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Heart Rate</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">74 BPM</div>
            <p className="text-xs text-muted-foreground">Across all patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Measurements Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">New readings recorded</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      {alerts && alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Recent Alerts
            </CardTitle>
            <CardDescription>Important notifications from your patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{alert.title}</h4>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{new Date(alert.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        alert.severity === "critical"
                          ? "bg-destructive text-destructive-foreground"
                          : alert.severity === "high"
                            ? "bg-orange-100 text-orange-800"
                            : alert.severity === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patient Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">My Patients</h2>
          <Button variant="outline" size="sm" asChild>
            <a href="/caretaker/patients">View All</a>
          </Button>
        </div>

        {patientRelationships && patientRelationships.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {patientRelationships.slice(0, 6).map((relationship) => (
              <PatientCard
                key={relationship.id}
                patient={relationship.patient}
                relationship={relationship}
                latestMetrics={mockMetrics}
                alertCount={alerts?.filter((alert) => alert.user_id === relationship.patient_id).length || 0}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Patients Yet</h3>
              <p className="text-muted-foreground mb-4">Start by adding patients to monitor their health</p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Patient
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
