import type { Metadata, Viewport } from 'next'
import './globals.css'
import { siteUrl } from '@/lib/site'

const SITE_NAME = 'Valheim Réplicas'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0a0a0a',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl('/')),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Réplicas de camisetas de fútbol: clubes y selecciones. Elegí tu talle y pedila por WhatsApp.',
  openGraph: {
    type: 'website',
    locale: 'es_PY',
    siteName: SITE_NAME,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og.png'],
  },
  icons: {
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
