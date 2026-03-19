// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages project site base path
  base: '/AGRIPRICE.APP/',
  plugins: [react()],
  server: {
    port: 5177, // Ensure this matches your URL
    host: true
  }
})
