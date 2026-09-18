import type { Metadata } from 'next'
import { login } from './actions'

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  robots: { index: false, follow: false },
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <form
        action={login}
        className="w-full max-w-sm space-y-4 rounded-xl border border-neutral-800 bg-neutral-900 p-8"
      >
        <div>
          <h1 className="text-xl font-semibold text-white">Panel de administración</h1>
          <p className="text-sm text-neutral-400">Inicia sesión para gestionar el catálogo</p>
        </div>

        {error && (
          <p className="rounded-md bg-red-950 px-3 py-2 text-sm text-red-400">{error}</p>
        )}

        <div className="space-y-1">
          <label className="text-sm text-neutral-300" htmlFor="email">Correo</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-white outline-none focus:border-neutral-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-neutral-300" htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-white outline-none focus:border-neutral-400"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-white py-2 font-medium text-neutral-950 transition hover:bg-neutral-200"
        >
          Ingresar
        </button>
      </form>
    </main>
  )
}
