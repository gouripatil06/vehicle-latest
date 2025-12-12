"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Square, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:30081'

export function SimulatorControl() {
  const [isRunning, setIsRunning] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<any>(null)

  // Check simulator status on mount
  useEffect(() => {
    checkStatus()
    // Poll status every 5 seconds
    const interval = setInterval(checkStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  const checkStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/simulator/status`, {
        timeout: 5000, // 5 second timeout
      })
      if (response.data.success) {
        setIsRunning(response.data.data.isRunning)
        setStatus(response.data.data)
      }
    } catch (error: any) {
      // Silently fail status checks to avoid spam
      if (error.code !== 'ECONNREFUSED') {
        console.error('Error checking simulator status:', error)
      }
      // Don't set running to false on error - keep last known state
    }
  }

  const handleStart = async () => {
    setLoading(true)
    try {
      console.log(`Starting simulator at ${API_URL}/api/simulator/start`)
      const response = await axios.post(`${API_URL}/api/simulator/start`, {
        vehicleCount: 3
      }, {
        timeout: 10000, // 10 second timeout
      })
      
      console.log('Simulator start response:', response.data)
      
      if (response.data.success) {
        setIsRunning(true)
        setStatus(response.data.data)
        toast.success('Simulator Started', {
          description: `${response.data.data?.vehicleCount || 0} vehicles are now being simulated`,
        })
      } else {
        toast.error('Failed to Start Simulator', {
          description: response.data.error || 'Unknown error occurred',
        })
      }
    } catch (error: any) {
      console.error('Error starting simulator:', error)
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        toast.error('Backend Not Running', {
          description: `Cannot connect to backend at ${API_URL}. Please start the backend server first.`,
          duration: 8000,
        })
      } else if (error.response) {
        toast.error('Failed to Start Simulator', {
          description: error.response.data?.error || `Server error: ${error.response.status} ${error.response.statusText}`,
        })
      } else {
        toast.error('Failed to Start Simulator', {
          description: error.message || 'Unknown error occurred. Please check console for details.',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleStop = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/api/simulator/stop`)
      
      if (response.data.success) {
        setIsRunning(false)
        setStatus(null)
        toast.success('Simulator Stopped', {
          description: 'Vehicle simulation has been stopped',
        })
      }
    } catch (error: any) {
      console.error('Error stopping simulator:', error)
      toast.error('Failed to Stop Simulator', {
        description: error.response?.data?.error || error.message || 'Unknown error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border bg-card/95 backdrop-blur-md shadow-lg">
        <CardContent className="p-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">Simulator Control</span>
                  {isRunning ? (
                    <Badge variant="outline" className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                      Running
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30">
                      Stopped
                    </Badge>
                  )}
                </div>
                {status && isRunning && (
                  <p className="text-xs text-muted-foreground">
                    {status.vehicleCount} vehicles • Started {status.startTime ? new Date(status.startTime).toLocaleTimeString() : ''}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isRunning ? (
                <Button
                  onClick={handleStop}
                  disabled={loading}
                  variant="destructive"
                  size="sm"
                  className="gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                  Stop Simulator
                </Button>
              ) : (
                <Button
                  onClick={handleStart}
                  disabled={loading}
                  size="sm"
                  className="gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  Start Simulator
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

