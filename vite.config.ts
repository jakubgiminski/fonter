import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/google-fonts-metadata': {
        target: 'https://fonts.google.com',
        changeOrigin: true,
        rewrite: () => '/metadata/fonts',
      },
    },
  },
  preview: {
    proxy: {
      '/api/google-fonts-metadata': {
        target: 'https://fonts.google.com',
        changeOrigin: true,
        rewrite: () => '/metadata/fonts',
      },
    },
  },
})
