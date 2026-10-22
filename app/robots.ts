import type { MetadataRoute } from 'next'
import { SITE_OFICIAL, site } from '@/content/lp'

export const dynamic = 'force-static'

/**
 * Gerado no build a partir do modo do site. Em modo proposta bloqueia tudo:
 * a proposta não pode competir no Google com o site atual da clínica. No site
 * oficial libera e aponta o sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  if (!SITE_OFICIAL) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${site.url}sitemap.xml`,
  }
}
