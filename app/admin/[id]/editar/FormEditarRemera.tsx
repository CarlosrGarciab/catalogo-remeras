'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
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
  const tallas = remera.tallas as Tallas

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.delete('imagenes_nuevas')
    archivos.forEach((archivo) => formData.append('imagenes_nuevas', archivo, archivo.name))
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
          {(['s', 'm', 'l', 'xl'] as const).map((t) => (
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

      {remera.imagenes && remera.imagenes.length > 0 && (
        <Campo label="Fotos actuales (marcá la que quieras eliminar)">
          <div className="grid grid-cols-3 gap-3">
            {remera.imagenes.map((url: string) => (
              <label
                key={url}
                className="group relative block cursor-pointer overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="aspect-square w-full object-cover" />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-red-600/0 text-xs font-medium text-white opacity-0 transition group-has-[:checked]:bg-red-600/70 group-has-[:checked]:opacity-100">
                  Se eliminará
                </span>
                <input
                  type="checkbox"
                  name="eliminar_imagen"
                  value={url}
                  className="absolute right-1.5 top-1.5 h-4 w-4"
                />
              </label>
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