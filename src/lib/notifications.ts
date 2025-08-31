'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  actionUrl?: string
) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        action_url: actionUrl,
        read: false
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating notification:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error creating notification:', error)
    return null
  }
}

export async function notifyInvoiceSent(userId: string, invoiceNumber: string, clientEmail: string) {
  return createNotification(
    userId,
    'Invoice Sent',
    `Invoice ${invoiceNumber} has been sent to ${clientEmail}`,
    'success'
  )
}

export async function notifyPaymentReceived(userId: string, invoiceNumber: string, amount: number, currency: string) {
  return createNotification(
    userId,
    'Payment Received',
    `Payment of ${new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)} received for invoice ${invoiceNumber}`,
    'success'
  )
}

export async function notifyInvoiceOverdue(userId: string, invoiceNumber: string, clientName: string) {
  return createNotification(
    userId,
    'Invoice Overdue',
    `Invoice ${invoiceNumber} for ${clientName} is now overdue`,
    'warning'
  )
}

export async function notifyInvoiceCreated(userId: string, invoiceNumber: string) {
  return createNotification(
    userId,
    'Invoice Created',
    `Invoice ${invoiceNumber} has been created successfully`,
    'info'
  )
}
