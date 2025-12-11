"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Server, Cpu, Database, Globe, ArrowRight } from "lucide-react"

interface ProcessStepProps {
  stepNumber: number
  icon: React.ElementType
  title: string
  description: string
  items: string[]
}

function ProcessStep({ stepNumber, icon: Icon, title, description, items }: ProcessStepProps) {
  return (
    <>
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
            {stepNumber}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {description}
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
            {items.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
      {stepNumber < 4 && <ArrowRight className="h-6 w-6 text-muted-foreground ml-5" />}
    </>
  )
}

export function SystemArchitectureSection() {
  const steps = [
    {
      stepNumber: 1,
      icon: Cpu,
      title: "Simulator Generates Vehicle Data",
      description: "The simulator (running in the backend) generates realistic vehicle data including:",
      items: [
        "Vehicle ID, GPS coordinates (lat/lng), speed, status",
        "Direction, route name, timestamp",
        "Vehicle details (name, registration, owner)"
      ]
    },
    {
      stepNumber: 2,
      icon: Server,
      title: "Backend API Stores Data",
      description: "The Node.js/Express backend receives simulator data and:",
      items: [
        "Validates vehicle data",
        "Stores/updates data in Supabase database",
        "Detects overspeeding and accidents",
        "Creates alerts when incidents occur"
      ]
    },
    {
      stepNumber: 3,
      icon: Database,
      title: "Supabase Realtime Syncs",
      description: "Supabase PostgreSQL database with Realtime:",
      items: [
        "Stores all vehicle data and alerts",
        "Automatically pushes updates to connected clients",
        "Enables real-time data synchronization"
      ]
    },
    {
      stepNumber: 4,
      icon: Globe,
      title: "Frontend Displays Real-Time Updates",
      description: "The Next.js frontend receives updates and displays:",
      items: [
        "Interactive map with moving vehicle markers",
        "Vehicle list with live status updates",
        "Speed monitoring and alerts",
        "Analytics and charts",
        "Vehicle history and details"
      ]
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-12"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Server className="h-6 w-6 text-purple-500" />
            </div>
            <CardTitle className="text-2xl">System Architecture & Process</CardTitle>
          </div>
          <CardDescription className="text-base">
            How the entire system works together
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {steps.map((step) => (
              <ProcessStep key={step.stepNumber} {...step} />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

