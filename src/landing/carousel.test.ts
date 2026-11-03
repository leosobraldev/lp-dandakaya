import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { GalleryItem } from '../lib/content'

const fetchGallery = vi.fn<[], Promise<GalleryItem[]>>()
vi.mock('../lib/content', () => ({ fetchGallery: () => fetchGallery() }))
const { mountCarousel } = await import('./carousel')

const item = (id: string, post_url: string | null = null): GalleryItem => ({
  id,
  image_url: `https://cdn.test/${id}.webp`,
  post_url,
  alt: `Foto ${id}`,
  position: Number(id),
})

let container: HTMLElement

beforeEach(() => {
  document.body.innerHTML = '<div class="insta"><div class="insta__fallback">Ver o perfil</div></div>'
  container = document.querySelector('.insta')!
  vi.stubGlobal('matchMedia', () => ({ matches: false }))
  fetchGallery.mockReset()
})

describe('mountCarousel', () => {
  it('monta um slide por foto, alternando arco e tigela', async () => {
    fetchGallery.mockResolvedValue([item('1'), item('2'), item('3')])
    await mountCarousel(container)

    const slides = container.querySelectorAll('.carousel__slide')
    expect(slides).toHaveLength(3)
    expect([...slides].map((s) => s.classList.contains('carousel__slide--arch'))).toEqual([true, false, true])
    expect(slides[1].getAttribute('aria-label')).toBe('2 de 3')
    expect(container.classList.contains('has-gallery')).toBe(true)
  })

  it('usa a descrição como alt e linka o post quando existe', async () => {
    fetchGallery.mockResolvedValue([item('1', 'https://www.instagram.com/p/abc/'), item('2')])
    await mountCarousel(container)

    const [withLink, withoutLink] = container.querySelectorAll('.carousel__slide')
    const link = withLink.querySelector('a')!
    expect(link.href).toBe('https://www.instagram.com/p/abc/')
    expect(link.target).toBe('_blank')
    expect(link.rel).toBe('noopener')
    expect(withLink.querySelector('img')!.alt).toBe('Foto 1')
    expect(withoutLink.querySelector('a')).toBeNull()
  })

  it('mantém o link para o perfil quando a galeria está vazia', async () => {
    fetchGallery.mockResolvedValue([])
    await mountCarousel(container)
    expect(container.querySelector('.carousel')).toBeNull()
    expect(container.classList.contains('has-gallery')).toBe(false)
  })

  it('não quebra a página se a galeria falhar', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    fetchGallery.mockRejectedValue(new Error('offline'))
    await expect(mountCarousel(container)).resolves.toBeUndefined()
    expect(container.querySelector('.insta__fallback')).not.toBeNull()
  })

  it('ignora quando a seção não existe', async () => {
    await expect(mountCarousel(null)).resolves.toBeUndefined()
    expect(fetchGallery).not.toHaveBeenCalled()
  })
})
