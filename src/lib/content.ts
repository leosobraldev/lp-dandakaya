// Contrato do conteúdo editável. Compartilhado entre a landing e o /admin.

export const CONTENT_KEYS = [
  'hero_headline',
  'hero_subheadline',
  'hero_image_url',
  'loja_title',
  'loja_text',
  'loja_image_url',
  'salao_title',
  'salao_text',
  'salao_image_url',
  'sobre_text',
  'sobre_image_url',
] as const

export type ContentKey = (typeof CONTENT_KEYS)[number]
export type SiteContent = Partial<Record<ContentKey, string>>

export const CONTENT_TABLE = 'site_content'
export const GALLERY_TABLE = 'gallery_items'
export const IMAGES_BUCKET = 'site-images'
export const GALLERY_LIMIT = 24

export interface GalleryItem {
  id: string
  image_url: string
  post_url: string | null
  alt: string
  position: number
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('SEU-PROJETO'),
)

/**
 * Leitura pública via REST (PostgREST) com fetch puro.
 * A landing não importa o supabase-js, o que economiza ~30 KB gzip de JS na rota mais acessada.
 */
async function restGet<T>(query: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${query}`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    signal,
  })
  if (!res.ok) throw new Error(`Falha ao carregar ${query.split('?')[0]} (${res.status})`)
  return res.json()
}

export async function fetchGallery(signal?: AbortSignal): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured) return []
  return restGet<GalleryItem[]>(
    `${GALLERY_TABLE}?select=id,image_url,post_url,alt,position&order=position.asc,created_at.desc&limit=${GALLERY_LIMIT}`,
    signal,
  )
}

export async function fetchPublicContent(signal?: AbortSignal): Promise<SiteContent> {
  if (!isSupabaseConfigured) return {}

  const rows = await restGet<{ key: string; value: string }[]>(`${CONTENT_TABLE}?select=key,value`, signal)
  const content: SiteContent = {}
  for (const row of rows) {
    if ((CONTENT_KEYS as readonly string[]).includes(row.key)) {
      content[row.key as ContentKey] = row.value
    }
  }
  return content
}
