import { describe, expect, it } from 'vitest'
import { buildRobots, buildSitemap } from './seo-files'

describe('buildSitemap', () => {
  it('lista a landing com URL absoluta e data', () => {
    const xml = buildSitemap('https://lp-dandakaya.vercel.app', '2026-11-03')
    expect(xml).toContain('<loc>https://lp-dandakaya.vercel.app/</loc>')
    expect(xml).toContain('<lastmod>2026-11-03</lastmod>')
    expect(xml.match(/<url>/g)).toHaveLength(1)
  })

  it('não duplica a barra quando a URL já termina com /', () => {
    expect(buildSitemap('https://dandakaya.com.br/', '2026-11-03')).toContain('<loc>https://dandakaya.com.br/</loc>')
  })

  it('não inclui o painel', () => {
    expect(buildSitemap('https://dandakaya.com.br', '2026-11-03')).not.toContain('admin')
  })
})

describe('buildRobots', () => {
  it('bloqueia o painel e aponta o sitemap', () => {
    expect(buildRobots('https://dandakaya.com.br/')).toBe(
      'User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: https://dandakaya.com.br/sitemap.xml\n',
    )
  })

  it('sem URL, sai sem a linha Sitemap', () => {
    expect(buildRobots('')).toBe('User-agent: *\nAllow: /\nDisallow: /admin/\n')
  })
})
