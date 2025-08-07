exports.handler = async (event, context) => {
  try {
    // Get query parameters
    const { partnerId, apiKey, listingType, ...customParams } = event.queryStringParameters || {}
    
    // Validate required parameters
    if (!partnerId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Partner ID is required'
        })
      }
    }

    // Get active listings (in a real app, this would come from a database)
    let activeListings = mockListings.filter(listing => listing.status === 'active')
    
    // Filter by listing type if specified (rent/sale)
    if (listingType && ['rent', 'sale'].includes(listingType.toLowerCase())) {
      activeListings = activeListings.filter(listing => 
        listing.listingType === listingType.toLowerCase()
      )
    }
    
    // Generate XML feed for Zillow
    const xmlFeed = generateZillowXML(activeListings, partnerId, customParams)
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
      body: xmlFeed
    }
  } catch (error) {
    console.error('Syndication error:', error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal server error'
      })
    }
  }
}

function generateZillowXML(listings, partnerId, customParams) {
  const currentDate = new Date().toISOString()
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<listings>
  <header>
    <partnerId>${escapeXml(partnerId)}</partnerId>
    <generatedAt>${currentDate}</generatedAt>
    <totalListings>${listings.length}</totalListings>
  </header>
  <properties>`

  listings.forEach(listing => {
    xml += `
    <property>
      <id>${escapeXml(listing.id)}</id>
      <listingType>${escapeXml(listing.listingType || 'rent')}</listingType>
      <title>${escapeXml(listing.title)}</title>
      <description>${escapeXml(generateEnhancedDescription(listing))}</description>
      <address>${escapeXml(listing.address)}</address>
      ${listing.listingType === 'sale' ? 
        `<price>${listing.purchasePrice || listing.rent}</price>` : 
        `<rent>${listing.rent}</rent>`
      }
      ${listing.lotRent ? `<lotRent>${listing.lotRent}</lotRent>` : ''}
      ${listing.hoaFees ? `<hoaFees>${listing.hoaFees}</hoaFees>` : ''}
      <bedrooms>${listing.bedrooms}</bedrooms>
      <bathrooms>${listing.bathrooms}</bathrooms>
      <squareFootage>${listing.squareFootage}</squareFootage>
      <propertyType>${escapeXml(listing.propertyType)}</propertyType>
      ${listing.yearBuilt ? `<yearBuilt>${listing.yearBuilt}</yearBuilt>` : ''}
      <status>${escapeXml(listing.status)}</status>
      <petPolicy>${escapeXml(listing.petPolicy)}</petPolicy>`
    
    // Add MH-specific details if available
    if (listing.mhDetails) {
      xml += `
      <mhDetails>
        ${listing.mhDetails.manufacturer ? `<manufacturer>${escapeXml(listing.mhDetails.manufacturer)}</manufacturer>` : ''}
        ${listing.mhDetails.model ? `<model>${escapeXml(listing.mhDetails.model)}</model>` : ''}
        ${listing.mhDetails.serialNumber ? `<serialNumber>${escapeXml(listing.mhDetails.serialNumber)}</serialNumber>` : ''}
        ${listing.mhDetails.communityName ? `<communityName>${escapeXml(listing.mhDetails.communityName)}</communityName>` : ''}
        ${listing.mhDetails.lotSize ? `<lotSize>${escapeXml(listing.mhDetails.lotSize)}</lotSize>` : ''}
        ${listing.mhDetails.foundation ? `<foundation>${escapeXml(listing.mhDetails.foundation)}</foundation>` : ''}
        ${listing.mhDetails.roofType ? `<roofType>${escapeXml(listing.mhDetails.roofType)}</roofType>` : ''}
        ${listing.mhDetails.exteriorMaterial ? `<exteriorMaterial>${escapeXml(listing.mhDetails.exteriorMaterial)}</exteriorMaterial>` : ''}
        ${listing.mhDetails.hvacType ? `<hvacType>${escapeXml(listing.mhDetails.hvacType)}</hvacType>` : ''}
        ${listing.mhDetails.waterHeaterType ? `<waterHeaterType>${escapeXml(listing.mhDetails.waterHeaterType)}</waterHeaterType>` : ''}
        ${listing.mhDetails.electricalSystem ? `<electricalSystem>${escapeXml(listing.mhDetails.electricalSystem)}</electricalSystem>` : ''}
        ${listing.mhDetails.plumbingType ? `<plumbingType>${escapeXml(listing.mhDetails.plumbingType)}</plumbingType>` : ''}
        ${listing.mhDetails.insulationType ? `<insulationType>${escapeXml(listing.mhDetails.insulationType)}</insulationType>` : ''}
        ${listing.mhDetails.windowType ? `<windowType>${escapeXml(listing.mhDetails.windowType)}</windowType>` : ''}
        ${listing.mhDetails.flooringType ? `<flooringType>${escapeXml(listing.mhDetails.flooringType)}</flooringType>` : ''}
        ${listing.mhDetails.kitchenAppliances ? `<kitchenAppliances>${escapeXml(listing.mhDetails.kitchenAppliances.join(', '))}</kitchenAppliances>` : ''}
        ${listing.mhDetails.laundryHookups ? `<laundryHookups>${listing.mhDetails.laundryHookups}</laundryHookups>` : ''}
        ${listing.mhDetails.internetReady ? `<internetReady>${listing.mhDetails.internetReady}</internetReady>` : ''}
        ${listing.mhDetails.cableReady ? `<cableReady>${listing.mhDetails.cableReady}</cableReady>` : ''}
        ${listing.mhDetails.phoneReady ? `<phoneReady>${listing.mhDetails.phoneReady}</phoneReady>` : ''}
      </mhDetails>`
    }
    
    xml += `
      <amenities>`
    
    listing.amenities.forEach(amenity => {
      xml += `
        <amenity>${escapeXml(amenity)}</amenity>`
    })
    
    xml += `
      </amenities>`
    
    // Add outdoor features if available
    if (listing.outdoorFeatures && listing.outdoorFeatures.length > 0) {
      xml += `
      <outdoorFeatures>`
      listing.outdoorFeatures.forEach(feature => {
        xml += `
        <feature>${escapeXml(feature)}</feature>`
      })
      xml += `
      </outdoorFeatures>`
    }
    
    // Add storage options if available
    if (listing.storageOptions && listing.storageOptions.length > 0) {
      xml += `
      <storageOptions>`
      listing.storageOptions.forEach(option => {
        xml += `
        <option>${escapeXml(option)}</option>`
      })
      xml += `
      </storageOptions>`
    }
    
    // Add technology features if available
    if (listing.technologyFeatures && listing.technologyFeatures.length > 0) {
      xml += `
      <technologyFeatures>`
      listing.technologyFeatures.forEach(feature => {
        xml += `
        <feature>${escapeXml(feature)}</feature>`
      })
      xml += `
      </technologyFeatures>`
    }
    
    // Add community amenities if available
    if (listing.communityAmenities && listing.communityAmenities.length > 0) {
      xml += `
      <communityAmenities>`
      listing.communityAmenities.forEach(amenity => {
        xml += `
        <amenity>${escapeXml(amenity)}</amenity>`
      })
      xml += `
      </communityAmenities>`
    }
    
    xml += `
      <images>`
    
    listing.images.forEach(image => {
      xml += `
        <image>${escapeXml(image)}</image>`
    })
    
    xml += `
      </images>`
    
    // Add videos if available
    if (listing.videos && listing.videos.length > 0) {
      xml += `
      <videos>`
      listing.videos.forEach(video => {
        xml += `
        <video>${escapeXml(video)}</video>`
      })
      xml += `
      </videos>`
    }
    
    // Add floor plans if available
    if (listing.floorPlans && listing.floorPlans.length > 0) {
      xml += `
      <floorPlans>`
      listing.floorPlans.forEach(plan => {
        xml += `
        <floorPlan>${escapeXml(plan)}</floorPlan>`
      })
      xml += `
      </floorPlans>`
    }
    
    // Add virtual tours if available
    if (listing.virtualTours && listing.virtualTours.length > 0) {
      xml += `
      <virtualTours>`
      listing.virtualTours.forEach(tour => {
        xml += `
        <virtualTour>${escapeXml(tour)}</virtualTour>`
      })
      xml += `
      </virtualTours>`
    }
    
    xml += `
      <contact>
        <phone>${escapeXml(listing.contactInfo.phone)}</phone>
        <email>${escapeXml(listing.contactInfo.email)}</email>
      </contact>
      <dates>
        <created>${listing.createdAt}</created>
        <updated>${listing.updatedAt}</updated>
      </dates>
    </property>`
  })

  xml += `
  </properties>
</listings>`

  return xml
}

function generateEnhancedDescription(listing) {
  let description = listing.description || ''
  
  // Add MH-specific details to description if available
  if (listing.mhDetails) {
    const mhDetails = []
    
    if (listing.mhDetails.manufacturer && listing.mhDetails.model) {
      mhDetails.push(`${listing.mhDetails.manufacturer} ${listing.mhDetails.model}`)
    }
    
    if (listing.yearBuilt) {
      mhDetails.push(`Built in ${listing.yearBuilt}`)
    }
    
    if (listing.mhDetails.communityName) {
      mhDetails.push(`Located in ${listing.mhDetails.communityName}`)
    }
    
    if (listing.mhDetails.lotSize) {
      mhDetails.push(`Lot size: ${listing.mhDetails.lotSize}`)
    }
    
    if (listing.mhDetails.foundation) {
      mhDetails.push(`Foundation: ${listing.mhDetails.foundation}`)
    }
    
    if (listing.mhDetails.hvacType) {
      mhDetails.push(`HVAC: ${listing.mhDetails.hvacType}`)
    }
    
    if (mhDetails.length > 0) {
      description += (description ? '\n\n' : '') + 'Manufactured Home Details: ' + mhDetails.join(', ') + '.'
    }
    
    // Add outdoor features to description
    if (listing.outdoorFeatures && listing.outdoorFeatures.length > 0) {
      description += (description ? '\n\n' : '') + 'Outdoor Features: ' + listing.outdoorFeatures.join(', ') + '.'
    }
    
    // Add storage options to description
    if (listing.storageOptions && listing.storageOptions.length > 0) {
      description += (description ? '\n\n' : '') + 'Storage Options: ' + listing.storageOptions.join(', ') + '.'
    }
    
    // Add technology features to description
    if (listing.technologyFeatures && listing.technologyFeatures.length > 0) {
      description += (description ? '\n\n' : '') + 'Technology Features: ' + listing.technologyFeatures.join(', ') + '.'
    }
    
    // Add community amenities to description
    if (listing.communityAmenities && listing.communityAmenities.length > 0) {
      description += (description ? '\n\n' : '') + 'Community Amenities: ' + listing.communityAmenities.join(', ') + '.'
    }
  }
  
  return description
}

function escapeXml(unsafe) {
  if (typeof unsafe !== 'string') {
    return unsafe
  }
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case '\'': return '&apos;'
      case '"': return '&quot;'
    }
  })
}

// Mock data for Netlify function (since we can't import from src in serverless functions)
const mockListings = [
  {
    id: '1',
    listingType: 'rent',
    title: 'Modern Downtown Apartment',
    description: 'Beautiful modern apartment in the heart of downtown with stunning city views. Features include hardwood floors, stainless steel appliances, and in-unit laundry.',
    address: '123 Main St, Downtown, City 12345',
    rent: 2500,
    purchasePrice: null,
    lotRent: null,
    hoaFees: null,
    bedrooms: 2,
    bathrooms: 2,
    squareFootage: 1200,
    yearBuilt: 2020,
    propertyType: 'apartment',
    status: 'active',
    amenities: ['Gym', 'Pool', 'Parking', 'Laundry', 'Balcony'],
    outdoorFeatures: [],
    storageOptions: [],
    technologyFeatures: [],
    communityAmenities: [],
    petPolicy: 'Cats allowed with deposit',
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg',
      'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg'
    ],
    videos: [],
    floorPlans: [],
    virtualTours: [],
    mhDetails: null,
    contactInfo: {
      phone: '(555) 123-4567',
      email: 'contact@propertymanagement.com'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    listingType: 'rent',
    title: 'Cozy Suburban House',
    description: 'Charming 3-bedroom house in quiet suburban neighborhood. Perfect for families with a large backyard and attached garage.',
    address: '456 Oak Ave, Suburbia, City 12346',
    rent: 3200,
    purchasePrice: null,
    lotRent: null,
    hoaFees: null,
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1800,
    yearBuilt: 2015,
    propertyType: 'house',
    status: 'active',
    amenities: ['Garage', 'Backyard', 'Fireplace', 'Dishwasher'],
    outdoorFeatures: ['Backyard', 'Garden'],
    storageOptions: ['Garage', 'Basement'],
    technologyFeatures: [],
    communityAmenities: [],
    petPolicy: 'Dogs and cats welcome',
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg'
    ],
    videos: [],
    floorPlans: [],
    virtualTours: [],
    mhDetails: null,
    contactInfo: {
      phone: '(555) 987-6543',
      email: 'rentals@suburbanproperties.com'
    },
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z'
  },
  {
    id: '3',
    listingType: 'rent',
    title: 'Luxury Waterfront Condo',
    description: 'Stunning waterfront condominium with panoramic water views. Features premium finishes, floor-to-ceiling windows, and resort-style amenities.',
    address: '789 Waterfront Blvd, Marina District, City 12347',
    rent: 4500,
    purchasePrice: null,
    lotRent: null,
    hoaFees: 250,
    bedrooms: 2,
    bathrooms: 3,
    squareFootage: 1600,
    yearBuilt: 2022,
    propertyType: 'condo',
    status: 'active',
    amenities: ['Concierge', 'Pool', 'Gym', 'Valet Parking', 'Rooftop Deck'],
    outdoorFeatures: ['Balcony', 'Rooftop Access'],
    storageOptions: ['Storage Unit'],
    technologyFeatures: ['Smart Home', 'High-Speed Internet'],
    communityAmenities: ['Pool', 'Gym', 'Concierge', 'Rooftop Deck'],
    petPolicy: 'No pets allowed',
    images: [
      'https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg',
      'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg',
      'https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg'
    ],
    videos: [],
    floorPlans: [],
    virtualTours: [],
    mhDetails: null,
    contactInfo: {
      phone: '(555) 456-7890',
      email: 'luxury@waterfrontliving.com'
    },
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-20T09:15:00Z'
  },
  {
    id: '4',
    listingType: 'sale',
    title: '2018 Clayton Manufactured Home - Sunny Acres Community',
    description: 'Beautiful 3-bedroom, 2-bathroom manufactured home in excellent condition. Features modern kitchen with stainless steel appliances, spacious living areas, and master suite with walk-in closet.',
    address: '123 Mobile Home Dr, Sunny Acres Community, City 12348',
    rent: null,
    purchasePrice: 89500,
    lotRent: 450,
    hoaFees: 75,
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1400,
    yearBuilt: 2018,
    propertyType: 'manufactured_home',
    status: 'active',
    amenities: ['Central Air', 'Dishwasher', 'Garbage Disposal', 'Microwave', 'Refrigerator'],
    outdoorFeatures: ['Deck', 'Shed', 'Landscaping', 'Driveway'],
    storageOptions: ['Walk-in Closets', 'Pantry', 'Outdoor Shed'],
    technologyFeatures: ['Cable Ready', 'Internet Ready', 'Phone Ready'],
    communityAmenities: ['Clubhouse', 'Pool', 'Playground', 'Laundry Facility'],
    petPolicy: 'Pets allowed with restrictions',
    mhDetails: {
      manufacturer: 'Clayton Homes',
      model: 'The Breeze II',
      serialNumber: 'CLT123456789',
      communityName: 'Sunny Acres Mobile Home Community',
      lotSize: '60x120',
      foundation: 'Permanent Foundation',
      roofType: 'Architectural Shingles',
      exteriorMaterial: 'Vinyl Siding',
      hvacType: 'Central Air & Heat',
      waterHeaterType: 'Electric Tank',
      electricalSystem: '200 Amp Service',
      plumbingType: 'PEX',
      insulationType: 'Fiberglass Batt',
      windowType: 'Double Pane Vinyl',
      flooringType: 'Laminate & Carpet',
      kitchenAppliances: ['Refrigerator', 'Range', 'Dishwasher', 'Microwave'],
      laundryHookups: true,
      internetReady: true,
      cableReady: true,
      phoneReady: true
    },
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'
    ],
    videos: ['https://www.youtube.com/watch?v=example1'],
    floorPlans: ['https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg'],
    virtualTours: ['https://virtualtour.example.com/tour1'],
    contactInfo: {
      phone: '(555) 234-5678',
      email: 'sales@sunnyacres.com'
    },
    createdAt: '2024-01-25T11:00:00Z',
    updatedAt: '2024-01-25T11:00:00Z'
  }
]