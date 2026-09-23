'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Lightbox from './Lightbox'
import type { Remera } from '@/types/remera'

const INTERVALO = 4000

export default function CarruselDestacadas({
  remeras,
  etiquetasPorSlug,
}: {
  remeras: Remera[]
  etiquetasPorSlug?: Record<string, string>
}) {
  const [indice, setIndice] = useState(0)
  const [pausado, setPausado] = useState(false)
  const [fotoAmpliada, setFotoAmpliada] = useState(false)

  useEffect(() => {
    if (pausado || fotoAmpliada || remeras.length <= 1) return
    const id = setInterval(() => setIndice((i) => (i + 1) % remeras.length), INTERVALO)
    return () => clearInterval(id)
  }, [pausado, fotoAmpliada, remeras.length])

  if (remeras.length === 0) return null

  const actual = remeras[indice % remeras.length]
  const imagenes = actual.imagenes ?? []

  function ir(delta: number) {
    setIndice((i) => (i + delta + remeras.length) % remeras.length)
  }

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[4/3] bg-white dark:bg-neutral-800 md:aspect-auto md:min-h-[360px]">
          {imagenes[0] ? (
            <button
              type="button"
              onClick={() => setFotoAmpliada(true)}
              aria-label={`Ver foto más grande de ${actual.nombre}`}
              className="relative block h-full w-full cursor-zoom-in bg-transparent p-6"
            >
              <Image
                src={imagenes[0]}
                alt={actual.nombre}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
                priority
              />
            </button>
          ) : (
            <div className="flex h-full items-center justify-center text-neutral-400">Sin foto</div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
            Más vendida
          </span>
        </div>

        <div className="flex flex-col justify-center gap-4 p-6 sm:p-10">
          {etiquetasPorSlug?.[actual.categoria] && (
            <span className="w-fit rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              {etiquetasPorSlug[actual.categoria]}
            </span>
          )}
          <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white sm:text-3xl">
            {actual.nombre}
          </h3>
          {actual.descripcion && (
            <p className="line-clamp-3 text-sm text-neutral-500 dark:text-neutral-400">
              {actual.descripcion}
            </p>
          )}
          <p className="text-2xl font-semibold text-neutral-900 dark:text-white sm:text-3xl">
            Gs. {Number(actual.precio).toLocaleString('es-PY')}
          </p>
          <Link
            href="/catalogo"
            className="inline-flex w-fit items-center gap-2 rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Ver en el catálogo →
          </Link>
        </div>
      </div>

      {remeras.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => ir(-1)}
            aria-label="Ver destacada anterior"
            className="absolute right-16 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/80"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => ir(1)}
            aria-label="Ver siguiente destacada"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/80"
          >
            ›
          </button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
            {remeras.map((remera, i) => (
              <button
                key={remera.id}
                type="button"
                onClick={() => setIndice(i)}
                aria-label={`Ir a la destacada ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === indice
                    ? 'w-6 bg-neutral-900 dark:bg-white'
                    : 'w-2 bg-neutral-300 dark:bg-neutral-600'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {fotoAmpliada && imagenes.length > 0 && (
        <Lightbox imagenes={imagenes} inicio={0} onCerrar={() => setFotoAmpliada(false)} />
      )}
    </div>
  )
}