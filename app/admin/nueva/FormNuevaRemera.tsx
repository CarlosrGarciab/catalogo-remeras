'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { addRemera } from '../actions'
import { Campo, inputClass } from '../campos'
import SelectorFotos from '@/components/SelectorFotos'
import type { Categoria } from '@/lib/categorias'

export default function FormNuevaRemera({ categorias }: { categorias: Categoria[] }) {
  const [isPending, startTransition] = useTransition()
  const [archivos, setArchivos] = useState<File[]>([])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.delete('imagenes')
    archivos.forEach((archivo) => formData.append('imagenes', archivo, archivo.name))
    startTransition(() => addRemera(formData))
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <Campo label="Nombre">
        <input name="nombre" required className={inputClass} placeholder="Ej: Real Madrid local 25/26" />
      </Campo>

      <Campo label="Descripción">
        <textarea
          name="descripcion"
          rows={3}
          className={inputClass}
          placeholder="Ej: Camiseta versión jugador, tela dri-fit, incluye parches..."
        />
      </Campo>

      <div className="grid grid-cols-2 gap-4">
        <Campo label="Precio (Gs.)">
          <input name="precio" type="number" step="1" min="0" required className={inputClass} />
        </Campo>
        <Campo label="Categoría">
          <select
            name="categoria"
            required
            defaultValue={categorias[0]?.slug}
            className={inputClass}
          >
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
              <input type="checkbox" name={`talla_${t}`} defaultChecked className="rounded" />
              {t.toUpperCase()}
            </label>
          ))}
        </div>
      </Campo>

      <Campo label="Fotos (podés elegir varias, o una por una)">
        <SelectorFotos onCambio={setArchivos} />
      </Campo>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-neutral-900 py-2 font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        {isPending ? 'Guardando...' : 'Guardar'}
      </button>

      <Link
        href="/admin"
        className="block w-full rounded-md border border-neutral-300 py-2 text-center text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
      >
        Cancelar
      </Link>
    </form>
  )
}