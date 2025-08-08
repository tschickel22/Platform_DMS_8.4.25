import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Home } from 'lucide-react'
import { MHDetails } from '@/types/listings'

interface MHBasicInfoProps {
  mhDetails: MHDetails
}

export function MHBasicInfo({ mhDetails }: MHBasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Manufactured Home Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {mhDetails.manufacturer && (
            <div>
              <span className="text-sm text-muted-foreground">Manufacturer</span>
              <div className="font-semibold">{mhDetails.manufacturer}</div>
            </div>
          )}
          {mhDetails.model && (
            <div>
              <span className="text-sm text-muted-foreground">Model</span>
              <div className="font-semibold">{mhDetails.model}</div>
            </div>
          )}
          {mhDetails.modelYear && (
            <div>
              <span className="text-sm text-muted-foreground">Model Year</span>
              <div className="font-semibold">{mhDetails.modelYear}</div>
            </div>
          )}
          {mhDetails.serialNumber && (
            <div>
              <span className="text-sm text-muted-foreground">Serial Number</span>
              <div className="font-semibold">{mhDetails.serialNumber}</div>
            </div>
          )}
          {mhDetails.color && (
            <div>
              <span className="text-sm text-muted-foreground">Color</span>
              <div className="font-semibold">{mhDetails.color}</div>
            </div>
          )}
          {mhDetails.communityName && (
            <div>
              <span className="text-sm text-muted-foreground">Community</span>
              <div className="font-semibold">{mhDetails.communityName}</div>
            </div>
          )}
          {mhDetails.propertyId && (
            <div>
              <span className="text-sm text-muted-foreground">Property ID</span>
              <div className="font-semibold">{mhDetails.propertyId}</div>
            </div>
          )}
          {mhDetails.lotSize && (
            <div>
              <span className="text-sm text-muted-foreground">Lot Size</span>
              <div className="font-semibold">{mhDetails.lotSize}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}