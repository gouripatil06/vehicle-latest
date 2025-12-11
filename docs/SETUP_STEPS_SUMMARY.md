# 🚀 Quick Setup Steps Summary

This is a quick reference guide for setting up all prerequisites.

---

## ⚡ Quick Steps (In Order)

### Step 1: Supabase Setup (15 minutes)

1. **Create Account:**
   - Go to https://supabase.com
   - Sign up with GitHub/Google/Email

2. **Create Project:**
   - Click "New Project"
   - Name: `vehicle-tracking-system`
   - Set database password (SAVE IT!)
   - Choose region (closest to you)
   - Select Free plan

3. **Get Credentials:**
   - Go to ⚙️ Project Settings → API
   - Copy:
     - **Project URL** (e.g., `https://xxxxx.supabase.co`)
     - **anon public key** (long string starting with `eyJ...`)
     - **service_role key** (long string - KEEP SECRET!)

4. **Create Database Tables:**
   - Go to SQL Editor
   - Copy SQL from `SETUP_PREREQUISITES.md` section "Step 4: Create Database Tables"
   - Run the SQL query
   - Verify tables created in Table Editor

5. **Enable Realtime:**
   - Go to Database → Replication
   - Enable Realtime for: `vehicles`, `alerts`, `vehicle_history`
   - Or run the SQL command provided in prerequisites doc

**✅ Supabase Done!**

---

### Step 2: Mapbox Setup (5 minutes)

1. **Create Account:**
   - Go to https://www.mapbox.com
   - Sign up with Email/GitHub/Google

2. **Get Access Token:**
   - Go to https://account.mapbox.com/access-tokens
   - Copy your **Default Public Token** (starts with `pk.eyJ...`)

**✅ Mapbox Done!**

---

### Step 3: Create Environment Files (5 minutes)

#### Frontend `.env.local`

```bash
cd frontend
touch .env.local
```

Then open `frontend/.env.local` and paste:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Replace with your actual values!**

#### Backend `.env`

```bash
cd backend
touch .env
```

Then open `backend/.env` and paste:

```env
PORT=5000
NODE_ENV=development

SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

CORS_ORIGIN=http://localhost:3000
DEFAULT_SPEED_LIMIT=60
```

**Replace with your actual values!**

---

## ✅ Verification Checklist

After completing all steps:

- [ ] Supabase project created and running
- [ ] Database tables created (`vehicles`, `alerts`, `vehicle_history`)
- [ ] Realtime enabled for all tables
- [ ] Supabase credentials copied
- [ ] Mapbox account created
- [ ] Mapbox token copied
- [ ] `frontend/.env.local` created and filled
- [ ] `backend/.env` created and filled
- [ ] All values replaced with actual credentials

---

## 📝 Example Values Format

### Supabase URL
```
✅ Correct: https://abcdefghijklmnop.supabase.co
❌ Wrong: https://supabase.com
```

### Supabase Keys
```
✅ Correct: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMDAwMDAwMCwiZXhwIjoxOTQ1NTczNjAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
❌ Wrong: supabase-key-123
```

### Mapbox Token
```
✅ Correct: pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNs...
❌ Wrong: mapbox-token-123
```

---

## 🎯 Next Steps After Setup

Once all prerequisites are complete:

1. **Move to Phase 2** - Backend Setup
2. **Initialize Backend** - Create Express.js server
3. **Initialize Frontend** - Install missing dependencies
4. **Start Building** - Follow Development Roadmap

---

## 🆘 Need Help?

If you get stuck:
- Check `SETUP_PREREQUISITES.md` for detailed instructions
- Check `ENV_FILES_TEMPLATE.md` for exact .env file format
- Verify all credentials are correct
- Make sure .env files are in correct folders

---

**Status:** Ready to Start Setup! ✅

