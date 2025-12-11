# 🚀 Deployment Guide

This guide explains how to deploy the Vehicle Tracking System in production environments.

---

## 📋 Current Architecture

- **Frontend**: Next.js app (can deploy to Vercel, Netlify, etc.)
- **Backend**: Express.js API (Node.js)
- **Simulator**: Vehicle data generator (runs in-process with backend)
- **Database**: Supabase (hosted)

---

## 🔧 Deployment Options

### Option 1: **In-Process Simulator (Recommended for most cases)**

The simulator now runs **inside the backend process** as a module. This works for:
- Traditional servers (VPS, dedicated servers)
- Docker containers
- Cloud platforms (AWS EC2, Google Cloud, Azure)
- Platform-as-a-Service (Heroku, Railway, Render)

**How it works:**
- Backend imports simulator logic directly
- Simulator runs as an interval inside the backend process
- No separate process spawning needed
- Works in containers and serverless-friendly environments

---

### Option 2: **Separate Simulator Service (For high-load scenarios)**

If you need the simulator as a completely separate service:

1. **Deploy simulator separately** (as a standalone Node.js service)
2. **Use environment variables** to configure backend URL
3. **Deploy to a separate container/server**

Example Docker setup:
```dockerfile
# Dockerfile.simulator
FROM node:18
WORKDIR /app
COPY simulator/package.json simulator/
RUN npm install
COPY simulator/ .
CMD ["node", "src/index.js", "--start"]
```

---

## 🐳 Docker Deployment (Recommended)

### Backend Dockerfile

Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package.json backend/package-lock.json ./
COPY simulator/package.json ../simulator/

# Install dependencies
RUN npm install --production

# Copy source code (backend + simulator)
COPY backend/ ./backend/
COPY simulator/ ../simulator/

# Expose port
EXPOSE 5000

# Start server
WORKDIR /app/backend
CMD ["node", "src/server.js"]
```

### Docker Compose

Create `docker-compose.yml` in root:
```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_SERVICE_KEY=${SUPABASE_SERVICE_KEY}
      - BACKEND_URL=${BACKEND_URL:-http://localhost:5000}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Build and Run

```bash
# Build
docker-compose build

# Run
docker-compose up -d

# View logs
docker-compose logs -f backend
```

---

## ☁️ Cloud Platform Deployment

### Railway / Render / Fly.io

1. **Connect your GitHub repository**
2. **Set environment variables:**
   ```
   PORT=5000
   NODE_ENV=production
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_service_key
   BACKEND_URL=https://your-backend-url.com
   ```

3. **Set build command:**
   ```bash
   cd backend && npm install && npm run build
   ```

4. **Set start command:**
   ```bash
   cd backend && node src/server.js
   ```

5. **Make sure simulator folder is included** in your deployment

---

## 🌐 Vercel / Netlify (Frontend)

### Vercel Deployment

1. **Connect repository** to Vercel
2. **Set root directory** to `frontend/`
3. **Set build command:** `pnpm build`
4. **Set output directory:** `.next`
5. **Add environment variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXT_PUBLIC_MAPBOX_TOKEN=...
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

---

## 🔒 Environment Variables Checklist

### Backend (.env)
```env
PORT=5000
NODE_ENV=production

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=xxx
SUPABASE_ANON_KEY=xxx

# Backend URL (for simulator to call itself)
BACKEND_URL=https://your-backend-url.com

# CORS
CORS_ORIGIN=https://your-frontend-url.com
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
NEXT_PUBLIC_MAPBOX_TOKEN=xxx
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

---

## ⚠️ Important Notes

### 1. **Serverless Limitations**

If deploying to **serverless** (AWS Lambda, Vercel Serverless Functions):
- ⚠️ **In-process simulator won't work** (functions timeout)
- ✅ **Use separate simulator service** instead
- ✅ Or use **Supabase Edge Functions** for simulator
- ✅ Or use **cron jobs** to trigger simulation

### 2. **Memory Management**

- Simulator runs in the same process as backend
- Monitor memory usage in production
- Consider separate service if memory usage is high

### 3. **Scaling**

- For multiple instances: Ensure only one simulator runs
- Use **Redis** or **database flag** to coordinate simulator
- Or use **separate simulator service** that's always running

---

## 🧪 Testing Deployment

### 1. Health Check
```bash
curl https://your-backend-url.com/api/health
```

### 2. Start Simulator
```bash
curl -X POST https://your-backend-url.com/api/simulator/start \
  -H "Content-Type: application/json" \
  -d '{"vehicleCount": 3}'
```

### 3. Check Status
```bash
curl https://your-backend-url.com/api/simulator/status
```

### 4. Verify Database
- Check Supabase dashboard
- Vehicles should be updating

---

## 🔄 Migration from Development

### Current Setup (Dev)
- Simulator runs as separate process via `spawn()`
- Backend starts simulator as child process

### Production Setup
- Simulator runs **in-process** as module
- No process spawning needed
- Works in containers and cloud platforms

**No code changes needed in frontend!** ✅

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Railway Deployment](https://docs.railway.app/)
- [Render Deployment](https://render.com/docs)
- [Vercel Deployment](https://vercel.com/docs)

---

## 🆘 Troubleshooting

### Simulator not starting?
- Check if simulator module path is correct
- Verify `simulator/` folder is included in deployment
- Check backend logs for errors

### Memory issues?
- Consider reducing vehicle count
- Increase container/server memory
- Use separate simulator service

### API calls failing?
- Verify `BACKEND_URL` environment variable
- Check CORS settings
- Verify network connectivity

