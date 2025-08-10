import React, { useMemo, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Send,
  Eye,
  Download,
  CreditCard,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock
} from 'lucide-react'
import { Invoice, InvoiceStatus, Payment } from '@/types'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useInvoiceManagement } from './hooks/useInvoiceManagement'
import { InvoiceForm } from './components/InvoiceForm'
import { InvoiceDetail } from './components/InvoiceDetail'
import { PaymentHistory } from './components/PaymentHistory'
import { Tabs as TabsComponent, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function InvoicesList() {
  const {
    invoices: invoicesRaw,
    payments: paymentsRaw,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    sendInvoice,
    sendPaymentRequest,
    recordPayment
  } = useInvoiceManagement()

  // Always operate on arrays (avoid .length on undefined)
  const invoices = useMemo<Invoice[]>(() => invoicesRaw ?? [], [invoicesRaw])
  const payments = useMemo<Payment[]>(() => paymentsRaw ?? [], [paymentsRaw])

  const { toast } = useToast()

  // UI state
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices')
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)
  const [showInvoiceDetail, setShowInvoiceDetail] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  // Payments filter (driven by click tiles elsewhere)
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'all' | 'Completed' | 'Pending' | 'Failed'>('all')

  // Helpers
  const normalize = (v: unknown) => String(v ?? '').trim().toLowerCase()

  // ----------------- Derived data -----------------

  // Invoice filtering
  const filteredInvoices = invoices
    .filter(inv => {
      const q = searchTerm.toLowerCase()
      return (
        (inv.number ?? '').toLowerCase().includes(q) ||
        (inv.customerId ?? '').toLowerCase().includes(q)
      )
    })
    .filter(inv => statusFilter === 'all' || normalize(inv.status) === statusFilter)

  // Payments filtering (used by history list)
  const filteredPayments = useMemo(() => {
    const want = normalize(paymentStatusFilter)
    return payments.filter(p => want === 'all' || normalize(p.status) === want)
  }, [payments, paymentStatusFilter])

  // KPI helpers
  const sum = (arr: number[]) => arr.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0)
  const invTotal = (i: Invoice) => Number((i as any).total ?? (i as any).totalAmount ?? 0)

  const outstandingTotal = formatCurrency(
    sum(invoices.filter(i => normalize(i.status) !== 'paid').map(invTotal))
  )
  const overdueTotal = formatCurrency(
    sum(invoices.filter(i => normalize(i.status) === 'overdue').map(invTotal))
  )
  const paidThisMonth = formatCurrency(
    sum(invoices.filter(i => normalize(i.status) === normalize(InvoiceStatus.PAID)).map(i => Number((i as any).total ?? 0)))
  )

  const getInvoiceStatusColor = (status: string) => {
    switch (normalize(status)) {
      case normalize(InvoiceStatus.DRAFT): return 'bg-gray-50 text-gray-700 border-gray-200'
      case normalize(InvoiceStatus.SENT): return 'bg-blue-50 text-blue-700 border-blue-200'
      case normalize(InvoiceStatus.VIEWED): return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case normalize(InvoiceStatus.PAID): return 'bg-green-50 text-green-700 border-green-200'
      case normalize(InvoiceStatus.OVERDUE): return 'bg-red-50 text-red-700 border-red-200'
      case normalize(InvoiceStatus.CANCELLED): return 'bg-gray-50 text-gray-700 border-gray-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  // ----------------- Actions -----------------

  const handleCreateInvoice = () => {
    setSelectedInvoice(null)
    setShowInvoiceForm(true)
  }

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setShowInvoiceForm(true)
    setShowInvoiceDetail(false)
  }

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setShowInvoiceDetail(true)
  }

  const handleSaveInvoice = async (invoiceData: Partial<Invoice>) => {
    try {
      if (selectedInvoice) {
        await updateInvoice(selectedInvoice.id, invoiceData)
        toast({ title: 'Success', description: 'Invoice updated successfully' })
      } else {
        await createInvoice(invoiceData)
        toast({ title: 'Success', description: 'Invoice created successfully' })
      }
      setShowInvoiceForm(false)
      setSelectedInvoice(null)
    } catch {
      toast({
        title: 'Error',
        description: `Failed to ${selectedInvoice ? 'update' : 'create'} invoice`,
        variant: 'destructive'
      })
    }
  }

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return
    try {
      await deleteInvoice(invoiceId)
      toast({ title: 'Success', description: 'Invoice deleted successfully' })
    } catch {
      toast({ title: 'Error', description: 'Failed to delete invoice', variant: 'destructive' })
    }
  }

  const handleSendInvoice = async (invoiceId: string) => {
    try {
      await sendInvoice(invoiceId)
      toast({ title: 'Success', description: 'Invoice sent successfully' })
    } catch {
      toast({ title: 'Error', description: 'Failed to send invoice', variant: 'destructive' })
    }
  }

  const handleSendPaymentRequest = async (invoiceId: string) => {
    try {
      await sendPaymentRequest(invoiceId)
      return true
    } catch (error) {
      console.error('Error sending payment request:', error)
      throw error
    }
  }

  const handleRecordPayment = async (paymentData: Partial<Payment>) => {
    try {
      await recordPayment(paymentData)
      toast({ title: 'Success', description: 'Payment recorded successfully' })
      return true
    } catch {
      toast({ title: 'Error', description: 'Failed to record payment', variant: 'destructive' })
      throw new Error('record payment failed')
    }
  }

  // ----------------- Render -----------------

  return (
    <div className="space-y-8">
      {/* Modals/Drawers */}
      {showInvoiceForm && (
        <InvoiceForm
          invoice={selectedInvoice || undefined}
          onSave={handleSaveInvoice}
          onCancel={() => {
            setShowInvoiceForm(false)
            setSelectedInvoice(null)
          }}
        />
      )}
      {showInvoiceDetail && selectedInvoice && (
        <InvoiceDetail
          invoice={selectedInvoice}
          payments={payments.filter(p => p.invoiceId === selectedInvoice.id)}
          onClose={() => setShowInvoiceDetail(false)}
          onEdit={handleEditInvoice}
          onSendPaymentRequest={handleSendPaymentRequest}
          onRecordPayment={handleRecordPayment}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Invoice & Payments</h1>
            <p className="ri-page-description">Manage invoices and process payments via Zego integration</p>
          </div>
          <Button className="shadow-sm" onClick={handleCreateInvoice}>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* KPIs (Invoices-focused) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Invoices</CardTitle>
            <Receipt className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{invoices.length}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              All invoices
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Outstanding</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{outstandingTotal}</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <Clock className="h-3 w-3 mr-1" />
              {overdueTotal} overdue
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Paid This Month</CardTitle>
            <Receipt className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{paidThisMonth}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Revenue collected
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Payment Success Rate</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">98.5%</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <CheckCircle className="h-3 w-3 mr-1" />
              {payments.filter(p => normalize(p.status) === 'completed').length} successful payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <TabsComponent value={activeTab} onValueChange={(v) => setActiveTab(v as 'invoices' | 'payments')} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="invoices" className="flex items-center">
            <Receipt className="h-4 w-4 mr-2" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Payments
          </TabsTrigger>
        </TabsList>

        {/* ---------------- Invoices tab ---------------- */}
        <TabsContent value="invoices">
          {/* Search & filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ri-search-input shadow-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={normalize(InvoiceStatus.DRAFT)}>Draft</SelectItem>
                <SelectItem value={normalize(InvoiceStatus.SENT)}>Sent</SelectItem>
                <SelectItem value={normalize(InvoiceStatus.VIEWED)}>Viewed</SelectItem>
                <SelectItem value={normalize(InvoiceStatus.PAID)}>Paid</SelectItem>
                <SelectItem value={normalize(InvoiceStatus.OVERDUE)}>Overdue</SelectItem>
                <SelectItem value={normalize(InvoiceStatus.CANCELLED)}>Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="shadow-sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {statusFilter !== 'all' && (
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">Filtered by: {statusFilter}</Badge>
              <Button variant="ghost" size="sm" onClick={() => setStatusFilter('all')}>
                Clear Filter
              </Button>
            </div>
          )}

          {/* Invoices list */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Invoices</CardTitle>
              <CardDescription>Manage invoices and track payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredInvoices.map((invoice) => (
                  <div key={invoice.id} className="ri-table-row">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-foreground">{invoice.number}</h3>
                          <Badge className={cn('ri-badge-status', getInvoiceStatusColor(String(invoice.status)))}>
                            {String(invoice.status).toUpperCase()}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Customer:</span>
                            <span className="ml-1">{invoice.customerId}</span>
                          </div>
                          <div>
                            <span className="font-medium">Total:</span>
                            <span className="ml-1 font-bold text-primary">{formatCurrency(invTotal(invoice))}</span>
                          </div>
                          <div>
                            <span className="font-medium">Due Date:</span>
                            <span className="ml-1">{formatDate(invoice.dueDate)}</span>
                          </div>
                          {invoice.paidDate && (
                            <div>
                              <span className="font-medium">Paid Date:</span>
                              <span className="ml-1">{formatDate(invoice.paidDate)}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-2 bg-muted/30 p-2 rounded-md">
                          <p className="text-sm text-muted-foreground">
                            {(invoice.items?.length ?? 0)} item(s) - {invoice.notes}
                          </p>
                          {invoice.paymentMethod && (
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Payment Method:</span> {invoice.paymentMethod}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="ri-action-buttons">
                      <Button variant="outline" size="sm" className="shadow-sm" onClick={() => handleViewInvoice(invoice)}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="shadow-sm" onClick={() => handleEditInvoice(invoice)}>
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="shadow-sm">
                        <Download className="h-3 w-3 mr-1" />
                        PDF
                      </Button>
                      {normalize(invoice.status) !== 'paid' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="shadow-sm"
                          onClick={() => handleSendPaymentRequest(invoice.id)}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Send Payment Request
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {filteredInvoices.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No invoices found</p>
                    <p className="text-sm">Create your first invoice to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------------- Payments tab ---------------- */}
        <TabsContent value="payments" className="space-y-6">
          {/* Filter indicator (kept) */}
          {paymentStatusFilter !== 'all' && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Filtered by: {paymentStatusFilter}</Badge>
              <Button variant="ghost" size="sm" onClick={() => setPaymentStatusFilter('all')}>
                Clear Filter
              </Button>
            </div>
          )}

          {/* Payments list (fed with filteredPayments) */}
          <PaymentHistory
            payments={filteredPayments}
            onViewPaymentDetails={(payment) => {
              const invoice = invoices.find(i => i.id === payment.invoiceId)
              if (invoice) {
                setSelectedInvoice(invoice)
                setShowInvoiceDetail(true)
              }
            }}
          />
        </TabsContent>
      </TabsComponent>
    </div>
  )
}

export default function InvoicePayments() {
  return (
    <Routes>
      <Route path="/" element={<InvoicesList />} />
      <Route path="/*" element={<InvoicesList />} />
    </Routes>
  )
}
