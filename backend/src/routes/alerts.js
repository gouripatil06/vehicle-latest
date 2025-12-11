// Alert routes
const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

// Get all alerts
router.get('/', alertController.getAllAlerts);

// Get recent alerts (last 24h by default)
router.get('/recent', alertController.getRecentAlerts);

// Get alerts for specific vehicle
router.get('/vehicle/:vehicleId', alertController.getAlertsByVehicleId);

// Create alert manually (for testing)
router.post('/', alertController.createAlert);

module.exports = router;

