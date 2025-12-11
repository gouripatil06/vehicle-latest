"use client"

import { useAlerts } from "@/hooks/use-alerts"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, X, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function AlertBanner() {
  const { alerts } = useAlerts()
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())
  const [visibleAlerts, setVisibleAlerts] = useState(alerts.slice(0, 3)) // Show max 3

  useEffect(() => {
    // Show only recent, non-dismissed alerts
    const recent = alerts
      .filter(alert => !dismissedAlerts.has(alert.alert_id))
      .filter(alert => !alert.resolved)
      .slice(0, 3)
    
    setVisibleAlerts(recent)
  }, [alerts, dismissedAlerts])

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => new Set(prev).add(alertId))
  }

  const getAlertConfig = (alertType: string) => {
    if (alertType === 'accident') {
      return {
        icon: AlertCircle,
        bgColor: 'bg-red-500/20 border-red-500/50',
        textColor: 'text-red-600 dark:text-red-400',
        title: '🚨 ACCIDENT DETECTED'
      }
    }
    return {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-500/20 border-yellow-500/50',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      title: '⚠️ OVER-SPEEDING'
    }
  }

  if (visibleAlerts.length === 0) return null

  return (
    <div className="fixed top-16 left-0 right-0 z-40 px-4 pt-2 pointer-events-none">
      <AnimatePresence>
        {visibleAlerts.map((alert) => {
          const config = getAlertConfig(alert.alert_type)
          const Icon = config.icon

          return (
            <motion.div
              key={alert.alert_id}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`mb-2 pointer-events-auto ${config.bgColor} border rounded-lg p-3 shadow-lg backdrop-blur-sm`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1">
                  <Icon className={`h-5 w-5 mt-0.5 ${config.textColor}`} />
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold text-sm ${config.textColor} mb-1`}>
                      {config.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Vehicle <span className="font-medium">{alert.vehicle_id}</span>
                      {alert.alert_type === 'overspeeding' && (
                        <> at {alert.speed_at_alert} km/h</>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => dismissAlert(alert.alert_id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

