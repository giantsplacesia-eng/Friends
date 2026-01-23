# 🏛️ Architecture Documentation

Deep dive into the technical architecture of Friends with Giants.

---

## 🎯 Design Philosophy

### "The Site IS the Product"

This isn't a brochure site—it's a living demonstration of what we can build. Every interaction is intentional:

1. **Scroll Physics** → Shows mastery of animation
2. **AI Analysis** → Demonstrates agentic capabilities
3. **Floating Nav** → Proves attention to micro-interactions
4. **Giant Character** → Creates memorable brand experience

### Performance First

- **Pre-cached Images:** All PNG frames loaded before scroll animation
- **GSAP QuickTo:** 120fps eye-tracking without layout thrashing
- **Edge Functions:** AI analysis runs on the edge for <100ms response
- **Lenis Smooth Scroll:** Native scroll delegation for 60fps physics

### Giant-to-Content Handoff Protocol:

Phase A (The Scrubber): Use GSAP ScrollTrigger to pin the Giant container. Map scrollY progress to the 87 WebP frames.

Phase B (The Release): Set the end trigger of the pinning mechanism so that at frame 87, the container unpins.

Navigation Intercept: If a navigation link is clicked while in Phase A, the agent must:

Finish/Skip the Giant animation (jump to frame 87).

Unpin the container.

Smooth-scroll (Lenis) to the target section stage.

Cleanup: On route changes to sub-pages (Services), the Giant component must unmount to optimize performance.

---

## 🗄️ Database Architecture

### Dual-Layer Strategy

We use **two ORMs simultaneously** for different purposes:

```
┌─────────────────────────────────────┐
│         APPLICATION LAYER           │
├─────────────────┬───────────────────┤
│  Payload CMS    │  Drizzle ORM      │
│  (Managed)      │  (Custom)         │
├─────────────────┼───────────────────┤
│  - Services     │  - Lead Analysis  │
│  - Case Studies │  - Vector Search  │
│  - Leads        │  - AI Metadata    │
│  - Media        │                   │
├─────────────────┴───────────────────┤
│       PostgreSQL (Supabase)         │
└─────────────────────────────────────┘
```

**Why Two ORMs?**

1. **Payload:** Best-in-class admin UI for content editors
2. **Drizzle:** Full SQL control for AI features (vectors, complex joins)
3. **Separation of Concerns:** Content vs. Application Logic

### Migration Coordination

Payload and Drizzle manage different tables:

```sql
-- Payload tables (auto-managed)
payload_services
payload_case_studies
payload_leads
payload_users
payload_media

-- Drizzle tables (manual schema)
lead_analysis  -- Custom AI features
```

**Important:** Never manually edit Payload tables. Use Drizzle only for custom tables.

### Vector Search Setup (Future)

The `lead_analysis` table includes a `vector` column for semantic search:

```typescript
embedding: vector('embedding', { dimensions: 1536 })
```

To enable:

1. Install `pgvector` extension in Supabase
2. Generate embeddings with OpenAI's `text-embedding-3-small`
3. Use cosine similarity for matching leads to case studies

```sql
-- Example: Find similar case studies
SELECT * FROM lead_analysis
ORDER BY embedding <-> '[0.1, 0.2, ...]'::vector
LIMIT 5;
```

---

## 🎨 Animation System

### GSAP Architecture

We use a **plugin-based registration system**:

```typescript
// lib/gsap-register.ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

**Critical:** Always import from `@/lib/gsap-register`, not `gsap` directly.

### Scroll Timeline

The Giant animation is driven by a single ScrollTrigger:

```
┌─────────────────────────────────────┐
│  Scroll Position: 0% (Top)          │
│  Giant Frame: 0                     │
│  Behavior: Neutral stance           │
├─────────────────────────────────────┤
│  Scroll Position: 25%               │
│  Giant Frame: 15                    │
│  Behavior: Looking at nav           │
├─────────────────────────────────────┤
│  Scroll Position: 50%               │
│  Giant Frame: 30                    │
│  Behavior: Pointing at content      │
├─────────────────────────────────────┤
│  Scroll Position: 100% (Bottom)     │
│  Giant Frame: 59 (last frame)       │
│  Behavior: Celebrating              │
└─────────────────────────────────────┘
```

### Floating Navigation Physics

Each button has **independent animation timelines**:

```typescript
buttons.forEach((btn) => {
  gsap.to(btn, {
    y: "random(-15, 15)",  // Unique random values
    duration: "random(3, 6)",
    repeat: -1,
    yoyo: true,
  });
});
```

**Key Insight:** No shared timeline. Each element breathes independently.

### Performance Optimization

1. **Pre-cache Strategy:**
   ```typescript
   const images = frames.map(src => {
     const img = new Image();
     img.src = src;
     return img;
   });
   ```

2. **Canvas-based Rendering:**
   - Avoids DOM manipulation
   - Direct pixel control
   - Hardware-accelerated

3. **GSAP's `snap` Property:**
   ```typescript
   snap: 'frame'  // Ensures integer frame numbers
   ```

---

## 🤖 AI Integration

### DeepSeek Provider Setup

DeepSeek uses OpenAI-compatible API, making integration trivial:

```typescript
import { createOpenAI } from '@ai-sdk/openai';

export const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
});
```

### Analysis Flow

```
User submits form
       ↓
POST /api/ai/analyze
       ↓
Check cache (Drizzle query)
       ↓
[Cache miss] → Call DeepSeek
       ↓
Parse JSON response
       ↓
Store in lead_analysis table
       ↓
Return to frontend
```

### System Prompt Engineering

The Giant has a consistent personality:

```typescript
export const giantSystemPrompt = `You are the "Giant"...
- Technical but approachable
- Uses data-driven insights
- Never overpromises
`;
```

**Pro Tip:** Store prompts in version control, not in the database. This allows A/B testing via feature flags.

---

## 🎬 Smooth Scroll Integration

### Lenis + GSAP Sync

Lenis provides physics-based scrolling, GSAP tracks the scroll position:

```typescript
// In SmoothScrollProvider
lenis.on('scroll', ScrollTrigger.update);
```

This ensures GSAP animations stay in sync with Lenis's scroll position.

### Custom Easing

```typescript
easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
```

This creates a **"soft stop"** feel—scroll decelerates gracefully instead of stopping abruptly.

---

## 📊 Content Management

### Payload Collection Strategy

Each collection has a specific purpose:

| Collection | Purpose | Public Access |
|------------|---------|---------------|
| Services | What we offer | ✅ Yes |
| Case Studies | Portfolio | ✅ Yes |
| Leads | CRM | ❌ Admin only |
| Media | Asset library | ✅ Yes |
| Users | Admin accounts | ❌ Admin only |

### Custom Fields

**Services.giantBehavior:**
```typescript
{
  name: 'giantBehavior',
  type: 'select',
  options: [
    'neutral', 'pointing', 'goggles', 'thinking', 'celebrating'
  ]
}
```

This field controls what animation state the Giant uses when this service is active.

### Admin UI Customization

Payload allows custom admin components. Future enhancement:

```typescript
// Custom field component
import { useField } from 'payload/components/forms';

export const ColorPicker = () => {
  const { value, setValue } = useField({ path: 'brandColor' });
  // Custom UI here
};
```

---

## 🚀 Deployment Strategy

### Environment-Specific Config

```typescript
const isProduction = process.env.NODE_ENV === 'production';

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  // Use different settings per environment
});
```

### Build Optimization

Next.js 15 automatically:
- Tree-shakes unused Payload collections
- Code-splits by route
- Optimizes images on-demand

**Production checklist:**
- [ ] Set `PAYLOAD_SECRET` to strong random value
- [ ] Restrict Payload access (IP whitelist or auth)
- [ ] Enable Supabase connection pooling
- [ ] Add rate limiting to AI endpoint
- [ ] Enable Next.js telemetry

---

## 🔐 Security Considerations

### Environment Variables

**Never commit:**
- `PAYLOAD_SECRET`
- `DEEPSEEK_API_KEY`
- `DATABASE_URL`

**Safe to commit:**
- `NEXT_PUBLIC_*` variables (exposed to browser)

### Admin Access

Default Payload config allows anyone to create the first user. **Production fix:**

```typescript
access: {
  create: () => false, // Disable user creation
  read: ({ req }) => !!req.user,
}
```

### AI Rate Limiting

Add rate limiting to prevent abuse:

```typescript
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  limiter: Ratelimit.slidingWindow(10, '1 h'),
});

// In API route
const { success } = await ratelimit.limit(email);
if (!success) return new Response('Rate limited', { status: 429 });
```

---

## 📈 Monitoring & Analytics

### Recommended Tools

1. **Vercel Analytics** - Page views, performance
2. **Sentry** - Error tracking
3. **PostHog** - User behavior, A/B testing
4. **Drizzle Studio** - Database inspection

### Custom Events

Track key interactions:

```typescript
// When user submits lead form
analytics.track('Lead Submitted', {
  service: activeService,
  scrollDepth: window.scrollY,
  timeOnPage: Date.now() - pageLoadTime,
});
```

---

## 🔮 Future Enhancements

### Phase 2: 3D Giant

Replace PNG sequence with GLTF model:

```typescript
import { useGLTF } from '@react-three/drei';

function GiantModel() {
  const { scene } = useGLTF('/models/giant.gltf');
  return <primitive object={scene} />;
}
```

**Pros:**
- Smaller file size
- Real-time lighting
- Interactive bones/joints

**Cons:**
- Requires WebGL
- More CPU/GPU intensive

### Phase 3: Eye Tracking

Track mouse position and update Giant's eyes:

```typescript
const quickToX = gsap.quickTo(eyeRef.current, 'x', { duration: 0.5 });
const quickToY = gsap.quickTo(eyeRef.current, 'y', { duration: 0.5 });

window.addEventListener('mousemove', (e) => {
  const x = mapRange(e.clientX, 0, window.innerWidth, -10, 10);
  const y = mapRange(e.clientY, 0, window.innerHeight, -10, 10);
  quickToX(x);
  quickToY(y);
});
```

**Result:** 120fps eye tracking with zero layout thrashing.

### Phase 4: Personalization

Store visitor behavior in Drizzle:

```sql
CREATE TABLE visitor_sessions (
  id UUID PRIMARY KEY,
  fingerprint TEXT,
  services_viewed TEXT[],
  scroll_depth INTEGER,
  time_on_page INTEGER,
  returning_visitor BOOLEAN
);
```

Use this data to:
- Adjust Giant's greeting for returning visitors
- Highlight services they showed interest in
- Pre-populate lead forms

---

## 📚 Reference Links

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Payload v3 Docs](https://payloadcms.com/docs)
- [GSAP ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [Drizzle ORM](https://orm.drizzle.team)
- [DeepSeek API](https://platform.deepseek.com/docs)
- [Lenis Smooth Scroll](https://lenis.studiofreight.com)

---

**Questions?** Open an issue or check the [main README](./README.md).
