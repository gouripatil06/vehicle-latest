"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Alert {
  alert_id: string
  vehicle_id: string
  alert_type: 'overspeeding' | 'accident'
  latitude: number
  longitude: number
  speed_at_alert: number
  timestamp: string
  severity: 'low' | 'medium' | 'high'
  resolved: boolean
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch recent alerts (only last 1 hour to avoid showing old alerts)
    const fetchAlerts = async () => {
      try {
        const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        
        const { data, error } = await supabase
          .from('alerts')
          .select('*')
          .gte('timestamp', oneHourAgo)
          .order('timestamp', { ascending: false })
          .limit(100)

        if (error) throw error
        setAlerts(data || [])
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchAlerts()

    // Subscribe to real-time changes
    const channel = supabase
      .channel('alerts-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'alerts',
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            setAlerts((prev) => {
              const newAlert = payload.new as Alert
              // Only add if it's recent (within last hour)
              const alertTime = new Date(newAlert.timestamp).getTime()
              const oneHourAgo = Date.now() - 1 * 60 * 60 * 1000
              if (alertTime >= oneHourAgo) {
                return [newAlert, ...prev.filter(a => a.alert_id !== newAlert.alert_id)].slice(0, 100)
              }
              return prev
            })
          } else if (payload.eventType === 'UPDATE') {
            setAlerts((prev) => {
              const updatedAlert = payload.new as Alert
              const existingIndex = prev.findIndex(a => a.alert_id === updatedAlert.alert_id)
              if (existingIndex >= 0) {
                // Update existing alert
                const updated = prev.map((a, idx) => 
                  idx === existingIndex ? updatedAlert : a
                )
                return updated
              } else {
                // New alert that wasn't in our list, add it if recent
                const alertTime = new Date(updatedAlert.timestamp).getTime()
                const oneHourAgo = Date.now() - 1 * 60 * 60 * 1000
                if (alertTime >= oneHourAgo) {
                  return [updatedAlert, ...prev].slice(0, 100)
                }
                return prev
              }
            })
          } else if (payload.eventType === 'DELETE') {
            setAlerts((prev) => prev.filter(a => a.alert_id !== payload.old.alert_id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { alerts, loading, error }
}

