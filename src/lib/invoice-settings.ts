'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { getUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function getInvoiceSettings() {
  const user = await getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const supabase = await createServerSupabaseClient()
  const { data: settings, error } = await supabase
    .from('invoice_settings')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!settings) {
    const { data: inserted, error: insertError } = await supabase
      .from('invoice_settings')
      .insert({ user_id: user.id })
      .select('*')
      .single()
    if (insertError) throw new Error(insertError.message)
    return inserted
  }

  return settings
}

export async function updateInvoiceSettings(formData: FormData) {
  const user = await getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const supabase = await createServerSupabaseClient()

  const { error } = await supabase
    .from('invoice_settings')
    .update({
      invoice_prefix: formData.get('invoice_prefix') as string,
      default_currency: formData.get('default_currency') as string,
      default_tax_rate: parseFloat(formData.get('default_tax_rate') as string) || 0,
      company_name: formData.get('company_name') as string,
      company_address: formData.get('company_address') as string,
      company_email: formData.get('company_email') as string,
      company_phone: formData.get('company_phone') as string,
      company_website: formData.get('company_website') as string,
      footer_text: formData.get('footer_text') as string,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/app/settings')
}

export async function generateInvoiceNumber(): Promise<string> {
  const user = await getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const supabase = await createServerSupabaseClient()

  // Get current settings and increment next_number
  const { data: settings, error: fetchError } = await supabase
    .from('invoice_settings')
    .select('invoice_prefix, next_number')
    .eq('user_id', user.id)
    .single()

  if (fetchError) {
    throw new Error(fetchError.message)
  }

  const invoiceNumber = `${settings.invoice_prefix}-${settings.next_number.toString().padStart(4, '0')}`

  // Increment the next_number
  const { error: updateError } = await supabase
    .from('invoice_settings')
    .update({
      next_number: settings.next_number + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)

  if (updateError) {
    throw new Error(updateError.message)
  }

  return invoiceNumber
}
