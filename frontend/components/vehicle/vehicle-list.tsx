"use client"

import { useVehicles } from "@/hooks/use-vehicles"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Car, AlertTriangle, AlertCircle, MapPin, History, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface VehicleListProps {
  onVehicleSelect?: (vehicleId: string) => void
  selectedVehicleId?: string
}

export function VehicleList({ onVehicleSelect, selectedVehicleId }: VehicleListProps) {
  const { vehicles, loading } = useVehicles()

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <Car className="h-4 w-4" />
      case 'overspeeding':
        return <AlertTriangle className="h-4 w-4" />
      case 'accident':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Car className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 h-full overflow-y-auto p-2">
      {vehicles.map((vehicle, index) => (
        <motion.div
          key={`${vehicle.vehicle_id}-${vehicle.updated_at || vehicle.timestamp}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              selectedVehicleId === vehicle.vehicle_id && "ring-2 ring-primary"
            )}
            onClick={() => onVehicleSelect?.(vehicle.vehicle_id)}
          >
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-semibold text-sm truncate">
                      {(vehicle as any).vehicle_name || (vehicle as any).vehicle_number || vehicle.vehicle_id}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn("text-xs px-2 py-0", getStatusColor(vehicle.status))}
                    >
                      {getStatusIcon(vehicle.status)}
                      <span className="ml-1 capitalize">{vehicle.status}</span>
                    </Badge>
                  </div>
                  {(vehicle as any).vehicle_name && (
                    <div className="text-xs text-muted-foreground mb-1">
                      ID: {vehicle.vehicle_id}
                    </div>
                  )}
                  {(vehicle as any).registration_number && (
                    <div className="text-xs text-muted-foreground mb-1">
                      Reg: {(vehicle as any).registration_number}
                    </div>
                  )}
                  {(vehicle as any).owner_name && (
                    <div className="text-xs text-muted-foreground mb-1">
                      Owner: {(vehicle as any).owner_name}
                    </div>
                  )}
                  <div className="space-y-1 text-xs text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">
                        {vehicle.latitude.toFixed(4)}, {vehicle.longitude.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {vehicle.speed} km/h
                      </span>
                      {vehicle.route_name && (
                        <span className="truncate">• {vehicle.route_name}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t">
                    <Link href={`/vehicles/${vehicle.vehicle_id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <History className="h-3 w-3 mr-1" />
                        History
                      </Button>
                    </Link>
                    <Link href="/settings">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      {vehicles.length === 0 && (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <p className="text-sm">No vehicles found</p>
        </div>
      )}
    </div>
  )
}

