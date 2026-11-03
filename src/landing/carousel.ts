// Carrossel "No nosso Instagram": fotos e links de post vêm da galeria do /admin.
// Rolagem nativa com scroll-snap (toque e trackpad de graça); os botões só ajudam no desktop.
import { fetchGallery, type GalleryItem } from '../lib/content'

export async function mountCarousel(container: HTMLElement | null) {
  if (!container) return
  let items: GalleryItem[] = []
  try {
    items = await fetchGallery()
  } catch (err) {
    console.warn('[dandakaya] galeria indisponível', err)
  }
  // Sem fotos: fica o link estático para o perfil.
  if (!items.length) return

  const trackId = 'carousel-track'
  const root = document.createElement('div')
  root.className = 'carousel'
  root.setAttribute('role', 'region')
  root.setAttribute('aria-roledescription', 'carrossel')
  root.setAttribute('aria-label', 'Fotos do Instagram do Dandakayá')

  const track = document.createElement('ul')
  track.className = 'carousel__track'
  track.id = trackId
  track.tabIndex = 0

  items.forEach((item, i) => {
    const li = document.createElement('li')
    li.className = `carousel__slide carousel__slide--${i % 2 ? 'bowl' : 'arch'}`
    li.setAttribute('aria-roledescription', 'slide')
    li.setAttribute('aria-label', `${i + 1} de ${items.length}`)

    const img = document.createElement('img')
    img.src = item.image_url
    img.alt = item.alt
    img.loading = 'lazy'
    img.decoding = 'async'
    img.width = 600
    img.height = 750

    if (item.post_url) {
      const a = document.createElement('a')
      a.href = item.post_url
      a.target = '_blank'
      a.rel = 'noopener'
      a.append(img)
      const label = document.createElement('span')
      label.className = 'visually-hidden'
      label.textContent = ' (abre o post no Instagram)'
      a.append(label)
      li.append(a)
    } else {
      li.append(img)
    }
    track.append(li)
  })

  const controls = document.createElement('div')
  controls.className = 'carousel__controls'
  const prev = button('Fotos anteriores', 'carousel__btn--prev')
  const next = button('Próximas fotos', 'carousel__btn--next')
  controls.append(prev, next)

  root.append(track, controls)
  container.prepend(root)
  container.classList.add('has-gallery')

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const page = (dir: -1 | 1) =>
    track.scrollBy({ left: dir * track.clientWidth * 0.85, behavior: reduceMotion ? 'auto' : 'smooth' })
  prev.addEventListener('click', () => page(-1))
  next.addEventListener('click', () => page(1))

  const update = () => {
    const max = track.scrollWidth - track.clientWidth - 2
    prev.disabled = track.scrollLeft <= 2
    next.disabled = track.scrollLeft >= max
    controls.hidden = track.scrollWidth <= track.clientWidth + 2
  }
  track.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update, { passive: true })
  track.querySelectorAll('img').forEach((img) => img.addEventListener('load', update, { once: true }))
  update()

  function button(label: string, cls: string) {
    const b = document.createElement('button')
    b.type = 'button'
    b.className = `carousel__btn ${cls}`
    b.setAttribute('aria-controls', trackId)
    b.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-arrow" /></svg>'
    const span = document.createElement('span')
    span.className = 'visually-hidden'
    span.textContent = label
    b.append(span)
    return b
  }
}
