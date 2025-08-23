import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Eye, Download, PenTool } from 'lucide-react'
import { usePortal } from '@/contexts/PortalContext'
import { mockAgreements } from '@/mocks/agreementsMock'
import { formatDate } from '@/lib/utils'

export function ClientAgreements() {
  const { getDisplayName, getCustomerId } = usePortal()
  const customerId = getCustomerId()
  const customerName = getDisplayName()
  
  // Filter agreements for the current customer
  const customerAgreements = mockAgreements.sampleAgreements.filter(agreement => 
    agreement.customerId === customerId || agreement.customerName === customerName
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SIGNED':
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800'
      case 'EXPIRED':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (customerAgreements.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Your Agreements</h1>
          <p className="text-muted-foreground">
            Review and manage your agreements
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No agreements found for your account</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Your Agreements</h1>
        <p className="text-muted-foreground">
          Review and manage your agreements
        </p>
      </div>

      <div className="grid gap-4">
        {customerAgreements.map((agreement) => (
          <Card key={agreement.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{agreement.type} Agreement</CardTitle>
                <Badge className={getStatusColor(agreement.status)}>
                  {agreement.status}
                </Badge>
              </div>
              <CardDescription>
                Created: {formatDate(agreement.createdAt)} • Vehicle: {agreement.vehicleInfo}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {agreement.terms}
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Effective Date</p>
                    <p className="font-medium">{formatDate(agreement.effectiveDate)}</p>
                  </div>
                  {agreement.totalAmount && (
                    <div>
                      <p className="text-muted-foreground">Total Amount</p>
                      <p className="font-medium">${agreement.totalAmount.toLocaleString()}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Agreement
                  </Button>
                  {agreement.status === 'PENDING' && (
                    <Button size="sm">
                      <PenTool className="h-4 w-4 mr-2" />
                      Sign Agreement
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
    </div>
  )
}