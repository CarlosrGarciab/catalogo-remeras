import { createClient } from './supabase/server'

export type Categoria = {
  id: string
  slug: string
  etiqueta: string
  orden: number
  activa: boolean
}

export async function obtenerCategorias(opts: { soloActivas?: boolean } = {}): Promise<Categoria[]> {
  const supabase = await createClient()
  let query = supabase.from('categorias').select('*').order('orden', { ascending: true })
  if (opts.soloActivas) query = query.eq('activa', true)
  const { data } = await query
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
