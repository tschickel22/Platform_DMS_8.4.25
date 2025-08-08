import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { MHDetails } from '@/types/listings'

interface MHFormConstructionMaterialsProps {
  mhDetails: Partial<MHDetails>
  handleMHDetailsChange: (field: keyof MHDetails, value: any) => void
}

export default function MHFormConstructionMaterials({
  mhDetails,
  handleMHDetailsChange
}: MHFormConstructionMaterialsProps) {
  return (
    <div>
      <h4 className="text-md font-semibold mb-2">Construction Materials</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="foundation">Foundation</Label>
          <Input
            id="foundation"
            value={mhDetails?.foundation || ''}
            onChange={(e) => handleMHDetailsChange('foundation', e.target.value)}
            placeholder="Foundation type"
          />
        </div>

        <div>
          <Label htmlFor="roofType">Roof Type</Label>
          <Input
            id="roofType"
            value={mhDetails?.roofType || ''}
            onChange={(e) => handleMHDetailsChange('roofType', e.target.value)}
            placeholder="Roof type"
          />
        </div>

        <div>
          <Label htmlFor="roofMaterial">Roof Material</Label>
          <Input
            id="roofMaterial"
            value={mhDetails?.roofMaterial || ''}
            onChange={(e) => handleMHDetailsChange('roofMaterial', e.target.value)}
            placeholder="Roof material"
          />
        </div>

        <div>
          <Label htmlFor="exteriorMaterial">Exterior Material</Label>
          <Input
            id="exteriorMaterial"
            value={mhDetails?.exteriorMaterial || ''}
            onChange={(e) => handleMHDetailsChange('exteriorMaterial', e.target.value)}
            placeholder="Exterior material"
          />
        </div>

        <div>
          <Label htmlFor="ceilingMaterial">Ceiling Material</Label>
          <Input
            id="ceilingMaterial"
            value={mhDetails?.ceilingMaterial || ''}
            onChange={(e) => handleMHDetailsChange('ceilingMaterial', e.target.value)}
            placeholder="Ceiling material"
          />
        </div>

        <div>
          <Label htmlFor="wallMaterial">Wall Material</Label>
          <Input
            id="wallMaterial"
            value={mhDetails?.wallMaterial || ''}
            onChange={(e) => handleMHDetailsChange('wallMaterial', e.target.value)}
            placeholder="Wall material"
          />
        </div>
      </div>
    </div>
  )
}