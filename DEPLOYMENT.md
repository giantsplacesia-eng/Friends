# 🚀 Deployment Guide

Step-by-step guide to deploying Friends with Giants to production.

---

## 🎯 Pre-Deployment Checklist

- [ ] Test all features locally
- [ ] Run `npm run build` successfully
- [ ] Verify environment variables are set
- [ ] Backup Supabase database
- [ ] Set strong `PAYLOAD_SECRET`
- [ ] Enable Supabase connection pooling
- [ ] Test AI endpoint with rate limiting

---

## 📦 Vercel Deployment (Recommended)

### Step 1: Prepare Repository

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
gh repo create friends-with-giants --private
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Import Project**
3. Select your GitHub repository
4. Framework Preset: **Next.js**
5. Root Directory: `./` (leave default)

### Step 3: Configure Environment Variables

Add these in Vercel dashboard:

```env
DATABASE_URL=postgresql://postgres.[PROJECT]:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[PROJECT]:[PASSWORD]@[HOST]:5432/postgres
PAYLOAD_SECRET=[GENERATE_NEW_SECRET]
DEEPSEEK_API_KEY=sk-xxxxx
OPENAI_API_KEY=sk-xxxxx (optional)
NEXT_PUBLIC_SERVER_URL=https://your-domain.vercel.app
```

> **Critical:** Generate a NEW `PAYLOAD_SECRET` for production!
> ```bash
> openssl rand -base64 32
> ```

### Step 4: Deploy

Click **Deploy** and wait 2-3 minutes.

### Step 5: Run Post-Deployment Migrations

Vercel doesn't run build scripts by default. Push Drizzle schema manually:

```bash
# From your local machine
npm run db:push
```

Or add to Vercel build command:

```json
// package.json
"scripts": {
  "vercel-build": "npm run db:push && next build"
}
```

### Step 6: Create Production Admin User

1. Visit `https://your-domain.vercel.app/admin`
2. Create your first admin user
3. **Immediately** disable public user creation (see Security section)

---

## 🔐 Production Security

### 1. Disable User Registration

Edit `src/payload.config.ts`:

```typescript
{
  slug: 'users',
  auth: true,
  access: {
    create: () => false, // ← Add this
    read: ({ req }) => !!req.user,
  },
}
```

### 2. Enable CORS Protection

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_SERVER_URL },
        ],
      },
    ];
  },
};
```

### 3. Add Rate Limiting to AI Endpoint

Install Upstash Redis:

```bash
npm install @upstash/ratelimit @upstash/redis
```

Update `src/app/api/ai/analyze/route.ts`:

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'),
});

export async function POST(req: Request) {
  const { email } = await req.json();
  const { success } = await ratelimit.limit(email);

  if (!success) {
    return new Response('Too many requests', { status: 429 });
  }

  // ... rest of code
}
```

### 4. Configure Supabase Security

In Supabase dashboard:

1. **Database** → **Connection Pooling** → Enable
2. **Authentication** → **Policies** → Restrict public access
3. **Settings** → **API** → Disable public schema if not needed

---

## 🌍 Custom Domain Setup

### 1. Add Domain to Vercel

1. Go to your project → **Settings** → **Domains**
2. Add your domain (e.g., `friendswithgiants.com`)
3. Vercel provides DNS records

### 2. Configure DNS

Add these records at your domain registrar:

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

### 3. Update Environment Variables

```env
NEXT_PUBLIC_SERVER_URL=https://friendswithgiants.com
```

### 4. Redeploy

Click **Redeploy** in Vercel dashboard to apply changes.

---

## 📊 Monitoring Setup

### 1. Vercel Analytics

```bash
npm install @vercel/analytics
```

Add to root layout:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Error Tracking with Sentry

```bash
npx @sentry/wizard@latest -i nextjs
```

Follow the wizard prompts.

### 3. Database Monitoring

Enable Supabase metrics:

1. Go to **Database** → **Logs**
2. Enable query logging
3. Set up alerts for slow queries

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🚨 Rollback Strategy

### Quick Rollback via Vercel

1. Go to **Deployments**
2. Find the last working deployment
3. Click **⋯** → **Promote to Production**

### Database Rollback

```bash
# Create backup before migrations
pg_dump $DATABASE_URL > backup.sql

# Restore if needed
psql $DATABASE_URL < backup.sql
```

---

## 📈 Performance Optimization

### 1. Enable Image Optimization

Already configured via Next.js. Verify in `next.config.ts`:

```typescript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
}
```

### 2. Edge Caching

Add cache headers to API routes:

```typescript
export async function GET() {
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}
```

### 3. Database Connection Pooling

Ensure `DATABASE_URL` uses port 6543 (PgBouncer pooler).

### 4. Static Generation Where Possible

```typescript
// Generate static pages for services
export async function generateStaticParams() {
  const services = await getPayloadClient().find({
    collection: 'services',
  });

  return services.docs.map((service) => ({
    slug: service.slug,
  }));
}
```

---

## 🧪 Staging Environment

### 1. Create Staging Branch

```bash
git checkout -b staging
git push -u origin staging
```

### 2. Deploy to Vercel Preview

Vercel automatically creates preview deployments for non-main branches.

Access at: `https://friends-with-giants-git-staging-yourname.vercel.app`

### 3. Staging Database

Create separate Supabase project for staging:

```env
# .env.staging
DATABASE_URL=[STAGING_DATABASE_URL]
```

---

## 📝 Post-Deployment Tasks

- [ ] Test all pages (/, /admin, case studies)
- [ ] Verify AI endpoint works
- [ ] Check floating nav animations
- [ ] Test scroll physics on mobile
- [ ] Submit sitemap to Google: `/sitemap.xml`
- [ ] Set up monitoring alerts
- [ ] Test email notifications (if applicable)
- [ ] Verify SSL certificate is active

---

## 🐛 Common Deployment Issues

### "Module not found" errors

**Cause:** Missing dependencies in production.

**Fix:**
```bash
# Ensure all deps are in dependencies, not devDependencies
npm install [package] --save
```

### Database connection timeout

**Cause:** Wrong connection string or firewall.

**Fix:**
1. Verify `DATABASE_URL` uses correct port (6543)
2. Check Supabase IP allowlist includes Vercel IPs
3. Or set allowlist to `0.0.0.0/0` (allow all)

### "Payload Secret is required"

**Cause:** `PAYLOAD_SECRET` not set in Vercel.

**Fix:**
1. Go to Vercel → Settings → Environment Variables
2. Add `PAYLOAD_SECRET=your-secret-here`
3. Redeploy

### AI endpoint returns 500

**Cause:** Missing `DEEPSEEK_API_KEY`.

**Fix:**
1. Verify env var is set in Vercel
2. Check API key is valid
3. Look at Vercel Function Logs for details

---

## 🎯 Production Checklist

### Pre-Launch

- [ ] Test on multiple devices (desktop, mobile, tablet)
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
- [ ] Load testing (can handle 100+ concurrent users)
- [ ] Security audit (run `npm audit`)
- [ ] Accessibility testing (Lighthouse score >90)
- [ ] SEO optimization (meta tags, sitemap, robots.txt)

### Launch Day

- [ ] Monitor error rates (Sentry)
- [ ] Watch server metrics (Vercel Analytics)
- [ ] Check database performance (Supabase logs)
- [ ] Have rollback plan ready

### Post-Launch

- [ ] Collect user feedback
- [ ] Monitor AI usage costs
- [ ] Optimize based on real traffic patterns
- [ ] A/B test key interactions

---

**Ready to launch?** 🚀

For support, check:
- [README.md](./README.md) - Main documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical details
- [Vercel Docs](https://vercel.com/docs)
