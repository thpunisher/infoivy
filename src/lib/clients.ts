'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { getUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createClient(formData: FormData) {
  const user = await getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const supabase = await createServerSupabaseClient()

  const { error } = await supabase
    .from('clients')
    .insert({
      user_id: user.id,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      company: formData.get('company') as string,
      tax_id: formData.get('tax_id') as string,
      notes: formData.get('notes') as string,
    })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/app/clients')
  redirect('/app/clients')
}

export async function getClients() {
  const user = await getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const supabase = await createServerSupabaseClient()
  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return clients
}

export async function getClient(id: string) {
  const user = await getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const supabase = await createServerSupabaseClient()
  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return client
}

export async function updateClient(id: string, formData: FormData) {
  const user = await getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const supabase = await createServerSupabaseClient()

  const { error } = await supabase
    .from('clients')
    .update({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      company: formData.get('company') as string,
      tax_id: formData.get('tax_id') as string,
      notes: formData.get('notes') as string,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/app/clients')
  redirect('/app/clients')
}

export async function deleteClient(id: string) {
  const user = await getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/app/clients')
}
