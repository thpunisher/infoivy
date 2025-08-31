import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { ClientForm } from '@/components/client-form'

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/app/clients">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Clients
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">New Client</h1>
            <p className="text-gray-600">Add a new client to your database</p>
          </div>
        </div>
      </div>

      {/* Client Form */}
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
          <CardDescription>
            Fill in the details below to add a new client
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientForm />
        </CardContent>
      </Card>
    </div>
  )
}
