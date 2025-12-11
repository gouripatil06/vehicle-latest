// Test scenarios for vehicle simulation

/**
 * Scenario 1: Normal Driving
 * Vehicle moves at normal speed (30-60 km/h)
 */
function normalDriving(vehicleId, baseData) {
  return {
    ...baseData,
    vehicle_id: vehicleId,
    speed: Math.floor(Math.random() * 30) + 30, // 30-60 km/h
    status: 'normal'
  };
}

/**
 * Scenario 2: Over-speeding
 * Vehicle exceeds speed limit (70-90 km/h in 60 zone)
 */
function overspeeding(vehicleId, baseData) {
  return {
    ...baseData,
    vehicle_id: vehicleId,
    speed: Math.floor(Math.random() * 20) + 70, // 70-90 km/h
    status: 'overspeeding'
  };
}

/**
 * Scenario 3: Accident Simulation
 * Vehicle comes to sudden stop (speed drops to 0)
 */
function accident(vehicleId, baseData) {
  return {
    ...baseData,
    vehicle_id: vehicleId,
    speed: 0,
    status: 'accident'
  };
}

/**
 * Scenario 4: Stationary Vehicle
 * Vehicle is parked/stopped
 */
function stationary(vehicleId, baseData) {
  return {
    ...baseData,
    vehicle_id: vehicleId,
    speed: 0,
    status: 'normal'
  };
}

module.exports = {
  normalDriving,
  overspeeding,
  accident,
  stationary
};

