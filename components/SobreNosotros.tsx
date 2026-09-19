export function SobreNosotros() {
  const items = [
    {
      titulo: 'Calidad Tailandesa',
      texto:
        'Remeras de fútbol importadas directamente de Tailandia, reconocidas por la muy buena calidad de la tela y el estampado.',
    },
    {
      titulo: 'Tela Dry Fit',
      texto:
        'Liviana, transpirable y de secado rápido. Fresca para el día a día, en la oficina o en la cancha.',
    },
    {
      titulo: 'Talles P a XXL',
      texto: 'Un talle para cada persona. Tenés disponibilidad real de P a XXL sin sorpresas al recibir.',
    },
    {
      titulo: 'Atención de 8 a 18 h',
      texto:
        'Te respondemos por WhatsApp para ayudarte con tu pedido, los precios y la coordinación de la entrega.',
    },
  ]

  return (
    <section className="mt-16 border-t border-neutral-200 pt-10 dark:border-neutral-800">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">Sobre nosotros</h2>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
          Valheim Remeras · Reforzamos tu equipo con remeras de fútbol de calidad Tailandesa y tela
          Dry Fit.
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