import { defineConfig } from 'vite'
import { visualizer } from "rollup-plugin-visualizer";
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
 visualizer()

  ],
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
  },
  define: {
    "process.env": {},
  },
})


