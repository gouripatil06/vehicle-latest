# 📝 Environment Variables Template

Copy these templates and create your `.env` files in the respective folders.

---

## 1️⃣ Frontend Environment Variables

**Location:** `frontend/.env.local`

```env
# Frontend Environment Variables

# Supabase Configuration
# Get these from: Supabase Dashboard → Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxx

# Mapbox Configuration
# Get this from: https://account.mapbox.com/access-tokens
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNs...

# Backend API URL (optional)
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**How to create:**
```bash
cd frontend
touch .env.local
# Then paste the above content and fill in your actual values
```

---

## 2️⃣ Backend Environment Variables

**Location:** `backend/.env`

```env
# Backend Environment Variables

# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration
# Get these from: Supabase Dashboard → Project Settings → API
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxx
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxx

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Speed Limit Configuration (in km/h)
DEFAULT_SPEED_LIMIT=60
```

**How to create:**
```bash
cd backend
touch .env
# Then paste the above content and fill in your actual values
```

---

## 3️⃣ Simulator Environment Variables

**Location:** `simulator/.env` (will be created when we set up simulator)

```env
# Simulator Environment Variables

# Backend API URL
BACKEND_URL=http://localhost:5000

# Supabase Configuration (for direct database access if needed)
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxx

# Simulator Configuration
SIMULATOR_INTERVAL=2000
VEHICLE_COUNT=3
```

**How to create:**
```bash
cd simulator
touch .env
# Then paste the above content and fill in your actual values
```

---

## 🔑 Where to Get These Values

### Supabase Credentials

1. Go to [https://supabase.com](https://supabase.com)
2. Login and select your project
3. Go to **Project Settings** (⚙️ icon) → **API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_KEY` ⚠️ (Keep secret!)

### Mapbox Token

1. Go to [https://account.mapbox.com/access-tokens](https://account.mapbox.com/access-tokens)
2. Copy your **Default Public Token** (starts with `pk.eyJ...`)
3. Use it for `NEXT_PUBLIC_MAPBOX_TOKEN`

---

## ✅ Verification Checklist

After creating your `.env` files, verify:

- [ ] `frontend/.env.local` exists with all values filled
- [ ] `backend/.env` exists with all values filled
- [ ] Supabase URL starts with `https://` and ends with `.supabase.co`
- [ ] Supabase keys start with `eyJhbGc...`
- [ ] Mapbox token starts with `pk.eyJ...`
- [ ] `.env` files are in `.gitignore` (should already be there)

---

## 🚨 Security Reminder

**NEVER commit `.env` files to Git!**

Check `.gitignore` includes:
```
.env
.env.local
.env.*.local
```

This is already configured in Next.js by default, but double-check!

