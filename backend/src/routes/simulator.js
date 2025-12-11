// Simulator control routes
const express = require('express');
const router = express.Router();
const simulatorService = require('../services/simulatorService');

/**
 * Start simulator
 */
router.post('/start', async (req, res) => {
  try {
    // Fetch settings from database
    const supabase = require('../config/supabase');
    const { data: settings } = await supabase
      .from('simulator_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    const maxVehicles = settings?.max_vehicles || 3;
    const vehicleCount = Math.min(req.body.vehicleCount || maxVehicles, maxVehicles);

    // Pass settings to simulator service
    const state = simulatorService.startSimulator(vehicleCount, settings);
    
    res.json({
      success: true,
      message: 'Simulator started successfully',
      data: state
    });
  } catch (error) {
    console.error('Error starting simulator:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Stop simulator
 */
router.post('/stop', async (req, res) => {
  try {
    const result = simulatorService.stopSimulator();
    
    res.json({
      success: true,
      message: 'Simulator stopped successfully',
      data: result
    });
  } catch (error) {
    console.error('Error stopping simulator:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get simulator status
 */
router.get('/status', (req, res) => {
  try {
    const status = simulatorService.getStatus();
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get simulator settings
 */
router.get('/settings', async (req, res) => {
  try {
    const supabase = require('../config/supabase');
    const { data, error } = await supabase
      .from('simulator_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    const settings = data || {
      max_vehicles: 3,
      overspeeding_limit: 60,
      update_interval: 5000
    };

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Update simulator settings
 */
router.put('/settings', async (req, res) => {
  try {
    const { max_vehicles, overspeeding_limit, update_interval } = req.body;
    
    if (max_vehicles < 1 || max_vehicles > 6) {
      return res.status(400).json({
        success: false,
        error: 'max_vehicles must be between 1 and 6'
      });
    }

    if (overspeeding_limit < 40 || overspeeding_limit > 120) {
      return res.status(400).json({
        success: false,
        error: 'overspeeding_limit must be between 40 and 120'
      });
    }

    const supabase = require('../config/supabase');
    
    // Get existing settings
    const { data: existing } = await supabase
      .from('simulator_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    const settingsData = {
      max_vehicles: max_vehicles || 3,
      overspeeding_limit: overspeeding_limit || 60,
      update_interval: update_interval || 5000,
      updated_at: new Date().toISOString()
    };

    let result;
    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('simulator_settings')
        .update(settingsData)
        .eq('setting_id', existing.setting_id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Create new
      const { data, error } = await supabase
        .from('simulator_settings')
        .insert(settingsData)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

