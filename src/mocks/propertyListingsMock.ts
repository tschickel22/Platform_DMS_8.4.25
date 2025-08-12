export interface PropertyListing {
  id: string
  title: string
  description: string
  listingType: 'manufactured_home' | 'rv'
  offerType: 'for_sale' | 'for_rent' | 'both'
  status: 'active' | 'draft' | 'inactive'
  salePrice?: number
  rentPrice?: number
  year: number
  make: string
  model: string
  bedrooms?: number
  bathrooms?: number
  sleeps?: number
  slides?: number
  squareFootage?: number
  length?: number
  location: {
    city: string
    state: string
    address?: string
  }
  media: {
    primaryPhoto: string
    photos: string[]
  }
  createdAt: string
  updatedAt: string
}

export const mockPropertyListings: PropertyListing[] = [
  {
    id: 'listing_1',
    title: 'Modern Downtown Apartment',
    description: 'Beautiful modern apartment in the heart of downtown with stunning city views.',
    listingType: 'manufactured_home',
    offerType: 'for_rent',
    status: 'active',
    rentPrice: 2500,
    year: 2020,
    make: 'Clayton',
    model: 'The Edge',
    bedrooms: 2,
    bathrooms: 2,
    squareFootage: 1200,
    location: {
      city: 'Austin',
      state: 'TX',
      address: '123 Main St'
    },
    media: {
      primaryPhoto: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      photos: []
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'listing_2',
    title: 'Cozy Suburban House',
    description: 'Perfect family home in quiet suburban neighborhood with large backyard.',
    listingType: 'manufactured_home',
    offerType: 'for_sale',
    status: 'active',
    salePrice: 185000,
    year: 2018,
    make: 'Fleetwood',
    model: 'Berkshire',
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1800,
    location: {
      city: 'Suburbia',
      state: 'TX',
      address: '456 Oak Ave'
    },
    media: {
      primaryPhoto: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
      photos: []
    },
    createdAt: '2024-01-14T14:30:00Z',
    updatedAt: '2024-01-14T14:30:00Z'
  },
  {
    id: 'listing_3',
    title: 'Luxury Waterfront Condo',
    description: 'Stunning waterfront condominium with panoramic lake views and premium amenities.',
    listingType: 'manufactured_home',
    offerType: 'both',
    status: 'active',
    salePrice: 450000,
    rentPrice: 4500,
    year: 2022,
    make: 'Champion',
    model: 'Titan',
    bedrooms: 2,
    bathrooms: 3,
    squareFootage: 1600,
    location: {
      city: 'Marina District',
      state: 'TX',
      address: '789 Waterfront Blvd'
    },
    media: {
      primaryPhoto: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800',
      photos: []
    },
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  },
  {
    id: 'listing_4',
    title: '2021 Jayco Jay Flight',
    description: 'Well-maintained travel trailer perfect for family adventures. Sleeps 6 comfortably.',
    listingType: 'rv',
    offerType: 'for_sale',
    status: 'active',
    salePrice: 32000,
    year: 2021,
    make: 'Jayco',
    model: 'Jay Flight',
    sleeps: 6,
    slides: 1,
    length: 28,
    location: {
      city: 'Boise',
      state: 'ID'
    },
    media: {
      primaryPhoto: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
      photos: []
    },
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-12T16:45:00Z'
  },
  {
    id: 'listing_5',
    title: '2019 Forest River Cherokee',
    description: 'Spacious Class A motorhome with all the amenities for comfortable road trips.',
    listingType: 'rv',
    offerType: 'for_rent',
    status: 'active',
    rentPrice: 1100,
    year: 2019,
    make: 'Forest River',
    model: 'Cherokee',
    sleeps: 8,
    slides: 2,
    length: 35,
    location: {
      city: 'Phoenix',
      state: 'AZ'
    },
    media: {
      primaryPhoto: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
      photos: []
    },
    createdAt: '2024-01-11T11:20:00Z',
    updatedAt: '2024-01-11T11:20:00Z'
  },
  {
    id: 'listing_6',
    title: 'Vintage Airstream Classic',
    description: 'Beautifully restored vintage Airstream with modern updates. A true classic!',
    listingType: 'rv',
    offerType: 'for_sale',
    status: 'draft',
    salePrice: 85000,
    year: 1975,
    make: 'Airstream',
    model: 'Classic',
    sleeps: 4,
    slides: 0,
    length: 25,
    location: {
      city: 'Santa Fe',
      state: 'NM'
    },
    media: {
      primaryPhoto: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
      photos: []
    },
    createdAt: '2024-01-10T13:00:00Z',
    updatedAt: '2024-01-10T13:00:00Z'
  },
  {
    id: 'listing_7',
    title: 'Spacious Family Home',
    description: 'Large manufactured home perfect for growing families with open floor plan.',
    listingType: 'manufactured_home',
    offerType: 'for_sale',
    status: 'inactive',
    salePrice: 125000,
    year: 2016,
    make: 'Skyline',
    model: 'Patriot',
    bedrooms: 4,
    bathrooms: 2,
    squareFootage: 2200,
    location: {
      city: 'Riverside',
      state: 'CA',
      address: '321 Family Lane'
    },
    media: {
      primaryPhoto: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      photos: []
    },
    createdAt: '2024-01-09T08:30:00Z',
    updatedAt: '2024-01-09T08:30:00Z'
  },
  {
    id: 'listing_8',
    title: '2023 Grand Design Solitude',
    description: 'Brand new luxury fifth wheel with premium features and spacious interior.',
    listingType: 'rv',
    offerType: 'both',
    status: 'active',
    salePrice: 95000,
    rentPrice: 1800,
    year: 2023,
    make: 'Grand Design',
    model: 'Solitude',
    sleeps: 6,
    slides: 3,
    length: 40,
    location: {
      city: 'Denver',
      state: 'CO'
    },
    media: {
      primaryPhoto: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
      photos: []
    },
    createdAt: '2024-01-08T15:45:00Z',
    updatedAt: '2024-01-08T15:45:00Z'
  }
]

// Helper functions for statistics and filtering
export const getListingStats = () => {
  const totalListings = mockPropertyListings.length
  const activeListings = mockPropertyListings.filter(listing => listing.status === 'active').length
  
  const activePrices = mockPropertyListings
    .filter(listing => listing.status === 'active')
    .map(listing => listing.salePrice || listing.rentPrice || 0)
    .filter(price => price > 0)
  
  const averagePrice = activePrices.length > 0 
    ? Math.round(activePrices.reduce((sum, price) => sum + price, 0) / activePrices.length)
    : 0
  
  const totalValue = activePrices.reduce((sum, price) => sum + price, 0)

  return {
    totalListings,
    activeListings,
    averagePrice,
    totalValue
  }
}

export const filterListings = (
  listings: PropertyListing[],
  searchTerm: string,
  statusFilter: string,
  typeFilter: string,
  priceFilter: string
) => {
  return listings.filter(listing => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${listing.make} ${listing.model}`.toLowerCase().includes(searchTerm.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter

    // Type filter
    const matchesType = typeFilter === 'all' || listing.listingType === typeFilter

    // Price filter
    let matchesPrice = true
    if (priceFilter !== 'all') {
      const price = listing.salePrice || listing.rentPrice || 0
      switch (priceFilter) {
        case 'under_100k':
          matchesPrice = price < 100000
          break
        case '100k_300k':
          matchesPrice = price >= 100000 && price <= 300000
          break
        case 'over_300k':
          matchesPrice = price > 300000
          break
      }
    }

    return matchesSearch && matchesStatus && matchesType && matchesPrice
  })
}