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
      phone: '(555) 123-4567',
      email: 'contact@propertymanagement.com',
      name: 'Downtown Property Management'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Cozy Suburban House',
    description: 'Charming 3-bedroom house in quiet suburban neighborhood. Perfect for families with a large backyard and attached garage.',
    address: '456 Oak Ave, Suburbia, City 12346',
    rent: 3200,
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1800,
    propertyType: 'house',
    listingType: 'for_rent',
    status: 'active' as const,
    featured: false,
    amenities: ['Garage', 'Backyard', 'Fireplace', 'Dishwasher'],
    petPolicy: 'Dogs and cats welcome',
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
      email: 'rentals@suburbanproperties.com',
      name: 'Suburban Properties LLC'
    },
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z'
  },
  {
    id: '3',
    title: 'Luxury Waterfront Condo',
    description: 'Stunning waterfront condominium with panoramic water views. Features premium finishes, floor-to-ceiling windows, and resort-style amenities.',
    address: '789 Waterfront Blvd, Marina District, City 12347',
    rent: 4500,
    bedrooms: 2,
    bathrooms: 3,
    squareFootage: 1600,
    propertyType: 'condo',
    listingType: 'for_rent',
    status: 'active' as const,
    featured: true,
    amenities: ['Concierge', 'Pool', 'Gym', 'Valet Parking', 'Rooftop Deck'],
    petPolicy: 'No pets allowed',
    images: [
      'https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg',
      'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg',
      'https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg'
    ],
    videos: [
      'https://www.youtube.com/watch?v=luxury-condo-789',
      'https://vimeo.com/waterfront-views-123'
    ],
    floorPlans: [
      'https://images.pexels.com/photos/8293777/pexels-photo-8293777.jpeg',
      'https://images.pexels.com/photos/8293776/pexels-photo-8293776.jpeg'
    ],
    contactInfo: {
      phone: '(555) 456-7890',
      email: 'luxury@waterfrontliving.com',
      name: 'Waterfront Living Management'
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