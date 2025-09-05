import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Baby, Heart, Thermometer, Activity, AlertTriangle, Play, Pause, Settings } from "lucide-react"

interface BabyMonitorCardProps {
  session: {
    id: string
    session_name: string
    is_active: boolean
    monitoring_frequency_seconds: number
    alert_thresholds: {
      heart_rate_min: number
      heart_rate_max: number
      temperature_min: number
      temperature_max: number
      breathing_rate_min: number
      breathing_rate_max: number
    }
    started_at: string
  }
  baby: {
    id: string
    full_name: string
  }
  currentVitals?: {
    heart_rate: number
    temperature: number
    breathing_rate: number
    last_updated: string
  }
  alertCount?: number
}

export function BabyMonitorCard({ session, baby, currentVitals, alertCount = 0 }: BabyMonitorCardProps) {
  const getVitalStatus = (value: number, min: number, max: number) => {
    if (value < min || value > max) return "critical"
    if (value <= min + (max - min) * 0.1 || value >= max - (max - min) * 0.1) return "warning"
    return "normal"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-destructive text-destructive-foreground"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-accent text-accent-foreground"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card className={session.is_active ? "border-primary" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="bg-pink-100 dark:bg-pink-900">
              <AvatarFallback className="text-pink-600 dark:text-pink-300">
                <Baby className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{baby.full_name}</CardTitle>
              <CardDescription>{session.session_name}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {alertCount > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {alertCount}
              </Badge>
            )}
            <Badge variant={session.is_active ? "default" : "secondary"}>
              {session.is_active ? "Active" : "Paused"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Monitoring Frequency */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Monitoring Frequency</span>
          <span className="font-medium">Every {session.monitoring_frequency_seconds}s</span>
        </div>

        {/* Current Vitals */}
        {currentVitals && (
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="text-center p-2 border rounded">
              <Heart className="h-4 w-4 mx-auto mb-1 text-red-500" />
              <div className="font-medium">{currentVitals.heart_rate}</div>
              <div className="text-xs text-muted-foreground">BPM</div>
              <Badge
                className={`text-xs mt-1 ${getStatusColor(
                  getVitalStatus(
                    currentVitals.heart_rate,
                    session.alert_thresholds.heart_rate_min,
                    session.alert_thresholds.heart_rate_max,
                  ),
                )}`}
                variant="secondary"
              >
                {getVitalStatus(
                  currentVitals.heart_rate,
                  session.alert_thresholds.heart_rate_min,
                  session.alert_thresholds.heart_rate_max,
                )}
              </Badge>
            </div>

            <div className="text-center p-2 border rounded">
              <Thermometer className="h-4 w-4 mx-auto mb-1 text-blue-500" />
              <div className="font-medium">{currentVitals.temperature}°F</div>
              <div className="text-xs text-muted-foreground">Temp</div>
              <Badge
                className={`text-xs mt-1 ${getStatusColor(
                  getVitalStatus(
                    currentVitals.temperature,
                    session.alert_thresholds.temperature_min,
                    session.alert_thresholds.temperature_max,
                  ),
                )}`}
                variant="secondary"
              >
                {getVitalStatus(
                  currentVitals.temperature,
                  session.alert_thresholds.temperature_min,
                  session.alert_thresholds.temperature_max,
                )}
              </Badge>
            </div>

            <div className="text-center p-2 border rounded">
              <Activity className="h-4 w-4 mx-auto mb-1 text-green-500" />
              <div className="font-medium">{currentVitals.breathing_rate}</div>
              <div className="text-xs text-muted-foreground">BrPM</div>
              <Badge
                className={`text-xs mt-1 ${getStatusColor(
                  getVitalStatus(
                    currentVitals.breathing_rate,
                    session.alert_thresholds.breathing_rate_min,
                    session.alert_thresholds.breathing_rate_max,
                  ),
                )}`}
                variant="secondary"
              >
                {getVitalStatus(
                  currentVitals.breathing_rate,
                  session.alert_thresholds.breathing_rate_min,
                  session.alert_thresholds.breathing_rate_max,
                )}
              </Badge>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button size="sm" variant={session.is_active ? "secondary" : "default"} className="flex-1">
            {session.is_active ? (
              <>
                <Pause className="mr-2 h-3 w-3" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-3 w-3" />
                Start
              </>
            )}
          </Button>
          <Button size="sm" variant="outline">
            <Settings className="mr-2 h-3 w-3" />
            Settings
          </Button>
        </div>

        {/* Last Update */}
        {currentVitals && (
          <div className="text-xs text-muted-foreground text-center">
            Last updated: {new Date(currentVitals.last_updated).toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
