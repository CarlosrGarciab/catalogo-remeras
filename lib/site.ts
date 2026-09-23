const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? 'catalogo-remeras.vercel.app'}`)

export function siteUrl(path = '/'): string {
  return new URL(path, SITE_URL).toString()
}