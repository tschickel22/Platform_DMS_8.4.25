import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { MHDetails } from '@/types/listings'

interface MHFormBasicInfoProps {
  mhDetails: Partial<MHDetails>
  handleMHDetailsChange: (field: keyof MHDetails, value: any) => void
}

export default function MHFormBasicInfo({
  mhDetails,
  handleMHDetailsChange
}: MHFormBasicInfoProps) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="manufacturer">Manufacturer</Label>
          <Input
            id="manufacturer"
            value={mhDetails?.manufacturer || ''}
            onChange={(e) => handleMHDetailsChange('manufacturer', e.target.value)}
            placeholder="Enter manufacturer"
          />
        </div>

        <div>
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            value={mhDetails?.model || ''}
            onChange={(e) => handleMHDetailsChange('model', e.target.value)}
            placeholder="Enter model"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <Label htmlFor="serialNumber">Serial Number</Label>
          <Input
            id="serialNumber"
            value={mhDetails?.serialNumber || ''}
            onChange={(e) => handleMHDetailsChange('serialNumber', e.target.value)}
            placeholder="Enter serial number"
          />
        </div>

        <div>
          <Label htmlFor="modelYear">Model Year</Label>
          <Input
            id="modelYear"
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            value={mhDetails?.modelYear || ''}
            onChange={(e) => handleMHDetailsChange('modelYear', parseInt(e.target.value) || undefined)}
            placeholder="Enter model year"
          />
        </div>

        <div>
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            value={mhDetails?.color || ''}
            onChange={(e) => handleMHDetailsChange('color', e.target.value)}
            placeholder="Enter color"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <Label htmlFor="communityName">Community Name</Label>
          <Input
            id="communityName"
            value={mhDetails?.communityName || ''}
            onChange={(e) => handleMHDetailsChange('communityName', e.target.value)}
            placeholder="Enter community name"
          />
        </div>

        <div>
          <Label htmlFor="propertyId">Property ID</Label>
          <Input
            id="propertyId"
            value={mhDetails?.propertyId || ''}
            onChange={(e) => handleMHDetailsChange('propertyId', e.target.value)}
            placeholder="Property identification number"
          />
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="lotSize">Lot Size</Label>
        <Input
          id="lotSize"
          value={mhDetails?.lotSize || ''}
          onChange={(e) => handleMHDetailsChange('lotSize', e.target.value)}
          placeholder="Enter lot size (e.g., 60x120)"
        />
      </div>
    </div>
  )
}