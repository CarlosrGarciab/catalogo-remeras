import FormNuevaRemera from './FormNuevaRemera'
import { obtenerCategorias } from '@/lib/categorias'

export default async function NuevaRemeraPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const categorias = await obtenerCategorias()

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 dark:bg-neutral-950 sm:px-8">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-xl font-semibold text-neutral-900 dark:text-white">
          Agregar remera
        </h1>

        {error && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
            {error}
          </p>
        )}

        <FormNuevaRemera categorias={categorias} />
      </div>
    </main>
  )
}