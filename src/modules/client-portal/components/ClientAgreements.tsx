import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Download, Eye } from 'lucide-react'
import { usePortal } from '@/contexts/PortalContext'
import { mockAgreements } from '@/mocks/agreementsMock'
import { formatDate } from '@/lib/utils'

export function ClientAgreements() {
  const { getDisplayName, getCustomerId } = usePortal()
  const customerId = getCustomerId()
  
  // Filter agreements for the current customer
  const customerAgreements = mockAgreements.sampleAgreements.filter(agreement => 
    agreement.customerId === customerId || agreement.customerName === getDisplayName()
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SIGNED':
      case 'ACTIVE':
        return 'default'
      case 'PENDING':
        return 'destructive'
      case 'EXPIRED':
      case 'CANCELLED':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Your Agreements</h1>
        <p className="text-muted-foreground">
          Review and manage your agreements and contracts
        </p>
      </div>

      {/* Agreement Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agreements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerAgreements.length}</div>
            <p className="text-xs text-muted-foreground">
              All agreements
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Signature</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {customerAgreements.filter(a => a.status === 'PENDING').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require action
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {customerAgreements.filter(a => ['SIGNED', 'ACTIVE'].includes(a.status)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Signed & active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Agreements List */}
      <div className="space-y-4">
        {customerAgreements.map((agreement) => (
          <Card key={agreement.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {agreement.type.replace('_', ' ').toUpperCase()} Agreement
                  </CardTitle>
                  <CardDescription>
                    {agreement.vehicleInfo && `Vehicle: ${agreement.vehicleInfo} • `}
                    Created: {formatDate(agreement.createdAt)}
                  </CardDescription>
                </div>
                <Badge variant={getStatusColor(agreement.status)}>
                  {agreement.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {agreement.terms.substring(0, 150)}...
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-muted-foreground">Effective Date</p>
                  <p className="font-medium">{formatDate(agreement.effectiveDate)}</p>
                </div>
                {agreement.expirationDate && (
                  <div>
                    <p className="text-muted-foreground">Expiration Date</p>
                    <p className="font-medium">{formatDate(agreement.expirationDate)}</p>
                  </div>
                )}
                {agreement.totalAmount && (
                  <div>
                    <p className="text-muted-foreground">Total Amount</p>
                    <p className="font-medium">${agreement.totalAmount.toLocaleString()}</p>
                  </div>
                )}
                {agreement.signedAt && (
                  <div>
                    <p className="text-muted-foreground">Signed Date</p>
                    <p className="font-medium">{formatDate(agreement.signedAt)}</p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {agreement.documents.map((doc) => (
                    <Button key={doc.id} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      {doc.name}
                    </Button>
                  ))}
                </div>
                
                {agreement.status === 'PENDING' && (
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Review & Sign
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {customerAgreements.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No Agreements Found</h3>
              <p className="text-muted-foreground">
                You don't have any agreements at this time.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}