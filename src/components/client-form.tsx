'use client'

import { useState } from 'react'
import { createClient } from '@/lib/clients'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function ClientForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    
    try {
      await createClient(formData)
      toast.success('Client created successfully!')
      router.push('/app/clients')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create client')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            name="name"
            placeholder="Client's full name"
            required
          />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            name="company"
            placeholder="Company name"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="client@example.com"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          name="address"
          placeholder="Full address"
          rows={3}
        />
      </div>

      {/* Tax Information */}
      <div>
        <Label htmlFor="tax_id">Tax ID / VAT Number</Label>
        <Input
          id="tax_id"
          name="tax_id"
          placeholder="Tax identification number"
        />
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Additional notes about this client"
          rows={3}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/app/clients')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Client'}
        </Button>
      </div>
    </form>
  )
}
