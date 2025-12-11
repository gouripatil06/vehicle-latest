"use client"

import { useAlerts } from "@/hooks/use-alerts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"
import { motion } from "framer-motion"

const COLORS = ['#10b981', '#f59e0b', '#ef4444']

export function AlertChart() {
  const { alerts } = useAlerts()

  // Count alerts by type
  const alertCounts = {
    overspeeding: alerts.filter(a => a.alert_type === 'overspeeding').length,
    accident: alerts.filter(a => a.alert_type === 'accident').length,
  }

  const chartData = [
    { name: 'Overspeeding', value: alertCounts.overspeeding, color: '#f59e0b' },
    { name: 'Accidents', value: alertCounts.accident, color: '#ef4444' },
  ]

  const barData = [
    { name: 'Overspeeding', alerts: alertCounts.overspeeding },
    { name: 'Accidents', alerts: alertCounts.accident },
  ]

  return (
    <Card className="border-2 shadow-lg bg-card/95 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Alert Overview</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Distribution of alerts by type
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
            <span className="text-xs font-semibold text-red-600">
              Total: {alerts.length} Alerts
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Alert Count</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
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
                />
                <Bar dataKey="alerts" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Alert Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent ?? 0 * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

