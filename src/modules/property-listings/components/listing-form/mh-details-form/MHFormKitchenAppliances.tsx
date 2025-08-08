import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, X } from 'lucide-react'
import { MHDetails } from '@/types/listings'

interface MHFormKitchenAppliancesProps {
  mhDetails: Partial<MHDetails>
  newKitchenAppliance: string
  setNewKitchenAppliance: (value: string) => void
  addKitchenAppliance: () => void
  removeKitchenAppliance: (index: number) => void
}

export default function MHFormKitchenAppliances({
  mhDetails,
  newKitchenAppliance,
  setNewKitchenAppliance,
  addKitchenAppliance,
  removeKitchenAppliance
}: MHFormKitchenAppliancesProps) {
  return (
    <div>
      <Label>Kitchen Appliances</Label>
      <div className="flex gap-2 mb-2">
        <Input
          value={newKitchenAppliance}
          onChange={(e) => setNewKitchenAppliance(e.target.value)}
          placeholder="Add kitchen appliance"
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKitchenAppliance())}
        />
        <Button type="button" onClick={addKitchenAppliance}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(mhDetails?.kitchenAppliances || []).map((appliance, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {appliance}
            <X className="h-3 w-3 cursor-pointer" onClick={() => removeKitchenAppliance(index)} />
          </Badge>
        ))}
      </div>
    </div>
  )
}