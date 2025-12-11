"use client"

import { useAlerts } from "@/hooks/use-alerts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { motion } from "framer-motion"
import { TrendingUp, AlertTriangle, AlertCircle } from "lucide-react"
import { useMemo } from "react"

export function AlertTrends() {
  const { alerts } = useAlerts()

  // Group alerts by hour for trend analysis
  const trendData = useMemo(() => {
    const now = new Date()
    const hours = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date(now)
      hour.setHours(now.getHours() - (23 - i))
      return hour
    })

    return hours.map(hour => {
      const hourStart = new Date(hour)
      hourStart.setMinutes(0, 0, 0)
      const hourEnd = new Date(hour)
      hourEnd.setMinutes(59, 59, 999)

      const hourAlerts = alerts.filter(alert => {
        const alertTime = new Date(alert.timestamp)
        return alertTime >= hourStart && alertTime <= hourEnd
      })

      return {
        time: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        overspeeding: hourAlerts.filter(a => a.alert_type === 'overspeeding').length,
        accidents: hourAlerts.filter(a => a.alert_type === 'accident').length,
        total: hourAlerts.length,
      }
    }).slice(-12) // Last 12 hours
  }, [alerts])

  const totalOverspeeding = alerts.filter(a => a.alert_type === 'overspeeding').length
  const totalAccidents = alerts.filter(a => a.alert_type === 'accident').length

  return (
    <Card className="border-2 shadow-lg bg-card/95 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Alert Trends Over Time
            </CardTitle>
            <CardDescription className="mt-1">
              Hourly breakdown of alerts for the last 12 hours
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-600">{totalOverspeeding}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-semibold text-red-600">{totalAccidents}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="overspeeding" 
              stroke="#f59e0b" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#f59e0b' }}
              activeDot={{ r: 6 }}
              name="Overspeeding"
            />
            <Line 
              type="monotone" 
              dataKey="accidents" 
              stroke="#ef4444" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#ef4444' }}
              activeDot={{ r: 6 }}
              name="Accidents"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

