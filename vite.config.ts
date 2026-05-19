import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }

          if (id.includes('react') || id.includes('scheduler')) {
            return 'react-vendor';
          }

          if (id.includes('framer-motion') || id.includes('gsap') || id.includes('lenis')) {
            return 'motion-vendor';
          }

          if (id.includes('shaders')) {
            return 'shader-vendor';
          }

          if (id.includes('three') || id.includes('@react-three')) {
            return 'three-vendor';
          }

          if (id.includes('zustand') || id.includes('use-sync-external-store')) {
            return 'state-vendor';
          }

          if (id.includes('lucide-react')) {
            return 'icons-vendor';
          }

          return 'vendor';
        },
      },
    },
  },
})
