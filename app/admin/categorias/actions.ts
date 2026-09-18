'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/categorias'

export async function addCategoria(formData: FormData) {
  const supabase = await createClient()
  const etiqueta = (formData.get('etiqueta') as string).trim()
  const slug = slugify(etiqueta)

  if (!etiqueta || !slug) {
    redirect('/admin/categorias?error=' + encodeURIComponent('Escribí un nombre válido'))
  }

  const { data: ultima } = await supabase
    .from('categorias')
    .select('orden')
    .order('orden', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { error } = await supabase
    .from('categorias')
    .insert({ slug, etiqueta, orden: (ultima?.orden ?? 0) + 1 })

  if (error) {
    const mensaje =
      error.code === '23505' ? 'Ya existe una categoría con ese nombre' : error.message
    redirect('/admin/categorias?error=' + encodeURIComponent(mensaje))
  }

  revalidatePath('/admin/categorias')
  revalidatePath('/admin')
  revalidatePath('/')
  redirect('/admin/categorias')
}

export async function updateCategoria(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  const etiqueta = (formData.get('etiqueta') as string).trim()

  if (!etiqueta) {
    redirect('/admin/categorias?error=' + encodeURIComponent('Escribí un nombre válido'))
  }

  // Solo se edita el nombre visible (etiqueta). El slug interno no cambia
  // para no romper las remeras ya cargadas en esa categoría.
  const { error } = await supabase.from('categorias').update({ etiqueta }).eq('id', id)

  if (error) {
    redirect('/admin/categorias?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/admin/categorias')
  revalidatePath('/admin')
  revalidatePath('/')
  redirect('/admin/categorias')
}

export async function deleteCategoria(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  const slug = formData.get('slug') as string

  const { count } = await supabase
    .from('remeras')
    .select('id', { count: 'exact', head: true })
    .eq('categoria', slug)

  if (count && count > 0) {
    redirect(
      '/admin/categorias?error=' +
        encodeURIComponent(
          `No se puede eliminar: hay ${count} remera(s) usando esta categoría. Cambiales la categoría o eliminalas primero.`
        )
    )
  }

  const { error } = await supabase.from('categorias').delete().eq('id', id)

  if (error) {
    redirect('/admin/categorias?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/admin/categorias')
  revalidatePath('/admin')
  revalidatePath('/')
  redirect('/admin/categorias')
}

export async function moverCategoria(id: string, direccion: -1 | 1) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categorias')
    .select('id')
    .order('orden', { ascending: true })
  const ids = (data ?? []).map((c) => c.id)
  const idx = ids.indexOf(id)
  const j = idx + direccion
  if (idx === -1 || j < 0 || j >= ids.length) return

  ;[ids[idx], ids[j]] = [ids[j], ids[idx]]

  await Promise.all(
    ids.map((cid, i) => supabase.from('categorias').update({ orden: i + 1 }).eq('id', cid))
  )

  revalidatePath('/admin/categorias')
  revalidatePath('/admin')
  revalidatePath('/')
}

export async function toggleCategoriaActiva(id: string, activaActual: boolean) {
  const supabase = await createClient()
  await supabase.from('categorias').update({ activa: !activaActual }).eq('id', id)
  revalidatePath('/admin/categorias')
  revalidatePath('/admin')
  revalidatePath('/')
}
