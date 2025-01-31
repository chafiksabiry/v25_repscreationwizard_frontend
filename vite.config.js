import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    hmr: {
      overlay: true
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore certain warnings
        if (warning.code === 'CIRCULAR_DEPENDENCY') return
        warn(warning)
      }
    }
  }
})