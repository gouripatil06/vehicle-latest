# 🔧 Setup Prerequisites - Complete Guide

This guide will help you set up all prerequisites for the Vehicle Tracking System project.

---

## 📋 Prerequisites Checklist

- [ ] Supabase account and project
- [ ] Supabase database tables created
- [ ] Mapbox account and API key (or Google Maps API key)
- [ ] Environment variables configured for Frontend
- [ ] Environment variables configured for Backend
- [ ] Environment variables configured for Simulator

---

## 1️⃣ Supabase Setup

### Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up using:
   - GitHub (recommended)
   - Google
   - Email
4. Verify your email if required

### Step 2: Create a New Project

1. After logging in, click **"New Project"**
2. Fill in the project details:
   - **Organization:** Create new or select existing
   - **Name:** `vehicle-tracking-system` (or any name you prefer)
   - **Database Password:** 
     - Create a strong password
     - **⚠️ SAVE THIS PASSWORD** - You'll need it later
     - Example: `VehicleTracking2024!@#`
   - **Region:** Choose closest to you (e.g., `Southeast Asia (Singapore)` for India)
   - **Pricing Plan:** Select **Free** (sufficient for college project)
3. Click **"Create new project"**
4. Wait 2-3 minutes for project to initialize

### Step 3: Get Supabase Credentials

1. Once project is ready, go to **Project Settings** (gear icon on left sidebar)
2. Click on **"API"** section
3. You'll see:
   - **Project URL:** `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key:** `eyJhbGc...` (long string)
   - **service_role key:** `eyJhbGc...` (long string) - **⚠️ Keep this SECRET!**

4. **Copy these values** - You'll need them for `.env` files:
   ```
   SUPABASE_URL = https://xxxxxxxxxxxxx.supabase.co
   SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Step 4: Create Database Tables

1. In Supabase dashboard, go to **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Copy and paste the following SQL to create tables:

```sql
-- Create vehicles table
CREATE TABLE vehicles (
  vehicle_id TEXT PRIMARY KEY,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  speed INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'normal',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  route_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE alerts (
  alert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id TEXT NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('overspeeding', 'accident')),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  speed_at_alert INTEGER NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  resolved BOOLEAN DEFAULT FALSE
);

-- Create vehicle_history table (optional, for historical tracking)
CREATE TABLE vehicle_history (
  history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id TEXT NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  speed INTEGER NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_vehicles_timestamp ON vehicles(timestamp DESC);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_alerts_vehicle_id ON alerts(vehicle_id);
CREATE INDEX idx_alerts_timestamp ON alerts(timestamp DESC);
CREATE INDEX idx_vehicle_history_vehicle_id ON vehicle_history(vehicle_id);
CREATE INDEX idx_vehicle_history_timestamp ON vehicle_history(timestamp DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_history ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (for development)
-- In production, you should restrict these based on user authentication
CREATE POLICY "Allow all operations on vehicles" ON vehicles
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on alerts" ON alerts
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on vehicle_history" ON vehicle_history
  FOR ALL USING (true) WITH CHECK (true);
```

4. Click **"Run"** button (or press Ctrl+Enter)
5. You should see **"Success. No rows returned"** - Tables are created!

### Step 5: Enable Realtime

1. Go to **"Database"** → **"Replication"** (left sidebar)
2. For each table (`vehicles`, `alerts`, `vehicle_history`):
   - Toggle the switch to **Enable** realtime
   - Or run this SQL:

```sql
-- Enable Realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE vehicles;
ALTER PUBLICATION supabase_realtime ADD TABLE alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE vehicle_history;
```

3. Verify tables are enabled for Realtime (green toggle)

### Step 6: Verify Tables Created

1. Go to **"Table Editor"** (left sidebar)
2. You should see:
   - `vehicles` table
   - `alerts` table
   - `vehicle_history` table
3. Click on each table to see its structure

✅ **Supabase Setup Complete!**

---

## 2️⃣ Mapbox Setup (Recommended for Maps)

### Step 1: Create Mapbox Account

1. Go to [https://www.mapbox.com](https://www.mapbox.com)
2. Click **"Sign Up"** (top right)
3. Sign up with:
   - Email
   - GitHub
   - Google
4. Verify your email

### Step 2: Get Mapbox Access Token

1. After logging in, go to [https://account.mapbox.com/access-tokens](https://account.mapbox.com/access-tokens)
2. You'll see your **Default Public Token** (starts with `pk.eyJ...`)
3. Copy this token - You'll need it for frontend `.env`
4. **Note:** Mapbox free tier includes 50,000 map loads/month (enough for development)

**Alternative: Use Google Maps API**
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create project
- Enable Maps JavaScript API
- Create API key
- Use `@react-google-maps/api` instead of Mapbox

✅ **Mapbox Setup Complete!**

---

## 3️⃣ Environment Variables Setup

### Frontend Environment Variables

1. Go to `frontend/` folder
2. Create `.env.local` file (if it doesn't exist):

```bash
cd frontend
touch .env.local
```

3. Open `.env.local` and add:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Mapbox Configuration (if using Mapbox)
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNs...

# Backend API URL (optional, for API calls)
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Replace:**
- `https://xxxxxxxxxxxxx.supabase.co` with your Supabase Project URL
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` with your Supabase anon key
- `pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNs...` with your Mapbox token

### Backend Environment Variables

1. Go to `backend/` folder
2. Create `.env` file:

```bash
cd backend
touch .env
```

3. Open `.env` and add:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Speed Limit Configuration (in km/h)
DEFAULT_SPEED_LIMIT=60
```

**Replace:**
- `https://xxxxxxxxxxxxx.supabase.co` with your Supabase Project URL
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (SERVICE_KEY) with your Supabase service_role key
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (ANON_KEY) with your Supabase anon key

### Simulator Environment Variables

1. Go to `simulator/` folder (we'll create this later, but prepare for it)
2. Create `.env` file:

```bash
cd simulator
touch .env
```

3. Open `.env` and add:

```env
# Backend API URL
BACKEND_URL=http://localhost:5000

# Supabase Configuration (for direct database access if needed)
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Simulator Configuration
SIMULATOR_INTERVAL=2000
VEHICLE_COUNT=3
```

**Replace:**
- `https://xxxxxxxxxxxxx.supabase.co` with your Supabase Project URL
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` with your Supabase service_role key

---

## 4️⃣ Final Environment Files Summary

### 📁 File Structure After Setup

```
gouriAssignment/
├── frontend/
│   ├── .env.local          ✅ Created with Supabase + Mapbox keys
│   └── ...
├── backend/
│   ├── .env                ✅ Created with Supabase keys
│   └── ...
└── simulator/
    ├── .env                ✅ Created with Backend URL + Supabase keys
    └── ...
```

---

## 5️⃣ Security Notes

### ⚠️ Important Security Reminders:

1. **Never commit `.env` files to Git**
   - Add to `.gitignore`:
     ```
     .env
     .env.local
     .env.*.local
     ```

2. **Use different keys for different environments:**
   - Frontend: Uses `anon key` (public, safe for client-side)
   - Backend: Uses `service_role key` (secret, server-side only)
   - Simulator: Can use `service_role key` (runs locally)

3. **Service Role Key is SECRET:**
   - Never expose in frontend code
   - Only use in backend/simulator
   - Has full database access (bypasses RLS)

---

## 6️⃣ Verification Steps

### Test Supabase Connection:

1. Check Supabase dashboard:
   - ✅ Tables created: `vehicles`, `alerts`, `vehicle_history`
   - ✅ Realtime enabled for all tables
   - ✅ Can see Table Editor

2. Test from Frontend (after we build it):
   - Frontend should connect to Supabase
   - Real-time subscriptions should work

3. Test from Backend (after we build it):
   - Backend should insert/read data from Supabase
   - API endpoints should work

### Test Mapbox Token:

1. Visit: `https://api.mapbox.com/styles/v1/mapbox/streets-v11?access_token=YOUR_TOKEN`
   - Replace `YOUR_TOKEN` with your Mapbox token
   - Should return JSON (not error)

---

## 7️⃣ Quick Setup Checklist

Print this and check off as you complete:

- [ ] Created Supabase account
- [ ] Created Supabase project
- [ ] Copied Supabase URL
- [ ] Copied Supabase anon key
- [ ] Copied Supabase service_role key
- [ ] Created database tables (vehicles, alerts, vehicle_history)
- [ ] Enabled Realtime for all tables
- [ ] Created Mapbox account
- [ ] Copied Mapbox access token
- [ ] Created `frontend/.env.local` with all keys
- [ ] Created `backend/.env` with all keys
- [ ] Added `.env` files to `.gitignore`
- [ ] Verified Supabase connection (tables visible)
- [ ] Verified Mapbox token works

---

## 8️⃣ Troubleshooting

### Issue: Can't find Supabase keys
**Solution:** 
- Go to Project Settings → API
- Copy from there

### Issue: Realtime not working
**Solution:**
- Go to Database → Replication
- Enable Realtime for each table
- Or run the SQL commands provided

### Issue: Mapbox token invalid
**Solution:**
- Regenerate token in Mapbox dashboard
- Make sure token starts with `pk.eyJ...`
- Check token has Maps API enabled

### Issue: Can't access Supabase from code
**Solution:**
- Check `.env` files are in correct folders
- Check variable names are correct (case-sensitive)
- Restart development server after adding `.env`

---

## ✅ Next Steps

After completing all prerequisites:

1. **Start with Phase 1** from Development Roadmap
2. **Set up Backend structure** (Express.js server)
3. **Set up Frontend** (install missing dependencies)
4. **Build incrementally** - one feature at a time

---

**Last Updated:** [Date]  
**Status:** Ready for Environment Setup ✅

