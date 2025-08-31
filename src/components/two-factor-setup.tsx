'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { QrCode, Smartphone, Key, Check, Copy, Shield } from 'lucide-react'
import { toast } from 'sonner'

interface TwoFactorSetupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TwoFactorSetup({ open, onOpenChange }: TwoFactorSetupProps) {
  const [step, setStep] = useState(1)
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleSetup = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        const data = await response.json()
        setQrCode(data.qr_code)
        setSecret(data.secret)
        setStep(2)
      } else {
        toast.error('Failed to setup 2FA')
      }
    } catch (error) {
      console.error('Error setting up 2FA:', error)
      toast.error('Failed to setup 2FA')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode })
      })
      
      if (response.ok) {
        const data = await response.json()
        setBackupCodes(data.backup_codes)
        setStep(3)
        toast.success('2FA enabled successfully!')
      } else {
        toast.error('Invalid verification code')
      }
    } catch (error) {
      console.error('Error verifying 2FA:', error)
      toast.error('Failed to verify 2FA code')
    } finally {
      setLoading(false)
    }
  }

  const copySecret = () => {
    navigator.clipboard.writeText(secret)
    toast.success('Secret copied to clipboard')
  }

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'))
    toast.success('Backup codes copied to clipboard')
  }

  const handleComplete = () => {
    setStep(1)
    setVerificationCode('')
    setQrCode('')
    setSecret('')
    setBackupCodes([])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Enable Two-Factor Authentication
          </DialogTitle>
          <DialogDescription>
            Add an extra layer of security to your account
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Step 1: Get Started</CardTitle>
                <CardDescription>
                  Two-factor authentication adds an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Smartphone className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Install an authenticator app</h4>
                    <p className="text-sm text-gray-500">
                      Download Google Authenticator, Authy, or another TOTP app
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <QrCode className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Scan QR code</h4>
                    <p className="text-sm text-gray-500">
                      Use your app to scan the QR code we'll generate
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Key className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Enter verification code</h4>
                    <p className="text-sm text-gray-500">
                      Enter the 6-digit code from your app to verify setup
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button onClick={handleSetup} disabled={loading} className="w-full">
              {loading ? 'Setting up...' : 'Start Setup'}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Step 2: Scan QR Code</CardTitle>
                <CardDescription>
                  Scan this QR code with your authenticator app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    {qrCode ? (
                      <img src={qrCode} alt="2FA QR Code" className="w-full h-full" />
                    ) : (
                      <QrCode className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                </div>
                
                <div>
                  <Label>Manual Entry Key</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input value={secret} readOnly className="font-mono text-xs" />
                    <Button size="sm" variant="outline" onClick={copySecret}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use this key if you can't scan the QR code
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="verification_code">Verification Code</Label>
                  <Input
                    id="verification_code"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    className="text-center font-mono text-lg"
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleVerify} disabled={loading || !verificationCode} className="flex-1">
                {loading ? 'Verifying...' : 'Verify & Enable'}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  2FA Enabled Successfully!
                </CardTitle>
                <CardDescription>
                  Save these backup codes in a secure location
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Backup Codes</Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                      {backupCodes.map((code, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span>{code}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button size="sm" variant="outline" onClick={copyBackupCodes}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy All Codes
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Each backup code can only be used once. Store them securely.
                  </p>
                </div>
                
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> Save these backup codes now. You won't be able to see them again.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Button onClick={handleComplete} className="w-full">
              Complete Setup
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
