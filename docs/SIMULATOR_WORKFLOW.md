# 🚗 Simulator Workflow - What Happens When You Click "Start Simulator"

## 📋 Overview
This document explains exactly what happens when you click the "Start Simulator" button in the frontend and how teachers can see the real-time vehicle tracking.

---

## ✅ Step-by-Step Process

### 1. **Frontend Button Click**
When you click "Start Simulator":
- Frontend sends a POST request to: `http://localhost:5001/api/simulator/start`
- Request body: `{ vehicleCount: 3 }`

### 2. **Backend API Receives Request**
Backend route (`/api/simulator/start`):
- Spawns a Node.js child process running the simulator
- Simulator starts generating vehicle data
- Returns status: `{ success: true, data: { isRunning: true, vehicleCount: 3, startTime: ... } }`

### 3. **Simulator Starts Generating Data**
The simulator:
- Creates 3 vehicles (V001, V002, V003)
- **Each vehicle starts at a REAL Bengaluru location:**
  - **V001**: MG Road (12.9750, 77.6093) - Central Bangalore
  - **V002**: Electronic City (12.8456, 77.6633) - South Bangalore IT Hub
  - **V003**: Whitefield (12.9698, 77.7499) - East Bangalore IT Hub
- Vehicles move every 2 seconds
- Updates include: latitude, longitude, speed, status

### 4. **Simulator Sends Data to Backend**
Every 2 seconds, for each vehicle:
- Simulator sends POST to: `http://localhost:5001/api/vehicles`
- Data includes:
  ```json
  {
    "vehicle_id": "V001",
    "latitude": 12.9750,
    "longitude": 77.6093,
    "speed": 45,
    "status": "normal",
    "route_name": "MG Road"
  }
  ```

### 5. **Backend Saves to Supabase**
Backend:
- Saves/updates vehicle data in `vehicles` table
- Checks for alerts (overspeeding > 60 km/h, accidents when speed = 0)
- Creates alerts in `alerts` table if detected
- Saves history in `vehicle_history` table

### 6. **Frontend Receives Real-time Updates**
Frontend (Next.js):
- Subscribes to Supabase Realtime for `vehicles` table
- Receives updates every 2 seconds
- **Map shows car icons moving in real-time:**
  - 🟢 Green car = Normal driving
  - 🟡 Yellow car = Overspeeding (> 60 km/h)
  - 🔴 Red car = Accident detected
- Sidebar shows vehicle list with live updates
- Stats cards update automatically

### 7. **What Teachers See**
When simulator is running:
- ✅ **3 car icons appear on the map** at Bengaluru locations (MG Road, Electronic City, Whitefield)
- ✅ **Cars move every 2 seconds** showing realistic movement
- ✅ **Speed updates** in the sidebar (e.g., "45 km/h", "78 km/h")
- ✅ **Status changes** when vehicle overspeeds or has accident
- ✅ **Toast notifications** appear when alerts are detected
- ✅ **Stats update** automatically (Total Vehicles, Active Alerts, etc.)

---

## 🎯 Real Locations Used (For Teacher Demo)

The simulator uses **real, recognizable Bengaluru landmarks**:

| Vehicle | Starting Location | Coordinates | Why Teachers Know This |
|---------|------------------|-------------|------------------------|
| V001 | MG Road | 12.9750, 77.6093 | Famous shopping street in central Bangalore |
| V002 | Electronic City | 12.8456, 77.6633 | Major IT hub - Infosys, Wipro headquarters |
| V003 | Whitefield | 12.9698, 77.7499 | Another major IT hub - many tech companies |
| V004 | Koramangala | 12.9352, 77.6245 | Popular residential/commercial area |
| V005 | Indiranagar | 12.9784, 77.6408 | Known shopping and dining hub |

**Teachers can verify these are real locations by searching on Google Maps!**

---

## 🔍 How to Verify It's Working

### Check 1: Backend Console
When you start the simulator, backend should show:
```
[Simulator] 🚗 Starting Vehicle Simulator...
[Simulator] 📡 Backend URL: http://localhost:5001
[Simulator] ⏱️  Update Interval: 2000ms
[Simulator] 🚙 Vehicle Count: 3
[Simulator] ✅ Simulator started!

📊 [6:30:01 PM] Updating vehicles...
🟢 V001: 45 km/h | Lat: 12.9750, Lng: 77.6093 | Status: normal
🟢 V002: 38 km/h | Lat: 12.8456, Lng: 77.6633 | Status: normal
🟢 V003: 52 km/h | Lat: 12.9698, Lng: 77.7499 | Status: normal
```

### Check 2: Supabase Dashboard
1. Go to Supabase Dashboard → Table Editor → `vehicles` table
2. You should see 3 vehicles updating every 2 seconds
3. Watch `latitude`, `longitude`, `speed`, `status` change

### Check 3: Frontend Map
1. Open frontend at `http://localhost:3000`
2. Click "Start Simulator"
3. You should see:
   - **3 car icons appear on map** at Bengaluru locations
   - **Icons move** every 2 seconds
   - **Colors change** (green → yellow when overspeeding, red when accident)

### Check 4: Browser Console
Open browser DevTools (F12) → Console tab:
- Should see real-time updates from Supabase
- No errors related to API calls

---

## ❌ Troubleshooting

### Problem: "Cannot connect to backend"
**Solution:** Start the backend server:
```bash
cd backend
pnpm dev
```

### Problem: No vehicles appear on map
**Check:**
1. Is backend running? (Should be on port 5001)
2. Is simulator started? (Check simulator control button shows "Running")
3. Check browser console for errors
4. Check Supabase - are vehicles in the database?

### Problem: Vehicles not moving
**Check:**
1. Backend console should show updates every 2 seconds
2. Supabase `vehicles` table should update every 2 seconds
3. Check `timestamp` column is updating

### Problem: Stats not updating
**Solution:** Stats update automatically via Supabase Realtime. If not updating:
1. Check Supabase Realtime is enabled
2. Check browser console for subscription errors
3. Refresh the page

---

## 🎓 For Teacher Presentation

**Key Points to Demonstrate:**
1. ✅ **Real Locations**: Show teachers the map with recognizable Bengaluru landmarks
2. ✅ **Real-time Updates**: Watch vehicles move every 2 seconds
3. ✅ **Live Data**: Show Supabase dashboard updating in real-time
4. ✅ **Alerts**: Demonstrate overspeeding detection (speed > 60 km/h triggers alert)
5. ✅ **Accident Detection**: Show how accident detection works (speed = 0 + status change)

**Demo Flow:**
1. Open frontend dashboard
2. Click "Start Simulator"
3. Show vehicles appearing at MG Road, Electronic City, Whitefield
4. Watch vehicles move in real-time
5. Open Supabase dashboard to show database updating
6. Show alerts table when overspeeding occurs
7. Show toast notifications in frontend

---

## 📊 Data Flow Diagram

```
[Frontend] → Click "Start Simulator"
    ↓
[Backend API] → /api/simulator/start
    ↓
[Backend Spawns] → Simulator Process (Node.js)
    ↓
[Simulator] → Generates vehicle data every 2 seconds
    ↓
[Simulator] → POST /api/vehicles (with vehicle data)
    ↓
[Backend] → Saves to Supabase `vehicles` table
    ↓
[Backend] → Checks for alerts, saves to `alerts` table
    ↓
[Supabase Realtime] → Broadcasts changes to subscribers
    ↓
[Frontend] → Receives updates via Supabase subscription
    ↓
[Map Component] → Updates car icons on map
[Sidebar] → Updates vehicle list
[Stats Cards] → Updates statistics
[Toast Notifications] → Shows alerts
```

---

## 🚀 Quick Start Commands

1. **Start Backend:**
   ```bash
   cd backend
   pnpm dev
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   pnpm dev
   ```

3. **Start Simulator (via Frontend):**
   - Open `http://localhost:3000`
   - Click "Start Simulator" button

---

## 📝 Notes

- Simulator interval: **2 seconds** (configurable in `simulator/src/config.js`)
- Vehicle count: **3 vehicles** (can be changed when starting simulator)
- Speed limit: **60 km/h** (overspeeding triggers when speed > 60)
- Real locations ensure teachers can verify on Google Maps
- All data is stored in Supabase for persistence

