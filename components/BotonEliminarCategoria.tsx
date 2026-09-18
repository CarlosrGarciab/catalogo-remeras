'use client'

import { deleteCategoria } from '@/app/admin/categorias/actions'

export default function BotonEliminarCategoria({
  id,
  slug,
  etiqueta,
}: {
  id: string
  slug: string
  etiqueta: string
}) {
  return (
    <form
      action={deleteCategoria}
      onSubmit={(e) => {
        const confirmado = window.confirm(
          `¿Seguro que querés eliminar la categoría "${etiqueta}"? Este cambio no se puede deshacer.`
        )
        if (!confirmado) e.preventDefault()
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="slug" value={slug} />
      <button className="text-sm text-red-500 hover:text-red-400">Eliminar</button>
    </form>
  )
}