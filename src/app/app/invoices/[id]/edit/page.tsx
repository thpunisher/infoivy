import { notFound } from 'next/navigation'
import { getInvoice } from '@/lib/invoices'
import { getClients } from '@/lib/clients'
import { InvoiceForm } from '@/components/invoice-form'

interface EditInvoicePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditInvoicePage({ params }: EditInvoicePageProps) {
  try {
    const resolvedParams = await params
    // Fetch invoice data
    const invoice = await getInvoice(resolvedParams.id)
    if (!invoice) {
      notFound()
    }

    // Fetch clients for the dropdown
    const clients = await getClients()

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Invoice</h1>
            <p className="text-gray-600">Update invoice details for {invoice.number}</p>
          </div>
        </div>

        {/* Invoice Form */}
        <div className="max-w-4xl">
          <InvoiceForm
            mode="edit"
            invoiceId={resolvedParams.id}
            initialData={invoice}
            clients={clients}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading invoice for edit:', error)
    notFound()
  }
}
