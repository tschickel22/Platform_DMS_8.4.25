import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, Calendar, CreditCard } from 'lucide-react'
import { usePortal } from '@/contexts/PortalContext'
import { mockFinance } from '@/mocks/financeMock'

export function ClientLoansView() {
  const { getDisplayName, getCustomerId } = usePortal()
  const customerId = getCustomerId()
  
  const customerLoans = mockFinance.sampleLoans.filter(loan => 
    loan.customerId === customerId || loan.customerName === getDisplayName()
  )

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
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  {loan.vehicleInfo}
                </CardTitle>
                <Badge variant={loan.status === 'Current' ? 'default' : 'secondary'}>
                  {loan.status}
                </Badge>
              </div>
              <CardDescription>
                Loan ID: {loan.id}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Principal</p>
                  <p className="font-medium">${loan.loanAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Balance</p>
                  <p className="font-medium">${loan.remainingBalance.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Interest Rate</p>
                  <p className="font-medium">{loan.interestRate}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Next Payment</p>
                  <p className="font-medium">{new Date(loan.nextPaymentDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Monthly Payment: ${loan.monthlyPayment.toFixed(2)}</span>
                  </div>
                  <Button size="sm" variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Make Payment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {customerLoans.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No loans found</p>
                <p className="text-sm">Your loan accounts will appear here</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}