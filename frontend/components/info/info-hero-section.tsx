"use client"

import { motion } from "framer-motion"

export function InfoHeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-12"
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        About This Project
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
        A comprehensive real-time vehicle tracking system with intelligent monitoring and analytics
      </p>
    </motion.div>
  )
}

