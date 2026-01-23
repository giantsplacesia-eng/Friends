# 🚀 Quick Setup Guide

This guide will get you from zero to running in under 10 minutes.

## Step 1: Supabase Setup (2 minutes)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for database to initialize (~1 minute)
4. Go to **Project Settings** → **Database**
5. Copy the connection strings:
   - **Connection pooling** (port 6543) → `DATABASE_URL`
   - **Direct connection** (port 5432) → `DIRECT_URL`

## Step 2: DeepSeek API Key (1 minute)

1. Go to [platform.deepseek.com](https://platform.deepseek.com)
2. Sign up (supports GitHub login)
3. Navigate to API Keys
4. Create a new API key → Copy it as `DEEPSEEK_API_KEY`

## Step 3: Environment Configuration (1 minute)

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and paste your credentials:

```env
DATABASE_URL=postgresql://postgres.[YOUR-REF]:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[YOUR-REF]:[PASSWORD]@[HOST]:5432/postgres
PAYLOAD_SECRET=$(openssl rand -base64 32)
DEEPSEEK_API_KEY=sk-xxxxx
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

> **Pro Tip:** Generate PAYLOAD_SECRET with: `openssl rand -base64 32`

## Step 4: Install & Initialize (3 minutes)

```bash
# Install dependencies (2-3 minutes)
npm install

# Push database schema
npm run db:push

# Generate TypeScript types
npm run payload:generate
```

## Step 5: Start Development (30 seconds)

```bash
npm run dev
```

Visit:
- **Frontend:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin

## Step 6: Create Admin User

1. Go to http://localhost:3000/admin
2. Create your first admin user
3. You're in! 🎉

---

## 🎨 Add Your First Service

1. In the admin panel, go to **Collections** → **Services**
2. Click **Create New**
3. Fill in:
   - **Title:** "AI Strategy"
   - **Category:** "AI & Automation"
   - **Priority:** "High"
   - **Vibration Intensity:** 8
   - **Giant Behavior:** "Wearing AI Goggles"
   - **Icon:** "Brain"
4. Save and publish
5. Go back to the frontend and see it appear in the floating nav!

---

## 🔍 Verify Everything Works

### Check 1: Database Connection

```bash
npm run db:studio
```

Should open Drizzle Studio at `https://local.drizzle.studio`

### Check 2: Payload Admin

Visit http://localhost:3000/admin - should see login screen

### Check 3: Frontend Animation

Visit http://localhost:3000 - should see:
- Gradient background animating on scroll
- Floating navigation buttons
- Smooth scroll physics

### Check 4: AI Endpoint

```bash
curl -X POST http://localhost:3000/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","companyUrl":"https://example.com"}'
```

Should return AI analysis JSON.

---

## ⚠️ Common Issues

### Port 3000 already in use

```bash
# Kill the process
npx kill-port 3000

# Or use a different port
PORT=3001 npm run dev
```

### Database connection timeout

1. Check Supabase project is not paused
2. Verify connection strings are correct
3. Check firewall/VPN isn't blocking Supabase

### "Module not found" errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors

```bash
npm run payload:generate
```

---

## 📚 Next: Read the Docs

- [Main README](./README.md) - Full architecture guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical deep dive
- [Payload Docs](https://payloadcms.com/docs) - CMS documentation
- [GSAP Docs](https://greensock.com/docs/) - Animation reference

---

**Happy building!** 🦖
