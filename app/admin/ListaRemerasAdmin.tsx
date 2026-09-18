'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import TallaCheckbox from './TallaCheckbox'
import BotonEliminarRemera from '@/components/BotonEliminarRemera'
import { toggleRemeraActiva } from './actions'
import type { Categoria } from '@/lib/categorias'
import type { Remera, Tallas } from '@/types/remera'

const TALLAS: Array<keyof Tallas> = ['P', 'M', 'G', 'XL', 'XXL']
const inputClass =
  'w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:focus:border-white'

function BotonActivaRemera({ remeraId, activa }: { remeraId: string; activa: boolean }) {
  const [isPending, startTransition] = useTransition()
  return (
    <button
      type="button"
      onClick={() => startTransition(() => toggleRemeraActiva(remeraId, activa))}
      disabled={isPending}
      className={[
        'rounded-md border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50',
        activa
          ? 'border-neutral-300 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-white dark:hover:text-white'
          : 'border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-950',
      ].join(' ')}
    >
      {activa ? 'Desactivar' : 'Activar'}
    </button>
  )
}

export default function ListaRemerasAdmin({
  remeras,
  categorias,
  terminoInicial = '',
}: {
  remeras: Remera[]
  categorias: Categoria[]
  terminoInicial?: string
}) {
  const [termino, setTermino] = useState(terminoInicial)
  const etiquetaPorSlug = useMemo(
    () => new Map(categorias.map((c) => [c.slug, c.etiqueta])),
    [categorias]
  )

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
    <div className="space-y-3">
      <div className="max-w-sm">
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
            : 'No hay remeras cargadas todavía.'}
        </p>
      ) : (
        filtradas.map((remera) => {
          const activa = Boolean(remera.activa)
          return (
            <div
              key={remera.id}
              className={[
                'flex flex-col gap-4 rounded-xl border bg-white p-4 dark:bg-neutral-900 sm:flex-row sm:items-center sm:justify-between',
                activa
                  ? 'border-neutral-200 dark:border-neutral-800'
                  : 'border-dashed border-neutral-300 opacity-60 dark:border-neutral-600',
              ].join(' ')}
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800">
                  {remera.imagenes?.[0] ? (
                    <Image
                      src={remera.imagenes[0]}
                      alt={remera.nombre}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-neutral-900 dark:text-white">{remera.nombre}</p>
                    {!activa && (
                      <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
                        Inactiva
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {etiquetaPorSlug.get(remera.categoria) ?? remera.categoria} · Gs.{' '}
                    {Number(remera.precio).toLocaleString('es-PY')}
                  </p>
                  <div className="mt-1.5 flex gap-1.5">
                    {TALLAS.map((talla) => (
                      <TallaCheckbox
                        key={talla}
                        remeraId={remera.id}
                        talla={talla}
                        disponible={Boolean((remera.tallas as Tallas)?.[talla])}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-4">
                <BotonActivaRemera remeraId={remera.id} activa={activa} />
                <Link
                  href={`/admin/${remera.id}/editar`}
                  className="text-sm text-neutral-500 underline underline-offset-4 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                >
                  Editar
                </Link>
                <BotonEliminarRemera id={remera.id} nombre={remera.nombre} />
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}