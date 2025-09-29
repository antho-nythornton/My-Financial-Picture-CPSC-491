import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isCI = !!process.env.GITHUB_ACTIONS || !!process.env.GITHUB_PAGES
const base = isCI ? '/My-Financial-Picture-CPSC-491/' : '/'

export default defineConfig({
  plugins: [react()],
  base,
})