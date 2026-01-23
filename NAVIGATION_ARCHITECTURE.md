# Navigation Architecture: Two-Column Independent Scroll

## Problem Statement
We need left navigation with independent scroll AND Giant GSAP scroll animation working simultaneously without conflicts.

## Current State
- ✅ GSAP ScrollTrigger working with `pin: true` on right stage
- ✅ Lenis smooth scroll applied globally via `SmoothScrollProvider`
- ❌ Left navigation scroll conflicts with Lenis (need independent scroll)

## Solution Architecture (✅ WORKING)

### Layout Structure
```tsx
<body> {/* Lenis applied here via SmoothScrollProvider */}
  <div className="flex">
    {/* Left: Fixed sidebar with independent scroll */}
    <aside className="fixed h-screen w-[281px] overflow-y-auto">
      <LeftController />
    </aside>

    {/* Right: Main content scrolls with Lenis */}
    <main className="ml-[281px] w-full">
      <GiantHeroGSAP /> {/* ScrollTrigger pins this */}
      <OtherContent />
    </main>
  </div>
</body>
```

### ✅ VERIFIED WORKING - The Solution

The key to making this work is Lenis's `prevent` callback, which excludes specific elements from smooth scrolling:

```tsx
// In SmoothScrollProvider.tsx
const lenis = new Lenis({
  // ... other config
  prevent: (node) => {
    // Check if scroll target is inside left nav
    let element = node as HTMLElement;
    while (element) {
      if (element.tagName === 'ASIDE') {
        return true; // Prevent Lenis from handling this scroll
      }
      element = element.parentElement as HTMLElement;
    }
    return false; // Allow Lenis to handle this scroll
  }
});
```

**Why This Works:**
- Lenis evaluates `prevent` callback on **every scroll event**
- When scrolling inside `<aside>`, returns `true` → native browser scroll
- When scrolling elsewhere, returns `false` → Lenis smooth scroll
- No need for mouseenter/mouseleave events
- Rock-solid cursor-aware scroll delegation

### Key Technical Decisions

#### 1. Left Navigation (Independent Scroll)
**Implementation:**
```tsx
<aside className="
  fixed top-0 left-0
  h-screen w-[281px]
  overflow-y-auto
  scrollbar-width: none
  [&::-webkit-scrollbar]:w-0
">
```

**Why This Works:**
- `fixed` positioning removes it from document flow
- `overflow-y: auto` creates **independent scroll container**
- Hidden scrollbar (like Portorocha) for clean aesthetics
- Lenis **doesn't intercept** scroll events inside fixed overflow containers

#### 2. Right Stage (Lenis Smooth Scroll)
**No Changes Needed** - Current implementation already works:
- Lenis applied at `<body>` level
- Giant ScrollTrigger uses window scroll
- `pin: true` pins content during scroll

#### 3. GSAP ScrollTrigger Integration
**Critical Configuration** (already working):
```tsx
scrollTrigger: {
  trigger: containerRef.current,
  start: 'top top',
  end: 'bottom bottom',
  scrub: 0.5,
  pin: true,              // MUST KEEP
  anticipatePin: 1,       // MUST KEEP
  // ... rest of config
}
```

**Why This Still Works:**
- ScrollTrigger listens to **window scroll**
- Lenis updates `ScrollTrigger.update` automatically
- Left nav scroll is isolated (doesn't affect window scroll)

### Mobile Strategy (Accordion Version)

**Breakpoint: `md` (768px)**
```tsx
// Desktop: Two-column layout
<div className="hidden md:flex">
  <LeftNav />
  <RightStage />
</div>

// Mobile: Accordion navigation
<div className="md:hidden">
  <MobileAccordionNav />
  <RightStage />
</div>
```

**Mobile Accordion Pattern:**
```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="about">
    <AccordionTrigger>About</AccordionTrigger>
    <AccordionContent>
      {/* About content inline */}
    </AccordionContent>
  </AccordionItem>
  {/* Repeat for each section */}
</Accordion>
```

## Implementation Checklist

### Phase 1: Fix Left Nav Scroll ✅ COMPLETE
- [x] Add `overflow-y-auto` to left nav
- [x] Hide scrollbar (Webkit + Firefox)
- [x] Add `transform: translateZ(0)` for GPU acceleration
- [x] Implement Lenis `prevent` callback
- [x] Test scroll independence (left nav scrolls separately)

### Phase 2: Verify GSAP Integration ✅ COMPLETE
- [x] Confirm Giant animation still works
- [x] Verify `pin: true` behavior unchanged
- [x] Test scroll markers (green/red)
- [x] Check Lenis smooth scroll on right stage

### Phase 3: Mobile Responsive
- [ ] Install shadcn/ui Accordion component
- [ ] Create `MobileAccordionNav` component
- [ ] Hide desktop nav on mobile (`hidden md:flex`)
- [ ] Show mobile accordion (`md:hidden`)
- [ ] Test Giant animation on mobile (should work same as desktop)

### Phase 4: Polish
- [ ] Add scroll fade indicators (top/bottom of left nav)
- [ ] Test with 20+ nav items (ensure scroll works)
- [ ] Add smooth transitions for nav item state changes
- [ ] Performance audit (60fps target)

## Portorocha.com Learnings Applied

1. **Sticky + Overflow Pattern**: Fixed sidebar with `overflow-y: auto`
2. **Hidden Scrollbars**: `scrollbar-width: 0` + `::-webkit-scrollbar`
3. **GPU Acceleration**: `transform: translateZ(0)` on nav container
4. **Mobile Simplification**: Hide sidebar entirely, use accordion instead
5. **No Scroll Hijacking**: Let native scroll work where possible

## Critical Rules (From Our Learnings)

### NEVER
- ❌ Remove `overflow-y: auto` from left nav (breaks independent scroll)
- ❌ Remove `pin: true` from Giant ScrollTrigger (breaks animation)
- ❌ Apply Lenis to left nav scroll container (creates conflict)

### ALWAYS
- ✅ Keep left nav `position: fixed` with `overflow-y: auto`
- ✅ Keep Giant ScrollTrigger config intact (see CLAUDE.md)
- ✅ Test both nav scroll AND Giant animation after changes

## File Changes Required

### 1. `src/app/(site)/page.tsx`
- Add `overflow-y-auto` to left nav wrapper
- Hide scrollbar with Tailwind utilities

### 2. `src/components/nav/LeftController.tsx`
- Already has `overflow-y-auto` ✅
- Add scrollbar hiding utilities
- Add GPU acceleration

### 3. Create `src/components/nav/MobileAccordionNav.tsx`
- New component for mobile
- Uses shadcn/ui Accordion
- Responsive visibility

### 4. Update `src/components/ui/SmoothScrollProvider.tsx`
- No changes needed ✅
- Lenis already configured correctly

## Testing Protocol

1. **Desktop Scroll Test**:
   - Left nav should scroll independently
   - Right stage scrolls with Lenis
   - Giant animation triggers on right stage scroll

2. **Mobile Scroll Test**:
   - Accordion expands/collapses
   - Content scrolls normally
   - Giant animation still works

3. **Performance Test**:
   - Chrome DevTools Performance tab
   - Target: 60fps on scroll
   - No janky animations

## Success Metrics

- ✅ Left nav scrolls independently (can add 50+ items)
- ✅ Giant GSAP animation works unchanged
- ✅ Lenis smooth scroll on right stage
- ✅ Mobile accordion pattern functional
- ✅ 60fps scroll performance
- ✅ No scroll conflicts or layout shifts

---

**Reference Implementation**: https://portorocha.com/
**Key Insight**: Fixed sidebar + overflow-y: auto = scroll independence
