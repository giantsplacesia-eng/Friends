# 🦖 Friends with Giants

**An AI-First Marketing Agency Platform (2026)**

A living demonstration of technical mastery where the "Giant" character interacts with users via high-fidelity scroll animations, and the site uses "Agentic UI" to personalize content in real-time.

---

## 🎯 Project Vision

This isn't just a website—it's a canvas where AI meets marketing artistry. The Giant character responds to user interactions, scroll position, and even analyzes potential leads in real-time using DeepSeek AI.

### Key Features

- 🎨 **PNG Sequence Scrubbing** - Cinematic character animation driven by scroll position
- 🌊 **Physics-Based Navigation** - Floating buttons with independent breathing patterns
- 🤖 **Agentic CRM** - AI-powered lead analysis with vector search
- 🎬 **Smooth Scroll Physics** - Lenis integration for buttery-smooth scrolling
- 📊 **Payload v3 CMS** - Full-featured content management
- 🔮 **DeepSeek AI Integration** - Cost-effective AI analysis via Vercel AI SDK

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 15 (App Router) | React framework with server components |
| **CMS** | Payload v3 | Content management for Services, Case Studies, Leads |
| **Database** | Supabase (Postgres) | Dual-layer: Payload collections + Custom Drizzle tables |
| **ORM** | Drizzle ORM | Custom agentic features (vector search, lead analysis) |
| **Animation** | GSAP 3.12 + Lenis | Scroll-based animations + smooth scroll physics |
| **3D (Future)** | Three.js + R3F | For advanced Giant 3D model (currently using PNG sequence) |
| **AI** | DeepSeek via Vercel AI SDK | Lead analysis and recommendations |
| **Styling** | Tailwind CSS | Utility-first styling |

---

## 📁 Project Structure

```
/src
├── /app
│   ├── (payload)              # Payload CMS Admin Panel (/admin)
│   ├── (site)                 # Frontend Website
│   │   ├── layout.tsx         # Smooth scroll (Lenis) provider
│   │   └── page.tsx           # Main Agency Stage
│   └── /api/ai/analyze        # DeepSeek AI Agent Endpoint
├── /collections               # Payload CMS Collection Configs
│   ├── Services.ts            # Agency services with giantBehavior
│   ├── CaseStudies.ts         # Portfolio case studies
│   ├── Leads.ts               # CRM lead management
│   └── Media.ts               # Media library
├── /components
│   ├── /canvas                # 3D "Giant" and animation logic
│   │   └── GiantScrubber.tsx  # PNG sequence scroll scrubber
│   ├── /nav                   # Navigation components
│   │   └── LeftController.tsx # Floating physics-based nav
│   └── /ui                    # Reusable UI components
│       └── SmoothScrollProvider.tsx
├── /db                        # Drizzle Custom Schema & Client
│   ├── schema.ts              # Agentic CRM and Vector Search tables
│   └── index.ts               # Drizzle instance
├── /lib
│   ├── gsap-register.ts       # Global GSAP/ScrollTrigger init
│   ├── ai-agent.ts            # DeepSeek configuration
│   └── utils.ts               # Utility functions
└── drizzle.config.ts          # Drizzle Kit Configuration
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm/pnpm/yarn
- Supabase account (free tier works)
- DeepSeek API key (get from [platform.deepseek.com](https://platform.deepseek.com))

### 1. Environment Setup

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Fill in your credentials:

```env
# Database (from Supabase project settings)
DATABASE_URL=postgresql://postgres.[PROJECT]:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[PROJECT]:[PASSWORD]@[HOST]:5432/postgres

# Payload CMS (generate with: openssl rand -base64 32)
PAYLOAD_SECRET=your-super-secret-payload-key-here

# DeepSeek AI
DEEPSEEK_API_KEY=sk-your-deepseek-api-key-here

# Optional: OpenAI for embeddings
OPENAI_API_KEY=sk-your-openai-api-key-here

# App URL
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Initialize Database

Push the Drizzle schema to your Supabase database:

```bash
npm run db:push
```

This creates the custom `lead_analysis` table alongside Payload's tables.

### 4. Generate Payload Types

```bash
npm run payload:generate
```

This generates TypeScript types for your Payload collections.

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Payload Admin:** http://localhost:3000/admin

### 6. Create Admin User

On first visit to `/admin`, you'll be prompted to create an admin user.

---

## 🎨 Architecture Deep Dive

### Two-Layer Database Strategy

**Layer 1: Payload CMS (Managed)**
- Handles: Services, Case Studies, Leads, Media
- Schema managed by Payload
- Full admin UI

**Layer 2: Drizzle Custom Tables**
- Handles: AI Analysis, Vector Embeddings
- Schema in `src/db/schema.ts`
- Custom queries and AI features

### The Giant Animation System

The Giant character uses a **PNG sequence scrubber** technique:

1. **Placeholder Mode (Current):** Generates gradient frames for testing
2. **Production Mode:** Replace with real exported PNG sequence
3. **Scroll Sync:** GSAP ScrollTrigger scrubs through frames
4. **Performance:** Pre-cached images ensure 60fps

```tsx
<GiantScrubber
  frameCount={60}  // 60 frames = smooth animation
  scrollContainerId="scroll-container"
/>
```

### Floating Navigation Physics

Each service button floats independently based on its `vibrationIntensity`:

```tsx
{
  vibrationIntensity: 8,  // 1-10 scale
  priority: 'high',       // Controls button size
  giantBehavior: 'goggles' // How Giant reacts when active
}
```

---

## 🤖 AI Integration

### Lead Analysis Flow

1. User fills contact form with company URL
2. POST to `/api/ai/analyze` with email + URL
3. DeepSeek analyzes the website
4. Stores analysis in `lead_analysis` table
5. Returns brand vibe, gaps, recommendations

### Example API Call

```typescript
const response = await fetch('/api/ai/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'founder@startup.com',
    companyUrl: 'https://startup.com'
  })
});

const { analysis } = await response.json();
// {
//   brandVibe: "Modern, tech-forward SaaS aesthetic",
//   missingGaps: ["No clear CTA above fold", "Weak social proof"],
//   giantRecommendation: "Focus on conversion optimization and testimonials",
//   confidenceScore: 85
// }
```

---

## 📦 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

**Important:** Set `NEXT_PUBLIC_SERVER_URL` to your production domain.

### Database Migration

For production, run migrations instead of `db:push`:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

---

## 🎯 Next Steps

### Immediate

- [ ] Replace placeholder gradients with real Giant PNG sequence
- [ ] Add real case studies to Payload
- [ ] Implement vector search with OpenAI embeddings
- [ ] Add contact form that triggers AI analysis

### Advanced

- [ ] Upgrade to 3D Giant model with Three.js/R3F
- [ ] Eye-tracking based on mouse position (use `gsap.quickTo`)
- [ ] Dynamic Giant behavior changes per service
- [ ] Real-time personalization based on visitor behavior

---

## 🔧 Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run db:push       # Push Drizzle schema to database
npm run db:studio     # Open Drizzle Studio (database GUI)
npm run payload:generate  # Generate TypeScript types
```

---

## 🐛 Troubleshooting

### "Cannot find module '@/lib/gsap-register'"

Run `npm install` again. The `@/` path alias is defined in `tsconfig.json`.

### Database connection errors

Check that:
1. Supabase project is running
2. Connection strings use correct ports (6543 for pooled, 5432 for direct)
3. IP allowlist includes your location (or set to `0.0.0.0/0` for development)

### GSAP animations not working

Ensure you're importing from `@/lib/gsap-register`, not directly from `gsap`.

---

## 📚 Key Concepts

### Agentic UI

The UI adapts to user behavior and context:
- Giant changes behavior based on active service
- AI analyzes leads in real-time
- Content personalizes based on visitor data (future)

### Scroll Scrubbing

Instead of video, we use sequential images for precise control:
- Better performance than video
- Frame-perfect scrubbing
- Easy to integrate with GSAP

### Physics-Based Floating

Each button has its own animation loop:
- No global floating effect
- Each element moves independently
- Creates organic, biological feeling

---

## 📄 License

Proprietary - Friends with Giants Agency (2026)

---

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org)
- [Payload CMS](https://payloadcms.com)
- [GSAP](https://greensock.com/gsap)
- [Drizzle ORM](https://orm.drizzle.team)
- [DeepSeek AI](https://platform.deepseek.com)
- [Lenis](https://lenis.studiofreight.com)

---

**Ready to befriend a Giant?** 🦖✨
