import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 text-center dark:bg-neutral-950">
      <Image
        src="/logo.png"
        alt="Logo de la tienda"
        width={88}
        height={88}
        className="h-20 w-20 rounded-full object-cover shadow-sm sm:h-24 sm:w-24"
      />
      <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-neutral-400">
        Error 404
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-white sm:text-3xl">
        Esta página no existe
      </h1>
      <p className="mt-3 max-w-md text-sm text-neutral-500 dark:text-neutral-400 sm:text-base">
        El enlace puede estar roto o la página se movió. Volvé al catálogo para seguir mirando
        remeras.
      </p>
      <div className="mt-8 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
        <Link
          href="/catalogo"
          className="w-full rounded-md bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 sm:w-auto"
        >
          Ver el catálogo
        </Link>
        <Link
          href="/"
          className="w-full rounded-md border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white sm:w-auto"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}