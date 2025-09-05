import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"

interface HealthMetricCardProps {
  title: string
  value: string
  unit?: string
  change?: string
  status?: "normal" | "warning" | "critical"
  icon: LucideIcon
  description?: string
}

export function HealthMetricCard({
  title,
  value,
  unit,
  change,
  status = "normal",
  icon: Icon,
  description,
}: HealthMetricCardProps) {
  const statusColors = {
    normal: "bg-accent text-accent-foreground",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    critical: "bg-destructive text-destructive-foreground",
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
        </div>
        <div className="flex items-center justify-between mt-2">
          {change && <p className="text-xs text-muted-foreground">{change}</p>}
          <Badge className={statusColors[status]} variant="secondary">
            {status}
          </Badge>
        </div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}
