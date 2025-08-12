export const mockListings = {
  sampleListings: [
    {
      id: 'listing_001',
      listingType: 'manufactured_home',
      inventoryId: 'inv_001',
      offerType: 'for_sale',
      status: 'active',
      year: 2023,
      make: 'Clayton',
      model: 'The Edge',
      serialNumber: 'CLT2023001',
      salePrice: 89000,
      rentPrice: null,
      currency: 'USD',
      description: 'Beautiful 2023 Clayton The Edge manufactured home featuring modern amenities and energy-efficient design. This spacious home offers comfortable living with high-quality finishes throughout.',
      searchResultsText: '2023 Clayton The Edge - Modern Manufactured Home',
      bedrooms: 3,
      bathrooms: 2,
      dimensions: {
        width_ft: 28,
        length_ft: 60,
        sections: 2,
        squareFeet: 1680
      },
      features: {
        roofType: 'Shingle',
        sidingType: 'Vinyl',
        ceilingType: 'Drywall',
        centralAir: true,
        heating: 'Heat Pump',
        appliances: ['Refrigerator', 'Stove', 'Dishwasher', 'Washer/Dryer Hookup'],
        flooring: 'Luxury Vinyl Plank',
        kitchen: 'Modern Kitchen with Island',
        masterBath: 'Garden Tub and Separate Shower'
      },
      location: {
        locationType: 'community',
        communityName: 'Sunset Valley Mobile Home Park',
        address1: '123 Sunset Drive',
        city: 'Phoenix',
        state: 'AZ',
        postalCode: '85001',
        county: 'Maricopa',
        latitude: 33.4484,
        longitude: -112.0740
      },
      media: {
        photos: [
          'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
          'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
          'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
          'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg'
        ],
        primaryPhoto: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
        virtualTour: null
      },
      seller: {
        sellerId: 'seller_001',
        companyName: 'Desert Homes Sales',
        phone: '(602) 555-0123',
        emails: ['sales@deserthomes.com'],
        website: 'https://deserthomes.com'
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z'
    },
    {
      id: 'listing_002',
      listingType: 'rv',
      inventoryId: 'inv_002',
      offerType: 'both',
      status: 'active',
      year: 2022,
      make: 'Forest River',
      model: 'Cherokee',
      vin: 'FR1234567890123456',
      salePrice: 45000,
      rentPrice: 350,
      currency: 'USD',
      description: 'Excellent condition 2022 Forest River Cherokee travel trailer. Perfect for family adventures with all the amenities you need for comfortable camping.',
      searchResultsText: '2022 Forest River Cherokee - Family Travel Trailer',
      condition: 'excellent',
      odometerMiles: 5200,
      vehicleType: 'Travel Trailer',
      sleeps: 6,
      slides: 1,
      dimensions: {
        length_ft: 28.5,
        width_ft: 8,
        height_ft: 11.5
      },
      tanks: {
        freshWater: 43,
        grayWater: 30,
        blackWater: 30,
        propane: 20
      },
      features: {
        generator: false,
        solar: true,
        inverter: true,
        awning: true,
        airConditioning: true,
        heating: 'Furnace',
        kitchen: 'Full Kitchen with Microwave',
        bathroom: 'Full Bath with Shower',
        entertainment: 'LED TV with DVD Player'
      },
      location: {
        address1: '456 RV Sales Blvd',
        city: 'Denver',
        state: 'CO',
        postalCode: '80202',
        latitude: 39.7392,
        longitude: -104.9903
      },
      media: {
        photos: [
          'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg',
          'https://images.pexels.com/photos/2506988/pexels-photo-2506988.jpeg',
          'https://images.pexels.com/photos/2506989/pexels-photo-2506989.jpeg'
        ],
        primaryPhoto: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg'
      },
      seller: {
        sellerId: 'seller_002',
        companyName: 'Mountain RV Center',
        phone: '(303) 555-0456',
        emails: ['info@mountainrv.com'],
        website: 'https://mountainrv.com'
      },
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-18T16:45:00Z'
    },
    {
      id: 'listing_003',
      listingType: 'manufactured_home',
      inventoryId: 'inv_003',
      offerType: 'for_rent',
      status: 'active',
      year: 2021,
      make: 'Fleetwood',
      model: 'Berkshire',
      serialNumber: 'FLT2021003',
      salePrice: null,
      rentPrice: 1200,
      currency: 'USD',
      description: 'Spacious 2021 Fleetwood Berkshire manufactured home available for rent. Features open floor plan and modern appliances in a quiet community setting.',
      searchResultsText: '2021 Fleetwood Berkshire - Rental Home Available',
      bedrooms: 4,
      bathrooms: 2,
      dimensions: {
        width_ft: 32,
        length_ft: 76,
        sections: 2,
        squareFeet: 2432
      },
      features: {
        roofType: 'Metal',
        sidingType: 'Fiber Cement',
        centralAir: true,
        heating: 'Gas Furnace',
        appliances: ['All Appliances Included'],
        flooring: 'Carpet and Tile',
        kitchen: 'Large Kitchen with Pantry',
        masterBath: 'Walk-in Shower'
      },
      location: {
        locationType: 'community',
        communityName: 'Peaceful Pines Community',
        address1: '789 Pine Street',
        city: 'Austin',
        state: 'TX',
        postalCode: '78701',
        county: 'Travis',
        latitude: 30.2672,
        longitude: -97.7431
      },
      media: {
        photos: [
          'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg',
          'https://images.pexels.com/photos/1396133/pexels-photo-1396133.jpeg'
        ],
        primaryPhoto: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg'
      },
      seller: {
        sellerId: 'seller_003',
        companyName: 'Texas Home Rentals',
        phone: '(512) 555-0789',
        emails: ['rentals@texashomes.com']
      },
      createdAt: '2024-01-05T11:00:00Z',
      updatedAt: '2024-01-15T13:20:00Z'
    },
    {
      id: 'listing_004',
      listingType: 'rv',
      inventoryId: 'inv_004',
      offerType: 'for_sale',
      status: 'active',
      year: 2023,
      make: 'Winnebago',
      model: 'Minnie Winnie',
      vin: 'WB9876543210987654',
      salePrice: 125000,
      rentPrice: null,
      currency: 'USD',
      description: 'Brand new 2023 Winnebago Minnie Winnie Class C motorhome. Fully loaded with premium features and ready for your next adventure.',
      searchResultsText: '2023 Winnebago Minnie Winnie - Class C Motorhome',
      condition: 'new',
      odometerMiles: 12,
      vehicleType: 'Class C Motorhome',
      sleeps: 8,
      slides: 2,
      fuelType: 'Gasoline',
      engine: 'Ford V10 6.8L',
      transmission: 'Automatic',
      dimensions: {
        length_ft: 31,
        width_ft: 8.5,
        height_ft: 12.5
      },
      tanks: {
        freshWater: 84,
        grayWater: 41,
        blackWater: 31,
        propane: 24,
        fuel: 55
      },
      features: {
        generator: true,
        solar: true,
        inverter: true,
        awning: true,
        airConditioning: true,
        heating: 'Ducted Furnace',
        kitchen: 'Full Kitchen with Convection Microwave',
        bathroom: 'Full Bath with Skylight',
        entertainment: 'Smart TV with Sound Bar',
        bedroom: 'Queen Bed with Storage'
      },
      location: {
        address1: '321 Motorhome Way',
        city: 'Orlando',
        state: 'FL',
        postalCode: '32801',
        latitude: 28.5383,
        longitude: -81.3792
      },
      media: {
        photos: [
          'https://images.pexels.com/photos/2506924/pexels-photo-2506924.jpeg',
          'https://images.pexels.com/photos/2506925/pexels-photo-2506925.jpeg',
          'https://images.pexels.com/photos/2506926/pexels-photo-2506926.jpeg',
          'https://images.pexels.com/photos/2506927/pexels-photo-2506927.jpeg'
        ],
        primaryPhoto: 'https://images.pexels.com/photos/2506924/pexels-photo-2506924.jpeg'
      },
      seller: {
        sellerId: 'seller_004',
        companyName: 'Florida RV World',
        phone: '(407) 555-0321',
        emails: ['sales@floridarv.com'],
        website: 'https://floridarv.com'
      },
      createdAt: '2024-01-20T08:00:00Z',
      updatedAt: '2024-01-22T10:15:00Z'
    },
    {
      id: 'listing_005',
      listingType: 'manufactured_home',
      inventoryId: 'inv_005',
      offerType: 'for_sale',
      status: 'active',
      year: 2020,
      make: 'Champion',
      model: 'Homes Avalanche',
      serialNumber: 'CHP2020005',
      salePrice: 75000,
      rentPrice: null,
      currency: 'USD',
      description: 'Well-maintained 2020 Champion Homes Avalanche. Perfect starter home with great value and move-in ready condition.',
      searchResultsText: '2020 Champion Homes Avalanche - Starter Home',
      bedrooms: 3,
      bathrooms: 2,
      dimensions: {
        width_ft: 28,
        length_ft: 52,
        sections: 2,
        squareFeet: 1456
      },
      features: {
        roofType: 'Shingle',
        sidingType: 'Vinyl',
        centralAir: true,
        heating: 'Electric Heat Pump',
        appliances: ['Refrigerator', 'Range'],
        flooring: 'Laminate and Carpet'
      },
      location: {
        locationType: 'land',
        address1: '654 Country Road',
        city: 'Nashville',
        state: 'TN',
        postalCode: '37201',
        county: 'Davidson',
        latitude: 36.1627,
        longitude: -86.7816
      },
      media: {
        photos: [
          'https://images.pexels.com/photos/1396134/pexels-photo-1396134.jpeg',
          'https://images.pexels.com/photos/1396135/pexels-photo-1396135.jpeg'
        ],
        primaryPhoto: 'https://images.pexels.com/photos/1396134/pexels-photo-1396134.jpeg'
      },
      seller: {
        sellerId: 'seller_005',
        companyName: 'Music City Homes',
        phone: '(615) 555-0654',
        emails: ['info@musiccityhomes.com']
      },
      createdAt: '2024-01-08T14:00:00Z',
      updatedAt: '2024-01-16T09:30:00Z'
    },
    {
      id: 'listing_006',
      listingType: 'rv',
      inventoryId: 'inv_006',
      offerType: 'for_sale',
      status: 'active',
      year: 2021,
      make: 'Keystone',
      model: 'Cougar',
      vin: 'KS5555666677778888',
      salePrice: 38000,
      rentPrice: null,
      currency: 'USD',
      description: 'Excellent 2021 Keystone Cougar fifth wheel. Spacious layout with residential features and quality construction throughout.',
      searchResultsText: '2021 Keystone Cougar - Fifth Wheel Trailer',
      condition: 'excellent',
      odometerMiles: 8500,
      vehicleType: 'Fifth Wheel',
      sleeps: 4,
      slides: 3,
      dimensions: {
        length_ft: 35,
        width_ft: 8,
        height_ft: 13
      },
      tanks: {
        freshWater: 75,
        grayWater: 65,
        blackWater: 32,
        propane: 30
      },
      features: {
        generator: false,
        solar: false,
        inverter: true,
        awning: true,
        airConditioning: true,
        heating: 'Ducted Furnace',
        kitchen: 'Residential Kitchen with Island',
        bathroom: 'Full Bath with Tub/Shower',
        entertainment: 'Entertainment Center with Fireplace'
      },
      location: {
        address1: '987 Highway 101',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        latitude: 47.6062,
        longitude: -122.3321
      },
      media: {
        photos: [
          'https://images.pexels.com/photos/2506928/pexels-photo-2506928.jpeg',
          'https://images.pexels.com/photos/2506929/pexels-photo-2506929.jpeg'
        ],
        primaryPhoto: 'https://images.pexels.com/photos/2506928/pexels-photo-2506928.jpeg'
      },
      seller: {
        sellerId: 'seller_006',
        companyName: 'Pacific Northwest RV',
        phone: '(206) 555-0987',
        emails: ['sales@pnwrv.com'],
        website: 'https://pnwrv.com'
      },
      createdAt: '2024-01-12T16:00:00Z',
      updatedAt: '2024-01-19T11:45:00Z'
    }
  ]
};

export default mockListings;