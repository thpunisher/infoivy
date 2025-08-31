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
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let query = supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Apply status filter
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Apply search filter
    if (search) {
      query = query.or(`number.ilike.%${search}%,client_name.ilike.%${search}%,client_email.ilike.%${search}%`)
    }

    const { data: invoices, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate stats
    const stats = {
      total: invoices?.length || 0,
      draft: invoices?.filter(inv => inv.status === 'draft').length || 0,
      sent: invoices?.filter(inv => inv.status === 'sent').length || 0,
      paid: invoices?.filter(inv => inv.status === 'paid').length || 0,
      overdue: invoices?.filter(inv => inv.status === 'overdue').length || 0,
      total_amount: invoices?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0,
      paid_amount: invoices?.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total || 0), 0) || 0,
      pending_amount: invoices?.filter(inv => ['sent', 'overdue'].includes(inv.status)).reduce((sum, inv) => sum + (inv.total || 0), 0) || 0
    }

    return NextResponse.json({
      invoices: invoices || [],
      stats
    })
  } catch (error) {
    console.error('Error fetching invoices:', error)
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
    
    const { data: invoice, error } = await supabase
      .from('invoices')
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

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
