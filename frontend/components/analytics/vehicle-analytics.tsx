"use client"

import { useVehicles } from "@/hooks/use-vehicles"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Car, MapPin, Gauge, Activity } from "lucide-react"
import { useMemo } from "react"

export function VehicleAnalytics() {
  const { vehicles } = useVehicles()

  const vehicleStats = useMemo(() => {
    return vehicles.map(vehicle => ({
      ...vehicle,
      statusColor: vehicle.status === 'normal' ? 'bg-green-500/20 text-green-600' :
                   vehicle.status === 'overspeeding' ? 'bg-yellow-500/20 text-yellow-600' :
                   'bg-red-500/20 text-red-600'
    })).sort((a, b) => b.speed - a.speed)
  }, [vehicles])

  return (
    <Card className="border-2 shadow-lg bg-card/95 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" />
            Vehicle Performance Analytics
          </CardTitle>
          <CardDescription className="mt-1">
            Detailed performance metrics for all active vehicles
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-bold">Vehicle</TableHead>
                <TableHead className="font-bold">Details</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold">
                  <div className="flex items-center gap-1">
                    <Gauge className="h-4 w-4" />
                    Speed
                  </div>
                </TableHead>
                <TableHead className="font-bold">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Location
                  </div>
                </TableHead>
                <TableHead className="font-bold">
                  <div className="flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    Route
                  </div>
                </TableHead>
                <TableHead className="font-bold">Last Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicleStats.length > 0 ? (
                vehicleStats.map((vehicle, index) => (
                  <motion.tr
                    key={vehicle.vehicle_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-semibold">
                          {(vehicle as any).vehicle_name || (vehicle as any).vehicle_number || vehicle.vehicle_id}
                        </div>
                        {(vehicle as any).vehicle_name && (
                          <div className="text-xs text-muted-foreground">
                            ID: {vehicle.vehicle_id}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5 text-xs">
                        {(vehicle as any).vehicle_number && (
                          <div className="text-muted-foreground">
                            <span className="font-medium">Number:</span> {(vehicle as any).vehicle_number}
                          </div>
                        )}
                        {(vehicle as any).registration_number && (
                          <div className="text-muted-foreground">
                            <span className="font-medium">Reg:</span> {(vehicle as any).registration_number}
                          </div>
                        )}
                        {(vehicle as any).owner_name && (
                          <div className="text-muted-foreground">
                            <span className="font-medium">Owner:</span> {(vehicle as any).owner_name}
                          </div>
                        )}
                        {!(vehicle as any).vehicle_number && !(vehicle as any).registration_number && !(vehicle as any).owner_name && (
                          <div className="text-muted-foreground italic">No details</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={vehicle.statusColor}>
                        {vehicle.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${
                          vehicle.speed > 60 ? 'text-yellow-600' : 
                          vehicle.speed === 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {vehicle.speed}
                        </span>
                        <span className="text-xs text-muted-foreground">km/h</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-mono">
                        {vehicle.latitude.toFixed(4)}, {vehicle.longitude.toFixed(4)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{vehicle.route_name || 'N/A'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {new Date(vehicle.timestamp).toLocaleTimeString()}
                      </span>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No vehicles available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

