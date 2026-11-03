import './landing.css'
import { fetchPublicContent, type ContentKey, type SiteContent } from '../lib/content'
import { mountCarousel } from './carousel'
import { setupFloatingWhatsApp } from './floating-whatsapp'

const CACHE_KEY = 'dandakaya:content'

/** Aplica o conteúdo do Supabase sobre o HTML estático (que já traz os textos padrão). */
function applyContent(content: SiteContent) {
  document.querySelectorAll<HTMLElement>('[data-content]').forEach((el) => {
    const value = content[el.dataset.content as ContentKey]?.trim()
    if (value) el.textContent = value
  })

  // Texto longo: parágrafos separados por linha em branco. Sempre via textContent (sem HTML injetado).
  document.querySelectorAll<HTMLElement>('[data-content-html]').forEach((el) => {
    const value = content[el.dataset.contentHtml as ContentKey]?.trim()
    if (!value) return
    el.replaceChildren(
      ...value.split(/\n\s*\n/).map((paragraph) => {
        const p = document.createElement('p')
        p.textContent = paragraph.trim()
        return p
      }),
    )
  })

  document.querySelectorAll<HTMLElement>('[data-content-img]').forEach((figure) => {
    const url = content[figure.dataset.contentImg as ContentKey]?.trim()
    if (!url) return

    let img = figure.querySelector('img')
    if (img?.src === url) return
    if (!img) {
      img = document.createElement('img')
      img.alt = figure.dataset.alt ?? ''
      img.decoding = 'async'
      if (figure.hasAttribute('data-priority')) img.setAttribute('fetchpriority', 'high')
      else img.loading = 'lazy'
      figure.prepend(img)
    }
    img.addEventListener('load', () => img!.classList.add('is-loaded'), { once: true })
    img.addEventListener('error', () => {
      img!.remove()
      figure.classList.remove('has-image')
    }, { once: true })
    img.src = url
    figure.classList.add('has-image')
  })
}

function readCache(): SiteContent | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as SiteContent) : null
  } catch {
    return null
  }
}

function writeCache(content: SiteContent) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(content))
  } catch {
    /* modo privado ou storage cheio: segue sem cache */
  }
}

async function loadContent() {
  // Visita recorrente: pinta o último conteúdo conhecido na hora, depois revalida.
  const cached = readCache()
  if (cached) applyContent(cached)

  try {
    const content = await fetchPublicContent()
    if (Object.keys(content).length) {
      applyContent(content)
      writeCache(content)
    }
  } catch (err) {
    // O HTML já tem conteúdo padrão; a página continua íntegra.
    console.warn('[dandakaya] conteúdo dinâmico indisponível', err)
  }
}

function setupMenu() {
  const header = document.querySelector<HTMLElement>('.site-header')
  const toggle = header?.querySelector<HTMLButtonElement>('.menu-toggle')
  const label = toggle?.querySelector('.visually-hidden')
  if (!header || !toggle) return

  const setOpen = (open: boolean) => {
    header.toggleAttribute('data-open', open)
    toggle.setAttribute('aria-expanded', String(open))
    if (label) label.textContent = open ? 'Fechar menu' : 'Abrir menu'
  }

  toggle.addEventListener('click', () => setOpen(!header.hasAttribute('data-open')))
  header.querySelectorAll('.nav a').forEach((a) => a.addEventListener('click', () => setOpen(false)))
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.hasAttribute('data-open')) {
      setOpen(false)
      toggle.focus()
    }
  })

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8)
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}

function setupReveal() {
  const targets = document.querySelectorAll('[data-reveal]')
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-in'))
    return
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  )
  targets.forEach((el) => io.observe(el))
}

document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = String(new Date().getFullYear())
})

setupMenu()
setupReveal()
setupFloatingWhatsApp()
loadContent()
mountCarousel(document.querySelector('[data-gallery]'))
