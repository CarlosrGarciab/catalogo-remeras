'use client'

import { useEffect, useState } from 'react'
import RemeraCard from './RemeraCard'
import type { Remera } from '@/types/remera'

const INTERVALO = 5000
const POR_PAGINA = 4

export default function CarruselNovedades({
  remeras,
  etiquetasPorSlug,
  esNuevo,
}: {
  remeras: Remera[]
  etiquetasPorSlug: Record<string, string>
  esNuevo: (remera: Remera) => boolean
}) {
  const [pagina, setPagina] = useState(0)
  const [pausado, setPausado] = useState(false)

  const paginas: Remera[][] = []
  for (let i = 0; i < remeras.length; i += POR_PAGINA) {
    paginas.push(remeras.slice(i, i + POR_PAGINA))
  }
  const totalPaginas = paginas.length

  useEffect(() => {
    if (pausado || totalPaginas <= 1) return
    const id = setInterval(() => setPagina((p) => (p + 1) % totalPaginas), INTERVALO)
    return () => clearInterval(id)
  }, [pausado, totalPaginas])

  if (remeras.length === 0) return null

  const paginaActiva = paginas[pagina % totalPaginas]

  return (
    <div
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      {totalPaginas > 1 && (
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm tabular-nums text-neutral-400 dark:text-neutral-500">
            {pagina + 1} / {totalPaginas}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPagina((p) => (p - 1 + totalPaginas) % totalPaginas)}
              aria-label="Novedades anteriores"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setPagina((p) => (p + 1) % totalPaginas)}
              aria-label="Próximas novedades"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
            >
              ›
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {paginaActiva.map((remera) => (
          <RemeraCard
            key={remera.id}
            remera={remera}
            nuevo={esNuevo(remera)}
            categoriaEtiqueta={etiquetasPorSlug[remera.categoria]}
          />
        ))}
      </div>

      {totalPaginas > 1 && (
        <div className="mt-5 flex items-center justify-center gap-1.5">
          {paginas.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPagina(i)}
              aria-label={`Ir a las novedades ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === pagina
                  ? 'w-6 bg-neutral-900 dark:bg-white'
                  : 'w-2 bg-neutral-300 dark:bg-neutral-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}