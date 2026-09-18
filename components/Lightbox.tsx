'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export default function Lightbox({
  imagenes,
  inicio,
  onCerrar,
}: {
  imagenes: string[]
  inicio: number
  onCerrar: () => void
}) {
  const [indice, setIndice] = useState(inicio % imagenes.length)
  const [escala, setEscala] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const contenedorRef = useRef<HTMLDivElement>(null)
  const arrastre = useRef<{ x: number; y: number; px: number; py: number } | null>(null)
  const total = imagenes.length

  const anterior = useCallback(() => setIndice((i) => (i - 1 + total) % total), [total])
  const siguiente = useCallback(() => setIndice((i) => (i + 1) % total), [total])

  useEffect(() => {
    setEscala(1)
    setPos({ x: 0, y: 0 })
    arrastre.current = null
  }, [indice])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCerrar()
      else if (e.key === 'ArrowLeft') anterior()
      else if (e.key === 'ArrowRight') siguiente()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCerrar, anterior, siguiente])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    const cont = contenedorRef.current
    if (!cont) return
    function onWheel(e: WheelEvent) {
      e.preventDefault()
      const delta = e.deltaY < 0 ? 0.25 : -0.25
      setEscala((z) => Math.min(4, Math.max(1, +(z + delta).toFixed(2))))
    }
    cont.addEventListener('wheel', onWheel, { passive: false })
    return () => cont.removeEventListener('wheel', onWheel)
  }, [])

  function acercar() {
    setEscala((z) => Math.min(4, +(z + 0.5).toFixed(2)))
  }

  function alejar() {
    setEscala((z) => Math.max(1, +(z - 0.5).toFixed(2)))
  }

  function alternarZoom() {
    const nueva = escala > 1 ? 1 : 2
    setEscala(nueva)
    if (nueva === 1) setPos({ x: 0, y: 0 })
  }

  function onPointerDown(e: React.PointerEvent<HTMLImageElement>) {
    if (escala === 1) return
    arrastre.current = { x: pos.x, y: pos.y, px: e.clientX, py: e.clientY }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent<HTMLImageElement>) {
    const d = arrastre.current
    if (!d) return
    setPos({ x: d.x + (e.clientX - d.px), y: d.y + (e.clientY - d.py) })
  }

  function onPointerUp() {
    arrastre.current = null
  }

  const arrastrando = arrastre.current !== null

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label="Ver foto en grande"
    >
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <span className="text-sm text-neutral-300">
          {indice + 1} / {Math.max(total, 1)}
        </span>
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xl transition hover:bg-white/20"
        >
          ×
        </button>
      </div>

      <div ref={contenedorRef} className="relative flex-1 overflow-hidden select-none">
        <button
          type="button"
          onClick={anterior}
          aria-label="Foto anterior"
          className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={siguiente}
          aria-label="Foto siguiente"
          className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
        >
          ›
        </button>

        <div className="flex h-full w-full items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagenes[indice]}
            alt="Foto de la remera"
            draggable={false}
            onClick={alternarZoom}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{
              transform: `translate(${pos.x}px, ${pos.y}px) scale(${escala})`,
              transition: arrastrando ? 'none' : 'transform 150ms ease',
            }}
            className={`max-h-full max-w-full object-contain ${
              escala > 1
                ? 'cursor-grab active:cursor-grabbing'
                : 'cursor-zoom-in'
            }`}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 px-4 py-4 text-white">
        <button
          type="button"
          onClick={alejar}
          aria-label="Alejar"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg transition hover:bg-white/20"
        >
          −
        </button>
        <span className="w-14 text-center text-sm tabular-nums text-neutral-300">
          {Math.round(escala * 100)}%
        </span>
        <button
          type="button"
          onClick={acercar}
          aria-label="Acercar"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg transition hover:bg-white/20"
        >
          +
        </button>
        <span className="ml-2 hidden text-xs text-neutral-500 sm:inline">
          Clic para acercar · rueda del mouse para ajustar · arrastrá para mover
        </span>
      </div>
    </div>
  )
}