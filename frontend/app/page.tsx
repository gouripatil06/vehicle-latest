"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Shield, TrendingUp, Zap, Activity, Navigation } from "lucide-react"
import Link from "next/link"
import { useAuth, SignedIn, SignedOut } from "@clerk/nextjs"
import { Header } from "@/components/layout/header"

export default function LandingPage() {
  const { isSignedIn } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/10 blur-3xl"
            style={{
              width: Math.random() * 400 + 100,
              height: Math.random() * 400 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <Header />

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Activity className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Real-Time Vehicle Tracking System</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent"
          >
            Track Your Fleet
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              In Real-Time
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Advanced vehicle tracking with live location updates, speed monitoring, and intelligent alert systems
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <SignedOut>
              <Link href="/login">
                <Button size="lg" className="group text-lg px-8 py-6">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  View Demo
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg" className="group text-lg px-8 py-6">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </SignedIn>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-6 rounded-2xl bg-card/50 backdrop-blur-md border border-border/50 hover:border-primary/50 transition-all"
            >
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <Navigation className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6">
              Start tracking your vehicles today and get real-time insights into your fleet
            </p>
            <SignedOut>
              <Link href="/login">
                <Button size="lg" className="group">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg" className="group">
                  Open Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </SignedIn>
            <div className="mt-4">
              <Link href="/info">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Learn more about this project
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const features = [
  {
    icon: MapPin,
    title: "Live Tracking",
    description: "Monitor vehicle locations in real-time with accurate GPS tracking and route visualization"
  },
  {
    icon: Zap,
    title: "Instant Alerts",
    description: "Get notified immediately when vehicles exceed speed limits or encounter issues"
  },
  {
    icon: TrendingUp,
    title: "Analytics Dashboard",
    description: "Comprehensive insights into fleet performance, routes, and vehicle analytics"
  },
  {
    icon: Shield,
    title: "Safety First",
    description: "Advanced safety monitoring with accident detection and emergency alerts"
  },
  {
    icon: Activity,
    title: "Speed Monitoring",
    description: "Track vehicle speeds and identify overspeeding incidents automatically"
  },
  {
    icon: Navigation,
    title: "Route Optimization",
    description: "Visualize routes on interactive maps with navigation and ETA calculations"
  }
]
