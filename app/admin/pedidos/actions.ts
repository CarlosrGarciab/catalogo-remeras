'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ItemPedido, PagoPedido } from '@/types/pedido'

const PAGOS_VALIDOS: PagoPedido[] = ['pendiente', 'senia', 'pagado']

function leerPago(raw: FormDataEntryValue | null): PagoPedido {
  const valor = typeof raw === 'string' ? raw : 'pendiente'
  return PAGOS_VALIDOS.includes(valor as PagoPedido) ? (valor as PagoPedido) : 'pendiente'
}

function leerItems(raw: FormDataEntryValue | null): ItemPedido[] {
  if (typeof raw !== 'string' || raw.trim() === '') return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) &&
          typeof item === 'object' &&
          typeof (item as Record<string, unknown>).nombre === 'string' &&
          ((item as Record<string, unknown>).nombre as string).trim() !== ''
      )
      .map((item) => ({
        remera_id:
          typeof item.remera_id === 'string' && item.remera_id.trim() !== ''
            ? item.remera_id.trim()
            : null,
        nombre: (item.nombre as string).trim(),
        talla: typeof item.talla === 'string' ? item.talla.trim() : '',
      }))
  } catch {
    return []
  }
}

async function resolverItems(
  supabase: Awaited<ReturnType<typeof createClient>>,
  items: ItemPedido[]
) {
  const sinNombre = items.filter((item) => item.remera_id && !item.nombre)
  if (sinNombre.length === 0) return items

  const ids = sinNombre.map((item) => item.remera_id!)
  const { data } = await supabase.from('remeras').select('id, nombre').in('id', ids)
  const nombrePorId = new Map((data ?? []).map((r) => [r.id, r.nombre]))
  return items.map((item) =>
    item.remera_id && !item.nombre
      ? { ...item, nombre: nombrePorId.get(item.remera_id) ?? '' }
      : item
  )
}

export async function crearPedido(formData: FormData) {
  const supabase = await createClient()
  const items = await resolverItems(supabase, leerItems(formData.get('items_json')))

  const { error } = await supabase.from('pedidos').insert({
    cliente: ((formData.get('cliente') as string) ?? '').trim(),
    telefono: ((formData.get('telefono') as string) ?? '').trim(),
    info_extra: ((formData.get('info_extra') as string) ?? '').trim(),
    items,
    pago: leerPago(formData.get('pago')),
    monto_pagado: Math.max(0, Number(formData.get('monto_pagado')) || 0),
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
  const items = await resolverItems(supabase, leerItems(formData.get('items_json')))

  const { error } = await supabase
    .from('pedidos')
    .update({
      cliente: ((formData.get('cliente') as string) ?? '').trim(),
      telefono: ((formData.get('telefono') as string) ?? '').trim(),
      info_extra: ((formData.get('info_extra') as string) ?? '').trim(),
      items,
      pago: leerPago(formData.get('pago')),
      monto_pagado: Math.max(0, Number(formData.get('monto_pagado')) || 0),
    })
    .eq('id', id)

  if (error) {
    redirect('/admin/pedidos/' + id + '/editar?error=' + encodeURIComponent(error.message))
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