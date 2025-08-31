'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Users, Plus, Mail, Phone, Building, Search, Filter, FileText, DollarSign, Calendar, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react'
import { ClientActions } from '@/components/client-actions'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  address?: string
  notes?: string
  created_at: string
  total_invoices?: number
  total_revenue?: number
  last_invoice_date?: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<string>('name')
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClients()
  }, [])

  useEffect(() => {
    filterAndSortClients()
  }, [clients, searchTerm, sortBy])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      const data = await response.json()
      
      if (response.ok && data.clients) {
        setClients(data.clients)
      } else {
        console.error('Failed to fetch clients:', data.error)
        setClients([])
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error)
      setClients([])
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortClients = () => {
    if (!Array.isArray(clients)) {
      setFilteredClients([])
      return
    }
    
    let filtered = clients

    if (searchTerm) {
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort clients
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'company':
          return (a.company || '').localeCompare(b.company || '')
        case 'revenue':
          return (b.total_revenue || 0) - (a.total_revenue || 0)
        case 'invoices':
          return (b.total_invoices || 0) - (a.total_invoices || 0)
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

    setFilteredClients(filtered)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClients(filteredClients.map(client => client.id))
    } else {
      setSelectedClients([])
    }
  }

  const handleSelectClient = (clientId: string, checked: boolean) => {
    if (checked) {
      setSelectedClients([...selectedClients, clientId])
    } else {
      setSelectedClients(selectedClients.filter(id => id !== clientId))
    }
  }

  const getClientStats = () => {
    if (!Array.isArray(clients)) {
      return { total: 0, withInvoices: 0, totalRevenue: 0, avgRevenue: 0 }
    }
    
    const total = clients.length
    const withInvoices = clients.filter(c => (c.total_invoices || 0) > 0).length
    const totalRevenue = clients.reduce((sum, c) => sum + (c.total_revenue || 0), 0)
    const avgRevenue = total > 0 ? totalRevenue / total : 0

    return { total, withInvoices, totalRevenue, avgRevenue }
  }

  const stats = getClientStats()

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your client relationships</p>
        </div>
        <Link href="/app/clients/new">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                <p className="text-2xl font-bold text-green-600">{stats.withInvoices}</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
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
                <p className="text-sm font-medium text-gray-600">Avg Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.avgRevenue.toFixed(0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Clients</CardTitle>
              <CardDescription>
                {filteredClients.length} of {clients.length} client{clients.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            {selectedClients.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{selectedClients.length} selected</span>
                <Button variant="outline" size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="invoices">Invoices</SelectItem>
                <SelectItem value="recent">Recently Added</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {clients.length === 0 ? 'No clients yet' : 'No clients match your search'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {clients.length === 0 
                  ? 'Get started by adding your first client.'
                  : 'Try adjusting your search criteria.'
                }
              </p>
              {clients.length === 0 && (
                <div className="mt-6">
                  <Link href="/app/clients/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Client
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedClients.includes(client.id)}
                        onCheckedChange={(checked) => handleSelectClient(client.id, checked as boolean)}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{client.name}</h3>
                        {client.company && (
                          <p className="text-sm text-gray-600 flex items-center">
                            <Building className="h-3 w-3 mr-1" />
                            {client.company}
                          </p>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/app/clients/${client.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/app/clients/${client.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/app/invoices/new?client=${client.id}`}>
                            <FileText className="mr-2 h-4 w-4" />
                            Create Invoice
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    {client.email && (
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 mr-2" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-2" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Client Stats */}
                  <div className="mt-3 pt-3 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Invoices</p>
                        <p className="font-medium">{client.total_invoices || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Revenue</p>
                        <p className="font-medium">${(client.total_revenue || 0).toFixed(0)}</p>
                      </div>
                    </div>
                  </div>

                  {client.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500 line-clamp-2">{client.notes}</p>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <Link href={`/app/invoices/new?client=${client.id}`}>
                      <Button variant="outline" size="sm">
                        Create Invoice
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 w-12">
                      <Checkbox
                        checked={selectedClients.length === filteredClients.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Company</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Invoices</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Checkbox
                          checked={selectedClients.includes(client.id)}
                          onCheckedChange={(checked) => handleSelectClient(client.id, checked as boolean)}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/app/clients/${client.id}`} className="font-medium text-blue-600 hover:text-blue-800">
                          {client.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {client.company || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          {client.email && <div className="text-gray-900">{client.email}</div>}
                          {client.phone && <div className="text-gray-500">{client.phone}</div>}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {client.total_invoices || 0}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900">
                          ${(client.total_revenue || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/app/clients/${client.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/app/invoices/new?client=${client.id}`}>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/app/clients/${client.id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
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
