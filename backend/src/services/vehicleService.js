// Vehicle service - Database operations for vehicles
const supabase = require('../config/supabase');

/**
 * Get all vehicles
 * @returns {Promise<Array>} - Array of vehicles
 */
async function getAllVehicles() {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get single vehicle by ID
 * @param {string} vehicleId - Vehicle ID
 * @returns {Promise<Object|null>} - Vehicle object or null
 */
async function getVehicleById(vehicleId) {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Vehicle not found
    }
    console.error('Error fetching vehicle:', error);
    throw error;
  }

  return data;
}

/**
 * Create or update vehicle
 * @param {Object} vehicleData - Vehicle data
 * @returns {Promise<Object>} - Created/updated vehicle
 */
async function upsertVehicle(vehicleData) {
  const { vehicle_id, latitude, longitude, speed, status, route_name } = vehicleData;

  // Get current vehicle data for alert processing
  const previousData = await getVehicleById(vehicle_id);

  const vehiclePayload = {
    vehicle_id,
    latitude,
    longitude,
    speed: speed || 0,
    status: status || 'normal',
    timestamp: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (route_name) {
    vehiclePayload.route_name = route_name;
  }

  // If vehicle doesn't exist, set created_at
  if (!previousData) {
    vehiclePayload.created_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('vehicles')
    .upsert(vehiclePayload, {
      onConflict: 'vehicle_id'
    })
    .select()
    .single();

  if (error) {
    console.error('Error upserting vehicle:', error);
    throw error;
  }

  // Process alerts (check for over-speeding or accidents)
  const alertService = require('./alertService');
  await alertService.processAlerts(data, previousData);

  // Save to history (optional, for historical tracking)
  try {
    await supabase
      .from('vehicle_history')
      .insert({
        vehicle_id,
        latitude,
        longitude,
        speed: speed || 0,
        timestamp: new Date().toISOString()
      });
  } catch (historyError) {
    // Don't fail if history insert fails
    console.warn('Warning: Could not save to history:', historyError.message);
  }

  return data;
}

/**
 * Update vehicle location and speed
 * @param {string} vehicleId - Vehicle ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated vehicle
 */
async function updateVehicle(vehicleId, updateData) {
  const previousData = await getVehicleById(vehicleId);

  if (!previousData) {
    throw new Error(`Vehicle ${vehicleId} not found`);
  }

  const updatePayload = {
    ...updateData,
    updated_at: new Date().toISOString(),
    timestamp: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('vehicles')
    .update(updatePayload)
    .eq('vehicle_id', vehicleId)
    .select()
    .single();

  if (error) {
    console.error('Error updating vehicle:', error);
    throw error;
  }

  // Process alerts
  const alertService = require('./alertService');
  await alertService.processAlerts(data, previousData);

  return data;
}

/**
 * Update vehicle details (name, number, registration, etc.)
 * @param {string} vehicleId - Vehicle ID
 * @param {Object} details - Vehicle details to update
 * @returns {Promise<Object>} - Updated vehicle
 */
async function updateVehicleDetails(vehicleId, details) {
  const vehicle = await getVehicleById(vehicleId);

  if (!vehicle) {
    throw new Error(`Vehicle ${vehicleId} not found`);
  }

  const updatePayload = {
    vehicle_name: details.vehicle_name,
    vehicle_number: details.vehicle_number,
    registration_number: details.registration_number,
    owner_name: details.owner_name,
    tracking_enabled: details.tracking_enabled,
    notes: details.notes,
    updated_at: new Date().toISOString()
  };

  // Remove undefined fields
  Object.keys(updatePayload).forEach(key => {
    if (updatePayload[key] === undefined) {
      delete updatePayload[key];
    }
  });

  const { data, error } = await supabase
    .from('vehicles')
    .update(updatePayload)
    .eq('vehicle_id', vehicleId)
    .select()
    .single();

  if (error) {
    console.error('Error updating vehicle details:', error);
    throw error;
  }

  return data;
}

/**
 * Delete vehicle
 * @param {string} vehicleId - Vehicle ID
 * @returns {Promise<boolean>} - True if deleted
 */
async function deleteVehicle(vehicleId) {
  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('vehicle_id', vehicleId);

  if (error) {
    console.error('Error deleting vehicle:', error);
    throw error;
  }

  return true;
}

module.exports = {
  getAllVehicles,
  getVehicleById,
  upsertVehicle,
  updateVehicle,
  updateVehicleDetails,
  deleteVehicle
};

