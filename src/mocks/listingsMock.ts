export const mockListings = {
  sampleListings: [
    // RV Listings
    {
      id: 'listing-rv-001',
      companyId: 'company-001',
      listingType: 'rv',
      inventoryId: 'rv001',
      year: 2023,
      make: 'Forest River',
      model: 'Cherokee',
      searchResultsText: '2023 Forest River Cherokee Travel Trailer',
      description: 'Beautiful 2023 Forest River Cherokee travel trailer with slide-out. Perfect for family camping adventures with modern amenities and comfortable sleeping for 4.',
      salePrice: 45000,
      rentPrice: 350,
      offerType: 'both',
      status: 'active',
      condition: 'new',
      vin: 'FR123456789',
      sleeps: 4,
      slides: 1,
      length: 28.5,
      fuelType: 'towable',
      media: {
        primaryPhoto: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1200',
        photos: [
          'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1200',
          'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=1200',
          'https://images.pexels.com/photos/2356086/pexels-photo-2356086.jpeg?auto=compress&cs=tinysrgb&w=1200'
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
      id: 'listing-rv-002',
      companyId: 'company-001',
      listingType: 'rv',
      inventoryId: 'rv002',
      year: 2022,
      make: 'Thor',
      model: 'Ace',
      searchResultsText: '2022 Thor Ace Class A Motorhome',
      description: 'Well-maintained 2022 Thor Ace Class A motorhome with low mileage. Features two slide-outs, diesel engine, and luxury interior appointments.',
      salePrice: 85000,
      offerType: 'for_sale',
      status: 'active',
      condition: 'used',
      vin: 'TH987654321',
      sleeps: 6,
      slides: 2,
      length: 32.0,
      fuelType: 'diesel',
      odometerMiles: 15000,
      media: {
        primaryPhoto: 'https://images.pexels.com/photos/2339009/pexels-photo-2339009.jpeg?auto=compress&cs=tinysrgb&w=1200',
        photos: [
          'https://images.pexels.com/photos/2339009/pexels-photo-2339009.jpeg?auto=compress&cs=tinysrgb&w=1200',
          'https://images.pexels.com/photos/1428277/pexels-photo-1428277.jpeg?auto=compress&cs=tinysrgb&w=1200',
          'https://images.pexels.com/photos/2339010/pexels-photo-2339010.jpeg?auto=compress&cs=tinysrgb&w=1200'
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
      id: 'listing-rv-003',
      companyId: 'company-001',
      listingType: 'rv',
      inventoryId: 'rv003',
      year: 2021,
      make: 'Grand Design',
      model: 'Momentum',
      searchResultsText: '2021 Grand Design Momentum Toy Hauler',
      description: 'Spacious toy hauler fifth wheel with garage space perfect for outdoor enthusiasts. Three slide-outs provide maximum living space.',
      salePrice: 62000,
      offerType: 'for_sale',
      status: 'active',
      condition: 'used',
      vin: 'GD456789123',
      sleeps: 8,
      slides: 3,
      length: 35.0,
      media: {
        primaryPhoto: 'https://images.pexels.com/photos/2356002/pexels-photo-2356002.jpeg?auto=compress&cs=tinysrgb&w=1200',
        photos: [
          'https://images.pexels.com/photos/2356002/pexels-photo-2356002.jpeg?auto=compress&cs=tinysrgb&w=1200',
          'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=1200'
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
    // Manufactured Home Listings
    {
      id: 'listing-mh-001',
      companyId: 'company-001',
      listingType: 'manufactured_home',
      inventoryId: 'mh001',
      year: 2023,
      make: 'Clayton',
      model: 'The Edge',
      searchResultsText: '2023 Clayton The Edge 3BR/2BA Double-wide',
      description: 'Brand new 2023 Clayton double-wide manufactured home featuring modern finishes, energy-efficient appliances, and open floor plan.',
      salePrice: 95000,
      rentPrice: 1200,
      offerType: 'both',
      status: 'active',
      condition: 'new',
      serialNumber: 'CL987654321',
      bedrooms: 3,
      bathrooms: 2,
      dimensions: {
        width_ft: 28,
        length_ft: 66,
        sections: 2
      },
      media: {
        primaryPhoto: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1200',
        photos: [
          'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1200',
          'https://images.pexels.com/photos/1546166/pexels-photo-1546166.jpeg?auto=compress&cs=tinysrgb&w=1200',
          'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=1200',
          'https://images.pexels.com/photos/2462014/pexels-photo-2462014.jpeg?auto=compress&cs=tinysrgb&w=1200'
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
      id: 'listing-mh-002',
      companyId: 'company-001',
      listingType: 'manufactured_home',
      inventoryId: 'mh002',
      year: 2022,
      make: 'Champion',
      model: 'Titan',
      searchResultsText: '2022 Champion Titan 4BR/2BA Double-wide',
      description: 'Spacious 4-bedroom Champion Titan in excellent condition with recently updated kitchen and bathrooms. Located in established community.',
      salePrice: 75000,
      offerType: 'for_sale',
      status: 'active',
      condition: 'used',
      serialNumber: 'CH123456789',
      bedrooms: 4,
      bathrooms: 2,
      dimensions: {
        width_ft: 28,
        length_ft: 76,
        sections: 2
      },
      media: {
        primaryPhoto: 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=1200',
        photos: [
          'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=1200',
          'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1200',
          'https://images.pexels.com/photos/2462014/pexels-photo-2462014.jpeg?auto=compress&cs=tinysrgb&w=1200'
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
      id: 'listing-mh-003',
      companyId: 'company-001',
      listingType: 'manufactured_home',
      inventoryId: 'mh003',
      year: 2020,
      make: 'Fleetwood',
      model: 'Berkshire',
      searchResultsText: '2020 Fleetwood Berkshire 2BR/1BA Single-wide',
      description: 'Cozy single-wide manufactured home perfect for downsizing or first-time buyers. Well-maintained with recent updates throughout.',
      salePrice: 58000,
      offerType: 'for_sale',
      status: 'active',
      condition: 'used',
      serialNumber: 'FL456789012',
      bedrooms: 2,
      bathrooms: 1,
      dimensions: {
        width_ft: 14,
        length_ft: 70,
        sections: 1
      },
      media: {
        primaryPhoto: 'https://images.pexels.com/photos/1546166/pexels-photo-1546166.jpeg?auto=compress&cs=tinysrgb&w=1200',
        photos: [
          'https://images.pexels.com/photos/1546166/pexels-photo-1546166.jpeg?auto=compress&cs=tinysrgb&w=1200',
          'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=1200'
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
  ],
  
  // Helper functions
  getListingsByType: function(type) {
    return this.sampleListings.filter(listing => listing.listingType === type);
  },
  
  getActiveListings: function() {
    return this.sampleListings.filter(listing => listing.status === 'active');
  },
  
  getListingsByOfferType: function(offerType) {
    return this.sampleListings.filter(listing => 
      listing.offerType === offerType || listing.offerType === 'both'
    );
  }
};

export default mockListings;