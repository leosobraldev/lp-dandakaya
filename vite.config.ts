import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

// Valores públicos usados no HTML (%VITE_*%). Sem eles o Vite deixa o placeholder
// dentro dos links e o build quebra ("URI malformed"), então todo campo tem padrão.
// O .env (local) e as variáveis do host (Vercel) têm prioridade sobre estes padrões.
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
const defaults: Record<string, string> = {
  VITE_WHATSAPP_NUMBER: '5571991921326',
  VITE_CNPJ: '[a informar]',
  VITE_SITE_URL: vercelHost ? `https://${vercelHost}` : '',
  VITE_SUPABASE_URL: '',
  VITE_SUPABASE_ANON_KEY: '',
}

// Multi-page: "/" = landing, "/admin/" = painel restrito.
// Cada página é um entry HTML próprio, então a landing nunca carrega o JS do admin (supabase-js).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  for (const [key, value] of Object.entries(defaults)) {
    if (!env[key]) process.env[key] = value
  }

  return {
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
  }
})
