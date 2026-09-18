import Link from 'next/link'
import { obtenerCategorias } from '@/lib/categorias'
import { addCategoria } from './actions'
import ListaCategoriasAdmin from './ListaCategoriasAdmin'
import { inputClass } from '../campos'

export default async function CategoriasPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const categorias = await obtenerCategorias()

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 dark:bg-neutral-950 sm:px-8">
      <div className="mx-auto max-w-xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">Categorías</h1>
          <Link
            href="/admin"
            className="text-sm text-neutral-400 underline underline-offset-4 hover:text-neutral-900 dark:hover:text-white"
          >
            Volver al panel
          </Link>
        </div>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
            {error}
          </p>
        )}

        <form
          action={addCategoria}
          className="flex gap-2 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <input
            name="etiqueta"
            placeholder="Nueva categoría, ej: Retro"
            required
            className={inputClass}
          />
          <button
            type="submit"
            className="shrink-0 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Agregar
          </button>
        </form>

        <ListaCategoriasAdmin categorias={categorias} />
      </div>
    </main>
  )
}
