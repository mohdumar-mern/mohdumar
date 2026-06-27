// import { defineConfig } from 'vite'
// import { visualizer } from "rollup-plugin-visualizer";
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'


// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(),
//     tailwindcss(),
//  visualizer()

//   ],
//   build: {
//     outDir: "dist",
//     sourcemap: false,
//     minify: "esbuild",
//   },
//   define: {
//     "process.env": {},
//   },
// })

import { defineConfig } from 'vite'
import { visualizer } from "rollup-plugin-visualizer"
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({ open: true }) // build ke baad browser mein khulega
  ],
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

