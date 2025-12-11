# Docker Setup Guide

This guide explains how to run both frontend and backend together using Docker Compose.

## Prerequisites

- Docker Desktop installed and running
- All environment variables configured (see below)

## Quick Start

1. **Create a `.env` file in the root directory** with the following variables:

```env
# Backend Configuration
PORT=5001
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://dnfdintwurgpgrpbbfti.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-role-key

# Backend URL
BACKEND_URL=http://localhost:5001
CORS_ORIGIN=http://localhost:3000
DEFAULT_SPEED_LIMIT=60

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_SUPABASE_URL=https://dnfdintwurgpgrpbbfti.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Clerk Authentication (Get from Clerk Dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-key
CLERK_SECRET_KEY=sk_test_your-key

# Mapbox Token (Get from Mapbox Dashboard)
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your-token

# Simulator Configuration
SIMULATOR_INTERVAL=2000
VEHICLE_COUNT=3
```

2. **Build and run the containers:**

```bash
docker compose up --build
```

3. **Access the application:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001/api
- Health Check: http://localhost:5001/api/health

## Environment Variables Explained

### Backend Variables

- `PORT`: Backend server port (default: 5001)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous/public key
- `SUPABASE_SERVICE_KEY`: Supabase service role key (has admin access)
- `BACKEND_URL`: URL where backend is accessible (used internally)
- `CORS_ORIGIN`: Frontend URL allowed to make CORS requests
- `DEFAULT_SPEED_LIMIT`: Default speed limit for overspeeding detection (km/h)

### Frontend Variables

- `NEXT_PUBLIC_API_URL`: Backend URL accessible from browser (use `http://localhost:5001` for local Docker)
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase URL (same as backend)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key (same as backend)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key (from Clerk Dashboard)
- `CLERK_SECRET_KEY`: Clerk secret key (from Clerk Dashboard)
- `NEXT_PUBLIC_MAPBOX_TOKEN`: Mapbox access token (from Mapbox Dashboard)
- `SIMULATOR_INTERVAL`: Update interval for simulator (milliseconds)
- `VEHICLE_COUNT`: Number of vehicles to simulate

## Docker Compose Services

### Backend Service

- **Port**: 5001
- **Container Name**: `vehicle-tracking-backend`
- **Health Check**: `/api/health` endpoint
- **Includes**: Backend server + Simulator (in-process)

### Frontend Service

- **Port**: 3000
- **Container Name**: `vehicle-tracking-frontend`
- **Depends On**: Backend service
- **Build**: Multi-stage build for optimized production image

## Useful Commands

### Start services
```bash
docker compose up
```

### Start in detached mode (background)
```bash
docker compose up -d
```

### Rebuild and start
```bash
docker compose up --build
```

### Stop services
```bash
docker compose down
```

### View logs
```bash
docker compose logs -f
```

### View backend logs only
```bash
docker compose logs -f backend
```

### View frontend logs only
```bash
docker compose logs -f frontend
```

### Stop and remove volumes
```bash
docker compose down -v
```

## Troubleshooting

### Port Already in Use

If ports 3000 or 5001 are already in use, you can change them in `docker compose.yml`:

```yaml
ports:
  - "3001:3000"  # Change host port
```

### Environment Variables Not Loading

Make sure your `.env` file is in the root directory (same level as `docker compose.yml`).

### Backend Not Accessible from Frontend

- Check that `NEXT_PUBLIC_API_URL` is set to `http://localhost:5001`
- Verify backend is running: `curl http://localhost:5001/api/health`
- Check CORS settings in backend

### Build Failures

- Clear Docker cache: `docker compose build --no-cache`
- Check Docker Desktop is running
- Verify all package.json files are present

## Production Deployment

For production deployment:

1. Update `BACKEND_URL` to your production backend URL
2. Update `NEXT_PUBLIC_API_URL` to your production backend URL
3. Update `CORS_ORIGIN` to your production frontend URL
4. Set `NODE_ENV=production`
5. Use production environment variables (not development keys)

## Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │────────▶│    Backend      │
│   (Next.js)     │  HTTP   │  (Express)      │
│   Port: 3000    │         │  Port: 5001     │
└─────────────────┘         └─────────────────┘
                                      │
                                      │ In-Process
                                      ▼
                              ┌─────────────────┐
                              │   Simulator     │
                              │  (Generates     │
                              │  Vehicle Data)  │
                              └─────────────────┘
                                      │
                                      ▼
                              ┌─────────────────┐
                              │    Supabase     │
                              │   (Database)    │
                              └─────────────────┘
```

The simulator runs in-process within the backend service, eliminating the need for a separate simulator container.

