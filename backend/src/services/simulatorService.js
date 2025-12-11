// Simulator service - Controls the vehicle simulator
// Production-ready version that runs simulator logic in-process

let simulatorInterval = null;
let simulator = null;
let simulatorState = {
  isRunning: false,
  startTime: null,
  vehicleCount: 0,
};

/**
 * Start the simulator (in-process version for production)
 * @param {number} vehicleCount - Number of vehicles
 * @param {Object} settings - Simulator settings from database
 */
async function startSimulator(vehicleCount = 3, settings = null) {
  if (simulatorState.isRunning) {
    throw new Error('Simulator is already running');
  }

  // Import simulator dynamically to avoid startup issues if simulator module has errors
  let VehicleSimulator;
  let simulatorConfig;
  
  try {
    // For production: import simulator as a module
    const path = require('path');
    const backendDir = path.join(__dirname, '../..');
    // Try to find simulator in parent directory first (local dev), then in backend folder (Railway)
    let simulatorPath = path.join(backendDir, '..', 'simulator/src');
    
    // If simulator not in parent, try in backend folder (copied during build)
    if (!require('fs').existsSync(simulatorPath)) {
      simulatorPath = path.join(backendDir, 'simulator/src');
    }
    
    // Load simulator class
    const simulatorModule = require(path.join(simulatorPath, 'vehicleSimulator.js'));
    VehicleSimulator = simulatorModule.default || simulatorModule;
    
    // Load config
    simulatorConfig = require(path.join(simulatorPath, 'config.js'));
  } catch (error) {
    console.error('Error loading simulator module:', error);
    throw new Error('Simulator module not available. Make sure simulator code is accessible.');
  }
  
  // Override config with settings if provided
  const effectiveConfig = { ...simulatorConfig };
  if (settings) {
    effectiveConfig.VEHICLE_COUNT = Math.min(vehicleCount, settings.max_vehicles || 6);
    effectiveConfig.SIMULATOR_INTERVAL = settings.update_interval || 5000;
  } else {
    effectiveConfig.VEHICLE_COUNT = vehicleCount;
  }
  
  // Override config temporarily (better would be to pass config to constructor)
  Object.assign(simulatorConfig, effectiveConfig);

  simulator = new VehicleSimulator();
  simulatorState.isRunning = true;
  simulatorState.startTime = new Date();
  simulatorState.vehicleCount = effectiveConfig.VEHICLE_COUNT;

  console.log('🚗 Starting Vehicle Simulator (In-Process)...');
  console.log(`📡 Update Interval: ${effectiveConfig.SIMULATOR_INTERVAL}ms`);
  console.log(`🚙 Vehicle Count: ${simulatorState.vehicleCount}`);

  // Import vehicle service to call directly (in-process, no HTTP needed!)
  const vehicleService = require('./vehicleService');

  // Function to send vehicle data (calls service directly, no HTTP)
  const sendVehicleData = async (vehicleData) => {
    try {
      // Call vehicle service directly - much faster and no CORS issues!
      const result = await vehicleService.upsertVehicle(vehicleData);
      return { success: true, data: result };
    } catch (error) {
      console.error(`❌ Error sending data for ${vehicleData.vehicle_id}:`, error.message);
      return null;
    }
  };

  // Start simulation loop
  simulatorInterval = setInterval(async () => {
    if (!simulatorState.isRunning || !simulator) {
      return;
    }

    try {
      const allVehiclesData = simulator.generateAllVehiclesData();

      // Send data for each vehicle
      for (const vehicleData of allVehiclesData) {
        await sendVehicleData(vehicleData);
      }
    } catch (error) {
      console.error('❌ Error in simulator loop:', error.message);
    }
  }, effectiveConfig.SIMULATOR_INTERVAL);

  console.log('✅ Simulator started!');
  return simulatorState;
}

/**
 * Stop the simulator
 */
function stopSimulator() {
  if (!simulatorState.isRunning) {
    throw new Error('Simulator is not running');
  }

  if (simulatorInterval) {
    clearInterval(simulatorInterval);
    simulatorInterval = null;
  }

  simulator = null;
  const runtime = simulatorState.startTime
    ? Math.floor((new Date() - simulatorState.startTime) / 1000)
    : 0;

  simulatorState.isRunning = false;
  simulatorState.startTime = null;

  console.log(`✅ Simulator stopped. Runtime: ${runtime} seconds`);
  return { runtime: `${runtime} seconds` };
}

/**
 * Get simulator status
 */
function getStatus() {
  return {
    isRunning: simulatorState.isRunning,
    vehicleCount: simulatorState.vehicleCount,
    startTime: simulatorState.startTime,
  };
}

module.exports = {
  startSimulator,
  stopSimulator,
  getStatus,
};
