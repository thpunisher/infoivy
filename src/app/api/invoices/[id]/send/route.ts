import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notifyInvoiceSent } from '@/lib/notifications'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the invoice
    const { data: invoice, error: fetchError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', resolvedParams.id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Update invoice status to 'sent' and set sent_at timestamp
    const { data: updatedInvoice, error: updateError } = await supabase
      .from('invoices')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', resolvedParams.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // In a real app, you would send the email here
    // For now, we'll just simulate the email sending
    console.log(`Sending invoice ${invoice.number} to ${invoice.client_email}`)

    // Create notification for invoice sent
    await notifyInvoiceSent(user.id, invoice.number, invoice.client_email)

    return NextResponse.json({ 
      success: true, 
      message: 'Invoice sent successfully',
      invoice: updatedInvoice
    })
  } catch (error) {
    console.error('Error sending invoice:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
