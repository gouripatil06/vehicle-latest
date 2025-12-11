"use client"

import { useVehicles } from "@/hooks/use-vehicles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { motion } from "framer-motion"

interface SpeedChartProps {
  vehicleId?: string
  height?: number
}

export function SpeedChart({ vehicleId, height = 300 }: SpeedChartProps) {
  const { vehicles } = useVehicles()

  // Get vehicle or all vehicles
  const vehicle = vehicleId
    ? vehicles.find(v => v.vehicle_id === vehicleId)
    : null

  // Prepare chart data (simplified - showing current speeds)
  const chartData = vehicle
    ? [{
        name: (vehicle as any).vehicle_name || (vehicle as any).vehicle_number || vehicle.vehicle_id,
        speed: vehicle.speed,
        limit: 60, // Speed limit
        vehicleId: vehicle.vehicle_id,
      }]
    : vehicles.map(v => ({
        name: (v as any).vehicle_name || (v as any).vehicle_number || v.vehicle_id,
        speed: v.speed,
        limit: 60,
        vehicleId: v.vehicle_id,
      })).slice(0, 10)

  return (
    <Card className="border-2 shadow-lg bg-card/95 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Speed Monitoring</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Current speed across all vehicles
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <span className="text-xs font-semibold text-yellow-600">Limit: 60 km/h</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              label={{ value: 'Speed (km/h)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
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
            <ReferenceLine
              y={60}
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{ value: 'Speed Limit', position: 'right', fill: '#f59e0b', fontSize: 12 }}
            />
            <Line
              type="monotone"
              dataKey="speed"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ r: 5, fill: 'hsl(var(--primary))' }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

