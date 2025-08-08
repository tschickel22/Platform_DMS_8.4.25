import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MHDetails } from '@/types/listings'

interface MHKitchenAppliancesProps {
  mhDetails: MHDetails
}

export function MHKitchenAppliances({ mhDetails }: MHKitchenAppliancesProps) {
  if (!mhDetails.kitchenAppliances || mhDetails.kitchenAppliances.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kitchen Appliances</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {mhDetails.kitchenAppliances.map((appliance, index) => (
            <Badge key={index} variant="secondary">{appliance}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}