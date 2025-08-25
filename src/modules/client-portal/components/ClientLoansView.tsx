import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, Eye, Download } from 'lucide-react'
import { usePortal } from '@/contexts/PortalContext'
import { mockFinance } from '@/mocks/financeMock'
import { formatCurrency, formatDate } from '@/lib/utils'

export function ClientLoansView() {
  const { getDisplayName, getCustomerId } = usePortal()
  const customerId = getCustomerId()
  const customerName = getDisplayName()
  
  // Filter loans for the current customer
  const customerLoans = mockFinance.sampleLoans.filter(loan => 
    loan.customerId === customerId || loan.customerName === customerName
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Current':
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Late':
        return 'bg-yellow-100 text-yellow-800'
      case 'Default':
        return 'bg-red-100 text-red-800'
      case 'Paid Off':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (customerLoans.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Your Loans</h1>
          <p className="text-muted-foreground">
            Manage your loan accounts and payments
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No loans found for your account</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Your Loans</h1>
        <p className="text-muted-foreground">
          Manage your loan accounts and payments
        </p>
      </div>

      <div className="grid gap-4">
        {customerLoans.map((loan) => (
          <Card key={loan.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{loan.vehicleInfo}</CardTitle>
                <Badge className={getStatusColor(loan.status)}>
                  {loan.status}
                </Badge>
              </div>
              <CardDescription>
                Loan ID: {loan.id} • Started: {formatDate(loan.startDate)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Loan Amount</p>
                  <p className="font-medium">{formatCurrency(loan.loanAmount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Remaining Balance</p>
                  <p className="font-medium">{formatCurrency(loan.remainingBalance)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Monthly Payment</p>
                  <p className="font-medium">{formatCurrency(loan.monthlyPayment)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Next Payment</p>
                  <p className="font-medium">{formatDate(loan.nextPaymentDate)}</p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Payment History
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}