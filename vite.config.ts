import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// base = nama repo, karena situs Pages berada di /<repo>/
export default defineConfig({
  base: '/keranjang-ci-demo/',
  plugins: [react()],
  test: {
    include: ['src/**/*.test.ts'],
  },
})
