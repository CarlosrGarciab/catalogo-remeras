'use client'

import { useTransition } from 'react'
import { updateCategoria, moverCategoria } from './actions'
import BotonEliminarCategoria from '@/components/BotonEliminarCategoria'
import { inputClass } from '../campos'
import type { Categoria } from '@/lib/categorias'

function Flecha({
  id,
  direccion,
  disabled,
}: {
  id: string
  direccion: -1 | 1
  disabled: boolean
}) {
  const [isPending, startTransition] = useTransition()
  return (
    <button
      type="button"
      onClick={() => startTransition(() => moverCategoria(id, direccion))}
      disabled={disabled || isPending}
      aria-label={direccion === -1 ? 'Subir categoría' : 'Bajar categoría'}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-neutral-300 text-sm text-neutral-600 transition hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-25 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
    >
      {direccion === -1 ? '‹' : '›'}
    </button>
  )
}

export default function ListaCategoriasAdmin({ categorias }: { categorias: Categoria[] }) {
  return (
    <div className="space-y-2">
      {categorias.length === 0 ? (
        <p className="text-neutral-400">No hay categorías todavía.</p>
      ) : (
        categorias.map((cat, i) => (
          <div
            key={cat.id}
            className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="flex shrink-0 flex-col gap-0.5">
              <Flecha id={cat.id} direccion={-1} disabled={i === 0} />
              <Flecha id={cat.id} direccion={1} disabled={i === categorias.length - 1} />
            </div>

            <form action={updateCategoria} className="flex flex-1 items-center gap-2">
              <input type="hidden" name="id" value={cat.id} />
              <input name="etiqueta" defaultValue={cat.etiqueta} className={inputClass} />
              <button
                type="submit"
                className="shrink-0 text-sm text-neutral-500 underline underline-offset-4 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                Guardar
              </button>
            </form>
            <BotonEliminarCategoria id={cat.id} slug={cat.slug} etiqueta={cat.etiqueta} />
          </div>
        ))
      )}
    </div>
  )
}