import { afterEach, describe, expect, it, vi } from 'vitest'

// content.ts lê import.meta.env ao ser importado; cada cenário reimporta o módulo.
async function loadContent(url: string, key: string) {
  vi.resetModules()
  vi.stubEnv('VITE_SUPABASE_URL', url)
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', key)
  return import('./content')
}

function mockFetch(body: unknown, init: { ok?: boolean; status?: number } = {}) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: () => Promise.resolve(body),
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('isSupabaseConfigured', () => {
  it('é falso sem URL ou chave', async () => {
    expect((await loadContent('', '')).isSupabaseConfigured).toBe(false)
    expect((await loadContent('https://abc.supabase.co', '')).isSupabaseConfigured).toBe(false)
  })

  it('é falso com o valor de exemplo do .env.example', async () => {
    const { isSupabaseConfigured } = await loadContent('https://SEU-PROJETO.supabase.co', 'chave')
    expect(isSupabaseConfigured).toBe(false)
  })

  it('é verdadeiro com URL e chave reais', async () => {
    expect((await loadContent('https://abc.supabase.co', 'chave')).isSupabaseConfigured).toBe(true)
  })
})

describe('fetchPublicContent', () => {
  it('não chama a rede quando o Supabase não está configurado', async () => {
    const fetchMock = mockFetch([])
    const { fetchPublicContent } = await loadContent('', '')
    expect(await fetchPublicContent()).toEqual({})
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('envia a chave pública e mantém só as chaves conhecidas', async () => {
    const fetchMock = mockFetch([
      { key: 'hero_headline', value: 'Nova headline' },
      { key: 'chave_desconhecida', value: 'ignorar' },
    ])
    const { fetchPublicContent } = await loadContent('https://abc.supabase.co', 'anon-123')

    expect(await fetchPublicContent()).toEqual({ hero_headline: 'Nova headline' })
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://abc.supabase.co/rest/v1/site_content?select=key,value')
    expect(init.headers).toEqual({ apikey: 'anon-123', Authorization: 'Bearer anon-123' })
  })

  it('falha com mensagem clara quando o servidor responde erro', async () => {
    mockFetch({}, { ok: false, status: 500 })
    const { fetchPublicContent } = await loadContent('https://abc.supabase.co', 'anon-123')
    await expect(fetchPublicContent()).rejects.toThrow('Falha ao carregar site_content (500)')
  })
})

describe('fetchGallery', () => {
  it('devolve lista vazia sem Supabase configurado', async () => {
    const fetchMock = mockFetch([])
    const { fetchGallery } = await loadContent('', '')
    expect(await fetchGallery()).toEqual([])
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('pede as fotos ordenadas e limitadas', async () => {
    const items = [{ id: '1', image_url: 'https://x/a.webp', post_url: null, alt: 'A', position: 0 }]
    const fetchMock = mockFetch(items)
    const { fetchGallery, GALLERY_LIMIT } = await loadContent('https://abc.supabase.co', 'anon-123')

    expect(await fetchGallery()).toEqual(items)
    const url: string = fetchMock.mock.calls[0][0]
    expect(url).toContain('/rest/v1/gallery_items?')
    expect(url).toContain('order=position.asc,created_at.desc')
    expect(url).toContain(`limit=${GALLERY_LIMIT}`)
  })
})
