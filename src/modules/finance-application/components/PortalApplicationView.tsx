import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreditCard, Plus, FileText, Clock } from 'lucide-react'
import { usePortal } from '@/contexts/PortalContext'
import { mockFinanceApplications } from '../mocks/financeApplicationMock'
import { formatDate } from '@/lib/utils'

export function PortalApplicationView() {
  const { getDisplayName, getCustomerId } = usePortal()
  const customerId = getCustomerId()
  
  // Filter applications for the current customer
  const customerApplications = mockFinanceApplications.sampleApplications.filter(app => 
    app.customerId === customerId || app.customerName === getDisplayName()
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default'
      case 'under_review':
        return 'secondary'
      case 'submitted':
        return 'outline'
      case 'rejected':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Finance Applications</h1>
          <p className="text-muted-foreground">
            Track your financing applications and status
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      {/* Application Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerApplications.length}</div>
            <p className="text-xs text-muted-foreground">
              All applications
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {customerApplications.filter(a => a.status === 'under_review').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {customerApplications.filter(a => a.status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready to proceed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {customerApplications.map((application) => (
          <Card key={application.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    Finance Application #{application.id.slice(-6)}
                  </CardTitle>
                  <CardDescription>
                    Submitted: {formatDate(application.createdAt)}
                  </CardDescription>
                </div>
                <Badge variant={getStatusColor(application.status)}>
                  {application.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-muted-foreground">Loan Amount</p>
                  <p className="font-medium">${application.loanAmount?.toLocaleString() || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Down Payment</p>
                  <p className="font-medium">${application.downPayment?.toLocaleString() || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Term</p>
                  <p className="font-medium">{application.termMonths || 'N/A'} months</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{formatDate(application.updatedAt)}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Application ID: {application.id}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  {application.status === 'approved' && (
                    <Button size="sm">
                      Accept Offer
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {customerApplications.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No Applications Found</h3>
              <p className="text-muted-foreground mb-4">
                You haven't submitted any finance applications yet.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Start New Application
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}