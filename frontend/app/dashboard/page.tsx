"use client"

import { useState } from "react"
import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs"
import { Header } from "@/components/layout/header"
import { VehicleMap } from "@/components/map/vehicle-map"
import { VehicleList } from "@/components/vehicle/vehicle-list"
import { VehicleTracker } from "@/components/vehicle/vehicle-tracker"
import { DashboardStatsCards } from "@/components/analytics/dashboard-stats-cards"
import { SimulatorControl } from "@/components/simulator/simulator-control"
import { useAlertNotifications } from "@/hooks/use-alert-notifications"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function DashboardPage() {
  const { isSignedIn } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>()
  const [isTracking, setIsTracking] = useState(false)
  
  // Show alert notifications via Sonner toasts
  useAlertNotifications()
  
  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId)
    setIsTracking(true)
  }
  
  const handleStopTracking = () => {
    setIsTracking(false)
    setSelectedVehicleId(undefined)
  }

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

  return (
    <SignedIn>
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <Header />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Vehicle List */}
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: sidebarOpen ? 0 : -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "w-80 lg:w-96 border-r bg-card/95 backdrop-blur-md flex flex-col transition-all duration-300 z-30 shadow-lg",
              "max-lg:fixed max-lg:inset-y-16 max-lg:h-[calc(100vh-4rem)]",
              !sidebarOpen && "max-lg:hidden"
            )}
          >
            <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Fleet Overview</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Click to track vehicle</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="p-3 border-b">
              <DashboardStatsCards />
            </div>
            <div className="flex-1 overflow-hidden">
              <VehicleList
                onVehicleSelect={handleVehicleSelect}
                selectedVehicleId={selectedVehicleId}
              />
            </div>
          </motion.aside>

          {/* Main Content - Full Screen Map */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* Simulator Control - Floating at top */}
            <div className="absolute top-4 left-4 z-40 w-auto max-w-md">
              <SimulatorControl />
            </div>

            {/* Map - Full Screen */}
            <div className="flex-1 relative w-full h-full overflow-hidden">
              <VehicleMap 
                onVehicleClick={(vehicle) => handleVehicleSelect(vehicle.vehicle_id)}
                trackedVehicleId={isTracking ? selectedVehicleId : undefined}
              />
              
              {/* Vehicle Tracker Panel */}
              {selectedVehicleId && (
                <VehicleTracker
                  vehicleId={selectedVehicleId}
                  isTracking={isTracking}
                  onClose={() => {
                    setIsTracking(false)
                    setSelectedVehicleId(undefined)
                  }}
                  onStopTracking={handleStopTracking}
                />
              )}
              
              {/* Mobile Sidebar Toggle */}
              {!sidebarOpen && (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-20 left-4 z-30 lg:hidden bg-background/90 backdrop-blur-sm shadow-lg"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </SignedIn>
  )
}

