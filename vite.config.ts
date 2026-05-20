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
          const normalizedId = id.replace(/\\/g, '/');

          if (!normalizedId.includes('/node_modules/')) {
            return;
          }

          if (normalizedId.includes('/node_modules/shaders/')) {
            return 'shader-vendor';
          }

          if (normalizedId.includes('/node_modules/three/') || normalizedId.includes('/node_modules/@react-three/')) {
            return 'three-vendor';
          }

          if (
            normalizedId.includes('/node_modules/framer-motion/') ||
            normalizedId.includes('/node_modules/motion-dom/') ||
            normalizedId.includes('/node_modules/motion-utils/') ||
            normalizedId.includes('/node_modules/gsap/') ||
            normalizedId.includes('/node_modules/lenis/')
          ) {
            return 'motion-vendor';
          }

          if (
            normalizedId.includes('/node_modules/react/') ||
            normalizedId.includes('/node_modules/react-dom/') ||
            normalizedId.includes('/node_modules/react-reconciler/') ||
            normalizedId.includes('/node_modules/scheduler/')
          ) {
            return 'react-vendor';
          }

          if (normalizedId.includes('/node_modules/zustand/') || normalizedId.includes('/node_modules/use-sync-external-store/')) {
            return 'state-vendor';
          }

          if (normalizedId.includes('/node_modules/lucide-react/')) {
            return 'icons-vendor';
          }

          return 'vendor';
        },
      },
    },
  },
})
