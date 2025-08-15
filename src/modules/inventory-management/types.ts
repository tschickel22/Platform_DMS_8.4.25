export interface Vehicle {
  id: string
  listingType: 'rv' | 'manufactured_home'
  inventoryId: string
  year: number
  make: string
  model: string
  vin?: string
  serialNumber?: string
  condition: 'new' | 'used'
  salePrice?: number
  rentPrice?: number
  offerType: 'for_sale' | 'for_rent' | 'both'
  status: 'available' | 'reserved' | 'sold' | 'service'
  
  // RV specific
  sleeps?: number
  slides?: number
  length?: number
  fuelType?: string
  engine?: string
  transmission?: string
  odometerMiles?: number
  
  // Manufactured Home specific
  bedrooms?: number
  bathrooms?: number
  dimensions?: {
    width_ft?: number
    length_ft?: number
    sections?: number
    squareFeet?: number
  }
  
  // Common
  location: {
    city: string
    state: string
    postalCode?: string
    communityName?: string
  }
  
  media?: {
    primaryPhoto?: string
    photos?: string[]
  }
  
  features?: Record<string, boolean>
  description?: string
  searchResultsText?: string
  notes?: string
  
  // Metadata
  createdAt: string
  updatedAt: string
  createdBy?: string
  updatedBy?: string
}

export interface InventoryFilter {
  searchTerm: string
  status: string
  type: string
  priceRange: {
    min?: number
    max?: number
  }
  location?: {
    city?: string
    state?: string
  }
}

export interface InventoryStats {
  totalUnits: number
  availableUnits: number
  reservedUnits: number
  soldUnits: number
  serviceUnits: number
  totalValue: number
  averagePrice: number
  rvCount: number
  mhCount: number
}

export interface VehicleFormData {
  listingType: 'rv' | 'manufactured_home'
  year: number
  make: string
  model: string
  vin?: string
  serialNumber?: string
  condition: 'new' | 'used'
  salePrice?: number
  rentPrice?: number
  offerType: 'for_sale' | 'for_rent' | 'both'
  status: 'available' | 'reserved' | 'sold' | 'service'
  
  // RV specific
  sleeps?: number
  slides?: number
  length?: number
  fuelType?: string
  engine?: string
  transmission?: string
  odometerMiles?: number
  
  // MH specific
  bedrooms?: number
  bathrooms?: number
  squareFeet?: number
  sections?: number
  
  // Location
  city: string
  state: string
  postalCode?: string
  communityName?: string
  
  // Media
  primaryPhoto?: string
  photos?: string[]
  
  // Features
  features?: Record<string, boolean>
  description?: string
  searchResultsText?: string
  notes?: string
}

export enum VehicleStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  SOLD = 'sold',
  SERVICE = 'service'
}

export enum VehicleCondition {
  NEW = 'new',
  USED = 'used'
}

export enum OfferType {
  FOR_SALE = 'for_sale',
  FOR_RENT = 'for_rent',
  BOTH = 'both'
}

export enum ListingType {
  RV = 'rv',
  MANUFACTURED_HOME = 'manufactured_home'
}