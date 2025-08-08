import React from 'react'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { MHDetails } from '@/types/listings'

interface MHFormIncludedAppliancesProps {
  mhDetails: Partial<MHDetails>
  handleMHDetailsChange: (field: keyof MHDetails, value: any) => void
}

export default function MHFormIncludedAppliances({
  mhDetails,
  handleMHDetailsChange
}: MHFormIncludedAppliancesProps) {
  const appliances = [
    { key: 'refrigeratorIncluded', label: 'Refrigerator Included' },
    { key: 'microwaveIncluded', label: 'Microwave Included' },
    { key: 'ovenIncluded', label: 'Oven Included' },
    { key: 'dishwasherIncluded', label: 'Dishwasher Included' },
    { key: 'washerIncluded', label: 'Washer Included' },
    { key: 'dryerIncluded', label: 'Dryer Included' }
  ]

  return (
    <div>
      <h4 className="text-md font-semibold mb-4">Included Appliances</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {appliances.map(({ key, label }) => (
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