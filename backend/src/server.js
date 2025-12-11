// Main Express server entry point
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const { register } = require('./metrics');

// Import routes
const vehicleRoutes = require('./routes/vehicles');
const alertRoutes = require('./routes/alerts');
const simulatorRoutes = require('./routes/simulator');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin requests)
    if (!origin || process.env.CORS_ORIGIN === '*') {
      return callback(null, true);
    }
    // Allow specific origins
    const allowedOrigins = [
      process.env.CORS_ORIGIN,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Prometheus metrics endpoint
app.get('/api/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end(error);
  }
});

// API Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/simulator', simulatorRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;

