'use client'

import { useEffect, useState, useTransition } from 'react'

export default function ConfirmarEliminar({
  action,
  id,
  campos = {},
  titulo,
  mensaje,
  children,
  className = 'text-sm text-red-500 hover:text-red-400',
}: {
  action: (formData: FormData) => Promise<void>
  id: string
  campos?: Record<string, string>
  titulo: string
  mensaje: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  const [abierto, setAbierto] = useState(false)
  const [isPending] = useTransition()

  useEffect(() => {
    if (!abierto) return
    const cerrar = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) setAbierto(false)
    }
    window.addEventListener('keydown', cerrar)
    return () => window.removeEventListener('keydown', cerrar)
  }, [abierto, isPending])

  return (
    <>
      <button type="button" onClick={() => setAbierto(true)} className={className}>
        {children}
      </button>

      {abierto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={titulo}
          onClick={() => !isPending && setAbierto(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-neutral-900 dark:text-white">{titulo}</h2>
                <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{mensaje}</p>
              </div>
            </div>

            <form action={action} className="mt-6 flex gap-3">
              <input type="hidden" name="id" value={id} />
              {Object.entries(campos).map(([clave, valor]) => (
                <input key={clave} type="hidden" name={clave} value={valor} />
              ))}
              <button
                type="button"
                onClick={() => setAbierto(false)}
                disabled={isPending}
                className="flex-1 rounded-md border border-neutral-300 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 rounded-md bg-red-600 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {isPending ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}