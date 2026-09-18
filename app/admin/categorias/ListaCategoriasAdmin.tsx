'use client'

import { useTransition } from 'react'
import { updateCategoria, moverCategoria, toggleCategoriaActiva } from './actions'
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

function BotonActivaCategoria({ id, activa }: { id: string; activa: boolean }) {
  const [isPending, startTransition] = useTransition()
  return (
    <button
      type="button"
      onClick={() => startTransition(() => toggleCategoriaActiva(id, activa))}
      disabled={isPending}
      className={[
        'shrink-0 rounded-md border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50',
        activa
          ? 'border-neutral-300 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-white dark:hover:text-white'
          : 'border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-950',
      ].join(' ')}
    >
      {activa ? 'Desactivar' : 'Activar'}
    </button>
  )
}

export default function ListaCategoriasAdmin({ categorias }: { categorias: Categoria[] }) {
  return (
    <div className="space-y-2">
      {categorias.length === 0 ? (
        <p className="text-neutral-400">No hay categorías todavía.</p>
      ) : (
        categorias.map((cat, i) => {
          const activa = Boolean(cat.activa)
          return (
            <div
              key={cat.id}
              className={[
                'flex items-center gap-2 rounded-lg border bg-white p-3 dark:bg-neutral-900',
                activa
                  ? 'border-neutral-200 dark:border-neutral-800'
                  : 'border-dashed border-neutral-300 opacity-60 dark:border-neutral-600',
              ].join(' ')}
            >
              <div className="flex shrink-0 flex-col gap-0.5">
                <Flecha id={cat.id} direccion={-1} disabled={i === 0} />
                <Flecha id={cat.id} direccion={1} disabled={i === categorias.length - 1} />
              </div>

              <div className="flex flex-1 items-center gap-2">
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
                {!activa && (
                  <span className="shrink-0 rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
                    Inactiva
                  </span>
                )}
                <BotonActivaCategoria id={cat.id} activa={activa} />
              </div>
              <BotonEliminarCategoria id={cat.id} slug={cat.slug} etiqueta={cat.etiqueta} />
            </div>
          )
        })
      )}
    </div>
  )
}