import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl('/'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: siteUrl('/catalogo'),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]
}