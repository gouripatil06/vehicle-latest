"use client"

import { useVehicles } from "@/hooks/use-vehicles"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts"
import { motion } from "framer-motion"
import { Gauge } from "lucide-react"
import { useMemo } from "react"

export function SpeedDistribution() {
  const { vehicles } = useVehicles()

  // Categorize speeds into bins
  const speedData = useMemo(() => {
    const bins = [
      { range: '0-20', min: 0, max: 20, count: 0 },
      { range: '21-40', min: 21, max: 40, count: 0 },
      { range: '41-60', min: 41, max: 60, count: 0 },
      { range: '61-80', min: 61, max: 80, count: 0 },
      { range: '81+', min: 81, max: 200, count: 0 },
    ]

    vehicles.forEach(vehicle => {
      const speed = vehicle.speed
      const bin = bins.find(b => speed >= b.min && speed <= b.max)
      if (bin) bin.count++
    })

    return bins.map(bin => ({
      range: bin.range,
      vehicles: bin.count,
      color: bin.max <= 60 ? '#10b981' : bin.max <= 80 ? '#f59e0b' : '#ef4444'
    }))
  }, [vehicles])

  const avgSpeed = vehicles.length > 0
    ? Math.round(vehicles.reduce((sum, v) => sum + v.speed, 0) / vehicles.length)
    : 0

  return (
    <Card className="border-2 shadow-lg bg-card/95 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Gauge className="h-5 w-5 text-primary" />
              Speed Distribution
            </CardTitle>
            <CardDescription className="mt-1">
              Vehicle speed distribution across speed ranges
            </CardDescription>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
            <span className="text-sm font-semibold text-primary">Avg: {avgSpeed} km/h</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={speedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
            <XAxis 
              dataKey="range" 
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
            <ReferenceLine
              x="41-60"
              stroke="#f59e0b"
              strokeDasharray="5 5"
              label={{ value: 'Speed Limit', position: 'top' }}
            />
            <Bar dataKey="vehicles" radius={[8, 8, 0, 0]}>
              {speedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

