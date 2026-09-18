export type Tallas = {
  P: boolean
  M: boolean
  G: boolean
  XL: boolean
  XXL: boolean
}

export type Remera = {
  id: string
  nombre: string
  descripcion: string | null
  precio: number
  categoria: string
  imagenes: string[] | null
  tallas: Tallas
  activa: boolean
  created_at: string
}
