export function SobreNosotros() {
  const items = [
    {
      titulo: 'Calidad premium Tailandesa',
      texto:
        'Remeras importadas de Tailandia de calidad premium, en talles de P a XXL.',
    },
    {
      titulo: 'Envíos gratis (UNA)',
      texto:
        'Si sos de la UNA, el envío es gratis. Coordinamos la entrega por nuestro chat de WhatsApp.',
    },
  ]

  return (
    <section className="mt-16 border-t border-neutral-200 pt-10 dark:border-neutral-800">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">Sobre nosotros</h2>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
          Remeras de fútbol calidad Tailandesa
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.titulo}
            className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <h3 className="font-medium text-neutral-900 dark:text-white">{item.titulo}</h3>
            <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">{item.texto}</p>
          </div>
        ))}
      </div>
    </section>
  )
}