import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { MHDetails } from '@/types/listings'

interface MHFormSystemsProps {
  mhDetails: Partial<MHDetails>
  handleMHDetailsChange: (field: keyof MHDetails, value: any) => void
}

export default function MHFormSystems({
  mhDetails,
  handleMHDetailsChange
}: MHFormSystemsProps) {
  return (
    <div>
      <h4 className="text-md font-semibold mb-2">Systems</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hvacType">HVAC Type</Label>
          <Input
            id="hvacType"
            value={mhDetails?.hvacType || ''}
            onChange={(e) => handleMHDetailsChange('hvacType', e.target.value)}
            placeholder="HVAC system type"
          />
        </div>

        <div>
          <Label htmlFor="waterHeaterType">Water Heater Type</Label>
          <Input
            id="waterHeaterType"
            value={mhDetails?.waterHeaterType || ''}
            onChange={(e) => handleMHDetailsChange('waterHeaterType', e.target.value)}
            placeholder="Water heater type"
          />
        </div>

        <div>
          <Label htmlFor="electricalSystem">Electrical System</Label>
          <Input
            id="electricalSystem"
            value={mhDetails?.electricalSystem || ''}
            onChange={(e) => handleMHDetailsChange('electricalSystem', e.target.value)}
            placeholder="Electrical system"
          />
        </div>

        <div>
          <Label htmlFor="plumbingType">Plumbing Type</Label>
          <Input
            id="plumbingType"
            value={mhDetails?.plumbingType || ''}
            onChange={(e) => handleMHDetailsChange('plumbingType', e.target.value)}
            placeholder="Plumbing type"
          />
        </div>

        <div>
          <Label htmlFor="insulationType">Insulation Type</Label>
          <Input
            id="insulationType"
            value={mhDetails?.insulationType || ''}
            onChange={(e) => handleMHDetailsChange('insulationType', e.target.value)}
            placeholder="Insulation type"
          />
        </div>

        <div>
          <Label htmlFor="windowType">Window Type</Label>
          <Input
            id="windowType"
            value={mhDetails?.windowType || ''}
            onChange={(e) => handleMHDetailsChange('windowType', e.target.value)}
            placeholder="Window type"
          />
        </div>

        <div>
          <Label htmlFor="flooringType">Flooring Type</Label>
          <Input
            id="flooringType"
            value={mhDetails?.flooringType || ''}
            onChange={(e) => handleMHDetailsChange('flooringType', e.target.value)}
            placeholder="Flooring type"
          />
        </div>
      </div>
    </div>
  )
}