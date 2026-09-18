'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { updateRemera } from '../../actions'
import { Campo, inputClass } from '../../campos'
import SelectorFotos from '@/components/SelectorFotos'
import type { Categoria } from '@/lib/categorias'
import type { Remera, Tallas } from '@/types/remera'

export default function FormEditarRemera({
  remera,
  categorias,
}: {
  remera: Remera
  categorias: Categoria[]
}) {
  const [isPending, startTransition] = useTransition()
  const [archivos, setArchivos] = useState<File[]>([])
  const [orden, setOrden] = useState<string[]>(remera.imagenes ?? [])
  const [eliminar, setEliminar] = useState<string[]>([])
  const tallas = remera.tallas as Tallas

  function mover(i: number, dir: -1 | 1) {
    setOrden((prev) => {
      const j = i + dir
      if (j < 0 || j >= prev.length) return prev
      const next = [...prev]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  }

  function toggoleValidar(url: string) {
    setEliminar((prev) => (prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.delete('imagenes_nuevas')
    archivos.forEach((archivo) => formData.append('imagenes_nuevas', archivo, archivo.name))
    formData.delete('imagenes_orden')
    const ordenFinal = orden.filter((url) => !eliminar.includes(url))
    formData.set('imagenes_orden', JSON.stringify(ordenFinal))
    startTransition(() => updateRemera(formData))
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <input type="hidden" name="id" value={remera.id} />

      <Campo label="Nombre">
        <input name="nombre" defaultValue={remera.nombre} required className={inputClass} />
      </Campo>

      <Campo label="Descripción">
        <textarea
          name="descripcion"
          defaultValue={remera.descripcion ?? ''}
          rows={3}
          className={inputClass}
        />
      </Campo>

      <div className="grid grid-cols-2 gap-4">
        <Campo label="Precio (Gs.)">
          <input
            name="precio"
            type="number"
            step="1"
            min="0"
            defaultValue={remera.precio}
            required
            className={inputClass}
          />
        </Campo>
        <Campo label="Categoría">
          <select name="categoria" defaultValue={remera.categoria} required className={inputClass}>
            {categorias.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.etiqueta}
              </option>
            ))}
          </select>
        </Campo>
      </div>

      <Campo label="Talles disponibles">
        <div className="flex gap-4">
          {(['p', 'm', 'g', 'xl', 'xxl'] as const).map((t) => (
            <label
              key={t}
              className="flex items-center gap-1.5 text-sm text-neutral-700 dark:text-neutral-300"
            >
              <input
                type="checkbox"
                name={`talla_${t}`}
                defaultChecked={Boolean(tallas?.[t.toUpperCase() as keyof Tallas])}
                className="rounded"
              />
              {t.toUpperCase()}
            </label>
          ))}
        </div>
      </Campo>

      {orden.length > 0 && (
        <Campo label="Fotos actuales (la primera es la principal; usá las flechas para ordenar)">
          <div className="grid grid-cols-3 gap-3">
            {orden.map((url: string, i: number) => (
              <div
                key={url}
                className="group relative aspect-square overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700"
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  sizes="33vw"
                  className="object-cover"
                />

                {i === 0 && (
                  <span className="absolute left-1.5 top-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                    Principal
                  </span>
                )}

                <input
                  type="checkbox"
                  name="eliminar_imagen"
                  value={url}
                  checked={eliminar.includes(url)}
                  onChange={() => toggoleValidar(url)}
                  className="peer absolute right-1.5 top-1.5 h-4 w-4"
                />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-red-600/0 text-xs font-medium text-white opacity-0 transition peer-checked:bg-red-600/70 peer-checked:opacity-100">
                  Se eliminará
                </span>

                <div className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-1">
                  <button
                    type="button"
                    disabled={i === 0}
                    onClick={() => mover(i, -1)}
                    aria-label="Mover foto una posición a la izquierda"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-sm text-white transition hover:bg-black/80 disabled:opacity-30"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    disabled={i === orden.length - 1}
                    onClick={() => mover(i, 1)}
                    aria-label="Mover foto una posición a la derecha"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-sm text-white transition hover:bg-black/80 disabled:opacity-30"
                  >
                    ›
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Campo>
      )}

      <Campo label="Agregar más fotos (podés elegir varias, o una por una)">
        <SelectorFotos onCambio={setArchivos} />
      </Campo>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-neutral-900 py-2 font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {isPending ? 'Guardando...' : 'Guardar cambios'}
        </button>
        <Link
          href="/admin"
          className="w-full rounded-md border border-neutral-300 py-2 text-center text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
        >
          Cancelar
        </Link>
      </div>
    </form>
  )
}