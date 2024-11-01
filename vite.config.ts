import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './github-portfolio/',
  plugins: [react()]
  build: {
    outDir: 'build',  // Specify the output directory as 'build' instead of the default 'dist'
  },
}]
