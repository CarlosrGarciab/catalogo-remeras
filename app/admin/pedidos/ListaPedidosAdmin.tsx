'use client'

import { useMemo, useState, useTransition } from 'react'
import { alternarEntregado, eliminarPedido } from './actions'
import ConfirmarEliminar from '@/components/ConfirmarEliminar'
import Link from 'next/link'
import type { Pedido } from '@/types/pedido'
import { ETIQUETAS_PAGO } from '@/types/pedido'

type Filtro = 'todos' | 'pendientes' | 'entregados'

const inputClass =
  'w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:focus:border-white'

function formatearFecha(iso: string) {
  return new Date(iso).toLocaleString('es-PY', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function resumenItems(pedido: Pedido) {
  return pedido.items
    .map((item) => (item.talla ? `${item.nombre} (${item.talla})` : item.nombre))
    .join(', ')
}

function clasesPago(pago: Pedido['pago']) {
  if (pago === 'pagado') {
    return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
  }
  if (pago === 'senia') {
    return 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
  }
  return 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
}

function BotonEntregado({ id, entregado }: { id: string; entregado: boolean }) {
  const [isPending, startTransition] = useTransition()
  return (
    <button
      type="button"
      onClick={() => startTransition(() => alternarEntregado(id, !entregado))}
      disabled={isPending}
      className={[
        'rounded-md px-3 py-1.5 text-xs font-medium transition disabled:opacity-50',
        entregado
          ? 'border border-neutral-300 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-white dark:hover:text-white'
          : 'bg-emerald-600 text-white hover:bg-emerald-700',
      ].join(' ')}
    >
      {entregado ? 'Desmarcar entrega' : 'Marcar entregado'}
    </button>
  )
}

function BotonEliminarPedido({ id, cliente }: { id: string; cliente: string }) {
  return (
    <ConfirmarEliminar
      action={eliminarPedido}
      id={id}
      titulo="Eliminar pedido"
      mensaje={
        <>
          ¿Seguro que querés eliminar el pedido de{' '}
          <span className="font-medium text-neutral-900 dark:text-white">“{cliente}”</span>? Este
          cambio no se puede deshacer.
        </>
      }
    >
      Eliminar
    </ConfirmarEliminar>
  )
}

export default function ListaPedidosAdmin({ pedidos }: { pedidos: Pedido[] }) {
  const [filtro, setFiltro] = useState<Filtro>('pendientes')
  const [termino, setTermino] = useState('')

  const pendientes = pedidos.filter((p) => !p.entregado).length
  const entregados = pedidos.length - pendientes

  const filtradas = useMemo(() => {
    const t = termino.trim().toLowerCase()
    return pedidos.filter((p) => {
      if (filtro === 'pendientes' && p.entregado) return false
      if (filtro === 'entregados' && !p.entregado) return false
      if (!t) return true
      return (
        p.cliente.toLowerCase().includes(t) ||
        p.telefono.toLowerCase().includes(t) ||
        p.items.some((item) => item.nombre.toLowerCase().includes(t))
      )
    })
  }, [pedidos, filtro, termino])

  const chips: { valor: Filtro; etiqueta: string; cantidad: number }[] = [
    { valor: 'pendientes', etiqueta: 'Pendientes', cantidad: pendientes },
    { valor: 'entregados', etiqueta: 'Entregados', cantidad: entregados },
    { valor: 'todos', etiqueta: 'Todos', cantidad: pedidos.length },
  ]

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5">
          {chips.map((chip) => (
            <button
              key={chip.valor}
              type="button"
              onClick={() => setFiltro(chip.valor)}
              className={[
                'rounded-full px-3 py-1.5 text-xs font-medium transition',
                filtro === chip.valor
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700',
              ].join(' ')}
            >
              {chip.etiqueta} ({chip.cantidad})
            </button>
          ))}
        </div>

        <div className="relative max-w-sm">
          <input
            type="text"
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            placeholder="Buscar por cliente, teléfono o remera..."
            className={inputClass}
          />
          {termino && (
            <button
              type="button"
              onClick={() => setTermino('')}
              aria-label="Limpiar búsqueda"
              className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-200 text-xs text-neutral-600 transition hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {filtradas.length === 0 ? (
        <p className="text-neutral-400">
          {pedidos.length === 0
            ? 'Todavía no hay pedidos cargados.'
            : 'No se encontró ningún pedido que coincida con el filtro.'}
        </p>
      ) : (
        filtradas.map((pedido) => (
          <div
            key={pedido.id}
            className={[
              'flex flex-col gap-4 rounded-xl border bg-white p-4 dark:bg-neutral-900',
              pedido.entregado
                ? 'border-emerald-200 dark:border-emerald-900'
                : 'border-neutral-200 dark:border-neutral-800',
            ].join(' ')}
          >
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-neutral-900 dark:text-white">{pedido.cliente}</p>
                <span
                  className={[
                    'rounded-full px-2 py-0.5 text-[11px] font-medium',
                    pedido.entregado
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
                  ].join(' ')}
                >
                  {pedido.entregado ? 'Entregado' : 'Pendiente'}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${clasesPago(pedido.pago)}`}
                >
                  {ETIQUETAS_PAGO[pedido.pago]}
                </span>
              </div>

              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                {resumenItems(pedido) || 'Sin remeras especificadas'}
              </p>

              {(pedido.telefono || pedido.info_extra) && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {pedido.telefono && <span>Tel: {pedido.telefono}</span>}
                  {pedido.telefono && pedido.info_extra && <span> · </span>}
                  {pedido.info_extra && <span>{pedido.info_extra}</span>}
                </p>
              )}

              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                {formatearFecha(pedido.created_at)}
                {pedido.monto_pagado > 0 &&
                  ` · Pagó Gs. ${Number(pedido.monto_pagado).toLocaleString('es-PY')}`}
                {pedido.entregado_en && ` · Entregado el ${formatearFecha(pedido.entregado_en)}`}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-4">
              <BotonEntregado id={pedido.id} entregado={pedido.entregado} />
              <Link
                href={`/admin/pedidos/${pedido.id}/editar`}
                className="text-sm text-neutral-500 underline underline-offset-4 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                Editar
              </Link>
              <BotonEliminarPedido id={pedido.id} cliente={pedido.cliente} />
            </div>
          </div>
        ))
      )}
    </div>
  )
}