// Base listing interface for common properties
export interface BaseListing {
  id: string
  title: string
  description: string
  address: string
  images: string[]
  videos: string[]
  floorPlans: string[]
  contactInfo: {
    phone: string
    email: string
    name?: string
  }
  createdAt: string
  updatedAt: string
  status: 'active' | 'pending' | 'sold' | 'rented' | 'inactive'
  featured: boolean
  listingType: 'for_rent' | 'for_sale'
}

// Traditional rental listing (existing structure)
export interface RentalListing extends BaseListing {
  propertyType: 'apartment' | 'house' | 'condo' | 'townhouse'
  rent: number
  bedrooms: number
  bathrooms: number
  squareFootage: number
  amenities: string[]
  petPolicy: string
  listingType: 'for_rent'
}

// Manufactured home listing (new structure)
export interface ManufacturedHomeListing extends BaseListing {
  // Seller Information
  sellerID: string
  sellerName: string
  sellerPhone: string
  sellerEmail: string
  
  // Pricing
  askingPrice: number
  lotRent?: number // Optional for owned lots
  taxes?: number
  utilities?: number
  
  // Location Details
  locationType: 'manufactured_home_community' | 'private_land' | 'mobile_home_park'
  communityName?: string
  propertyId?: string
  lotNumber?: string
  width1?: number
  length1?: number
  width2?: number
  length2?: number
  width3?: number
  length3?: number
  
  // Home Specifications
  roofMaterial?: string
  homeType: 'single_wide' | 'double_wide' | 'triple_wide' | 'modular'
  ceilingMaterial?: string
  wallMaterial?: string
  make: string
  model: string
  year: number
  bedrooms: number
  bathrooms: number
  squareFootage: number
  thermopaneWindows?: boolean
  
  // Construction Details
  roofType: 'metal' | 'shingle' | 'rubber' | 'tile'
  laundryRoom?: boolean
  sidingType: 'vinyl' | 'wood' | 'metal' | 'fiber_cement' | 'brick'
  
  // Features & Amenities
  garage?: boolean
  carport?: boolean
  centralAir?: boolean
  fireplace?: boolean
  storageShed?: boolean
  gutters?: boolean
  shutters?: boolean
  deck?: boolean
  patio?: boolean
  cathedralCeilings?: boolean
  ceilingFans?: boolean
  skylights?: boolean
  walkinClosets?: boolean
  pantry?: boolean
  sunRoom?: boolean
  basement?: boolean
  gardenTub?: boolean
  garbageDisposal?: boolean
  refrigeratorIncluded?: boolean
  microwaveIncluded?: boolean
  ovenIncluded?: boolean
  dishwasherIncluded?: boolean
  washerIncluded?: boolean
  dryerIncluded?: boolean
  garage: boolean
  carport: boolean
  shed: boolean
  mhVillageAccountKey?: string
  deck: boolean
  porch: boolean
  companyName?: string
  centralAir: boolean
  heating: 'electric' | 'gas' | 'propane' | 'oil' | 'heat_pump'
  fax?: string
  website?: string
  additionalEmail1?: string
  additionalEmail2?: string
  additionalEmail3?: string
  alternatePhone?: string
  appliances: string[]
  
  // Identification
  serialNumber: string
  titleNumber?: string
  
  // Media & Marketing
  virtualTour?: string // Video URL
  
  // Additional Details
  condition: 'excellent' | 'good' | 'fair' | 'needs_work'
  financing: 'cash_only' | 'owner_financing' | 'traditional_financing' | 'all_options'
  moveInReady: boolean
  
  listingType: 'for_sale'
}

// Union type for all listing types
export type PropertyListing = RentalListing | ManufacturedHomeListing

// Type guards
export function isRentalListing(listing: PropertyListing): listing is RentalListing {
  return listing.listingType === 'for_rent'
}

export function isManufacturedHomeListing(listing: PropertyListing): listing is ManufacturedHomeListing {
  return listing.listingType === 'for_sale' && 'sellerID' in listing
}

export interface MHDetails {
  manufacturer: string
  model: string
  modelYear?: number
  color?: string
  serialNumber: string
  communityName: string
  propertyId?: string
  lotSize: string
  width1: number
  length1: number
  width2?: number
  length2?: number
  width3?: number
  length3?: number
  foundation: string
  roofType: string
  roofMaterial?: string
  exteriorMaterial: string
  ceilingMaterial?: string
  wallMaterial?: string
  hvacType: string
  waterHeaterType: string
  electricalSystem: string
  plumbingType: string
  insulationType: string
  windowType: string
  thermopaneWindows?: boolean
  flooringType: string
  kitchenAppliances: string[]
  laundryHookups: boolean
  laundryRoom?: boolean
  internetReady: boolean
  cableReady: boolean
  phoneReady: boolean
  garage?: boolean
  carport?: boolean
  centralAir?: boolean
  fireplace?: boolean
  storageShed?: boolean
  gutters?: boolean
  shutters?: boolean
  deck?: boolean
  patio?: boolean
  cathedralCeilings?: boolean
  ceilingFans?: boolean
  skylights?: boolean
  walkinClosets?: boolean
  pantry?: boolean
  sunRoom?: boolean
  basement?: boolean
  gardenTub?: boolean
  garbageDisposal?: boolean
  refrigeratorIncluded?: boolean
  microwaveIncluded?: boolean
  ovenIncluded?: boolean
  dishwasherIncluded?: boolean
  washerIncluded?: boolean
  dryerIncluded?: boolean
}

export interface Listing {
  id: string
  sellerId?: string
  companyId?: string
  sellerId?: string
  companyId?: string
  listingType: 'rent' | 'sale'
  title: string
  description: string
  termsOfSale?: string
  termsOfSale?: string
  address: string
  address2?: string
  city?: string
  state?: string
  zipCode?: string
  county?: string
  township?: string
  schoolDistrict?: string
  latitude?: number
  longitude?: number
  address2?: string
  city: string
  state: string
  zipCode: string
  county?: string
  township?: string
  schoolDistrict?: string
  latitude?: number
  longitude?: number
  rent?: number
  purchasePrice?: number
  soldPrice?: number
  lotRent?: number
  monthlyTax?: number
  monthlyUtilities?: number
  hoaFees?: number
  monthlyTax?: number
  monthlyUtilities?: number
  bedrooms: number
  bathrooms: number
  squareFootage: number
  yearBuilt?: number
  preferredTerm?: string
  propertyType: string
  preferredTerm?: string
  status: string
  amenities: string[]
  outdoorFeatures?: string[]
  storageOptions?: string[]
  technologyFeatures?: string[]
  communityAmenities?: string[]
  petPolicy: string
  isRepossessed?: boolean
  packageType?: string
  pendingSale?: boolean
  soldPrice?: number
  searchResultsText?: string
  agentPhotoUrl?: string
  mhDetails?: MHDetails
  images: string[]
  videos?: string[]
  floorPlans?: string[]
  virtualTours?: string[]
  contactInfo: {
    mhVillageAccountKey?: string
    firstName: string
    lastName: string
    companyName?: string
    phone: string
    email: string
    fax?: string
    website?: string
  modelYear?: number
  color?: string
    additionalEmail1?: string
    additionalEmail2?: string
    additionalEmail3?: string
    alternatePhone?: string
  }
  isRepossessed?: boolean
  packageType?: string
  pendingSale?: boolean
  searchResultsText?: string
  agentPhotoUrl?: string
  createdAt: string
  updatedAt: string
}

// Enums for better type safety
export enum LocationType {
  MANUFACTURED_HOME_COMMUNITY = 'manufactured_home_community',
  PRIVATE_LAND = 'private_land',
  MOBILE_HOME_PARK = 'mobile_home_park'
}

export enum HomeType {
  SINGLE_WIDE = 'single_wide',
  DOUBLE_WIDE = 'double_wide',
  TRIPLE_WIDE = 'triple_wide',
  MODULAR = 'modular'
}

export enum RoofType {
  METAL = 'metal',
  SHINGLE = 'shingle',
  RUBBER = 'rubber',
  TILE = 'tile'
}

export enum SidingType {
  VINYL = 'vinyl',
  WOOD = 'wood',
  METAL = 'metal',
  FIBER_CEMENT = 'fiber_cement',
  BRICK = 'brick'
}

export enum HeatingType {
  ELECTRIC = 'electric',
  GAS = 'gas',
  PROPANE = 'propane',
  OIL = 'oil',
  HEAT_PUMP = 'heat_pump'
}

export enum ConditionType {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  NEEDS_WORK = 'needs_work'
}

export enum FinancingType {
  CASH_ONLY = 'cash_only',
  OWNER_FINANCING = 'owner_financing',
  TRADITIONAL_FINANCING = 'traditional_financing',
  ALL_OPTIONS = 'all_options'
}