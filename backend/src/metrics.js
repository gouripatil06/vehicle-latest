// Prometheus metrics setup
const client = require('prom-client');

// Create a Registry to register the metrics
const register = new client.Registry();

// Add default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ register });

// Custom metrics for vehicle tracking
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeVehicles = new client.Gauge({
  name: 'active_vehicles_count',
  help: 'Number of active vehicles being tracked'
});

const totalAlerts = new client.Counter({
  name: 'alerts_total',
  help: 'Total number of alerts generated',
  labelNames: ['alert_type', 'severity']
});

const vehicleSpeed = new client.Gauge({
  name: 'vehicle_speed_kmh',
  help: 'Current speed of vehicles in km/h',
  labelNames: ['vehicle_id']
});

const simulatorRunning = new client.Gauge({
  name: 'simulator_running',
  help: 'Whether the simulator is currently running (1 = running, 0 = stopped)'
});

// Register all metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(activeVehicles);
register.registerMetric(totalAlerts);
register.registerMetric(vehicleSpeed);
register.registerMetric(simulatorRunning);

module.exports = {
  register,
  httpRequestDuration,
  httpRequestTotal,
  activeVehicles,
  totalAlerts,
  vehicleSpeed,
  simulatorRunning
};

