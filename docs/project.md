# 🚗 Vehicle Tracking and Safety System - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [What This Project Does](#what-this-project-does)
3. [Key Features](#key-features)
4. [Technology Stack](#technology-stack)
5. [Project Architecture](#project-architecture)
6. [Folder Structure & File Descriptions](#folder-structure--file-descriptions)
7. [How It Works](#how-it-works)
8. [Database Schema](#database-schema)
9. [API Endpoints](#api-endpoints)
10. [Frontend Pages & Components](#frontend-pages--components)
11. [Backend Services](#backend-services)
12. [Simulator System](#simulator-system)
13. [Real-time Data Flow](#real-time-data-flow)
14. [Deployment](#deployment)
15. [Key Concepts Explained](#key-concepts-explained)
16. [Common Questions & Answers](#common-questions--answers)

---

## 📋 Project Overview

**Project Name:** Real-Time Vehicle Tracking and Safety System  
**Type:** Full-stack web application  
**Purpose:** Track vehicles in real-time, monitor speed, detect overspeeding and accidents, and provide analytics and alerts.

This is a **monorepo** project containing:
- **Frontend:** Next.js 16 application (React-based)
- **Backend:** Node.js/Express.js REST API
- **Simulator:** Node.js script that generates fake vehicle data for testing
- **Database:** Supabase (PostgreSQL with real-time capabilities)

---

## 🎯 What This Project Does

### Main Functionality

1. **Real-Time Vehicle Tracking**
   - Shows vehicles moving on an interactive map (Mapbox)
   - Updates vehicle positions every 2-5 seconds
   - Visualizes routes with Google Maps-style navigation
   - 3D car markers that rotate based on vehicle direction

2. **Speed Monitoring & Overspeeding Detection**
   - Monitors each vehicle's speed in real-time
   - Automatically detects when vehicles exceed speed limits
   - Generates alerts when overspeeding occurs
   - Stores overspeeding history with location and timestamp

3. **Accident Detection**
   - Simulates accident scenarios
   - Creates emergency alerts when accidents occur
   - Marks vehicles with accident status

4. **Analytics Dashboard**
   - Displays statistics: total vehicles, active alerts, overspeeding count, accidents
   - Shows speed charts over time
   - Alert trends and distribution charts
   - Route analytics and performance metrics

5. **Vehicle Management**
   - Add/edit vehicle details (name, number, registration, owner)
   - Enable/disable tracking for specific vehicles
   - View individual vehicle history and analytics
   - Track vehicle events (overspeeding, route changes, etc.)

6. **Simulator Configuration**
   - Configure maximum number of vehicles (1-6)
   - Set overspeeding speed limit (40-120 km/h)
   - Adjust update interval (1-10 seconds)
   - Start/stop simulator from the UI

7. **User Authentication**
   - Login/Signup using Clerk.js
   - Protected routes for dashboard and analytics
   - Public landing page

---

## ✨ Key Features

1. **Real-Time Updates**: Uses Supabase Realtime subscriptions - changes in database instantly reflect on the UI
2. **Interactive Map**: Mapbox GL JS with custom 3D car markers, route visualization, and real-time navigation
3. **Smart Alerts**: Automatic detection of overspeeding and accidents with instant notifications
4. **Analytics**: Comprehensive charts and statistics for fleet management
5. **Responsive Design**: Works on desktop and mobile devices
6. **Dark Mode**: Supports light/dark themes
7. **Vehicle History**: Detailed event logs showing where and when incidents occurred
8. **Configurable Simulator**: Customize simulation parameters for different scenarios

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 16 (React 19) with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui (Radix UI + Tailwind)
- **Maps:** Mapbox GL JS
- **Charts:** Recharts
- **Animations:** Framer Motion
- **State Management:** React Hooks (useState, useEffect, useMemo)
- **Real-time:** Supabase Realtime Subscriptions
- **Authentication:** Clerk.js
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express.js 5
- **Database Client:** Supabase JavaScript Client
- **Validation:** Joi
- **CORS:** Express CORS middleware

### Database & Cloud
- **Database:** Supabase (PostgreSQL)
- **Real-time:** Supabase Realtime (Postgres changes)
- **Authentication:** Clerk.js + Supabase Auth

### Simulator
- **Runtime:** Node.js
- **Data Generation:** Faker.js
- **HTTP Client:** Axios

### Deployment
- **Frontend:** Vercel
- **Backend:** Railway
- **Database:** Supabase Cloud

---

## 🏗️ Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Frontend (Next.js on Vercel)                  │  │
│  │  - Landing Page (/), Dashboard (/dashboard)           │  │
│  │  - Analytics (/analytics), Settings (/settings)       │  │
│  │  - Vehicle Details (/vehicles/[id])                   │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────┬───────────────────────────┬────────────────────┘
             │                           │
             │ HTTP/HTTPS                │ WebSocket/Realtime
             │                           │
┌────────────▼───────────────────────────▼────────────────────┐
│              Backend API (Express on Railway)               │
│  - REST API endpoints (/api/vehicles, /api/alerts)         │
│  - Simulator control (/api/simulator)                      │
│  - Error handling middleware                                │
└────────────┬───────────────────────────┬────────────────────┘
             │                           │
             │                           │
┌────────────▼──────────────┐  ┌────────▼────────────────────┐
│   Simulator (In-Process)  │  │   Supabase (PostgreSQL)     │
│  - Generates vehicle data │  │  - vehicles table           │
│  - Moves vehicles on map  │  │  - alerts table             │
│  - Updates every 2-5 sec  │  │  - vehicle_events table     │
│  - Calls backend directly │  │  - simulator_settings       │
└───────────────────────────┘  │  - Realtime subscriptions   │
                               └──────────────────────────────┘
```

### Data Flow

1. **Simulator** generates vehicle data (location, speed, status)
2. **Backend API** receives data and stores it in **Supabase**
3. **Supabase Realtime** notifies **Frontend** of database changes
4. **Frontend** updates UI (map markers, stats, charts) in real-time
5. **Backend** detects overspeeding/accidents and creates alerts
6. **Frontend** displays alerts and updates statistics

---

## 📁 Folder Structure & File Descriptions

### Root Directory

```
gouriAssignment/
├── frontend/              # Next.js frontend application
├── backend1/              # Node.js backend API (deployed separately)
├── backend/               # Local development backend (legacy)
├── simulator/             # Standalone simulator (legacy - now in backend1)
├── docs/                  # Documentation files
├── vercel.json            # Vercel deployment config
├── railway.json           # Railway deployment config
└── docker-compose.yml     # Docker compose for local development
```

---

### Frontend Structure (`frontend/`)

#### **App Directory (`app/`)**

This uses Next.js 16 App Router - files in `app/` automatically become routes.

```
app/
├── page.tsx                    # Landing page (/) - Public, animated homepage
├── layout.tsx                  # Root layout - wraps all pages, includes Header
├── error.tsx                   # Global error page - shows when errors occur
├── not-found.tsx               # 404 page - shows when route not found
├── globals.css                 # Global styles, Tailwind CSS imports
├── dashboard/
│   └── page.tsx                # Main dashboard (/dashboard) - Map + Vehicle list
├── analytics/
│   └── page.tsx                # Analytics page (/analytics) - Charts and stats
├── settings/
│   └── page.tsx                # Settings page (/settings) - Configure simulator
├── vehicles/
│   └── [id]/
│       └── page.tsx            # Vehicle details page (/vehicles/V001) - History & analytics
├── (auth)/
│   └── login/
│       └── page.tsx            # Login page (/login) - Clerk authentication
└── api/
    └── users/
        └── sync/
            └── route.ts        # API route - Syncs Clerk users to Supabase
```

**Key Files Explained:**

- **`app/page.tsx`**: Landing/homepage with animated hero section, feature grid, and CTAs. Public route (no login required).

- **`app/dashboard/page.tsx`**: Main dashboard showing:
  - Interactive map with vehicle markers
  - Sidebar with vehicle list and stats cards
  - Vehicle tracker card (when vehicle is selected)
  - Simulator control panel

- **`app/analytics/page.tsx`**: Analytics dashboard with:
  - Statistics cards (total vehicles, alerts, overspeeding, accidents)
  - Speed charts
  - Alert trends
  - Speed distribution
  - Vehicle analytics table
  - Route analytics

- **`app/settings/page.tsx`**: Configuration page to:
  - Set max vehicles (1-6)
  - Configure overspeeding limit (40-120 km/h)
  - Set update interval (1-10 seconds)
  - Manage vehicle details (name, number, registration, owner, tracking)

- **`app/vehicles/[id]/page.tsx`**: Individual vehicle detail page showing:
  - Vehicle information
  - Overspeeding history (table with locations and timestamps)
  - All events history
  - All alerts history
  - Google Maps links for locations

- **`app/layout.tsx`**: Root layout that:
- **`app/layout.tsx`**: Root layout that:
  - Wraps all pages
  - Includes Clerk provider for authentication
  - Includes theme provider for dark mode
  - Includes Header component

    - Wraps all pages
  - Includes Clerk provider for authentication
  - Includes theme provider for dark mode
  - Includes Header component

#### **Components Directory (`components/`)**

Reusable React components organized by feature:

```
components/
├── vehicle/
│   ├── vehicle-list.tsx        # Sidebar list of all vehicles
│   └── vehicle-tracker.tsx     # Card showing tracked vehicle details
├── map/
│   └── vehicle-map.tsx         # Main Mapbox map component with markers
├── analytics/
│   ├── stats-cards.tsx         # 4 large stats cards for analytics page
│   ├── dashboard-stats-cards.tsx # 2x2 compact stats for dashboard sidebar
│   ├── speed-chart.tsx         # Line chart showing speed over time
│   ├── alert-trends.tsx        # Area chart showing alert trends
│   ├── speed-distribution.tsx  # Bar chart showing speed distribution
│   ├── vehicle-analytics.tsx   # Table showing vehicle performance
│   └── route-analytics.tsx     # Route performance metrics
├── alerts/
│   └── alert-banner.tsx        # Banner showing recent alerts
├── simulator/
│   └── simulator-control.tsx   # Panel to start/stop simulator
├── layout/
│   └── header.tsx              # Top navigation header
├── providers/
│   └── theme-provider.tsx      # Dark mode theme provider
└── ui/                         # shadcn/ui components (Button, Card, Table, etc.)
    ├── button.tsx
    ├── card.tsx
    ├── table.tsx
    ├── input.tsx
    └── ...
```

**Key Components Explained:**

- **`vehicle-map.tsx`**: 
  - Initializes Mapbox map
  - Creates custom 3D car markers (SVG-based)
  - Draws routes for tracked vehicles using Mapbox Directions API
  - Animates vehicle movement along routes
  - Handles marker clicks to select vehicles

- **`vehicle-list.tsx`**: 
  - Shows all vehicles in sidebar
  - Displays vehicle name/number, registration, owner
  - Shows status (normal, overspeeding, accident) with color coding
  - Click to track vehicle on map

- **`vehicle-tracker.tsx`**: 
  - Shows detailed info of currently tracked vehicle
  - Displays speed, location, status
  - Buttons to view history and details

- **`stats-cards.tsx`**: 
  - Large, animated cards for analytics page
  - Shows total vehicles, active alerts, overspeeding count, accidents
  - Includes icons, change indicators, progress bars

- **`speed-chart.tsx`**: 
  - Line chart (Recharts) showing speed over time for all vehicles
  - Highlights overspeeding zones

#### **Hooks Directory (`hooks/`)**

Custom React hooks for data fetching:

```
hooks/
├── use-vehicles.ts            # Fetches and subscribes to vehicle data from Supabase
├── use-alerts.ts              # Fetches and subscribes to alert data from Supabase
├── use-sync-user.ts           # Syncs Clerk user to Supabase users table
└── use-alert-notifications.tsx # Shows toast notifications for new alerts
```

**Key Hooks Explained:**

- **`use-vehicles.ts`**: 
  - Fetches all vehicles from Supabase
  - Subscribes to real-time updates using `supabase.channel()`
  - Returns `{ vehicles, loading, error }`
  - Updates automatically when database changes

- **`use-alerts.ts`**: 
  - Fetches all alerts from Supabase
  - Subscribes to real-time updates
  - Filters unresolved alerts
  - Returns `{ alerts, loading, error }`

#### **Lib Directory (`lib/`)**

Utility functions and configurations:

```
lib/
├── supabase.ts                # Supabase client initialization
├── mapbox-routes.ts           # Mapbox Directions API helper functions
└── utils.ts                   # General utility functions (cn for classnames)
```

**Key Files Explained:**

- **`supabase.ts`**: Creates Supabase client using environment variables
- **`mapbox-routes.ts`**: 
  - `getRouteFromMapbox()`: Fetches route coordinates from Mapbox Directions API
  - `getPositionAlongRoute()`: Calculates vehicle position along route based on speed/time

#### **Configuration Files**

- **`proxy.ts`**: Clerk middleware for route protection (Next.js 16 uses `proxy.ts` instead of `middleware.ts`)
- **`package.json`**: Dependencies and scripts
- **`next.config.ts`**: Next.js configuration
- **`tsconfig.json`**: TypeScript configuration
- **`tailwind.config.ts`**: Tailwind CSS configuration

---

### Backend Structure (`backend1/`)

**Note:** The deployed backend is in `backend1/`. The `backend/` folder is for local development.

```
backend1/
├── src/
│   ├── server.js                  # Main Express server entry point
│   ├── config/
│   │   └── supabase.js            # Supabase client for backend
│   ├── routes/
│   │   ├── vehicles.js            # Vehicle API routes
│   │   ├── alerts.js              # Alert API routes
│   │   └── simulator.js           # Simulator control routes
│   ├── controllers/
│   │   ├── vehicleController.js   # Vehicle request handlers
│   │   └── alertController.js     # Alert request handlers
│   ├── services/
│   │   ├── vehicleService.js      # Vehicle database operations
│   │   ├── alertService.js        # Alert detection and database operations
│   │   ├── simulatorService.js    # Simulator management (start/stop)
│   │   └── routeService.js        # Route utility functions
│   └── middleware/
│       └── errorHandler.js        # Global error handler
├── simulator/                     # Simulator code (runs in-process)
│   └── src/
│       ├── index.js               # Simulator entry point
│       ├── vehicleSimulator.js    # Main simulator class
│       ├── scenarios.js           # Test scenarios (overspeeding, accident)
│       └── config.js              # Simulator configuration
├── Dockerfile                     # Docker configuration for Railway
├── package.json                   # Backend dependencies
└── railway.json                   # Railway deployment config
```

**Key Files Explained:**

- **`src/server.js`**: 
  - Main Express server
  - Sets up CORS, JSON parsing
  - Registers routes
  - Starts server on port 5001

- **`src/routes/vehicles.js`**: 
  - `GET /api/vehicles` - Get all vehicles
  - `GET /api/vehicles/:id` - Get single vehicle
  - `PUT /api/vehicles/:id` - Update vehicle details
  - `POST /api/vehicles` - Create/update vehicle (used by simulator)

- **`src/routes/alerts.js`**: 
  - `GET /api/alerts` - Get all alerts
  - `GET /api/alerts/:vehicleId` - Get alerts for specific vehicle
  - `PUT /api/alerts/:id/resolve` - Mark alert as resolved

- **`src/routes/simulator.js`**: 
  - `POST /api/simulator/start` - Start simulator
  - `POST /api/simulator/stop` - Stop simulator
  - `GET /api/simulator/status` - Get simulator status
  - `GET /api/simulator/settings` - Get simulator settings
  - `PUT /api/simulator/settings` - Update simulator settings

- **`src/services/vehicleService.js`**: 
  - `getAllVehicles()` - Fetches all vehicles from Supabase
  - `getVehicleById()` - Fetches single vehicle
  - `upsertVehicle()` - Creates or updates vehicle in database
  - `updateVehicleDetails()` - Updates vehicle metadata (name, registration, etc.)

- **`src/services/alertService.js`**: 
  - `checkOverspeeding()` - Checks if vehicle speed exceeds limit, creates alert
  - `checkAccident()` - Checks if vehicle has accident status, creates alert
  - `getAllAlerts()` - Fetches all alerts
  - `resolveAlert()` - Marks alert as resolved

- **`src/services/simulatorService.js`**: 
  - **CRITICAL:** Manages simulator that runs **in-process** (not as separate process)
  - Imports `VehicleSimulator` class
  - Uses `setInterval()` to run simulation loop
  - Calls `vehicleService.upsertVehicle()` directly (not HTTP)
  - Works in production environments (Railway, Docker)

- **`simulator/src/vehicleSimulator.js`**: 
  - Main simulator class
  - Generates vehicle data (location, speed, status)
  - Moves vehicles along routes using Mapbox Directions API
  - Applies scenarios (normal, overspeeding, accident)
  - Updates vehicle positions based on speed and time

---

### Simulator Structure (`simulator/` or `backend1/simulator/`)

The simulator generates fake vehicle data for testing. It now runs **in-process** within the backend (not as separate process).

**Key Concepts:**

1. **Vehicle Initialization**: Creates vehicles at random starting locations (or real landmarks in Bengaluru)
2. **Route Generation**: Fetches routes from Mapbox Directions API between two points
3. **Movement Simulation**: Calculates vehicle position along route based on:
   - Current position
   - Speed (km/h)
   - Time elapsed
   - Route coordinates
4. **Scenarios**: Applies different scenarios (normal, overspeeding, accident) randomly

**Files:**

- **`vehicleSimulator.js`**: Main simulator class with logic
- **`scenarios.js`**: Scenario definitions (how to trigger overspeeding, accidents)
- **`config.js`**: Configuration (vehicle count, update interval, speed limit)

---

## 🔄 How It Works

### Step-by-Step Flow

1. **User opens application** → Landing page (`/`)

2. **User logs in** → Redirected to Dashboard (`/dashboard`)

3. **Dashboard loads**:
   - Frontend fetches vehicles from Supabase
   - Frontend subscribes to real-time updates
   - Map initializes with Mapbox
   - Vehicle markers are created

4. **Simulator starts** (via Settings page or automatically):
   - Backend starts simulator in-process
   - Simulator generates vehicle data every 2-5 seconds
   - Simulator calls `vehicleService.upsertVehicle()` directly
   - Data is saved to Supabase `vehicles` table

5. **Real-time updates**:
   - Supabase detects database change
   - Supabase Realtime sends update to frontend via WebSocket
   - Frontend receives update in `useVehicles` hook
   - UI updates automatically (map markers move, stats update)

6. **Alert detection**:
   - When vehicle speed exceeds limit, `alertService.checkOverspeeding()` is called
   - Alert is created in `alerts` table
   - Frontend receives alert via real-time subscription
   - Alert banner and notifications appear

7. **User clicks vehicle**:
   - Vehicle is selected for tracking
   - Route is fetched from Mapbox Directions API
   - Route is drawn on map
   - Car marker animates along route

8. **User views analytics**:
   - Navigate to `/analytics`
   - Charts fetch historical data
   - Statistics are calculated from current data

---

## 🗄️ Database Schema

### Tables in Supabase

#### **`vehicles` Table**

Stores real-time vehicle data.

| Column | Type | Description |
|--------|------|-------------|
| `vehicle_id` | TEXT (PK) | Unique vehicle identifier (e.g., "V001") |
| `latitude` | DOUBLE PRECISION | Current latitude |
| `longitude` | DOUBLE PRECISION | Current longitude |
| `speed` | INTEGER | Current speed in km/h |
| `status` | TEXT | Vehicle status: "normal", "overspeeding", "accident" |
| `timestamp` | TIMESTAMP | Last update time |
| `route_name` | TEXT | Current route name |
| `vehicle_name` | TEXT | Vehicle name (optional) |
| `vehicle_number` | TEXT | Vehicle number (optional) |
| `registration_number` | TEXT | Registration number (optional) |
| `owner_name` | TEXT | Owner name (optional) |
| `tracking_enabled` | BOOLEAN | Whether tracking is enabled (default: true) |
| `notes` | TEXT | Additional notes |
| `updated_at` | TIMESTAMP | Last update timestamp |

#### **`alerts` Table**

Stores all alerts (overspeeding, accidents).

| Column | Type | Description |
|--------|------|-------------|
| `alert_id` | UUID (PK) | Unique alert identifier |
| `vehicle_id` | TEXT (FK) | Reference to vehicle |
| `alert_type` | TEXT | "overspeeding" or "accident" |
| `latitude` | DOUBLE PRECISION | Location where alert occurred |
| `longitude` | DOUBLE PRECISION | Location where alert occurred |
| `speed_at_alert` | INTEGER | Speed when alert was triggered |
| `timestamp` | TIMESTAMP | When alert occurred |
| `severity` | TEXT | "low", "medium", or "high" |
| `resolved` | BOOLEAN | Whether alert is resolved (default: false) |
| `description` | TEXT | Alert description |

#### **`vehicle_events` Table**

Stores detailed event history for vehicles.

| Column | Type | Description |
|--------|------|-------------|
| `event_id` | UUID (PK) | Unique event identifier |
| `vehicle_id` | TEXT (FK) | Reference to vehicle |
| `event_type` | TEXT | "overspeeding", "accident", "route_change", "status_change", "location_update" |
| `latitude` | DOUBLE PRECISION | Event location |
| `longitude` | DOUBLE PRECISION | Event location |
| `speed` | INTEGER | Speed at time of event |
| `previous_value` | TEXT | Previous value (for status changes) |
| `new_value` | TEXT | New value (for status changes) |
| `description` | TEXT | Event description |
| `timestamp` | TIMESTAMP | When event occurred |

#### **`simulator_settings` Table**

Stores simulator configuration.

| Column | Type | Description |
|--------|------|-------------|
| `setting_id` | UUID (PK) | Unique setting identifier |
| `max_vehicles` | INTEGER | Maximum number of vehicles (1-6) |
| `overspeeding_limit` | INTEGER | Speed limit in km/h (40-120) |
| `update_interval` | INTEGER | Update interval in milliseconds (1000-10000) |
| `created_at` | TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | Last update time |

#### **`users` Table** (Optional - for Clerk integration)

Stores user information synced from Clerk.

| Column | Type | Description |
|--------|------|-------------|
| `user_id` | TEXT (PK) | Clerk user ID |
| `email` | TEXT | User email |
| `name` | TEXT | User name |
| `created_at` | TIMESTAMP | Account creation time |

---

## 🌐 API Endpoints

### Base URL
- **Local:** `http://localhost:5001/api`
- **Production:** `https://your-railway-app.up.railway.app/api`

### Vehicle Endpoints

#### `GET /api/vehicles`
Get all vehicles.

**Response:**
```json
[
  {
    "vehicle_id": "V001",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "speed": 45,
    "status": "normal",
    "timestamp": "2024-01-01T10:30:00Z",
    "vehicle_name": "Car 1",
    "vehicle_number": "KA-01-AB-1234"
  }
]
```

#### `GET /api/vehicles/:id`
Get single vehicle by ID.

#### `POST /api/vehicles`
Create or update vehicle (used by simulator).

**Request Body:**
```json
{
  "vehicle_id": "V001",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "speed": 45,
  "status": "normal"
}
```

#### `PUT /api/vehicles/:id`
Update vehicle details (name, registration, etc.).

**Request Body:**
```json
{
  "vehicle_name": "My Car",
  "registration_number": "KA-01-AB-1234",
  "owner_name": "John Doe",
  "tracking_enabled": true
}
```

### Alert Endpoints

#### `GET /api/alerts`
Get all alerts.

**Query Parameters:**
- `resolved` (boolean): Filter by resolved status
- `vehicleId` (string): Filter by vehicle ID

#### `GET /api/alerts/:vehicleId`
Get alerts for specific vehicle.

#### `PUT /api/alerts/:id/resolve`
Mark alert as resolved.

### Simulator Endpoints

#### `POST /api/simulator/start`
Start the simulator.

#### `POST /api/simulator/stop`
Stop the simulator.

#### `GET /api/simulator/status`
Get simulator status (running/stopped).

**Response:**
```json
{
  "running": true,
  "vehicleCount": 3,
  "updateInterval": 5000
}
```

#### `GET /api/simulator/settings`
Get current simulator settings.

#### `PUT /api/simulator/settings`
Update simulator settings.

**Request Body:**
```json
{
  "max_vehicles": 5,
  "overspeeding_limit": 70,
  "update_interval": 3000
}
```

### Health Check

#### `GET /api/health`
Check if server is running.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T10:30:00Z"
}
```

---

## 📱 Frontend Pages & Components

### Pages

1. **Landing Page (`/`)**
   - Public, no login required
   - Animated hero section
   - Feature grid
   - Call-to-action buttons

2. **Dashboard (`/dashboard`)**
   - **Protected route** (requires login)
   - Main map with vehicle markers
   - Sidebar with vehicle list and stats
   - Vehicle tracker card
   - Simulator control

3. **Analytics (`/analytics`)**
   - **Protected route**
   - Statistics cards
   - Speed charts
   - Alert trends
   - Vehicle analytics table

4. **Settings (`/settings`)**
   - **Protected route**
   - Simulator configuration
   - Vehicle management forms

5. **Vehicle Details (`/vehicles/[id]`)**
   - **Protected route**
   - Vehicle information
   - Overspeeding history
   - Event history
   - Alert history

6. **Login (`/login`)**
   - Clerk authentication
   - Redirects to `/dashboard` after login

### Key Components

- **`VehicleMap`**: Mapbox map with 3D car markers, route visualization
- **`VehicleList`**: Sidebar list of vehicles with status indicators
- **`VehicleTracker`**: Card showing tracked vehicle details
- **`StatsCards`**: Large statistics cards for analytics
- **`SpeedChart`**: Line chart showing speed over time
- **`AlertTrends`**: Area chart showing alert trends
- **`SimulatorControl`**: Panel to start/stop simulator

---

## 🔧 Backend Services

### Services Overview

1. **`vehicleService.js`**: Database operations for vehicles
   - CRUD operations
   - Supabase queries

2. **`alertService.js`**: Alert detection and management
   - Checks for overspeeding
   - Checks for accidents
   - Creates alerts in database

3. **`simulatorService.js`**: Simulator management
   - Starts/stops simulator
   - Manages simulation loop
   - Updates settings

4. **`routeService.js`**: Route utilities (optional)

---

## 🎮 Simulator System

### How Simulator Works

1. **Initialization**:
   - Creates specified number of vehicles
   - Assigns starting locations (real landmarks or random)
   - Sets initial speed and direction

2. **Route Generation**:
   - For each vehicle, fetches route from Mapbox Directions API
   - Route goes from current location to random destination
   - Caches route coordinates

3. **Movement Simulation**:
   - Every X seconds (update interval), calculates new position
   - Uses `interpolateAlongRoute()` function
   - Moves vehicle along route based on speed and time

4. **Scenario Application**:
   - Randomly applies scenarios (normal, overspeeding, accident)
   - Overspeeding: Increases speed above limit
   - Accident: Sets status to "accident", speed to 0

5. **Data Update**:
   - Calls `vehicleService.upsertVehicle()` directly
   - Updates database
   - Backend checks for alerts

### Scenarios

- **Normal Driving**: Speed 30-60 km/h, status "normal"
- **Overspeeding**: Speed > limit (e.g., 80 km/h), status "overspeeding"
- **Accident**: Speed 0, status "accident"
- **Stationary**: Speed 0, status "normal"

---

## 🔄 Real-time Data Flow

### Supabase Realtime

The application uses **Supabase Realtime** for instant updates:

1. **Frontend subscribes** to database changes:
   ```typescript
   supabase
     .channel('vehicles')
     .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, (payload) => {
       // Handle update
     })
     .subscribe()
   ```

2. **Database change occurs** (simulator updates vehicle)

3. **Supabase sends WebSocket message** to frontend

4. **Frontend receives update** and updates React state

5. **UI re-renders** automatically (React reactivity)

### Why This Works

- **No polling**: Frontend doesn't need to constantly request data
- **Efficient**: Only sends updates when data changes
- **Instant**: Updates appear immediately (sub-second latency)
- **Scalable**: WebSocket connection handles multiple updates

---

## 🚀 Deployment

### Frontend (Vercel)

1. **Repository**: Connect GitHub repo to Vercel
2. **Root Directory**: Set to `frontend`
3. **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_MAPBOX_TOKEN`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
4. **Build**: Vercel auto-detects Next.js

### Backend (Railway)

1. **Repository**: Connect GitHub repo (or deploy `backend1` folder separately)
2. **Root Directory**: Set to `backend1`
3. **Builder**: Docker or Nixpacks
4. **Environment Variables**:
   - `PORT` (default: 5001)
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `CORS_ORIGIN` (Vercel URL)
   - `MAPBOX_ACCESS_TOKEN`
5. **Start Command**: `node src/server.js`

### Database (Supabase)

- Cloud-hosted PostgreSQL
- Automatic backups
- Real-time subscriptions included
- Free tier available

---

## 💡 Key Concepts Explained

### 1. **Monorepo**
Single repository containing multiple projects (frontend, backend, simulator). Makes development easier, but deployment may require separate repos or root directory configuration.

### 2. **Real-time Updates**
Using Supabase Realtime (WebSocket-based) instead of polling. More efficient and provides instant updates.

### 3. **In-Process Simulator**
Simulator runs inside backend process (not as separate process). This allows it to work in cloud environments (Railway, Docker) where spawning separate processes may not work.

### 4. **Mapbox Directions API**
Fetches real routes between two coordinates. Provides realistic navigation paths, not straight lines.

### 5. **3D Car Markers**
SVG-based markers styled with CSS to look 3D. Rotate based on vehicle direction. Animate with pulsing effects.

### 6. **Clerk Authentication**
Third-party authentication service. Handles login/signup, session management. Integrates with Next.js middleware.

### 7. **App Router (Next.js 16)**
New routing system in Next.js. Files in `app/` directory automatically become routes. Uses React Server Components by default.

### 8. **Supabase Row Level Security (RLS)**
Database-level security. Policies control who can read/write data. Currently allows all operations (can be restricted later).

---

## ❓ Common Questions & Answers

### Q1: What is the purpose of this project?
**A:** This is a real-time vehicle tracking system that monitors vehicles on a map, detects overspeeding and accidents, and provides analytics. It's useful for fleet management, safety monitoring, and tracking vehicle locations in real-time.

### Q2: How does real-time updating work?
**A:** The simulator updates vehicle data in the Supabase database. Supabase Realtime sends WebSocket messages to the frontend when data changes. The frontend automatically updates the UI without needing to refresh or poll.

### Q3: What technology is used for the map?
**A:** Mapbox GL JS - an open-source mapping library. It provides interactive maps, custom markers, and route visualization.

### Q4: How is the simulator different from real GPS data?
**A:** The simulator generates fake vehicle data using Faker.js and Mapbox routes. In a real application, you would receive GPS data from actual vehicle tracking devices via APIs or IoT connections.

### Q5: What happens when a vehicle overspeeds?
**A:** The backend `alertService` detects when speed exceeds the limit. It creates an alert in the `alerts` table. The frontend receives the alert via real-time subscription and displays it in the alert banner and analytics.

### Q6: Can you track multiple vehicles at once?
**A:** Yes! The system supports up to 6 vehicles (configurable). All vehicles are shown on the map simultaneously. You can click any vehicle to track it and see its route.

### Q7: What is the difference between `backend/` and `backend1/`?
**A:** `backend/` is for local development. `backend1/` is the standalone backend repository that is deployed to Railway. They contain similar code, but `backend1/` has the simulator code included and is configured for production deployment.

### Q8: How does authentication work?
**A:** Clerk.js handles authentication. Users sign up/login through Clerk. Clerk provides session tokens. Next.js middleware (`proxy.ts`) protects routes by checking if user is authenticated.

### Q9: What happens if the simulator stops?
**A:** Vehicles remain at their last known location. The map and statistics stop updating. Users can restart the simulator from the Settings page or Dashboard.

### Q10: How are routes calculated?
**A:** Routes are fetched from Mapbox Directions API. This provides real road paths between two coordinates, considering roads, turns, and traffic. Vehicles move along these routes realistically, not in straight lines.

### Q11: What is the difference between "vehicles" and "alerts" tables?
**A:** `vehicles` table stores current vehicle state (location, speed, status). `alerts` table stores historical incidents (when overspeeding occurred, when accidents happened).