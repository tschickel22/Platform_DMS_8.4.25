const { getStore } = require('@netlify/blobs');

// Partner mappings for different feed formats
const partnerMappings = {
  'mhvillage': {
    format: 'json',
    mapListing: (listing) => ({
      sellerId: listing.seller?.sellerId || listing.companyId,
      seller: {
        accountKey: listing.seller?.accountKey || 'default',
        companyName: listing.seller?.companyName || 'Company Name',
        phone: listing.seller?.phone || '',
        emails: listing.seller?.emails || [],
        website: listing.seller?.website || ''
      },
      serialNumber: listing.serialNumber || '',
      package: listing.package || 'Standard',
      repo: listing.repo || false,
      salePending: listing.salePending || false,
      media: {
        photos: listing.media?.photos || [],
        primaryPhoto: listing.media?.primaryPhoto || '',
        salesPhoto: listing.media?.salesPhoto || '',
        virtualTour: listing.media?.virtualTour || ''
      },
      salePrice: listing.salePrice || 0,
      rentPrice: listing.rentPrice || 0,
      soldPrice: listing.soldPrice || 0,
      currency: listing.currency || 'USD',
      description: listing.description || '',
      searchResultsText: listing.searchResultsText || '',
      terms: listing.terms || '',
      locationType: listing.location?.locationType || 'community',
      communityKey: listing.location?.communityKey || '',
      communityName: listing.location?.communityName || '',
      address1: listing.location?.address1 || '',
      address2: listing.location?.address2 || '',
      city: listing.location?.city || '',
      state: listing.location?.state || '',
      postalCode: listing.location?.postalCode || '',
      county: listing.location?.county || '',
      township: listing.location?.township || '',
      schoolDistrict: listing.location?.schoolDistrict || '',
      latitude: listing.location?.latitude || 0,
      longitude: listing.location?.longitude || 0,
      homeType: listing.listingType === 'manufactured_home' ? 'Manufactured Home' : 'RV',
      make: listing.make || '',
      model: listing.model || '',
      year: listing.year || 0,
      color: listing.color || '',
      bedrooms: listing.bedrooms || 0,
      bathrooms: listing.bathrooms || 0,
      width_ft: listing.dimensions?.width_ft || 0,
      length_ft: listing.dimensions?.length_ft || 0,
      sections: listing.dimensions?.sections || 1,
      // Add all boolean features
      ...Object.keys(listing.features || {}).reduce((acc, key) => {
        acc[key] = listing.features[key] || false;
        return acc;
      }, {})
    })
  },
  
  'zillow': {
    format: 'xml',
    mapListing: (listing) => ({
      ListingKey: listing.id,
      MlsId: listing.id,
      StandardStatus: listing.status === 'active' ? 'Active' : 'Inactive',
      ListPrice: listing.salePrice || listing.rentPrice || 0,
      ListingContractDate: listing.createdAt,
      ModificationTimestamp: listing.updatedAt,
      PropertyType: listing.listingType === 'manufactured_home' ? 'Manufactured' : 'Recreational',
      PropertySubType: listing.listingType === 'manufactured_home' ? 'Manufactured Home' : 'RV',
      UnparsedAddress: `${listing.location?.address1 || ''} ${listing.location?.city || ''} ${listing.location?.state || ''}`,
      City: listing.location?.city || '',
      StateOrProvince: listing.location?.state || '',
      PostalCode: listing.location?.postalCode || '',
      Country: 'US',
      Latitude: listing.location?.latitude || 0,
      Longitude: listing.location?.longitude || 0,
      YearBuilt: listing.year || 0,
      BedroomsTotal: listing.bedrooms || 0,
      BathroomsTotalInteger: Math.floor(listing.bathrooms || 0),
      PublicRemarks: listing.description || '',
      Media: (listing.media?.photos || []).map((photo, index) => ({
        Order: index + 1,
        MediaURL: photo,
        MediaType: 'Photo'
      }))
    })
  }
};

// Helper function to convert JSON to XML
const jsonToXml = (obj, rootName = 'Listings') => {
  const convertValue = (value, key) => {
    if (Array.isArray(value)) {
      return value.map((item, index) => 
        typeof item === 'object' 
          ? `<${key}>${convertValue(item, Object.keys(item)[0] || 'item')}</${key}>`
          : `<${key}>${item}</${key}>`
      ).join('');
    }
    
    if (typeof value === 'object' && value !== null) {
      return Object.keys(value).map(k => 
        `<${k}>${convertValue(value[k], k)}</${k}>`
      ).join('');
    }
    
    return String(value).replace(/[<>&'"]/g, (char) => {
      const entities = { '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' };
      return entities[char];
    });
  };
  
  if (Array.isArray(obj)) {
    const items = obj.map(item => `<Listing>${convertValue(item, 'Listing')}</Listing>`).join('');
    return `<?xml version="1.0" encoding="UTF-8"?><${rootName}>${items}</${rootName}>`;
  }
  
  return `<?xml version="1.0" encoding="UTF-8"?><${rootName}>${convertValue(obj, rootName)}</${rootName}>`;
};

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { 
      partnerId, 
      format = 'json', 
      companyId,
      listingTypes,
      preview = '0',
      rebuild = '0'
    } = event.queryStringParameters || {};

    if (!partnerId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'partnerId is required' })
      };
    }

    if (!companyId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'companyId is required' })
      };
    }

    // Get partner configuration
    const partnerMapping = partnerMappings[partnerId.toLowerCase()];
    if (!partnerMapping) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Partner not found' })
      };
    }

    // Check cache first (if not rebuilding)
    if (rebuild !== '1') {
      try {
        const cacheStore = getStore('feed_cache');
        const cacheKey = `${companyId}/${partnerId}.${partnerMapping.format}`;
        const cachedData = await cacheStore.get(cacheKey);
        
        if (cachedData) {
          const cache = JSON.parse(cachedData);
          // Return cached data if it's less than 1 hour old
          const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
          if (new Date(cache.generatedAt) > oneHourAgo) {
            const contentType = partnerMapping.format === 'xml' ? 'application/xml' : 'application/json';
            return {
              statusCode: 200,
              headers: {
                ...headers,
                'Content-Type': contentType,
                'X-Generated-At': cache.generatedAt,
                'X-Record-Count': cache.recordCount.toString(),
                'X-Cache-Hit': 'true'
              },
              body: cache.data
            };
          }
        }
      } catch (cacheError) {
        console.warn('Cache read error:', cacheError);
      }
    }

    // Fetch active listings
    const listingsStore = getStore('listings');
    const { blobs } = await listingsStore.list({ prefix: `${companyId}/` });
    const listings = [];

    for (const blob of blobs) {
      try {
        const data = await listingsStore.get(blob.key);
        if (data) {
          const listing = JSON.parse(data);
          // Only include active listings
          if (listing.status === 'active') {
            // Filter by listing types if specified
            if (!listingTypes || listingTypes.split(',').includes(listing.listingType)) {
              listings.push(listing);
            }
          }
        }
      } catch (error) {
        console.error(`Error parsing listing ${blob.key}:`, error);
      }
    }

    // Map listings to partner format
    const mappedListings = listings.map(listing => partnerMapping.mapListing(listing));

    // Generate feed data
    let feedData;
    let contentType;

    if (partnerMapping.format === 'xml') {
      feedData = jsonToXml(mappedListings, 'Listings');
      contentType = 'application/xml';
    } else {
      const feedObject = {
        generatedAt: new Date().toISOString(),
        recordCount: mappedListings.length,
        listings: mappedListings
      };
      feedData = JSON.stringify(feedObject, null, 2);
      contentType = 'application/json';
    }

    // Cache the result
    try {
      const cacheStore = getStore('feed_cache');
      const cacheKey = `${companyId}/${partnerId}.${partnerMapping.format}`;
      const cacheData = {
        generatedAt: new Date().toISOString(),
        recordCount: mappedListings.length,
        data: feedData
      };
      await cacheStore.set(cacheKey, JSON.stringify(cacheData));
    } catch (cacheError) {
      console.error('Cache write error:', cacheError);
    }

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': contentType,
        'X-Generated-At': new Date().toISOString(),
        'X-Record-Count': mappedListings.length.toString(),
        'X-Cache-Hit': 'false'
      },
      body: feedData
    };

  } catch (error) {
    console.error('Syndication feed error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};