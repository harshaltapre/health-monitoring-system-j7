import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Activity, AlertTriangle, Eye } from "lucide-react"
import Link from "next/link"

interface PatientCardProps {
  patient: {
    id: string
    full_name: string
    email: string
    role: string
    created_at: string
  }
  relationship?: {
    relationship_type: string
  }
  latestMetrics?: {
    heart_rate?: number
    blood_pressure?: string
    temperature?: number
    status?: "normal" | "warning" | "critical"
  }
  alertCount?: number
}

export function PatientCard({ patient, relationship, latestMetrics, alertCount = 0 }: PatientCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "critical":
        return "bg-destructive text-destructive-foreground"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-accent text-accent-foreground"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>{getInitials(patient.full_name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{patient.full_name}</CardTitle>
              <CardDescription className="capitalize">
                {relationship?.relationship_type?.replace("_", " ") || "Patient"}
              </CardDescription>
            </div>
          </div>
          {alertCount > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {alertCount}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {latestMetrics && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Heart Rate</span>
              <span className="font-medium">{latestMetrics.heart_rate || "--"} BPM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Blood Pressure</span>
              <span className="font-medium">{latestMetrics.blood_pressure || "--"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Temperature</span>
              <span className="font-medium">{latestMetrics.temperature || "--"}°F</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge className={getStatusColor(latestMetrics.status)} variant="secondary">
                {latestMetrics.status || "normal"}
              </Badge>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button size="sm" className="flex-1" asChild>
            <Link href={`/caretaker/patients/${patient.id}`}>
              <Eye className="mr-2 h-3 w-3" />
              View Details
            </Link>
          </Button>
          <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
            <Link href={`/caretaker/patients/${patient.id}/metrics`}>
              <Activity className="mr-2 h-3 w-3" />
              Metrics
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
