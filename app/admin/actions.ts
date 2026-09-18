'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Tallas } from '@/types/remera'

const BUCKET = 'remeras-fotos'

function leerTallas(formData: FormData): Tallas {
  return {
    S: formData.get('talla_s') === 'on',
    M: formData.get('talla_m') === 'on',
    L: formData.get('talla_l') === 'on',
    XL: formData.get('talla_xl') === 'on',
  }
}

async function subirImagenes(
  supabase: Awaited<ReturnType<typeof createClient>>,
  remeraId: string,
  archivos: File[]
) {
  const urls: string[] = []

  for (const archivo of archivos) {
    if (!archivo || archivo.size === 0) continue

    const extension = archivo.name.split('.').pop() || 'jpg'
    const ruta = `${remeraId}/${crypto.randomUUID()}.${extension}`

    const { error } = await supabase.storage.from(BUCKET).upload(ruta, archivo, {
      contentType: archivo.type,
      upsert: false,
    })

    if (!error) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(ruta)
      urls.push(data.publicUrl)
    }
  }

  return urls
}

export async function addRemera(formData: FormData) {
  const supabase = await createClient()

  const nombre = formData.get('nombre') as string
  const descripcion = (formData.get('descripcion') as string) || null
  const precio = Number(formData.get('precio'))
  const categoria = formData.get('categoria') as string
  const tallas = leerTallas(formData)

  const { data: remera, error } = await supabase
    .from('remeras')
    .insert({ nombre, descripcion, precio, categoria, tallas })
    .select()
    .single()

  if (error || !remera) {
    redirect(
      '/admin/nueva?error=' + encodeURIComponent(error?.message ?? 'No se pudo crear la remera')
    )
  }

  const archivos = formData.getAll('imagenes') as File[]
  const urls = await subirImagenes(supabase, remera.id, archivos)

  if (urls.length > 0) {
    await supabase.from('remeras').update({ imagenes: urls }).eq('id', remera.id)
  }

  revalidatePath('/admin')
  revalidatePath('/')
  redirect('/admin')
}

export async function updateRemera(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const nombre = formData.get('nombre') as string
  const descripcion = (formData.get('descripcion') as string) || null
  const precio = Number(formData.get('precio'))
  const categoria = formData.get('categoria') as string
  const tallas = leerTallas(formData)

  const { data: actual } = await supabase.from('remeras').select('imagenes').eq('id', id).single()
  let imagenes: string[] = actual?.imagenes ?? []

  const aEliminar = formData.getAll('eliminar_imagen') as string[]
  if (aEliminar.length > 0) {
    imagenes = imagenes.filter((url) => !aEliminar.includes(url))
    const rutas = aEliminar
      .map((url) => url.split(`/${BUCKET}/`)[1])
      .filter((r): r is string => Boolean(r))
    if (rutas.length > 0) {
      await supabase.storage.from(BUCKET).remove(rutas)
    }
  }

  const archivosNuevos = formData.getAll('imagenes_nuevas') as File[]
  const nuevasUrls = await subirImagenes(supabase, id, archivosNuevos)
  imagenes = [...imagenes, ...nuevasUrls]

  await supabase
    .from('remeras')
    .update({ nombre, descripcion, precio, categoria, tallas, imagenes })
    .eq('id', id)

  revalidatePath('/admin')
  revalidatePath('/')
  redirect('/admin')
}

export async function deleteRemera(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  const { data: archivos } = await supabase.storage.from(BUCKET).list(id)
  if (archivos && archivos.length > 0) {
    await supabase.storage.from(BUCKET).remove(archivos.map((a) => `${id}/${a.name}`))
  }

  await supabase.from('remeras').delete().eq('id', id)

  revalidatePath('/admin')
  revalidatePath('/')
}

export async function toggleTalla(remeraId: string, talla: keyof Tallas, disponibleActual: boolean) {
  const supabase = await createClient()

  const { data: remera } = await supabase.from('remeras').select('tallas').eq('id', remeraId).single()
  const tallas = { ...(remera?.tallas as Tallas), [talla]: !disponibleActual }

  await supabase.from('remeras').update({ tallas }).eq('id', remeraId)

  revalidatePath('/admin')
  revalidatePath('/')
}
