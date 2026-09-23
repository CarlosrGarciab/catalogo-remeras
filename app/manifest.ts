import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Valheim Réplicas',
    short_name: 'Valheim',
    description:
      'Réplicas de camisetas de fútbol: clubes y selecciones. Elegí tu talle y pedila por WhatsApp.',
    start_url: siteUrl('/'),
    scope: siteUrl('/'),
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#0a0a0a',
    icons: [
      { src: siteUrl('/icon-192.png'), sizes: '192x192', type: 'image/png' },
      { src: siteUrl('/icon-512.png'), sizes: '512x512', type: 'image/png' },
    ],
  }
}