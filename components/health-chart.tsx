"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface HealthChartProps {
  title: string
  description?: string
  data: Array<{
    date: string
    value: number
  }>
  color?: string
  unit?: string
}

export function HealthChart({ title, description, data, color = "#0891b2", unit }: HealthChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value}${unit ? ` ${unit}` : ""}`, title]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ fill: color }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
