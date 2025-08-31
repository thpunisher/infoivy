import Link from 'next/link'
import { getUser } from '@/lib/auth'
import { getInvoices, getUsage } from '@/lib/invoices'
import { getSubscription } from '@/lib/stripe-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Plus, 
  Download, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Calendar,
  BarChart3,
  Activity,
  CreditCard,
  Eye
} from 'lucide-react'

export default async function DashboardPage() {
  const user = await getUser()
  const invoices = await getInvoices()
  const usage = await getUsage()
  const subscription = await getSubscription()

  // Enhanced analytics calculations
  const totalInvoices = invoices.length
  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0)
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length
  const pendingInvoices = invoices.filter(inv => inv.status === 'pending').length
  const overdueInvoices = invoices.filter(inv => {
    const dueDate = new Date(inv.due_date || inv.issue_date)
    return inv.status === 'pending' && dueDate < new Date()
  }).length
  
  const paidRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.total, 0)
  const pendingRevenue = invoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, invoice) => sum + invoice.total, 0)
  
  const recentInvoices = invoices.slice(0, 5)
  const thisMonthInvoices = invoices.filter(inv => {
    const invoiceDate = new Date(inv.issue_date)
    const now = new Date()
    return invoiceDate.getMonth() === now.getMonth() && invoiceDate.getFullYear() === now.getFullYear()
  })
  
  const uniqueClients = new Set(invoices.map(inv => inv.client_name)).size
  const averageInvoiceValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Welcome back! Here's what's happening with your invoices.</p>
        </div>
        <Link href="/app/invoices/new">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </Link>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              ${paidRevenue.toFixed(2)} paid • ${pendingRevenue.toFixed(2)} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                {paidInvoices} paid
              </span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1 text-yellow-500" />
                {pendingInvoices} pending
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueClients}</div>
            <p className="text-xs text-muted-foreground">
              Avg: ${averageInvoiceValue.toFixed(2)} per invoice
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisMonthInvoices.length}</div>
            <p className="text-xs text-muted-foreground">
              {subscription?.plan === 'free' ? `${usage.current}/${usage.limit} this month` : 'Unlimited'}
            </p>
            {subscription?.plan === 'free' && (
              <Progress value={(usage.current / usage.limit) * 100} className="mt-2" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alert for overdue invoices */}
      {overdueInvoices > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">
                  You have {overdueInvoices} overdue invoice{overdueInvoices > 1 ? 's' : ''}
                </p>
                <p className="text-sm text-red-600">
                  Consider sending payment reminders to improve cash flow.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="invoices" className="text-xs sm:text-sm">Invoices</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          <TabsTrigger value="activity" className="text-xs sm:text-sm">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks to manage your business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/app/invoices/new" className="block">
                  <Button className="w-full justify-start h-12">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Invoice
                  </Button>
                </Link>
                <Link href="/app/clients" className="block">
                  <Button variant="outline" className="w-full justify-start h-12">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Clients
                  </Button>
                </Link>
                <Link href="/app/invoices" className="block">
                  <Button variant="outline" className="w-full justify-start h-12">
                    <Eye className="mr-2 h-4 w-4" />
                    View All Invoices
                  </Button>
                </Link>
                <Link href="/app/settings" className="block">
                  <Button variant="outline" className="w-full justify-start h-12">
                    <FileText className="mr-2 h-4 w-4" />
                    Customize Templates
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
                <CardDescription>
                  Your subscription and usage details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Plan</span>
                  <Badge variant={subscription?.plan === 'pro' ? 'default' : 'secondary'} className="text-xs">
                    {subscription?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                  </Badge>
                </div>
                
                {subscription?.plan === 'free' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Monthly Usage</span>
                      <span className="text-sm text-gray-600">{usage.current}/{usage.limit} invoices</span>
                    </div>
                    <Progress value={(usage.current / usage.limit) * 100} className="h-2" />
                    {usage.current >= usage.limit * 0.8 && (
                      <p className="text-xs text-amber-600">
                        You're approaching your monthly limit. Consider upgrading to Pro.
                      </p>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant="outline" className="text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {subscription?.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                {subscription?.plan === 'free' && (
                  <Link href="/app/billing" className="block">
                    <Button className="w-full mt-4">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Upgrade to Pro
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Invoices</CardTitle>
                  <CardDescription>
                    Your latest invoice activity
                  </CardDescription>
                </div>
                <Link href="/app/invoices">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentInvoices.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-16 w-16 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No invoices yet</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Get started by creating your first invoice.
                  </p>
                  <div className="mt-6">
                    <Link href="/app/invoices/new">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Invoice
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentInvoices.map((invoice) => {
                    const isOverdue = invoice.status === 'pending' && 
                      new Date(invoice.due_date || invoice.issue_date) < new Date()
                    
                    return (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            invoice.status === 'paid' ? 'bg-green-100' :
                            isOverdue ? 'bg-red-100' : 'bg-blue-100'
                          }`}>
                            {invoice.status === 'paid' ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : isOverdue ? (
                              <AlertCircle className="h-5 w-5 text-red-600" />
                            ) : (
                              <Clock className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{invoice.number}</p>
                            <p className="text-sm text-gray-500">{invoice.client_name}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge 
                                variant={invoice.status === 'paid' ? 'default' : isOverdue ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                {invoice.status === 'paid' ? 'Paid' : isOverdue ? 'Overdue' : 'Pending'}
                              </Badge>
                              <span className="text-xs text-gray-400">
                                {new Date(invoice.issue_date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3">
                          <span className="text-lg font-semibold">${invoice.total.toFixed(2)}</span>
                          <div className="flex space-x-1">
                            <Link href={`/app/invoices/${invoice.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/api/pdf/${invoice.id}`}>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>
                  Your income distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      Paid Revenue
                    </span>
                    <span className="font-semibold">${paidRevenue.toFixed(2)}</span>
                  </div>
                  <Progress value={totalRevenue > 0 ? (paidRevenue / totalRevenue) * 100 : 0} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                      Pending Revenue
                    </span>
                    <span className="font-semibold">${pendingRevenue.toFixed(2)}</span>
                  </div>
                  <Progress value={totalRevenue > 0 ? (pendingRevenue / totalRevenue) * 100 : 0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invoice Status</CardTitle>
                <CardDescription>
                  Current invoice distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      Paid ({paidInvoices})
                    </span>
                    <span className="text-sm text-gray-600">
                      {totalInvoices > 0 ? Math.round((paidInvoices / totalInvoices) * 100) : 0}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                      Pending ({pendingInvoices})
                    </span>
                    <span className="text-sm text-gray-600">
                      {totalInvoices > 0 ? Math.round((pendingInvoices / totalInvoices) * 100) : 0}%
                    </span>
                  </div>
                  
                  {overdueInvoices > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                        Overdue ({overdueInvoices})
                      </span>
                      <span className="text-sm text-gray-600">
                        {totalInvoices > 0 ? Math.round((overdueInvoices / totalInvoices) * 100) : 0}%
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest actions in your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInvoices.slice(0, 3).map((invoice) => (
                  <div key={invoice.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Invoice {invoice.number} created for {invoice.client_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(invoice.issue_date).toLocaleDateString()} • ${invoice.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {recentInvoices.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  )
}
