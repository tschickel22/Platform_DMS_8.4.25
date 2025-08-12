export interface PropertyListing {
  id: string
  title: string
  listingType: 'manufactured_home' | 'rv'
  offerType: 'for_sale' | 'for_rent' | 'both'
  status: 'active' | 'draft' | 'inactive'
  salePrice?: number | null
  rentPrice?: number | null
  bedrooms?: number
  bathrooms?: number
  squareFeet?: number
  sleeps?: number
  slides?: number
  year: number
  make: string
  model: string
  vin?: string
  serialNumber?: string
  condition?: 'new' | 'used' | 'certified'
  location: {
    address1: string
    address2?: string
    city: string
    state: string
    postalCode: string
    county?: string
    latitude?: number
    longitude?: number
  }
  media: {
    primaryPhoto: string
    photos: string[]
    virtualTour?: string
  }
  description: string
  searchResultsText?: string
  features?: {
    [key: string]: boolean | string | number
  }
  seller?: {
    companyName: string
    phone: string
    emails: string[]
    website?: string
  }
  createdAt: string
  updatedAt: string
  companyId: string
}

export const mockPropertyListings: PropertyListing[] = [
  {
    id: 'listing_001',
    title: 'Modern Downtown Apartment',
    listingType: 'manufactured_home',
    offerType: 'for_rent',
    status: 'active',
    salePrice: null,
    rentPrice: 2500,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    year: 2020,
    make: 'Clayton',
    model: 'The Edge',
    serialNumber: 'CLT2020001',
    condition: 'new',
    location: {
      address1: '123 Main St',
      city: 'Downtown',
      state: 'CA',
      postalCode: '12345',
      county: 'Los Angeles',
      latitude: 34.0522,
      longitude: -118.2437
    },
    media: {
      primaryPhoto: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      photos: [
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    description: 'Beautiful modern apartment in the heart of downtown with stunning city views and premium amenities.',
    searchResultsText: '2020 Clayton The Edge - Modern Downtown Living',
    features: {
      airConditioning: true,
      heating: true,
      dishwasher: true,
      washerDryer: true,
      parking: true,
      petFriendly: false
    },
    seller: {
      companyName: 'Downtown Properties LLC',
      phone: '(555) 123-4567',
      emails: ['info@downtownprops.com'],
      website: 'https://downtownprops.com'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    companyId: 'company_001'
  },
  {
    id: 'listing_002',
    title: 'Cozy Suburban House',
    listingType: 'manufactured_home',
    offerType: 'for_sale',
    status: 'active',
    salePrice: 320000,
    rentPrice: null,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1800,
    year: 2019,
    make: 'Fleetwood',
    model: 'Berkshire',
    serialNumber: 'FLT2019002',
    condition: 'used',
    location: {
      address1: '456 Oak Ave',
      city: 'Suburbia',
      state: 'CA',
      postalCode: '12346',
      county: 'Orange',
      latitude: 33.7175,
      longitude: -117.8311
    },
    media: {
      primaryPhoto: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
      photos: [
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    description: 'Perfect family home in quiet neighborhood with large backyard and excellent schools nearby.',
    searchResultsText: '2019 Fleetwood Berkshire - Family Home in Suburbia',
    features: {
      airConditioning: true,
      heating: true,
      fireplace: true,
      garage: true,
      backyard: true,
      petFriendly: true
    },
    seller: {
      companyName: 'Suburban Realty Group',
      phone: '(555) 234-5678',
      emails: ['sales@suburbanrealty.com'],
      website: 'https://suburbanrealty.com'
    },
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z',
    companyId: 'company_001'
  },
  {
    id: 'listing_003',
    title: 'Luxury Waterfront Condo',
    listingType: 'rv',
    offerType: 'for_rent',
    status: 'active',
    salePrice: null,
    rentPrice: 4500,
    bedrooms: 2,
    bathrooms: 3,
    squareFeet: 1600,
    sleeps: 4,
    slides: 2,
    year: 2022,
    make: 'Winnebago',
    model: 'View',
    vin: 'WBG123456789',
    condition: 'new',
    location: {
      address1: '789 Waterfront Blvd',
      city: 'Marina District',
      state: 'CA',
      postalCode: '12347',
      county: 'San Francisco',
      latitude: 37.7749,
      longitude: -122.4194
    },
    media: {
      primaryPhoto: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      photos: [
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    description: 'Stunning waterfront views with luxury amenities and premium finishes throughout.',
    searchResultsText: '2022 Winnebago View - Luxury Waterfront Living',
    features: {
      generator: true,
      solar: true,
      awning: true,
      slideouts: true,
      airConditioning: true,
      heating: true
    },
    seller: {
      companyName: 'Waterfront RV Rentals',
      phone: '(555) 345-6789',
      emails: ['rentals@waterfrontrv.com'],
      website: 'https://waterfrontrv.com'
    },
    createdAt: '2024-01-13T10:00:00Z',
    updatedAt: '2024-01-13T10:00:00Z',
    companyId: 'company_001'
  },
  {
    id: 'listing_004',
    title: 'Spacious Family RV',
    listingType: 'rv',
    offerType: 'for_sale',
    status: 'active',
    salePrice: 125000,
    rentPrice: null,
    sleeps: 8,
    slides: 3,
    year: 2021,
    make: 'Forest River',
    model: 'Cherokee',
    vin: 'FR987654321',
    condition: 'used',
    location: {
      address1: '321 RV Park Rd',
      city: 'Riverside',
      state: 'CA',
      postalCode: '12348',
      county: 'Riverside',
      latitude: 33.9533,
      longitude: -117.3962
    },
    media: {
      primaryPhoto: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800',
      photos: [
        'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    description: 'Perfect for family adventures with plenty of space and all the amenities you need.',
    searchResultsText: '2021 Forest River Cherokee - Family Adventure RV',
    features: {
      generator: true,
      solar: false,
      awning: true,
      slideouts: true,
      airConditioning: true,
      heating: true,
      bunkBeds: true
    },
    seller: {
      companyName: 'Adventure RV Sales',
      phone: '(555) 456-7890',
      emails: ['sales@adventurerv.com'],
      website: 'https://adventurerv.com'
    },
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z',
    companyId: 'company_001'
  },
  {
    id: 'listing_005',
    title: 'Compact Studio Home',
    listingType: 'manufactured_home',
    offerType: 'both',
    status: 'draft',
    salePrice: 85000,
    rentPrice: 1200,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 600,
    year: 2018,
    make: 'Champion',
    model: 'Homes',
    serialNumber: 'CHP2018005',
    condition: 'used',
    location: {
      address1: '654 Park Lane',
      city: 'Riverside',
      state: 'CA',
      postalCode: '12349',
      county: 'Riverside',
      latitude: 33.9425,
      longitude: -117.3877
    },
    media: {
      primaryPhoto: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      photos: [
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    description: 'Cozy studio perfect for singles or couples looking for affordable living.',
    searchResultsText: '2018 Champion Homes - Affordable Studio Living',
    features: {
      airConditioning: true,
      heating: true,
      kitchenette: true,
      parking: true
    },
    seller: {
      companyName: 'Affordable Housing Solutions',
      phone: '(555) 567-8901',
      emails: ['info@affordablehousing.com']
    },
    createdAt: '2024-01-11T10:00:00Z',
    updatedAt: '2024-01-11T10:00:00Z',
    companyId: 'company_001'
  }
]

export const mockPropertyListingsData = {
  sampleListings: mockPropertyListings,
  
  // Helper functions
  getActiveListings: () => mockPropertyListings.filter(listing => listing.status === 'active'),
  getListingsByType: (type: 'manufactured_home' | 'rv') => 
    mockPropertyListings.filter(listing => listing.listingType === type),
  getListingsByOfferType: (offerType: 'for_sale' | 'for_rent' | 'both') =>
    mockPropertyListings.filter(listing => listing.offerType === offerType),
  
  // Statistics
  getTotalListings: () => mockPropertyListings.length,
  getActiveCount: () => mockPropertyListings.filter(listing => listing.status === 'active').length,
  getAveragePrice: () => {
    const prices = mockPropertyListings
      .map(listing => listing.salePrice || listing.rentPrice || 0)
      .filter(price => price > 0)
    return prices.length > 0 ? Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length) : 0
  },
  getTotalValue: () => mockPropertyListings
    .reduce((sum, listing) => sum + (listing.salePrice || listing.rentPrice || 0), 0)
}