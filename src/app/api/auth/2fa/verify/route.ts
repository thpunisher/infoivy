import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { authenticator } from 'otplib'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'Verification code is required' }, { status: 400 })
    }

    // Get the user's temporary secret
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('two_factor_secret')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.two_factor_secret) {
      return NextResponse.json({ error: 'No 2FA setup found' }, { status: 400 })
    }

    // Verify the code
    const isValid = authenticator.verify({
      token: code,
      secret: profile.two_factor_secret
    })

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
    }

    // Generate backup codes
    const backupCodes = Array.from({ length: 8 }, () => 
      randomBytes(4).toString('hex').toUpperCase()
    )

    // Enable 2FA and save backup codes
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        two_factor_enabled: true,
        two_factor_backup_codes: backupCodes
      })
      .eq('id', user.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      backup_codes: backupCodes
    })
  } catch (error) {
    console.error('Error verifying 2FA:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
