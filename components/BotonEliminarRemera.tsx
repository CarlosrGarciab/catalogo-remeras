'use client'

import { deleteRemera } from '@/app/admin/actions'
import ConfirmarEliminar from './ConfirmarEliminar'

export default function BotonEliminarRemera({ id, nombre }: { id: string; nombre: string }) {
  return (
    <ConfirmarEliminar
      action={deleteRemera}
      id={id}
      titulo="Eliminar remera"
      mensaje={
        <>
          ¿Seguro que querés eliminar{' '}
          <span className="font-medium text-neutral-900 dark:text-white">“{nombre}”</span>? Este
          cambio no se puede deshacer y se borrarán sus fotos.
        </>
      }
    >
      Eliminar
    </ConfirmarEliminar>
  )
}