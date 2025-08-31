import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const days = searchParams.get('days') || '30'
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Calculate date range
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(days))

    let query = supabase
      .from('payments')
      .select(`
        *,
        invoices (
          number,
          clients (
            name
          )
        )
      `)
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    // Apply status filter
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Apply search filter
    if (search) {
      query = query.or(`transaction_id.ilike.%${search}%,invoices.number.ilike.%${search}%`)
    }

    const { data: payments, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Process payments with invoice data
    const processedPayments = payments?.map(payment => ({
      ...payment,
      invoice_number: payment.invoices?.number || 'N/A',
      client_name: payment.invoices?.clients?.name || 'Unknown Client'
    })) || []

    // Calculate stats
    const stats = {
      total_payments: processedPayments.length,
      total_amount: processedPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0),
      pending_amount: processedPayments.filter(p => p.status === 'pending').reduce((sum, payment) => sum + (payment.amount || 0), 0),
      completed_amount: processedPayments.filter(p => p.status === 'completed').reduce((sum, payment) => sum + (payment.amount || 0), 0),
      failed_payments: processedPayments.filter(p => p.status === 'failed').length,
      avg_payment_time: 0 // Calculate based on processing times
    }

    return NextResponse.json({
      payments: processedPayments,
      stats
    })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        ...body,
        user_id: user.id,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(payment)
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
