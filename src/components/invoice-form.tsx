'use client'

import { useState, useEffect } from 'react'
import { createInvoice, updateInvoice } from '@/lib/invoices'
import { getClients } from '@/lib/clients'
import { getInvoiceSettings } from '@/lib/invoice-settings'
import { CURRENCIES, formatCurrency } from '@/lib/currencies'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, Calculator, User } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import { AIHelperButtons } from '@/components/ai-helper-buttons'

interface LineItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  amount: number
}

interface InvoiceFormProps {
  mode?: 'create' | 'edit'
  invoiceId?: string
  initialData?: any
  clients?: any[]
}

export function InvoiceForm({ mode = 'create', invoiceId, initialData, clients: initialClients }: InvoiceFormProps = {}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lineItems, setLineItems] = useState<LineItem[]>(() => {
    if (mode === 'edit' && initialData?.line_items) {
      return initialData.line_items.map((item: any) => ({
        id: item.id || crypto.randomUUID(),
        description: item.description || '',
        quantity: parseFloat(item.quantity) || 1,
        unit_price: parseFloat(item.rate || item.price || item.unit_price) || 0,
        amount: (parseFloat(item.quantity) || 1) * (parseFloat(item.rate || item.price || item.unit_price) || 0)
      }))
    }
    return [{ id: '1', description: '', quantity: 1, unit_price: 0, amount: 0 }]
  })
  const [clients, setClients] = useState<any[]>(initialClients || [])
  const [settings, setSettings] = useState<any>(null)
  const [selectedClient, setSelectedClient] = useState<string>(() => {
    if (mode === 'edit' && initialData?.client_name) {
      return `${initialData.client_name} (${initialData.client_email || 'no email'})`
    }
    return ''
  })
  const [selectedCurrency, setSelectedCurrency] = useState<string>(initialData?.currency || 'USD')
  const [taxRate, setTaxRate] = useState<number>(() => {
    if (mode === 'edit' && initialData?.tax && initialData?.subtotal) {
      return (parseFloat(initialData.tax) / parseFloat(initialData.subtotal)) * 100
    }
    return 0
  })

  const calculateLineItemAmount = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'unit_price') {
          updatedItem.amount = calculateLineItemAmount(
            field === 'quantity' ? Number(value) : item.quantity,
            field === 'unit_price' ? Number(value) : item.unit_price
          )
        }
        return updatedItem
      }
      return item
    }))
  }

  const addLineItem = () => {
    const newId = (lineItems.length + 1).toString()
    setLineItems(prev => [...prev, {
      id: newId,
      description: '',
      quantity: 1,
      unit_price: 0,
      amount: 0
    }])
  }

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.amount, 0)
  }

  const calculateTax = (taxRate: number) => {
    return calculateSubtotal() * (taxRate / 100)
  }

  const calculateTotal = (taxRate: number) => {
    return calculateSubtotal() + calculateTax(taxRate)
  }

  // Load clients and settings on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsData, settingsData] = await Promise.all([
          getClients(),
          getInvoiceSettings()
        ])
        
        // Format clients for display
        const formattedClients = clientsData.map(client => ({
          ...client,
          displayName: `${client.name}${client.company ? ` (${client.company})` : ''}`
        }));
        
        setClients(formattedClients)
        setSettings(settingsData)
        setSelectedCurrency(settingsData.default_currency || 'USD')
        setTaxRate(settingsData.default_tax_rate || 0)
        
        // Set selected client if provided in URL
        const clientId = searchParams.get('client')
        if (clientId) {
          const client = formattedClients.find(c => c.id === clientId)
          if (client) {
            setSelectedClient(clientId)
            // Auto-fill client details
            const form = document.forms[0] as HTMLFormElement
            if (form) {
              const nameInput = form.elements.namedItem('client_name') as HTMLInputElement
              const emailInput = form.elements.namedItem('client_email') as HTMLInputElement
              if (nameInput) nameInput.value = client.name || ''
              if (emailInput) emailInput.value = client.email || ''
            }
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error)
        toast.error('Failed to load client data. Please refresh the page.')
      }
    }
    
    loadData()
  }, [searchParams, mode])

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)

    try {
      // Add line items count to form data
      formData.append('lineItemCount', lineItems.length.toString())

      // Add each line item to form data
      lineItems.forEach((item, index) => {
        formData.append(`lineItems[${index}].description`, item.description)
        formData.append(`lineItems[${index}].quantity`, item.quantity.toString())
        formData.append(`lineItems[${index}].unit_price`, item.unit_price.toString())
      })

      // Add currency and tax rate
      formData.append('currency', selectedCurrency)
      formData.append('tax_rate', taxRate.toString())

      // Add invoice number for edit mode
      if (mode === 'edit' && initialData?.number) {
        formData.append('number', initialData.number)
      }

      if (mode === 'edit' && invoiceId) {
        await updateInvoice(invoiceId, formData)
        toast.success('Invoice updated successfully!')
      } else {
        const result = await createInvoice(formData)
        if (result?.error) {
          if (result.error.code === 'FREE_PLAN_LIMIT_REACHED') {
            toast.error(result.error.message, {
              action: {
                label: 'Upgrade',
                onClick: () => router.push('/app/settings/billing')
              }
            })
            return
          }
          throw new Error(result.error.message)
        }
        toast.success('Invoice created successfully!')
      }

      router.push('/app/invoices')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save invoice')
    } finally {
      setIsSubmitting(false)
    }
  }

  const subtotal = calculateSubtotal()
  const tax = calculateTax(taxRate)
  const total = calculateTotal(taxRate)

  return (
    <form action={handleSubmit} className="space-y-6 pb-4">
      {/* Basic Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="issue_date">Issue Date</Label>
          <Input
            id="issue_date"
            name="issue_date"
            type="date"
            defaultValue={mode === 'edit' ? new Date(initialData?.issue_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CURRENCIES).map(([code, currency]) => (
                <SelectItem key={code} value={code}>
                  {currency.symbol} {currency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Invoice Number (only for edit mode) */}
      {mode === 'edit' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="invoice_number">Invoice Number</Label>
            <Input
              id="invoice_number"
              name="number"
              defaultValue={initialData?.number || ''}
              required
            />
          </div>
        </div>
      )}

      {/* Client Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-2">
          <Label htmlFor="client" className="text-sm font-medium">Select Client</Label>
          <Select 
            value={selectedClient} 
            onValueChange={(value) => {
              setSelectedClient(value);
              const client = clients.find(c => c.id === value);
              if (client) {
                const form = document.forms[0] as HTMLFormElement;
                if (form) {
                  const nameInput = form.elements.namedItem('client_name') as HTMLInputElement;
                  const emailInput = form.elements.namedItem('client_email') as HTMLInputElement;
                  if (nameInput) nameInput.value = client.name || '';
                  if (emailInput) emailInput.value = client.email || '';
                }
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.length > 0 ? (
                clients.map((client) => (
                  <SelectItem key={client.id} value={client.id} className="py-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {client.name}
                        {client.company && ` • ${client.company}`}
                      </span>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">No clients found</div>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Client Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="client_name">Client Name</Label>
          <Input
            id="client_name"
            name="client_name"
            defaultValue={mode === 'edit' ? initialData?.client_name || '' : ''}
            required
          />
        </div>
        <div>
          <Label htmlFor="client_email">Client Email</Label>
          <Input
            id="client_email"
            name="client_email"
            type="email"
            defaultValue={mode === 'edit' ? initialData?.client_email || '' : ''}
            required
          />
        </div>
      </div>

      {/* Line Items */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Label className="text-base sm:text-lg font-medium">Line Items</Label>
            <p className="text-sm text-gray-500 mt-1">Add products or services to this invoice</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLineItem}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="whitespace-nowrap">Add Item</span>
            </Button>
            <div className="sm:block">
              <AIHelperButtons
                onLineItemGenerated={(lineItem) => {
                  // Find the first empty description field and fill it
                  const emptyItem = lineItems.find(item => !item.description.trim())
                  if (emptyItem) {
                    updateLineItem(emptyItem.id, 'description', lineItem.description || '')
                    updateLineItem(emptyItem.id, 'quantity', lineItem.quantity || 1)
                    updateLineItem(emptyItem.id, 'unit_price', lineItem.unit_price || 0)
                  } else {
                    // If no empty field, add a new line item
                    addLineItem()
                    setTimeout(() => {
                      const newItem = lineItems[lineItems.length - 1]
                      if (newItem) {
                        updateLineItem(newItem.id, 'description', lineItem.description || '')
                        updateLineItem(newItem.id, 'quantity', lineItem.quantity || 1)
                        updateLineItem(newItem.id, 'unit_price', lineItem.unit_price || 0)
                      }
                    }, 0)
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {lineItems.map((item, index) => (
            <div key={item.id} className="grid md:grid-cols-4 gap-4 p-4 border rounded-lg">
              <div className="md:col-span-2">
                <Label htmlFor={`description-${item.id}`}>Description</Label>
                <Textarea
                  id={`description-${item.id}`}
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                <Input
                  id={`quantity-${item.id}`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value))}
                  required
                />
              </div>
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Label htmlFor={`unit_price-${item.id}`}>Unit Price</Label>
                  <Input
                    id={`unit_price-${item.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unit_price}
                    onChange={(e) => updateLineItem(item.id, 'unit_price', Number(e.target.value))}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="text-sm font-medium">${item.amount.toFixed(2)}</p>
                  </div>
                  {lineItems.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLineItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="border-t pt-6">
        <div className="max-w-md ml-auto space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">{formatCurrency(subtotal, selectedCurrency as any)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax ({taxRate}%):</span>
            <span className="font-medium">{formatCurrency(tax, selectedCurrency as any)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold border-t pt-2">
            <span>Total:</span>
            <span>{formatCurrency(total, selectedCurrency as any)}</span>
          </div>
        </div>
      </div>

      {/* Hidden tax rate field */}
      <input type="hidden" name="tax_rate" value={taxRate} />
      
      {/* Form Actions - Sticky on mobile */}
      <div className="sticky bottom-0 bg-background border-t pt-4 pb-2 sm:relative sm:bg-transparent sm:border-t-0 sm:pt-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {mode === 'edit' ? 'Updating...' : 'Creating...'}
                </>
              ) : mode === 'edit' ? 'Update Invoice' : 'Create Invoice'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
