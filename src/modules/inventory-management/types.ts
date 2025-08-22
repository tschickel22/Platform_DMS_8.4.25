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
  status: 'available' | 'pending' | 'sold' | 'service'
  bedrooms?: number
  bathrooms?: number
  sleeps?: number
  slides?: number
  length?: number
  dimensions?: {
    width_ft?: number
    length_ft?: number
    sections?: number
    sqft?: number
  }
  description?: string
  searchResultsText?: string
  media?: {
    primaryPhoto?: string
    photos?: string[]
  }
  location?: {
    city?: string
    state?: string
    postalCode?: string
    communityName?: string
  }
  features?: Record<string, boolean>
  createdAt: string
  updatedAt: string
}

export interface InventoryFilters {
  search: string
  status: string
  type: string
  priceRange: {
    min: number
    max: number
  }
  location: string
}

export interface InventoryStats {
  total: number
  available: number
  pending: number
  sold: number
  totalValue: number
  avgPrice: number
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
  status: 'available' | 'pending' | 'sold' | 'service'
  bedrooms?: number
  bathrooms?: number
  sleeps?: number
  slides?: number
  length?: number
  description?: string
  city?: string
  state?: string
  postalCode?: string
  communityName?: string
  features?: Record<string, boolean>
}