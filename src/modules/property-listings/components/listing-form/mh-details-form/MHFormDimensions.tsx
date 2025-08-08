import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { MHDetails } from '@/types/listings'

interface MHFormDimensionsProps {
  mhDetails: Partial<MHDetails>
  handleMHDetailsChange: (field: keyof MHDetails, value: any) => void
}

export default function MHFormDimensions({
  mhDetails,
  handleMHDetailsChange
}: MHFormDimensionsProps) {
  return (
    <div>
      <h4 className="text-md font-semibold mb-2">Dimensions</h4>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div>
          <Label htmlFor="width1">Width 1</Label>
          <Input
            id="width1"
            type="number"
            min="0"
            value={mhDetails?.width1 || ''}
            onChange={(e) => handleMHDetailsChange('width1', parseInt(e.target.value) || undefined)}
            placeholder="Primary width"
          />
        </div>

        <div>
          <Label htmlFor="length1">Length 1</Label>
          <Input
            id="length1"
            type="number"
            min="0"
            value={mhDetails?.length1 || ''}
            onChange={(e) => handleMHDetailsChange('length1', parseInt(e.target.value) || undefined)}
            placeholder="Primary length"
          />
        </div>

        <div>
          <Label htmlFor="width2">Width 2</Label>
          <Input
            id="width2"
            type="number"
            min="0"
            value={mhDetails?.width2 || ''}
            onChange={(e) => handleMHDetailsChange('width2', parseInt(e.target.value) || undefined)}
            placeholder="Secondary width"
          />
        </div>

        <div>
          <Label htmlFor="length2">Length 2</Label>
          <Input
            id="length2"
            type="number"
            min="0"
            value={mhDetails?.length2 || ''}
            onChange={(e) => handleMHDetailsChange('length2', parseInt(e.target.value) || undefined)}
            placeholder="Secondary length"
          />
        </div>

        <div>
          <Label htmlFor="width3">Width 3</Label>
          <Input
            id="width3"
            type="number"
            min="0"
            value={mhDetails?.width3 || ''}
            onChange={(e) => handleMHDetailsChange('width3', parseInt(e.target.value) || undefined)}
            placeholder="Tertiary width"
          />
        </div>

        <div>
          <Label htmlFor="length3">Length 3</Label>
          <Input
            id="length3"
            type="number"
            min="0"
            value={mhDetails?.length3 || ''}
            onChange={(e) => handleMHDetailsChange('length3', parseInt(e.target.value) || undefined)}
            placeholder="Tertiary length"
          />
        </div>
      </div>
    </div>
  )
}