"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MapPin, Home, Search, Navigation } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
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

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-8"
        >
          <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent relative">
            404
            <motion.div
              animate={{
                rotate: [0, 5, -5, 5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="absolute -top-4 -right-4 md:-top-8 md:-right-8"
            >
              <MapPin className="h-16 w-16 md:h-24 md:w-24 text-primary" />
            </motion.div>
          </h1>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Vehicle Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground mb-8 text-lg"
        >
          Looks like this page took a wrong turn and got lost!
          <br />
          Don't worry, we'll help you navigate back on track.
        </motion.p>

        {/* Floating Navigation Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-4 mb-8"
        >
          {[Navigation, Search, MapPin].map((Icon, index) => (
            <motion.div
              key={index}
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.3,
              }}
              className="p-3 rounded-full bg-primary/10"
            >
              <Icon className="h-6 w-6 text-primary" />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/dashboard">
            <Button size="lg" className="group">
              <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="outline" className="group">
              <Navigation className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
              Back to Home
            </Button>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-muted-foreground mt-8"
        >
          This page might be in a different route... we'll keep tracking it down! 🗺️
        </motion.p>
      </div>
    </div>
  )
}

