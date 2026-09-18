'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { PagoPedido } from '@/types/pedido'

const PAGOS_VALIDOS: PagoPedido[] = ['pendiente', 'senia', 'pagado']

function leerPago(raw: FormDataEntryValue | null): PagoPedido {
  const valor = typeof raw === 'string' ? raw : 'pendiente'
  return PAGOS_VALIDOS.includes(valor as PagoPedido) ? (valor as PagoPedido) : 'pendiente'
}

async function resolverRemera(
  supabase: Awaited<ReturnType<typeof createClient>>,
  remeraId: string | null,
  nombreManual: string
) {
  let nombre = nombreManual
  if (remeraId && !nombre) {
    const { data } = await supabase.from('remeras').select('nombre').eq('id', remeraId).single()
    nombre = data?.nombre ?? ''
  }
  return { remera_id: remeraId, remera_nombre: nombre }
}

export async function crearPedido(formData: FormData) {
  const supabase = await createClient()
  const remeraId = ((formData.get('remera_id') as string) || '').trim() || null
  const remera = await resolverRemera(
    supabase,
    remeraId,
    ((formData.get('remera_nombre') as string) ?? '').trim()
  )

  const { error } = await supabase.from('pedidos').insert({
    cliente: ((formData.get('cliente') as string) ?? '').trim(),
    telefono: ((formData.get('telefono') as string) ?? '').trim(),
    info_extra: ((formData.get('info_extra') as string) ?? '').trim(),
    talla: ((formData.get('talla') as string) ?? '').trim(),
    pago: leerPago(formData.get('pago')),
    monto_pagado: Math.max(0, Number(formData.get('monto_pagado')) || 0),
    ...remera,
  })

  if (error) {
    redirect('/admin/pedidos/nueva?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/admin/pedidos')
  redirect('/admin/pedidos')
}

export async function actualizarPedido(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  const remeraId = ((formData.get('remera_id') as string) || '').trim() || null
  const remera = await resolverRemera(
    supabase,
    remeraId,
    ((formData.get('remera_nombre') as string) ?? '').trim()
  )

  const { error } = await supabase
    .from('pedidos')
    .update({
      cliente: ((formData.get('cliente') as string) ?? '').trim(),
      telefono: ((formData.get('telefono') as string) ?? '').trim(),
      info_extra: ((formData.get('info_extra') as string) ?? '').trim(),
      talla: ((formData.get('talla') as string) ?? '').trim(),
      pago: leerPago(formData.get('pago')),
      monto_pagado: Math.max(0, Number(formData.get('monto_pagado')) || 0),
      ...remera,
    })
    .eq('id', id)

  if (error) {
    redirect(
      '/admin/pedidos/' + id + '/editar?error=' + encodeURIComponent(error.message)
    )
  }

  revalidatePath('/admin/pedidos')
  redirect('/admin/pedidos')
}

export async function alternarEntregado(id: string, entregado: boolean) {
  const supabase = await createClient()
  await supabase
    .from('pedidos')
    .update({
      entregado,
      entregado_en: entregado ? new Date().toISOString() : null,
    })
    .eq('id', id)
  revalidatePath('/admin/pedidos')
}

export async function eliminarPedido(formData: FormData) {
  const supabase = await createClient()
  await supabase.from('pedidos').delete().eq('id', formData.get('id') as string)
  revalidatePath('/admin/pedidos')
}