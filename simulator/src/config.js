// Simulator configuration
require('dotenv').config();

module.exports = {
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000',
  SIMULATOR_INTERVAL: parseInt(process.env.SIMULATOR_INTERVAL) || 5000, // 5 seconds default
  VEHICLE_COUNT: parseInt(process.env.VEHICLE_COUNT) || 3,
  
  // Bengaluru Landmarks (Real recognizable locations for teachers)
  // Using actual coordinates of popular Bengaluru locations
  LANDMARKS: [
    { name: 'MG Road', lat: 12.9750, lng: 77.6093 }, // Mahatma Gandhi Road - Central Bangalore
    { name: 'Electronic City', lat: 12.8456, lng: 77.6633 }, // IT Hub - South Bangalore
    { name: 'Whitefield', lat: 12.9698, lng: 77.7499 }, // IT Hub - East Bangalore
    { name: 'Koramangala', lat: 12.9352, lng: 77.6245 }, // Popular residential area
    { name: 'Indiranagar', lat: 12.9784, lng: 77.6408 }, // Shopping hub
    { name: 'Marathahalli', lat: 12.9592, lng: 77.6974 }, // IT Corridor
    { name: 'JP Nagar', lat: 12.9078, lng: 77.5852 }, // Residential area
    { name: 'Hebbal', lat: 13.0355, lng: 77.5970 } // North Bangalore
  ],
  
  // Default center (MG Road - Central Bangalore)
  DEFAULT_LAT: 12.9750,
  DEFAULT_LNG: 77.6093,
  LAT_RANGE: 0.15, // ±0.15 degrees (~17 km radius)
  LNG_RANGE: 0.15,
  
  // Speed limits (in km/h)
  DEFAULT_SPEED_LIMIT: 60,
  MIN_SPEED: 20,
  MAX_SPEED: 100,
  
  // Vehicle IDs
  VEHICLE_IDS: ['V001', 'V002', 'V003', 'V004', 'V005'],
  
  // Routes between real landmarks
  ROUTES: [
    { name: 'MG Road to Electronic City', startLat: 12.9750, startLng: 77.6093, endLat: 12.8456, endLng: 77.6633 },
    { name: 'Whitefield to Koramangala', startLat: 12.9698, startLng: 77.7499, endLat: 12.9352, endLng: 77.6245 },
    { name: 'Indiranagar to JP Nagar', startLat: 12.9784, startLng: 77.6408, endLat: 12.9078, endLng: 77.5852 },
    { name: 'Koramangala to Marathahalli', startLat: 12.9352, startLng: 77.6245, endLat: 12.9592, endLng: 77.6974 },
    { name: 'MG Road to Whitefield', startLat: 12.9750, startLng: 77.6093, endLat: 12.9698, endLng: 77.7499 }
  ]
};

