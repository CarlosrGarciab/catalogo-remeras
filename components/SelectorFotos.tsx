'use client'

import { useState } from 'react'
import { inputClass } from '@/app/admin/campos'

type Item = { id: number; file: File; url: string }

export default function SelectorFotos({ onCambio }: { onCambio: (archivos: File[]) => void }) {
  const [items, setItems] = useState<Item[]>([])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const nuevos = Array.from(e.target.files ?? []).map((file) => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
    }))
    const todos = [...items, ...nuevos]
    setItems(todos)
    onCambio(todos.map((t) => t.file))
    e.target.value = ''
  }

  function quitar(id: number) {
    const rest = items.filter((i) => i.id !== id)
    setItems(rest)
    onCambio(rest.map((i) => i.file))
    const quitado = items.find((i) => i.id === id)
    if (quitado) URL.revokeObjectURL(quitado.url)
  }

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className={
          inputClass +
          ' file:mr-3 file:rounded file:border-0 file:bg-neutral-900 file:px-3 file:py-1.5 file:text-white dark:file:bg-white dark:file:text-neutral-900'
        }
      />

      {items.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt="" className="aspect-square w-full object-cover" />
              <button
                type="button"
                onClick={() => quitar(item.id)}
                aria-label="Quitar foto"
                className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white transition hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {items.length} foto{items.length === 1 ? '' : 's'} seleccionada
          {items.length === 1 ? '' : 's'}
        </p>
      )}
    </div>
  )
}