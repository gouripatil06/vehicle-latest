// Vehicle controller - Handle HTTP requests for vehicles
const vehicleService = require('../services/vehicleService');

/**
 * Get all vehicles
 */
async function getAllVehicles(req, res) {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res.json({ success: true, data: vehicles });
  } catch (error) {
    console.error('Error in getAllVehicles:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Get single vehicle by ID
 */
async function getVehicleById(req, res) {
  try {
    const { id } = req.params;
    const vehicle = await vehicleService.getVehicleById(id);

    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }

    res.json({ success: true, data: vehicle });
  } catch (error) {
    console.error('Error in getVehicleById:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Create or update vehicle
 */
async function createOrUpdateVehicle(req, res) {
  try {
    const vehicleData = req.body;

    // Validate required fields
    if (!vehicleData.vehicle_id || vehicleData.latitude === undefined || vehicleData.longitude === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: vehicle_id, latitude, longitude'
      });
    }

    const vehicle = await vehicleService.upsertVehicle(vehicleData);
    res.json({ success: true, data: vehicle });
  } catch (error) {
    console.error('Error in createOrUpdateVehicle:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Update vehicle
 */
async function updateVehicle(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const vehicle = await vehicleService.updateVehicle(id, updateData);
    res.json({ success: true, data: vehicle });
  } catch (error) {
    console.error('Error in updateVehicle:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Update vehicle details (name, number, registration, etc.)
 */
async function updateVehicleDetails(req, res) {
  try {
    const { id } = req.params;
    const details = req.body;

    const vehicle = await vehicleService.updateVehicleDetails(id, details);
    res.json({ success: true, data: vehicle });
  } catch (error) {
    console.error('Error in updateVehicleDetails:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Delete vehicle
 */
async function deleteVehicle(req, res) {
  try {
    const { id } = req.params;
    await vehicleService.deleteVehicle(id);
    res.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error in deleteVehicle:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  getAllVehicles,
  getVehicleById,
  createOrUpdateVehicle,
  updateVehicle,
  updateVehicleDetails,
  deleteVehicle
};

