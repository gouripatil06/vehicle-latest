// Vehicle routes
const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// Get all vehicles
router.get('/', vehicleController.getAllVehicles);

// Get single vehicle by ID
router.get('/:id', vehicleController.getVehicleById);

// Create or update vehicle
router.post('/', vehicleController.createOrUpdateVehicle);

// Update vehicle
router.put('/:id', vehicleController.updateVehicle);

// Update vehicle details (name, number, registration, etc.)
router.put('/:id/details', vehicleController.updateVehicleDetails);

// Delete vehicle
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;

