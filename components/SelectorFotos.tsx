'use client'

import { useState } from 'react'
import { inputClass } from '@/app/admin/campos'

type Item = { id: number; file: File; url: string }

const MAX_FOTOS = 8
const PESO_MAX = 15 * 1024 * 1024
const LADO_MAX = 1400

async function comprimir(archivo: File): Promise<File> {
  const url = URL.createObjectURL(archivo)
  const imagen = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('No se pudo leer la imagen'))
    img.src = url
  }).finally(() => URL.revokeObjectURL(url))

  const escala = Math.min(1, LADO_MAX / Math.max(imagen.width, imagen.height))
  const ancho = Math.max(1, Math.round(imagen.width * escala))
  const alto = Math.max(1, Math.round(imagen.height * escala))

  const canvas = document.createElement('canvas')
  canvas.width = ancho
  canvas.height = alto
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No se pudo procesar la imagen')
  ctx.drawImage(imagen, 0, 0, ancho, alto)

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.8)
  )
  if (!blob) throw new Error('No se pudo comprimir la imagen')

  const nombreSinExtension = archivo.name.replace(/\.[^.]+$/, '') || 'foto'
  return new File([blob], `${nombreSinExtension}.jpg`, { type: 'image/jpeg' })
}

export default function SelectorFotos({ onCambio }: { onCambio: (archivos: File[]) => void }) {
  const [items, setItems] = useState<Item[]>([])
  const [errores, setErrores] = useState<string[]>([])
  const [procesando, setProcesando] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const archivosNuevos = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (archivosNuevos.length === 0) return

    setProcesando(true)
    setErrores([])
    const problemas: string[] = []
    const agregados: Item[] = []

    for (const archivo of archivosNuevos) {
      if (items.length + agregados.length >= MAX_FOTOS) {
        problemas.push(`Máximo ${MAX_FOTOS} fotos por remera.`)
        break
      }
      if (!archivo.type.startsWith('image/')) {
        problemas.push(`"${archivo.name}" no es una imagen.`)
        continue
      }
      if (archivo.size > PESO_MAX) {
        problemas.push(`"${archivo.name}" supera los 15 MB.`)
        continue
      }
      try {
        const comprimido = await comprimir(archivo)
        agregados.push({
          id: Date.now() + Math.random(),
          file: comprimido,
          url: URL.createObjectURL(comprimido),
        })
      } catch {
        problemas.push(`"${archivo.name}" no se pudo procesar.`)
      }
    }

    const todos = [...items, ...agregados]
    setItems(todos)
    onCambio(todos.map((t) => t.file))
    setErrores(problemas)
    setProcesando(false)
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
        disabled={procesando}
        onChange={handleChange}
        className={
          inputClass +
          ' file:mr-3 file:rounded file:border-0 file:bg-neutral-900 file:px-3 file:py-1.5 file:text-white disabled:opacity-50 dark:file:bg-white dark:file:text-neutral-900'
        }
      />

      {procesando && <p className="text-xs text-neutral-500 dark:text-neutral-400">Comprimiendo...</p>}

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
          {items.length === 1 ? '' : 's'} (se comprimen automáticamente al guardar)
        </p>
      )}

      {errores.length > 0 && (
        <ul className="space-y-1 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950 dark:text-red-400">
          {errores.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  )
}