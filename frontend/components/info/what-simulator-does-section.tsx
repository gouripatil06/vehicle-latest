"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, MapPin, Gauge, Activity, Route } from "lucide-react"

export function WhatSimulatorDoesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-12"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Cpu className="h-6 w-6 text-green-500" />
            </div>
            <CardTitle className="text-2xl">What the Simulator Does</CardTitle>
          </div>
          <CardDescription className="text-base">
            Detailed breakdown of simulator functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Vehicle Movement Simulation */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">1. Vehicle Movement Simulation</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                <li>• Generates GPS coordinates (latitude, longitude) for vehicles</li>
                <li>• Moves vehicles along real routes in Bengaluru (MG Road, Electronic City, etc.)</li>
                <li>• Uses Mapbox Directions API to fetch realistic road routes</li>
                <li>• Calculates vehicle position along routes based on speed and time</li>
                <li>• Updates positions every 2-5 seconds (configurable)</li>
              </ul>
            </div>

            {/* Speed Simulation */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-3">
                <Gauge className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">2. Speed Monitoring</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                <li>• Simulates realistic vehicle speeds (20-100 km/h)</li>
                <li>• Normal driving: 30-60 km/h</li>
                <li>• Overspeeding: 70-90 km/h (exceeds speed limit)</li>
                <li>• Stationary: 0 km/h (parked vehicles)</li>
                <li>• Speed changes based on driving scenarios</li>
              </ul>
            </div>

            {/* Scenarios */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-3">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">3. Driving Scenarios</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                <li>• <strong>Normal Driving:</strong> Vehicles move at safe speeds</li>
                <li>• <strong>Overspeeding:</strong> Vehicles exceed speed limits</li>
                <li>• <strong>Accident:</strong> Vehicle comes to sudden stop (speed = 0)</li>
                <li>• <strong>Stationary:</strong> Parked/stopped vehicles</li>
                <li>• Scenarios randomly change to test alert system</li>
              </ul>
            </div>

            {/* Route Navigation */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-3">
                <Route className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">4. Route Navigation</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                <li>• Vehicles travel between real Bengaluru landmarks</li>
                <li>• Routes: MG Road → Electronic City, Whitefield → Koramangala, etc.</li>
                <li>• Uses real road coordinates from Mapbox</li>
                <li>• When destination reached, new route is automatically assigned</li>
                <li>• Vehicles follow realistic road paths (not straight lines)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

