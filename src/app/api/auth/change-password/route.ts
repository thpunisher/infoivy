import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { logSecurityEvent, SecurityEvents } from '@/lib/security-audit'

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json()
    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify current password by attempting to sign in
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword
    })

    if (verifyError) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    // Log security event
    await logSecurityEvent(user.id, {
      action: SecurityEvents.PASSWORD_CHANGE,
      details: { timestamp: new Date().toISOString() },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined
    })

    return NextResponse.json({ success: true, message: 'Password updated successfully' })
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
