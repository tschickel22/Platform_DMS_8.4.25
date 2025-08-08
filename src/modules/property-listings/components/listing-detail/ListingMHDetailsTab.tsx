import React from 'react'
import { Listing } from '@/types/listings'
import { MHBasicInfo } from './mh-details-view/MHBasicInfo'
import { MHDimensions } from './mh-details-view/MHDimensions'
import { MHConstructionMaterials } from './mh-details-view/MHConstructionMaterials'
import { MHSystems } from './mh-details-view/MHSystems'
import { MHKitchenAppliances } from './mh-details-view/MHKitchenAppliances'
import { MHBooleanFeatures } from './mh-details-view/MHBooleanFeatures'
import { MHIncludedAppliances } from './mh-details-view/MHIncludedAppliances'

interface ListingMHDetailsTabProps {
  listing: Listing
}

export function ListingMHDetailsTab({ listing }: ListingMHDetailsTabProps) {
  const isManufacturedHome = listing.propertyType === 'manufactured_home'
  
  if (!isManufacturedHome || !listing.mhDetails) {
    return null
  }

  return (
    <div className="space-y-6">
      <MHBasicInfo mhDetails={listing.mhDetails} />
      <MHDimensions mhDetails={listing.mhDetails} />
      <MHConstructionMaterials mhDetails={listing.mhDetails} />
      <MHSystems mhDetails={listing.mhDetails} />
      <MHKitchenAppliances mhDetails={listing.mhDetails} />
      <MHBooleanFeatures mhDetails={listing.mhDetails} />
      <MHIncludedAppliances mhDetails={listing.mhDetails} />
    </div>
  )
}