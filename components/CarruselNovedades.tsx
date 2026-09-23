'use client'

import { useEffect, useState } from 'react'
import RemeraCard from './RemeraCard'
import type { Remera } from '@/types/remera'

const INTERVALO = 3000

export default function CarruselNovedades({
  remeras,
  etiquetasPorSlug,
  nuevosPorId,
}: {
  remeras: Remera[]
  etiquetasPorSlug: Record<string, string>
  nuevosPorId: Record<string, boolean>
}) {
  const [indice, setIndice] = useState(0)
  const [pausado, setPausado] = useState(false)

  useEffect(() => {
    if (pausado || remeras.length <= 1) return
    const id = setInterval(() => setIndice((i) => (i + 1) % remeras.length), INTERVALO)
    return () => clearInterval(id)
  }, [pausado, remeras.length])

  if (remeras.length === 0) return null

  const actual = remeras[indice % remeras.length]

  return (
    <div
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      <div className="mx-auto max-w-sm">
        <RemeraCard
          key={actual.id}
          remera={actual}
          nuevo={Boolean(nuevosPorId[actual.id])}
          categoriaEtiqueta={etiquetasPorSlug[actual.categoria]}
        />
      </div>

      {remeras.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setIndice((i) => (i - 1 + remeras.length) % remeras.length)}
            aria-label="Novedad anterior"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
          >
            ‹
          </button>

          <div className="flex items-center gap-1.5">
            {remeras.map((remera, i) => (
              <button
                key={remera.id}
                type="button"
                onClick={() => setIndice(i)}
                aria-label={`Ir a la novedad ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === indice
                    ? 'w-6 bg-neutral-900 dark:bg-white'
                    : 'w-2 bg-neutral-300 dark:bg-neutral-600'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIndice((i) => (i + 1) % remeras.length)}
            aria-label="Siguiente novedad"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}