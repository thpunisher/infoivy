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
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'name'

    let query = supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)

    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`)
    }

    const { data: clients, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get invoice data separately for each client
    const processedClients = await Promise.all(
      (clients || []).map(async (client) => {
        const { data: invoices } = await supabase
          .from('invoices')
          .select('id, total, status')
          .eq('client_id', client.id)
          .eq('user_id', user.id)
        
        const clientInvoices = invoices || []
        const totalRevenue = clientInvoices.reduce((sum: number, inv: any) => sum + (inv.total || 0), 0)
        const paidRevenue = clientInvoices.filter((inv: any) => inv.status === 'paid').reduce((sum: number, inv: any) => sum + (inv.total || 0), 0)
        
        return {
          ...client,
          invoice_count: clientInvoices.length,
          total_revenue: totalRevenue,
          paid_revenue: paidRevenue,
          pending_revenue: totalRevenue - paidRevenue
        }
      })
    )

    // Sort clients
    processedClients.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'company':
          return (a.company || '').localeCompare(b.company || '')
        case 'revenue':
          return b.total_revenue - a.total_revenue
        case 'invoices':
          return b.invoice_count - a.invoice_count
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

    // Calculate stats
    const stats = {
      total_clients: processedClients.length,
      active_clients: processedClients.filter(client => client.invoice_count > 0).length,
      total_revenue: processedClients.reduce((sum, client) => sum + client.total_revenue, 0),
      average_revenue: processedClients.length > 0 ? processedClients.reduce((sum, client) => sum + client.total_revenue, 0) / processedClients.length : 0
    }

    return NextResponse.json({
      clients: processedClients,
      stats
    })
  } catch (error) {
    console.error('Error fetching clients:', error)
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
    
    const { data: client, error } = await supabase
      .from('clients')
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

    return NextResponse.json(client)
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
