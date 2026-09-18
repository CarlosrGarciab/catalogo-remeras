'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { crearPedido, actualizarPedido } from './actions'
import { Campo, inputClass } from '../campos'

type OptRemera = { id: string; nombre: string }

type PedidoEditable = {
  id: string
  cliente: string
  telefono: string
  info_extra: string
  remera_id: string | null
  remera_nombre: string
  talla: string
  pago: string
  monto_pagado: number
}

export default function FormPedido({
  remeras,
  pedido,
}: {
  remeras: OptRemera[]
  pedido?: PedidoEditable
}) {
  const [isPending, startTransition] = useTransition()
  const esEdicion = Boolean(pedido)
  const [remeraNombre, setRemeraNombre] = useState(pedido?.remera_nombre ?? '')

  function cambiarRemera(e: React.ChangeEvent<HTMLSelectElement>) {
    const remera = remeras.find((r) => r.id === e.target.value)
    setRemeraNombre(remera?.nombre ?? '')
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(() => {
      if (pedido) actualizarPedido(formData)
      else crearPedido(formData)
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
    >
      {pedido && <input type="hidden" name="id" value={pedido.id} />}

      <Campo label="Nombre del cliente">
        <input
          name="cliente"
          required
          defaultValue={pedido?.cliente ?? ''}
          className={inputClass}
          placeholder="Ej: Mariano López"
        />
      </Campo>

      <div className="grid grid-cols-2 gap-4">
        <Campo label="Teléfono">
          <input
            name="telefono"
            type="tel"
            defaultValue={pedido?.telefono ?? ''}
            className={inputClass}
            placeholder="Ej: +595 981 234 567"
          />
        </Campo>
        <Campo label="Talle">
          <select name="talla" defaultValue={pedido?.talla ?? ''} className={inputClass}>
            <option value="">No especificado</option>
            {['S', 'M', 'L', 'XL'].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Campo>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Remera pedida
        </label>
        <select
          name="remera_id"
          defaultValue={pedido?.remera_id ?? ''}
          onChange={cambiarRemera}
          className={inputClass}
        >
          <option value="">— Elegir del catálogo (opcional) —</option>
          {remeras.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nombre}
            </option>
          ))}
        </select>
        <input
          name="remera_nombre"
          value={remeraNombre}
          onChange={(e) => setRemeraNombre(e.target.value)}
          className={inputClass}
          placeholder="Nombre de la remera pedida (se completa solo al elegir del catálogo)"
        />
      </div>

      <Campo label="Información extra (opcional)">
        <textarea
          name="info_extra"
          rows={2}
          defaultValue={pedido?.info_extra ?? ''}
          className={inputClass}
          placeholder="Ej: Prefiere retirar, quiere nombre en la espalda, pagó por transferencia..."
        />
      </Campo>

      <div className="grid grid-cols-2 gap-4">
        <Campo label="Estado de pago">
          <select name="pago" defaultValue={pedido?.pago ?? 'pendiente'} className={inputClass}>
            <option value="pendiente">Sin pago</option>
            <option value="senia">Seña</option>
            <option value="pagado">Pagado completo</option>
          </select>
        </Campo>
        <Campo label="Monto pagado (Gs.)">
          <input
            name="monto_pagado"
            type="number"
            step="1"
            min="0"
            defaultValue={pedido?.monto_pagado ?? 0}
            className={inputClass}
            placeholder="0"
          />
        </Campo>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-neutral-900 py-2 font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {isPending ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Guardar pedido'}
        </button>
        <Link
          href="/admin/pedidos"
          className="w-full rounded-md border border-neutral-300 py-2 text-center text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
        >
          Cancelar
        </Link>
      </div>
    </form>
  )
}