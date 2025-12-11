// Alert detection service
const supabase = require('../config/supabase');

const DEFAULT_SPEED_LIMIT = parseInt(process.env.DEFAULT_SPEED_LIMIT) || 60;

/**
 * Get overspeeding limit from simulator settings
 * @returns {Promise<number>} - Speed limit in km/h
 */
async function getOverspeedingLimit() {
  try {
    const { data } = await supabase
      .from('simulator_settings')
      .select('overspeeding_limit')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();
    
    return data?.overspeeding_limit || DEFAULT_SPEED_LIMIT;
  } catch (error) {
    console.warn('Could not fetch overspeeding limit, using default:', error.message);
    return DEFAULT_SPEED_LIMIT;
  }
}

/**
 * Log vehicle event to vehicle_events table
 * @param {Object} eventData - Event data
 */
async function logVehicleEvent(eventData) {
  try {
    await supabase
      .from('vehicle_events')
      .insert({
        vehicle_id: eventData.vehicle_id,
        event_type: eventData.event_type,
        latitude: eventData.latitude,
        longitude: eventData.longitude,
        speed: eventData.speed || null,
        previous_value: eventData.previous_value || null,
        new_value: eventData.new_value || null,
        description: eventData.description || null
      });
  } catch (error) {
    // Don't fail if event logging fails
    console.warn('Warning: Could not log vehicle event:', error.message);
  }
}

/**
 * Check if vehicle is over-speeding
 * @param {Object} vehicleData - Current vehicle data
 * @param {number} speedLimit - Speed limit in km/h
 * @returns {boolean} - True if over-speeding
 */
function checkOverSpeed(vehicleData, speedLimit = DEFAULT_SPEED_LIMIT) {
  return vehicleData.speed > speedLimit;
}

/**
 * Detect if an accident occurred based on speed drop
 * @param {Object} currentData - Current vehicle data
 * @param {Object} previousData - Previous vehicle data
 * @returns {boolean} - True if accident detected
 */
function detectAccident(currentData, previousData) {
  if (!previousData) return false;

  // Accident detection logic:
  // 1. Sudden speed drop (from 30+ km/h to 0 in less than 3 seconds)
  // 2. Large deceleration (speed dropped by more than 30 km/h in short time)
  const speedDrop = previousData.speed - currentData.speed;
  const timeDiff = new Date(currentData.timestamp) - new Date(previousData.timestamp);
  const timeDiffSeconds = timeDiff / 1000;

  // Check for sudden stop (speed goes to 0 from 30+)
  if (previousData.speed >= 30 && currentData.speed === 0 && timeDiffSeconds <= 3) {
    return true;
  }

  // Check for extreme deceleration (more than 40 km/h drop in less than 2 seconds)
  if (speedDrop > 40 && timeDiffSeconds <= 2) {
    return true;
  }

  return false;
}

/**
 * Create an alert record in database
 * @param {string} vehicleId - Vehicle ID
 * @param {string} alertType - Type of alert ('overspeeding' or 'accident')
 * @param {Object} vehicleData - Vehicle data at time of alert
 * @returns {Promise<Object>} - Created alert record
 */
async function createAlert(vehicleId, alertType, vehicleData) {
  const severity = alertType === 'accident' ? 'high' : 'medium';

  const { data, error } = await supabase
    .from('alerts')
    .insert({
      vehicle_id: vehicleId,
      alert_type: alertType,
      latitude: vehicleData.latitude,
      longitude: vehicleData.longitude,
      speed_at_alert: vehicleData.speed,
      severity: severity,
      resolved: false
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating alert:', error);
    throw error;
  }

  return data;
}

/**
 * Process vehicle data and detect alerts
 * @param {Object} vehicleData - Current vehicle data
 * @param {Object} previousData - Previous vehicle data (optional)
 * @returns {Promise<Object|null>} - Alert object if detected, null otherwise
 */
async function processAlerts(vehicleData, previousData = null) {
  let alert = null;
  const speedLimit = await getOverspeedingLimit();

  // Check for over-speeding
  if (checkOverSpeed(vehicleData, speedLimit)) {
    // Update vehicle status
    await supabase
      .from('vehicles')
      .update({ status: 'overspeeding' })
      .eq('vehicle_id', vehicleData.vehicle_id);

    // Only create alert if not already in overspeeding status
    if (!previousData || previousData.status !== 'overspeeding') {
      alert = await createAlert(vehicleData.vehicle_id, 'overspeeding', vehicleData);
      
      // Log event
      await logVehicleEvent({
        vehicle_id: vehicleData.vehicle_id,
        event_type: 'overspeeding',
        latitude: vehicleData.latitude,
        longitude: vehicleData.longitude,
        speed: vehicleData.speed,
        previous_value: previousData?.status || 'normal',
        new_value: 'overspeeding',
        description: `Vehicle exceeded speed limit of ${speedLimit} km/h (current speed: ${vehicleData.speed} km/h)`
      });
      
      console.log(`⚠️ Over-speeding alert for vehicle ${vehicleData.vehicle_id}: ${vehicleData.speed} km/h (limit: ${speedLimit} km/h)`);
    }
  }

  // Check for accident
  if (previousData && detectAccident(vehicleData, previousData)) {
    // Update vehicle status
    await supabase
      .from('vehicles')
      .update({ status: 'accident' })
      .eq('vehicle_id', vehicleData.vehicle_id);

    alert = await createAlert(vehicleData.vehicle_id, 'accident', vehicleData);
    
    // Log event
    await logVehicleEvent({
      vehicle_id: vehicleData.vehicle_id,
      event_type: 'accident',
      latitude: vehicleData.latitude,
      longitude: vehicleData.longitude,
      speed: vehicleData.speed,
      previous_value: previousData.status || 'normal',
      new_value: 'accident',
      description: `Accident detected - speed dropped from ${previousData.speed} km/h to ${vehicleData.speed} km/h`
    });
    
    console.log(`🚨 ACCIDENT DETECTED for vehicle ${vehicleData.vehicle_id} at ${vehicleData.latitude}, ${vehicleData.longitude}`);
  }

  // Log status change events
  if (previousData && previousData.status !== vehicleData.status) {
    await logVehicleEvent({
      vehicle_id: vehicleData.vehicle_id,
      event_type: 'status_change',
      latitude: vehicleData.latitude,
      longitude: vehicleData.longitude,
      speed: vehicleData.speed,
      previous_value: previousData.status,
      new_value: vehicleData.status,
      description: `Status changed from ${previousData.status} to ${vehicleData.status}`
    });
  }

  // Reset to normal if speed is within limit and no accident
  if (vehicleData.status === 'overspeeding' && !checkOverSpeed(vehicleData, speedLimit)) {
    await supabase
      .from('vehicles')
      .update({ status: 'normal' })
      .eq('vehicle_id', vehicleData.vehicle_id);
  }

  // Log route changes
  if (previousData && previousData.route_name !== vehicleData.route_name) {
    await logVehicleEvent({
      vehicle_id: vehicleData.vehicle_id,
      event_type: 'route_change',
      latitude: vehicleData.latitude,
      longitude: vehicleData.longitude,
      speed: vehicleData.speed,
      previous_value: previousData.route_name || 'N/A',
      new_value: vehicleData.route_name || 'N/A',
      description: `Route changed to ${vehicleData.route_name || 'N/A'}`
    });
  }

  return alert;
}

module.exports = {
  checkOverSpeed,
  detectAccident,
  createAlert,
  processAlerts,
  getOverspeedingLimit,
  logVehicleEvent
};

