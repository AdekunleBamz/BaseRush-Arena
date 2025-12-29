const path = require('path');
const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    
    // Fix for React Native modules used by MetaMask SDK
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@react-native-async-storage/async-storage': false,
    };
    
    // Fix for porto and porto/internal module resolution
    // Replace these imports with stub module
    const stubPath = path.resolve(__dirname, 'src/lib/porto-stub.js');
    
    config.plugins.push(
      // Replace porto/internal imports with stub
      new webpack.NormalModuleReplacementPlugin(
        /^porto\/internal$/,
        (resource) => {
          resource.request = stubPath;
        }
      ),
      // Replace direct porto imports with stub
      new webpack.NormalModuleReplacementPlugin(
        /^porto$/,
        (resource) => {
          resource.request = stubPath;
        }
      )
    );
    
    return config;
  },
}

module.exports = nextConfig
