'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { FileText, Plus, Download, Edit, Search, Filter, Calendar, DollarSign, Users, CheckCircle, Clock, AlertCircle, MoreHorizontal, Eye, Send, Archive, Trash2 } from 'lucide-react'
import { InvoiceActions } from '@/components/invoice-actions'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface Invoice {
  id: string
  number: string
  client_name: string
  client_email?: string
  issue_date: string
  total: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvoices()
  }, [])

  useEffect(() => {
    filterInvoices()
  }, [invoices, searchTerm, statusFilter])

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices')
      const data = await response.json()
      setInvoices(data.invoices || [])
    } catch (error) {
      console.error('Failed to fetch invoices:', error)
      setInvoices([])
    } finally {
      setLoading(false)
    }
  }

  const filterInvoices = () => {
    if (!Array.isArray(invoices)) {
      setFilteredInvoices([])
      return
    }

    let filtered = invoices

    if (searchTerm) {
      filtered = filtered.filter(invoice => 
        invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.client_email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter)
    }

    setFilteredInvoices(filtered)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'secondary' as const, icon: Edit, color: 'text-gray-600' },
      sent: { variant: 'outline' as const, icon: Send, color: 'text-blue-600' },
      paid: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      overdue: { variant: 'destructive' as const, icon: AlertCircle, color: 'text-red-600' },
      cancelled: { variant: 'secondary' as const, icon: Archive, color: 'text-gray-600' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const isOverdue = (dueDate: string, status: string) => {
    return status !== 'paid' && new Date(dueDate) < new Date()
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedInvoices(filteredInvoices.map(invoice => invoice.id))
    } else {
      setSelectedInvoices([])
    }
  }

  const handleSelectInvoice = (invoiceId: string, checked: boolean) => {
    if (checked) {
      setSelectedInvoices([...selectedInvoices, invoiceId])
    } else {
      setSelectedInvoices(selectedInvoices.filter(id => id !== invoiceId))
    }
  }

  const getInvoiceStats = () => {
    if (!Array.isArray(invoices)) {
      return { total: 0, paid: 0, overdue: 0, totalRevenue: 0, pendingRevenue: 0 }
    }
    
    const total = invoices.length
    const paid = invoices.filter(i => i.status === 'paid').length
    const overdue = invoices.filter(i => isOverdue(i.issue_date, i.status)).length
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0)
    const pendingRevenue = invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled').reduce((sum, i) => sum + i.total, 0)

    return { total, paid, overdue, totalRevenue, pendingRevenue }
  }

  const stats = getInvoiceStats()

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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage and track your invoices</p>
        </div>
        <Link href="/app/invoices/new">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">${stats.pendingRevenue.toFixed(0)}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">All Invoices</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {filteredInvoices.length} of {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            {selectedInvoices.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600">{selectedInvoices.length} selected</span>
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  <Send className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Send Reminders</span>
                  <span className="sm:hidden">Remind</span>
                </Button>
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  <Trash2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Delete Selected</span>
                  <span className="sm:hidden">Delete</span>
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {invoices.length === 0 ? 'No invoices yet' : 'No invoices match your filters'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {invoices.length === 0 
                  ? 'Get started by creating your first invoice.'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              {invoices.length === 0 && (
                <div className="mt-6">
                  <Link href="/app/invoices/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Invoice
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="hidden sm:table-header-group">
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 sm:px-4 w-8 sm:w-12">
                      <Checkbox
                        checked={selectedInvoices.length === filteredInvoices.length}
                        onCheckedChange={handleSelectAll}
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      />
                    </th>
                    <th className="text-left py-3 px-2 sm:px-4 text-sm sm:text-base font-medium text-gray-900">Invoice #</th>
                    <th className="text-left py-3 px-2 sm:px-4 text-sm sm:text-base font-medium text-gray-900">Client</th>
                    <th className="hidden md:table-cell text-left py-3 px-2 sm:px-4 text-sm sm:text-base font-medium text-gray-900">Issue Date</th>
                    <th className="text-left py-3 px-2 sm:px-4 text-sm sm:text-base font-medium text-gray-900">Due Date</th>
                    <th className="text-right py-3 px-2 sm:px-4 text-sm sm:text-base font-medium text-gray-900">Amount</th>
                    <th className="hidden sm:table-cell text-left py-3 px-2 sm:px-4 text-sm sm:text-base font-medium text-gray-900">Status</th>
                    <th className="text-right py-3 px-2 sm:px-4 text-sm sm:text-base font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="sm:border-t">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="block sm:table-row border-b hover:bg-gray-50">
                      <td className="block sm:table-cell py-2 px-2 sm:px-4 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start">
                          <Checkbox
                            checked={selectedInvoices.includes(invoice.id)}
                            onCheckedChange={(checked) => handleSelectInvoice(invoice.id, checked as boolean)}
                            className="h-4 w-4 sm:h-5 sm:w-5"
                          />
                        </div>
                      </td>
                      <td className="block sm:table-cell py-2 px-2 sm:px-4 text-center sm:text-left">
                        <Link href={`/app/invoices/${invoice.id}`} className="font-medium text-blue-600 hover:text-blue-800 text-sm sm:text-base">
                          {invoice.number}
                        </Link>
                      </td>
                      <td className="block sm:table-cell py-2 px-2 sm:px-4">
                        <div className="text-center sm:text-left">
                          <p className="text-gray-900 font-medium text-sm sm:text-base">{invoice.client_name}</p>
                          {invoice.client_email && (
                            <p className="text-xs sm:text-sm text-gray-500 truncate">{invoice.client_email}</p>
                          )}
                        </div>
                      </td>
                      <td className="hidden md:table-cell py-2 px-2 sm:px-4 text-gray-600 text-sm">
                        {new Date(invoice.issue_date).toLocaleDateString()}
                      </td>
                      <td className="block sm:table-cell py-2 px-2 sm:px-4">
                        <div className="text-center sm:text-left">
                          <span className={`text-xs sm:text-sm ${isOverdue(invoice.issue_date, invoice.status) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                            {new Date(invoice.issue_date).toLocaleDateString()}
                            {isOverdue(invoice.issue_date, invoice.status) && (
                              <span className="ml-1 text-xs">(Overdue)</span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="block sm:table-cell py-2 px-2 sm:px-4 text-right">
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">
                          ${invoice.total.toFixed(2)}
                        </span>
                      </td>
                      <td className="block sm:table-cell py-2 px-2 sm:px-4">
                        <div className="flex justify-center sm:justify-start">
                          {getStatusBadge(invoice.status)}
                        </div>
                      </td>
                      <td className="block sm:table-cell py-2 px-2 sm:px-4">
                        <div className="flex items-center justify-center sm:justify-end space-x-1 sm:space-x-2">
                          <Link href={`/app/invoices/${invoice.id}`} className="sm:hidden">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          <Link href={`/api/pdf/${invoice.id}`} className="sm:hidden">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem asChild>
                                <Link href={`/app/invoices/${invoice.id}`} className="flex items-center">
                                  <Eye className="mr-2 h-3.5 w-3.5" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/app/invoices/${invoice.id}/edit`} className="flex items-center">
                                  <Edit className="mr-2 h-3.5 w-3.5" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/api/pdf/${invoice.id}`} className="flex items-center">
                                  <Download className="mr-2 h-3.5 w-3.5" />
                                  Download
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Send className="mr-2 h-3.5 w-3.5" />
                                Send
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
