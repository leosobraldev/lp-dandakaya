/** Botão flutuante do WhatsApp: só aparece quando nenhum outro CTA grande está na tela. */
export function setupFloatingWhatsApp(root: ParentNode = document) {
  const button = root.querySelector<HTMLElement>('.wa-float')
  const heroCta = root.querySelector('.hero__cta')
  const footerCta = root.querySelector('.site-footer__cta')
  if (!button || !heroCta || !footerCta) {
    button?.classList.add('is-visible')
    return
  }

  // Duas leituras de posição por quadro, no máximo: barato e sem depender de IntersectionObserver.
  let queued = false
  const update = () => {
    queued = false
    const heroGone = heroCta.getBoundingClientRect().bottom < 0
    const footerAway = footerCta.getBoundingClientRect().top > window.innerHeight
    button.classList.toggle('is-visible', heroGone && footerAway)
  }
  const schedule = () => {
    if (!queued) {
      queued = true
      requestAnimationFrame(update)
    }
  }
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
  update()
}
