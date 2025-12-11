// Alert controller - Handle HTTP requests for alerts
const supabase = require('../config/supabase');

/**
 * Get all alerts
 */
async function getAllAlerts(req, res) {
  try {
    const { limit = 100, resolved } = req.query;

    let query = supabase
      .from('alerts')
      .select('*')
      .order('timestamp', { ascending: false });

    if (resolved !== undefined) {
      query = query.eq('resolved', resolved === 'true');
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error in getAllAlerts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Get alerts for specific vehicle
 */
async function getAlertsByVehicleId(req, res) {
  try {
    const { vehicleId } = req.params;
    const { limit = 50 } = req.query;

    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('timestamp', { ascending: false })
      .limit(parseInt(limit));

    if (error) {
      throw error;
    }

    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error in getAlertsByVehicleId:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Get recent alerts (last 24 hours)
 */
async function getRecentAlerts(req, res) {
  try {
    const { hours = 24 } = req.query;
    const hoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .gte('timestamp', hoursAgo)
      .order('timestamp', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error in getRecentAlerts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Create alert manually (for testing)
 */
async function createAlert(req, res) {
  try {
    const alertData = req.body;

    // Validate required fields
    if (!alertData.vehicle_id || !alertData.alert_type) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: vehicle_id, alert_type'
      });
    }

    const { data, error } = await supabase
      .from('alerts')
      .insert(alertData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error in createAlert:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  getAllAlerts,
  getAlertsByVehicleId,
  getRecentAlerts,
  createAlert
};

