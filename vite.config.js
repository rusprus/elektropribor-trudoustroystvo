import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Relative base so the build works on GitHub Pages
// both as a user site and as a project site.
export default defineConfig({
  plugins: [vue()],
  base: './',
})
