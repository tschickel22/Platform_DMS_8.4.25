import React from 'react'
import { Home } from 'lucide-react'
import { Listing, MHDetails } from '@/types/listings'
import MHFormBasicInfo from './mh-details-form/MHFormBasicInfo'
import MHFormDimensions from './mh-details-form/MHFormDimensions'
import MHFormConstructionMaterials from './mh-details-form/MHFormConstructionMaterials'
import MHFormSystems from './mh-details-form/MHFormSystems'
import MHFormKitchenAppliances from './mh-details-form/MHFormKitchenAppliances'
import MHFormBooleanFeatures from './mh-details-form/MHFormBooleanFeatures'
import MHFormIncludedAppliances from './mh-details-form/MHFormIncludedAppliances'

interface ListingFormMHDetailsTabProps {
  formData: Partial<Listing>
  handleMHDetailsChange: (field: keyof MHDetails, value: any) => void
  newKitchenAppliance: string
  setNewKitchenAppliance: (value: string) => void
  addKitchenAppliance: () => void
  removeKitchenAppliance: (index: number) => void
}

export default function ListingFormMHDetailsTab({
  formData,
  handleMHDetailsChange,
  newKitchenAppliance,
  setNewKitchenAppliance,
  addKitchenAppliance,
  removeKitchenAppliance
}: ListingFormMHDetailsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Home className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Manufactured Home Details</h3>
      </div>

      <MHFormBasicInfo
        mhDetails={formData.mhDetails || {}}
        handleMHDetailsChange={handleMHDetailsChange}
      />

      <MHFormDimensions
        mhDetails={formData.mhDetails || {}}
        handleMHDetailsChange={handleMHDetailsChange}
      />

      <MHFormConstructionMaterials
        mhDetails={formData.mhDetails || {}}
        handleMHDetailsChange={handleMHDetailsChange}
      />

      <MHFormSystems
        mhDetails={formData.mhDetails || {}}
        handleMHDetailsChange={handleMHDetailsChange}
      />

      <MHFormKitchenAppliances
        mhDetails={formData.mhDetails || {}}
        newKitchenAppliance={newKitchenAppliance}
        setNewKitchenAppliance={setNewKitchenAppliance}
        addKitchenAppliance={addKitchenAppliance}
        removeKitchenAppliance={removeKitchenAppliance}
      />

      <MHFormBooleanFeatures
        mhDetails={formData.mhDetails || {}}
        handleMHDetailsChange={handleMHDetailsChange}
      />

      <MHFormIncludedAppliances
        mhDetails={formData.mhDetails || {}}
        handleMHDetailsChange={handleMHDetailsChange}
      />
    </div>
  )
}