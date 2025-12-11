// Vehicle simulator - Generates realistic vehicle data
const { faker } = require('@faker-js/faker');
const config = require('./config');
const scenarios = require('./scenarios');
const axios = require('axios');

class VehicleSimulator {
  constructor() {
    this.vehicles = new Map(); // Store vehicle state
    this.scenarios = ['normalDriving', 'overspeeding', 'accident', 'stationary'];
    this.routeCache = new Map(); // Cache fetched routes
    this.startTimes = new Map(); // Track when each vehicle started on route
    this.initializeVehicles();
  }

  /**
   * Initialize vehicles with starting positions at real Bengaluru landmarks
   */
  initializeVehicles() {
    const vehicleIds = config.VEHICLE_IDS.slice(0, config.VEHICLE_COUNT);
    const landmarks = config.LANDMARKS || [];
    
    vehicleIds.forEach((vehicleId, index) => {
      let startLat, startLng, routeName;
      
      // Use real landmarks if available, otherwise spread around center
      if (landmarks.length > 0 && landmarks[index]) {
        // Start at a real landmark
        const landmark = landmarks[index];
        startLat = landmark.lat;
        startLng = landmark.lng;
        routeName = landmark.name;
      } else {
        // Spread vehicles around center point
        const latOffset = (Math.random() - 0.5) * config.LAT_RANGE;
        const lngOffset = (Math.random() - 0.5) * config.LNG_RANGE;
        startLat = config.DEFAULT_LAT + latOffset;
        startLng = config.DEFAULT_LNG + lngOffset;
        routeName = `Route ${index + 1}`;
      }

      // Calculate direction towards a random landmark or destination
      let direction = 0;
      if (landmarks.length > 1 && Math.random() > 0.5) {
        const dest = landmarks[Math.floor(Math.random() * landmarks.length)];
        // Calculate bearing towards destination
        const dLng = dest.lng - startLng;
        const y = Math.sin(dLng) * Math.cos(dest.lat);
        const x = Math.cos(startLat) * Math.sin(dest.lat) - Math.sin(startLat) * Math.cos(dest.lat) * Math.cos(dLng);
        direction = (Math.atan2(y, x) * 180) / Math.PI;
      } else {
        direction = Math.random() * 360; // Random direction
      }

      // Assign a route if available
      let assignedRoute = null;
      if (config.ROUTES && config.ROUTES.length > 0) {
        assignedRoute = config.ROUTES[index % config.ROUTES.length];
      }

      const vehicleData = {
        vehicle_id: vehicleId,
        latitude: startLat,
        longitude: startLng,
        speed: Math.floor(Math.random() * 30) + 30, // 30-60 km/h (normal city speed)
        status: 'normal',
        route_name: routeName,
        direction: direction,
        scenario: 'normalDriving',
        previousSpeed: null,
        targetLandmark: assignedRoute ? {
          lat: assignedRoute.endLat,
          lng: assignedRoute.endLng,
          name: assignedRoute.name
        } : null,
        startLandmark: {
          lat: startLat,
          lng: startLng,
          name: routeName
        },
        routeCoordinates: null, // Will be fetched from Mapbox
        routeStartTime: null, // Track when vehicle started on route
        routeProgress: 0 // Progress along route (0-1)
      };

      this.vehicles.set(vehicleId, vehicleData);
      
      // Store start time for route calculation
      this.startTimes.set(vehicleId, Date.now());
      
      // Fetch route for vehicle if it has a target
      if (vehicleData.targetLandmark) {
        // Fetch route asynchronously (will be used in next movement cycle)
        this.fetchRouteForVehicle(vehicleId).then(routeData => {
          const v = this.vehicles.get(vehicleId);
          if (routeData && v) {
            v.routeCoordinates = routeData.coordinates;
            v.routeStartTime = Date.now();
          }
        }).catch(err => {
          console.error(`Error fetching initial route for ${vehicleId}:`, err.message);
        });
      }
    });
  }

  /**
   * Fetch route from Mapbox Directions API (async, called once per route)
   */
  async fetchRouteForVehicle(vehicleId) {
    const vehicle = this.vehicles.get(vehicleId);
    if (!vehicle || !vehicle.targetLandmark) return null;

    const cacheKey = `${vehicle.startLandmark.lat},${vehicle.startLandmark.lng}-${vehicle.targetLandmark.lat},${vehicle.targetLandmark.lng}`;
    
    // Check cache first
    if (this.routeCache.has(cacheKey)) {
      return this.routeCache.get(cacheKey);
    }

    // Fetch from Mapbox (only if MAPBOX_TOKEN is available)
    const mapboxToken = process.env.MAPBOX_TOKEN;
    if (!mapboxToken) {
      // Fallback: use straight line interpolation
      return {
        coordinates: [[vehicle.startLandmark.lng, vehicle.startLandmark.lat], 
                      [vehicle.targetLandmark.lng, vehicle.targetLandmark.lat]],
        distance: 0,
        duration: 0
      };
    }

    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${vehicle.startLandmark.lng},${vehicle.startLandmark.lat};${vehicle.targetLandmark.lng},${vehicle.targetLandmark.lat}?geometries=geojson&overview=full&access_token=${mapboxToken}`;
      
      const response = await axios.get(url);
      const data = response.data;

      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const routeData = {
          coordinates: route.geometry.coordinates,
          distance: route.distance,
          duration: route.duration
        };
        
        // Cache it
        this.routeCache.set(cacheKey, routeData);
        return routeData;
      }
    } catch (error) {
      console.error(`Error fetching route for ${vehicleId}:`, error.message);
    }

    // Fallback to straight line
    return {
      coordinates: [[vehicle.startLandmark.lng, vehicle.startLandmark.lat], 
                    [vehicle.targetLandmark.lng, vehicle.targetLandmark.lat]],
      distance: 0,
      duration: 0
    };
  }

  /**
   * Get position along route based on speed and time (like Google Maps navigation)
   */
  getPositionAlongRoute(routeCoordinates, speed, timeElapsed) {
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
      const R = 6371000; // Earth radius in meters
      const dLat = (p2[1] - p1[1]) * Math.PI / 180;
      const dLon = (p2[0] - p1[0]) * Math.PI / 180;
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(p1[1] * Math.PI / 180) * Math.cos(p2[1] * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const segmentDistance = R * c;
      
      if (cumulativeDistance + segmentDistance >= distanceTraveled) {
        currentIndex = i;
        break;
      }
      
      cumulativeDistance += segmentDistance;
      currentIndex = i + 1;
    }
    
    // If we've reached the end, return the last coordinate
    if (currentIndex >= routeCoordinates.length - 1) {
      const lastCoord = routeCoordinates[routeCoordinates.length - 1];
      return lastCoord;
    }
    
    // Interpolate position within current segment
    const p1 = routeCoordinates[currentIndex];
    const p2 = routeCoordinates[currentIndex + 1];
    
    const R = 6371000;
    const dLat = (p2[1] - p1[1]) * Math.PI / 180;
    const dLon = (p2[0] - p1[0]) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(p1[1] * Math.PI / 180) * Math.cos(p2[1] * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const segmentDistance = R * c;
    const remainingDistance = distanceTraveled - cumulativeDistance;
    const ratio = segmentDistance > 0 ? remainingDistance / segmentDistance : 0;
    
    return [
      p1[0] + (p2[0] - p1[0]) * ratio,
      p1[1] + (p2[1] - p1[1]) * ratio
    ];
  }

  /**
   * Generate realistic movement for vehicle along actual routes (like Google Maps)
   */
  generateMovement(vehicleId) {
    const vehicle = this.vehicles.get(vehicleId);
    if (!vehicle) return null;

    // If vehicle has a target landmark and route, move along actual route
    if (vehicle.targetLandmark && vehicle.routeCoordinates) {
      // Calculate time elapsed since route start
      const routeStartTime = vehicle.routeStartTime || this.startTimes.get(vehicleId) || Date.now();
      if (!vehicle.routeStartTime) {
        vehicle.routeStartTime = routeStartTime;
      }
      
      const timeElapsed = (Date.now() - routeStartTime) / 1000; // seconds
      
      // Get position along route based on speed and time
      const position = this.getPositionAlongRoute(
        vehicle.routeCoordinates,
        vehicle.speed,
        timeElapsed
      );
      
      vehicle.longitude = position[0];
      vehicle.latitude = position[1];
      
      // Calculate progress along route (0-1)
      if (vehicle.routeCoordinates.length > 1) {
        // Find closest point on route to calculate progress
        let minDist = Infinity;
        let closestIndex = 0;
        
        for (let i = 0; i < vehicle.routeCoordinates.length; i++) {
          const coord = vehicle.routeCoordinates[i];
          const dist = Math.sqrt(
            Math.pow(coord[0] - vehicle.longitude, 2) +
            Math.pow(coord[1] - vehicle.latitude, 2)
          );
          if (dist < minDist) {
            minDist = dist;
            closestIndex = i;
          }
        }
        
        vehicle.routeProgress = closestIndex / (vehicle.routeCoordinates.length - 1);
      }
      
      // Check if reached destination (within 100m)
      const lastCoord = vehicle.routeCoordinates[vehicle.routeCoordinates.length - 1];
      const distanceToEnd = Math.sqrt(
        Math.pow(lastCoord[0] - vehicle.longitude, 2) +
        Math.pow(lastCoord[1] - vehicle.latitude, 2)
      );
      
      if (distanceToEnd < 0.001) { // ~100m threshold
        // Reached destination - choose new route
        const landmarks = config.LANDMARKS || [];
        if (landmarks.length > 1) {
          // Choose random destination (different from current)
          const destinations = landmarks.filter(l => 
            l.name !== vehicle.targetLandmark.name
          );
          if (destinations.length > 0) {
            const newDest = destinations[Math.floor(Math.random() * destinations.length)];
            vehicle.targetLandmark = {
              lat: newDest.lat,
              lng: newDest.lng,
              name: newDest.name
            };
            vehicle.route_name = `${vehicle.startLandmark.name} to ${newDest.name}`;
            vehicle.routeCoordinates = null; // Will be fetched next
            vehicle.routeStartTime = Date.now();
          }
        }
      }
      
      // Calculate direction for marker rotation
      if (vehicle.routeCoordinates && vehicle.routeCoordinates.length > 1) {
        // Find next point on route
        let nextIndex = Math.min(
          Math.floor(vehicle.routeProgress * (vehicle.routeCoordinates.length - 1)) + 1,
          vehicle.routeCoordinates.length - 1
        );
        const nextPoint = vehicle.routeCoordinates[nextIndex];
        const currentPoint = vehicle.routeCoordinates[Math.floor(vehicle.routeProgress * (vehicle.routeCoordinates.length - 1))];
        
        if (nextPoint && currentPoint) {
          vehicle.direction = Math.atan2(
            nextPoint[1] - currentPoint[1],
            nextPoint[0] - currentPoint[0]
          ) * 180 / Math.PI;
        }
      }
    } else if (vehicle.targetLandmark) {
      // No route yet - fetch it (will be used next iteration)
      this.fetchRouteForVehicle(vehicleId).then(routeData => {
        if (routeData && vehicle) {
          vehicle.routeCoordinates = routeData.coordinates;
          vehicle.routeStartTime = Date.now();
        }
      }).catch(err => {
        console.error(`Error fetching route for ${vehicleId}:`, err);
      });
      
      // Fallback: move directly towards target for now
      const dLng = vehicle.targetLandmark.lng - vehicle.longitude;
      const dLat = vehicle.targetLandmark.lat - vehicle.latitude;
      const bearing = Math.atan2(dLng, dLat) * 180 / Math.PI;
      vehicle.direction = bearing;
      
      // Update position based on speed and direction
      const speedInDegreesPerSecond = vehicle.speed * 0.000277 * (config.SIMULATOR_INTERVAL / 1000);
      const directionRad = (vehicle.direction * Math.PI) / 180;
      const latOffset = Math.cos(directionRad) * speedInDegreesPerSecond;
      const lngOffset = Math.sin(directionRad) * speedInDegreesPerSecond;
      
      vehicle.latitude += latOffset;
      vehicle.longitude += lngOffset;
    } else {
      // No target - random movement
      if (Math.random() < 0.1) {
        vehicle.direction += (Math.random() - 0.5) * 30;
      }
      
      const speedInDegreesPerSecond = vehicle.speed * 0.000277 * (config.SIMULATOR_INTERVAL / 1000);
      const directionRad = (vehicle.direction * Math.PI) / 180;
      const latOffset = Math.cos(directionRad) * speedInDegreesPerSecond;
      const lngOffset = Math.sin(directionRad) * speedInDegreesPerSecond;
      
      vehicle.latitude += latOffset;
      vehicle.longitude += lngOffset;
    }
    
    // Keep within bounds
    vehicle.latitude = Math.max(
      config.DEFAULT_LAT - config.LAT_RANGE,
      Math.min(config.DEFAULT_LAT + config.LAT_RANGE, vehicle.latitude)
    );
    vehicle.longitude = Math.max(
      config.DEFAULT_LNG - config.LNG_RANGE,
      Math.min(config.DEFAULT_LNG + config.LNG_RANGE, vehicle.longitude)
    );

    return vehicle;
  }

  /**
   * Generate vehicle data based on scenario
   */
  generateVehicleData(vehicleId) {
    const vehicle = this.vehicles.get(vehicleId);
    if (!vehicle) return null;

    // Store previous speed for accident detection
    vehicle.previousSpeed = vehicle.speed;

    // Generate movement
    this.generateMovement(vehicleId);

    // Apply scenario logic
    const baseData = {
      latitude: vehicle.latitude,
      longitude: vehicle.longitude,
      route_name: vehicle.route_name
    };

    let vehicleData;

    switch (vehicle.scenario) {
      case 'normalDriving':
        vehicleData = scenarios.normalDriving(vehicleId, baseData);
        // Randomly switch to overspeeding (10% chance)
        if (Math.random() < 0.1) {
          vehicle.scenario = 'overspeeding';
          vehicleData = scenarios.overspeeding(vehicleId, baseData);
        }
        break;

      case 'overspeeding':
        vehicleData = scenarios.overspeeding(vehicleId, baseData);
        // Randomly return to normal (20% chance)
        if (Math.random() < 0.2) {
          vehicle.scenario = 'normalDriving';
          vehicleData = scenarios.normalDriving(vehicleId, baseData);
        }
        // Randomly trigger accident (2% chance)
        if (Math.random() < 0.02) {
          vehicle.scenario = 'accident';
          vehicleData = scenarios.accident(vehicleId, baseData);
        }
        break;

      case 'accident':
        // Once in accident, stay in accident
        vehicleData = scenarios.accident(vehicleId, baseData);
        break;

      case 'stationary':
        vehicleData = scenarios.stationary(vehicleId, baseData);
        // Start moving again (30% chance)
        if (Math.random() < 0.3) {
          vehicle.scenario = 'normalDriving';
          vehicleData = scenarios.normalDriving(vehicleId, baseData);
        }
        break;

      default:
        vehicleData = scenarios.normalDriving(vehicleId, baseData);
    }

    // Update vehicle state
    vehicle.speed = vehicleData.speed;
    vehicle.status = vehicleData.status;

    return vehicleData;
  }

  /**
   * Generate data for all vehicles
   */
  generateAllVehiclesData() {
    const allData = [];
    
    for (const vehicleId of this.vehicles.keys()) {
      const data = this.generateVehicleData(vehicleId);
      if (data) {
        allData.push(data);
      }
    }

    return allData;
  }

  /**
   * Set scenario for specific vehicle
   */
  setScenario(vehicleId, scenarioName) {
    const vehicle = this.vehicles.get(vehicleId);
    if (vehicle && scenarios[scenarioName]) {
      vehicle.scenario = scenarioName;
      return true;
    }
    return false;
  }

  /**
   * Get vehicle state
   */
  getVehicle(vehicleId) {
    return this.vehicles.get(vehicleId);
  }

  /**
   * Get all vehicles
   */
  getAllVehicles() {
    return Array.from(this.vehicles.values());
  }
}

module.exports = VehicleSimulator;

