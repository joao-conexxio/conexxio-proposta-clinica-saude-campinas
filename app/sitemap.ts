import type { MetadataRoute } from 'next'
import { site } from '@/content/lp'

export const dynamic = 'force-static'

/** Uma página só. O robots.txt só aponta para cá no site oficial. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url, changeFrequency: 'monthly', priority: 1 }]
}
