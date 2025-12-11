"use client"

import { useVehicles } from "@/hooks/use-vehicles"
import { useAlerts } from "@/hooks/use-alerts"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Car, AlertTriangle, TrendingUp, Activity, ArrowUp, ArrowDown } from "lucide-react"
import { useMemo } from "react"

export function StatsCards() {
  const { vehicles } = useVehicles()
  const { alerts } = useAlerts()

  const stats = useMemo(() => {
    const totalVehicles = vehicles.length
    const activeAlerts = alerts.filter(a => !a.resolved).length
    const overspeedingCount = vehicles.filter(v => v.status === 'overspeeding').length
    const accidentsCount = vehicles.filter(v => v.status === 'accident').length
    const normalCount = vehicles.filter(v => v.status === 'normal').length
    
    return [
      {
        title: "Total Vehicles",
        value: totalVehicles,
        icon: Car,
        gradient: "from-blue-500 to-blue-600",
        bgGradient: "from-blue-500/10 to-blue-600/5",
        iconBg: "bg-blue-500/20",
        iconColor: "text-blue-600 dark:text-blue-400",
        borderColor: "border-blue-500/20",
        subtitle: `${normalCount} active`,
        change: null,
      },
      {
        title: "Active Alerts",
        value: activeAlerts,
        icon: AlertTriangle,
        gradient: "from-yellow-500 to-yellow-600",
        bgGradient: "from-yellow-500/10 to-yellow-600/5",
        iconBg: "bg-yellow-500/20",
        iconColor: "text-yellow-600 dark:text-yellow-400",
        borderColor: "border-yellow-500/20",
        subtitle: `${alerts.length} total`,
        change: activeAlerts > 0 ? "+" + activeAlerts : null,
      },
      {
        title: "Overspeeding",
        value: overspeedingCount,
        icon: TrendingUp,
        gradient: "from-orange-500 to-orange-600",
        bgGradient: "from-orange-500/10 to-orange-600/5",
        iconBg: "bg-orange-500/20",
        iconColor: "text-orange-600 dark:text-orange-400",
        borderColor: "border-orange-500/20",
        subtitle: totalVehicles > 0 ? `${Math.round((overspeedingCount / totalVehicles) * 100)}% of fleet` : "0%",
        change: overspeedingCount > 0 ? "+" + overspeedingCount : null,
      },
      {
        title: "Accidents",
        value: accidentsCount,
        icon: Activity,
        gradient: "from-red-500 to-red-600",
        bgGradient: "from-red-500/10 to-red-600/5",
        iconBg: "bg-red-500/20",
        iconColor: "text-red-600 dark:text-red-400",
        borderColor: "border-red-500/20",
        subtitle: "Requires attention",
        change: accidentsCount > 0 ? "+" + accidentsCount : null,
      },
    ]
  }, [vehicles, alerts])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="h-full"
          >
            <Card className={`relative overflow-hidden border-2 ${stat.borderColor} bg-gradient-to-br ${stat.bgGradient} hover:shadow-lg transition-all duration-300`}>
              {/* Gradient Accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 blur-2xl`} />
              
              <CardContent className="p-5 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${stat.iconBg} border ${stat.borderColor}`}>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                  {stat.change && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm border ${stat.borderColor}`}
                    >
                      <ArrowUp className={`h-3 w-3 ${stat.iconColor}`} />
                      <span className={`text-xs font-semibold ${stat.iconColor}`}>
                        {stat.change}
                      </span>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <motion.span
                      key={stat.value}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                    >
                      {stat.value}
                    </motion.span>
                  </div>
                  
                  <p className="text-sm font-semibold text-foreground/90">
                    {stat.title}
                  </p>
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.subtitle}
                  </p>
                </div>

                {/* Progress Bar (for vehicles) */}
                {stat.title === "Total Vehicles" && vehicles.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium">100% Active</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full bg-gradient-to-r ${stat.gradient}`}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
