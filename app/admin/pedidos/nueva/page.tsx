import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import FormPedido from '../FormPedido'

export default async function NuevoPedidoPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const supabase = await createClient()
  const { data } = await supabase
    .from('remeras')
    .select('id, nombre, precio')
    .order('nombre', { ascending: true })
  const remeras = data ?? []

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 dark:bg-neutral-950 sm:px-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">Nuevo pedido</h1>
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

        <FormPedido remeras={remeras} />
      </div>
    </main>
  )
}