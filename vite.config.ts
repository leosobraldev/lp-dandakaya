import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// Multi-page: "/" = landing, "/admin/" = painel restrito.
// Cada página é um entry HTML próprio, então a landing nunca carrega o JS do admin (supabase-js).
export default defineConfig({
  build: {
    target: 'es2019',
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        admin: fileURLToPath(new URL('./admin/index.html', import.meta.url)),
      },
    },
  },
})
