import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isGhPages = !!process.env.GITHUB_PAGES
const base = isGhPages ? '/My-Financial-Picture-CPSC-491/' : '/'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './setupTests.js' 
  },
})
