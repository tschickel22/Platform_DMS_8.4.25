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
  lotNumber?: string
  
  // Home Specifications
  homeType: 'single_wide' | 'double_wide' | 'triple_wide' | 'modular'
  make: string
  model: string
  year: number
  bedrooms: number
  bathrooms: number
  squareFootage: number
  
  // Construction Details
  roofType: 'metal' | 'shingle' | 'rubber' | 'tile'
  sidingType: 'vinyl' | 'wood' | 'metal' | 'fiber_cement' | 'brick'
  
  // Features & Amenities
  garage: boolean
  carport: boolean
  shed: boolean
  deck: boolean
  porch: boolean
  centralAir: boolean
  heating: 'electric' | 'gas' | 'propane' | 'oil' | 'heat_pump'
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