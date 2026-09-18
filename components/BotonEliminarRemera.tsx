'use client'

import { deleteRemera } from '@/app/admin/actions'

export default function BotonEliminarRemera({ id, nombre }: { id: string; nombre: string }) {
  return (
    <form
      action={deleteRemera}
      onSubmit={(e) => {
        const confirmado = window.confirm(
          `¿Seguro que querés eliminar la remera "${nombre}"? Este cambio no se puede deshacer.`
        )
        if (!confirmado) e.preventDefault()
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="text-sm text-red-500 hover:text-red-400">Eliminar</button>
    </form>
  )
}