// Cliente Supabase completo (Auth + Storage + DB). Importado só pelo /admin.
// Sem .env preenchido o cliente aponta para um host inválido; o painel checa
// isSupabaseConfigured antes de usar e mostra a tela de configuração.
import { createClient } from '@supabase/supabase-js'
import { isSupabaseConfigured } from './content'

export const supabase = createClient(
  isSupabaseConfigured ? import.meta.env.VITE_SUPABASE_URL : 'http://localhost',
  isSupabaseConfigured ? import.meta.env.VITE_SUPABASE_ANON_KEY : 'not-configured',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'dandakaya-admin-auth',
    },
  },
)
