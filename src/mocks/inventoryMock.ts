export const mockInventory = {
  sampleVehicles: [
    // RV Listings with appropriate RV images
    {
      id: 'rv001',
      listingType: 'rv',
      inventoryId: 'INV-RV-001',
      year: 2023,
      make: 'Forest River',
      model: 'Cherokee',
      vin: 'FR123456789',
      condition: 'new',
      salePrice: 45000,
      rentPrice: 350,
      offerType: 'both',
      status: 'available',
      sleeps: 4,
      slides: 1,
      length: 28.5,
      fuelType: 'gasoline',
      engine: 'Ford V10',
      transmission: 'Automatic',
      description: 'Beautiful 2023 Forest River Cherokee travel trailer with slide-out. Perfect for family camping adventures.',
      searchResultsText: '2023 Forest River Cherokee - 28ft Travel Trailer',
      media: {
        primaryPhoto: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800',
        photos: [
          'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/2356086/pexels-photo-2356086.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]
      },
      location: {
        city: 'Phoenix',
        state: 'AZ',
        postalCode: '85001'
      },
      features: {
        generator: true,
        solar: false,
        awning: true,
        slideOut: true
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'rv002',
      listingType: 'rv',
      inventoryId: 'INV-RV-002',
      year: 2022,
      make: 'Thor',
      model: 'Ace',
      vin: 'TH987654321',
      condition: 'used',
      salePrice: 85000,
      offerType: 'for_sale',
      status: 'available',
      sleeps: 6,
      slides: 2,
      length: 32.0,
      fuelType: 'diesel',
      engine: 'Cummins ISL',
      transmission: 'Automatic',
      odometerMiles: 15000,
      description: 'Well-maintained 2022 Thor Ace Class A motorhome. Low mileage, excellent condition.',
      searchResultsText: '2022 Thor Ace - 32ft Class A Motorhome',
      media: {
        primaryPhoto: 'https://images.pexels.com/photos/2339009/pexels-photo-2339009.jpeg?auto=compress&cs=tinysrgb&w=800',
        photos: [
          'https://images.pexels.com/photos/2339009/pexels-photo-2339009.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1428277/pexels-photo-1428277.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/2339010/pexels-photo-2339010.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]
      },
      location: {
        city: 'Denver',
        state: 'CO',
        postalCode: '80201'
      },
      features: {
        generator: true,
        solar: true,
        awning: true,
        slideOut: true
      },
      createdAt: '2024-01-10T14:30:00Z',
      updatedAt: '2024-01-10T14:30:00Z'
    },
    {
      id: 'rv003',
      listingType: 'rv',
      inventoryId: 'INV-RV-003',
      year: 2021,
      make: 'Grand Design',
      model: 'Momentum',
      vin: 'GD456789123',
      condition: 'used',
      salePrice: 62000,
      offerType: 'for_sale',
      status: 'available',
      sleeps: 8,
      slides: 3,
      length: 35.0,
      description: 'Spacious toy hauler fifth wheel with garage space. Perfect for outdoor enthusiasts.',
      searchResultsText: '2021 Grand Design Momentum - 35ft Toy Hauler',
      media: {
        primaryPhoto: 'https://images.pexels.com/photos/2356002/pexels-photo-2356002.jpeg?auto=compress&cs=tinysrgb&w=800',
        photos: [
          'https://images.pexels.com/photos/2356002/pexels-photo-2356002.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]
      },
      location: {
        city: 'Austin',
        state: 'TX',
        postalCode: '73301'
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
    // Manufactured Home listings with appropriate MH images
    {
      id: 'mh001',
      listingType: 'manufactured_home',
      inventoryId: 'INV-MH-001',
      year: 2023,
      make: 'Clayton',
      model: 'The Edge',
      serialNumber: 'CL987654321',
      condition: 'new',
      salePrice: 95000,
      rentPrice: 1200,
      offerType: 'both',
      status: 'available',
      bedrooms: 3,
      bathrooms: 2,
      dimensions: {
        width_ft: 28,
        length_ft: 66,
        sections: 2
      },
      description: 'Brand new 2023 Clayton double-wide manufactured home. Modern finishes and energy-efficient features.',
      searchResultsText: '2023 Clayton The Edge - 3BR/2BA Double-wide',
      media: {
        primaryPhoto: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=800',
        photos: [
          'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1546166/pexels-photo-1546166.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/2462014/pexels-photo-2462014.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]
      },
      location: {
        city: 'Tampa',
        state: 'FL',
        postalCode: '33601',
        communityName: 'Sunset Palms Mobile Home Community'
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
      id: 'mh002',
      listingType: 'manufactured_home',
      inventoryId: 'INV-MH-002',
      year: 2022,
      make: 'Champion',
      model: 'Titan',
      serialNumber: 'CH123456789',
      condition: 'used',
      salePrice: 75000,
      offerType: 'for_sale',
      status: 'available',
      bedrooms: 4,
      bathrooms: 2,
      dimensions: {
        width_ft: 28,
        length_ft: 76,
        sections: 2
      },
      description: 'Spacious 4-bedroom Champion Titan in excellent condition. Recently updated kitchen and bathrooms.',
      searchResultsText: '2022 Champion Titan - 4BR/2BA Double-wide',
      media: {
        primaryPhoto: 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=800',
        photos: [
          'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/2462014/pexels-photo-2462014.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]
      },
      location: {
        city: 'Nashville',
        state: 'TN',
        postalCode: '37201',
        communityName: 'Country Creek Mobile Home Park'
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
      id: 'mh003',
      listingType: 'manufactured_home',
      inventoryId: 'INV-MH-003',
      year: 2020,
      make: 'Fleetwood',
      model: 'Berkshire',
      serialNumber: 'FL456789012',
      condition: 'used',
      salePrice: 58000,
      offerType: 'for_sale',
      status: 'available',
      bedrooms: 2,
      bathrooms: 1,
      dimensions: {
        width_ft: 14,
        length_ft: 70,
        sections: 1
      },
      description: 'Cozy single-wide manufactured home perfect for downsizing or first-time buyers. Well-maintained with updates.',
      searchResultsText: '2020 Fleetwood Berkshire - 2BR/1BA Single-wide',
      media: {
        primaryPhoto: 'https://images.pexels.com/photos/1546166/pexels-photo-1546166.jpeg?auto=compress&cs=tinysrgb&w=800',
        photos: [
          'https://images.pexels.com/photos/1546166/pexels-photo-1546166.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/2462014/pexels-photo-2462014.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]
      },
      location: {
        city: 'Charlotte',
        state: 'NC',
        postalCode: '28201',
        communityName: 'Pine Valley Mobile Home Community'
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
    },
    {
      id: 'mh004',
      listingType: 'manufactured_home',
      inventoryId: 'INV-MH-004',
      year: 2024,
      make: 'Skyline',
      model: 'Arrow',
      serialNumber: 'SK789012345',
      condition: 'new',
      salePrice: 125000,
      offerType: 'for_sale',
      status: 'available',
      bedrooms: 3,
      bathrooms: 2,
      dimensions: {
        width_ft: 32,
        length_ft: 80,
        sections: 2
      },
      description: 'Premium new 2024 Skyline Arrow with luxury finishes. Energy Star certified with modern amenities.',
      searchResultsText: '2024 Skyline Arrow - 3BR/2BA Premium Double-wide',
      media: {
        primaryPhoto: 'https://images.pexels.com/photos/2462014/pexels-photo-2462014.jpeg?auto=compress&cs=tinysrgb&w=800',
        photos: [
          'https://images.pexels.com/photos/2462014/pexels-photo-2462014.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1546166/pexels-photo-1546166.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]
      },
      location: {
        city: 'Orlando',
        state: 'FL',
        postalCode: '32801',
        communityName: 'Lakeside Manor Mobile Home Resort'
      },
      features: {
        centralAir: true,
        fireplace: true,
        dishwasher: true,
        washerDryer: true,
        vaultedCeilings: true,
        deck: true,
        shed: true,
        energyStar: true
      },
      createdAt: '2024-01-18T08:30:00Z',
      updatedAt: '2024-01-18T08:30:00Z'
    }
  ],
  
  // Helper function to get vehicles by type
  getVehiclesByType: function(type) {
    return this.sampleVehicles.filter(vehicle => vehicle.listingType === type);
  },
  
  // Helper function to get vehicles by status
  getVehiclesByStatus: function(status) {
    return this.sampleVehicles.filter(vehicle => vehicle.status === status);
  },
  
  // Helper function to get vehicles by offer type
  getVehiclesByOfferType: function(offerType) {
    return this.sampleVehicles.filter(vehicle => vehicle.offerType === offerType || vehicle.offerType === 'both');
  }
};

export default mockInventory;