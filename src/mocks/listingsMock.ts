// Mock data for property listings
export interface PropertyListing {
  id: string
  title: string
  description: string
  address: string
  rent: number
  bedrooms: number
  bathrooms: number
  squareFootage: number
  propertyType: 'apartment' | 'house' | 'condo' | 'townhouse'
  status: 'active' | 'inactive' | 'pending' | 'rented'
  amenities: string[]
  petPolicy: string
  images: string[]
  contactInfo: {
    phone: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export const mockListings: PropertyListing[] = [
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
    status: 'active',
    amenities: ['Gym', 'Pool', 'Parking', 'Laundry', 'Balcony'],
    petPolicy: 'Cats allowed with deposit',
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg',
      'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg'
    ],
    contactInfo: {
      phone: '(555) 123-4567',
      email: 'contact@propertymanagement.com'
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
    status: 'active',
    amenities: ['Garage', 'Backyard', 'Fireplace', 'Dishwasher'],
    petPolicy: 'Dogs and cats welcome',
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg'
    ],
    contactInfo: {
      phone: '(555) 987-6543',
      email: 'rentals@suburbanproperties.com'
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
    status: 'active',
    amenities: ['Concierge', 'Pool', 'Gym', 'Valet Parking', 'Rooftop Deck'],
    petPolicy: 'No pets allowed',
    images: [
      'https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg',
      'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg',
      'https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg'
    ],
    contactInfo: {
      phone: '(555) 456-7890',
      email: 'luxury@waterfrontliving.com'
    },
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-20T09:15:00Z'
  },
  {
    id: '4',
    title: 'Historic Townhouse',
    description: 'Beautifully restored historic townhouse with original architectural details. Located in the charming historic district.',
    address: '321 Heritage Lane, Historic District, City 12348',
    rent: 2800,
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1500,
    propertyType: 'townhouse',
    status: 'pending',
    amenities: ['Historic Features', 'Courtyard', 'Updated Kitchen', 'Hardwood Floors'],
    petPolicy: 'Small pets considered',
    images: [
      'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg',
      'https://images.pexels.com/photos/1396125/pexels-photo-1396125.jpeg',
      'https://images.pexels.com/photos/1396119/pexels-photo-1396119.jpeg'
    ],
    contactInfo: {
      phone: '(555) 234-5678',
      email: 'historic@heritagehomes.com'
    },
    createdAt: '2024-01-05T16:45:00Z',
    updatedAt: '2024-01-22T11:20:00Z'
  }
]

export const getActiveListings = () => mockListings.filter(listing => listing.status === 'active')
export const getListingById = (id: string) => mockListings.find(listing => listing.id === id)