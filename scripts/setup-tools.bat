@echo off
REM Friends with Giants - Tool Setup Script (Windows)
REM Run this once after npm install to set up all development tools

echo.
echo 🦖 Friends with Giants - Setting up development tools...
echo.

REM 1. Install shadcn/ui
echo 📦 Step 1/3: Installing shadcn/ui foundations...
call npx shadcn@latest init -y
call npx shadcn@latest add button card scroll-area -y
echo ✅ shadcn/ui installed
echo.

REM 2. Install agent-browser globally
echo 🌐 Step 2/3: Installing agent-browser CLI...
call npm install -g agent-browser
call agent-browser install
echo ✅ agent-browser installed
echo.

REM 3. Verify GSAP and 3D dependencies
echo 🎨 Step 3/3: Verifying animation dependencies...
call npm list gsap @gsap/react three @react-three/fiber @react-three/drei >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ All animation dependencies verified
) else (
    echo ⚠️  Installing missing animation dependencies...
    call npm install gsap @gsap/react three @types/three @react-three/fiber @react-three/drei
)
echo.

echo 🎉 All tools installed successfully!
echo.
echo Next steps:
echo   1. Set up your .env.local file (copy from .env.local.example)
echo   2. Run: npm run db:push
echo   3. Run: npm run dev
echo.
echo For more info, see SETUP.md
echo.
pause
