const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''

export default function WhatsAppFlotante() {
  if (!WHATSAPP_NUMBER) return null

  const mensaje = 'Hola! Vi el catálogo y me interesa consultar por una remera.'
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition hover:scale-105 hover:bg-emerald-600"
    >
      <svg viewBox="0 0 32 32" fill="currentColor" className="h-7 w-7" aria-hidden="true">
        <path d="M16.04 4C9.5 4 4.2 9.3 4.2 15.8c0 2.1.55 4.1 1.6 5.9L4 28l6.5-1.7c1.7.9 3.6 1.4 5.5 1.4 6.5 0 11.8-5.3 11.8-11.8C27.8 9.3 22.5 4 16.04 4zm0 21.6c-1.8 0-3.5-.5-5-1.4l-.3-.2-3.9 1 1-3.8-.2-.4c-1-1.6-1.6-3.4-1.6-5.3C6.04 10 11.3 6.2 16.04 6.2c4.9 0 8.6 3.7 8.6 8.6 0 4.8-3.7 8.8-8.6 8.8zm4.7-6.6c-.25-.12-1.5-.74-1.73-.82-.23-.09-.4-.13-.56.12-.17.25-.65.82-.8 1-.15.16-.3.18-.55.06-.25-.12-1.06-.39-2.02-1.24-.74-.66-1.25-1.48-1.4-1.73-.14-.25-.02-.39.11-.51.12-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.06 0 1.21.88 2.38 1 2.54.12.17 1.74 2.66 4.22 3.73.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.5-.61 1.71-1.2.21-.59.21-1.1.15-1.2-.06-.11-.23-.17-.48-.29z" />
      </svg>
    </a>
  )
}