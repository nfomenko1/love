import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' — относительные пути, чтобы сборку можно было открыть
// с любого хостинга / подпапки (например, GitHub Pages).
export default defineConfig({
  plugins: [react()],
  base: './',
})
