// Arquivos de SEO gerados no build (ver plugin em vite.config.ts).
// Precisam de URL absoluta, então dependem de VITE_SITE_URL ou do domínio da Vercel.

const trimSlash = (url: string) => url.trim().replace(/\/+$/, '')

/** Sitemap com a landing. O /admin/ fica de fora de propósito. */
export function buildSitemap(siteUrl: string, lastmod: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${trimSlash(siteUrl)}/</loc>
    <lastmod>${lastmod}</lastmod>
  </url>
</urlset>
`
}

/** Sem URL, o robots sai sem a linha Sitemap (ela exige endereço absoluto). */
export function buildRobots(siteUrl: string) {
  const lines = ['User-agent: *', 'Allow: /', 'Disallow: /admin/']
  const base = trimSlash(siteUrl)
  if (base) lines.push('', `Sitemap: ${base}/sitemap.xml`)
  return `${lines.join('\n')}\n`
}
