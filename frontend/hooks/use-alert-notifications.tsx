"use client"

import { useEffect, useRef } from 'react'
import { useAlerts } from '@/hooks/use-alerts'
import { toast } from 'sonner'
import { AlertCircle, AlertTriangle } from 'lucide-react'

/**
 * Hook to show toast notifications for new alerts
 * Only shows alerts that haven't been shown before
 */
export function useAlertNotifications() {
  const { alerts } = useAlerts()
  const shownAlertIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    // Only show alerts from the last 5 minutes (to catch alerts that might be slightly delayed)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const recentAlerts = alerts.filter(alert => 
      new Date(alert.timestamp) >= new Date(fiveMinutesAgo) &&
      !shownAlertIds.current.has(alert.alert_id) &&
      !alert.resolved
    )

    // Show toast for each new recent alert
    recentAlerts.forEach((alert) => {
      // Only add to shown set if we're going to show it
      shownAlertIds.current.add(alert.alert_id)

      if (alert.alert_type === 'accident') {
        toast.error(
          `🚨 ACCIDENT DETECTED`,
          {
            description: `Vehicle ${alert.vehicle_id} detected an accident at ${alert.latitude.toFixed(4)}, ${alert.longitude.toFixed(4)}`,
            duration: 10000,
            icon: <AlertCircle className="h-5 w-5 text-red-500" />,
            action: {
              label: 'View',
              onClick: () => {
                // Could navigate to alert details
                console.log('View accident:', alert)
              },
            },
          }
        )
      } else if (alert.alert_type === 'overspeeding') {
        toast.warning(
          `⚠️ OVER-SPEEDING`,
          {
            description: `Vehicle ${alert.vehicle_id} is speeding at ${alert.speed_at_alert} km/h (Limit: 60 km/h)`,
            duration: 6000,
            icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
          }
        )
      }
    })
  }, [alerts])
}

