# .claude Directory

This directory contains AI agent instructions and workflows for the Friends with Giants project.

## Files

### `claude.md`
**The Engineering Rulebook** - Complete specifications for how AI agents should work on this project.

**Read this file if you are:**
- An AI agent working on this project
- A developer setting up agent-assisted development
- Someone trying to understand the project's architecture rules

**Key sections:**
1. **Core Technical Ecosystem** - Tech stack and tool configuration
2. **Browser Verification** - agent-browser testing workflow
3. **Left-Hand Architecture** - Locked UI layout rules
4. **Giant Logic** - Character animation requirements
5. **Performance Standards** - 60fps requirements, bundle size limits
6. **Development Commands** - npm scripts and CLI tools
7. **Code Quality Standards** - TypeScript, file organization
8. **AI Integration** - DeepSeek provider usage
9. **Payload CMS** - Collection usage and custom fields
10. **Deployment Checklist** - Production validation steps
11. **Debugging Guide** - Common issues and fixes
12. **Critical Rules** - Non-negotiable architecture requirements
13. **Self-Correction Protocol** - How agents fix their own work
14. **Success Metrics** - Target benchmarks
15. **Reference Documentation** - Links to all resources

## Agent Workflow

When an AI agent is asked to work on this project:

### 1. Read the Rulebook
```bash
cat .claude/claude.md
```

### 2. Build the Feature
Follow all specifications in claude.md, especially:
- Locked architecture rules (grid layout, Giant canvas z-index)
- Performance requirements (60fps, bundle size)
- Code quality standards (TypeScript, imports)

### 3. Validate with Browser Testing
```bash
npm run test:browser
# or: npx agent-browser snapshot -i
```

Checks:
- ✅ Giant canvas doesn't block clicks
- ✅ Navigation buttons are interactive
- ✅ Scroll events work correctly
- ✅ All animations are smooth

### 4. Audit Design Quality
```bash
npm run audit:design
# or: npx vercel design-guidelines
```

Checks:
- ✅ 2026 accessibility standards
- ✅ Animation performance (60fps)
- ✅ Smooth scroll best practices
- ✅ Mobile responsiveness

### 5. Self-Correct
If browser tests or design audit fail:
- Fix issues immediately
- Re-run validation
- Don't move to next feature until all checks pass

### 6. Document
If you discover new patterns or solutions:
- Update claude.md with new learnings
- Add to "Common Issues" section if it's a bug fix
- Update "Code Quality Standards" if it's a pattern

## Quick Commands

```bash
# Verify project setup
npm run verify

# Install development tools (shadcn, agent-browser)
npm run setup:tools

# Run browser validation
npm run test:browser

# Run design audit
npm run audit:design

# Start development
npm run dev

# Database operations
npm run db:push
npm run db:studio

# Generate Payload types
npm run payload:generate
```

## For Human Developers

If you're a human working on this project:

1. **Read claude.md** - It's not just for AI agents. It documents all architectural decisions and patterns.

2. **Use the validation tools** - The browser testing and design audit tools work for humans too:
   ```bash
   npm run test:browser
   npm run audit:design
   ```

3. **Follow the same rules** - The locked architecture and performance requirements apply to everyone.

4. **Update the rulebook** - If you discover better patterns, update claude.md so future work (human or AI) benefits.

## Locked Architecture Elements

These are **non-negotiable** and documented in claude.md:

### Layout
- Grid: `[400px sticky | 1fr scrolling]`
- Left nav must stay sticky
- Content stage must scroll

### Giant Canvas
- Must have `z-index: -10`
- Must have `pointer-events: none`
- Must use ScrollTrigger with scrub: 1.5

### Navigation Physics
- Each button has independent GSAP loop
- Size controlled by `priority` field
- Speed controlled by `vibrationIntensity` (1-10)

### Performance
- 60fps scroll (Lenis)
- 60fps animations (GSAP)
- Bundle size <500KB gzipped
- Lighthouse score >90

## Self-Healing Workflow

This project uses an **agent-driven, self-healing** development workflow:

```
User Request
    ↓
Agent reads claude.md
    ↓
Agent builds feature
    ↓
npx agent-browser snapshot -i ← Automated validation
    ↓
npx vercel design-guidelines ← Automated audit
    ↓
Issues found? → Agent fixes them → Re-validate
    ↓
All checks pass? → Feature complete
    ↓
Update claude.md with new patterns
```

This ensures:
- ✅ Consistent quality
- ✅ No regressions
- ✅ Performance maintained
- ✅ Architecture respected

## Resources

- **Main Docs:** `../README.md`
- **Setup Guide:** `../SETUP.md`
- **Architecture:** `../ARCHITECTURE.md`
- **Deployment:** `../DEPLOYMENT.md`
- **Quick Reference:** `../QUICKSTART.md`
- **Checklist:** `../CHECKLIST.md`

## Contributing

When making changes to this project:

1. Read claude.md first
2. Follow all locked architecture rules
3. Validate with browser tools
4. Run design audit
5. Fix any issues before committing
6. Update claude.md if you add new patterns

---

**This is a self-documenting, self-healing codebase.**

The more you use it, the smarter it gets. 🦖✨
