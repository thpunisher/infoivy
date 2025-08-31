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
    const isExport = searchParams.get('export') === 'true'

    const { data: auditLog, error } = await supabase
      .from('security_audit_log')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (isExport) {
      // Generate CSV export
      const csvHeaders = 'Date,Action,IP Address,User Agent,Details\n'
      const csvRows = auditLog.map(entry => {
        const date = new Date(entry.created_at).toISOString()
        const details = JSON.stringify(entry.details || {}).replace(/"/g, '""')
        return `"${date}","${entry.action}","${entry.ip_address || ''}","${entry.user_agent || ''}","${details}"`
      }).join('\n')
      
      const csv = csvHeaders + csvRows
      
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="security-audit-log-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    return NextResponse.json(auditLog)
  } catch (error) {
    console.error('Error fetching security audit log:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
