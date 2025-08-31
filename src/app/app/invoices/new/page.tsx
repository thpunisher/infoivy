import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { InvoiceForm } from '@/components/invoice-form'

export default function NewInvoicePage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-none">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/app/invoices">
              <Button variant="outline" size="sm" className="shrink-0">
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Back to Invoices</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">New Invoice</h1>
              <p className="text-sm sm:text-base text-gray-600">Create a professional invoice for your client</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Form */}
      <div className="flex-1 flex flex-col min-h-0">
        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader className="flex-none">
            <CardTitle>Invoice Details</CardTitle>
            <CardDescription>
              Fill in the details below to create your invoice
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto pb-6">
            <InvoiceForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
