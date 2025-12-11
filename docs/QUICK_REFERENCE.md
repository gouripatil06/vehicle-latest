# 🚀 Quick Reference Guide

## 📦 Dependencies to Install

### Frontend (Next.js)
```bash
cd frontend
pnpm install mapbox-gl @supabase/supabase-js recharts zustand
```

### Backend (Node.js)
```bash
cd backend
npm init -y
npm install express cors dotenv @supabase/supabase-js joi
```

### Simulator
```bash
cd simulator
npm init -y
npm install @supabase/supabase-js dotenv @faker-js/faker
```

## 🔑 Environment Variables Needed

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token (if using Mapbox)
```

### Backend (.env)
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

### Simulator (.env)
```env
BACKEND_URL=http://localhost:5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

## 🗄️ Database Tables (Supabase)

### vehicles
- vehicle_id (text, primary key)
- latitude (float)
- longitude (float)
- speed (integer)
- status (text: normal, overspeeding, accident)
- timestamp (timestamp)
- route_name (text, optional)

### alerts
- alert_id (uuid, primary key)
- vehicle_id (text, foreign key)
- alert_type (text: overspeeding, accident)
- latitude (float)
- longitude (float)
- speed_at_alert (integer)
- timestamp (timestamp)
- severity (text: low, medium, high)

### vehicle_history (optional)
- history_id (uuid, primary key)
- vehicle_id (text, foreign key)
- latitude (float)
- longitude (float)
- speed (integer)
- timestamp (timestamp)

## 🛣️ API Endpoints

### Backend API (http://localhost:5000)

**Vehicles:**
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get single vehicle
- `POST /api/vehicles` - Create/update vehicle
- `PUT /api/vehicles/:id` - Update vehicle location
- `DELETE /api/vehicles/:id` - Delete vehicle

**Alerts:**
- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/:vehicleId` - Get alerts for vehicle
- `POST /api/alerts` - Create alert
- `GET /api/alerts/recent` - Get recent alerts

**Health:**
- `GET /api/health` - Health check

## 🚀 Running the Project

### 1. Start Backend
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

### 2. Start Frontend
```bash
cd frontend
pnpm dev
# Runs on http://localhost:3000
```

### 3. Start Simulator
```bash
cd simulator
npm start
# Sends vehicle data every 2-5 seconds
```

## 📍 Test Coordinates (Bengaluru, India)

Use these coordinates for testing:
- **Latitude Range:** 12.8 - 13.0
- **Longitude Range:** 77.5 - 77.7
- **Center Point:** 12.9716, 77.5946 (Bengaluru City)

## 🎨 Color Scheme

- **Green:** Normal status (vehicles running normally)
- **Yellow:** Caution (over-speeding)
- **Red:** Critical (accidents, alerts)

## 📱 Pages to Create

1. **Dashboard** (`/`) - Main map with all vehicles
2. **Vehicle Details** (`/vehicles/[id]`) - Individual vehicle page
3. **Alerts** (`/alerts`) - All alerts history

## 🔍 Testing Checklist

- [ ] Simulator sends data
- [ ] Backend receives data
- [ ] Supabase database updates
- [ ] Frontend shows vehicles on map
- [ ] Real-time updates work
- [ ] Over-speeding alert triggers
- [ ] Accident alert triggers
- [ ] Dashboard displays correctly

## 📚 Important Files

- **Frontend:** `frontend/app/page.tsx` - Main dashboard
- **Backend:** `backend/src/server.js` - API server
- **Simulator:** `simulator/src/index.js` - Data generator
- **Supabase:** `frontend/lib/supabase.ts` - Database client

