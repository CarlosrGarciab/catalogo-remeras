import { redirect } from 'next/navigation'
import { createClient } from './supabase/server'

export const ADMIN_EMAILS = [
  'carlosgarciaballadares@gmail.com',
  'll0260779@gmail.com',
]

export async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const email = user?.email?.toLowerCase()
  if (!email || !ADMIN_EMAILS.includes(email)) {
    redirect('/login')
  }
}