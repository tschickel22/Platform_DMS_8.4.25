import React from 'react'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { MHDetails } from '@/types/listings'

interface MHFormBooleanFeaturesProps {
  mhDetails: Partial<MHDetails>
  handleMHDetailsChange: (field: keyof MHDetails, value: any) => void
}

export default function MHFormBooleanFeatures({
  mhDetails,
  handleMHDetailsChange
}: MHFormBooleanFeaturesProps) {
  const features = [
    { key: 'garage', label: 'Garage' },
    { key: 'carport', label: 'Carport' },
    { key: 'centralAir', label: 'Central Air' },
    { key: 'thermopaneWindows', label: 'Thermopane Windows' },
    { key: 'fireplace', label: 'Fireplace' },
    { key: 'storageShed', label: 'Storage Shed' },
    { key: 'gutters', label: 'Gutters' },
    { key: 'shutters', label: 'Shutters' },
    { key: 'deck', label: 'Deck' },
    { key: 'patio', label: 'Patio' },
    { key: 'cathedralCeilings', label: 'Cathedral Ceilings' },
    { key: 'ceilingFans', label: 'Ceiling Fans' },
    { key: 'skylights', label: 'Skylights' },
    { key: 'walkinClosets', label: 'Walk-in Closets' },
    { key: 'laundryRoom', label: 'Laundry Room' },
    { key: 'pantry', label: 'Pantry' },
    { key: 'sunRoom', label: 'Sun Room' },
    { key: 'basement', label: 'Basement' },
    { key: 'gardenTub', label: 'Garden Tub' },
    { key: 'garbageDisposal', label: 'Garbage Disposal' },
    { key: 'laundryHookups', label: 'Laundry Hookups' },
    { key: 'internetReady', label: 'Internet Ready' },
    { key: 'cableReady', label: 'Cable Ready' },
    { key: 'phoneReady', label: 'Phone Ready' }
  ]

  return (
    <div>
      <h4 className="text-md font-semibold mb-4">Features & Amenities</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {features.map(({ key, label }) => (
          <div key={key} className="flex items-center space-x-2">
            <Checkbox
              id={key}
              checked={mhDetails?.[key as keyof MHDetails] || false}
              onCheckedChange={(checked) => handleMHDetailsChange(key as keyof MHDetails, checked)}
            />
            <Label htmlFor={key}>{label}</Label>
          </div>
        ))}
      </div>
    </div>
  )
}