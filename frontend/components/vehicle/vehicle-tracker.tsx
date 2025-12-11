"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useVehicles, type Vehicle } from '@/hooks/use-vehicles'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, Gauge, MapPin, X, Navigation, Route, TrendingUp, Clock, Award, Activity, History, FileText } from 'lucide-react'
import Link from 'next/link'

interface VehicleTrackerProps {
  vehicleId: string | undefined
  onClose: () => void
  onStopTracking?: () => void
  isTracking: boolean
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function VehicleTracker({ vehicleId, onClose, onStopTracking, isTracking }: VehicleTrackerProps) {
  const { vehicles } = useVehicles()
  const vehicle = vehicles.find(v => v.vehicle_id === vehicleId)
  const [distanceTraveled, setDistanceTraveled] = useState(0)
  const [maxSpeed, setMaxSpeed] = useState(0)
  const [avgSpeed, setAvgSpeed] = useState(0)
  const [speedHistory, setSpeedHistory] = useState<number[]>([])
  const [startPosition, setStartPosition] = useState<{ lat: number, lng: number } | null>(null)

  useEffect(() => {
    if (!vehicle) return

    // Initialize start position
    if (!startPosition) {
      setStartPosition({ lat: vehicle.latitude, lng: vehicle.longitude })
      setMaxSpeed(vehicle.speed)
      setAvgSpeed(vehicle.speed)
      setSpeedHistory([vehicle.speed])
      return
    }

    // Calculate distance traveled
    const distance = calculateDistance(
      startPosition.lat,
      startPosition.lng,
      vehicle.latitude,
      vehicle.longitude
    )
    setDistanceTraveled(distance)

    // Update max speed
    if (vehicle.speed > maxSpeed) {
      setMaxSpeed(vehicle.speed)
    }

    // Update speed history and calculate average
    const newHistory = [...speedHistory, vehicle.speed].slice(-20) // Keep last 20 readings
    setSpeedHistory(newHistory)
    const avg = newHistory.reduce((a, b) => a + b, 0) / newHistory.length
    setAvgSpeed(Math.round(avg))

    // Update start position for next calculation
    setStartPosition({ lat: vehicle.latitude, lng: vehicle.longitude })
  }, [vehicle?.latitude, vehicle?.longitude, vehicle?.speed])

  if (!vehicle || !vehicleId) return null

  // Calculate ETA if we have route info
  const calculateETA = () => {
    if (!vehicle.route_name || !vehicle.speed) return null
    // Rough estimate: assume 50% of route remaining
    const estimatedDistance = 15 // km (rough estimate)
    const remainingDistance = estimatedDistance * 0.5
    const hours = remainingDistance / vehicle.speed
    const minutes = Math.round(hours * 60)
    return minutes > 0 ? `${minutes} min` : 'Arrived'
  }

  const eta = calculateETA()

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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-96 z-50"
      >
        <Card className="border-2 shadow-2xl bg-card/95 backdrop-blur-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Navigation className={`h-5 w-5 text-primary ${isTracking ? 'animate-pulse' : ''}`} />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">
                    {(vehicle as any).vehicle_name || (vehicle as any).vehicle_number || vehicle.vehicle_id}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {(vehicle as any).vehicle_name ? `ID: ${vehicle.vehicle_id}` : 'Live Tracking'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {isTracking && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2" />
                  Following Vehicle
                </Badge>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Speed Display */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Current Speed</span>
                </div>
                <Badge variant="outline" className={getStatusColor(vehicle.status)}>
                  {vehicle.status}
                </Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <motion.span
                  key={vehicle.speed}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-4xl font-bold text-primary"
                >
                  {vehicle.speed}
                </motion.span>
                <span className="text-lg text-muted-foreground">km/h</span>
              </div>
            </div>

            {/* Vehicle Details */}
            {((vehicle as any).registration_number || (vehicle as any).owner_name || (vehicle as any).vehicle_number) && (
              <div className="p-3 rounded-lg bg-muted/50 space-y-1.5">
                {(vehicle as any).vehicle_number && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Vehicle Number:</span>
                    <span className="font-medium">{(vehicle as any).vehicle_number}</span>
                  </div>
                )}
                {(vehicle as any).registration_number && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Registration:</span>
                    <span className="font-medium">{(vehicle as any).registration_number}</span>
                  </div>
                )}
                {(vehicle as any).owner_name && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Owner:</span>
                    <span className="font-medium">{(vehicle as any).owner_name}</span>
                  </div>
                )}
              </div>
            )}

            {/* Route Info with ETA */}
            {vehicle.route_name && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Route className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Route</p>
                  <p className="text-sm font-medium">{vehicle.route_name}</p>
                  {eta && (
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">ETA: {eta}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Advanced Stats Grid */}
            <div className="grid grid-cols-2 gap-2">
              {/* Distance Traveled */}
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Distance</p>
                </div>
                <p className="text-lg font-bold">{distanceTraveled.toFixed(2)} km</p>
              </div>

              {/* Max Speed */}
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Max Speed</p>
                </div>
                <p className="text-lg font-bold">{maxSpeed} km/h</p>
              </div>

              {/* Average Speed */}
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Avg Speed</p>
                </div>
                <p className="text-lg font-bold">{avgSpeed} km/h</p>
              </div>

              {/* Location */}
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Coordinates</p>
                </div>
                <p className="text-xs font-mono leading-tight">
                  {vehicle.latitude.toFixed(4)}, {vehicle.longitude.toFixed(4)}
                </p>
              </div>
            </div>

            {/* Last Update */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              <span>Last updated:</span>
              <span>{new Date(vehicle.timestamp).toLocaleTimeString()}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t">
              <Link href={`/vehicles/${vehicle.vehicle_id}`} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <History className="h-4 w-4 mr-2" />
                  View History
                </Button>
              </Link>
              <Link href="/settings" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Details
                </Button>
              </Link>
            </div>

            {/* Stop Tracking Button */}
            {isTracking && onStopTracking && (
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={onStopTracking}
              >
                Stop Tracking
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

