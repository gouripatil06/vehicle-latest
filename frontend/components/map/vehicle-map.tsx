"use client"

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useVehicles, type Vehicle } from '@/hooks/use-vehicles'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'

interface VehicleMapProps {
  onVehicleClick?: (vehicle: Vehicle) => void
  trackedVehicleId?: string
}

// Import route utilities
import { getRouteFromMapbox, getPositionAlongRoute, type RouteCoordinates } from '@/lib/mapbox-routes'

// Helper function to interpolate along route
function interpolateAlongRoute(route: number[][], progress: number): [number, number] {
  if (route.length < 2) return route[0] as [number, number]
  
  const clampedProgress = Math.max(0, Math.min(1, progress))
  const totalSegments = route.length - 1
  const segmentIndex = Math.floor(clampedProgress * totalSegments)
  const segmentProgress = (clampedProgress * totalSegments) % 1
  
  const start = route[Math.min(segmentIndex, route.length - 1)]
  const end = route[Math.min(segmentIndex + 1, route.length - 1)]
  
  return [
    start[0] + (end[0] - start[0]) * segmentProgress,
    start[1] + (end[1] - start[1]) * segmentProgress
  ]
}

// Helper function to calculate distance from point to line segment
function pointToLineDistance(
  point: [number, number],
  lineStart: [number, number],
  lineEnd: [number, number]
): number {
  const A = point[0] - lineStart[0]
  const B = point[1] - lineStart[1]
  const C = lineEnd[0] - lineStart[0]
  const D = lineEnd[1] - lineStart[1]
  
  const dot = A * C + B * D
  const lenSq = C * C + D * D
  let param = -1
  
  if (lenSq !== 0) param = dot / lenSq
  
  let xx: number, yy: number
  
  if (param < 0) {
    xx = lineStart[0]
    yy = lineStart[1]
  } else if (param > 1) {
    xx = lineEnd[0]
    yy = lineEnd[1]
  } else {
    xx = lineStart[0] + param * C
    yy = lineStart[1] + param * D
  }
  
  const dx = point[0] - xx
  const dy = point[1] - yy
  return Math.sqrt(dx * dx + dy * dy)
}

// Easing function for smooth animation
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function VehicleMap({ onVehicleClick, trackedVehicleId }: VehicleMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map())
  const routesRef = useRef<Map<string, { path: number[][], progress: number }>>(new Map())
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const { vehicles } = useVehicles()

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mapContainer.current || !mounted || !mapboxToken) return

    // Initialize map
    mapboxgl.accessToken = mapboxToken

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: theme === 'dark' 
        ? 'mapbox://styles/mapbox/dark-v11'
        : 'mapbox://styles/mapbox/streets-v12',
      center: [77.6093, 12.9750], // MG Road, Bengaluru (Central point)
      zoom: 12,
      pitch: 45, // 3D tilt for better view
      bearing: 0,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right')

      // Routes will be drawn dynamically for tracked vehicles only

    return () => {
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current.clear()
      map.current?.remove()
    }
  }, [mounted, theme, mapboxToken])

  // Update map style when theme changes
  useEffect(() => {
    if (map.current && mounted) {
      map.current.setStyle(
        theme === 'dark'
          ? 'mapbox://styles/mapbox/dark-v11'
          : 'mapbox://styles/mapbox/streets-v12'
      )
      
      // Routes will be dynamically drawn for tracked vehicles
    }
  }, [theme, mounted])

  // Create 3D-looking car marker element
  const createCarMarker = (vehicle: Vehicle, isTracked: boolean = false): HTMLDivElement => {
    const statusColors = {
      normal: '#10b981',
      overspeeding: '#f59e0b',
      accident: '#ef4444'
    }
    const color = statusColors[vehicle.status] || '#6b7280'
    
    const el = document.createElement('div')
    el.style.width = isTracked ? '60px' : '50px'
    el.style.height = isTracked ? '60px' : '50px'
    el.style.position = 'relative'
    el.style.cursor = 'pointer'
    el.style.transition = 'transform 0.3s ease'
    el.style.transform = isTracked ? 'scale(1.3) translateZ(0)' : 'scale(1) translateZ(0)'
    el.style.filter = isTracked 
      ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.4)) drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))'
      : 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
    el.style.zIndex = isTracked ? '1000' : '100'
    
    // Add pulsing animation for tracked vehicle
    if (isTracked) {
      el.style.animation = 'pulse 2s ease-in-out infinite'
    }
    
    el.addEventListener('mouseenter', () => {
      if (!isTracked) {
        el.style.transform = 'scale(1.3) translateZ(0)'
        el.style.filter = 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))'
      }
    })
    el.addEventListener('mouseleave', () => {
      if (!isTracked) {
        el.style.transform = 'scale(1) translateZ(0)'
        el.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
      }
    })
    
    // Create container with 3D transform
    const container = document.createElement('div')
    container.style.width = '100%'
    container.style.height = '100%'
    container.style.transform = 'perspective(500px) rotateY(-15deg) rotateX(5deg)'
    container.style.transformStyle = 'preserve-3d'
    
    // Enhanced 3D car SVG with better depth
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', isTracked ? '56' : '48')
    svg.setAttribute('height', isTracked ? '56' : '48')
    svg.setAttribute('viewBox', '0 0 48 48')
    svg.style.filter = 'drop-shadow(0 3px 6px rgba(0,0,0,0.4))'
    
    // Car body with gradient for 3D effect
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')
    gradient.setAttribute('id', `car-gradient-${vehicle.vehicle_id}`)
    gradient.setAttribute('x1', '0%')
    gradient.setAttribute('y1', '0%')
    gradient.setAttribute('x2', '100%')
    gradient.setAttribute('y2', '100%')
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop1.setAttribute('offset', '0%')
    stop1.setAttribute('stop-color', color)
    stop1.setAttribute('stop-opacity', '1')
    gradient.appendChild(stop1)
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop2.setAttribute('offset', '100%')
    stop2.setAttribute('stop-color', color)
    stop2.setAttribute('stop-opacity', '0.7')
    gradient.appendChild(stop2)
    
    defs.appendChild(gradient)
    svg.appendChild(defs)
    
    // Car body with 3D depth
    const bodyShadow = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    bodyShadow.setAttribute('d', 'M9 19 L13 13 L29 13 L33 19 L35 19 L35 27 L33 27 L31 31 L27 31 L25 27 L15 27 L13 31 L9 31 L7 27 L7 19 Z')
    bodyShadow.setAttribute('fill', 'rgba(0,0,0,0.3)')
    bodyShadow.setAttribute('transform', 'translate(1, 1)')
    svg.appendChild(bodyShadow)
    
    const body = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    body.setAttribute('d', 'M8 18 L12 12 L28 12 L32 18 L34 18 L34 26 L32 26 L30 30 L26 30 L24 26 L16 26 L14 30 L10 30 L8 26 L6 26 L6 18 Z')
    body.setAttribute('fill', `url(#car-gradient-${vehicle.vehicle_id})`)
    body.setAttribute('stroke', 'white')
    body.setAttribute('stroke-width', '2')
    svg.appendChild(body)
    
    // Highlight for 3D effect
    const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    highlight.setAttribute('d', 'M12 12 L24 12 L30 17 L32 17 L32 22 L30 22 L28 26 L20 26 L18 22 L16 22 L14 22 L12 22 Z')
    highlight.setAttribute('fill', 'rgba(255,255,255,0.3)')
    svg.appendChild(highlight)
    
    // Windows with 3D effect
    const window1 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    window1.setAttribute('d', 'M14 14 L20 14 L20 18 L14 18 Z')
    window1.setAttribute('fill', 'rgba(135, 206, 250, 0.7)')
    window1.setAttribute('stroke', 'rgba(255,255,255,0.8)')
    window1.setAttribute('stroke-width', '1')
    svg.appendChild(window1)
    
    const window2 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    window2.setAttribute('d', 'M20 14 L26 14 L26 18 L20 18 Z')
    window2.setAttribute('fill', 'rgba(135, 206, 250, 0.7)')
    window2.setAttribute('stroke', 'rgba(255,255,255,0.8)')
    window2.setAttribute('stroke-width', '1')
    svg.appendChild(window2)
    
    // Wheels with 3D effect
    const wheel1Shadow = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    wheel1Shadow.setAttribute('cx', '15')
    wheel1Shadow.setAttribute('cy', '27')
    wheel1Shadow.setAttribute('r', '3')
    wheel1Shadow.setAttribute('fill', 'rgba(0,0,0,0.5)')
    svg.appendChild(wheel1Shadow)
    
    const wheel1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    wheel1.setAttribute('cx', '14')
    wheel1.setAttribute('cy', '26')
    wheel1.setAttribute('r', '3')
    wheel1.setAttribute('fill', '#1f2937')
    wheel1.setAttribute('stroke', '#374151')
    wheel1.setAttribute('stroke-width', '1')
    svg.appendChild(wheel1)
    
    const wheel1Inner = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    wheel1Inner.setAttribute('cx', '14')
    wheel1Inner.setAttribute('cy', '26')
    wheel1Inner.setAttribute('r', '1.5')
    wheel1Inner.setAttribute('fill', '#4b5563')
    svg.appendChild(wheel1Inner)
    
    const wheel2Shadow = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    wheel2Shadow.setAttribute('cx', '27')
    wheel2Shadow.setAttribute('cy', '27')
    wheel2Shadow.setAttribute('r', '3')
    wheel2Shadow.setAttribute('fill', 'rgba(0,0,0,0.5)')
    svg.appendChild(wheel2Shadow)
    
    const wheel2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    wheel2.setAttribute('cx', '26')
    wheel2.setAttribute('cy', '26')
    wheel2.setAttribute('r', '3')
    wheel2.setAttribute('fill', '#1f2937')
    wheel2.setAttribute('stroke', '#374151')
    wheel2.setAttribute('stroke-width', '1')
    svg.appendChild(wheel2)
    
    const wheel2Inner = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    wheel2Inner.setAttribute('cx', '26')
    wheel2Inner.setAttribute('cy', '26')
    wheel2Inner.setAttribute('r', '1.5')
    wheel2Inner.setAttribute('fill', '#4b5563')
    svg.appendChild(wheel2Inner)
    
    container.appendChild(svg)
    el.appendChild(container)
    
    // Status badge with glow for tracked vehicle
    const badge = document.createElement('div')
    badge.style.position = 'absolute'
    badge.style.top = '-6px'
    badge.style.right = '-6px'
    badge.style.width = '18px'
    badge.style.height = '18px'
    badge.style.borderRadius = '50%'
    badge.style.background = color
    badge.style.border = '3px solid white'
    badge.style.boxShadow = isTracked 
      ? `0 0 10px ${color}, 0 0 20px ${color}`
      : '0 2px 4px rgba(0,0,0,0.3)'
    if (isTracked) {
      badge.style.animation = 'pulse 1.5s ease-in-out infinite'
    }
    el.appendChild(badge)
    
    // Track ring for tracked vehicle
    if (isTracked) {
      const ring = document.createElement('div')
      ring.style.position = 'absolute'
      ring.style.top = '50%'
      ring.style.left = '50%'
      ring.style.transform = 'translate(-50%, -50%)'
      ring.style.width = '80px'
      ring.style.height = '80px'
      ring.style.borderRadius = '50%'
      ring.style.border = `3px solid ${color}`
      ring.style.opacity = '0.6'
      ring.style.animation = 'ring-pulse 2s ease-out infinite'
      ring.style.pointerEvents = 'none'
      el.appendChild(ring)
    }
    
    return el
  }

  // Update markers when vehicles change
  useEffect(() => {
    if (!map.current || !mounted) return

    vehicles.forEach(vehicle => {
      const isTracked = trackedVehicleId === vehicle.vehicle_id
      
      if (!markersRef.current.has(vehicle.vehicle_id)) {
        // Create new marker with 3D car icon
        const el = createCarMarker(vehicle, isTracked)
        
        const marker = new mapboxgl.Marker({
          element: el,
          anchor: 'center',
          rotationAlignment: 'map',
        })
          .setLngLat([vehicle.longitude, vehicle.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25, closeButton: true, className: 'vehicle-popup' }).setHTML(`
              <div class="p-3 min-w-[200px]">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="font-bold text-base">${vehicle.vehicle_id}</h3>
                  <span class="px-2 py-1 text-xs font-medium rounded-full ${
                    vehicle.status === 'normal' ? 'bg-green-500/20 text-green-600' :
                    vehicle.status === 'overspeeding' ? 'bg-yellow-500/20 text-yellow-600' :
                    'bg-red-500/20 text-red-600'
                  } capitalize">
                    ${vehicle.status}
                  </span>
                </div>
                <div class="space-y-1 text-sm">
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Speed:</span>
                    <span class="font-semibold">${vehicle.speed} km/h</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Location:</span>
                    <span class="font-mono text-xs">${vehicle.latitude.toFixed(4)}, ${vehicle.longitude.toFixed(4)}</span>
                  </div>
                  ${vehicle.route_name ? `
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Route:</span>
                    <span class="font-medium">${vehicle.route_name}</span>
                  </div>
                  ` : ''}
                  <div class="flex justify-between text-xs text-muted-foreground mt-2 pt-2 border-t">
                    <span>Last update:</span>
                    <span>${new Date(vehicle.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            `)
          )
          .addTo(map.current!)

        el.addEventListener('click', () => {
          if (onVehicleClick) {
            onVehicleClick(vehicle)
          }
        })

        markersRef.current.set(vehicle.vehicle_id, marker)
      } else {
        // Update existing marker position smoothly
        const marker = markersRef.current.get(vehicle.vehicle_id)!
        const currentPos = marker.getLngLat()
        const newPos: [number, number] = [vehicle.longitude, vehicle.latitude]
        
        // Calculate bearing (direction of movement)
        const dLat = vehicle.latitude - currentPos.lat
        const dLng = vehicle.longitude - currentPos.lng
        const bearing = Math.atan2(dLng, dLat) * 180 / Math.PI
        
        // Smooth animation with rotation
        const duration = 2000
        const startTime = Date.now()
        
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          const easedT = easeInOutCubic(progress)
          
          const lng = currentPos.lng + (vehicle.longitude - currentPos.lng) * easedT
          const lat = currentPos.lat + (vehicle.latitude - currentPos.lat) * easedT
          
          marker.setLngLat([lng, lat])
          
          // Rotate marker to face direction of travel
          const el = marker.getElement()
          if (el && progress > 0) {
            const container = el.querySelector('div')
            if (container) {
              container.style.transform = `perspective(600px) rotateY(-20deg) rotateX(8deg) rotateZ(${-bearing}deg) translateZ(0)`
            }
          }
          
          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            marker.setLngLat(newPos)
            // Final rotation
            const el = marker.getElement()
            if (el) {
              const container = el.querySelector('div')
              if (container) {
                container.style.transform = `perspective(600px) rotateY(-20deg) rotateX(8deg) rotateZ(${-bearing}deg) translateZ(0)`
              }
            }
          }
        }
        
        animate()

        // Update marker color if status changed (check current color from element)
        const el = marker.getElement()
        const currentColor = el.querySelector('path')?.getAttribute('fill')
        const statusColors = {
          normal: '#10b981',
          overspeeding: '#f59e0b',
          accident: '#ef4444'
        }
        const newColor = statusColors[vehicle.status] || '#6b7280'
        
        // Update marker if status changed or tracking state changed
        const isTracked = trackedVehicleId === vehicle.vehicle_id
        const currentEl = marker.getElement()
        const currentlyTracked = currentEl?.style.zIndex === '1000'
        
        if (currentColor !== newColor || isTracked !== currentlyTracked) {
          const newEl = createCarMarker(vehicle, isTracked)
          const popup = marker.getPopup()
          const currentMarkerPos = marker.getLngLat()
          
          marker.remove()
          
          const newMarker = new mapboxgl.Marker({
            element: newEl,
            anchor: 'center',
            rotationAlignment: 'map',
          })
            .setLngLat([currentMarkerPos.lng, currentMarkerPos.lat])
            .setPopup(popup || null)
            .addTo(map.current!)
          
          newEl.addEventListener('click', () => {
            if (onVehicleClick) {
              onVehicleClick(vehicle)
            }
          })
          
          markersRef.current.set(vehicle.vehicle_id, newMarker)
          
          // Update popup for new marker
          newMarker.setPopup(
            new mapboxgl.Popup({ offset: 25, closeButton: true, className: 'vehicle-popup' }).setHTML(`
              <div class="p-3 min-w-[200px]">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="font-bold text-base">${vehicle.vehicle_id}</h3>
                  <span class="px-2 py-1 text-xs font-medium rounded-full ${
                    vehicle.status === 'normal' ? 'bg-green-500/20 text-green-600' :
                    vehicle.status === 'overspeeding' ? 'bg-yellow-500/20 text-yellow-600' :
                    'bg-red-500/20 text-red-600'
                  } capitalize">
                    ${vehicle.status}
                  </span>
                </div>
                <div class="space-y-1 text-sm">
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Speed:</span>
                    <span class="font-semibold">${vehicle.speed} km/h</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Location:</span>
                    <span class="font-mono text-xs">${vehicle.latitude.toFixed(4)}, ${vehicle.longitude.toFixed(4)}</span>
                  </div>
                  ${vehicle.route_name ? `
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Route:</span>
                    <span class="font-medium">${vehicle.route_name}</span>
                  </div>
                  ` : ''}
                  <div class="flex justify-between text-xs text-muted-foreground mt-2 pt-2 border-t">
                    <span>Last update:</span>
                    <span>${new Date(vehicle.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            `)
          )
          return // Skip popup update below since we already updated it
          
          // Update popup for new marker
          newMarker.setPopup(
            new mapboxgl.Popup({ offset: 25, closeButton: true, className: 'vehicle-popup' }).setHTML(`
              <div class="p-3 min-w-[200px]">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="font-bold text-base">${vehicle.vehicle_id}</h3>
                  <span class="px-2 py-1 text-xs font-medium rounded-full ${
                    vehicle.status === 'normal' ? 'bg-green-500/20 text-green-600' :
                    vehicle.status === 'overspeeding' ? 'bg-yellow-500/20 text-yellow-600' :
                    'bg-red-500/20 text-red-600'
                  } capitalize">
                    ${vehicle.status}
                  </span>
                </div>
                <div class="space-y-1 text-sm">
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Speed:</span>
                    <span class="font-semibold">${vehicle.speed} km/h</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Location:</span>
                    <span class="font-mono text-xs">${vehicle.latitude.toFixed(4)}, ${vehicle.longitude.toFixed(4)}</span>
                  </div>
                  ${vehicle.route_name ? `
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Route:</span>
                    <span class="font-medium">${vehicle.route_name}</span>
                  </div>
                  ` : ''}
                  <div class="flex justify-between text-xs text-muted-foreground mt-2 pt-2 border-t">
                    <span>Last update:</span>
                    <span>${new Date(vehicle.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            `)
          )
          return // Skip popup update below since we already updated it
        }

        // Update popup for existing marker
        const currentMarker = markersRef.current.get(vehicle.vehicle_id)!
        currentMarker.setPopup(
          new mapboxgl.Popup({ offset: 25, closeButton: true, className: 'vehicle-popup' }).setHTML(`
            <div class="p-3 min-w-[200px]">
              <div class="flex items-center gap-2 mb-2">
                <h3 class="font-bold text-base">${vehicle.vehicle_id}</h3>
                <span class="px-2 py-1 text-xs font-medium rounded-full ${
                  vehicle.status === 'normal' ? 'bg-green-500/20 text-green-600' :
                  vehicle.status === 'overspeeding' ? 'bg-yellow-500/20 text-yellow-600' :
                  'bg-red-500/20 text-red-600'
                } capitalize">
                  ${vehicle.status}
                </span>
              </div>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Speed:</span>
                  <span class="font-semibold">${vehicle.speed} km/h</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Location:</span>
                  <span class="font-mono text-xs">${vehicle.latitude.toFixed(4)}, ${vehicle.longitude.toFixed(4)}</span>
                </div>
                ${vehicle.route_name ? `
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Route:</span>
                  <span class="font-medium">${vehicle.route_name}</span>
                </div>
                ` : ''}
                <div class="flex justify-between text-xs text-muted-foreground mt-2 pt-2 border-t">
                  <span>Last update:</span>
                  <span>${new Date(vehicle.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          `)
        )
      }
    })

    // Remove markers for vehicles that are gone
    const currentVehicleIds = new Set(vehicles.map(v => v.vehicle_id))
    markersRef.current.forEach((marker, vehicleId) => {
      if (!currentVehicleIds.has(vehicleId)) {
        marker.remove()
        markersRef.current.delete(vehicleId)
      }
    })
  }, [vehicles, mounted, onVehicleClick, trackedVehicleId])

  // Track vehicle - zoom and follow
  useEffect(() => {
    if (!map.current || !mounted || !trackedVehicleId) return

    const trackedVehicle = vehicles.find(v => v.vehicle_id === trackedVehicleId)
    if (!trackedVehicle) return

    // Smoothly zoom and pan to tracked vehicle
    map.current.flyTo({
      center: [trackedVehicle.longitude, trackedVehicle.latitude],
      zoom: 15, // Zoom in closer when tracking
      pitch: 60, // More dramatic 3D view
      bearing: 0,
      duration: 1500, // Smooth 1.5s transition
      essential: true
    })
  }, [trackedVehicleId, vehicles, mounted])

  // Continuously follow tracked vehicle
  useEffect(() => {
    if (!map.current || !mounted || !trackedVehicleId) return

    const followInterval = setInterval(() => {
      const trackedVehicle = vehicles.find(v => v.vehicle_id === trackedVehicleId)
      if (!trackedVehicle || !map.current) return

      // Smoothly pan to keep vehicle centered
      map.current.flyTo({
        center: [trackedVehicle.longitude, trackedVehicle.latitude],
        zoom: 15,
        duration: 2000, // Smooth 2s transition
        essential: true
      })
    }, 2000) // Update every 2 seconds

    return () => clearInterval(followInterval)
  }, [trackedVehicleId, vehicles, mounted])

  if (!mapboxToken) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <p className="text-muted-foreground">Mapbox token not configured</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative h-full w-full overflow-hidden rounded-lg"
    >
      <div ref={mapContainer} className="h-full w-full" />
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        
        @keyframes ring-pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 0;
          }
        }
        
        .mapboxgl-popup-content {
          border-radius: 12px;
          padding: 0;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          border: 1px solid hsl(var(--border));
        }
        .vehicle-popup .mapboxgl-popup-close-button {
          font-size: 20px;
          padding: 4px 8px;
          color: hsl(var(--muted-foreground));
        }
        .vehicle-popup .mapboxgl-popup-close-button:hover {
          color: hsl(var(--foreground));
        }
      `}</style>
    </motion.div>
  )
}

