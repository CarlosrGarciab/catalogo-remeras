'use client'

import { useMemo, useState } from 'react'
import RemeraCard from './RemeraCard'
import type { Remera } from '@/types/remera'

const inputClass =
  'w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:focus:border-white'

export default function CatalogoClient({
  remeras,
  terminoInicial = '',
  etiquetasPorSlug,
  mostrarCategoria = false,
}: {
  remeras: Remera[]
  terminoInicial?: string
  etiquetasPorSlug?: Record<string, string>
  mostrarCategoria?: boolean
}) {
  const [termino, setTermino] = useState(terminoInicial)

  const filtradas = useMemo(() => {
    const t = termino.trim().toLowerCase()
    if (!t) return remeras
    return remeras.filter(
      (r) =>
        r.nombre.toLowerCase().includes(t) ||
        (r.descripcion ?? '').toLowerCase().includes(t)
    )
  }, [remeras, termino])

  return (
    <>
      <div className="mb-6 max-w-md">
        <div className="relative">
          <input
            type="text"
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            placeholder="Buscar remera por nombre..."
            className={inputClass + ' pr-9'}
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
          {termino.trim()
            ? `No se encontró ninguna remera que coincida con "${termino.trim()}".`
            : 'Todavía no hay remeras en esta categoría.'}
        </p>
      ) : (
        <>
          <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
            {filtradas.length} remera{filtradas.length === 1 ? '' : 's'}
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtradas.map((remera) => (
              <div
                key={remera.id}
                id={`remera-${remera.id}`}
                className="scroll-mt-8 rounded-2xl transition target:ring-2 target:ring-amber-400"
              >
                <RemeraCard
                  remera={remera}
                  categoriaEtiqueta={
                    mostrarCategoria ? etiquetasPorSlug?.[remera.categoria] : undefined
                  }
                />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}