import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BooleanIndicator } from '../BooleanIndicator'
import { MHDetails } from '@/types/listings'

interface MHIncludedAppliancesProps {
  mhDetails: MHDetails
}

export function MHIncludedAppliances({ mhDetails }: MHIncludedAppliancesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Included Appliances</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <BooleanIndicator value={mhDetails.refrigeratorIncluded} label="Refrigerator" />
          <BooleanIndicator value={mhDetails.microwaveIncluded} label="Microwave" />
          <BooleanIndicator value={mhDetails.ovenIncluded} label="Oven" />
          <BooleanIndicator value={mhDetails.dishwasherIncluded} label="Dishwasher" />
          <BooleanIndicator value={mhDetails.washerIncluded} label="Washer" />
          <BooleanIndicator value={mhDetails.dryerIncluded} label="Dryer" />
        </div>
      </CardContent>
    </Card>
  )
}