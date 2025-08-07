exports.handler = async (event, context) => {
  try {
    // Get query parameters
    const { partnerId, format, listingTypes, leadEmail, ...customParams } = event.queryStringParameters || {}
    
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

    // In production, fetch partner configuration from Rails API
    // const partnerConfig = await fetchPartnerConfig(partnerId)
    // const listings = await fetchListingsFromRails(listingTypes?.split(',') || [])
    
    // For now, use mock data and parameters
    const listingTypesArray = listingTypes ? listingTypes.split(',') : []
    const activeListings = mockListings.filter(listing => {
      if (listingTypesArray.length === 0) return listing.status === 'active'
      
      return listing.status === 'active' && (
        listingTypesArray.includes(listing.listingType) ||
        listingTypesArray.includes(listing.propertyType)
      )
    })
    
    // Generate feed based on format
    let feedContent
    let contentType
    
    if (format === 'JSON') {
      feedContent = generateMHVillageJSON(activeListings, partnerId, leadEmail, customParams)
      contentType = 'application/json'
    } else {
      // Default to XML (Zillow format)
      feedContent = generateZillowXML(activeListings, partnerId, leadEmail, customParams)
      contentType = 'application/xml'
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
      body: feedContent
    }
  } catch (error) {
    console.error('Syndication feed error:', error)
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

// TODO: Replace with actual Rails API calls
async function fetchPartnerConfig(partnerId) {
  // const response = await fetch(`${process.env.RAILS_API_URL}/api/syndication_partners/${partnerId}`)
  // return await response.json()
  return null
}

async function fetchListingsFromRails(listingTypes) {
  // const response = await fetch(`${process.env.RAILS_API_URL}/api/listings?types=${listingTypes.join(',')}`)
  // return await response.json()
  return mockListings
}

function generateZillowXML(listings, partnerId, leadEmail, customParams) {
  const currentDate = new Date().toISOString()
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<PhysicalProperty>
  <!-- Management Companies -->`

  // Generate unique management companies
  const managementCompanies = new Map()
  listings.forEach(listing => {
    const companyId = listing.companyId || `c${listing.id}`
    if (!managementCompanies.has(companyId)) {
      managementCompanies.set(companyId, {
        id: companyId,
        name: listing.contactInfo?.companyName || 'Property Management Company',
        email: leadEmail || listing.contactInfo?.email || 'support@renterinsight.com',
        phone: listing.contactInfo?.phone || '(555) 123-4567'
      })
    }
  })

  // Add management company sections
  managementCompanies.forEach(company => {
    xml += `
  <Management IDValue="${escapeXml(company.id)}">
    <PropertyContacts>
      <Companies>
        <CompanyName>${escapeXml(company.name)}</CompanyName>
        <Email>${escapeXml(company.email)}</Email>
        <Phone Phonetype="cell">
          <PhoneNumber>${escapeXml(company.phone)}</PhoneNumber>
        </Phone>
      </Companies>
    </PropertyContacts>
  </Management>`
  })

  // Generate properties
  listings.forEach(listing => {
    const companyId = listing.companyId || `c${listing.id}`
    const propertyType = mapPropertyTypeToILS(listing.propertyType)
    
    xml += `
  <Property IDValue="${escapeXml(listing.id)}" IDType="PropertyID">
    <PropertyID>
      <Identification IDValue="${escapeXml(companyId)}" IDType="managementID"/>
      <Identification IDValue="${escapeXml(listing.id)}" IDType="PropertyID" IDRank="primary"/>
      <MarketingName>${escapeXml(listing.title)}</MarketingName>
      <Address AddressType="property">
        <AddressLine1>${escapeXml(listing.address)}</AddressLine1>
        ${listing.address2 ? `<AddressLine2>${escapeXml(listing.address2)}</AddressLine2>` : ''}
        <City>${escapeXml(listing.city || '')}</City>
        <State>${escapeXml(listing.state || '')}</State>
        <PostalCode>${escapeXml(listing.zipCode || '')}</PostalCode>
      </Address>
      <Email>${escapeXml(leadEmail || listing.contactInfo?.email || 'support@renterinsight.com')}</Email>
      <Phone Phonetype="cell">
        <PhoneNumber>${escapeXml(listing.contactInfo?.phone || '(555) 123-4567')}</PhoneNumber>
      </Phone>
    </PropertyID>
    <ILS_Identification ILS_IdentificationType="${propertyType}">
      ${listing.latitude ? `<Latitude>${listing.latitude}</Latitude>` : ''}
      ${listing.longitude ? `<Longitude>${listing.longitude}</Longitude>` : ''}
    </ILS_Identification>
    <Information>
      <LongDescription>
        <![CDATA[ ${listing.description || ''} ]]>
      </LongDescription>
      <Parking ParkingType="Other"/>
    </Information>`

    // Add amenities
    if (listing.amenities && listing.amenities.length > 0) {
      listing.amenities.forEach(amenity => {
        const amenityType = mapAmenityType(amenity)
        xml += `
    <Amenity AmenityType="${amenityType}">
      <Description>${escapeXml(amenity)}</Description>
    </Amenity>`
      })
    }

    // Add pet policy
    xml += `
    <Policy>
      <Pet Allowed="${listing.petPolicy && listing.petPolicy !== 'No pets allowed' ? 'true' : 'false'}">
        <Pets PetType="Dog"/>
      </Pet>
      <Pet Allowed="${listing.petPolicy && listing.petPolicy !== 'No pets allowed' ? 'true' : 'false'}">
        <Pets PetType="Cat"/>
      </Pet>
    </Policy>`

    // Add floorplan
    const floorplanId = `fp${listing.id}`
    const rent = listing.listingType === 'rent' ? listing.rent : listing.purchasePrice
    
    xml += `
    <Floorplan IDValue="${floorplanId}">
      <Name>Standard</Name>
      <UnitsAvailable>1</UnitsAvailable>
      <Room RoomType="Bathroom">
        <Count>${listing.bathrooms || 1}</Count>
      </Room>
      <Room RoomType="Bedroom">
        <Count>${listing.bedrooms || 1}</Count>
      </Room>
      <SquareFeet Min="${listing.squareFootage || 0}" Max="${listing.squareFootage || 0}"/>
      <MarketRent Min="${rent || 0}" Max="${rent || 0}"/>
      <Deposit DepositType="Security Deposit">
        <Amount AmountType="Actual">
          <ValueRange Exact="${rent || 0}"/>
        </Amount>
      </Deposit>
    </Floorplan>`

    // Add unit details
    xml += `
    <ILS_Unit IDValue="${listing.id}">
      <Units>
        <Unit>
          <MarketingName>${escapeXml(listing.title)}</MarketingName>
          <UnitBathrooms>${listing.bathrooms || 1}</UnitBathrooms>
          <UnitBedrooms>${listing.bedrooms || 1}</UnitBedrooms>
          <MinSquareFeet>${listing.squareFootage || 0}</MinSquareFeet>
          <FloorPlanID>${floorplanId}</FloorPlanID>
          <FloorplanName>Standard</FloorplanName>
          <MarketRent>${rent || 0}</MarketRent>
        </Unit>
        <Comment>
          <![CDATA[ ${listing.description || ''} ]]>
        </Comment>
      </Units>
      <EffectiveRent Min="${rent || 0}" Max="${rent || 0}"/>
      <Deposit DepositType="Security Deposit">
        <Amount AmountType="Actual">
          <ValueRange Exact="${rent || 0}"/>
        </Amount>
      </Deposit>
      <UnitOccupancyStatus>${listing.status === 'active' ? 'vacant' : 'occupied'}</UnitOccupancyStatus>
      <Availability>
        <VacancyClass>${listing.status === 'active' ? 'Unoccupied' : 'Occupied'}</VacancyClass>
        ${listing.status === 'active' ? `<UnitAvailabilityURL>https://app.renterinsight.com/listing/${listing.id}</UnitAvailabilityURL>` : ''}
      </Availability>`

    // Add images
    if (listing.images && listing.images.length > 0) {
      listing.images.forEach((image, index) => {
        xml += `
      <File Active="true">
        <FileType>Photo</FileType>
        <Format>image/jpeg</Format>
        <Src>${escapeXml(image)}</Src>
        <Rank>${index + 1}</Rank>
      </File>`
      })
    }

    xml += `
    </ILS_Unit>`

    // Add property-level images if different from unit images
    if (listing.images && listing.images.length > 0) {
      listing.images.slice(0, 3).forEach((image, index) => {
        xml += `
    <File Active="true">
      <FileType>Photo</FileType>
      <Format>image/jpeg</Format>
      <Src>
        <![CDATA[ ${image} ]]>
      </Src>
      <Rank>${index + 1}</Rank>
    </File>`
      })
    }

    xml += `
  </Property>`
  })

  xml += `
</PhysicalProperty>`

  return xml
}

function generateMHVillageJSON(listings, partnerId, leadEmail, customParams) {
  const mhListings = listings.filter(listing => 
    listing.propertyType === 'manufactured_home' || 
    listing.mhDetails
  )

  return JSON.stringify({
    partnerId: partnerId,
    generatedAt: new Date().toISOString(),
    totalListings: mhListings.length,
    feedType: 'MHVillage',
    homes: mhListings.map(listing => {
      const mh = listing.mhDetails || {}
      
      return {
        sellerId: listing.sellerId || listing.id,
        sellerAccountKey: partnerId,
        serialNumber: mh.serialNumber || `MH${listing.id}`,
        bedrooms: listing.bedrooms || 2,
        bathrooms: listing.bathrooms || 1,
        repo: listing.isRepossessed || false,
        package: listing.packageType || 'Standard',
        salePending: listing.pendingSale || false,
        photos: listing.images || [],
        sellerInfo: {
          accountKey: partnerId,
          firstName: listing.contactInfo?.firstName || 'Property',
          lastName: listing.contactInfo?.lastName || 'Manager',
          companyName: listing.contactInfo?.companyName || 'Property Management',
          phone: listing.contactInfo?.phone || '5551234567',
          emails: [leadEmail || listing.contactInfo?.email || 'support@renterinsight.com'],
          fax: listing.contactInfo?.fax || null
        },
        price: {
          salePrice: listing.listingType === 'sale' ? listing.purchasePrice : null,
          rentPrice: listing.listingType === 'rent' ? listing.rent : null,
          soldPrice: listing.soldPrice || null
        },
        salesPhoto: listing.images?.[0] || null,
        virtualTour: listing.virtualTours?.[0] || null,
        description: listing.description || '',
        caption: listing.searchResultsText || listing.title,
        terms: listing.termsOfSale || '',
        locationType: 'Community',
        communityKey: parseInt(listing.companyId?.replace('c', '') || '1'),
        communityName: mh.communityName || 'Mobile Home Community',
        address: {
          address1: listing.address,
          address2: listing.address2 || null,
          city: listing.city || '',
          state: listing.state || '',
          zip9: listing.zipCode || '',
          county: listing.county || '',
          township: listing.township || null,
          schoolDistrict: listing.schoolDistrict || '',
          latitude: listing.latitude || null,
          longitude: listing.longitude || null
        },
        homeType: 'Mobile',
        make: mh.manufacturer || 'Unknown',
        model: mh.model || 'Unknown',
        year: listing.yearBuilt || mh.modelYear || new Date().getFullYear(),
        color: mh.color || 'White',
        width1: [mh.width1 || 14, mh.length1 || 60],
        width2: mh.width2 ? [mh.width2, mh.length2] : null,
        width3: mh.width3 ? [mh.width3, mh.length3] : null,
        features: {
          roofType: mh.roofType || 'Shingled',
          sidingType: mh.exteriorMaterial || 'Vinyl',
          celingType: mh.ceilingMaterial || 'Drywall',
          lotRent: listing.lotRent || 0,
          taxes: listing.monthlyTax || 0,
          utilities: listing.monthlyUtilities || 0,
          garage: mh.garage || false,
          carport: mh.carport || false,
          centralAir: mh.centralAir || false,
          termostat: false,
          fireplace: mh.fireplace || false,
          storageShed: mh.storageShed || false,
          gutters: mh.gutters || false,
          shutters: mh.shutters || false,
          deck: mh.deck || false,
          patio: mh.patio || false,
          cathedralCeling: mh.cathedralCeilings || false,
          celingFan: mh.ceilingFans || false,
          skylight: mh.skylights || false,
          walkinCloset: mh.walkinClosets || false,
          laundryRoom: mh.laundryRoom || false,
          pantry: mh.pantry || false,
          sunRooms: mh.sunRoom || false,
          basement: mh.basement || false,
          gardenTub: mh.gardenTub || false,
          garbageDisposal: mh.garbageDisposal || false,
          refrigerator: mh.refrigeratorIncluded || false,
          microwave: mh.microwaveIncluded || false,
          oven: mh.ovenIncluded || false,
          dishwasher: mh.dishwasherIncluded || false,
          clothesWasher: mh.washerIncluded || false
        }
      }
    })
  }, null, 2)
}

function mapPropertyTypeToILS(propertyType) {
  const mapping = {
    'apartment': 'Apartment',
    'house': 'House for Rent',
    'condo': 'Condo',
    'manufactured_home': 'House for Rent',
    'storage': 'House for Rent',
    'rv': 'House for Rent'
  }
  return mapping[propertyType] || 'House for Rent'
}

function mapAmenityType(amenity) {
  const amenityLower = amenity.toLowerCase()
  if (amenityLower.includes('dishwasher')) return 'DishWasher'
  if (amenityLower.includes('air') || amenityLower.includes('ac')) return 'AirConditioner'
  if (amenityLower.includes('laundry') || amenityLower.includes('washer')) return 'Laundry'
  if (amenityLower.includes('heating') || amenityLower.includes('heat')) return 'Heating'
  return 'Other'
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

// Mock data for development - replace with Rails API calls
const mockListings = [
  {
    id: '1',
    listingType: 'rent',
    title: 'Modern Downtown Apartment',
    description: 'Beautiful modern apartment in the heart of downtown with stunning city views. Features include hardwood floors, stainless steel appliances, and in-unit laundry.',
    address: '123 Main St',
    address2: 'Apt 4B',
    city: 'Downtown',
    state: 'NY',
    zipCode: '12345',
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
    amenities: ['Central Air', 'Dishwasher', 'In-unit Laundry', 'Hardwood Floors'],
    petPolicy: 'Cats allowed with deposit',
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg'
    ],
    contactInfo: {
      firstName: 'John',
      lastName: 'Manager',
      companyName: 'Downtown Properties',
      phone: '(555) 123-4567',
      email: 'contact@downtownproperties.com'
    },
    companyId: 'c1001',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '4',
    sellerId: 'SELLER_001',
    companyId: 'c2002',
    listingType: 'sale',
    title: '2018 Clayton Manufactured Home - Sunny Acres Community',
    description: 'Beautiful 3-bedroom, 2-bathroom manufactured home in excellent condition. Features modern kitchen with stainless steel appliances, spacious living areas, and master suite with walk-in closet.',
    termsOfSale: 'Cash or financing available. Owner will consider reasonable offers.',
    address: '123 Mobile Home Dr',
    address2: 'Lot #45',
    city: 'Sunny City',
    state: 'FL',
    zipCode: '12348',
    county: 'Orange County',
    township: 'Sunny Township',
    schoolDistrict: 'Sunny School District',
    latitude: 28.5383,
    longitude: -81.3792,
    rent: null,
    purchasePrice: 89500,
    lotRent: 450,
    hoaFees: 75,
    monthlyTax: 125,
    monthlyUtilities: 180,
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1400,
    yearBuilt: 2018,
    propertyType: 'manufactured_home',
    status: 'active',
    amenities: ['Central Air', 'Dishwasher', 'Garbage Disposal', 'Microwave', 'Refrigerator'],
    petPolicy: 'Pets allowed with restrictions',
    isRepossessed: false,
    packageType: 'Premium',
    pendingSale: false,
    soldPrice: null,
    searchResultsText: 'Beautiful 2018 Clayton home in family community with pool and clubhouse',
    mhDetails: {
      manufacturer: 'Clayton Homes',
      model: 'The Breeze II',
      serialNumber: 'CLT123456789',
      modelYear: 2018,
      color: 'Beige with Brown Trim',
      communityName: 'Sunny Acres Mobile Home Community',
      propertyId: 'SA-045',
      lotSize: '60x120',
      width1: 28,
      length1: 50,
      foundation: 'Permanent Foundation',
      roofType: 'Architectural Shingles',
      roofMaterial: 'Asphalt Shingles',
      exteriorMaterial: 'Vinyl Siding',
      ceilingMaterial: 'Drywall',
      wallMaterial: 'Drywall',
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
      garage: false,
      carport: true,
      centralAir: true,
      fireplace: true,
      storageShed: true,
      gutters: true,
      shutters: true,
      deck: true,
      patio: false,
      cathedralCeilings: true,
      ceilingFans: true,
      skylights: false,
      walkinClosets: true,
      pantry: true,
      sunRoom: false,
      basement: false,
      gardenTub: true,
      garbageDisposal: true,
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
      firstName: 'John',
      lastName: 'Smith',
      companyName: 'Sunny Acres Sales',
      phone: '(555) 234-5678',
      email: 'sales@sunnyacres.com',
      fax: '(555) 234-5679',
      website: 'https://www.sunnyacres.com'
    },
    createdAt: '2024-01-25T11:00:00Z',
    updatedAt: '2024-01-25T11:00:00Z'
  }
]