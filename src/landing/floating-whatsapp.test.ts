import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setupFloatingWhatsApp } from './floating-whatsapp'

let heroBottom = 0
let footerTop = 0

function rect(top: number, bottom: number) {
  return { top, bottom, left: 0, right: 0, width: 0, height: bottom - top, x: 0, y: top, toJSON() {} } as DOMRect
}

function scroll(hero: number, footer: number) {
  heroBottom = hero
  footerTop = footer
  window.dispatchEvent(new Event('scroll'))
}

const button = () => document.querySelector('.wa-float')!

beforeEach(() => {
  document.body.innerHTML = `
    <a class="hero__cta"></a>
    <div class="site-footer__cta"></div>
    <a class="wa-float"></a>`
  vi.stubGlobal('innerHeight', 800)
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0)
    return 0
  })
  document.querySelector('.hero__cta')!.getBoundingClientRect = () => rect(heroBottom - 56, heroBottom)
  document.querySelector('.site-footer__cta')!.getBoundingClientRect = () => rect(footerTop, footerTop + 60)
})

describe('setupFloatingWhatsApp', () => {
  it('fica escondido enquanto o botão do topo está na tela', () => {
    heroBottom = 600
    footerTop = 4000
    setupFloatingWhatsApp()
    expect(button().classList.contains('is-visible')).toBe(false)
  })

  it('aparece quando o botão do topo sai da tela', () => {
    heroBottom = 600
    footerTop = 4000
    setupFloatingWhatsApp()
    scroll(-20, 3000)
    expect(button().classList.contains('is-visible')).toBe(true)
  })

  it('some quando o CTA do rodapé entra na tela', () => {
    heroBottom = -20
    footerTop = 4000
    setupFloatingWhatsApp()
    expect(button().classList.contains('is-visible')).toBe(true)
    scroll(-3000, 700)
    expect(button().classList.contains('is-visible')).toBe(false)
  })

  it('fica sempre visível se a página não tiver os CTAs de referência', () => {
    document.body.innerHTML = '<a class="wa-float"></a>'
    setupFloatingWhatsApp()
    expect(button().classList.contains('is-visible')).toBe(true)
  })
})
