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
      .from('notification_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Map database fields to frontend expected fields
    const mappedSettings = settings ? {
      id: settings.id,
      email_notifications: true, // Always true for now
      invoice_sent: settings.email_invoice_sent || true,
      payment_received: settings.email_payment_received || true,
      overdue_reminders: true, // Default since column doesn't exist yet
      weekly_reports: settings.email_weekly_summary || false,
      marketing_emails: settings.push_notifications || false
    } : {
      id: user.id,
      email_notifications: true,
      invoice_sent: true,
      payment_received: true,
      overdue_reminders: true,
      weekly_reports: false,
      marketing_emails: false
    }

    return NextResponse.json(mappedSettings)
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
    console.log('Received notification settings update:', body)
    
    // Map frontend fields to database fields
    const updates = {
      user_id: user.id,
      email_invoice_sent: body.invoice_sent !== undefined ? body.invoice_sent : true,
      email_payment_received: body.payment_received !== undefined ? body.payment_received : true,
      email_invoice_overdue: body.overdue_reminders !== undefined ? body.overdue_reminders : true,
      email_weekly_summary: body.weekly_reports !== undefined ? body.weekly_reports : false,
      push_notifications: body.marketing_emails !== undefined ? body.marketing_emails : false,
    }

    console.log('Mapped updates:', updates)

    const { data, error } = await supabase
      .from('notification_settings')
      .upsert(updates)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Return mapped response
    const response = {
      id: data.id,
      email_notifications: true,
      invoice_sent: data.email_invoice_sent,
      payment_received: data.email_payment_received,
      overdue_reminders: data.email_invoice_overdue || true,
      weekly_reports: data.email_weekly_summary,
      marketing_emails: data.push_notifications
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
