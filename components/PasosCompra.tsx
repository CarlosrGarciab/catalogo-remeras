export function PasosCompra() {
  const pasos = [
    {
      titulo: 'Elegí tu remera y tu talle',
      detalle: 'Mirá las fotos del catálogo, seleccioná el talle y toca "Pedir por WhatsApp".',
    },
    {
      titulo: 'Escribinos por WhatsApp',
      detalle: 'Te llega el mensaje armado con tu pedido y coordinamos todo por chat.',
    },
    {
      titulo: 'Pagá y recibí tu remera',
      detalle: 'Podés abonar completo o dejar una seña. Coordinamos la entrega y listo.',
    },
  ]

  return (
    <section
      aria-label="Cómo comprar"
      className="mb-8 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 sm:p-5"
    >
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
        Cómo comprar
      </h2>
      <ol className="grid gap-4 sm:grid-cols-3">
        {pasos.map((paso, i) => (
          <li key={paso.titulo} className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900">
              {i + 1}
            </span>
            <div>
              <p className="font-medium text-neutral-900 dark:text-white">{paso.titulo}</p>
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{paso.detalle}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}