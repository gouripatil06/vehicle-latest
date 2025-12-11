// Mapbox Routes Service - Fetch real routes from Mapbox Directions API
// This simulates Google Maps navigation by getting actual road routes

export interface RouteCoordinates {
  coordinates: number[][]
  distance: number // in meters
  duration: number // in seconds
}

/**
 * Get real route from Mapbox Directions API (like Google Maps)
 * @param startLat - Starting latitude
 * @param startLng - Starting longitude
 * @param endLat - Ending latitude
 * @param endLng - Ending longitude
 * @param accessToken - Mapbox access token
 * @returns Route coordinates along actual roads
 */
export async function getRouteFromMapbox(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  accessToken: string
): Promise<RouteCoordinates | null> {
  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}?geometries=geojson&overview=full&steps=true&access_token=${accessToken}`
    
    const response = await fetch(url)
    const data = await response.json()

    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const route = data.routes[0]
      const coordinates = route.geometry.coordinates as number[][]
      
      return {
        coordinates,
        distance: route.distance, // meters
        duration: route.duration // seconds
      }
    }
    
    return null
  } catch (error) {
    console.error('Error fetching route from Mapbox:', error)
    // Fallback to straight line if API fails
    return {
      coordinates: [[startLng, startLat], [endLng, endLat]],
      distance: 0,
      duration: 0
    }
  }
}

/**
 * Get multiple routes for different destinations
 */
export async function getRoutesForLandmarks(
  landmarks: Array<{ lat: number, lng: number, name: string }>,
  accessToken: string
): Promise<Map<string, RouteCoordinates>> {
  const routes = new Map<string, RouteCoordinates>()
  
  // Create routes between adjacent landmarks
  for (let i = 0; i < landmarks.length - 1; i++) {
    const start = landmarks[i]
    const end = landmarks[i + 1]
    
    const routeName = `${start.name} to ${end.name}`
    const route = await getRouteFromMapbox(
      start.lat,
      start.lng,
      end.lat,
      end.lng,
      accessToken
    )
    
    if (route) {
      routes.set(routeName, route)
    }
  }
  
  return routes
}

/**
 * Calculate position along route based on speed and time
 * @param route - Route coordinates
 * @param speed - Speed in km/h
 * @param timeElapsed - Time elapsed in seconds
 * @returns Current position [lng, lat] along route
 */
export function getPositionAlongRoute(
  route: RouteCoordinates,
  speed: number, // km/h
  timeElapsed: number // seconds
): [number, number] {
  const coordinates = route.coordinates
  if (coordinates.length < 2) {
    return coordinates[0] as [number, number]
  }

  // Calculate distance traveled (speed in km/h * time in hours = distance in km)
  const distanceTraveled = (speed / 3600) * timeElapsed * 1000 // Convert to meters
  
  // Calculate cumulative distances along route
  let cumulativeDistance = 0
  let currentIndex = 0
  
  for (let i = 0; i < coordinates.length - 1; i++) {
    const p1 = coordinates[i]
    const p2 = coordinates[i + 1]
    
    // Calculate distance between two points (Haversine formula)
    const segmentDistance = calculateDistance(p1[1], p1[0], p2[1], p2[0])
    
    if (cumulativeDistance + segmentDistance >= distanceTraveled) {
      currentIndex = i
      break
    }
    
    cumulativeDistance += segmentDistance
    currentIndex = i + 1
  }
  
  // If we've reached the end, return the last coordinate
  if (currentIndex >= coordinates.length - 1) {
    return coordinates[coordinates.length - 1] as [number, number]
  }
  
  // Interpolate position within current segment
  const p1 = coordinates[currentIndex]
  const p2 = coordinates[currentIndex + 1]
  const segmentDistance = calculateDistance(p1[1], p1[0], p2[1], p2[0])
  const remainingDistance = distanceTraveled - cumulativeDistance
  const ratio = remainingDistance / segmentDistance
  
  return [
    p1[0] + (p2[0] - p1[0]) * ratio,
    p1[1] + (p2[1] - p1[1]) * ratio
  ]
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000 // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

