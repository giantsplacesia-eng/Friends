# 🌲 Project File Tree

Visual representation of the Friends with Giants project structure.

```
friends-with-giants/
│
├── 📄 Configuration Files
│   ├── package.json              # Dependencies & scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── next.config.ts            # Next.js + Payload integration
│   ├── tailwind.config.ts        # Styling configuration
│   ├── postcss.config.mjs        # PostCSS for Tailwind
│   ├── drizzle.config.ts         # Database ORM config
│   └── .gitignore                # Git ignore rules
│
├── 🔐 Environment
│   └── .env.local.example        # Environment template
│       └── .env.local            # (You create this)
│
├── 📚 Documentation
│   ├── README.md                 # Main documentation
│   ├── SETUP.md                  # Quick setup guide
│   ├── ARCHITECTURE.md           # Technical deep dive
│   ├── DEPLOYMENT.md             # Production deployment
│   ├── QUICKSTART.md             # Daily cheat sheet
│   ├── PROJECT_SUMMARY.md        # What was built
│   └── PROJECT_TREE.md           # This file
│
├── 🛠️ Scripts
│   └── verify-setup.js           # Setup verification
│
├── 📁 src/
│   │
│   ├── 🎭 app/                   # Next.js App Router
│   │   │
│   │   ├── (payload)/            # Payload CMS Routes
│   │   │   ├── layout.tsx        # Payload layout
│   │   │   └── admin/
│   │   │       └── [[...segments]]/
│   │   │           └── page.tsx  # Admin panel (dynamic routes)
│   │   │
│   │   ├── (site)/               # Frontend Routes
│   │   │   ├── layout.tsx        # Site layout (Lenis provider)
│   │   │   └── page.tsx          # Homepage (Giant + LeftNav)
│   │   │
│   │   ├── api/                  # API Routes
│   │   │   └── ai/
│   │   │       └── analyze/
│   │   │           └── route.ts  # DeepSeek AI endpoint
│   │   │
│   │   └── globals.css           # Global styles
│   │
│   ├── 📊 collections/           # Payload CMS Collections
│   │   ├── Services.ts           # What we offer
│   │   │   └── Fields:
│   │   │       ├── title, category, description
│   │   │       ├── priority (high/medium/low)
│   │   │       ├── vibrationIntensity (1-10)
│   │   │       ├── giantBehavior (select)
│   │   │       └── icon (Lucide icon name)
│   │   │
│   │   ├── CaseStudies.ts        # Portfolio work
│   │   │   └── Fields:
│   │   │       ├── title, client, industry
│   │   │       ├── summary, content
│   │   │       ├── services (relationship)
│   │   │       ├── results (array)
│   │   │       └── featured, coverImage
│   │   │
│   │   ├── Leads.ts              # CRM for prospects
│   │   │   └── Fields:
│   │   │       ├── email, name, company
│   │   │       ├── companyUrl (triggers AI)
│   │   │       ├── status (new/analyzed/etc)
│   │   │       ├── interestedIn (relationship)
│   │   │       └── aiAnalyzed (boolean)
│   │   │
│   │   └── Media.ts              # Asset library
│   │       └── Fields: upload + alt text
│   │
│   ├── 🎨 components/            # React Components
│   │   │
│   │   ├── canvas/               # Animation Components
│   │   │   └── GiantScrubber.tsx # PNG sequence scroll scrubber
│   │   │       └── Features:
│   │   │           ├── 60 placeholder gradient frames
│   │   │           ├── GSAP ScrollTrigger integration
│   │   │           ├── Pre-cached images
│   │   │           └── Ready for real PNG sequence
│   │   │
│   │   ├── nav/                  # Navigation
│   │   │   └── LeftController.tsx # Floating physics nav
│   │   │       └── Features:
│   │   │           ├── Independent float animations
│   │   │           ├── Dynamic sizing by priority
│   │   │           ├── Magnetic hover effect
│   │   │           └── Active state management
│   │   │
│   │   ├── ui/                   # UI Components
│   │   │   └── SmoothScrollProvider.tsx
│   │   │       └── Features:
│   │   │           ├── Lenis smooth scroll
│   │   │           ├── GSAP sync
│   │   │           └── Custom easing
│   │   │
│   │   └── ai/                   # AI Components (future)
│   │       └── (empty - ready for generative UI)
│   │
│   ├── 🗄️ db/                    # Drizzle Database Layer
│   │   ├── schema.ts             # Custom table schemas
│   │   │   └── Tables:
│   │   │       └── lead_analysis
│   │   │           ├── id, leadEmail, companyUrl
│   │   │           ├── analysis (jsonb)
│   │   │           ├── embedding (vector[1536])
│   │   │           └── timestamps
│   │   │
│   │   └── index.ts              # Drizzle client
│   │       └── Exports: db, schema
│   │
│   ├── 🛠️ lib/                   # Utility Libraries
│   │   ├── gsap-register.ts      # GSAP plugin registration
│   │   │   └── Exports: gsap, ScrollTrigger, Flip
│   │   │
│   │   ├── ai-agent.ts           # AI Configuration
│   │   │   └── Exports:
│   │   │       ├── deepseek (provider)
│   │   │       ├── leadAnalysisTools
│   │   │       └── giantSystemPrompt
│   │   │
│   │   └── utils.ts              # Helper functions
│   │       └── Functions:
│   │           ├── cn (classname merger)
│   │           ├── mapRange
│   │           ├── clamp
│   │           └── lerp
│   │
│   ├── ⚙️ Configuration
│   │   ├── payload.config.ts     # Payload CMS setup
│   │   │   └── Configuration:
│   │   │       ├── Collections import
│   │   │       ├── Postgres adapter
│   │   │       ├── Lexical editor
│   │   │       └── TypeScript generation
│   │   │
│   │   ├── importMap.ts          # Payload admin routing
│   │   └── payload-types.ts      # Generated types (auto)
│   │
│   └── 📝 Types
│       └── payload-types.ts      # Auto-generated by Payload
│
├── 📁 public/                    # Static Assets
│   └── giant-frames/             # (Future: PNG sequence frames)
│       └── frame-001.png         # Add your exported frames here
│       └── frame-002.png
│       └── ... (up to 60 frames)
│
├── 📁 media/                     # Payload CMS Uploads
│   └── (User uploaded files)
│
└── 📁 node_modules/              # Dependencies (npm install)
    ├── next/
    ├── payload/
    ├── drizzle-orm/
    ├── gsap/
    ├── lenis/
    ├── ai/
    └── ... (750+ packages)
```

---

## 🎯 Key File Purposes

### Configuration Layer
- `package.json` → Defines all dependencies and npm scripts
- `tsconfig.json` → TypeScript compiler settings & path aliases
- `next.config.ts` → Integrates Payload with Next.js
- `tailwind.config.ts` → Custom theme, animations, fonts
- `drizzle.config.ts` → Database connection & migration settings

### Content Layer (Payload CMS)
- `collections/*.ts` → Define data structures for CMS
- `payload.config.ts` → Central CMS configuration
- `app/(payload)/` → Admin panel routing (automatic)

### Frontend Layer
- `app/(site)/layout.tsx` → Wraps site in smooth scroll
- `app/(site)/page.tsx` → Main landing page with Giant + Nav
- `components/` → Reusable UI building blocks

### Data Layer
- `db/schema.ts` → Custom tables for AI features
- `db/index.ts` → Database client singleton
- Payload manages its own tables automatically

### AI Layer
- `lib/ai-agent.ts` → DeepSeek provider configuration
- `app/api/ai/analyze/` → Lead analysis endpoint
- `db/schema.ts` → Stores AI analysis results

---

## 🚦 Request Flow Examples

### Viewing the Homepage
```
User → localhost:3000
  ↓
app/(site)/page.tsx
  ↓
LeftController (loads Services from Payload)
  ↓
GiantScrubber (renders placeholder gradients)
  ↓
SmoothScrollProvider (enables Lenis)
  ↓
User sees: Floating nav + Scrolling Giant
```

### Analyzing a Lead
```
User submits form
  ↓
POST /api/ai/analyze
  ↓
app/api/ai/analyze/route.ts
  ↓
Check db/lead_analysis for cache
  ↓
[Cache miss] → Call DeepSeek API
  ↓
Store in lead_analysis table
  ↓
Return JSON to frontend
```

### Adding a Service (CMS)
```
Admin → localhost:3000/admin
  ↓
app/(payload)/admin/[[...segments]]/page.tsx
  ↓
Payload renders admin UI
  ↓
Admin creates new Service
  ↓
Stored in Payload's services table
  ↓
Frontend auto-updates on refresh
```

---

## 📦 Bundle Analysis

### Client Bundle (~500KB gzipped)
- Next.js Runtime: ~180KB
- React + React DOM: ~120KB
- GSAP: ~90KB
- Lenis: ~15KB
- Application Code: ~95KB

### Server Bundle
- Payload CMS: Server-only
- Drizzle ORM: Server-only
- AI SDK: Edge runtime

### Static Assets
- Placeholder gradients: Generated in-browser
- Future PNG sequence: ~5-10MB total (pre-cached)

---

## 🎨 Visual Component Tree

```
SmoothScrollProvider (wraps everything)
  │
  ├── GiantScrubber (fixed background)
  │   └── Canvas (renders PNG frames)
  │
  └── Grid Layout (2 columns)
      │
      ├── LeftController (sticky sidebar)
      │   └── Service Buttons (float independently)
      │       ├── Button 1 (GSAP animation)
      │       ├── Button 2 (GSAP animation)
      │       └── Button N (GSAP animation)
      │
      └── Main Content Stage (scrollable)
          ├── Hero Section (sticky)
          ├── Service Detail (dynamic)
          └── Scroll Spacers (for Giant animation)
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────┐
│                  USER BROWSER                   │
│  ┌──────────────────────────────────────────┐   │
│  │          React Components                │   │
│  │  LeftController ← Services Data          │   │
│  │  GiantScrubber  ← PNG Frames             │   │
│  └────────────┬─────────────────────────────┘   │
└───────────────┼─────────────────────────────────┘
                │
                ↓
┌─────────────────────────────────────────────────┐
│              NEXT.JS SERVER                     │
│  ┌──────────────────────────────────────────┐   │
│  │         API Routes                       │   │
│  │  /api/ai/analyze → DeepSeek              │   │
│  └────────────┬─────────────────────────────┘   │
│               │                                  │
│  ┌────────────┴─────────────┬──────────────┐    │
│  │                           │              │    │
│  │  Payload CMS              │  Drizzle ORM │    │
│  │  (Services, etc)          │  (AI Data)   │    │
│  └────────────┬──────────────┴──────────────┘    │
└───────────────┼─────────────────────────────────┘
                │
                ↓
┌─────────────────────────────────────────────────┐
│         SUPABASE (PostgreSQL)                   │
│                                                  │
│  Tables:                                        │
│  ├── payload_services                          │
│  ├── payload_case_studies                      │
│  ├── payload_leads                             │
│  ├── payload_users                             │
│  ├── payload_media                             │
│  └── lead_analysis (Drizzle custom)            │
└─────────────────────────────────────────────────┘
```

---

**Understanding the structure helps you build faster!** 🚀
