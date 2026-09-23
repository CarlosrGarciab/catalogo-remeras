import type { Metadata } from 'next'
import './globals.css'

const SITE_NAME = 'Valheim Réplicas'

const metadataBase = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001'
      : `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? 'catalogo-remeras.vercel.app'}`)
)

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: `${SITE_NAME} | Réplicas de fútbol`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Réplicas de camisetas de fútbol: clubes y selecciones. Elegí tu talle y pedila por WhatsApp.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_PY',
    url: '/',
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Réplicas de fútbol`,
    description: 'Camisetas de fútbol réplica. Elegí tu talle y pedila por WhatsApp.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Réplicas de fútbol`,
    description: 'Camisetas de fútbol réplica. Elegí tu talle y pedila por WhatsApp.',
    images: ['/og.png'],
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
