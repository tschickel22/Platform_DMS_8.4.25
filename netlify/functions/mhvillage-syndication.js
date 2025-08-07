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
      <sellerId>${escapeXml(listing.sellerId || listing.id)}</sellerId>
      ${listing.companyId ? `<companyId>${escapeXml(listing.companyId)}</companyId>` : ''}
      <listingType>${escapeXml(listing.listingType || 'sale')}</listingType>
      <title>${escapeXml(listing.title)}</title>
      <description>${escapeXml(listing.description)}</description>
      ${listing.termsOfSale ? `<termsOfSale>${escapeXml(listing.termsOfSale)}</termsOfSale>` : ''}
      
      <!-- Location Information -->
      <location>
        <address>${escapeXml(listing.address)}</address>
        ${listing.address2 ? `<address2>${escapeXml(listing.address2)}</address2>` : ''}
        <city>${escapeXml(listing.city || '')}</city>
        <state>${escapeXml(listing.state || '')}</state>
        <zipCode>${escapeXml(listing.zipCode || '')}</zipCode>
        ${listing.county ? `<county>${escapeXml(listing.county)}</county>` : ''}
        ${listing.township ? `<township>${escapeXml(listing.township)}</township>` : ''}
        ${listing.schoolDistrict ? `<schoolDistrict>${escapeXml(listing.schoolDistrict)}</schoolDistrict>` : ''}
        ${listing.latitude ? `<latitude>${listing.latitude}</latitude>` : ''}
        ${listing.longitude ? `<longitude>${listing.longitude}</longitude>` : ''}
        <communityName>${escapeXml(mh.communityName || '')}</communityName>
        ${mh.propertyId ? `<propertyId>${escapeXml(mh.propertyId)}</propertyId>` : ''}
      </location>
      
      <!-- Pricing Information -->
      <pricing>
        ${listing.listingType === 'sale' ? 
          `<salePrice>${listing.purchasePrice || 0}</salePrice>` : 
          `<rentPrice>${listing.rent || 0}</rentPrice>`
        }
        ${listing.lotRent ? `<lotRent>${listing.lotRent}</lotRent>` : ''}
        ${listing.hoaFees ? `<hoaFees>${listing.hoaFees}</hoaFees>` : ''}
        ${listing.monthlyTax ? `<monthlyTax>${listing.monthlyTax}</monthlyTax>` : ''}
        ${listing.monthlyUtilities ? `<monthlyUtilities>${listing.monthlyUtilities}</monthlyUtilities>` : ''}
        ${listing.soldPrice ? `<soldPrice>${listing.soldPrice}</soldPrice>` : ''}
      </pricing>
      
      <!-- Basic Home Information -->
      <homeDetails>
        <manufacturer>${escapeXml(mh.manufacturer || '')}</manufacturer>
        <model>${escapeXml(mh.model || '')}</model>
        <serialNumber>${escapeXml(mh.serialNumber || '')}</serialNumber>
        ${mh.modelYear ? `<modelYear>${mh.modelYear}</modelYear>` : ''}
        ${mh.color ? `<color>${escapeXml(mh.color)}</color>` : ''}
        <yearBuilt>${listing.yearBuilt || ''}</yearBuilt>
        <bedrooms>${listing.bedrooms}</bedrooms>
        <bathrooms>${listing.bathrooms}</bathrooms>
        <squareFootage>${listing.squareFootage}</squareFootage>
        <lotSize>${escapeXml(mh.lotSize || '')}</lotSize>
        ${listing.preferredTerm ? `<preferredTerm>${escapeXml(listing.preferredTerm)}</preferredTerm>` : ''}
        <width1>${mh.width1 || 0}</width1>
        <length1>${mh.length1 || 0}</length1>
        ${mh.width2 ? `<width2>${mh.width2}</width2>` : ''}
        ${mh.length2 ? `<length2>${mh.length2}</length2>` : ''}
        ${mh.width3 ? `<width3>${mh.width3}</width3>` : ''}
        ${mh.length3 ? `<length3>${mh.length3}</length3>` : ''}
      </homeDetails>
      
      <!-- Construction Details -->
      <construction>
        <foundation>${escapeXml(mh.foundation || '')}</foundation>
        <roofType>${escapeXml(mh.roofType || '')}</roofType>
        <exteriorMaterial>${escapeXml(mh.exteriorMaterial || '')}</exteriorMaterial>
        ${mh.roofMaterial ? `<roofMaterial>${escapeXml(mh.roofMaterial)}</roofMaterial>` : ''}
        ${mh.ceilingMaterial ? `<ceilingMaterial>${escapeXml(mh.ceilingMaterial)}</ceilingMaterial>` : ''}
        ${mh.wallMaterial ? `<wallMaterial>${escapeXml(mh.wallMaterial)}</wallMaterial>` : ''}
        <insulationType>${escapeXml(mh.insulationType || '')}</insulationType>
        <windowType>${escapeXml(mh.windowType || '')}</windowType>
        <flooringType>${escapeXml(mh.flooringType || '')}</flooringType>
        ${mh.thermopaneWindows ? `<thermopaneWindows>${mh.thermopaneWindows}</thermopaneWindows>` : ''}
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
        ${mh.laundryRoom ? `<laundryRoom>${mh.laundryRoom}</laundryRoom>` : ''}
        <internetReady>${mh.internetReady || false}</internetReady>
        <cableReady>${mh.cableReady || false}</cableReady>
        <phoneReady>${mh.phoneReady || false}</phoneReady>
      </utilities>
      
      <!-- Home Features -->
      <homeFeatures>
        ${mh.garage ? `<garage>${mh.garage}</garage>` : ''}
        ${mh.carport ? `<carport>${mh.carport}</carport>` : ''}
        ${mh.centralAir ? `<centralAir>${mh.centralAir}</centralAir>` : ''}
        ${mh.fireplace ? `<fireplace>${mh.fireplace}</fireplace>` : ''}
        ${mh.storageShed ? `<storageShed>${mh.storageShed}</storageShed>` : ''}
        ${mh.gutters ? `<gutters>${mh.gutters}</gutters>` : ''}
        ${mh.shutters ? `<shutters>${mh.shutters}</shutters>` : ''}
        ${mh.deck ? `<deck>${mh.deck}</deck>` : ''}
        ${mh.patio ? `<patio>${mh.patio}</patio>` : ''}
        ${mh.cathedralCeilings ? `<cathedralCeilings>${mh.cathedralCeilings}</cathedralCeilings>` : ''}
        ${mh.ceilingFans ? `<ceilingFans>${mh.ceilingFans}</ceilingFans>` : ''}
        ${mh.skylights ? `<skylights>${mh.skylights}</skylights>` : ''}
        ${mh.walkinClosets ? `<walkinClosets>${mh.walkinClosets}</walkinClosets>` : ''}
        ${mh.pantry ? `<pantry>${mh.pantry}</pantry>` : ''}
        ${mh.sunRoom ? `<sunRoom>${mh.sunRoom}</sunRoom>` : ''}
        ${mh.basement ? `<basement>${mh.basement}</basement>` : ''}
        ${mh.gardenTub ? `<gardenTub>${mh.gardenTub}</gardenTub>` : ''}
        ${mh.garbageDisposal ? `<garbageDisposal>${mh.garbageDisposal}</garbageDisposal>` : ''}
      </homeFeatures>
      
      <!-- Included Appliances -->
      <includedAppliances>
        ${mh.refrigeratorIncluded ? `<refrigeratorIncluded>${mh.refrigeratorIncluded}</refrigeratorIncluded>` : ''}
        ${mh.microwaveIncluded ? `<microwaveIncluded>${mh.microwaveIncluded}</microwaveIncluded>` : ''}
        ${mh.ovenIncluded ? `<ovenIncluded>${mh.ovenIncluded}</ovenIncluded>` : ''}
        ${mh.dishwasherIncluded ? `<dishwasherIncluded>${mh.dishwasherIncluded}</dishwasherIncluded>` : ''}
        ${mh.washerIncluded ? `<washerIncluded>${mh.washerIncluded}</washerIncluded>` : ''}
        ${mh.dryerIncluded ? `<dryerIncluded>${mh.dryerIncluded}</dryerIncluded>` : ''}
      </includedAppliances>
      
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
        ${listing.contactInfo.mhVillageAccountKey ? `<mhVillageAccountKey>${escapeXml(listing.contactInfo.mhVillageAccountKey)}</mhVillageAccountKey>` : ''}
        <firstName>${escapeXml(listing.contactInfo.firstName || '')}</firstName>
        <lastName>${escapeXml(listing.contactInfo.lastName || '')}</lastName>
        ${listing.contactInfo.companyName ? `<companyName>${escapeXml(listing.contactInfo.companyName)}</companyName>` : ''}
        <phone>${escapeXml(listing.contactInfo.phone)}</phone>
        <email>${escapeXml(listing.contactInfo.email)}</email>
        ${listing.contactInfo.fax ? `<fax>${escapeXml(listing.contactInfo.fax)}</fax>` : ''}
        ${listing.contactInfo.website ? `<website>${escapeXml(listing.contactInfo.website)}</website>` : ''}
        ${listing.contactInfo.additionalEmail1 ? `<additionalEmail1>${escapeXml(listing.contactInfo.additionalEmail1)}</additionalEmail1>` : ''}
        ${listing.contactInfo.additionalEmail2 ? `<additionalEmail2>${escapeXml(listing.contactInfo.additionalEmail2)}</additionalEmail2>` : ''}
        ${listing.contactInfo.additionalEmail3 ? `<additionalEmail3>${escapeXml(listing.contactInfo.additionalEmail3)}</additionalEmail3>` : ''}
        ${listing.contactInfo.alternatePhone ? `<alternatePhone>${escapeXml(listing.contactInfo.alternatePhone)}</alternatePhone>` : ''}
      </contact>
      
      <!-- Pet Policy -->
      <petPolicy>${escapeXml(listing.petPolicy)}</petPolicy>
      
      <!-- Listing Details -->
      <listingDetails>
        ${listing.isRepossessed ? `<isRepossessed>${listing.isRepossessed}</isRepossessed>` : ''}
        ${listing.packageType ? `<packageType>${escapeXml(listing.packageType)}</packageType>` : ''}
        ${listing.pendingSale ? `<pendingSale>${listing.pendingSale}</pendingSale>` : ''}
        ${listing.searchResultsText ? `<searchResultsText>${escapeXml(listing.searchResultsText)}</searchResultsText>` : ''}
        ${listing.agentPhotoUrl ? `<agentPhotoUrl>${escapeXml(listing.agentPhotoUrl)}</agentPhotoUrl>` : ''}
      </listingDetails>
      
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
    sellerId: 'SELLER001',
    companyId: 'COMP001',
    listingType: 'sale',
    title: '2018 Clayton Manufactured Home - Sunny Acres Community',
    description: 'Beautiful 3-bedroom, 2-bathroom manufactured home in excellent condition. Features modern kitchen with stainless steel appliances, spacious living areas, and master suite with walk-in closet.',
    termsOfSale: 'Cash or financing available. Owner will consider reasonable offers.',
    address: '123 Mobile Home Dr, Sunny Acres Community, City 12348',
    address2: 'Lot 45',
    city: 'Sunny Valley',
    state: 'CA',
    zipCode: '12348',
    county: 'Orange County',
    township: 'Sunny Township',
    schoolDistrict: 'Sunny Valley Unified',
    latitude: 33.7175,
    longitude: -117.8311,
    rent: null,
    purchasePrice: 89500,
    lotRent: 450,
    hoaFees: 75,
    monthlyTax: 125,
    monthlyUtilities: 150,
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1400,
    yearBuilt: 2018,
    preferredTerm: 'Affordable Family Home',
    propertyType: 'manufactured_home',
    status: 'active',
    amenities: ['Central Air', 'Dishwasher', 'Garbage Disposal', 'Microwave', 'Refrigerator'],
    outdoorFeatures: ['Deck', 'Shed', 'Landscaping', 'Driveway'],
    storageOptions: ['Walk-in Closets', 'Pantry', 'Outdoor Shed'],
    technologyFeatures: ['Cable Ready', 'Internet Ready', 'Phone Ready'],
    communityAmenities: ['Clubhouse', 'Pool', 'Playground', 'Laundry Facility'],
    petPolicy: 'Pets allowed with restrictions',
    isRepossessed: false,
    packageType: 'premium',
    pendingSale: false,
    searchResultsText: 'Beautiful 2018 Clayton home in family community with pool and clubhouse',
    agentPhotoUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mhDetails: {
      manufacturer: 'Clayton Homes',
      model: 'The Breeze II',
      modelYear: 2018,
      color: 'Beige with Brown Trim',
      serialNumber: 'CLT123456789',
      communityName: 'Sunny Acres Mobile Home Community',
      propertyId: 'SA-045',
      lotSize: '60x120',
      width1: 28,
      length1: 50,
      foundation: 'Permanent Foundation',
      roofType: 'Architectural Shingles',
      roofMaterial: 'Asphalt Shingles',
      exteriorMaterial: 'Vinyl Siding',
      ceilingMaterial: 'Textured Drywall',
      wallMaterial: 'Painted Drywall',
      hvacType: 'Central Air & Heat',
      waterHeaterType: 'Electric Tank',
      electricalSystem: '200 Amp Service',
      plumbingType: 'PEX',
      insulationType: 'Fiberglass Batt',
      windowType: 'Double Pane Vinyl',
      thermopaneWindows: true,
      flooringType: 'Laminate & Carpet',
      kitchenAppliances: ['Refrigerator', 'Range', 'Dishwasher', 'Microwave'],
      laundryHookups: true,
      laundryRoom: true,
      internetReady: true,
      cableReady: true,
      phoneReady: true,
      // Boolean features
      garage: false,
      carport: true,
      centralAir: true,
      fireplace: false,
      storageShed: true,
      gutters: true,
      shutters: true,
      deck: true,
      patio: false,
      cathedralCeilings: false,
      ceilingFans: true,
      skylights: false,
      walkinClosets: true,
      pantry: true,
      sunRoom: false,
      basement: false,
      gardenTub: true,
      garbageDisposal: true,
      // Included appliances
      refrigeratorIncluded: true,
      microwaveIncluded: true,
      ovenIncluded: true,
      dishwasherIncluded: true,
      washerIncluded: false,
      dryerIncluded: false
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
      email: 'sales@sunnyacres.com',
      mhVillageAccountKey: 'MHV789012',
      firstName: 'Sarah',
      lastName: 'Johnson',
      companyName: 'Sunny Acres Sales',
      fax: '(555) 234-5679',
      website: 'https://www.sunnyacres.com',
      additionalEmail1: 'manager@sunnyacres.com',
      alternatePhone: '(555) 234-5680'
    },
    createdAt: '2024-01-25T11:00:00Z',
    updatedAt: '2024-01-25T11:00:00Z'
  },
  {
    id: '5',
    sellerId: 'SELLER002',
    companyId: 'COMP002',
    listingType: 'rent',
    title: '2020 Champion Double Wide - Pine Valley Community',
    description: 'Spacious double wide manufactured home for rent in family-friendly community. Features open floor plan, modern appliances, and large master bedroom.',
    termsOfSale: 'First month, last month, and security deposit required.',
    address: '456 Pine Valley Rd, Pine Valley MH Park, City 12349',
    address2: 'Space 78',
    city: 'Pine Valley',
    state: 'CA',
    zipCode: '12349',
    county: 'Riverside County',
    township: 'Pine Township',
    schoolDistrict: 'Pine Valley Elementary',
    latitude: 33.6846,
    longitude: -116.9325,
    rent: 1200,
    purchasePrice: null,
    lotRent: null,
    hoaFees: 50,
    monthlyTax: null,
    monthlyUtilities: 180,
    bedrooms: 4,
    bathrooms: 2,
    squareFootage: 1800,
    yearBuilt: 2020,
    preferredTerm: 'Spacious Family Rental',
    propertyType: 'manufactured_home',
    status: 'active',
    amenities: ['Central Air', 'Dishwasher', 'Washer/Dryer Included', 'Ceiling Fans'],
    outdoorFeatures: ['Front Porch', 'Back Deck', 'Carport', 'Garden Area'],
    storageOptions: ['Walk-in Closets', 'Pantry', 'Utility Room', 'Carport Storage'],
    technologyFeatures: ['Cable Ready', 'Internet Ready', 'Phone Ready', 'Smart Thermostat'],
    communityAmenities: ['Community Center', 'Playground', 'Walking Trails', 'Pet Park'],
    petPolicy: 'Small pets allowed with deposit',
    isRepossessed: false,
    packageType: 'basic',
    pendingSale: false,
    searchResultsText: 'Spacious 2020 Champion double wide in family community with amenities',
    agentPhotoUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mhDetails: {
      manufacturer: 'Champion Homes',
      model: 'The Patriot',
      modelYear: 2020,
      color: 'White with Blue Trim',
      serialNumber: 'CHP987654321',
      communityName: 'Pine Valley Mobile Home Park',
      propertyId: 'PV-078',
      lotSize: '80x120',
      width1: 28,
      length1: 64,
      width2: 14,
      length2: 28,
      foundation: 'Pier & Beam',
      roofType: 'Metal Roofing',
      roofMaterial: 'Standing Seam Metal',
      exteriorMaterial: 'Vinyl Siding with Stone Accent',
      ceilingMaterial: 'Smooth Drywall',
      wallMaterial: 'Painted Drywall',
      hvacType: 'Heat Pump',
      waterHeaterType: 'Electric Tankless',
      electricalSystem: '200 Amp Service',
      plumbingType: 'PEX',
      insulationType: 'Spray Foam',
      windowType: 'Double Pane Low-E',
      thermopaneWindows: true,
      flooringType: 'LVP & Carpet',
      kitchenAppliances: ['Refrigerator', 'Range', 'Dishwasher', 'Microwave', 'Garbage Disposal'],
      laundryHookups: true,
      laundryRoom: true,
      internetReady: true,
      cableReady: true,
      phoneReady: true,
      // Boolean features
      garage: false,
      carport: true,
      centralAir: true,
      fireplace: true,
      storageShed: false,
      gutters: true,
      shutters: false,
      deck: true,
      patio: true,
      cathedralCeilings: true,
      ceilingFans: true,
      skylights: true,
      walkinClosets: true,
      pantry: true,
      sunRoom: false,
      basement: false,
      gardenTub: false,
      garbageDisposal: true,
      // Included appliances
      refrigeratorIncluded: true,
      microwaveIncluded: true,
      ovenIncluded: true,
      dishwasherIncluded: true,
      washerIncluded: true,
      dryerIncluded: true
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
      email: 'rentals@pinevalley.com',
      mhVillageAccountKey: 'MHV456789',
      firstName: 'Mike',
      lastName: 'Thompson',
      companyName: 'Pine Valley Rentals',
      fax: '(555) 345-6790',
      website: 'https://www.pinevalleyrentals.com',
      additionalEmail1: 'office@pinevalley.com',
      additionalEmail2: 'maintenance@pinevalley.com',
      alternatePhone: '(555) 345-6791'
    },
    createdAt: '2024-01-22T14:30:00Z',
    updatedAt: '2024-01-22T14:30:00Z'
  }
]