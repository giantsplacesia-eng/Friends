# ⚡ Quick Reference

One-page cheat sheet for daily development.

---

## 🚀 Common Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Database management
npm run db:push          # Push schema changes
npm run db:studio        # Open database GUI

# Payload CMS
npm run payload:generate # Generate TypeScript types

# Linting & Formatting
npm run lint
```

---

## 📁 File Locations

```
🎨 Components
  /src/components/canvas/GiantScrubber.tsx
  /src/components/nav/LeftController.tsx
  /src/components/ui/SmoothScrollProvider.tsx

📊 Collections (Payload CMS)
  /src/collections/Services.ts
  /src/collections/CaseStudies.ts
  /src/collections/Leads.ts

🗄️ Database
  /src/db/schema.ts     # Drizzle custom tables
  /src/db/index.ts      # Drizzle client

🤖 AI Integration
  /src/lib/ai-agent.ts
  /src/app/api/ai/analyze/route.ts

🎭 Pages
  /src/app/(site)/page.tsx           # Frontend
  /src/app/(payload)/admin/[...]/    # CMS Admin
```

---

## 🔧 Environment Variables

```env
# Required
DATABASE_URL=postgresql://...6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://...5432/postgres
PAYLOAD_SECRET=random-secret-here
DEEPSEEK_API_KEY=sk-xxxxx

# Optional
OPENAI_API_KEY=sk-xxxxx
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

---

## 🎨 Adding a New Service

1. **In Payload Admin** (`/admin`):
   - Collections → Services → Create New
   - Set priority (high/medium/low) for button size
   - Set vibrationIntensity (1-10) for animation speed
   - Set giantBehavior for character state

2. **Verify on Frontend** (`/`):
   - Should appear in left nav
   - Should float with set intensity
   - Click to see service details

---

## 🤖 Testing AI Analysis

```bash
curl -X POST http://localhost:3000/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "companyUrl": "https://example.com"
  }'
```

Expected response:
```json
{
  "success": true,
  "analysis": {
    "brandVibe": "Modern, tech-forward...",
    "missingGaps": ["..."],
    "giantRecommendation": "...",
    "confidenceScore": 85
  }
}
```

---

## 🎬 Animation Tweaks

### Adjust Scroll Speed

In `GiantScrubber.tsx`:
```typescript
scrub: 1.5  // Lower = faster, Higher = slower
```

### Change Float Intensity

In `LeftController.tsx`:
```typescript
y: `random(-15, 15)`  // Increase range for more movement
duration: `random(3, 6)` // Lower for faster animation
```

### Customize Smooth Scroll

In `SmoothScrollProvider.tsx`:
```typescript
duration: 1.2  // Scroll duration
easing: (t) => ...  // Custom easing function
```

---

## 🗄️ Database Queries

### Check Lead Analysis

```typescript
import { db, leadAnalysis } from '@/db';
import { eq } from 'drizzle-orm';

// Get analysis for specific lead
const analysis = await db
  .select()
  .from(leadAnalysis)
  .where(eq(leadAnalysis.leadEmail, 'user@example.com'))
  .limit(1);
```

### Get All Services from Payload

```typescript
import { getPayload } from 'payload';
import config from '@/payload.config';

const payload = await getPayload({ config });
const services = await payload.find({
  collection: 'services',
  sort: '-priority',
});
```

---

## 🐛 Debugging

### Check GSAP Animations

Open browser console:
```javascript
// See all ScrollTriggers
ScrollTrigger.getAll()

// Kill all animations
gsap.killTweensOf('*')

// Refresh ScrollTrigger
ScrollTrigger.refresh()
```

### Database Issues

```bash
# View database in browser
npm run db:studio

# Check connection
psql $DATABASE_URL -c "SELECT version();"

# Reset database (WARNING: Deletes data)
npm run db:push -- --force
```

### Payload Admin Issues

```bash
# Regenerate types
npm run payload:generate

# Clear Next.js cache
rm -rf .next

# Check Payload version
npm list payload
```

---

## 📦 Adding New Dependencies

```bash
# Production dependency
npm install package-name

# Development dependency
npm install -D package-name

# Update all dependencies
npm update

# Check for outdated packages
npm outdated
```

---

## 🎯 Performance Profiling

### React DevTools Profiler

1. Install React DevTools extension
2. Open Profiler tab
3. Start recording
4. Interact with page
5. Stop and analyze

### Lighthouse Audit

```bash
# Run lighthouse
npx lighthouse http://localhost:3000 --view

# Check specific metrics
npx lighthouse http://localhost:3000 --only-categories=performance
```

### GSAP Performance

```javascript
// Enable FPS meter
gsap.ticker.fps(60);

// Log animation updates
ScrollTrigger.defaults({
  onUpdate: self => console.log('Progress:', self.progress)
});
```

---

## 🔐 Security

### Generate Secrets

```bash
# Generate PAYLOAD_SECRET
openssl rand -base64 32

# Generate secure password
openssl rand -base64 24
```

### Check for Vulnerabilities

```bash
# Run security audit
npm audit

# Fix auto-fixable issues
npm audit fix

# View detailed report
npm audit --production
```

---

## 📱 Responsive Testing

### Viewport Sizes

```typescript
// Tailwind breakpoints
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
2xl: 1536px // Extra large
```

### Test Locally

```bash
# Access from mobile on same network
# Find your local IP
ipconfig  # Windows
ifconfig  # Mac/Linux

# Visit from mobile
http://192.168.1.X:3000
```

---

## 🎨 Color Palette

```css
/* Main gradient */
from-blue-500 to-purple-500

/* Background */
--background: 0 0% 5%  /* Almost black */
--foreground: 0 0% 98% /* Almost white */

/* Glass effects */
bg-white/5   /* 5% opacity white */
bg-white/10  /* 10% opacity white */
bg-white/20  /* 20% opacity white */
```

---

## 🚀 Deployment Quick Checklist

```bash
# 1. Test build
npm run build
npm run start

# 2. Set production env vars in Vercel
DATABASE_URL=...
PAYLOAD_SECRET=...
DEEPSEEK_API_KEY=...

# 3. Push to GitHub
git push origin main

# 4. Vercel auto-deploys
# 5. Run migrations
npm run db:push

# 6. Create admin user at /admin
```

---

## 📚 Helpful Links

- **Local Dev:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin
- **Database GUI:** Run `npm run db:studio`
- **Docs:** [README.md](./README.md)
- **Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md)

---

**Keep this file open while coding!** 🚀
