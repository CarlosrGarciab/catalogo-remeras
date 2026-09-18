import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { obtenerCategorias } from '@/lib/categorias'
import FormEditarRemera from './FormEditarRemera'
import type { Remera } from '@/types/remera'

export default async function EditarRemeraPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: remera }, categorias] = await Promise.all([
    supabase.from('remeras').select('*').eq('id', id).single(),
    obtenerCategorias(),
  ])

  if (!remera) notFound()

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 dark:bg-neutral-950 sm:px-8">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-xl font-semibold text-neutral-900 dark:text-white">
          Editar remera
        </h1>

        <FormEditarRemera remera={remera as Remera} categorias={categorias} />
      </div>
    </main>
  )
}