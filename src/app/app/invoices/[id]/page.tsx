'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Download, Send, Edit, Trash2, Copy, MoreHorizontal } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface Invoice {
  id: string
  number: string
  issue_date: string
  client_name: string
  client_email: string
  line_items: any[]
  subtotal: number
  tax: number
  total: number
  currency: string
  status: string
  created_at: string
}

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchInvoice(params.id as string)
    }
  }, [params.id])

  const fetchInvoice = async (id: string) => {
    try {
      const response = await fetch(`/api/invoices/${id}`)
      if (response.ok) {
        const data = await response.json()
        setInvoice(data)
      } else {
        console.error('Invoice not found')
        router.push('/app/invoices')
      }
    } catch (error) {
      console.error('Failed to fetch invoice:', error)
      router.push('/app/invoices')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'secondary' as const, color: 'text-gray-600' },
      sent: { variant: 'outline' as const, color: 'text-blue-600' },
      paid: { variant: 'default' as const, color: 'text-green-600' },
      overdue: { variant: 'destructive' as const, color: 'text-red-600' },
      cancelled: { variant: 'secondary' as const, color: 'text-gray-600' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft

    return (
      <Badge variant={config.variant} className={config.color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleDownloadPDF = async () => {
    if (!invoice) return
    
    setActionLoading('download')
    try {
      // First recalculate the invoice to ensure consistency
      await fetch(`/api/invoices/${invoice.id}/recalculate`, { method: 'POST' })
      
      const response = await fetch(`/api/pdf/${invoice.id}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `invoice-${invoice.number}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Failed to download PDF')
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Failed to download PDF')
    } finally {
      setActionLoading(null)
    }
  }

  const handleSendInvoice = async () => {
    if (!invoice) return
    
    setActionLoading('send')
    try {
      const response = await fetch(`/api/invoices/${invoice.id}/send`, {
        method: 'POST'
      })
      if (response.ok) {
        alert('Invoice sent successfully!')
        // Update invoice status to 'sent'
        setInvoice({ ...invoice, status: 'sent' })
      } else {
        alert('Failed to send invoice')
      }
    } catch (error) {
      console.error('Error sending invoice:', error)
      alert('Failed to send invoice')
    } finally {
      setActionLoading(null)
    }
  }

  const handleEditInvoice = () => {
    if (!invoice) return
    router.push(`/app/invoices/${invoice.id}/edit`)
  }

  const handleDuplicateInvoice = async () => {
    if (!invoice) return
    
    setActionLoading('duplicate')
    try {
      const response = await fetch(`/api/invoices/${invoice.id}/duplicate`, {
        method: 'POST'
      })
      if (response.ok) {
        const newInvoice = await response.json()
        router.push(`/app/invoices/${newInvoice.id}`)
      } else {
        alert('Failed to duplicate invoice')
      }
    } catch (error) {
      console.error('Error duplicating invoice:', error)
      alert('Failed to duplicate invoice')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteInvoice = async () => {
    if (!invoice) return
    
    if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      return
    }
    
    setActionLoading('delete')
    try {
      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        router.push('/app/invoices')
      } else {
        alert('Failed to delete invoice')
      }
    } catch (error) {
      console.error('Error deleting invoice:', error)
      alert('Failed to delete invoice')
    } finally {
      setActionLoading(null)
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

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Invoice not found</h2>
        <p className="text-gray-600 mt-2">The invoice you're looking for doesn't exist.</p>
        <Link href="/app/invoices">
          <Button className="mt-4">Back to Invoices</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/app/invoices">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Invoices
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoice {invoice.number}</h1>
            <p className="text-gray-600">Created on {formatDate(invoice.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(invoice.status)}
          <Button 
            variant="outline" 
            onClick={handleDownloadPDF}
            disabled={actionLoading === 'download'}
          >
            <Download className="mr-2 h-4 w-4" />
            {actionLoading === 'download' ? 'Downloading...' : 'Download PDF'}
          </Button>
          <Button 
            onClick={handleSendInvoice}
            disabled={actionLoading === 'send'}
          >
            <Send className="mr-2 h-4 w-4" />
            {actionLoading === 'send' ? 'Sending...' : 'Send Invoice'}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditInvoice}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Invoice
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDuplicateInvoice}
                disabled={actionLoading === 'duplicate'}
              >
                <Copy className="mr-2 h-4 w-4" />
                {actionLoading === 'duplicate' ? 'Duplicating...' : 'Duplicate Invoice'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={handleDeleteInvoice}
                disabled={actionLoading === 'delete'}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {actionLoading === 'delete' ? 'Deleting...' : 'Delete Invoice'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Invoice Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Client Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                <div className="text-gray-600">
                  <p className="font-medium">{invoice.client_name}</p>
                  {invoice.client_email && <p>{invoice.client_email}</p>}
                </div>
              </div>

              <Separator />

              {/* Line Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Items</h3>
                <div className="space-y-3">
                  {invoice.line_items && invoice.line_items.length > 0 ? (
                    invoice.line_items.map((item: any, index: number) => {
                      // Parse numeric values properly
                      const quantity = parseFloat(item.quantity) || 1
                      const rate = parseFloat(item.rate || item.price || item.unit_price) || 0
                      const lineTotal = quantity * rate
                      
                      return (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <div className="flex-1">
                            <p className="font-medium">{item.description || item.name || 'Service'}</p>
                            <p className="text-sm text-gray-500">
                              Qty: {quantity} × {formatCurrency(rate, invoice.currency)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatCurrency(lineTotal, invoice.currency)}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-gray-500 italic">No line items</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                {(() => {
                  // Calculate actual totals from line items
                  const calculatedSubtotal = invoice.line_items?.reduce((sum: number, item: any) => {
                    const quantity = parseFloat(item.quantity) || 1
                    const rate = parseFloat(item.rate || item.price || item.amount) || 0
                    return sum + (quantity * rate)
                  }, 0) || 0
                  
                  const storedTax = parseFloat(invoice.tax) || 0
                  const calculatedTotal = calculatedSubtotal + storedTax
                  
                  return (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>{formatCurrency(calculatedSubtotal, invoice.currency)}</span>
                      </div>
                      {storedTax > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax:</span>
                          <span>{formatCurrency(storedTax, invoice.currency)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total:</span>
                        <span>{formatCurrency(calculatedTotal, invoice.currency)}</span>
                      </div>
                    </>
                  )
                })()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Invoice Number</label>
                <p className="font-mono">{invoice.number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Issue Date</label>
                <p>{formatDate(invoice.issue_date)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">
                  {getStatusBadge(invoice.status)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Currency</label>
                <p>{invoice.currency}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleEditInvoice}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Invoice
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleDuplicateInvoice}
                disabled={actionLoading === 'duplicate'}
              >
                <Copy className="mr-2 h-4 w-4" />
                {actionLoading === 'duplicate' ? 'Duplicating...' : 'Duplicate'}
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleSendInvoice}
                disabled={actionLoading === 'send'}
              >
                <Send className="mr-2 h-4 w-4" />
                {actionLoading === 'send' ? 'Sending...' : 'Send Reminder'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
