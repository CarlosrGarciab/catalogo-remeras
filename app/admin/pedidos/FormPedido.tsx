'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { crearPedido, actualizarPedido } from './actions'
import { Campo, inputClass } from '../campos'
import type { Pedido } from '@/types/pedido'

type OptRemera = { id: string; nombre: string }

type ItemForm = { remera_id: string; nombre: string; talla: string }

function itemVacio(): ItemForm {
  return { remera_id: '', nombre: '', talla: '' }
}

export default function FormPedido({
  remeras,
  pedido,
}: {
  remeras: OptRemera[]
  pedido?: Pedido
}) {
  const [isPending, startTransition] = useTransition()
  const esEdicion = Boolean(pedido)
  const [items, setItems] = useState<ItemForm[]>(() => {
    const previos = pedido?.items ?? []
    return previos.length > 0
      ? previos.map((item) => ({
          remera_id: item.remera_id ?? '',
          nombre: item.nombre ?? '',
          talla: item.talla ?? '',
        }))
      : [itemVacio()]
  })

  function cambiarRemera(i: number, remeraId: string) {
    setItems((prev) => {
      const next = [...prev]
      const remera = remeras.find((r) => r.id === remeraId)
      next[i] = { ...next[i], remera_id: remeraId, nombre: remera?.nombre ?? '' }
      return next
    })
  }

  function cambiarNombre(i: number, nombre: string) {
    setItems((prev) => {
      const next = [...prev]
      next[i] = { ...next[i], nombre }
      return next
    })
  }

  function cambiarTalla(i: number, talla: string) {
    setItems((prev) => {
      const next = [...prev]
      next[i] = { ...next[i], talla }
      return next
    })
  }

  function quitarItem(i: number) {
    setItems((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.delete('items_json')
    const itemsLimpios = items
      .map((item) => ({
        remera_id: item.remera_id.trim() || null,
        nombre: item.nombre.trim(),
        talla: item.talla,
      }))
      .filter((item) => item.nombre !== '')
    formData.set('items_json', JSON.stringify(itemsLimpios))
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

      <div className="grid grid-cols-2 gap-4">
        <Campo label="Nombre del cliente">
          <input
            name="cliente"
            required
            defaultValue={pedido?.cliente ?? ''}
            className={inputClass}
            placeholder="Ej: Mariano López"
          />
        </Campo>
        <Campo label="Teléfono">
          <input
            name="telefono"
            type="tel"
            defaultValue={pedido?.telefono ?? ''}
            className={inputClass}
            placeholder="Ej: +595 981 234 567"
          />
        </Campo>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Remeras pedidas
        </label>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="space-y-2 rounded-md border border-neutral-200 p-3 dark:border-neutral-700"
            >
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <select
                    value={item.remera_id}
                    onChange={(e) => cambiarRemera(i, e.target.value)}
                    className={inputClass}
                  >
                    <option value="">— Elegir del catálogo (opcional) —</option>
                    {remeras.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-28">
                  <select
                    value={item.talla}
                    onChange={(e) => cambiarTalla(i, e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Talle</option>
                    {['S', 'M', 'L', 'XL'].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => quitarItem(i)}
                  disabled={items.length <= 1}
                  aria-label="Quitar remera"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-neutral-300 text-neutral-500 transition hover:border-red-500 hover:text-red-500 disabled:opacity-30 dark:border-neutral-700"
                >
                  ×
                </button>
              </div>
              <input
                value={item.nombre}
                onChange={(e) => cambiarNombre(i, e.target.value)}
                className={inputClass}
                placeholder="Nombre de la remera pedida (se completa solo al elegir del catálogo)"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setItems((prev) => [...prev, itemVacio()])}
          disabled={isPending}
          className="rounded-md border border-dashed border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-600 transition hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
        >
          + Agregar otra remera
        </button>
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