'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?error=' + encodeURIComponent('Nie udało się zalogować. Sprawdź dane.'))
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (confirmPassword !== null && confirmPassword !== undefined && password !== confirmPassword) {
    redirect('/register?error=' + encodeURIComponent('Hasła nie są identyczne.'))
  }

  const data = {
    email: formData.get('email') as string,
    password,
  }

  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/register?error=' + encodeURIComponent(error.message || 'Nie udało się utworzyć konta.'))
  }

  // If email confirmation is required by Supabase, auto-confirm for immediate onboarding
  if (!authData.session && authData.user) {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { createClient: createAdminClient } = await import('@supabase/supabase-js')
      const adminClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      await adminClient.auth.admin.updateUserById(authData.user.id, { email_confirm: true })
    }
    await supabase.auth.signInWithPassword(data)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
