export const mockListings = {
  sampleListings: [
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
      status: 'active' as const,
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
      status: 'active' as const,
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
      status: 'rented' as const,
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
      title: 'Studio Loft in Arts District',
      description: 'Trendy studio loft in the vibrant arts district. High ceilings, exposed brick, and modern amenities. Walking distance to galleries and restaurants.',
      address: '321 Arts Way, Creative Quarter, City 12348',
      rent: 1800,
      bedrooms: 0,
      bathrooms: 1,
      squareFootage: 650,
      propertyType: 'studio',
      status: 'pending' as const,
      amenities: ['High Ceilings', 'Exposed Brick', 'Modern Kitchen', 'Hardwood Floors'],
      petPolicy: 'Small pets allowed',
      images: [
        'https://images.pexels.com/photos/1571452/pexels-photo-1571452.jpeg',
        'https://images.pexels.com/photos/1571457/pexels-photo-1571457.jpeg'
      ],
      contactInfo: {
        phone: '(555) 234-5678',
        email: 'info@artslofts.com'
      },
      createdAt: '2024-01-25T16:45:00Z',
      updatedAt: '2024-01-25T16:45:00Z'
    },
    {
      id: '5',
      title: 'Family Townhouse with Garage',
      description: 'Spacious 4-bedroom townhouse with attached 2-car garage. Great for families, featuring a private patio and modern appliances.',
      address: '654 Family Lane, Residential Park, City 12349',
      rent: 3800,
      bedrooms: 4,
      bathrooms: 3,
      squareFootage: 2200,
      propertyType: 'townhouse',
      status: 'active' as const,
      amenities: ['2-Car Garage', 'Private Patio', 'Modern Appliances', 'Storage Room'],
      petPolicy: 'Pets welcome with additional deposit',
      images: [
        'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg',
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'
      ],
      contactInfo: {
        phone: '(555) 345-6789',
        email: 'family@townhouserentals.com'
      },
      createdAt: '2024-01-12T11:20:00Z',
      updatedAt: '2024-01-12T11:20:00Z'
    }
  ]
}

// Helper function to get active listings
export function getActiveListings() {
  return mockListings.sampleListings.filter(listing => listing.status === 'active')
}