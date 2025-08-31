import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Generate a secret for the user
    const secret = authenticator.generateSecret()
    
    // Create the service name and account name for the QR code
    const serviceName = 'Invofy'
    const accountName = user.email || `user-${user.id}`
    
    // Generate the otpauth URL
    const otpauthUrl = authenticator.keyuri(accountName, serviceName, secret)
    
    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl)
    
    // Store the secret temporarily (not yet enabled)
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        two_factor_secret: secret,
        two_factor_enabled: false 
      })
      .eq('id', user.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      qr_code: qrCodeDataUrl,
      secret: secret
    })
  } catch (error) {
    console.error('Error setting up 2FA:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
