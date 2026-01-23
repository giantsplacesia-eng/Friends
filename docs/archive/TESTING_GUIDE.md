# 🧪 Testing Guide - Hero Section Implementation

## 🚀 Server Status
**URL:** http://localhost:3000
**Status:** ✅ Running

---

## 📋 What to Test

### 1. Initial Load (Hero Section)

**Expected Behavior:**
- Loading screen appears with "Loading Giant... X%" message
- 88 frames load from `public/giant-frames/` directory
- After loading completes, you should see:
  - **Left Rail**: Sage green background (#6A7C75) with FWG logo at top
  - **Giant Canvas**: Background animation layer (z-index: 0)
  - **Hero Text**: "FRIENDS WITH GIANTS" in orange (#ED8F0D) on top (z-index: 20)
  - **Subtitle**: "Industrial-grade creators building the future of agency work"

**What to Check:**
- [ ] All frames load without errors (check browser console)
- [ ] Hero text is clearly visible and readable
- [ ] Hero text appears ABOVE the Giant character
- [ ] Colors match design system (orange text, sage left rail)
- [ ] Typography is italic, uppercase, and bold

### 2. Scroll Behavior

**Expected Behavior:**
- Start scrolling in the **right stage** (main content area)
- Giant should scrub through 88 frames as you scroll
- Hero text should remain pinned with the Giant
- After ~3x viewport height (300vh), the pin releases
- Introduction section becomes visible

**What to Check:**
- [ ] Scrolling is smooth (no jank or stuttering)
- [ ] Giant frames scrub in sequence (no frame skipping)
- [ ] Hero text stays aligned during scroll
- [ ] Animation maintains 60fps (check browser DevTools Performance)
- [ ] Pin releases after reaching last frame
- [ ] Introduction section appears smoothly

### 3. Layering & Interaction

**Expected Behavior:**
- Giant canvas should NOT block interactions
- Left rail buttons should remain clickable at all times
- Hero text should be selectable/interactive

**What to Check:**
- [ ] Can click left rail navigation buttons during Giant animation
- [ ] Canvas has `pointer-events: none` (inspect element)
- [ ] Hero text is selectable with cursor
- [ ] No z-index conflicts (Giant behind, text on top)

### 4. Navigation Switching

**Expected Behavior:**
- Click "About" or "Services" in left rail
- Right stage content should switch
- Click "Home" to return to Giant animation

**What to Check:**
- [ ] Section switching works without page refresh
- [ ] Active button shows red background (#CF2402)
- [ ] Inactive buttons show charcoal background (#2C302F)
- [ ] Returning to "Home" reloads Giant animation
- [ ] No errors in console during section switches

### 5. Responsive Behavior

**Expected Behavior:**
- Resize browser window
- Hero text should scale responsively (80px - 140px)
- Layout should remain functional

**What to Check:**
- [ ] Hero text scales with viewport (uses clamp)
- [ ] Layout doesn't break at different widths
- [ ] Canvas resizes correctly
- [ ] Left rail stays at 281px width

---

## 🐛 Common Issues & Solutions

### Issue: Giant Frames Don't Load
**Symptoms:** Stuck on loading screen or error message
**Check:**
- Browser console for 404 errors
- Verify files exist in `public/giant-frames/` (should be 88 files: `Sequence 01_100.webp` to `Sequence 01_187.webp`)
- Check network tab for failed requests

### Issue: Hero Text Not Visible
**Symptoms:** Only see Giant, no text overlay
**Check:**
- z-index values (hero should be z-20, canvas z-0)
- Color contrast (orange #ED8F0D on background)
- Check if HeroSection component is rendering (React DevTools)

### Issue: Scroll Doesn't Scrub Frames
**Symptoms:** Giant stays on one frame
**Check:**
- Browser console for ScrollTrigger errors
- Verify `#right-stage-scroll` element exists
- Check if GSAP plugins are registered
- Ensure scrolling in the RIGHT stage, not whole window

### Issue: Left Rail Buttons Not Clickable
**Symptoms:** Can't click navigation buttons
**Check:**
- Canvas `pointer-events: none` style
- z-index of left rail (should be z-50)
- Any overlapping elements blocking clicks

### Issue: Performance Issues
**Symptoms:** Lag, stuttering, low FPS
**Check:**
- Total frame file size (88 × ~100KB = ~8.8MB)
- Browser performance tab during scroll
- Hardware acceleration enabled
- Too many browser tabs open

---

## 🔍 Browser Console Checks

### Expected Console Messages:
```
GiantHero: Creating ScrollTrigger {
  trigger: <div>,
  scroller: <main#right-stage-scroll>,
  images: 88
}
```

### No Errors Should Appear:
- ❌ `Failed to load Giant frame: /giant-frames/...`
- ❌ `Scroller element #right-stage-scroll not found`
- ❌ `Error creating scroll trigger`

---

## 📊 Visual Reference Comparison

**Reference Image:** `public/home-page-reference/Artboard 1.png`

**Compare:**
1. **Typography**
   - Size: Should be similar to reference (120-140px range)
   - Style: Italic, uppercase, bold
   - Color: Orange (#ED8F0D)
   - Position: Left-aligned with padding

2. **Giant Character**
   - Should appear in right portion of screen
   - Proper scale and positioning
   - Centered within viewport

3. **Left Rail**
   - Width: 281px (fixed)
   - Background: Sage green (#6A7C75)
   - Logo at top
   - Buttons properly spaced

---

## 🎯 Success Criteria

### ✅ Implementation is successful if:
1. Giant animation loads and scrubs smoothly
2. Hero text is clearly visible on top of Giant
3. Scroll behavior feels weighted (not too fast/slow)
4. No blocking of interactions
5. Pin releases after animation completes
6. Navigation works correctly
7. Design matches reference image
8. No errors in console
9. Performance stays above 30fps (ideally 60fps)

---

## 🛠️ Quick Fixes

### If Giant appears too fast/slow:
Edit `src/components/canvas/GiantHero.tsx` line ~124:
```tsx
scrub: 1.5, // Increase for slower, decrease for faster
```

### If scroll distance feels wrong:
Edit `src/components/canvas/GiantHero.tsx` line ~123:
```tsx
end: "+=300%", // Increase for longer scroll
```

### If hero text is too large/small:
Edit `src/components/sections/HeroSection.tsx` line ~21:
```tsx
fontSize: 'clamp(80px, 12vw, 140px)', // Adjust min/max values
```

### If colors don't match:
Check `tailwind.config.ts` color definitions:
```tsx
giant: {
  sage: '#6A7C75',    // Left rail
  charcoal: '#2C302F', // Text/buttons
  orange: '#ED8F0D',   // Hero text
  red: '#CF2402',      // Active button
  white: '#F4F4F4',    // Background
}
```

---

## 📞 What to Report

If you encounter issues, please note:
1. **Specific behavior** (what's happening vs. what should happen)
2. **Browser & version** (Chrome, Firefox, Safari, etc.)
3. **Console errors** (screenshot or copy exact message)
4. **Network tab** (any failed resource loads)
5. **Screen recording** (if animation behavior is wrong)

---

**Ready to test!** Open http://localhost:3000 and follow the checklist above. 🚀
