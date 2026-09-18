import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ListaPedidosAdmin from './ListaPedidosAdmin'
import type { Pedido } from '@/types/pedido'

export default async function PedidosPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false })
  const pedidos = (data as Pedido[]) ?? []

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 dark:bg-neutral-950 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Pedidos</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-sm text-neutral-400 underline underline-offset-4 hover:text-neutral-900 dark:hover:text-white"
            >
              Volver al panel
            </Link>
            <Link
              href="/admin/pedidos/nueva"
              className="inline-block rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              + Nuevo pedido
            </Link>
          </div>
        </div>

        <ListaPedidosAdmin pedidos={pedidos} />
      </div>
    </main>
  )
}