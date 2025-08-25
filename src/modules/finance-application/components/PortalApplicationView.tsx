import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreditCard, Eye, Download, Plus, Clock } from 'lucide-react'
import { usePortal } from '@/contexts/PortalContext'
import { mockFinanceApplications } from '@/modules/finance-application/mocks/financeApplicationMock'
import { formatDate, formatCurrency } from '@/lib/utils'

export function PortalApplicationView() {
  const { getDisplayName, getCustomerId } = usePortal()
  const customerId = getCustomerId()
  const customerName = getDisplayName()
  
  // Filter applications for the current customer
  const customerApplications = mockFinanceApplications.sampleApplications.filter(app => 
    app.customerId === customerId || app.customerName === customerName
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'submitted':
      case 'under_review':
        return 'bg-blue-100 text-blue-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'more_info_needed':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'under_review':
        return 'Under Review'
      case 'more_info_needed':
        return 'More Info Needed'
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
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

      {customerApplications.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="mb-4">No finance applications found</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Start New Application
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {customerApplications.map((application) => (
            <Card key={application.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Finance Application #{application.id}
                  </CardTitle>
                  <Badge className={getStatusColor(application.status)}>
                    {getStatusLabel(application.status)}
                  </Badge>
                </div>
                <CardDescription>
                  Submitted: {formatDate(application.submittedAt)} • 
                  Updated: {formatDate(application.updatedAt)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Requested Amount</p>
                      <p className="font-medium">{formatCurrency(application.requestedAmount)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Vehicle</p>
                      <p className="font-medium">{application.vehicleInfo || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Application Type</p>
                      <p className="font-medium">{application.applicationType}</p>
                    </div>
                  </div>

                  {application.status === 'more_info_needed' && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">Action Required</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        Additional information is needed to process your application.
                      </p>
                    </div>
                  )}

                  {application.notes && (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm">{application.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Application
                    </Button>
                    {application.status === 'draft' && (
                      <Button size="sm">
                        Continue Application
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}