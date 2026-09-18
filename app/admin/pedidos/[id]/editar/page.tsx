import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import FormPedido from '../../FormPedido'
import type { Pedido } from '@/types/pedido'

export default async function EditarPedidoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const { error } = await searchParams
  const supabase = await createClient()
  const [{ data: pedido }, { data: remeras }] = await Promise.all([
    supabase.from('pedidos').select('*').eq('id', id).single(),
    supabase.from('remeras').select('id, nombre').order('nombre', { ascending: true }),
  ])

  if (!pedido) notFound()

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 dark:bg-neutral-950 sm:px-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Editar pedido
          </h1>
          <Link
            href="/admin/pedidos"
            className="text-sm text-neutral-400 underline underline-offset-4 hover:text-neutral-900 dark:hover:text-white"
          >
            Volver a pedidos
          </Link>
        </div>

        {error && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
            {error}
          </p>
        )}

        <FormPedido remeras={remeras ?? []} pedido={pedido as Pedido} />
      </div>
    </main>
  )
}