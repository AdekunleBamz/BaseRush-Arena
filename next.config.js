const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { webpack }) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    
    // Fix for porto/internal module not found error
    // Point to a stub module
    config.resolve.alias = {
      ...config.resolve.alias,
      'porto/internal': path.resolve(__dirname, 'src/lib/porto-stub.js'),
    };
    
    return config;
  },
}

module.exports = nextConfig
