'use client'

const INTERVALO = 3000
const EVENTO = 'opencode-carrusel-tick'

let iniciado = false

export function arrancarTick() {
  if (typeof window === 'undefined' || iniciado) return
  iniciado = true
  window.setInterval(() => {
    window.dispatchEvent(new CustomEvent(EVENTO))
  }, INTERVALO)
}

export function suscribirseTick(handler: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(EVENTO, handler)
  return () => window.removeEventListener(EVENTO, handler)
}