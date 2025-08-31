'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { createAdminSupabaseClient } from '@/lib/supabase'
import { getUser } from '@/lib/auth'
import { InvoiceFormData, LineItem } from '@/lib/database.types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createInvoice(formData: FormData) {
  const user = await getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const supabase = await createServerSupabaseClient()
  const adminSupabase = await createAdminSupabaseClient()

  // Check subscription status and usage limits
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .single()

  const isPro = subscription?.plan === 'pro' && subscription?.status === 'active'
  const currentDate = new Date()
  const periodStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0]
  
  if (!isPro) {
    // For free users, check if they can create more invoices
    const { data: usage } = await supabase
      .from('usage_counters')
      .select('invoices_created')
      .eq('user_id', user.id)
      .eq('period_start', periodStart)
      .single()

    const currentUsage = usage?.invoices_created || 0
    const freeLimit = 10

    if (currentUsage >= freeLimit) {
      return { 
        error: { 
          message: `You've reached your monthly limit of ${freeLimit} invoices. Upgrade to Pro for unlimited invoices.`,
          code: 'FREE_PLAN_LIMIT_REACHED'
        } 
      }
    }
  }

  // Get invoice settings for automatic numbering and currency
  const { data: settings } = await supabase
    .from('invoice_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Generate automatic invoice number
  const { generateInvoiceNumber } = await import('./invoice-settings')
  const invoiceNumber = await generateInvoiceNumber()

  // Parse form data
  const lineItems: LineItem[] = []
  const lineItemCount = parseInt(formData.get('lineItemCount') as string)
  
  for (let i = 0; i < lineItemCount; i++) {
    const description = formData.get(`lineItems[${i}].description`) as string
    const quantity = parseFloat(formData.get(`lineItems[${i}].quantity`) as string)
    const unitPrice = parseFloat(formData.get(`lineItems[${i}].unit_price`) as string)
    
    if (description && quantity && unitPrice) {
      lineItems.push({
        id: crypto.randomUUID(),
        description,
        quantity,
        unit_price: unitPrice,
        amount: quantity * unitPrice,
      })
    }
  }

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0)
  const taxRate = parseFloat(formData.get('tax_rate') as string) || settings?.default_tax_rate || 0
  const tax = subtotal * (taxRate / 100)
  const total = subtotal + tax
  const currency = formData.get('currency') as string || settings?.default_currency || 'USD'

  // Create invoice
  const { data: invoice, error } = await supabase
    .from('invoices')
    .insert({
      user_id: user.id,
      number: invoiceNumber,
      issue_date: formData.get('issue_date') as string,
      client_name: formData.get('client_name') as string,
      client_email: formData.get('client_email') as string,
      line_items: lineItems,
      subtotal,
      tax,
      total,
      currency,
      status: 'draft',
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  // Update usage counter for all plans
  await adminSupabase.rpc('increment_invoice_count', {
    p_user_id: user.id,
    p_period_start: periodStart
  })

  revalidatePath('/app/invoices')
  redirect('/app/invoices')
}

export async function getInvoices() {
  const user = await getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const supabase = await createServerSupabaseClient()
  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return invoices
}

export async function getInvoice(id: string) {
  const user = await getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const supabase = await createServerSupabaseClient()
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return invoice
}

export async function updateInvoice(id: string, formData: FormData) {
  const user = await getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const supabase = await createServerSupabaseClient()

  // Parse form data
  const lineItems: LineItem[] = []
  const lineItemCount = parseInt(formData.get('lineItemCount') as string)
  
  for (let i = 0; i < lineItemCount; i++) {
    const description = formData.get(`lineItems[${i}].description`) as string
    const quantity = parseFloat(formData.get(`lineItems[${i}].quantity`) as string)
    const unitPrice = parseFloat(formData.get(`lineItems[${i}].unit_price`) as string)
    
    if (description && quantity && unitPrice) {
      lineItems.push({
        id: crypto.randomUUID(),
        description,
        quantity,
        unit_price: unitPrice,
        amount: quantity * unitPrice,
      })
    }
  }

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0)
  const taxRate = parseFloat(formData.get('tax_rate') as string) || 0
  const tax = subtotal * (taxRate / 100)
  const total = subtotal + tax

  const { error } = await supabase
    .from('invoices')
    .update({
      number: formData.get('number') as string,
      issue_date: formData.get('issue_date') as string,
      client_name: formData.get('client_name') as string,
      client_email: formData.get('client_email') as string,
      line_items: lineItems.map(({ unit_price, ...item }) => ({
        ...item,
        unit_price: unit_price,
      })),
      subtotal,
      tax,
      total,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/app/invoices')
  redirect('/app/invoices')
}

export async function deleteInvoice(id: string) {
  const user = await getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const supabase = await createServerSupabaseClient()
  const adminSupabase = await createAdminSupabaseClient()
  
  // First get the invoice to check if it was created this month
  const { data: invoice } = await supabase
    .from('invoices')
    .select('created_at')
    .eq('id', id)
    .single()

  if (!invoice) {
    throw new Error('Invoice not found')
  }

  // Delete the invoice
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  // Update usage counter if invoice was created in the current period
  const invoiceDate = new Date(invoice.created_at)
  const currentDate = new Date()
  
  // Only update if invoice was created in the current month
  if (invoiceDate.getFullYear() === currentDate.getFullYear() && 
      invoiceDate.getMonth() === currentDate.getMonth()) {
    
    const periodStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0]
    
    // Decrement the counter, but don't go below 0
    await adminSupabase.rpc('decrement_invoice_count', {
      p_user_id: user.id,
      p_period_start: periodStart
    })
  }

  revalidatePath('/app/invoices')
}

export async function getUsage() {
  const user = await getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const supabase = await createServerSupabaseClient()
  
  // Get user's subscription status
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .single()

  // For pro users, we don't enforce limits but still track usage
  if (subscription?.plan === 'pro' && subscription?.status === 'active') {
    const currentDate = new Date()
    const periodStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0]
    
    const { data: usage } = await supabase
      .from('usage_counters')
      .select('invoices_created')
      .eq('user_id', user.id)
      .eq('period_start', periodStart)
      .single()

    return {
      current: usage?.invoices_created || 0,
      limit: 'unlimited',
      isPro: true
    }
  }

  // For free tier or inactive subscriptions
  const currentDate = new Date()
  const periodStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0]
  const limit = 10 // Free tier limit
  
  const { data: usage } = await supabase
    .from('usage_counters')
    .select('invoices_created')
    .eq('user_id', user.id)
    .eq('period_start', periodStart)
    .single()

  return {
    current: usage?.invoices_created || 0,
    limit,
    isPro: false
  }
}
