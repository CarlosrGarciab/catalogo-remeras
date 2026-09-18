const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''

export default function EnviosPagos() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Hola! Vi el catálogo y quiero consultar por una remera.'
  )}`

  if (!WHATSAPP_NUMBER) return null

  return (
    <section aria-label="Envíos y medios de pago" className="mt-10">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            Medios de pago
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            <li className="flex gap-2">
              <span className="text-neutral-400">•</span>
              <span>Transferencia bancaria</span>
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-400">•</span>
              <span>Seña y saldo al recibir</span>
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-400">•</span>
              <span>Efectivo (según zona de entrega)</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            Envíos y entrega
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            <li className="flex gap-2">
              <span className="text-neutral-400">•</span>
              <span>Retiro en mano sin costo</span>
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-400">•</span>
              <span>Envío a todo el país</span>
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-400">•</span>
              <span>Coordinamos día y hora por WhatsApp</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-2xl bg-emerald-600 p-5 text-white sm:flex-row">
        <div>
          <p className="font-medium">¿Te gustó alguna remera?</p>
          <p className="text-sm text-emerald-100">Escribinos ahora y respondemos al toque.</p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-white px-5 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </section>
  )
}