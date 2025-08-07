// Re-export types from the main types file for module-specific use
export * from '@/types/listings'

// Module-specific types can be added here if needed
export interface ListingFilters {
  listingType?: 'for_rent' | 'for_sale' | 'all'
  priceMin?: number
  priceMax?: number
  bedrooms?: number
  bathrooms?: number
  propertyType?: string
  homeType?: string
  locationType?: string
  condition?: string
  financing?: string
  features?: string[]
  status?: string
}

export interface ListingSearchParams {
  query?: string
  filters?: ListingFilters
  sortBy?: 'price' | 'date' | 'bedrooms' | 'bathrooms' | 'squareFootage'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface ListingStats {
  totalListings: number
  activeListings: number
  rentals: number
  sales: number
  averageRent?: number
  averageSalePrice?: number
  featuredListings: number
}