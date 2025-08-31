'use client'

import { useState } from 'react'
import { createCheckoutSession, createCustomerPortalSession } from '@/lib/stripe-actions'
import { Button } from '@/components/ui/button'
import { CreditCard, Settings } from 'lucide-react'

export function BillingActions() {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async () => {
    setIsLoading(true)
    try {
      await createCheckoutSession()
    } catch (error) {
      console.error('Failed to create checkout session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManageBilling = async () => {
    setIsLoading(true)
    try {
      await createCustomerPortalSession()
    } catch (error) {
      console.error('Failed to create customer portal session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={handleUpgrade} disabled={isLoading} className="w-full">
        <CreditCard className="mr-2 h-4 w-4" />
        {isLoading ? 'Processing...' : 'Upgrade to Pro'}
      </Button>
      
      <Button
        variant="outline"
        onClick={handleManageBilling}
        disabled={isLoading}
        className="w-full"
      >
        <Settings className="mr-2 h-4 w-4" />
        Manage Billing
      </Button>
    </div>
  )
}
