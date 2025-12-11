"use client"

import { useVehicles } from "@/hooks/use-vehicles"
import { useAlerts } from "@/hooks/use-alerts"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Car, AlertTriangle, TrendingUp, Activity } from "lucide-react"
import { useMemo } from "react"

export function DashboardStatsCards() {
  const { vehicles } = useVehicles()
  const { alerts } = useAlerts()

  const stats = useMemo(() => {
    const totalVehicles = vehicles.length
    const activeAlerts = alerts.filter(a => !a.resolved).length
    const overspeedingCount = vehicles.filter(v => v.status === 'overspeeding').length
    const accidentsCount = vehicles.filter(v => v.status === 'accident').length
    
    return [
      {
        title: "Total Vehicles",
        value: totalVehicles,
        icon: Car,
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-500/20",
        borderColor: "border-blue-500/30",
      },
      {
        title: "Active Alerts",
        value: activeAlerts,
        icon: AlertTriangle,
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-500/20",
        borderColor: "border-yellow-500/30",
      },
      {
        title: "Overspeeding",
        value: overspeedingCount,
        icon: TrendingUp,
        color: "text-orange-600 dark:text-orange-400",
        bgColor: "bg-orange-500/20",
        borderColor: "border-orange-500/30",
      },
      {
        title: "Accidents",
        value: accidentsCount,
        icon: Activity,
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-500/20",
        borderColor: "border-red-500/30",
      },
    ]
  }, [vehicles, alerts])

  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={`${stat.title}-${stat.value}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className="h-full"
          >
            <Card className={`relative overflow-hidden border ${stat.borderColor} ${stat.bgColor}/50 hover:shadow-md transition-all duration-200`}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg ${stat.bgColor} border ${stat.borderColor}`}>
                    <Icon className={`h-3.5 w-3.5 ${stat.color}`} />
                  </div>
                  <motion.span
                    key={`${stat.title}-value-${stat.value}`}
                    initial={{ scale: 1.1, color: stat.color }}
                    animate={{ scale: 1, color: stat.color }}
                    transition={{ duration: 0.2 }}
                    className={`text-xl font-bold ${stat.color}`}
                  >
                    {stat.value}
                  </motion.span>
                </div>
                <p className="text-xs font-medium text-foreground/80 leading-tight">
                  {stat.title}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

