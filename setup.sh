#!/bin/bash

echo "⚡ BaseRush Arena - Quick Setup Script"
echo "======================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed"
echo ""

# Generate images
echo "🎨 Generating Farcaster images..."
npm run generate-images

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate images"
    exit 1
fi

echo "✓ Images generated"
echo ""

# Check if images exist
echo "📁 Verifying files..."
files=(
    "public/images/icon.png"
    "public/images/splash.png"
    "public/images/og-image.png"
    "public/images/screenshot-1.png"
    "public/favicon.ico"
    "public/.well-known/farcaster.json"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ❌ $file (missing)"
    fi
done

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Next steps:"
echo "  1. Run 'npm run dev' to test locally"
echo "  2. Run 'vercel' to deploy to production"
echo "  3. Update public/.well-known/farcaster.json with your deployed URL"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
