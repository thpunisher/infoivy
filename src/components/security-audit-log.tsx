'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Shield, Monitor, Smartphone, Key, User, AlertTriangle, Download } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface SecurityAuditLogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface AuditLogEntry {
  id: string
  action: string
  details: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
}

const getActionIcon = (action: string) => {
  switch (action) {
    case 'login':
      return <User className="h-4 w-4 text-green-600" />
    case 'logout':
      return <User className="h-4 w-4 text-gray-600" />
    case 'password_change':
      return <Key className="h-4 w-4 text-blue-600" />
    case '2fa_enable':
    case '2fa_disable':
      return <Shield className="h-4 w-4 text-purple-600" />
    case 'failed_login':
      return <AlertTriangle className="h-4 w-4 text-red-600" />
    default:
      return <Monitor className="h-4 w-4 text-gray-600" />
  }
}

const getActionLabel = (action: string) => {
  switch (action) {
    case 'login':
      return 'Successful Login'
    case 'logout':
      return 'Logout'
    case 'password_change':
      return 'Password Changed'
    case '2fa_enable':
      return '2FA Enabled'
    case '2fa_disable':
      return '2FA Disabled'
    case 'failed_login':
      return 'Failed Login Attempt'
    case 'profile_update':
      return 'Profile Updated'
    case 'email_change':
      return 'Email Changed'
    case 'password_reset':
      return 'Password Reset'
    default:
      return action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }
}

const getActionVariant = (action: string) => {
  switch (action) {
    case 'login':
      return 'default'
    case 'logout':
      return 'secondary'
    case 'password_change':
    case '2fa_enable':
      return 'default'
    case '2fa_disable':
      return 'secondary'
    case 'failed_login':
      return 'destructive'
    default:
      return 'outline'
  }
}

export function SecurityAuditLog({ open, onOpenChange }: SecurityAuditLogProps) {
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetchAuditLog()
    }
  }, [open])

  const fetchAuditLog = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/settings/security-audit')
      if (response.ok) {
        const data = await response.json()
        setAuditLog(data)
      }
    } catch (error) {
      console.error('Error fetching audit log:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportAuditLog = async () => {
    try {
      const response = await fetch('/api/settings/security-audit?export=true')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `security-audit-log-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error exporting audit log:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Audit Log
          </DialogTitle>
          <DialogDescription>
            View recent security-related activities on your account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing recent security events for your account
            </p>
            <Button variant="outline" size="sm" onClick={exportAuditLog}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <ScrollArea className="h-96">
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-100 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : auditLog.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No security events found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {auditLog.map((entry) => (
                  <Card key={entry.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getActionIcon(entry.action)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-sm">
                              {getActionLabel(entry.action)}
                            </h4>
                            <Badge variant={getActionVariant(entry.action) as any} className="text-xs">
                              {entry.action}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                          </p>
                          {entry.ip_address && (
                            <p className="text-xs text-gray-400 mt-1">
                              IP: {entry.ip_address}
                            </p>
                          )}
                          {entry.details && Object.keys(entry.details).length > 0 && (
                            <div className="mt-2 text-xs">
                              <details className="text-gray-600">
                                <summary className="cursor-pointer hover:text-gray-800">
                                  View details
                                </summary>
                                <pre className="mt-1 text-xs bg-gray-50 p-2 rounded overflow-auto">
                                  {JSON.stringify(entry.details, null, 2)}
                                </pre>
                              </details>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
