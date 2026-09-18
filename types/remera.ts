export type Tallas = {
  S: boolean
  M: boolean
  L: boolean
  XL: boolean
}

export type Remera = {
  id: string
  nombre: string
  descripcion: string | null
  precio: number
  categoria: string
  imagenes: string[] | null
  tallas: Tallas
  created_at: string
}
