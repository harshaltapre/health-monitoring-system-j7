"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

interface BabyVitalChartProps {
  title: string
  description?: string
  data: Array<{
    time: string
    value: number
  }>
  color?: string
  unit?: string
  thresholds: {
    min: number
    max: number
  }
}

export function BabyVitalChart({ title, description, data, color = "#0891b2", unit, thresholds }: BabyVitalChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">Baby Safe Range</span>
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[thresholds.min - 10, thresholds.max + 10]} />
            <Tooltip
              formatter={(value) => [`${value}${unit ? ` ${unit}` : ""}`, title]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            {/* Safe range indicators */}
            <ReferenceLine y={thresholds.min} stroke="#ef4444" strokeDasharray="5 5" label="Min Safe" />
            <ReferenceLine y={thresholds.max} stroke="#ef4444" strokeDasharray="5 5" label="Max Safe" />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-2 text-xs text-muted-foreground">
          Safe range: {thresholds.min} - {thresholds.max} {unit}
        </div>
      </CardContent>
    </Card>
  )
}
