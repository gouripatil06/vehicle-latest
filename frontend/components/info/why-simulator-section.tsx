"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Satellite, AlertTriangle, CheckCircle2 } from "lucide-react"

export function WhySimulatorSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-12"
    >
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Satellite className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Why We Use a Simulator?</CardTitle>
          </div>
          <CardDescription className="text-base">
            Understanding the hardware limitations and our solution
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Hardware Limitations
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>No physical GPS devices or vehicle tracking hardware available</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Cannot connect real vehicles to the system</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Limited budget/resources for hardware setup</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Academic project requires demonstration without physical devices</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Our Solution
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Software-based vehicle simulator generates realistic data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Simulates GPS coordinates, speed, and vehicle movement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Uses real Bengaluru landmarks and routes for authenticity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Demonstrates all system features without physical hardware</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Note:</strong> In a real-world deployment, this system would connect to actual GPS devices installed in vehicles. 
              The simulator serves as a perfect substitute for testing and demonstration purposes, generating data identical to what real GPS devices would produce.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

