import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Download, Eye } from 'lucide-react'
import { usePortal } from '@/contexts/PortalContext'
import { mockAgreements } from '@/mocks/agreementsMock'

export function ClientAgreements() {
  const { getDisplayName, getCustomerId } = usePortal()
  const customerId = getCustomerId()
  
  const customerAgreements = mockAgreements.sampleAgreements.filter(agreement => 
    agreement.customerId === customerId || agreement.customerName === getDisplayName()
  )

  const getStatusVariant = (status: string) => {
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
        return 'secondary'
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

      <div className="grid gap-4">
        {customerAgreements.map((agreement) => (
          <Card key={agreement.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {agreement.type} Agreement
                </CardTitle>
                <Badge variant={getStatusVariant(agreement.status)}>
                  {agreement.status}
                </Badge>
              </div>
              <CardDescription>
                {agreement.vehicleInfo && `Vehicle: ${agreement.vehicleInfo}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {agreement.terms}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-muted-foreground">Effective Date</p>
                  <p className="font-medium">
                    {new Date(agreement.effectiveDate).toLocaleDateString()}
                  </p>
                </div>
                {agreement.expirationDate && (
                  <div>
                    <p className="text-muted-foreground">Expiration Date</p>
                    <p className="font-medium">
                      {new Date(agreement.expirationDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                {agreement.status === 'PENDING' && (
                  <Button size="sm">
                    Sign Agreement
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {customerAgreements.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No agreements found</p>
                <p className="text-sm">Your agreements will appear here when available</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}