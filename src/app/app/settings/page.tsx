'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { User, Building2, FileText, Bell, Shield, CreditCard, Upload, Trash2, Key, Download } from 'lucide-react'
import { InvoiceTemplateCustomizer } from '@/components/invoice-template-customizer'
import { PasswordChangeDialog } from '@/components/password-change-dialog'
import { TwoFactorSetup } from '@/components/two-factor-setup'
import { SecurityAuditLog } from '@/components/security-audit-log'
import { toast } from 'sonner'

interface UserProfile {
  id: string
  full_name?: string
  email: string
  phone?: string
  company?: string
  address?: string
  website?: string
  timezone?: string
  currency?: string
  avatar_url?: string
}

interface BusinessInfo {
  id: string
  company_name?: string
  company_address?: string
  company_email?: string
  company_phone?: string
  company_website?: string
  tax_id?: string
  notes?: string
}

interface InvoiceSettings {
  id: string
  invoice_prefix: string
  next_number: number
  default_currency: string
  default_tax_rate: number
  company_name?: string
  company_address?: string
  company_email?: string
  company_phone?: string
  company_website?: string
  logo_url?: string
  terms?: string
  notes?: string
}

interface NotificationSettings {
  id: string
  email_notifications: boolean
  invoice_sent: boolean
  payment_received: boolean
  overdue_reminders: boolean
  weekly_reports: boolean
  marketing_emails: boolean
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [business, setBusiness] = useState<BusinessInfo | null>(null)
  const [invoice, setInvoice] = useState<InvoiceSettings | null>(null)
  const [notifications, setNotifications] = useState<NotificationSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | boolean>(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [auditLogOpen, setAuditLogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      // Batch all API calls for better performance
      const [profileRes, businessRes, settingsRes, notificationsRes, twoFactorRes] = await Promise.all([
        fetch('/api/settings/profile'),
        fetch('/api/settings/business'),
        fetch('/api/settings/invoice'),
        fetch('/api/settings/notifications'),
        fetch('/api/settings/2fa-status')
      ])

      // Process all responses
      const [profileData, businessData, settingsData, notificationsData, twoFactorData] = await Promise.all([
        profileRes.ok ? profileRes.json() : null,
        businessRes.ok ? businessRes.json() : null,
        settingsRes.ok ? settingsRes.json() : null,
        notificationsRes.ok ? notificationsRes.json() : null,
        twoFactorRes.ok ? twoFactorRes.json() : null
      ])

      if (profileData) setProfile(profileData)
      if (businessData) setBusiness(businessData)
      if (settingsData) setInvoice(settingsData)
      if (notificationsData) setNotifications(notificationsData)
      if (twoFactorData) setTwoFactorEnabled(twoFactorData.enabled)

    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const updateNotificationSetting = async (key: string, value: boolean) => {
    const updatedNotifications = { 
      ...notifications,
      [key]: value,
      email_notifications: notifications?.email_notifications || false,
      invoice_sent: notifications?.invoice_sent || false,
      payment_received: notifications?.payment_received || false,
      overdue_reminders: notifications?.overdue_reminders || false,
      weekly_reports: notifications?.weekly_reports || false,
      marketing_emails: notifications?.marketing_emails || false
    } as NotificationSettings
    setNotifications(updatedNotifications)
    
    try {
      const response = await fetch('/api/settings/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNotifications)
      })
      
      if (response.ok) {
        toast.success('Notification setting updated')
      } else {
        toast.error('Failed to update notification setting')
        setNotifications(notifications)
      }
    } catch (error) {
      console.error('Error updating notification:', error)
      toast.error('Failed to update notification setting')
      setNotifications(notifications)
    }
  }

  const saveSettings = async (type: string, data: any) => {
    setSaving(true)
    try {
      const response = await fetch(`/api/settings/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        toast.success(`${type} settings saved successfully`)
      } else {
        toast.error(`Failed to save ${type} settings`)
      }
    } catch (error) {
      console.error(`Error saving ${type} settings:`, error)
      toast.error(`Failed to save ${type} settings`)
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload image')
      }
      
      const { url } = await response.json()
      
      // Update profile with new avatar URL
      await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatar_url: url }),
      })
      
      // Update local state
      setProfile(prev => prev ? { ...prev, avatar_url: url } : null)
      toast.success('Profile photo updated successfully')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemovePhoto = async () => {
    if (!profile?.avatar_url) return
    
    try {
      await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatar_url: null }),
      })
      
      // Update local state
      setProfile(prev => prev ? { ...prev, avatar_url: undefined } : null)
      toast.success('Profile photo removed successfully')
    } catch (error) {
      console.error('Error removing photo:', error)
      toast.error('Failed to remove photo. Please try again.')
    }
  }

  const handleSaveProfile = async (formData: FormData) => {
    setSaving('profile')
    try {
      const response = await fetch('/api/settings/profile', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const updatedProfile = await response.json()
        setProfile(updatedProfile)
        toast.success('Profile updated successfully!')
      } else {
        throw new Error('Failed to save profile')
      }
    } catch (error) {
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveBusiness = async (formData: FormData) => {
    setSaving('business')
    try {
      const response = await fetch('/api/settings/business', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        toast.success('Business information updated successfully!')
      } else {
        throw new Error('Failed to save business info')
      }
    } catch (error) {
      toast.error('Failed to save business information')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveInvoiceSettings = async (formData: FormData) => {
    setSaving('invoice')
    try {
      const response = await fetch('/api/settings/invoice', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const updatedSettings = await response.json()
        setInvoice(updatedSettings)
        toast.success('Invoice settings updated successfully!')
      } else {
        throw new Error('Failed to save invoice settings')
      }
    } catch (error) {
      toast.error('Failed to save invoice settings')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveNotifications = async (formData: FormData) => {
    setSaving('notifications')
    try {
      const response = await fetch('/api/settings/notifications', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const updatedNotifications = await response.json()
        setNotifications(updatedNotifications)
        toast.success('Notification settings updated successfully!')
      } else {
        throw new Error('Failed to save notification settings')
      }
    } catch (error) {
      toast.error('Failed to save notification settings')
    } finally {
      setSaving(false)
    }
  }


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    )
  }

  return (
  <div className="container mx-auto py-4 sm:py-6 px-3 sm:px-4 lg:px-6">
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4 sm:space-y-6"
      >
        <TabsList className="flex w-full overflow-x-auto pb-2">
          <TabsTrigger 
            value="profile" 
            className="flex-shrink-0 flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 px-3 py-2 text-xs sm:text-sm"
          >
            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger 
            value="business" 
            className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 px-2 py-2 text-xs sm:text-sm"
          >
            <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Business</span>
          </TabsTrigger>
          <TabsTrigger 
            value="invoices" 
            className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 px-2 py-2 text-xs sm:text-sm"
          >
            <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Invoices</span>
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 px-2 py-2 text-xs sm:text-sm"
          >
            <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 px-2 py-2 text-xs sm:text-sm"
          >
            <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <Button asChild variant="outline" size="sm" className="cursor-pointer">
                      <div>
                        <Upload className="mr-2 h-4 w-4" />
                        <span>Upload Photo</span>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </div>
                    </Button>
                  </label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600"
                    onClick={handleRemovePhoto}
                    disabled={!profile?.avatar_url}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    placeholder="Your Full Name"
                    defaultValue={profile?.full_name || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    defaultValue={profile?.email || ''}
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    defaultValue={profile?.phone || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue={profile?.timezone || 'UTC'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button type="submit" disabled={saving === 'profile'} onClick={() => saveSettings('profile', profile)}>
                {saving === 'profile' ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Settings */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Business Information</span>
              </CardTitle>
              <CardDescription>
                Update your business details that appear on invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business_name">Business Name</Label>
                  <Input
                    id="business_name"
                    placeholder="Your Business Name"
                    defaultValue={profile?.company || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://yourwebsite.com"
                    defaultValue={profile?.website || ''}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="business_address">Business Address</Label>
                <Textarea
                  id="business_address"
                  placeholder="Enter your complete business address"
                  rows={3}
                  defaultValue={profile?.address || ''}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business_phone">Business Phone</Label>
                  <Input
                    id="business_phone"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="tax_id">Tax ID / VAT Number</Label>
                  <Input
                    id="tax_id"
                    placeholder="123-45-6789"
                  />
                </div>
              </div>
              
              <Button onClick={() => saveSettings('business', business)} disabled={!!saving}>
                {saving ? 'Saving...' : 'Save Business Info'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoice Settings */}
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Invoice Defaults</span>
              </CardTitle>
              <CardDescription>
                Configure default settings for new invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoice_prefix">Invoice Number Prefix</Label>
                  <Input
                    id="invoice_prefix"
                    placeholder="INV"
                    defaultValue={invoice?.invoice_prefix || 'INV'}
                  />
                </div>
                <div>
                  <Label htmlFor="default_currency">Default Currency</Label>
                  <Select defaultValue={invoice?.default_currency || 'USD'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="default_tax_rate">Default Tax Rate (%)</Label>
                  <Input
                    id="default_tax_rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    defaultValue={invoice?.default_tax_rate || 0}
                  />
                </div>
                <div>
                  <Label htmlFor="payment_terms">Payment Terms (days)</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue placeholder="Select terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Due on receipt</SelectItem>
                      <SelectItem value="15">Net 15</SelectItem>
                      <SelectItem value="30">Net 30</SelectItem>
                      <SelectItem value="60">Net 60</SelectItem>
                      <SelectItem value="90">Net 90</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="footer_text">Default Footer Text</Label>
                <Textarea
                  id="footer_text"
                  placeholder="Thank you for your business!"
                  rows={2}
                  defaultValue={invoice?.terms || 'Thank you for your business!'}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto_reminders">Automatic Payment Reminders</Label>
                    <p className="text-sm text-gray-500">Send automatic reminders for overdue invoices</p>
                  </div>
                  <Switch
                    id="auto_reminders"
                    checked={false}
                  />
                </div>
                
                {false && (
                  <div>
                    <Label>Reminder Schedule</Label>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">3 days after due</Badge>
                      <Badge variant="outline">7 days after due</Badge>
                      <Badge variant="outline">14 days after due</Badge>
                    </div>
                  </div>
                )}
              </div>
              
              <Button onClick={() => saveSettings('invoice', invoice)} disabled={!!saving}>
                {saving ? 'Saving...' : 'Save Invoice Settings'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Invoice Templates</span>
              </CardTitle>
              <CardDescription>
                Customize your invoice design and branding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceTemplateCustomizer />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Email Notifications</span>
              </CardTitle>
              <CardDescription>
                Choose which email notifications you'd like to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email_notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive email notifications</p>
                  </div>
                  <Switch
                    id="email_notifications"
                    checked={notifications?.email_notifications || false}
                    onCheckedChange={(checked) => updateNotificationSetting('email_notifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="invoice_sent">Invoice Sent</Label>
                    <p className="text-sm text-gray-500">When an invoice is successfully sent</p>
                  </div>
                  <Switch
                    id="invoice_sent"
                    checked={notifications?.invoice_sent || false}
                    onCheckedChange={(checked) => updateNotificationSetting('invoice_sent', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="payment_received">Payment Received</Label>
                    <p className="text-sm text-gray-500">When a payment is received</p>
                  </div>
                  <Switch
                    id="payment_received"
                    checked={notifications?.payment_received || false}
                    onCheckedChange={(checked) => updateNotificationSetting('payment_received', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="overdue_reminders">Overdue Reminders</Label>
                    <p className="text-sm text-gray-500">Daily digest of overdue invoices</p>
                  </div>
                  <Switch
                    id="overdue_reminders"
                    checked={notifications?.overdue_reminders || false}
                    onCheckedChange={(checked) => updateNotificationSetting('overdue_reminders', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly_reports">Weekly Reports</Label>
                    <p className="text-sm text-gray-500">Weekly summary of your business activity</p>
                  </div>
                  <Switch
                    id="weekly_reports"
                    checked={notifications?.weekly_reports || false}
                    onCheckedChange={(checked) => updateNotificationSetting('weekly_reports', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing_emails">Marketing Updates</Label>
                    <p className="text-sm text-gray-500">Product updates and tips</p>
                  </div>
                  <Switch
                    id="marketing_emails"
                    checked={notifications?.marketing_emails || false}
                    onCheckedChange={(checked) => updateNotificationSetting('marketing_emails', checked)}
                  />
                </div>
              </div>
              
              <Button onClick={() => saveSettings('notifications', notifications)} disabled={!!saving}>
                {saving ? 'Saving...' : 'Save Notification Preferences'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Account Security</span>
              </CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Password</Label>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPasswordDialogOpen(true)}
                    >
                      <Key className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      {twoFactorEnabled && <Badge variant="secondary" className="mt-1">Enabled</Badge>}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setTwoFactorDialogOpen(true)}
                    >
                      {twoFactorEnabled ? 'Manage 2FA' : 'Enable 2FA'}
                    </Button>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Security Audit Log</Label>
                      <p className="text-sm text-gray-500">View recent security activities on your account</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setAuditLogOpen(true)}
                    >
                      View Log
                    </Button>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data Export</Label>
                      <p className="text-sm text-gray-500">Download a copy of your data</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Password Change Dialog */}
      <PasswordChangeDialog 
        open={passwordDialogOpen} 
        onOpenChange={setPasswordDialogOpen} 
      />

      {/* Two-Factor Authentication Setup */}
      <TwoFactorSetup 
        open={twoFactorDialogOpen} 
        onOpenChange={setTwoFactorDialogOpen} 
      />

      {/* Security Audit Log */}
      <SecurityAuditLog 
        open={auditLogOpen} 
        onOpenChange={setAuditLogOpen} 
      />
    </div>
  )
}
