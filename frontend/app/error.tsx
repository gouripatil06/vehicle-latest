"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RefreshCw, Bug } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-destructive/5 to-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-destructive/10 blur-2xl"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <AlertTriangle className="h-32 w-32 text-destructive mx-auto" />
            </motion.div>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 bg-destructive/20 blur-3xl rounded-full"
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-destructive to-destructive/60 bg-clip-text text-transparent"
        >
          Oops!
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-3xl font-bold mb-4"
        >
          Something Went Wrong
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground mb-8 text-lg"
        >
          Don't worry, even the best tracking systems sometimes need a reboot!
          <br />
          Our engineers (aka the error handling system) have been notified.
        </motion.p>

        {error.digest && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8 p-4 rounded-lg bg-muted/50 border border-border"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Bug className="h-4 w-4" />
              <span>Error ID: {error.digest}</span>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={reset}
            size="lg"
            className="group"
          >
            <RefreshCw className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </Button>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="group">
              <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Go to Dashboard
            </Button>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-muted-foreground mt-8"
        >
          If this keeps happening, maybe the vehicles are just avoiding us? 🚗💨
        </motion.p>
      </div>
    </div>
  )
}

