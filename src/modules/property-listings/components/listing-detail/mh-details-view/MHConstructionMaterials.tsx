import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building } from 'lucide-react'
import { MHDetails } from '@/types/listings'

interface MHConstructionMaterialsProps {
  mhDetails: MHDetails
}

export function MHConstructionMaterials({ mhDetails }: MHConstructionMaterialsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Construction & Materials
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {mhDetails.foundation && (
            <div>
              <span className="text-sm text-muted-foreground">Foundation</span>
              <div className="font-semibold">{mhDetails.foundation}</div>
            </div>
          )}
          {mhDetails.roofType && (
            <div>
              <span className="text-sm text-muted-foreground">Roof Type</span>
              <div className="font-semibold">{mhDetails.roofType}</div>
            </div>
          )}
          {mhDetails.roofMaterial && (
            <div>
              <span className="text-sm text-muted-foreground">Roof Material</span>
              <div className="font-semibold">{mhDetails.roofMaterial}</div>
            </div>
          )}
          {mhDetails.exteriorMaterial && (
            <div>
              <span className="text-sm text-muted-foreground">Exterior Material</span>
              <div className="font-semibold">{mhDetails.exteriorMaterial}</div>
            </div>
          )}
          {mhDetails.ceilingMaterial && (
            <div>
              <span className="text-sm text-muted-foreground">Ceiling Material</span>
              <div className="font-semibold">{mhDetails.ceilingMaterial}</div>
            </div>
          )}
          {mhDetails.wallMaterial && (
            <div>
              <span className="text-sm text-muted-foreground">Wall Material</span>
              <div className="font-semibold">{mhDetails.wallMaterial}</div>
            </div>
          )}
          {mhDetails.flooringType && (
            <div>
              <span className="text-sm text-muted-foreground">Flooring</span>
              <div className="font-semibold">{mhDetails.flooringType}</div>
            </div>
          )}
          {mhDetails.windowType && (
            <div>
              <span className="text-sm text-muted-foreground">Windows</span>
              <div className="font-semibold">{mhDetails.windowType}</div>
            </div>
          )}
          {mhDetails.insulationType && (
            <div>
              <span className="text-sm text-muted-foreground">Insulation</span>
              <div className="font-semibold">{mhDetails.insulationType}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}