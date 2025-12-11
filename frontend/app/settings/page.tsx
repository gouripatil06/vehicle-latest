"use client"

import { useState, useEffect } from "react"
import { SignedIn } from "@clerk/nextjs"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useVehicles } from "@/hooks/use-vehicles"
import { toast } from "sonner"
import { Save, Plus, Trash2, Settings, Car, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"

interface VehicleDetail {
  vehicle_id: string
  vehicle_name?: string
  vehicle_number?: string
  registration_number?: string
  owner_name?: string
  tracking_enabled?: boolean
  notes?: string
}

interface SimulatorSettings {
  max_vehicles: number
  overspeeding_limit: number
  update_interval: number
}

export default function SettingsPage() {
  const router = useRouter()
  const { vehicles } = useVehicles()
  const [vehicleDetails, setVehicleDetails] = useState<Record<string, VehicleDetail>>({})
  const [settings, setSettings] = useState<SimulatorSettings>({
    max_vehicles: 3,
    overspeeding_limit: 60,
    update_interval: 5000
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Initialize vehicle details from existing vehicles
    const details: Record<string, VehicleDetail> = {}
    vehicles.forEach(vehicle => {
      details[vehicle.vehicle_id] = {
        vehicle_id: vehicle.vehicle_id,
        vehicle_name: (vehicle as any).vehicle_name || "",
        vehicle_number: (vehicle as any).vehicle_number || vehicle.vehicle_id,
        registration_number: (vehicle as any).registration_number || "",
        owner_name: (vehicle as any).owner_name || "",
        tracking_enabled: (vehicle as any).tracking_enabled ?? true,
        notes: (vehicle as any).notes || ""
      }
    })
    setVehicleDetails(details)

    // Fetch simulator settings
    fetchSettings()
  }, [vehicles])

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/simulator/settings`)
      if (response.data.success) {
        setSettings(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
    }
  }

  const handleVehicleDetailChange = (vehicleId: string, field: keyof VehicleDetail, value: any) => {
    setVehicleDetails(prev => ({
      ...prev,
      [vehicleId]: {
        ...prev[vehicleId],
        [field]: value
      }
    }))
  }

  const handleSaveVehicleDetails = async () => {
    setLoading(true)
    try {
      const updates = Object.values(vehicleDetails)
      for (const detail of updates) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/vehicles/${detail.vehicle_id}/details`, detail)
      }
      toast.success("Vehicle details saved successfully!")
    } catch (error: any) {
      toast.error(`Error saving vehicle details: ${error.response?.data?.error || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/simulator/settings`,
        settings
      )
      if (response.data.success) {
        toast.success("Simulator settings saved successfully!")
      }
    } catch (error: any) {
      toast.error(`Error saving settings: ${error.response?.data?.error || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SignedIn>
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <Header />
        
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Settings className="h-8 w-8" />
                  Simulator Settings
                </h1>
                <Link href="/">
                  <Button variant="outline">Back to Dashboard</Button>
                </Link>
              </div>
              <p className="text-muted-foreground">
                Configure simulator parameters and manage vehicle details
              </p>
            </motion.div>

            <Tabs defaultValue="simulator" className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="simulator">Simulator Config</TabsTrigger>
                <TabsTrigger value="vehicles">Vehicle Details</TabsTrigger>
              </TabsList>

              <TabsContent value="simulator">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Simulation Parameters
                    </CardTitle>
                    <CardDescription>
                      Configure how the simulator behaves
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="max_vehicles">Maximum Vehicles (1-6)</Label>
                      <Input
                        id="max_vehicles"
                        type="number"
                        min="1"
                        max="6"
                        value={settings.max_vehicles}
                        onChange={(e) => setSettings(prev => ({ ...prev, max_vehicles: parseInt(e.target.value) || 3 }))}
                      />
                      <p className="text-sm text-muted-foreground">
                        Maximum number of vehicles that can run simultaneously
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="overspeeding_limit">Overspeeding Limit (km/h)</Label>
                      <Input
                        id="overspeeding_limit"
                        type="number"
                        min="40"
                        max="120"
                        value={settings.overspeeding_limit}
                        onChange={(e) => setSettings(prev => ({ ...prev, overspeeding_limit: parseInt(e.target.value) || 60 }))}
                      />
                      <p className="text-sm text-muted-foreground">
                        Speed threshold to trigger overspeeding alerts (40-120 km/h)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="update_interval">Update Interval (ms)</Label>
                      <Input
                        id="update_interval"
                        type="number"
                        min="1000"
                        max="10000"
                        step="1000"
                        value={settings.update_interval}
                        onChange={(e) => setSettings(prev => ({ ...prev, update_interval: parseInt(e.target.value) || 5000 }))}
                      />
                      <p className="text-sm text-muted-foreground">
                        How often vehicle data is updated (1000-10000 ms)
                      </p>
                    </div>

                    <Button onClick={handleSaveSettings} disabled={loading} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vehicles">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="h-5 w-5" />
                      Vehicle Details
                    </CardTitle>
                    <CardDescription>
                      Manage vehicle information and tracking settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {vehicles.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No vehicles found. Start the simulator to create vehicles.
                      </div>
                    ) : (
                      vehicles.map((vehicle) => {
                        const detail = vehicleDetails[vehicle.vehicle_id] || {
                          vehicle_id: vehicle.vehicle_id,
                          vehicle_name: "",
                          vehicle_number: vehicle.vehicle_id,
                          registration_number: "",
                          owner_name: "",
                          tracking_enabled: true,
                          notes: ""
                        }

                        return (
                          <motion.div
                            key={vehicle.vehicle_id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 border rounded-lg space-y-4"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-semibold text-lg">{vehicle.vehicle_id}</h3>
                              <Link href={`/vehicles/${vehicle.vehicle_id}`}>
                                <Button variant="outline" size="sm">
                                  View History
                                </Button>
                              </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`name-${vehicle.vehicle_id}`}>Vehicle Name</Label>
                                <Input
                                  id={`name-${vehicle.vehicle_id}`}
                                  value={detail.vehicle_name || ""}
                                  onChange={(e) => handleVehicleDetailChange(vehicle.vehicle_id, "vehicle_name", e.target.value)}
                                  placeholder="e.g., Delivery Van 1"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`number-${vehicle.vehicle_id}`}>Vehicle Number</Label>
                                <Input
                                  id={`number-${vehicle.vehicle_id}`}
                                  value={detail.vehicle_number || ""}
                                  onChange={(e) => handleVehicleDetailChange(vehicle.vehicle_id, "vehicle_number", e.target.value)}
                                  placeholder="e.g., KA-01-AB-1234"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`registration-${vehicle.vehicle_id}`}>Registration Number</Label>
                                <Input
                                  id={`registration-${vehicle.vehicle_id}`}
                                  value={detail.registration_number || ""}
                                  onChange={(e) => handleVehicleDetailChange(vehicle.vehicle_id, "registration_number", e.target.value)}
                                  placeholder="e.g., DL-01-AB-5678"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`owner-${vehicle.vehicle_id}`}>Owner Name</Label>
                                <Input
                                  id={`owner-${vehicle.vehicle_id}`}
                                  value={detail.owner_name || ""}
                                  onChange={(e) => handleVehicleDetailChange(vehicle.vehicle_id, "owner_name", e.target.value)}
                                  placeholder="e.g., John Doe"
                                />
                              </div>

                              <div className="space-y-2 md:col-span-2">
                                <Label htmlFor={`notes-${vehicle.vehicle_id}`}>Notes</Label>
                                <Input
                                  id={`notes-${vehicle.vehicle_id}`}
                                  value={detail.notes || ""}
                                  onChange={(e) => handleVehicleDetailChange(vehicle.vehicle_id, "notes", e.target.value)}
                                  placeholder="Additional information..."
                                />
                              </div>

                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`tracking-${vehicle.vehicle_id}`}
                                  checked={detail.tracking_enabled ?? true}
                                  onChange={(e) => handleVehicleDetailChange(vehicle.vehicle_id, "tracking_enabled", e.target.checked)}
                                  className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label htmlFor={`tracking-${vehicle.vehicle_id}`} className="cursor-pointer">
                                  Enable Tracking
                                </Label>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })
                    )}

                    {vehicles.length > 0 && (
                      <Button onClick={handleSaveVehicleDetails} disabled={loading} className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        Save All Vehicle Details
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SignedIn>
  )
}

