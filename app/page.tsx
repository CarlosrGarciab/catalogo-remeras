import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import CarruselDestacadas from '@/components/CarruselDestacadas'
import { SobreNosotros } from '@/components/SobreNosotros'
import WhatsAppFlotante from '@/components/WhatsAppFlotante'
import { obtenerCategorias } from '@/lib/categorias'
import type { Remera } from '@/types/remera'

const CANTIDAD_NOVEDADES = 8

export default async function HomePage() {
  const categorias = await obtenerCategorias({ soloActivas: true })
  const slugsActivos = categorias.map((c) => c.slug)
  const etiquetasPorSlug = Object.fromEntries(categorias.map((c) => [c.slug, c.etiqueta]))

  const supabase = await createClient()

  let queryDestacadas = supabase.from('remeras').select('*').eq('activa', true).eq('destacada', true)
  if (slugsActivos.length > 0) queryDestacadas = queryDestacadas.in('categoria', slugsActivos)
  const { data: dataDestacadas } = await queryDestacadas

  let queryNovedades = supabase
    .from('remeras')
    .select('*')
    .eq('activa', true)
    .order('created_at', { ascending: false })
    .limit(CANTIDAD_NOVEDADES)
  if (slugsActivos.length > 0) queryNovedades = queryNovedades.in('categoria', slugsActivos)
  const { data: dataNovedades } = await queryNovedades

  const destacadas = ((dataDestacadas as Remera[]) ?? []).sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
  )
  const novedades = ((dataNovedades as Remera[]) ?? []).slice(0, CANTIDAD_NOVEDADES)

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <section className="relative overflow-hidden bg-neutral-900 dark:bg-neutral-950">
        <Image
          src="/banner.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-neutral-900/70 dark:bg-neutral-950/80" />

        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo de la tienda"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover shadow-sm"
            />
            <span className="text-xl font-semibold text-white">Valheim Réplicas</span>
          </div>
        </div>

        <div className="relative mx-auto max-w-3xl px-4 pb-14 pt-8 text-center sm:px-8 sm:pb-20 sm:pt-10">
          <p className="mb-4 inline-block rounded-full border border-neutral-700 px-4 py-1 text-xs font-medium uppercase tracking-wider text-neutral-300">
            Réplicas de fútbol · Clubes y selecciones
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Las camisetas que soñás, con calidad premium
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-neutral-400 sm:text-base">
            Bordadas y termoselladas, talles P a XXL. Envíos gratis en la UNA y pedidos por
            WhatsApp con seña del 50%.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <Link
              href="/catalogo"
              className="w-full rounded-md bg-white px-8 py-3.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200 sm:w-auto"
            >
              Ver catálogo
            </Link>
            <Link
              href="#mas-vendidas"
              className="w-full rounded-md border border-neutral-700 px-8 py-3.5 text-sm font-semibold text-neutral-200 transition hover:border-white hover:text-white sm:w-auto"
            >
              Más vendidas
            </Link>
            <Link
              href="#novedades"
              className="w-full rounded-md border border-neutral-700 px-8 py-3.5 text-sm font-semibold text-neutral-200 transition hover:border-white hover:text-white sm:w-auto"
            >
              Novedades
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">Categorías</h2>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">Elegí por dónde empezar</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {categorias.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalogo?categoria=${cat.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
            >
              {cat.etiqueta}
            </Link>
          ))}
        </div>
      </section>

      {destacadas.length > 0 && (
        <section id="mas-vendidas" className="mx-auto max-w-6xl px-4 py-14 sm:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                Más vendidas
              </h2>
              <p className="mt-1 text-neutral-500 dark:text-neutral-400">
                Las preferidas por nuestros clientes
              </p>
            </div>
            <Link
              href="/catalogo"
              className="text-sm text-neutral-500 underline underline-offset-4 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              Ver todas
            </Link>
          </div>
          <CarruselDestacadas remeras={destacadas} etiquetasPorSlug={etiquetasPorSlug} />
        </section>
      )}

      {novedades.length > 0 && (
        <section id="novedades" className="mx-auto max-w-6xl px-4 pb-14 sm:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                Novedades
              </h2>
              <p className="mt-1 text-neutral-500 dark:text-neutral-400">
                Las últimas remeras que llegaron
              </p>
            </div>
            <Link
              href="/catalogo"
              className="text-sm text-neutral-500 underline underline-offset-4 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              Ver todas
            </Link>
          </div>

          <CarruselDestacadas
            remeras={novedades}
            etiquetasPorSlug={etiquetasPorSlug}
            etiqueta="Novedad"
          />
        </section>
      )}

      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SobreNosotros />
      </div>

      <footer className="mt-4 border-t border-neutral-200 py-8 dark:border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 pb-[env(safe-area-inset-bottom)] text-center text-sm text-neutral-400 dark:text-neutral-500 sm:px-8">
          © {new Date().getFullYear()} Valheim Réplicas · Réplicas de fútbol
        </div>
      </footer>

      <WhatsAppFlotante />
    </main>
  )
}