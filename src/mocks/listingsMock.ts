import { RentalListing, PropertyListing } from '@/types/listings'
import { sampleManufacturedHomes } from './manufacturedHomesMock'

// Convert existing mock data to use new RentalListing type
export const sampleRentalListings: RentalListing[] = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    description: 'Beautiful modern apartment in the heart of downtown with stunning city views. Features include hardwood floors, stainless steel appliances, and in-unit laundry.',
    address: '123 Main St, Downtown, City 12345',
    rent: 2500,
    bedrooms: 2,
    bathrooms: 2,
    squareFootage: 1200,
    propertyType: 'apartment',
    listingType: 'for_rent',
    status: 'active' as const,
    featured: true,
    amenities: ['Gym', 'Pool', 'Parking', 'Laundry', 'Balcony'],
    petPolicy: 'Cats allowed with deposit',
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg',
      'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg'
    ],
    videos: [],
    floorPlans: [
      'https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg'
    ],
    contactInfo: {
      mhVillageAccountKey: 'MHV789012',
      firstName: 'Sarah',
      lastName: 'Johnson',
      companyName: 'Pine Valley Rentals',
      phone: '(555) 345-6789',
      email: 'rentals@pinevalley.com',
      fax: '(555) 345-6790',
      website: 'https://www.pinevalleyrentals.com',
      additionalEmail1: 'office@pinevalley.com',
      additionalEmail2: 'manager@pinevalley.com',
      alternatePhone: '(555) 345-6791'
    },
    isRepossessed: false,
    packageType: 'Standard',
    pendingSale: false,
    searchResultsText: '2020 Champion 4BR/2BA - Family Friendly Community!',
    agentPhotoUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    createdAt: '2024-01-15T10:00:00Z',
    sellerId: 'SELLER_001',
    companyId: 'COMP_001',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    termsOfSale: 'Cash or financing available. Owner will consider reasonable offers.',
    id: '2',
    address2: 'Lot #45',
    city: 'Sunny City',
    state: 'FL',
    zipCode: '12348',
    isRepossessed: false,
    packageType: 'Premium',
    pendingSale: false,
    soldPrice: null,
    searchResultsText: 'Beautiful 2018 Clayton home in family community with pool and clubhouse',
    agentPhotoUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    county: 'Orange County',
    township: 'Sunny Township',
    schoolDistrict: 'Sunny School District',
    latitude: 28.5383,
      modelYear: 2018,
      color: 'Beige with Brown Trim',
    longitude: -81.3792,
      propertyId: 'SA-045',
    title: 'Cozy Suburban House',
      width1: 28,
      length1: 50,
      width2: null,
      length2: null,
      width3: null,
      length3: null,
    description: 'Charming 3-bedroom house in quiet suburban neighborhood. Perfect for families with a large backyard and attached garage.',
    address: '456 Oak Ave, Suburbia, City 12346',
      roofMaterial: 'Asphalt Shingles',
    rent: 3200,
      ceilingMaterial: 'Drywall',
      wallMaterial: 'Drywall',
    monthlyTax: 125,
    monthlyUtilities: 180,
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1800,
    propertyType: 'house',
      thermopaneWindows: true,
    preferredTerm: 'Manufactured Home',
    listingType: 'for_rent',
    status: 'active' as const,
      laundryRoom: true,
    featured: false,
    amenities: ['Garage', 'Backyard', 'Fireplace', 'Dishwasher'],
      phoneReady: true,
      garage: false,
      carport: true,
      centralAir: true,
      fireplace: true,
      storageShed: true,
      gutters: true,
      shutters: true,
      deck: true,
      patio: false,
      cathedralCeilings: true,
      ceilingFans: true,
      skylights: false,
      walkinClosets: true,
      pantry: true,
      sunRoom: false,
      basement: false,
      gardenTub: true,
      garbageDisposal: true,
      refrigeratorIncluded: true,
      microwaveIncluded: true,
      ovenIncluded: true,
      dishwasherIncluded: true,
      washerIncluded: false,
      dryerIncluded: false
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg'
    ],
    videos: [
      'https://www.youtube.com/watch?v=house-tour-456'
    ],
    floorPlans: [],
    contactInfo: {
      phone: '(555) 987-6543',
      mhVillageAccountKey: 'MHV_12345',
      firstName: 'John',
      lastName: 'Smith',
      companyName: 'Sunny Acres Sales',
      email: 'rentals@suburbanproperties.com',
      email: 'sales@sunnyacres.com',
      fax: '(555) 234-5679',
      website: 'https://www.sunnyacres.com',
      additionalEmail1: 'manager@sunnyacres.com',
      additionalEmail2: 'info@sunnyacres.com',
      additionalEmail3: null,
      alternatePhone: '(555) 234-5680'
    termsOfSale: null,
    },
    address2: 'Space #78',
    city: 'Pine City',
    state: 'NC',
    zipCode: '12349',
    county: 'Wake County',
    township: 'Pine Township',
    schoolDistrict: 'Pine Valley School District',
    latitude: 35.7796,
    longitude: -78.6382,
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z'
  },
  {
    monthlyTax: null,
    monthlyUtilities: 220,
    id: '3',
    sellerId: 'SELLER_002',
    companyId: 'COMP_002',
    title: 'Luxury Waterfront Condo',
    preferredTerm: 'Double Wide Mobile Home',
    description: 'Stunning waterfront condominium with panoramic water views. Features premium finishes, floor-to-ceiling windows, and resort-style amenities.',
    address: '789 Waterfront Blvd, Marina District, City 12347',
    rent: 4500,
    bedrooms: 2,
    bathrooms: 3,
    squareFootage: 1600,
    propertyType: 'condo',
    listingType: 'for_rent',
    isRepossessed: false,
    packageType: 'Standard',
    pendingSale: false,
    soldPrice: null,
    searchResultsText: '2020 Champion double wide rental in family community with amenities',
    agentPhotoUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    status: 'active' as const,
    featured: true,
    amenities: ['Concierge', 'Pool', 'Gym', 'Valet Parking', 'Rooftop Deck'],
    petPolicy: 'No pets allowed',
      modelYear: 2020,
      color: 'White with Blue Trim',
    images: [
      propertyId: 'PV-078',
      'https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg',
      width1: 32,
      length1: 56,
      width2: null,
      length2: null,
      width3: null,
      length3: null,
      'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg',
      'https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg'
      roofMaterial: 'Metal',
    ],
      ceilingMaterial: 'Textured Drywall',
      wallMaterial: 'Painted Drywall',
    videos: [
      'https://www.youtube.com/watch?v=luxury-condo-789',
      'https://vimeo.com/waterfront-views-123'
    ],
    floorPlans: [
      'https://images.pexels.com/photos/8293777/pexels-photo-8293777.jpeg',
      thermopaneWindows: true,
      'https://images.pexels.com/photos/8293776/pexels-photo-8293776.jpeg'
    ],
    contactInfo: {
      laundryRoom: true,
      phone: '(555) 456-7890',
      email: 'luxury@waterfrontliving.com',
      phoneReady: true,
      garage: false,
      carport: true,
      centralAir: true,
      fireplace: false,
      storageShed: false,
      gutters: true,
      shutters: false,
      deck: true,
      patio: true,
      cathedralCeilings: false,
      ceilingFans: true,
      skylights: true,
      walkinClosets: true,
      pantry: true,
      sunRoom: false,
      basement: false,
      gardenTub: false,
      garbageDisposal: true,
      refrigeratorIncluded: true,
      microwaveIncluded: true,
      ovenIncluded: true,
      dishwasherIncluded: true,
      mhVillageAccountKey: 'MHV_67890',
      firstName: 'Sarah',
      lastName: 'Johnson',
      companyName: 'Pine Valley Rentals',
      washerIncluded: true,
      email: 'rentals@pinevalley.com',
      fax: '(555) 345-6790',
      website: 'https://www.pinevalleyrentals.com',
      additionalEmail1: 'office@pinevalley.com',
      additionalEmail2: null,
      additionalEmail3: null,
      alternatePhone: '(555) 345-6791'
    },
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-20T09:15:00Z'
  }
]

// Combined listings (rentals + manufactured homes for sale)
export const allPropertyListings: PropertyListing[] = [
  ...sampleRentalListings,
  ...sampleManufacturedHomes
]

// Legacy export for backward compatibility
export const mockListings = sampleRentalListings

// Export organized mock data
export const mockPropertyListings = {
  sampleRentalListings,
  sampleManufacturedHomes,
  allPropertyListings,
  // Legacy
  mockListings
}

// Helper function to get active listings
export function getActiveListings() {
  return mockListings.filter(listing => listing.status === 'active')
}

export const getListingById = (id: string) => {
  return mockListings.find(listing => listing.id === id)
}