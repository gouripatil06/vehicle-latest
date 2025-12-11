"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, MapPin, Gauge, AlertTriangle, Activity, Route, Database } from "lucide-react"

interface FeatureItemProps {
  icon: React.ElementType
  title: string
  description: string
}

function FeatureItem({ icon: Icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
      <Icon className="h-5 w-5 text-primary mt-0.5" />
      <div>
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}

export function KeyFeaturesSection() {
  const features = [
    {
      icon: MapPin,
      title: "Real-Time Tracking",
      description: "Live GPS tracking with updates every 2-5 seconds on interactive map"
    },
    {
      icon: Gauge,
      title: "Speed Monitoring",
      description: "Automatic overspeeding detection with configurable speed limits"
    },
    {
      icon: AlertTriangle,
      title: "Alert System",
      description: "Instant alerts for overspeeding, accidents, and emergencies"
    },
    {
      icon: Activity,
      title: "Analytics Dashboard",
      description: "Comprehensive analytics with charts, trends, and performance metrics"
    },
    {
      icon: Route,
      title: "Route Visualization",
      description: "Google Maps-style navigation with 3D car markers and route display"
    },
    {
      icon: Database,
      title: "Vehicle History",
      description: "Complete history of vehicle movements, incidents, and locations"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-12"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-pink-500/10">
              <Zap className="h-6 w-6 text-pink-500" />
            </div>
            <CardTitle className="text-2xl">Key Features</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature) => (
              <FeatureItem key={feature.title} {...feature} />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

