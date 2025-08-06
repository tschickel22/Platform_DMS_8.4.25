const { mockListings, getActiveListings } = require('../../src/mocks/listingsMock')

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

    // Get active listings (in a real app, this would come from a database)
    const activeListings = mockListings.filter(listing => listing.status === 'active')
    
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
      <title>${escapeXml(listing.title)}</title>
      <description>${escapeXml(listing.description)}</description>
      <address>${escapeXml(listing.address)}</address>
      <rent>${listing.rent}</rent>
      <bedrooms>${listing.bedrooms}</bedrooms>
      <bathrooms>${listing.bathrooms}</bathrooms>
      <squareFootage>${listing.squareFootage}</squareFootage>
      <propertyType>${escapeXml(listing.propertyType)}</propertyType>
      <status>${escapeXml(listing.status)}</status>
      <petPolicy>${escapeXml(listing.petPolicy)}</petPolicy>
      <amenities>`
    
    listing.amenities.forEach(amenity => {
      xml += `
        <amenity>${escapeXml(amenity)}</amenity>`
    })
    
    xml += `
      </amenities>
      <images>`
    
    listing.images.forEach(image => {
      xml += `
        <image>${escapeXml(image)}</image>`
    })
    
    xml += `
      </images>
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
  }
]