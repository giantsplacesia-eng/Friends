# 🚀 Next Steps - Friends with Giants

## ⚡ Quick Start (3 minutes)

### 1. Add Supabase Database URLs (2 min)

**Where to get them:**
- Go to: https://supabase.com/dashboard
- Select your project
- **Settings** → **Database** → **Connection String**

**What to copy:**
1. **Connection Pooling** (port 6543) → `DATABASE_URL`
2. **Direct Connection** (port 5432) → `DIRECT_URL`

**Where to paste:**
Open `.env.local` and replace the placeholder URLs:

```env
DATABASE_URL=postgresql://postgres.YOUR-REF:YOUR-PASS@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.YOUR-REF:YOUR-PASS@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

### 2. Push Database Schema (30 sec)

```bash
npm run db:push
```

Expected output: ✅ Tables created successfully

### 3. Start Development Server (30 sec)

```bash
npm run dev
```

Expected output:
```
✓ Ready in 3s
○ Local: http://localhost:3000
```

---

## 🎯 First-Time Setup Checklist

### After Server Starts:

- [ ] **Visit Admin:** http://localhost:3000/admin
- [ ] **Create admin user** (email + password)
- [ ] **Add first service:**
  - Title: "AI Strategy"
  - Category: "AI & Automation"
  - Priority: "High"
  - Vibration Intensity: 8
  - Giant Behavior: "Wearing AI Goggles"
  - Icon: "brain"

- [ ] **Visit Frontend:** http://localhost:3000
- [ ] **Verify:** Left navigation shows your service floating button
- [ ] **Test:** Click the floating button and watch the Giant react!

---

## 🔧 If Something Goes Wrong

### Dev Server Won't Start
```bash
# Check for errors in .env.local
cat .env.local

# Verify all dependencies
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

### Database Connection Error
- Double-check DATABASE_URL has port **6543** (pooler)
- Double-check DIRECT_URL has port **5432** (direct)
- Verify your Supabase project isn't paused

### TypeScript Errors
```bash
# Regenerate Payload types
npm run payload:generate

# Restart your editor
```

---

## 📖 Development Reference

### File Structure
```
src/
├── app/
│   ├── (site)/page.tsx       ← Main homepage
│   └── (payload)/admin/      ← CMS admin panel
├── collections/              ← Payload collections
│   ├── Services.ts
│   ├── CaseStudies.ts
│   ├── Leads.ts
│   └── Media.ts
├── components/
│   ├── canvas/GiantScrubber.tsx  ← Giant character
│   ├── nav/LeftController.tsx     ← Floating nav
│   └── ui/                        ← shadcn components
├── lib/
│   ├── gsap-register.ts      ← GSAP setup (ALWAYS import from here)
│   └── ai-agent.ts           ← DeepSeek AI config
└── db/schema.ts              ← Custom tables (AI features)
```

### Key Commands
```bash
npm run dev              # Start dev server
npm run verify           # Check setup status
npm run db:studio        # Open database GUI
npm run payload:generate # Update TypeScript types
```

### Critical Imports
```tsx
// ✅ CORRECT - Always import GSAP like this:
import { gsap, ScrollTrigger } from '@/lib/gsap-register';

// ❌ WRONG - Never import directly:
// import { gsap } from 'gsap';
```

---

## 🎨 Adding Your First Feature

### Example: Add a new floating nav button

1. **Add Service in Admin:**
   - Go to http://localhost:3000/admin
   - Collections → Services → Create New
   - Fill in all fields
   - Publish

2. **It appears automatically!**
   - The LeftController fetches services
   - Buttons are generated with GSAP animations
   - Giant behavior triggers on click

3. **Customize animations:**
   - Edit: `src/components/nav/LeftController.tsx`
   - Adjust vibration intensity (1-10)
   - Modify GSAP timeline parameters

---

## 📝 Content Strategy

### Services Collection
Use this for:
- What your agency offers
- Triggers floating nav buttons
- Controls Giant behavior states

**Example Services:**
- AI Strategy (goggles pose)
- Brand Development (thinking pose)
- Marketing Campaigns (pointing pose)
- Technical Development (neutral pose)

### Case Studies Collection
Use this for:
- Portfolio work
- Success stories
- Client testimonials
- Relationship to Services (FK)

### Leads Collection
Use this for:
- CRM / contact form submissions
- Triggers AI analysis
- Stores DeepSeek recommendations

---

## 🚦 When You're Ready to Deploy

1. Review: `DEPLOYMENT.md`
2. Create production Supabase project
3. Add production env vars to Vercel
4. Deploy with: `vercel --prod`

---

## 💡 Pro Tips

### Performance
- Keep Giant canvas at `z-index: -10` with `pointer-events: none`
- Pre-cache all 60 PNG frames before animating
- Use GSAP `quickTo` for 120fps mouse tracking
- Target 60fps for all animations

### Type Safety
- Run `npm run payload:generate` after changing collections
- Use generated types from `src/payload-types.ts`
- Never use `any` types

### Testing
- Run `npx agent-browser snapshot -i` after major features
- Verify Giant doesn't block clicks
- Check animations at 60fps in Chrome DevTools

---

**You're all set! Time to build.** 🦖✨

For detailed architecture and advanced patterns, see:
- **CLAUDE.md** - Full technical guide
- **ARCHITECTURE.md** - System design deep dive
- **SETUP_COMPLETE.md** - Detailed setup verification
