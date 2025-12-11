// Route Service - Fetch real routes from Mapbox Directions API
const axios = require('axios');

/**
 * Get real route from Mapbox Directions API (like Google Maps navigation)
 * @param {number} startLat - Starting latitude
 * @param {number} startLng - Starting longitude
 * @param {number} endLat - Ending latitude
 * @param {number} endLng - Ending longitude
 * @param {string} accessToken - Mapbox access token
 * @returns {Promise<Object|null>} Route coordinates along actual roads
 */
async function getRouteFromMapbox(startLat, startLng, endLat, endLng, accessToken) {
  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}?geometries=geojson&overview=full&steps=true&access_token=${accessToken}`;
    
    const response = await axios.get(url);
    const data = response.data;

    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const coordinates = route.geometry.coordinates; // Array of [lng, lat] pairs
      
      return {
        coordinates,
        distance: route.distance, // meters
        duration: route.duration, // seconds
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching route from Mapbox:', error.message);
    // Fallback to straight line if API fails
    return {
      coordinates: [[startLng, startLat], [endLng, endLat]],
      distance: 0,
      duration: 0
    };
  }
}

/**
 * Calculate position along route based on speed and time
 * @param {Array} routeCoordinates - Route coordinates [[lng, lat], ...]
 * @param {number} speed - Speed in km/h
 * @param {number} timeElapsed - Time elapsed in seconds since start
 * @returns {Array} Current position [lng, lat] along route
 */
function getPositionAlongRoute(routeCoordinates, speed, timeElapsed) {
  if (!routeCoordinates || routeCoordinates.length < 2) {
    return routeCoordinates[0] || [0, 0];
  }

  // Calculate distance traveled (speed in km/h * time in hours = distance in km)
  const distanceTraveled = (speed / 3600) * timeElapsed * 1000; // Convert to meters
  
  // Calculate cumulative distances along route
  let cumulativeDistance = 0;
  let currentIndex = 0;
  
  for (let i = 0; i < routeCoordinates.length - 1; i++) {
    const p1 = routeCoordinates[i];
    const p2 = routeCoordinates[i + 1];
    
    // Calculate distance between two points (Haversine formula)
    const segmentDistance = calculateDistance(p1[1], p1[0], p2[1], p2[0]);
    
    if (cumulativeDistance + segmentDistance >= distanceTraveled) {
      currentIndex = i;
      break;
    }
    
    cumulativeDistance += segmentDistance;
    currentIndex = i + 1;
  }
  
  // If we've reached the end, return the last coordinate
  if (currentIndex >= routeCoordinates.length - 1) {
    return routeCoordinates[routeCoordinates.length - 1];
  }
  
  // Interpolate position within current segment
  const p1 = routeCoordinates[currentIndex];
  const p2 = routeCoordinates[currentIndex + 1];
  const segmentDistance = calculateDistance(p1[1], p1[0], p2[1], p2[0]);
  const remainingDistance = distanceTraveled - cumulativeDistance;
  const ratio = segmentDistance > 0 ? remainingDistance / segmentDistance : 0;
  
  return [
    p1[0] + (p2[0] - p1[0]) * ratio,
    p1[1] + (p2[1] - p1[1]) * ratio
  ];
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports = {
  getRouteFromMapbox,
  getPositionAlongRoute,
  calculateDistance
};

