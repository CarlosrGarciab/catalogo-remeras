import Link from 'next/link'

export default function Header() {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Logo de la tienda"
          className="h-12 w-12 rounded-full object-cover shadow-sm"
        />
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            Catálogo de camisetas
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Réplicas de fútbol — clubes y selecciones
          </p>
        </div>
      </div>
      <Link
        href="/login"
        className="text-sm text-neutral-400 underline underline-offset-4 hover:text-neutral-900 dark:hover:text-white"
      >
        Panel admin
      </Link>
    </header>
  )
}