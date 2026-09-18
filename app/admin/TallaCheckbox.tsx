'use client'

import { useTransition } from 'react'
import { toggleTalla } from './actions'
import type { Tallas } from '@/types/remera'

export default function TallaCheckbox({
  remeraId,
  talla,
  disponible,
}: {
  remeraId: string
  talla: keyof Tallas
  disponible: boolean
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <label
      title={
        disponible
          ? `Talle ${talla} disponible — clic para marcar agotado`
          : `Talle ${talla} agotado — clic para marcar disponible`
      }
      className={[
        'flex h-6 w-9 cursor-pointer select-none items-center justify-center rounded border text-[11px] font-medium transition',
        disponible
          ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
          : 'border-neutral-200 text-neutral-400 line-through dark:border-neutral-800 dark:text-neutral-600',
        isPending ? 'opacity-50' : '',
      ].join(' ')}
    >
      <input
        type="checkbox"
        checked={disponible}
        disabled={isPending}
        onChange={() => startTransition(() => toggleTalla(remeraId, talla, disponible))}
        className="sr-only"
      />
      {talla}
    </label>
  )
}
