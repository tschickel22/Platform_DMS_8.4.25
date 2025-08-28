import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download, Mail, DollarSign, Calendar, User } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { mockInvoice } from '@/mocks/invoiceMock'

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Find the invoice by ID
  const invoice = mockInvoice.sampleInvoices.find(inv => inv.id === id)

  if (!invoice) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/invoices')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invoices
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Invoice Not Found</h3>
              <p className="text-muted-foreground">The invoice you're looking for could not be found.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/invoices')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invoices
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Invoice {invoice.id}</h1>
            <p className="text-muted-foreground">
              Created on {formatDate(invoice.createdAt || new Date())}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Invoice Details</CardTitle>
                <Badge className={getStatusColor(invoice.status)}>
                  {invoice.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customer Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Customer</span>
                  </div>
                  <div className="pl-6">
                    <p className="font-medium">{invoice.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      Account ID: {invoice.accountId || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Due Date</span>
                  </div>
                  <div className="pl-6">
                    <p className="font-medium">{formatDate(invoice.dueDate)}</p>
                    <p className="text-sm text-muted-foreground">
                      Payment Method: {invoice.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div>
                <h3 className="font-medium mb-3">Line Items</h3>
                <div className="border rounded-lg">
                  <div className="grid grid-cols-4 gap-4 p-3 bg-muted/50 font-medium text-sm">
                    <div>Description</div>
                    <div className="text-center">Quantity</div>
                    <div className="text-right">Unit Price</div>
                    <div className="text-right">Total</div>
                  </div>
                  {invoice.lineItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 p-3 border-t">
                      <div>{item.description}</div>
                      <div className="text-center">{item.quantity}</div>
                      <div className="text-right">{formatCurrency(item.unitPrice)}</div>
                      <div className="text-right font-medium">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </div>
                    </div>
                  ))}
                  <div className="border-t p-3 bg-muted/25">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Amount</span>
                      <span className="text-lg font-bold">
                        {formatCurrency(invoice.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Due</span>
                <span className="font-medium">{formatCurrency(invoice.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge className={getStatusColor(invoice.status)}>
                  {invoice.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recurrence</span>
                <span className="font-medium">{invoice.recurrence}</span>
              </div>
              {invoice.status !== 'Paid' && (
                <div className="pt-4 border-t">
                  <Button className="w-full">
                    Record Payment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No payment history available</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}