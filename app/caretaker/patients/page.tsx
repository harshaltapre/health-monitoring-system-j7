import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PatientCard } from "@/components/patient-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Users } from "lucide-react"

export default async function PatientsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get all patients under this caretaker's care
  const { data: patientRelationships } = await supabase
    .from("caretaker_patients")
    .select(`
      *,
      patient:profiles!caretaker_patients_patient_id_fkey(*)
    `)
    .eq("caretaker_id", data.user.id)
    .order("created_at", { ascending: false })

  // Get alerts count for each patient
  const patientIds = patientRelationships?.map((rel) => rel.patient_id) || []
  const { data: alerts } = await supabase
    .from("health_alerts")
    .select("user_id")
    .in("user_id", patientIds)
    .eq("is_read", false)

  // Mock metrics for demonstration
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
          <h1 className="text-3xl font-bold">My Patients</h1>
          <p className="text-muted-foreground">Manage and monitor all patients under your care</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Management</CardTitle>
          <CardDescription>Search and filter your patients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search patients by name..." className="pl-10" />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Patients Grid */}
      {patientRelationships && patientRelationships.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {patientRelationships.map((relationship) => {
            const alertCount = alerts?.filter((alert) => alert.user_id === relationship.patient_id).length || 0
            return (
              <PatientCard
                key={relationship.id}
                patient={relationship.patient}
                relationship={relationship}
                latestMetrics={mockMetrics}
                alertCount={alertCount}
              />
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Patients Added</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You haven't added any patients yet. Start by adding patients to monitor their health and provide care.
            </p>
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Patient
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      {patientRelationships && patientRelationships.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patientRelationships.length}</div>
              <p className="text-xs text-muted-foreground">Under your care</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alerts?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Requiring attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Relationship Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {Array.from(new Set(patientRelationships.map((r) => r.relationship_type))).map((type) => (
                  <div key={type} className="flex justify-between text-sm">
                    <span className="capitalize">{type.replace("_", " ")}</span>
                    <span>{patientRelationships.filter((r) => r.relationship_type === type).length}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
