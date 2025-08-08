import React from 'react'
import { Settings } from 'lucide-react'
import { Listing } from '@/types/listings'
import FeaturesSection from './features-form/FeaturesSection'
import MediaSection from './features-form/MediaSection'

interface ListingFormFeaturesTabProps {
  formData: Partial<Listing>
  handleInputChange: (field: keyof Listing, value: any) => void
  addToArray: (field: keyof Listing, value: string, setter: (value: string) => void) => void
  removeFromArray: (field: keyof Listing, index: number) => void
  newAmenity: string
  setNewAmenity: (value: string) => void
  newOutdoorFeature: string
  setNewOutdoorFeature: (value: string) => void
  newStorageOption: string
  setNewStorageOption: (value: string) => void
  newTechFeature: string
  setNewTechFeature: (value: string) => void
  newCommunityAmenity: string
  setNewCommunityAmenity: (value: string) => void
  newImage: string
  setNewImage: (value: string) => void
  newVideo: string
  setNewVideo: (value: string) => void
  newFloorPlan: string
  setNewFloorPlan: (value: string) => void
  newVirtualTour: string
  setNewVirtualTour: (value: string) => void
}

export default function ListingFormFeaturesTab({
  formData,
  handleInputChange,
  addToArray,
  removeFromArray,
  newAmenity,
  setNewAmenity,
  newOutdoorFeature,
  setNewOutdoorFeature,
  newStorageOption,
  setNewStorageOption,
  newTechFeature,
  setNewTechFeature,
  newCommunityAmenity,
  setNewCommunityAmenity,
  newImage,
  setNewImage,
  newVideo,
  setNewVideo,
  newFloorPlan,
  setNewFloorPlan,
  newVirtualTour,
  setNewVirtualTour
}: ListingFormFeaturesTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Property Features</h3>
      </div>

      <FeaturesSection
        formData={formData}
        handleInputChange={handleInputChange}
        addToArray={addToArray}
        removeFromArray={removeFromArray}
        newAmenity={newAmenity}
        setNewAmenity={setNewAmenity}
        newOutdoorFeature={newOutdoorFeature}
        setNewOutdoorFeature={setNewOutdoorFeature}
        newStorageOption={newStorageOption}
        setNewStorageOption={setNewStorageOption}
        newTechFeature={newTechFeature}
        setNewTechFeature={setNewTechFeature}
        newCommunityAmenity={newCommunityAmenity}
        setNewCommunityAmenity={setNewCommunityAmenity}
      />

      <MediaSection
        formData={formData}
        handleInputChange={handleInputChange}
        addToArray={addToArray}
        removeFromArray={removeFromArray}
        newImage={newImage}
        setNewImage={setNewImage}
        newVideo={newVideo}
        setNewVideo={setNewVideo}
        newFloorPlan={newFloorPlan}
        setNewFloorPlan={setNewFloorPlan}
        newVirtualTour={newVirtualTour}
        setNewVirtualTour={setNewVirtualTour}
      />
    </div>
  )
}