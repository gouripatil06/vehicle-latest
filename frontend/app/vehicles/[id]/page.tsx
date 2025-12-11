"use client"

import { useState, useEffect } from "react"
import { SignedIn, useAuth } from "@clerk/nextjs"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, MapPin, Clock, TrendingUp, AlertTriangle, Car, Activity } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { toast } from "sonner"

interface VehicleEvent {
  event_id: string
  vehicle_id: string
  event_type: string
  latitude: number
  longitude: number
  speed: number | null
  previous_value: string | null
  new_value: string | null
  description: string | null
  timestamp: string
}

interface Alert {
  alert_id: string
  alert_type: string
  latitude: number
  longitude: number
  speed_at_alert: number
  timestamp: string
  severity: string
  resolved: boolean
}

interface VehicleDetail {
  vehicle_id: string
  vehicle_name?: string
  vehicle_number?: string
  registration_number?: string
  owner_name?: string
  latitude: number
  longitude: number
  speed: number
  status: string
  route_name?: string
  timestamp: string
}

export default function VehicleDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const vehicleId = params.id as string
  const { isSignedIn } = useAuth()
  
  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null)
  const [events, setEvents] = useState<VehicleEvent[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"events" | "alerts" | "overspeeding">("overspeeding")

  useEffect(() => {
    if (!isSignedIn) return
    
    fetchVehicleDetails()
    fetchEvents()
    fetchAlerts()

    // Subscribe to real-time updates
    const vehicleChannel = supabase
      .channel(`vehicle-${vehicleId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'vehicles',
          filter: `vehicle_id=eq.${vehicleId}`
        },
        (payload) => {
          setVehicle(payload.new as VehicleDetail)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(vehicleChannel)
    }
  }, [vehicleId, isSignedIn])

  const fetchVehicleDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .single()

      if (error) throw error
      setVehicle(data as VehicleDetail)
    } catch (error: any) {
      toast.error(`Error loading vehicle: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicle_events')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('timestamp', { ascending: false })
        .limit(100)

      if (error) throw error
      setEvents(data || [])
    } catch (error: any) {
      console.error("Error fetching events:", error)
    }
  }

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('timestamp', { ascending: false })

      if (error) throw error
      setAlerts(data || [])
    } catch (error: any) {
      console.error("Error fetching alerts:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30'
      case 'overspeeding':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30'
      case 'accident':
        return 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30'
    }
  }

  const overspeedingEvents = events.filter(e => e.event_type === 'overspeeding')
  const overspeedingAlerts = alerts.filter(a => a.alert_type === 'overspeeding')

  if (!isSignedIn) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to continue</h1>
          <Link href="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Vehicle not found</h1>
          <Link href="/">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <SignedIn>
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <Header />
        
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 max-w-7xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Link href="/">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Car className="h-8 w-8" />
                    {(vehicle as any).vehicle_name || vehicle.vehicle_id}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor(vehicle.status)}>
                      {vehicle.status}
                    </Badge>
                    {(vehicle as any).vehicle_number && (
                      <Badge variant="outline">
                        {(vehicle as any).vehicle_number}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Overspeeding Incidents</CardDescription>
                  <CardTitle className="text-2xl">{overspeedingAlerts.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Events</CardDescription>
                  <CardTitle className="text-2xl">{events.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Current Speed</CardDescription>
                  <CardTitle className="text-2xl">{vehicle.speed} km/h</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Alerts</CardDescription>
                  <CardTitle className="text-2xl">{alerts.length}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b">
              <button
                onClick={() => setActiveTab("overspeeding")}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === "overspeeding"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <AlertTriangle className="h-4 w-4 inline mr-2" />
                Overspeeding History
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === "events"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Activity className="h-4 w-4 inline mr-2" />
                All Events
              </button>
              <button
                onClick={() => setActiveTab("alerts")}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === "alerts"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <TrendingUp className="h-4 w-4 inline mr-2" />
                All Alerts
              </button>
            </div>

            {/* Content */}
            <Card>
              <CardContent className="p-0">
                {activeTab === "overspeeding" && (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Speed</TableHead>
                          <TableHead>Coordinates</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {overspeedingAlerts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              No overspeeding incidents recorded
                            </TableCell>
                          </TableRow>
                        ) : (
                          overspeedingAlerts.map((alert) => (
                            <TableRow key={alert.alert_id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  {new Date(alert.timestamp).toLocaleString()}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <a
                                    href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    View on Map
                                  </a>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-orange-600 border-orange-600">
                                  {alert.speed_at_alert} km/h
                                </Badge>
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    alert.resolved
                                      ? "bg-green-500/20 text-green-600"
                                      : "bg-yellow-500/20 text-yellow-600"
                                  }
                                >
                                  {alert.resolved ? "Resolved" : "Active"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {activeTab === "events" && (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Event Type</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Speed</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {events.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              No events recorded
                            </TableCell>
                          </TableRow>
                        ) : (
                          events.map((event) => (
                            <TableRow key={event.event_id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  {new Date(event.timestamp).toLocaleString()}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {event.event_type.replace('_', ' ')}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}
                              </TableCell>
                              <TableCell>
                                {event.speed ? `${event.speed} km/h` : "-"}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {event.description || `${event.previous_value || ""} → ${event.new_value || ""}`}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {activeTab === "alerts" && (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Alert Type</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Speed</TableHead>
                          <TableHead>Severity</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {alerts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              No alerts recorded
                            </TableCell>
                          </TableRow>
                        ) : (
                          alerts.map((alert) => (
                            <TableRow key={alert.alert_id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  {new Date(alert.timestamp).toLocaleString()}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    alert.alert_type === "accident"
                                      ? "border-red-600 text-red-600"
                                      : "border-orange-600 text-orange-600"
                                  }
                                >
                                  {alert.alert_type}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                <a
                                  href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                                </a>
                              </TableCell>
                              <TableCell>{alert.speed_at_alert} km/h</TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    alert.severity === "high"
                                      ? "bg-red-500/20 text-red-600"
                                      : alert.severity === "medium"
                                      ? "bg-yellow-500/20 text-yellow-600"
                                      : "bg-blue-500/20 text-blue-600"
                                  }
                                >
                                  {alert.severity}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    alert.resolved
                                      ? "bg-green-500/20 text-green-600"
                                      : "bg-yellow-500/20 text-yellow-600"
                                  }
                                >
                                  {alert.resolved ? "Resolved" : "Active"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SignedIn>
  )
}

