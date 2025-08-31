import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

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

    // Get the original invoice
    const { data: originalInvoice, error: fetchError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', resolvedParams.id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !originalInvoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Generate new invoice number
    const { data: lastInvoice } = await supabase
      .from('invoices')
      .select('number')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    let newNumber = 'INV-001'
    if (lastInvoice?.number) {
      const match = lastInvoice.number.match(/INV-(\d+)/)
      if (match) {
        const nextNum = parseInt(match[1]) + 1
        newNumber = `INV-${nextNum.toString().padStart(3, '0')}`
      }
    }

    // Create duplicate invoice
    const duplicateData = {
      user_id: user.id,
      number: newNumber,
      client_name: originalInvoice.client_name,
      client_email: originalInvoice.client_email,
      client_address: originalInvoice.client_address,
      issue_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      line_items: originalInvoice.line_items,
      subtotal: originalInvoice.subtotal,
      tax: originalInvoice.tax,
      total: originalInvoice.total,
      currency: originalInvoice.currency,
      status: 'draft',
      notes: originalInvoice.notes,
      terms: originalInvoice.terms
    }

    const { data: newInvoice, error: createError } = await supabase
      .from('invoices')
      .insert(duplicateData)
      .select()
      .single()

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    return NextResponse.json(newInvoice)
  } catch (error) {
    console.error('Error duplicating invoice:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
