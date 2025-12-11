// Main simulator entry point
require('dotenv').config();
const axios = require('axios');
const config = require('./config');
const VehicleSimulator = require('./vehicleSimulator');

let isRunning = false;
let intervalId = null;
let simulator = null;

/**
 * Send vehicle data to backend API
 */
async function sendVehicleData(vehicleData) {
  try {
    const response = await axios.post(
      `${config.BACKEND_URL}/api/vehicles`,
      vehicleData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(`❌ Error sending data for ${vehicleData.vehicle_id}:`, error.message);
    return null;
  }
}

/**
 * Start simulator
 */
function startSimulator() {
  if (isRunning) {
    console.log('⚠️  Simulator is already running');
    return;
  }

  simulator = new VehicleSimulator();
  isRunning = true;

  console.log('🚗 Starting Vehicle Simulator...');
  console.log(`📡 Backend URL: ${config.BACKEND_URL}`);
  console.log(`⏱️  Update Interval: ${config.SIMULATOR_INTERVAL}ms`);
  console.log(`🚙 Vehicle Count: ${config.VEHICLE_COUNT}`);
  console.log('✅ Simulator started!\n');

  // Start simulation loop
  intervalId = setInterval(async () => {
    const allVehiclesData = simulator.generateAllVehiclesData();

    console.log(`\n📊 [${new Date().toLocaleTimeString()}] Updating vehicles...`);

    // Send data for each vehicle
    for (const vehicleData of allVehiclesData) {
      const result = await sendVehicleData(vehicleData);
      
      if (result && result.success) {
        const statusIcon = vehicleData.status === 'normal' ? '🟢' :
                          vehicleData.status === 'overspeeding' ? '🟡' :
                          vehicleData.status === 'accident' ? '🔴' : '⚪';
        
        console.log(
          `${statusIcon} ${vehicleData.vehicle_id}: ` +
          `${vehicleData.speed} km/h | ` +
          `Lat: ${vehicleData.latitude.toFixed(6)}, ` +
          `Lng: ${vehicleData.longitude.toFixed(6)} | ` +
          `Status: ${vehicleData.status}`
        );
      }
    }
  }, config.SIMULATOR_INTERVAL);

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Stopping simulator...');
    stopSimulator();
    process.exit(0);
  });
}

/**
 * Stop simulator
 */
function stopSimulator() {
  if (!isRunning) {
    return;
  }

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  isRunning = false;
  console.log('✅ Simulator stopped');
}

/**
 * Manual test scenario trigger
 */
function triggerScenario(vehicleId, scenarioName) {
  if (!simulator) {
    console.log('❌ Simulator not started. Run startSimulator() first.');
    return false;
  }

  const success = simulator.setScenario(vehicleId, scenarioName);
  if (success) {
    console.log(`✅ Set ${vehicleId} to scenario: ${scenarioName}`);
  } else {
    console.log(`❌ Failed to set scenario for ${vehicleId}`);
  }
  return success;
}

// Don't auto-start - wait for API call from backend
// The simulator will be controlled via backend API endpoints
if (require.main === module) {
  // Only start if explicitly called with --start flag
  if (process.argv.includes('--start')) {
    startSimulator();
  } else {
    // Don't start automatically - wait for backend API call
    // This prevents infinite running when deployed
    process.exit(0);
  }
}

module.exports = {
  startSimulator,
  stopSimulator,
  triggerScenario
};

