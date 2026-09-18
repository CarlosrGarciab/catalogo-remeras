export type PagoPedido = 'pendiente' | 'senia' | 'pagado'

export type Pedido = {
  id: string
  cliente: string
  telefono: string
  info_extra: string
  remera_id: string | null
  remera_nombre: string
  talla: string
  pago: PagoPedido
  monto_pagado: number
  entregado: boolean
  entregado_en: string | null
  created_at: string
}

export const ETIQUETAS_PAGO: Record<PagoPedido, string> = {
  pendiente: 'Sin pago',
  senia: 'Seña',
  pagado: 'Pagado',
}