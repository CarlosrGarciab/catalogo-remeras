import { createClient } from './supabase/server'

export type Categoria = {
  id: string
  slug: string
  etiqueta: string
  orden: number
}

export async function obtenerCategorias(): Promise<Categoria[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('categorias').select('*').order('orden', { ascending: true })
  return data ?? []
}

export function slugify(texto: string) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}
