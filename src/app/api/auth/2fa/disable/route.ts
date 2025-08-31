import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { authenticator } from 'otplib'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { password, code } = await request.json()

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    // Verify current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: password
    })

    if (signInError) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 400 })
    }

    // Get user's 2FA settings
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('two_factor_secret, two_factor_enabled')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.two_factor_enabled) {
      return NextResponse.json({ error: '2FA is not enabled' }, { status: 400 })
    }

    // Verify 2FA code if provided
    if (code) {
      const isValid = authenticator.verify({
        token: code,
        secret: profile.two_factor_secret
      })

      if (!isValid) {
        return NextResponse.json({ error: 'Invalid 2FA code' }, { status: 400 })
      }
    }

    // Disable 2FA
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        two_factor_enabled: false,
        two_factor_secret: null,
        two_factor_backup_codes: null
      })
      .eq('id', user.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error disabling 2FA:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
