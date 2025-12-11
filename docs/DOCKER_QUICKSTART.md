# Docker Quick Start Guide

## 🚀 Run the Entire Project in Docker

### Step 1: Create `.env` file

Create a `.env` file in the root directory with your environment variables:

```env
# Backend
PORT=5001
NODE_ENV=development
SUPABASE_URL=https://dnfdintwurgpgrpbbfti.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuZmRpbnR3dXJncGdycGJiZnRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MzM4ODYsImV4cCI6MjA3OTIwOTg4Nn0.mhxLX7bxvGh2YfNTYGo1shYt-j1d9G4AhrtF8U6m2Ik
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuZmRpbnR3dXJncGdycGJiZnRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzYzMzg4NiwiZXhwIjoyMDc5MjA5ODg2fQ.lmVXkZ35cd6dIvNEOzTDDCLU3qRoaCdt5tMg20deI1g
BACKEND_URL=http://localhost:5001
CORS_ORIGIN=http://localhost:3000
DEFAULT_SPEED_LIMIT=60

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_SUPABASE_URL=https://dnfdintwurgpgrpbbfti.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuZmRpbnR3dXJncGdycGJiZnRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MzM4ODYsImV4cCI6MjA3OTIwOTg4Nn0.mhxLX7bxvGh2YfNTYGo1shYt-j1d9G4AhrtF8U6m2Ik
SUPABASE_URL=https://dnfdintwurgpgrpbbfti.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuZmRpbnR3dXJncGdycGJiZnRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzYzMzg4NiwiZXhwIjoyMDc5MjA5ODg2fQ.lmVXkZ35cd6dIvNEOzTDDCLU3qRoaCdt5tMg20deI1g
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuZmRpbnR3dXJncGdycGJiZnRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MzM4ODYsImV4cCI6MjA3OTIwOTg4Nn0.mhxLX7bxvGh2YfNTYGo1shYt-j1d9G4AhrtF8U6m2Ik

# Clerk (Required - Get from Clerk Dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-key-here
CLERK_SECRET_KEY=sk_test_your-key-here

# Mapbox (Required - Get from Mapbox Dashboard)
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your-token-here

# Simulator
SIMULATOR_INTERVAL=2000
VEHICLE_COUNT=3
```

**⚠️ IMPORTANT**: Replace the Clerk and Mapbox values with your actual keys!

### Step 2: Run Docker Compose

```bash
docker compose up --build
```

This will:
- Build both frontend and backend Docker images
- Start both services
- Connect them on the same Docker network

### Step 3: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001/api
- **Health Check**: http://localhost:5001/api/health

### Step 4: Stop the Services

Press `Ctrl+C` or run:

```bash
docker compose down
```

## 📋 What's Running?

- ✅ **Backend** (Express.js) on port 5001
- ✅ **Frontend** (Next.js) on port 3000
- ✅ **Simulator** (runs in-process within backend)

## 🔍 Troubleshooting

**Port already in use?**
- Change ports in `docker-compose.yml` if 3000 or 5001 are taken

**Can't connect to backend?**
- Check backend logs: `docker compose logs backend`
- Verify health endpoint: `curl http://localhost:5001/api/health`

**Frontend not loading?**
- Check frontend logs: `docker compose logs frontend`
- Verify environment variables are set correctly

**Need to rebuild?**
```bash
docker compose down
docker compose up --build --force-recreate
```

## 📚 More Details

See `docs/DOCKER_SETUP.md` for comprehensive documentation.

