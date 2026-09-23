'use client'

import { deleteCategoria } from '@/app/admin/categorias/actions'
import ConfirmarEliminar from './ConfirmarEliminar'

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
    <ConfirmarEliminar
      action={deleteCategoria}
      id={id}
      campos={{ slug }}
      titulo="Eliminar categoría"
      mensaje={
        <>
          ¿Seguro que querés eliminar la categoría{' '}
          <span className="font-medium text-neutral-900 dark:text-white">“{etiqueta}”</span>? Solo
          se puede si no tiene remeras asociadas.
        </>
      }
    >
      Eliminar
    </ConfirmarEliminar>
  )
}