exports.handler = async (event, context) => {
  try {
    // Get query parameters
    const { partnerId, apiKey, ...customParams } = event.queryStringParameters || {}
    
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

    // Get active MH listings only
    const mhListings = mockListings.filter(listing => 
      listing.status === 'active' && 
      listing.propertyType === 'manufactured_home'
    )
    
    // Generate XML feed for MHVillage
    const xmlFeed = generateMHVillageXML(mhListings, partnerId, customParams)
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
      body: xmlFeed
    }
  } catch (error) {
    console.error('MHVillage syndication error:', error)
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

function generateMHVillageXML(listings, partnerId, customParams) {
  const currentDate = new Date().toISOString()
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<mhListings>
  <header>
    <partnerId>${escapeXml(partnerId)}</partnerId>
    <generatedAt>${currentDate}</generatedAt>
    <totalListings>${listings.length}</totalListings>
    <feedType>MHVillage</feedType>
  </header>
  <homes>`

  listings.forEach(listing => {
    const mh = listing.mhDetails || {}
    
    xml += `
    <home>
      <id>${escapeXml(listing.id)}</id>
      <listingType>${escapeXml(listing.listingType || 'sale')}</listingType>
      <title>${escapeXml(listing.title)}</title>
      <description>${escapeXml(listing.description)}</description>
      
      <!-- Location Information -->
      <location>
        <address>${escapeXml(listing.address)}</address>
        <communityName>${escapeXml(mh.communityName || '')}</communityName>
      </location>
      
      <!-- Pricing Information -->
      <pricing>
        ${listing.listingType === 'sale' ? 
          `<salePrice>${listing.purchasePrice || 0}</salePrice>` : 
          `<rentPrice>${listing.rent || 0}</rentPrice>`
        }
        ${listing.lotRent ? `<lotRent>${listing.lotRent}</lotRent>` : ''}
        ${listing.hoaFees ? `<hoaFees>${listing.hoaFees}</hoaFees>` : ''}
      </pricing>
      
      <!-- Basic Home Information -->
      <homeDetails>
        <manufacturer>${escapeXml(mh.manufacturer || '')}</manufacturer>
        <model>${escapeXml(mh.model || '')}</model>
        <serialNumber>${escapeXml(mh.serialNumber || '')}</serialNumber>
        <yearBuilt>${listing.yearBuilt || ''}</yearBuilt>
        <bedrooms>${listing.bedrooms}</bedrooms>
        <bathrooms>${listing.bathrooms}</bathrooms>
        <squareFootage>${listing.squareFootage}</squareFootage>
        <lotSize>${escapeXml(mh.lotSize || '')}</lotSize>
      </homeDetails>
      
      <!-- Construction Details -->
      <construction>
        <foundation>${escapeXml(mh.foundation || '')}</foundation>
        <roofType>${escapeXml(mh.roofType || '')}</roofType>
        <exteriorMaterial>${escapeXml(mh.exteriorMaterial || '')}</exteriorMaterial>
        <insulationType>${escapeXml(mh.insulationType || '')}</insulationType>
        <windowType>${escapeXml(mh.windowType || '')}</windowType>
        <flooringType>${escapeXml(mh.flooringType || '')}</flooringType>
      </construction>
      
      <!-- Systems -->
      <systems>
        <hvacType>${escapeXml(mh.hvacType || '')}</hvacType>
        <waterHeaterType>${escapeXml(mh.waterHeaterType || '')}</waterHeaterType>
        <electricalSystem>${escapeXml(mh.electricalSystem || '')}</electricalSystem>
        <plumbingType>${escapeXml(mh.plumbingType || '')}</plumbingType>
      </systems>
      
      <!-- Utilities & Technology -->
      <utilities>
        <laundryHookups>${mh.laundryHookups || false}</laundryHookups>
        <internetReady>${mh.internetReady || false}</internetReady>
        <cableReady>${mh.cableReady || false}</cableReady>
        <phoneReady>${mh.phoneReady || false}</phoneReady>
      </utilities>
      
      <!-- Appliances -->
      <appliances>`
    
    if (mh.kitchenAppliances && mh.kitchenAppliances.length > 0) {
      mh.kitchenAppliances.forEach(appliance => {
        xml += `
        <appliance>${escapeXml(appliance)}</appliance>`
      })
    }
    
    xml += `
      </appliances>
      
      <!-- Features -->
      <features>`
    
    if (listing.amenities && listing.amenities.length > 0) {
      listing.amenities.forEach(amenity => {
        xml += `
        <feature type="interior">${escapeXml(amenity)}</feature>`
      })
    }
    
    if (listing.outdoorFeatures && listing.outdoorFeatures.length > 0) {
      listing.outdoorFeatures.forEach(feature => {
        xml += `
        <feature type="outdoor">${escapeXml(feature)}</feature>`
      })
    }
    
    if (listing.storageOptions && listing.storageOptions.length > 0) {
      listing.storageOptions.forEach(option => {
        xml += `
        <feature type="storage">${escapeXml(option)}</feature>`
      })
    }
    
    if (listing.technologyFeatures && listing.technologyFeatures.length > 0) {
      listing.technologyFeatures.forEach(feature => {
        xml += `
        <feature type="technology">${escapeXml(feature)}</feature>`
      })
    }
    
    xml += `
      </features>
      
      <!-- Community Amenities -->
      <communityAmenities>`
    
    if (listing.communityAmenities && listing.communityAmenities.length > 0) {
      listing.communityAmenities.forEach(amenity => {
        xml += `
        <amenity>${escapeXml(amenity)}</amenity>`
      })
    }
    
    xml += `
      </communityAmenities>
      
      <!-- Media -->
      <media>
        <images>`
    
    listing.images.forEach(image => {
      xml += `
          <image>${escapeXml(image)}</image>`
    })
    
    xml += `
        </images>`
    
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
      </media>
      
      <!-- Contact Information -->
      <contact>
        <phone>${escapeXml(listing.contactInfo.phone)}</phone>
        <email>${escapeXml(listing.contactInfo.email)}</email>
      </contact>
      
      <!-- Pet Policy -->
      <petPolicy>${escapeXml(listing.petPolicy)}</petPolicy>
      
      <!-- Dates -->
      <dates>
        <created>${listing.createdAt}</created>
        <updated>${listing.updatedAt}</updated>
      </dates>
      
      <status>${escapeXml(listing.status)}</status>
    </home>`
  })

  xml += `
  </homes>
</mhListings>`

  return xml
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

// Mock data for MHVillage function
const mockListings = [
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
  },
  {
    id: '5',
    listingType: 'rent',
    title: '2020 Champion Double Wide - Pine Valley Community',
    description: 'Spacious double wide manufactured home for rent in family-friendly community. Features open floor plan, modern appliances, and large master bedroom.',
    address: '456 Pine Valley Rd, Pine Valley MH Park, City 12349',
    rent: 1200,
    purchasePrice: null,
    lotRent: null,
    hoaFees: 50,
    bedrooms: 4,
    bathrooms: 2,
    squareFootage: 1800,
    yearBuilt: 2020,
    propertyType: 'manufactured_home',
    status: 'active',
    amenities: ['Central Air', 'Dishwasher', 'Washer/Dryer Included', 'Ceiling Fans'],
    outdoorFeatures: ['Front Porch', 'Back Deck', 'Carport', 'Garden Area'],
    storageOptions: ['Walk-in Closets', 'Pantry', 'Utility Room', 'Carport Storage'],
    technologyFeatures: ['Cable Ready', 'Internet Ready', 'Phone Ready', 'Smart Thermostat'],
    communityAmenities: ['Community Center', 'Playground', 'Walking Trails', 'Pet Park'],
    petPolicy: 'Small pets allowed with deposit',
    mhDetails: {
      manufacturer: 'Champion Homes',
      model: 'The Patriot',
      serialNumber: 'CHP987654321',
      communityName: 'Pine Valley Mobile Home Park',
      lotSize: '80x120',
      foundation: 'Pier & Beam',
      roofType: 'Metal Roofing',
      exteriorMaterial: 'Vinyl Siding with Stone Accent',
      hvacType: 'Heat Pump',
      waterHeaterType: 'Electric Tankless',
      electricalSystem: '200 Amp Service',
      plumbingType: 'PEX',
      insulationType: 'Spray Foam',
      windowType: 'Double Pane Low-E',
      flooringType: 'LVP & Carpet',
      kitchenAppliances: ['Refrigerator', 'Range', 'Dishwasher', 'Microwave', 'Garbage Disposal'],
      laundryHookups: true,
      internetReady: true,
      cableReady: true,
      phoneReady: true
    },
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg'
    ],
    videos: ['https://www.youtube.com/watch?v=example2'],
    floorPlans: ['https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg'],
    virtualTours: [],
    contactInfo: {
      phone: '(555) 345-6789',
      email: 'rentals@pinevalley.com'
    },
    createdAt: '2024-01-22T14:30:00Z',
    updatedAt: '2024-01-22T14:30:00Z'
  }
]