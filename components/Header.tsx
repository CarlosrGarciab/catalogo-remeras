import Image from 'next/image'

export default function Header() {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Logo de la tienda"
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover shadow-sm"
        />
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            Valheim Réplicas
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Réplicas de fútbol — clubes y selecciones
          </p>
        </div>
      </div>
    </header>
  )
}