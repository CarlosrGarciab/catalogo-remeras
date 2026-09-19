import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CatalogoClient from '@/components/CatalogoClient'
import { PasosCompra } from '@/components/PasosCompra'
import { SobreNosotros } from '@/components/SobreNosotros'
import Header from '@/components/Header'
import WhatsAppFlotante from '@/components/WhatsAppFlotante'
import { obtenerCategorias } from '@/lib/categorias'
import type { Remera } from '@/types/remera'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; q?: string }>
}) {
  const { categoria, q } = await searchParams
  const categorias = await obtenerCategorias({ soloActivas: true })
  const categoriaActiva = categorias.some((c) => c.slug === categoria)
    ? (categoria as string)
    : null
  const etiquetasPorSlug = Object.fromEntries(categorias.map((c) => [c.slug, c.etiqueta]))
  const slugsActivos = categorias.map((c) => c.slug)
  const termino = (q ?? '').trim()
  const mostrarCategoria = !categoriaActiva

  const supabase = await createClient()
  let query = supabase.from('remeras').select('*').eq('activa', true)
  if (slugsActivos.length > 0) query = query.in('categoria', slugsActivos)
  if (categoriaActiva) query = query.eq('categoria', categoriaActiva)
  const { data } = await query

  const remeras = [...((data as Remera[]) ?? [])].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
  )

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 dark:bg-neutral-950 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Header />

        <nav className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/"
            className={[
              'rounded-full border px-4 py-1.5 text-sm transition',
              !categoriaActiva
                ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                : 'border-neutral-300 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white',
            ].join(' ')}
          >
            Todos
          </Link>
          {categorias.map((cat) => (
            <Link
              key={cat.slug}
              href={`/?categoria=${cat.slug}`}
              className={[
                'rounded-full border px-4 py-1.5 text-sm transition',
                categoriaActiva === cat.slug
                  ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                  : 'border-neutral-300 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white',
              ].join(' ')}
            >
              {cat.etiqueta}
            </Link>
          ))}
        </nav>

        <CatalogoClient
          remeras={remeras}
          terminoInicial={termino}
          etiquetasPorSlug={etiquetasPorSlug}
          mostrarCategoria={mostrarCategoria}
        />

        <PasosCompra />

        <SobreNosotros />
      </div>

      <WhatsAppFlotante />
    </main>
  )
}