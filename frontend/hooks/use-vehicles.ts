"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Vehicle {
  vehicle_id: string
  latitude: number
  longitude: number
  speed: number
  status: 'normal' | 'overspeeding' | 'accident'
  timestamp: string
  route_name?: string | null
  created_at: string
  updated_at: string
  // Vehicle details (optional)
  vehicle_name?: string | null
  vehicle_number?: string | null
  registration_number?: string | null
  owner_name?: string | null
  tracking_enabled?: boolean | null
  notes?: string | null
}

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch initial vehicles
    const fetchVehicles = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .order('timestamp', { ascending: false })

        if (error) throw error
        // Sort by timestamp (most recent first)
        const sortedData = (data || []).sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        setVehicles(sortedData)
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchVehicles()

    // Subscribe to real-time changes
    const channel = supabase
      .channel('vehicles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vehicles',
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setVehicles((prev) => {
              const existingIndex = prev.findIndex(v => v.vehicle_id === payload.new.vehicle_id)
              const newVehicle = payload.new as Vehicle
              
              if (existingIndex >= 0) {
                // Update existing vehicle - create new array to trigger re-render
                const updated = prev.map((v, idx) => 
                  idx === existingIndex ? newVehicle : v
                )
                // Sort by timestamp to keep most recent at top
                return updated.sort((a, b) => 
                  new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                )
              } else {
                // Add new vehicle
                const newList = [newVehicle, ...prev]
                // Sort by timestamp
                return newList.sort((a, b) => 
                  new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                )
              }
            })
          } else if (payload.eventType === 'DELETE') {
            setVehicles((prev) => prev.filter(v => v.vehicle_id !== payload.old.vehicle_id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { vehicles, loading, error }
}

