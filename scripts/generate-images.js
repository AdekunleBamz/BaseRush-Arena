const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');

// Ensure images directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Generate Icon (512x512)
function generateIcon() {
  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext('2d');
  
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 512, 512);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);
  
  // Lightning bolt emoji
  ctx.font = 'bold 280px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('⚡', 256, 256);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(imagesDir, 'icon.png'), buffer);
  console.log('✓ Generated icon.png');
}

// Generate Splash Screen (1080x1920)
function generateSplash() {
  const canvas = createCanvas(1080, 1920);
  const ctx = canvas.getContext('2d');
  
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1920);
  
  // Logo
  ctx.font = 'bold 200px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('⚡', 540, 800);
  
  // Title
  ctx.font = 'bold 100px Arial';
  ctx.fillText('BaseRush', 540, 1000);
  ctx.font = 'bold 80px Arial';
  ctx.fillText('Arena', 540, 1100);
  
  // Tagline
  ctx.font = '40px Arial';
  ctx.globalAlpha = 0.8;
  ctx.fillText('Compete • Stake • Earn', 540, 1200);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(imagesDir, 'splash.png'), buffer);
  console.log('✓ Generated splash.png');
}

// Generate OG Image (1200x630)
function generateOGImage() {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');
  
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);
  
  // Logo
  ctx.font = 'bold 150px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('⚡', 600, 250);
  
  // Title
  ctx.font = 'bold 80px Arial';
  ctx.fillText('BaseRush Arena', 600, 400);
  
  // Subtitle
  ctx.font = '40px Arial';
  ctx.globalAlpha = 0.9;
  ctx.fillText('Compete, Stake & Earn on Base', 600, 500);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(imagesDir, 'og-image.png'), buffer);
  console.log('✓ Generated og-image.png');
}

// Generate Screenshot (750x1334)
function generateScreenshot() {
  const canvas = createCanvas(750, 1334);
  const ctx = canvas.getContext('2d');
  
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 750, 1334);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 750, 1334);
  
  // Mock UI
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(50, 100, 650, 200);
  ctx.fillRect(50, 350, 650, 400);
  ctx.fillRect(50, 800, 650, 300);
  
  // Text
  ctx.font = 'bold 60px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('Game Interface', 375, 200);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(imagesDir, 'screenshot-1.png'), buffer);
  console.log('✓ Generated screenshot-1.png');
}

// Generate Favicon (32x32)
function generateFavicon() {
  const canvas = createCanvas(32, 32);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#667eea';
  ctx.fillRect(0, 0, 32, 32);
  
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('⚡', 16, 16);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), buffer);
  console.log('✓ Generated favicon.ico');
}

// Generate all images
console.log('🎨 Generating images for Farcaster mini app...\n');
generateIcon();
generateSplash();
generateOGImage();
generateScreenshot();
generateFavicon();
console.log('\n✅ All images generated successfully!');
