import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import qiankun from 'vite-plugin-qiankun';

const isQiankun = process.env.QIANKUN === 'true'; // Use an environment variable to differentiate modes

export default defineConfig({
  base: isQiankun ? './' : '/', // Set base path dynamically for qiankun compatibility
  plugins: [
    react({
      // Disable React Fast Refresh in production build
      jsxRuntime: process.env.NODE_ENV === 'development' ? 'automatic' : 'classic', // Use jsxRuntime instead of fastRefresh
    }),
    qiankun('app-name', { useDevMode: true }), // Plugin Qiankun, if used
  ],
  server: {
    history: {
      // This will ensure that all routes are served by index.html
      disableHtml5History: false,
    },
    port: 5174, // Set the development server to use port 5172
    cors: true, // Enable CORS to allow cross-origin requests
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for Qiankun cross-origin isolation
    },
    hmr: false, // Disable Hot Module Replacement (HMR) to prevent issues with Qiankun
  },
  build: {
    target: 'esnext', // Ensure compatibility with modern browsers for qiankun
    modulePreload: true,
    cssCodeSplit: true, // Enable CSS splitting for modular builds
    rollupOptions: {
      output: {
        format: 'system', // Use SystemJS for Qiankun integration
        entryFileNames: '[name].js', // Output JavaScript files with `.js` extensions
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
      external: isQiankun
        ? ['react', 'react-dom'] // Treat React and ReactDOM as external to avoid duplication in host and microfrontend
        : [],
    },
    outDir: 'dist', // Output directory for the build files
    sourcemap: true, // Generate source maps for debugging (optional)
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Alias for cleaner imports
    },
  },
  optimizeDeps: {
    exclude: isQiankun ? ['react', 'react-dom'] : [], // Exclude dependencies to prevent duplication in Qiankun
  },
});