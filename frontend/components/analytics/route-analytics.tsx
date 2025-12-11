"use client"

import { useVehicles } from "@/hooks/use-vehicles"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { motion } from "framer-motion"
import { Route } from "lucide-react"
import { useMemo } from "react"

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4']

export function RouteAnalytics() {
  const { vehicles } = useVehicles()

  const routeData = useMemo(() => {
    const routeMap = new Map<string, number>()
    
    vehicles.forEach(vehicle => {
      if (vehicle.route_name) {
        const count = routeMap.get(vehicle.route_name) || 0
        routeMap.set(vehicle.route_name, count + 1)
      }
    })

    return Array.from(routeMap.entries())
      .map(([name, value], index) => ({
        name: name.length > 20 ? name.substring(0, 20) + '...' : name,
        value,
        fullName: name,
        color: COLORS[index % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value)
  }, [vehicles])

  const totalRoutes = routeData.length
  const totalVehicles = vehicles.length

  return (
    <Card className="border-2 shadow-lg bg-card/95 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Route className="h-5 w-5 text-primary" />
              Route Distribution
            </CardTitle>
            <CardDescription className="mt-1">
              Vehicle distribution across active routes
            </CardDescription>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
            <span className="text-sm font-semibold text-primary">{totalRoutes} Routes</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {routeData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={routeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => 
                  `${name}: ${(percent ?? 0 * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {routeData.map((entry, index) => (
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
                formatter={(value: number) => [`${value} vehicles`, 'Count']}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value: string) => {
                  const fullName = routeData.find(r => r.name === value)?.fullName || value
                  return fullName.length > 25 ? fullName.substring(0, 25) + '...' : fullName
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <div className="text-center">
              <Route className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No route data available</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

