#!/bin/bash

# Friends with Giants - Tool Setup Script
# Run this once after npm install to set up all development tools

echo "🦖 Friends with Giants - Setting up development tools..."
echo ""

# 1. Install shadcn/ui
echo "📦 Step 1/3: Installing shadcn/ui foundations..."
npx shadcn@latest init -y
npx shadcn@latest add button card scroll-area -y
echo "✅ shadcn/ui installed"
echo ""

# 2. Install agent-browser globally
echo "🌐 Step 2/3: Installing agent-browser CLI..."
npm install -g agent-browser
agent-browser install
echo "✅ agent-browser installed"
echo ""

# 3. Verify GSAP and 3D dependencies (already in package.json)
echo "🎨 Step 3/3: Verifying animation dependencies..."
if npm list gsap @gsap/react three @react-three/fiber @react-three/drei > /dev/null 2>&1; then
    echo "✅ All animation dependencies verified"
else
    echo "⚠️  Installing missing animation dependencies..."
    npm install gsap @gsap/react three @types/three @react-three/fiber @react-three/drei
fi
echo ""

echo "🎉 All tools installed successfully!"
echo ""
echo "Next steps:"
echo "  1. Set up your .env.local file (copy from .env.local.example)"
echo "  2. Run: npm run db:push"
echo "  3. Run: npm run dev"
echo ""
echo "For more info, see SETUP.md"
