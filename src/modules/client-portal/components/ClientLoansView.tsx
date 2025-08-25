import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, Calendar, FileText } from 'lucide-react'
import { usePortal } from '@/contexts/PortalContext'
import { mockFinance } from '@/mocks/financeMock'
import { formatCurrency, formatDate } from '@/lib/utils'

export function ClientLoansView() {
  const { getDisplayName, getCustomerId } = usePortal()
  const customerId = getCustomerId()
  
  // Filter loans for the current customer
  const customerLoans = mockFinance.sampleLoans.filter(loan => 
    loan.customerId === customerId || loan.customerName === getDisplayName()
  )

  // Get payment history for customer loans
  const customerPayments = mockFinance.samplePayments.filter(payment => 
    customerLoans.some(loan => loan.id === payment.loanId)
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Your Loans</h1>
        <p className="text-muted-foreground">
          Manage your loan accounts and view payment history
        </p>
      </div>

      {/* Loan Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerLoans.length}</div>
            <p className="text-xs text-muted-foreground">
              Total loan accounts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(customerLoans.reduce((sum, loan) => sum + loan.remainingBalance, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Remaining balance
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customerLoans.length > 0 ? formatDate(customerLoans[0].nextPaymentDate) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Due date
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Loan Accounts */}
      <div className="space-y-4">
        {customerLoans.map((loan) => (
          <Card key={loan.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{loan.vehicleInfo}</CardTitle>
                  <CardDescription>
                    Loan ID: {loan.id} • Started: {formatDate(loan.startDate)}
                  </CardDescription>
                </div>
                <Badge variant={loan.status === 'Current' ? 'default' : 'secondary'}>
                  {loan.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Original Amount</p>
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
                  <p className="text-muted-foreground">Interest Rate</p>
                  <p className="font-medium">{loan.interestRate}%</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Next Payment Due</p>
                    <p className="font-medium">{formatDate(loan.nextPaymentDate)}</p>
                  </div>
                  <Button size="sm">
                    Make Payment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Payments */}
      {customerPayments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>
              Your recent loan payment history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customerPayments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{formatCurrency(payment.amount)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(payment.paymentDate)} • {payment.paymentMethod}
                    </p>
                  </div>
                  <Badge variant={payment.status === 'Completed' ? 'default' : 'secondary'}>
                    {payment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {customerLoans.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No Loans Found</h3>
              <p className="text-muted-foreground">
                You don't have any active loans at this time.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}