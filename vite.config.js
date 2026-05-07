import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Single HTML file output configuration
    outDir: 'dist',
    assetsInlineLimit: 100000000, // Inline all assets (100MB limit)
    cssCodeSplit: false, // Don't split CSS
    rollupOptions: {
      output: {
        // Single JS bundle
        manualChunks: undefined,
        // Inline all assets
        inlineDynamicImports: true,
        // Single entry file
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    },
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    },
    // Target modern browsers
    target: 'es2015',
    // Optimize bundle size
    chunkSizeWarningLimit: 2000 // 2MB warning limit
  },
  server: {
    port: 3000,
    open: true
  },
  preview: {
    port: 4173,
    open: true
  }
});
