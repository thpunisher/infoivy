import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: settings, error } = await supabase
      .from('invoice_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(settings || {
      id: user.id,
      invoice_prefix: 'INV',
      next_number: 1,
      default_currency: 'USD',
      default_tax_rate: 0,
      payment_terms: 30,
      late_fee_percentage: 0,
      auto_send_reminders: false,
      terms: 'Thank you for your business!',
      footer_text: 'Thank you for your business!'
    })
  } catch (error) {
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
    const updates = {
      user_id: user.id,
      invoice_prefix: body.invoice_prefix || 'INV',
      default_currency: body.default_currency || 'USD',
      payment_terms: body.payment_terms || 30,
      late_fee_percentage: body.late_fee_percentage || 0,
      auto_send_reminders: body.auto_send_reminders || false,
      footer_text: body.footer_text || 'Thank you for your business!',
    }

    const { data, error } = await supabase
      .from('invoice_settings')
      .upsert(updates)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
