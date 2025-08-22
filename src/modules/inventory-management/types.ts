export type ListingType = 'rv' | 'manufactured_home'
export type ListingStatus = 'available' | 'pending' | 'sold' | 'reserved'
export type OfferType = 'for_sale' | 'for_rent' | 'both'
export type Condition = 'new' | 'used' | 'certified' | 'refurbished'

export interface BaseInventory {
  id: string
  listingType: ListingType
  inventoryId?: string
  title: string
  description?: string
  year: number
  make: string
  model: string
  condition: Condition
  status: ListingStatus
  offerType: OfferType
  salePrice?: number
  rentPrice?: number
  cost?: number
  location: Location
  media: Media
  seo: SEO
  analytics: Analytics
  customFields?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface RVInventory extends BaseInventory {
  listingType: 'rv'
  vin: string
  rvType?: 'travel_trailer' | 'fifth_wheel' | 'motorhome_a' | 'motorhome_b' | 'motorhome_c' | 'toy_hauler' | 'popup' | 'truck_camper'
  sleeps?: number
  length?: number
  slides?: number
  weight?: number
  engine?: string
  fuelType?: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'na'
  transmission?: 'automatic' | 'manual' | 'na'
  odometerMiles?: number
  fuelCapacity?: number
  mpg?: number
  freshWaterCapacity?: number
  grayWaterCapacity?: number
  blackWaterCapacity?: number
  generatorWattage?: number
  solarWattage?: number
  batteryCapacity?: number
  features: RVFeatures
  pricing?: RVPricing
}

export interface ManufacturedHomeInventory extends BaseInventory {
  listingType: 'manufactured_home'
  serialNumber: string
  bedrooms?: number
  bathrooms?: number
  dimensions: MHDimensions
  construction?: Construction
  taxes?: number
  hoaFees?: number
  lotRent?: number
  features: MHFeatures
  pricing?: MHPricing
}

export interface Location {
  city: string
  state: string
  postalCode?: string
  county?: string
  township?: string
  schoolDistrict?: string
  communityName?: string
  lotNumber?: string
  dealershipLocation?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface Media {
  primaryPhoto: string
  photos: string[]
  virtualTour?: string
  videoUrl?: string
}

export interface SEO {
  keywords: string[]
  metaDescription: string
  searchResultsText: string
}

export interface Analytics {
  views: number
  leads: number
  lastViewed: string | null
  conversionRate: number
}

export interface MHDimensions {
  width_ft: number
  length_ft: number
  sections: 1 | 2 | 3
  squareFootage: number
  ceilingHeight?: number
}

export interface Construction {
  roofType?: 'shingle' | 'metal' | 'rubber' | 'tile'
  sidingType?: 'vinyl' | 'fiber_cement' | 'wood' | 'metal'
  flooringType?: 'carpet' | 'laminate' | 'vinyl' | 'hardwood' | 'tile'
  foundationType?: 'pier_beam' | 'concrete_slab' | 'crawl_space' | 'basement'
}

export interface RVFeatures {
  generator: boolean
  solar: boolean
  awning: boolean
  slideOut: boolean
  airConditioning: boolean
  heating: boolean
  microwave: boolean
  refrigerator: boolean
  stove: boolean
  oven: boolean
  dishwasher: boolean
  washerDryer: boolean
  bathroom: boolean
  shower: boolean
  toilet: boolean
  waterHeater: boolean
  waterPump: boolean
  blackTank: boolean
  grayTank: boolean
  freshTank: boolean
  inverter: boolean
  outdoorKitchen: boolean
  outdoorShower: boolean
  bikeRack: boolean
  ladder: boolean
}

export interface MHFeatures {
  centralAir: boolean
  fireplace: boolean
  dishwasher: boolean
  washerDryer: boolean
  vaultedCeilings: boolean
  walkInCloset: boolean
  masterBath: boolean
  gardenTub: boolean
  islandKitchen: boolean
  deck: boolean
  shed: boolean
  carport: boolean
  fencedYard: boolean
  landscaping: boolean
  sprinklerSystem: boolean
  energyStar: boolean
  solarPanels: boolean
  doublePane: boolean
}

export interface RVPricing {
  weeklyRate?: number
  monthlyRate?: number
  securityDeposit?: number
  cleaningFee?: number
  petFee?: number
  deliveryFee?: number
  downPayment?: number
}

export interface MHPricing {
  securityDeposit?: number
  petDeposit?: number
  insurance?: number
  downPayment?: number
}

export type VehicleInventory = RVInventory | ManufacturedHomeInventory

// Export utility functions
export function isRVInventory(item: VehicleInventory): item is RVInventory {
  return item.listingType === 'rv'
}

export function isMHInventory(item: VehicleInventory): item is ManufacturedHomeInventory {
  return item.listingType === 'manufactured_home'
}