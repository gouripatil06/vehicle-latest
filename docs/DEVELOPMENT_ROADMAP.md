# 🚗 Vehicle Tracking and Safety System - Development Roadmap

## 📋 Project Overview

**Project Name:** Real-Time Vehicle Tracking and Safety System  
**Tech Stack:** Next.js (Frontend) + Node.js (Backend) + Supabase (Database)  
**Type:** Cloud-based tracking system with real-time monitoring and alerts

---

## 🎯 Project Goals

1. ✅ Real-time vehicle tracking on interactive map
2. ✅ Live GPS location updates every 2-5 seconds
3. ✅ Over-speeding detection and alerts
4. ✅ Accident detection and emergency notifications
5. ✅ Dashboard with vehicle status, speed, and location
6. ✅ Real-time database updates (Supabase)
7. ✅ Historical data tracking and analytics

---

## 🛠️ Tech Stack Confirmation

### Frontend
- **Framework:** Next.js 16+ (App Router)
- **UI Library:** shadcn/ui (already installed ✅)
- **Styling:** Tailwind CSS
- **Maps:** Mapbox GL JS or Google Maps React
- **Real-time:** Supabase Realtime Subscriptions
- **Charts:** Recharts (for speed graphs, analytics)
- **Icons:** Lucide React (already installed ✅)
- **State Management:** React Context API or Zustand

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **API:** REST API
- **Real-time:** WebSocket (Socket.io) OR Supabase Realtime
- **Validation:** Joi or Zod

### Database & Cloud
- **Database:** Supabase (PostgreSQL)
- **Real-time:** Supabase Realtime Subscriptions
- **Hosting:** 
  - Frontend: Vercel
  - Backend: Railway or Render

### Simulation
- **Data Generator:** Node.js script
- **Libraries:** Faker.js (for realistic data)

---

## 📁 Project Structure

```
gouriAssignment/
├── frontend/                    # Next.js App (already exists ✅)
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Main dashboard
│   │   ├── vehicles/
│   │   │   └── [id]/page.tsx    # Individual vehicle details
│   │   └── alerts/page.tsx      # Alerts history page
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── map/
│   │   │   ├── VehicleMap.tsx   # Main map component
│   │   │   └── VehicleMarker.tsx
│   │   ├── vehicle/
│   │   │   ├── VehicleCard.tsx  # Vehicle status card
│   │   │   ├── VehicleList.tsx  # List of all vehicles
│   │   │   └── VehicleDetails.tsx
│   │   ├── alerts/
│   │   │   ├── AlertBanner.tsx  # Real-time alert banner
│   │   │   ├── AlertCard.tsx    # Individual alert card
│   │   │   └── AlertList.tsx    # List of alerts
│   │   ├── charts/
│   │   │   ├── SpeedChart.tsx   # Speed over time graph
│   │   │   └── AnalyticsChart.tsx
│   │   └── layout/
│   │       ├── Sidebar.tsx      # Navigation sidebar
│   │       ├── Header.tsx       # Top header
│   │       └── DashboardLayout.tsx
│   ├── lib/
│   │   ├── utils.ts             # Utility functions (exists ✅)
│   │   ├── supabase.ts          # Supabase client setup
│   │   └── api.ts               # API helper functions
│   ├── hooks/
│   │   ├── useVehicles.ts       # Real-time vehicle data hook
│   │   ├── useAlerts.ts         # Real-time alerts hook
│   │   └── useRealtime.ts       # Supabase realtime hook
│   ├── types/
│   │   └── index.ts             # TypeScript types
│   └── package.json
│
├── backend/                     # Node.js API (to be created)
│   ├── src/
│   │   ├── server.js            # Express server entry point
│   │   ├── routes/
│   │   │   ├── vehicles.js      # Vehicle routes
│   │   │   ├── alerts.js        # Alert routes
│   │   │   └── simulator.js     # Simulator control routes
│   │   ├── controllers/
│   │   │   ├── vehicleController.js
│   │   │   └── alertController.js
│   │   ├── services/
│   │   │   ├── alertService.js  # Alert detection logic
│   │   │   ├── vehicleService.js
│   │   │   └── supabaseService.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js
│   │   └── config/
│   │       └── supabase.js      # Supabase client config
│   ├── package.json
│   └── .env
│
├── simulator/                   # Data Generator (to be created)
│   ├── src/
│   │   ├── index.js             # Main simulator script
│   │   ├── vehicleSimulator.js  # Vehicle data generator
│   │   ├── scenarios.js         # Test scenarios (normal, speeding, accident)
│   │   └── config.js            # Simulator config
│   ├── package.json
│   └── .env
│
├── docs/
│   ├── DEVELOPMENT_ROADMAP.md   # This file ✅
│   ├── API_DOCUMENTATION.md     # API endpoints docs
│   ├── DATABASE_SCHEMA.md       # Database schema
│   └── SETUP_INSTRUCTIONS.md    # Setup guide
│
└── README.md                    # Project README
```

---

## 🗺️ Development Phases

### **PHASE 1: Project Setup & Configuration** ⚙️

#### 1.1 Database Setup (Supabase)
- [ ] Create Supabase account and project
- [ ] Create database tables:
  - [ ] `vehicles` table (vehicle_id, latitude, longitude, speed, status, timestamp, etc.)
  - [ ] `alerts` table (alert_id, vehicle_id, alert_type, location, timestamp, severity)
  - [ ] `vehicle_history` table (for historical tracking)
- [ ] Enable Realtime for `vehicles` and `alerts` tables
- [ ] Set up Row Level Security (RLS) policies
- [ ] Create indexes for performance
- [ ] Document schema in `docs/DATABASE_SCHEMA.md`

#### 1.2 Backend Setup
- [ ] Initialize Node.js project in `backend/` folder
- [ ] Install dependencies:
  - [ ] express
  - [ ] cors
  - [ ] dotenv
  - [ ] @supabase/supabase-js
  - [ ] socket.io (optional, if not using Supabase Realtime)
  - [ ] joi or zod (validation)
- [ ] Create Express server structure
- [ ] Set up environment variables (.env)
- [ ] Configure Supabase client
- [ ] Create basic server.js with health check endpoint
- [ ] Test server runs on port 5000

#### 1.3 Frontend Configuration
- [ ] Install missing dependencies:
  - [ ] mapbox-gl or @react-google-maps/api
  - [ ] @supabase/supabase-js
  - [ ] recharts (for charts)
  - [ ] zustand (optional, for state management)
- [ ] Set up Supabase client in `lib/supabase.ts`
- [ ] Create TypeScript types in `types/index.ts`
- [ ] Configure environment variables (.env.local)
- [ ] Set up API routes structure
- [ ] Test Supabase connection

#### 1.4 Simulator Setup
- [ ] Create `simulator/` folder
- [ ] Initialize Node.js project
- [ ] Install dependencies:
  - [ ] @supabase/supabase-js
  - [ ] dotenv
  - [ ] faker.js (for realistic data)
- [ ] Create basic simulator structure

---

### **PHASE 2: Database & Backend API Development** 🔧

#### 2.1 Database Schema Implementation
- [ ] Create `vehicles` table with all columns
- [ ] Create `alerts` table
- [ ] Create `vehicle_history` table
- [ ] Set up foreign keys and relationships
- [ ] Enable Realtime subscriptions
- [ ] Test database queries manually

#### 2.2 Backend API Endpoints
- [ ] **Vehicle Routes** (`/api/vehicles`):
  - [ ] `GET /api/vehicles` - Get all vehicles
  - [ ] `GET /api/vehicles/:id` - Get single vehicle
  - [ ] `POST /api/vehicles` - Create vehicle (for simulator)
  - [ ] `PUT /api/vehicles/:id` - Update vehicle location/speed
  - [ ] `DELETE /api/vehicles/:id` - Delete vehicle

- [ ] **Alert Routes** (`/api/alerts`):
  - [ ] `GET /api/alerts` - Get all alerts
  - [ ] `GET /api/alerts/:vehicleId` - Get alerts for vehicle
  - [ ] `POST /api/alerts` - Create alert (from simulator/backend)
  - [ ] `GET /api/alerts/recent` - Get recent alerts (last 24h)

- [ ] **Health Check**:
  - [ ] `GET /api/health` - Server health check

#### 2.3 Alert Detection Service
- [ ] Create `alertService.js`:
  - [ ] `checkOverSpeed(vehicleData, speedLimit)` - Detect over-speeding
  - [ ] `detectAccident(vehicleData, previousData)` - Detect accidents
    - Logic: Sudden speed drop (from 60+ to 0 in <2 seconds)
    - Or: Impact detection (extreme deceleration)
  - [ ] `createAlert(vehicleId, alertType, data)` - Create alert record

#### 2.4 Data Validation
- [ ] Add input validation middleware (Joi/Zod)
- [ ] Validate vehicle data structure
- [ ] Validate location coordinates (lat/lng ranges)
- [ ] Validate speed values

#### 2.5 Error Handling
- [ ] Global error handler middleware
- [ ] Custom error classes
- [ ] Error logging

---

### **PHASE 3: Vehicle Simulator Development** 🚗

#### 3.1 Basic Simulator
- [ ] Create vehicle data generator:
  - [ ] Generate random GPS coordinates (within city bounds)
  - [ ] Generate realistic speed values (0-100 km/h)
  - [ ] Generate timestamp
  - [ ] Generate vehicle status

#### 3.2 Vehicle Movement Simulation
- [ ] Implement route generation (vehicles move along routes)
- [ ] Calculate movement between coordinates (realistic GPS progression)
- [ ] Update coordinates every 2-5 seconds
- [ ] Vary speed realistically (acceleration/deceleration)

#### 3.3 Test Scenarios
- [ ] **Scenario 1: Normal Driving**
  - Vehicle moves at normal speed (30-60 km/h)
  - No alerts triggered

- [ ] **Scenario 2: Over-speeding**
  - Vehicle exceeds speed limit (e.g., 85 km/h in 60 zone)
  - Alert triggered automatically

- [ ] **Scenario 3: Accident Simulation**
  - Sudden speed drop (60 → 0 in 1 second)
  - Vehicle stops at location
  - Accident alert triggered

#### 3.4 Simulator Controls
- [ ] Start/Stop simulator command
- [ ] Control number of vehicles (1, 3, 5, 10)
- [ ] Trigger specific scenarios on command
- [ ] Log simulator activity to console

#### 3.5 Data Transmission
- [ ] Connect to backend API
- [ ] Send vehicle data via POST `/api/vehicles/:id`
- [ ] Send updates every 2-5 seconds
- [ ] Handle errors and retry logic

---

### **PHASE 4: Frontend Dashboard Development** 🎨

#### 4.1 Layout & Navigation
- [ ] Create `DashboardLayout.tsx`:
  - [ ] Sidebar navigation (Vehicles, Alerts, Analytics)
  - [ ] Top header with title and status indicators
  - [ ] Main content area
- [ ] Use shadcn/ui components for navigation
- [ ] Responsive design (mobile-friendly)

#### 4.2 Map Component
- [ ] Install and configure Mapbox/Google Maps
- [ ] Create `VehicleMap.tsx`:
  - [ ] Display map with proper zoom and center
  - [ ] Show all vehicles as markers
  - [ ] Color-code markers by status (green=normal, yellow=caution, red=alert)
  - [ ] Update markers in real-time
  - [ ] Click marker to show vehicle details
  - [ ] Smooth marker movement animation
- [ ] Create `VehicleMarker.tsx` for custom markers

#### 4.3 Real-time Data Hooks
- [ ] Create `useVehicles.ts` hook:
  - [ ] Subscribe to Supabase Realtime `vehicles` table
  - [ ] Update vehicle state when data changes
  - [ ] Handle connection status
- [ ] Create `useAlerts.ts` hook:
  - [ ] Subscribe to `alerts` table
  - [ ] Filter recent alerts
  - [ ] Handle alert notifications

#### 4.4 Vehicle Components
- [ ] Create `VehicleList.tsx`:
  - [ ] List all vehicles with cards
  - [ ] Show status, speed, location
  - [ ] Real-time updates
- [ ] Create `VehicleCard.tsx`:
  - [ ] Individual vehicle card
  - [ ] Status indicator
  - [ ] Speed meter
  - [ ] Last update time
- [ ] Create `VehicleDetails.tsx`:
  - [ ] Detailed vehicle view
  - [ ] Speed history chart
  - [ ] Route history on map
  - [ ] Alert history

#### 4.5 Alert Components
- [ ] Create `AlertBanner.tsx`:
  - [ ] Real-time alert banner at top
  - [ ] Show recent critical alerts
  - [ ] Auto-dismiss after 5 seconds
  - [ ] Sound notification (optional)
- [ ] Create `AlertCard.tsx`:
  - [ ] Individual alert card
  - [ ] Alert type icon
  - [ ] Severity indicator
  - [ ] Location and timestamp
- [ ] Create `AlertList.tsx`:
  - [ ] List all alerts
  - [ ] Filter by type (overspeeding, accident)
  - [ ] Sort by time

#### 4.6 Charts & Analytics
- [ ] Install Recharts
- [ ] Create `SpeedChart.tsx`:
  - [ ] Line chart showing speed over time
  - [ ] Highlight over-speeding zones
- [ ] Create `AnalyticsChart.tsx`:
  - [ ] Bar chart: Alerts per vehicle
  - [ ] Pie chart: Alert types distribution
- [ ] Create Analytics page with all charts

#### 4.7 Main Dashboard Page
- [ ] Update `app/page.tsx`:
  - [ ] Integrate VehicleMap
  - [ ] Show VehicleList sidebar or bottom section
  - [ ] Display AlertBanner
  - [ ] Real-time updates working
  - [ ] Loading states
  - [ ] Error states

#### 4.8 Additional Pages
- [ ] Create `app/vehicles/[id]/page.tsx`:
  - [ ] Individual vehicle detail page
  - [ ] Map with vehicle location
  - [ ] Speed chart
  - [ ] Alert history
- [ ] Create `app/alerts/page.tsx`:
  - [ ] All alerts list
  - [ ] Filter and search
  - [ ] Alert statistics

---

### **PHASE 5: Real-time Integration** 🔄

#### 5.1 Supabase Realtime Setup
- [ ] Configure Realtime subscriptions in frontend
- [ ] Subscribe to `vehicles` table changes
- [ ] Subscribe to `alerts` table changes
- [ ] Handle connection/disconnection events
- [ ] Test real-time updates work correctly

#### 5.2 Data Flow Integration
- [ ] Simulator → Backend API → Supabase Database
- [ ] Supabase Database → Frontend (via Realtime)
- [ ] Verify end-to-end data flow
- [ ] Test with multiple vehicles simultaneously

#### 5.3 Alert Triggering Flow
- [ ] Backend detects alert (in alertService)
- [ ] Backend creates alert record in database
- [ ] Frontend receives alert via Realtime subscription
- [ ] Frontend displays alert immediately
- [ ] Test all alert types work

---

### **PHASE 6: Styling & UI Polish** ✨

#### 6.1 Design System
- [ ] Define color scheme:
  - Green: Normal status
  - Yellow: Caution/over-speeding
  - Red: Critical/accident
- [ ] Use shadcn/ui theme configuration
- [ ] Consistent spacing and typography

#### 6.2 Component Styling
- [ ] Style all components with Tailwind CSS
- [ ] Add hover states and animations
- [ ] Make responsive for mobile/tablet
- [ ] Add loading skeletons
- [ ] Add empty states

#### 6.3 Map Styling
- [ ] Custom map theme/style
- [ ] Custom vehicle markers (icons)
- [ ] Route lines (if showing routes)
- [ ] Info windows/popups

#### 6.4 Dashboard Polish
- [ ] Add smooth transitions
- [ ] Add notification sounds (optional)
- [ ] Add loading indicators
- [ ] Add error messages
- [ ] Add success confirmations

---

### **PHASE 7: Testing & Debugging** 🧪

#### 7.1 Functionality Testing
- [ ] Test simulator sends data correctly
- [ ] Test backend receives and stores data
- [ ] Test database updates in real-time
- [ ] Test frontend displays data correctly
- [ ] Test alert detection works
- [ ] Test real-time updates work
- [ ] Test with 1, 3, 5, 10 vehicles

#### 7.2 Scenario Testing
- [ ] Normal driving scenario
- [ ] Over-speeding scenario
- [ ] Accident scenario
- [ ] Multiple vehicles with different statuses
- [ ] Database real-time updates visible in Supabase dashboard

#### 7.3 UI/UX Testing
- [ ] Test on different screen sizes
- [ ] Test map interactions
- [ ] Test alert notifications
- [ ] Test navigation between pages
- [ ] Test loading states

#### 7.4 Edge Cases
- [ ] Handle network disconnection
- [ ] Handle database connection errors
- [ ] Handle invalid data
- [ ] Handle empty states (no vehicles)

---

### **PHASE 8: Documentation & Deployment Prep** 📚

#### 8.1 Code Documentation
- [ ] Add JSDoc comments to functions
- [ ] Document component props
- [ ] Document API endpoints
- [ ] Add README comments

#### 8.2 Project Documentation
- [ ] Complete `README.md`:
  - [ ] Project description
  - [ ] Tech stack
  - [ ] Installation instructions
  - [ ] Environment variables setup
  - [ ] Running instructions
- [ ] Create `docs/API_DOCUMENTATION.md`:
  - [ ] All API endpoints
  - [ ] Request/response examples
  - [ ] Error codes
- [ ] Create `docs/DATABASE_SCHEMA.md`:
  - [ ] Table schemas
  - [ ] Relationships
  - [ ] Indexes
- [ ] Create `docs/SETUP_INSTRUCTIONS.md`:
  - [ ] Step-by-step setup guide
  - [ ] Supabase setup
  - [ ] Environment variables

#### 8.3 Demo Preparation
- [ ] Create demo script (5-10 minutes)
- [ ] Prepare test scenarios
- [ ] Document what to show professors
- [ ] Prepare screenshots/videos (optional)

#### 8.4 Deployment (Optional)
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Railway/Render
- [ ] Configure production environment variables
- [ ] Test production deployment

---

## ✅ Implementation Checklist Summary

### Priority 1 (Core Features - Must Have)
- [ ] Supabase database setup
- [ ] Backend API with vehicle endpoints
- [ ] Basic vehicle simulator
- [ ] Map component with vehicle markers
- [ ] Real-time updates working
- [ ] Over-speeding alert detection
- [ ] Accident alert detection

### Priority 2 (Important Features)
- [ ] Alert banner on dashboard
- [ ] Vehicle list/cards
- [ ] Individual vehicle details page
- [ ] Alert history page
- [ ] Speed charts
- [ ] Database schema documentation

### Priority 3 (Nice to Have)
- [ ] Analytics dashboard
- [ ] Advanced filtering
- [ ] Historical data graphs
- [ ] Sound notifications
- [ ] Export data functionality

---

## 📅 Estimated Timeline

- **Phase 1 (Setup):** 1-2 days
- **Phase 2 (Backend):** 2-3 days
- **Phase 3 (Simulator):** 2 days
- **Phase 4 (Frontend):** 4-5 days
- **Phase 5 (Real-time):** 1-2 days
- **Phase 6 (Styling):** 2 days
- **Phase 7 (Testing):** 1-2 days
- **Phase 8 (Documentation):** 1 day

**Total Estimated Time:** 14-19 days (working 4-6 hours/day)

---

## 🎯 Success Criteria

Project is complete when:
1. ✅ Simulator can generate and send vehicle data
2. ✅ Backend receives and stores data in Supabase
3. ✅ Frontend dashboard displays vehicles on map in real-time
4. ✅ Over-speeding alerts are detected and displayed
5. ✅ Accident alerts are detected and displayed
6. ✅ Database updates are visible in Supabase dashboard
7. ✅ All features work end-to-end
8. ✅ Documentation is complete
9. ✅ Project can be demonstrated to professors

---

## 📝 Notes

- Start with Phase 1 and complete each phase before moving to next
- Test frequently as you build
- Keep Supabase dashboard open to see real-time database updates
- Use TypeScript for better code quality
- Commit code frequently to Git
- Ask for help if stuck on any phase

---

## 🚀 Next Steps

1. **Review this roadmap** - Make sure you understand all phases
2. **Start with Phase 1** - Set up Supabase database first
3. **Configure backend** - Set up Node.js API structure
4. **Configure frontend** - Install missing dependencies
5. **Build incrementally** - One feature at a time

---

**Last Updated:** [Date]  
**Status:** Ready to Start Development 🎉

