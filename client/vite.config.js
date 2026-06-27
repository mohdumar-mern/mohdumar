import { defineConfig } from 'vite'
import { visualizer } from "rollup-plugin-visualizer"
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({ open: true })
  ],
  test: {                              // ← yeh add karo
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          'react-core': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          'redux': ['@reduxjs/toolkit', 'react-redux', 'redux-logger'],
          'animations': ['framer-motion'],
          'icons': ['lucide-react'],
          'http': ['axios'],
          'ui-utils': ['react-hot-toast', 'react-helmet-async'],
        }
      }
    }
  },
  define: {
    "process.env": {},
  },
})