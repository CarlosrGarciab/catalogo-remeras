'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import Lightbox from './Lightbox'
import type { Remera, Tallas } from '@/types/remera'

const TALLAS: Array<keyof Tallas> = ['P', 'M', 'G', 'XL', 'XXL']
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''

export default function RemeraCard({ remera }: { remera: Remera }) {
  const [indice, setIndice] = useState(0)
  const [tallaSeleccionada, setTallaSeleccionada] = useState<keyof Tallas | null>(null)
  const [fotoAmpliada, setFotoAmpliada] = useState(false)

  const cerrarLightbox = useCallback(() => setFotoAmpliada(false), [])

  const imagenes = remera.imagenes ?? []
  const tallas = remera.tallas ?? ({} as Tallas)
  const sinStock = !TALLAS.some((talla) => Boolean(tallas[talla]))

  const mensaje = tallaSeleccionada
    ? `Hola! Me interesa la remera "${remera.nombre}" en talle ${tallaSeleccionada}. ¿Está disponible?`
    : ''
  const linkWhatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
      <div className="relative bg-neutral-100 dark:bg-neutral-800">
        {imagenes.length > 0 ? (
          <button
            type="button"
            onClick={() => setFotoAmpliada(true)}
            aria-label="Ver foto más grande"
            className="relative block w-full cursor-zoom-in bg-transparent p-0"
          >
            <Image
              src={imagenes[indice]}
              alt={remera.nombre}
              width={422}
              height={562}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="h-auto w-full"
            />
          </button>
        ) : (
          <div className="flex aspect-[3/4] items-center justify-center text-sm text-neutral-400">
            Sin foto
          </div>
        )}

        {sinStock && (
          <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Sin stock
          </span>
        )}

        {imagenes.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setIndice((i) => (i - 1 + imagenes.length) % imagenes.length)}
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/80"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setIndice((i) => (i + 1) % imagenes.length)}
              aria-label="Foto siguiente"
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/80"
            >
              ›
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {imagenes.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${i === indice ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h2 className="font-medium text-neutral-900 dark:text-white">{remera.nombre}</h2>
          {remera.descripcion && (
            <p className="mt-1 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
              {remera.descripcion}
            </p>
          )}
        </div>

        <p className="text-lg font-semibold text-neutral-900 dark:text-white">
          Gs. {Number(remera.precio).toLocaleString('es-PY')}
        </p>

        <div className="mt-auto space-y-3">
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-neutral-400">
              Talle
            </p>
            <div className="flex flex-wrap gap-1.5">
              {TALLAS.map((talla) => {
                const disponible = Boolean(tallas[talla])
                const seleccionado = tallaSeleccionada === talla
                return (
                  <button
                    key={talla}
                    type="button"
                    disabled={!disponible}
                    onClick={() =>
                      setTallaSeleccionada((prev) => (prev === talla ? null : talla))
                    }
                    className={[
                      'h-8 w-10 rounded-md border text-sm transition',
                      !disponible
                        ? 'cursor-not-allowed border-neutral-100 text-neutral-300 line-through dark:border-neutral-800 dark:text-neutral-700'
                        : seleccionado
                        ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                        : 'border-neutral-300 text-neutral-700 hover:border-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white',
                    ].join(' ')}
                  >
                    {talla}
                  </button>
                )
              })}
            </div>
            {sinStock && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                Sin stock por el momento.
              </p>
            )}
          </div>

          <a
            href={tallaSeleccionada ? linkWhatsapp : undefined}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!tallaSeleccionada) e.preventDefault()
            }}
            aria-disabled={!tallaSeleccionada}
            className={[
              'flex w-full items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition',
              tallaSeleccionada
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'cursor-not-allowed bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600',
            ].join(' ')}
          >
            {sinStock ? 'Sin stock' : 'Pedir por WhatsApp'}
          </a>
        </div>
      </div>

      {fotoAmpliada && (
        <Lightbox imagenes={imagenes} inicio={indice} onCerrar={cerrarLightbox} />
      )}
    </div>
  )
}
