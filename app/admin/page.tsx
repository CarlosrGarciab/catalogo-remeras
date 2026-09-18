import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logout } from '../login/actions'
import ListaRemerasAdmin from './ListaRemerasAdmin'
import { obtenerCategorias } from '@/lib/categorias'
import type { Remera } from '@/types/remera'

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; aviso?: string }>
}) {
  const { q, aviso } = await searchParams
  const termino = (q ?? '').trim()

  const supabase = await createClient()
  const [{ data }, categorias] = await Promise.all([
    supabase.from('remeras').select('*'),
    obtenerCategorias(),
  ])
  const remeras = [...((data as Remera[]) ?? [])].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
  )

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 dark:bg-neutral-950 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {aviso && (
          <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-400">
            {aviso}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            Panel de administración
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-neutral-400 underline underline-offset-4 hover:text-neutral-900 dark:hover:text-white"
            >
              Ver catálogo
            </Link>
            <form action={logout}>
              <button className="text-sm text-neutral-400 underline underline-offset-4 hover:text-neutral-900 dark:hover:text-white">
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/nueva"
            className="inline-block rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            + Agregar remera
          </Link>
          <Link
            href="/admin/categorias"
            className="inline-block rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
          >
            Gestionar categorías
          </Link>
        </div>

        <ListaRemerasAdmin remeras={remeras} categorias={categorias} terminoInicial={termino} />
      </div>
    </main>
  )
}