"use client"

import { SignedIn } from "@clerk/nextjs"
import { Header } from "@/components/layout/header"
import { StatsCards } from "@/components/analytics/stats-cards"
import { SpeedChart } from "@/components/analytics/speed-chart"
import { AlertChart } from "@/components/analytics/alert-chart"
import { VehicleAnalytics } from "@/components/analytics/vehicle-analytics"
import { AlertTrends } from "@/components/analytics/alert-trends"
import { SpeedDistribution } from "@/components/analytics/speed-distribution"
import { RouteAnalytics } from "@/components/analytics/route-analytics"
import { motion } from "framer-motion"
import { TrendingUp, BarChart3, Activity, Zap } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <SignedIn>
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <Header />
        
        <div className="flex-1 overflow-y-auto">
          {/* Hero Section */}
          <div className="border-b bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Analytics Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      Comprehensive vehicle tracking insights and performance metrics
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
            {/* Stats Cards - Enhanced */}
            <StatsCards />

            {/* Main Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Speed Analytics */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <SpeedChart />
              </motion.div>

              {/* Alert Analytics */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <AlertChart />
              </motion.div>
            </div>

            {/* Alert Trends - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <AlertTrends />
            </motion.div>

            {/* Bottom Grid - Speed Distribution & Route Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <SpeedDistribution />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <RouteAnalytics />
              </motion.div>
            </div>

            {/* Vehicle Analytics - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <VehicleAnalytics />
            </motion.div>
          </div>
        </div>
      </div>
    </SignedIn>
  )
}
