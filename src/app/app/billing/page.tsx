import { getSubscription } from '@/lib/stripe-actions'
import { getUsage } from '@/lib/invoices'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, CreditCard, Download, Zap } from 'lucide-react'
import { BillingActions } from '@/components/billing-actions'
import Link from 'next/link'

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const subscription = await getSubscription()
  const usage = await getUsage()
  const isPro = subscription?.plan === 'pro' && subscription?.status === 'active'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-600">Manage your subscription and billing information</p>
      </div>

      {/* Success/Error Messages */}
      {resolvedSearchParams.success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">Your subscription has been updated successfully!</p>
        </div>
      )}

      {resolvedSearchParams.canceled && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700">Subscription update was canceled.</p>
        </div>
      )}

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            Your current subscription details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Crown className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {subscription?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                </h3>
                <p className="text-gray-600">
                  {subscription?.plan === 'pro' ? '$5/month' : 'Free forever'}
                </p>
              </div>
            </div>
            <Badge variant={subscription?.plan === 'pro' ? 'default' : 'secondary'}>
              {subscription?.plan === 'pro' ? 'Pro' : 'Free'}
            </Badge>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Usage This Month</h4>
              {isPro ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Zap className="h-3 w-3 mr-1 text-green-600" />
                  Pro Unlimited
                </Badge>
              ) : (
                <Link href="/app/billing/upgrade" className="text-sm text-blue-600 hover:underline">
                  Upgrade to Pro
                </Link>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Invoices Created</span>
              <span className="font-medium">
                {usage.current}
                {!isPro && `/${usage.limit}`}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${isPro ? 'bg-green-500' : 'bg-blue-600'}`}
                style={{
                  width: isPro 
                    ? '100%'
                    : `${Math.min((usage.current / usage.limit) * 100, 100)}%`
                }}
              ></div>
            </div>
            {!isPro && usage.current >= usage.limit && (
              <p className="mt-2 text-sm text-red-600">
                You've reached your monthly limit. Upgrade to Pro to create more invoices.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <span className="text-sm text-gray-600">Status</span>
            <Badge variant="outline">
              {subscription?.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <Card className={subscription?.plan === 'free' ? 'border-blue-500' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Free Plan
              {subscription?.plan === 'free' && (
                <Badge variant="secondary">Current</Badge>
              )}
            </CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
            <div className="text-3xl font-bold">$0</div>
            <CardDescription>Forever free</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>10 invoices per month</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>Basic PDF export</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>Email support</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Check className="h-4 w-4 text-gray-400 mr-2" />
                <span>Watermark on PDFs</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className={subscription?.plan === 'pro' ? 'border-blue-500' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Pro Plan
              {subscription?.plan === 'pro' && (
                <Badge>Current</Badge>
              )}
            </CardTitle>
            <CardDescription>For growing businesses</CardDescription>
            <div className="text-3xl font-bold">$5</div>
            <CardDescription>per month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>Unlimited invoices</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>No watermarks</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>Custom branding</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>Priority support</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>Advanced customization</span>
              </div>
            </div>

            {subscription?.plan !== 'pro' && (
              <BillingActions />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Billing Actions for Pro Users */}
      {subscription?.plan === 'pro' && (
        <Card>
          <CardHeader>
            <CardTitle>Billing Management</CardTitle>
            <CardDescription>
              Manage your subscription and billing information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BillingActions />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
