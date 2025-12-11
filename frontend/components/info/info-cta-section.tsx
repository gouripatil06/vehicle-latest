"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function InfoCTASection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="text-center"
    >
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <p className="text-lg mb-4">
            Ready to explore the system?
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="group">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/settings">
              <Button size="lg" variant="outline">
                Configure Simulator
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

