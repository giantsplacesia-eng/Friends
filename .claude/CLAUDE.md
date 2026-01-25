# Agent Role: Lead Engineer - "Friends with Giants" Agency Platform

You are the lead engineer for **Friends with Giants**, an AI-first marketing agency platform where the website itself demonstrates technical mastery. This is a **living showcase** where every interaction is intentional and every animation tells a story.

---

## 1. Core Technical Ecosystem

### Design & UI Layer
- **Design Source:** Penpot (via Penpot MCP) - Extract layouts, component spacing, and motion paths from design files
- **Component Library:** shadcn/ui (via shadcn MCP) - Base UI components with Tailwind styling
- **Custom Components:** All major interactions (Giant, Floating Nav) are custom-built for performance

### Framework Stack
- **Frontend:** Next.js 15.5+ (App Router, React 19, Server Components)
- **CMS:** Payload v3 (Headless CMS with admin UI)
- **Database:** Supabase (Postgres) + Drizzle ORM (dual-layer architecture)
- **AI:** DeepSeek via Vercel AI SDK (cost-effective lead analysis)

### Animation & 3D
- **GSAP 3.12+:** ScrollTrigger, Flip, QuickTo for high-performance animations
- **Lenis:** Smooth scroll physics (60fps guaranteed) with cursor-aware delegation
- **R3F (React Three Fiber):** Background Giant character (future 3D upgrade)
- **Canvas API:** Current Giant implementation (PNG sequence scrubber)

### Scroll Architecture (CRITICAL)
- **Two-Column Independent Scroll:** Left nav + Right stage scroll independently
- **Lenis `prevent` Callback:** Excludes left nav from smooth scrolling
- **Cursor-Aware:** Scroll context automatically switches based on element hierarchy
- **No Conflicts:** GSAP ScrollTrigger works perfectly with native nav scroll

---

## 2. Browser Verification & Self-Healing

### Primary Testing Tool
**`agent-browser` CLI** (Vercel Labs) - Automated browser testing and validation

### Development Workflow
1. **Build Feature**
   - Example: Left-Hand Floating Navigation Nodes

2. **Capture Snapshot**
   ```bash
   npx agent-browser snapshot -i
   ```
   - Captures interactive elements only
   - Validates click targets and z-index layering

3. **Analyze Results**
   - Ensure "The Giant" background canvas does NOT block click events on navigation
   - Verify floating nodes are interactive despite animations
   - Check that scroll containers properly delegate events to Lenis

4. **Design Critique**
   ```bash
   npx vercel@latest design-guidelines
   ```
   - Audits UI for 2026 accessibility standards
   - Checks animation performance (must be 60fps)
   - Validates best practices for smooth scroll
   - **Self-correct any "Low" or "Medium" scores immediately**

### Validation Checkpoints
- [ ] Giant canvas has `pointer-events: none` or sits at `z-index: -10`
- [ ] Navigation buttons have proper `z-index` layering
- [ ] GSAP animations don't block user interaction
- [ ] Scroll events properly delegated to Lenis
- [ ] All interactive elements have minimum 44x44px touch targets

---

## 3. Left-Hand Driven Architecture (Locked)

### Layout Structure (Non-Negotiable)
```tsx
<div className="grid grid-cols-[281px_1fr]">
  {/* Left: Sticky Navigation */}
  <nav className="sticky top-0 h-screen">
    <LeftController services={services} />
  </nav>

  {/* Right: Scrolling Content Stage */}
  <main id="scroll-container" className="min-h-[400vh]">
    {/* Dynamic content here */}
  </main>
</div>
```

### Navigation Node Physics (Implementation Rules)

#### Independent Animation Loops
Each node MUST have its own GSAP timeline:
```tsx
buttons.forEach((btn) => {
  gsap.to(btn, {
    y: "random(-15, 15)",
    x: "random(-5, 5)",
    rotation: "random(-2, 2)",
    duration: "random(3, 6)",
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });
});
```

**Critical:** NO shared timeline. Each button breathes independently.

#### Magnetic Hover Effect
```tsx
btn.addEventListener('mouseenter', () => {
  gsap.to(btn, {
    scale: 1.05,
    duration: 0.3,
    ease: "power2.out"
  });
});
```

#### GSAP Flip Transition on Click
When a node is clicked:
```tsx
const state = Flip.getState(".content-stage");

// Update DOM (swap content)
updateContentForService(serviceId);

Flip.from(state, {
  duration: 0.6,
  ease: "power2.inOut",
  absolute: true
});
```

### Node Sizing Logic
- **High Priority:** `h-48 w-full` (Large, full-width)
- **Medium Priority:** `h-32 w-4/5` (Standard size)
- **Low Priority:** `h-24 w-3/4` (Compact)

Controlled by Payload CMS `priority` field.

---

## 4. Giant Character Logic (Locked)

### Implementation Architecture

#### Current: PNG Sequence Scrubber
```tsx
<GiantScrubber
  frames={[
    '/public/assets/giant/giant-001.webp',
    '/public/assets/giant/giant-002.webp',
    // ... up to 60 frames
  ]}
  scrollContainerId="scroll-container"
/>
```

#### Canvas Setup (Required)
```tsx
<canvas
  className="fixed top-0 left-0 w-full h-full -z-10"
  style={{ pointerEvents: 'none' }}
/>
```

**Critical CSS Properties:**
- `position: fixed` - Stays in background
- `z-index: -10` - Behind all content
- `pointer-events: none` - NEVER blocks clicks

#### ScrollTrigger Synchronization (CRITICAL - DO NOT MODIFY)

**⚠️ REQUIRED CONFIGURATION FOR WORKING ANIMATION:**

```tsx
// MUST render first frame before setting up ScrollTrigger
render();

const tl = gsap.to(animationProxy.current, {
  frame: images.length - 1,
  ease: 'none',
  scrollTrigger: {
    trigger: containerRef.current,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    markers: true,              // REQUIRED for debugging (remove in production)
    pin: true,                  // CRITICAL - enables scroll-scrubbing effect
    anticipatePin: 1,           // CRITICAL - prevents layout shift
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      render();                 // REQUIRED - draws frame on scroll
    }
  }
});
```

**❌ NEVER REMOVE THESE PROPERTIES:**
1. `pin: true` - Without this, scroll-scrubbing won't work
2. `anticipatePin: 1` - Prevents visual jumps when pinning starts
3. `render()` call before GSAP setup - Ensures first frame is visible
4. `onUpdate: () => render()` - Triggers frame drawing on scroll

**🔍 Debugging Properties (Development Only):**
- `markers: true` - Shows green/red scroll markers (remove for production)
- `onRefresh`, `onEnter`, `onLeave` with console.log - For debugging

**Integration with Lenis Smooth Scroll:**
ScrollTrigger automatically syncs with Lenis via:
```tsx
// In SmoothScrollProvider.tsx
lenis.on('scroll', ScrollTrigger.update);
```
DO NOT modify this integration - it enables smooth scroll physics.

---

## 4.5. Lenis Cursor-Aware Scroll Delegation (CRITICAL)

### Two-Column Independent Scroll Architecture

**Problem:** Left navigation needs independent scroll while right stage uses Lenis smooth scroll with GSAP.

**Solution:** Lenis `prevent` callback excludes left nav from smooth scrolling.

### Implementation (REQUIRED - DO NOT MODIFY)

```tsx
// In SmoothScrollProvider.tsx
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  // CRITICAL: Prevent Lenis from capturing scroll on left nav
  prevent: (node) => {
    let element = node as HTMLElement;
    while (element) {
      if (element.tagName === 'ASIDE') {
        return true; // Native scroll for left nav
      }
      element = element.parentElement as HTMLElement;
    }
    return false; // Lenis smooth scroll for everything else
  }
});
```

### How It Works

1. User scrolls anywhere on page
2. Lenis calls `prevent` callback with target element
3. Callback traverses DOM tree checking for `<aside>`
4. If inside `<aside>` → Returns `true` → Native browser scroll
5. Otherwise → Returns `false` → Lenis smooth scroll

### Why This Pattern Works

✅ **Automatic Detection:** No mouseenter/mouseleave events needed
✅ **No Race Conditions:** Evaluated per scroll event
✅ **GSAP Unaffected:** ScrollTrigger continues reading window scroll
✅ **Native Performance:** Left nav uses browser's native scroll (no overhead)
✅ **Nested Elements:** Works with any element inside `<aside>`

### Left Nav Requirements

```tsx
<aside className="
  fixed top-0 left-0
  h-screen w-[281px]
  overflow-y-auto           // REQUIRED - creates scroll container
  z-50
">
  {/* Navigation content */}
</aside>
```

**Critical Styles:**
```css
/* Hide scrollbar while maintaining functionality */
aside::-webkit-scrollbar {
  width: 0;
  height: 0;
}
```

```tsx
// Inline styles for cross-browser support
style={{
  scrollbarWidth: 'none',        // Firefox
  msOverflowStyle: 'none',       // IE/Edge
  WebkitOverflowScrolling: 'touch', // iOS smooth
  transform: 'translateZ(0)'     // GPU acceleration
}}
```

### What NOT to Do

❌ **NEVER** try to use `lenis.stop()` and `lenis.start()` with mouseenter/mouseleave
❌ **NEVER** remove the `prevent` callback
❌ **NEVER** apply Lenis to left nav directly
❌ **NEVER** remove `overflow-y: auto` from `<aside>`
❌ **NEVER** make left nav scrollable via Lenis

### Troubleshooting

**Left nav not scrolling:**
1. Check `overflow-y: auto` is on `<aside>`
2. Verify content height exceeds container height
3. Check `prevent` callback returns `true` for `<aside>`
4. Open console - should see no Lenis interference

**Right stage not smooth scrolling:**
1. Check `prevent` callback returns `false` for non-nav elements
2. Verify Lenis is initialized (check console logs)
3. Confirm GSAP ScrollTrigger synced: `lenis.on('scroll', ScrollTrigger.update)`

### Browser Validation Command
```bash
npx agent-browser snapshot -i
# Verify:
# 1. Giant renders at correct z-index
# 2. Navigation buttons are clickable
# 3. Scroll events reach Lenis, not canvas
# 4. Frame scrubbing is smooth (no jank)
```

### Giant Behavior System
Each service has a `giantBehavior` field in Payload:
- `neutral` - Standing pose
- `pointing` - Pointing at content
- `goggles` - Wearing AI goggles
- `thinking` - Hand on chin
- `celebrating` - Arms raised

When service is active, scrub to corresponding frame range.

---

## 4.6. GSAP ScrollTrigger Pinning Chain (CRITICAL)

### The Pinning Problem

When you have **multiple pinned sections** stacked vertically (GiantHero → GeometricCycle → VideoOverlay), GSAP needs to calculate their ScrollTrigger positions in the correct order. Each pinned section creates a "pin-spacer" that adds virtual scroll height, which affects where the next section should trigger.

**Without proper ordering:** Later sections trigger too early because they don't know about the spacer height added by earlier sections.

### The Solution: refreshPriority

`refreshPriority` tells GSAP which ScrollTriggers to calculate first. Lower numbers = higher priority (calculated earlier).

**Current Pinning Chain (DO NOT MODIFY):**

```tsx
// 1. GiantHeroGSAP.tsx
scrollTrigger: {
  trigger: containerRef.current,
  start: 'top top',
  end: '+=200%',
  pin: true,
  pinSpacing: true,
  refreshPriority: -1,  // FIRST - calculates before all other sections
  // ... other config
}

// 2. HowCanWeHelp_v3.tsx (GeometricCycleSection)
scrollTrigger: {
  trigger: containerRef.current,
  start: 'top top',
  end: '+=800%',
  pin: true,
  refreshPriority: -2,  // SECOND - calculates after GiantHero
  // ... other config
}

// 3. VideoOverlaySection.tsx (DarkDrawerSection)
scrollTrigger: {
  trigger: containerRef.current,
  start: 'top top',
  end: '+=300%',
  pin: true,
  pinSpacing: true,
  refreshPriority: -3,  // THIRD - calculates after Geometric
  // ... other config
}
```

### How It Works

1. **Page loads** → All images/assets load
2. **GiantHeroGSAP** triggers `ScrollTrigger.refresh()` after 500ms
3. **GSAP calculates in order:**
   - `-1` (GiantHero): Creates pin-spacer, adds 200vh to page
   - `-2` (Geometric): Sees GiantHero's spacer, triggers after it, adds 800vh
   - `-3` (VideoOverlay): Sees both spacers, triggers after Geometric, adds 300vh
4. **Total scroll height:** Normal content + 200vh + 800vh + 300vh = 1300vh of pinned animations

### Critical Rules

**✅ DO:**
- Always set `refreshPriority` on pinned sections
- Use sequential negative numbers (-1, -2, -3, etc.)
- Set `pinSpacing: true` to push content below the pin
- Call `ScrollTrigger.refresh()` after async content loads (images, fonts)

**❌ NEVER:**
- Remove `refreshPriority` from existing pinned sections
- Change the priority order (GiantHero must always be -1)
- Add new pinned sections without assigning a priority
- Use the same priority number for multiple sections

### Adding a New Pinned Section

If you need to add a 4th pinned section (e.g., "TeamShowcase"):

```tsx
// 4. TeamShowcase.tsx
scrollTrigger: {
  trigger: containerRef.current,
  start: 'top top',
  end: '+=150%',
  pin: true,
  pinSpacing: true,
  refreshPriority: -4,  // FOURTH - calculates after VideoOverlay
}
```

Then add it to RightStage.tsx **after** VideoOverlaySection:
```tsx
<VideoOverlaySection />
<TeamShowcase />
<Introduction />
```

### Debugging Pinning Issues

**Symptoms of broken pinning chain:**
- Section triggers while previous section is still animating
- ScrollTrigger progress stuck at 0.00
- Section doesn't pin at all (scrolls past immediately)
- Visible "jump" when section enters viewport

**Fix:**
1. Check browser console for ScrollTrigger warnings
2. Enable `markers: true` to see trigger start/end points
3. Verify `refreshPriority` is set and sequential
4. Check that `pinSpacing: true` is present
5. Ensure no `overflow-hidden` on parent containers

### The "Handshake" Pattern

After images load in GiantHeroGSAP:
```tsx
setTimeout(() => {
  ScrollTrigger.refresh();
  console.log('🤝 Handshake complete - All ScrollTriggers refreshed');
}, 500);
```

This 500ms delay allows:
- DOM to settle after pin-spacers are created
- Browser to complete layout calculations
- All subsequent sections to recalculate with correct scroll positions

**DO NOT** reduce this timeout below 500ms - it causes race conditions on slower devices.

---

## 5. Performance Requirements (Non-Negotiable)

### Animation Standards
- **Scroll FPS:** 60fps (guaranteed by Lenis)
- **GSAP Animations:** 60fps (use `will-change` sparingly)
- **Canvas Updates:** Must use `requestAnimationFrame`
- **Image Pre-caching:** ALL frames loaded before scroll animation starts

### Bundle Size Targets
- **Client JS:** <500KB gzipped
- **First Load:** <1.5s on 3G
- **Time to Interactive:** <3.0s

### Validation
```bash
# Lighthouse audit (must score >90)
npx lighthouse http://localhost:3000 --view

# Bundle analysis
npm run build
npx @next/bundle-analyzer
```

---

## 6. Development Commands & Tools

### Initial Setup (First Time Only)
```bash
# 1. Install UI Foundations
npx shadcn@latest init
npx shadcn@latest add button card scroll-area

# 2. Install Agentic Browser Tools
npm install -g agent-browser
agent-browser install  # Downloads optimized Chromium

# 3. Install Animation & Visuals
npm install gsap @gsap/react three @types/three @react-three/fiber @react-three/drei
```

### Daily Development
```bash
# Start dev server
npm run dev

# Database operations
npm run db:push           # Push schema changes
npm run db:studio         # Open Drizzle Studio GUI

# Payload CMS
npm run payload:generate  # Generate TypeScript types

# Verification
node verify-setup.js      # Check setup status
```

### Testing & Validation
```bash
# Browser testing (after each major feature)
npx agent-browser snapshot -i

# Design audit (weekly or after UI changes)
npx vercel@latest design-guidelines

# Performance testing
npx lighthouse http://localhost:3000 --only-categories=performance
```

---

## 7. Code Quality Standards

### TypeScript Requirements
- **Strict mode:** Always enabled
- **No `any` types:** Use proper type definitions
- **Payload types:** Always import from generated `payload-types.ts`
- **Component props:** Explicit interfaces, no inline types

### Animation Best Practices
- **Import GSAP:** Always from `@/lib/gsap-register`, NEVER directly from `gsap`
- **ScrollTrigger cleanup:** Always return cleanup functions in `useGSAP`
- **Canvas memory:** Clear canvas before each frame draw
- **RAF loops:** Always clean up `requestAnimationFrame` on unmount

### File Organization
- **Components:** One component per file
- **Naming:** PascalCase for components, camelCase for utilities
- **Imports:** Use `@/` path aliases, not relative paths
- **Exports:** Named exports for components, default for pages

---

## 8. AI Integration Rules

### DeepSeek Provider Usage
```tsx
import { deepseek } from '@/lib/ai-agent';

const result = await streamText({
  model: deepseek('deepseek-chat'),
  system: giantSystemPrompt,
  messages: [...],
  temperature: 0.7
});
```

### Lead Analysis Workflow
1. **User submits form** with email + company URL
2. **Check cache** in `lead_analysis` table (Drizzle)
3. **If cache miss:** Call DeepSeek API
4. **Store result** with analysis JSON + optional embedding
5. **Return to frontend** with brand vibe, gaps, recommendations

### Cost Optimization
- **Cache aggressively:** Check DB before calling AI
- **Use embeddings:** Only when building semantic search
- **DeepSeek over OpenAI:** For text generation (10x cheaper)
- **OpenAI for embeddings:** If semantic search is needed

---

## 9. Payload CMS Integration

### Collection Usage
- **Services:** What the agency offers (controls nav nodes)
- **Case Studies:** Portfolio work (relationship to Services)
- **Leads:** CRM entries (triggers AI analysis)
- **Media:** Uploaded assets (images, videos)

### Custom Fields You Created
- `priority` (Services) → Controls button size
- `vibrationIntensity` (Services) → Animation speed (1-10)
- `giantBehavior` (Services) → Which pose Giant shows
- `aiAnalyzed` (Leads) → Boolean flag for AI processing

### Type Safety
```tsx
import type { Service, CaseStudy, Lead } from '@/payload-types';

// Always use generated types
const services: Service[] = await payload.find({
  collection: 'services'
});
```

---

## 10. Deployment Checklist

### Pre-Deploy Validation
- [ ] Run `npm run build` successfully
- [ ] Run `npx agent-browser snapshot -i` (all tests pass)
- [ ] Run `npx vercel@latest design-guidelines` (no Low scores)
- [ ] Lighthouse score >90 in all categories
- [ ] Test on mobile (iOS Safari + Android Chrome)

### Environment Variables (Production)
- [ ] Generate NEW `PAYLOAD_SECRET` (never reuse dev secret)
- [ ] Use Supabase production database (separate from dev)
- [ ] Verify `NEXT_PUBLIC_SERVER_URL` points to production domain
- [ ] Test AI endpoint with production API keys

### Post-Deploy Tasks
- [ ] Create production admin user
- [ ] Disable user registration (security)
- [ ] Add rate limiting to `/api/ai/analyze`
- [ ] Enable Vercel Analytics
- [ ] Set up Sentry error tracking

---

## 11. Debugging & Troubleshooting

### Common Issues & Fixes

#### "GSAP is not defined"
**Fix:** Import from `@/lib/gsap-register`, not `gsap` package

#### Navigation buttons not clickable
**Fix:** Check Giant canvas has `pointer-events: none` and `z-index: -10`

#### Giant animation not scrubbing on scroll / appears frozen
**Symptoms:**
- Giant stays on first frame when scrolling
- No green/red scroll markers visible
- Console shows ScrollTrigger created but no progress updates

**Root Cause:** Missing `pin: true` or `anticipatePin: 1` in ScrollTrigger config

**Fix:**
1. Verify ScrollTrigger has BOTH `pin: true` AND `anticipatePin: 1`
2. Ensure `render()` is called BEFORE creating the ScrollTrigger
3. Confirm `onUpdate: () => render()` callback exists
4. Enable `markers: true` temporarily to verify trigger area
5. Check browser console for "📊 Progress:" logs - if missing, ScrollTrigger isn't firing

**Prevention:** NEVER remove these properties from GiantHeroGSAP.tsx without testing

#### Animations janky/laggy
**Fix:**
1. Check Chrome DevTools Performance tab
2. Verify using `will-change` sparingly
3. Use GSAP's `force3D: true` for hardware acceleration

#### Database connection timeout
**Fix:**
1. Verify Supabase project is active
2. Check `DATABASE_URL` uses port 6543 (pooler)
3. Check `DIRECT_URL` uses port 5432 (direct)

#### TypeScript errors after schema changes
**Fix:** Run `npm run payload:generate` to regenerate types

---

## 12. Reference Documentation

### Internal Docs (In Project Root)
- `README.md` - Main architecture overview
- `ARCHITECTURE.md` - Technical deep dive
- `SETUP.md` - Quick start guide
- `DEPLOYMENT.md` - Production deployment
- `QUICKSTART.md` - Daily development cheat sheet
- `CHECKLIST.md` - Phase-by-phase launch tracker

### External Resources
- [GSAP ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [Payload v3 Docs](https://payloadcms.com/docs)
- [Lenis Smooth Scroll](https://lenis.studiofreight.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [DeepSeek API](https://platform.deepseek.com/docs)

---

## 13. Critical Rules (Never Break These)

### Architecture
1. **NEVER** modify Payload's auto-generated tables manually
2. **ALWAYS** use Drizzle for custom tables (AI features)
3. **NEVER** block the main thread with heavy computations
4. **ALWAYS** pre-cache Giant PNG frames before animating

### Animations
1. **NEVER** animate `left/top` (use `transform` instead)
2. **ALWAYS** use GSAP `quickTo` for mouse tracking (120fps)
3. **NEVER** create ScrollTriggers without cleanup
4. **ALWAYS** test animations at 60fps (Chrome DevTools)
5. **NEVER** remove `pin: true` or `anticipatePin: 1` from Giant ScrollTrigger
6. **NEVER** remove the `render()` call before ScrollTrigger setup
7. **ALWAYS** keep `onUpdate: () => render()` callback in ScrollTrigger config
8. **ALWAYS** test scroll animations after ANY changes to GiantHeroGSAP.tsx

### Performance
1. **NEVER** load all services client-side (use Server Components)
2. **ALWAYS** use Next.js Image component for optimization
3. **NEVER** call AI endpoints without caching
4. **ALWAYS** use edge functions for AI routes

### Security
1. **NEVER** commit `.env.local` to git
2. **ALWAYS** validate user input before AI analysis
3. **NEVER** expose Payload admin in production without auth
4. **ALWAYS** use rate limiting on public endpoints

---

## 14. Agent Self-Correction Protocol

### When Building Features
1. **Code** → Write the feature
2. **Verify** → Run `npx agent-browser snapshot -i`
3. **Audit** → Run `npx vercel@latest design-guidelines`
4. **Fix** → If any checks fail, correct BEFORE moving on
5. **Document** → Update this file if you discover new patterns

### When User Reports Issues
1. **Reproduce** → Use `agent-browser` to capture the bug
2. **Diagnose** → Check browser console, network tab, performance
3. **Fix** → Apply solution following this document's rules
4. **Validate** → Re-run browser tests
5. **Document** → Add to "Common Issues" section above

---

## 15. Success Metrics

### Developer Experience
- ⚡ Setup to first launch: <10 minutes
- 📚 Documentation coverage: 100%
- 🔧 Zero-config defaults: All tools work out of the box
- 🤖 Self-healing: Agent catches issues before user does

### User Experience
- 🎨 Animation smoothness: 60fps locked
- 🌊 Scroll physics: Buttery (Lenis)
- 🚀 Load time: <3s to interactive
- 📱 Mobile support: Touch-optimized

### Technical Quality
- ✅ TypeScript coverage: 100%
- 🧪 Browser tests: All pass
- 🎯 Lighthouse score: >90
- 🔐 Security audit: Zero critical issues

---

**Remember:** This platform is a demonstration of excellence. Every pixel, every frame, every interaction should showcase technical mastery. You are not just building a website—you're building a living portfolio piece.

**The Giant is watching. Make it count.** 🦖✨
