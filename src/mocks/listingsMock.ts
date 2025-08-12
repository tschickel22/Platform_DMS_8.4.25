export const mockListings: Listing[] = [
  {
    id: 'listing_001',
    inventoryId: 'vh001',
    companyId: 'company_123',
    listingType: 'manufactured_home',
    year: 2023,
    make: 'Clayton',
    model: 'The Edge',
    offerType: 'for_sale',
    salePrice: 89000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1456,
    description: 'Beautiful 3BR/2BA manufactured home with modern finishes and open floor plan. Features include granite countertops, stainless steel appliances, and spacious master suite.',
    searchResultsText: '2023 Clayton The Edge - 3BR/2BA',
    media: {
      primaryPhoto: 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=800',
      photos: [
        'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    location: {
      city: 'Phoenix',
      state: 'AZ',
      postalCode: '85001',
      latitude: 33.4484,
      longitude: -112.0740
    },
    seller: {
      companyName: 'Desert RV Sales',
      phone: '(602) 555-0123',
      emails: ['sales@desertrv.com']
    },
    features: {
      generator: true,
      solar: false,
      awning: true,
      slideOut: true,
      airConditioning: true
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'listing_002', 
    inventoryId: 'vh002',
    companyId: 'company_123',
    listingType: 'rv',
    year: 2022,
    make: 'Forest River',
    model: 'Cherokee',
    offerType: 'both',
    salePrice: 45000,
    rentPrice: 350,
    sleeps: 6,
    length: 28.5,
    slides: 2,
    description: 'Spacious travel trailer perfect for family adventures. Features two slide-outs, full kitchen, and comfortable sleeping for 6.',
    searchResultsText: '2022 Forest River Cherokee - Travel Trailer',
    media: {
      primaryPhoto: 'https://images.pexels.com/photos/2506990/pexels-photo-2506990.jpeg?auto=compress&cs=tinysrgb&w=800',
      photos: [
        'https://images.pexels.com/photos/2506990/pexels-photo-2506990.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2682452/pexels-photo-2682452.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6249526/pexels-photo-6249526.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    location: {
      city: 'Denver',
      state: 'CO',
      postalCode: '80201',
      latitude: 39.7392,
      longitude: -104.9903
    },
    seller: {
      companyName: 'Rocky Mountain RV',
      phone: '(303) 555-0456',
      emails: ['info@rmrv.com']
    },
    features: {
      generator: true,
      solar: true,
      awning: true,
      slideOut: true,
      washerDryer: true
    },
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z'
  },
  {
    id: 'listing_003',
    inventoryId: 'vh003', 
    companyId: 'company_123',
    listingType: 'manufactured_home',
    year: 2024,
    make: 'Skyline',
    model: 'Arrow',
    offerType: 'for_rent',
    rentPrice: 1200,
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 1920,
    description: 'Luxury 4BR/3BA manufactured home with premium upgrades throughout. Island kitchen, walk-in closets, and beautiful landscaping.',
    searchResultsText: '2024 Skyline Arrow - 4BR/3BA',
    media: {
      primaryPhoto: 'https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=800',
      photos: [
        'https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    location: {
      city: 'Austin',
      state: 'TX',
      postalCode: '73301',
      latitude: 30.2672,
      longitude: -97.7431
    },
    seller: {
      companyName: 'Texas RV Depot',
      phone: '(512) 555-0789',
      emails: ['sales@txrvdepot.com']
    },
    features: {
      generator: true,
      solar: false,
      awning: true,
      slideOut: true,
      garage: true
    },
    createdAt: '2024-01-08T09:15:00Z',
    updatedAt: '2024-01-08T09:15:00Z'
  },
  {
    id: 'listing_004',
    inventoryId: 'vh004',
    companyId: 'company_123', 
    listingType: 'rv',
    year: 2021,
    make: 'Winnebago',
    model: 'Minnie Winnie',
    offerType: 'for_sale',
    salePrice: 95000,
    sleeps: 4,
    length: 31,
    slides: 1,
    description: 'Class C motorhome with low miles. Perfect for couples or small families. Features slide-out, full kitchen, and rear bedroom.',
    searchResultsText: '2021 Winnebago Minnie Winnie - Class C',
    media: {
      primaryPhoto: 'https://images.pexels.com/photos/6249526/pexels-photo-6249526.jpeg?auto=compress&cs=tinysrgb&w=800',
      photos: [
        'https://images.pexels.com/photos/6249526/pexels-photo-6249526.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2682452/pexels-photo-2682452.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2506990/pexels-photo-2506990.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    location: {
      city: 'Tampa',
      state: 'FL',
      postalCode: '33601',
      latitude: 27.9506,
      longitude: -82.4572,
      communityName: 'Sunset Palms Mobile Home Community'
    },
    seller: {
      companyName: 'Sunshine Mobile Homes',
      phone: '(813) 555-0234',
      emails: ['info@sunshinemh.com']
    },
    features: {
      centralAir: true,
      fireplace: true,
      dishwasher: true,
      washerDryer: true,
      vaultedCeilings: true
    },
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-12T11:00:00Z'
  },
  {
    id: 'listing_005',
    inventoryId: 'vh005',
    companyId: 'company_123',
    listingType: 'manufactured_home', 
    year: 2020,
    make: 'Champion',
    model: 'Homes Redman',
    offerType: 'for_sale',
    salePrice: 65000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1100,
    description: 'Cozy 2BR/2BA manufactured home in established community. Move-in ready with recent updates and maintenance.',
    searchResultsText: '2020 Champion Redman - 2BR/2BA',
    media: {
      primaryPhoto: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800',
      photos: [
        'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    location: {
      city: 'Nashville',
      state: 'TN',
      postalCode: '37201',
      latitude: 36.1627,
      longitude: -86.7816,
      communityName: 'Country Creek Mobile Home Park'
    },
    seller: {
      companyName: 'Music City Mobile Homes',
      phone: '(615) 555-0567',
      emails: ['sales@musiccitymh.com']
    },
    features: {
      centralAir: true,
      fireplace: false,
      dishwasher: true,
      washerDryer: true,
      vaultedCeilings: true,
      deck: true
    },
    createdAt: '2024-01-09T16:45:00Z',
    updatedAt: '2024-01-09T16:45:00Z'
  },
  {
    id: 'listing_006',
    inventoryId: 'vh006',
    companyId: 'company_123',
    listingType: 'rv',
    year: 2023,
    make: 'Jayco',
    model: 'Jay Flight',
    offerType: 'for_sale', 
    salePrice: 38000,
    sleeps: 8,
    length: 32,
    slides: 1,
    description: 'Family-friendly travel trailer with bunk beds. Great for camping with kids. Features outdoor kitchen and entertainment center.',
    searchResultsText: '2023 Jayco Jay Flight - Bunkhouse',
    media: {
      primaryPhoto: 'https://images.pexels.com/photos/2682452/pexels-photo-2682452.jpeg?auto=compress&cs=tinysrgb&w=800',
      photos: [
        'https://images.pexels.com/photos/2682452/pexels-photo-2682452.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2506990/pexels-photo-2506990.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6249526/pexels-photo-6249526.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    location: {
      city: 'Charlotte',
      state: 'NC',
      postalCode: '28201',
      latitude: 35.2271,
      longitude: -80.8431,
      communityName: 'Pine Valley Mobile Home Community'
    },
    seller: {
      companyName: 'Carolina Mobile Home Sales',
      phone: '(704) 555-0890',
      emails: ['info@carolinamhs.com']
    },
    features: {
      centralAir: true,
      fireplace: false,
      dishwasher: false,
      washerDryer: false,
      vaultedCeilings: false
    },
    createdAt: '2024-01-05T13:20:00Z',
    updatedAt: '2024-01-05T13:20:00Z'
  }
];

export default mockListings;