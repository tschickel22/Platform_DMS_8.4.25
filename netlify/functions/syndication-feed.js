const { getStore } = require('@netlify/blobs');

// Enhanced partner mappings with full data contracts
const partnerMappings = {
  'mhvillage': {
    format: 'json',
    mapListing: (listing, options = {}) => ({
      sellerId: listing.seller?.sellerId || listing.companyId,
      seller: {
        accountKey: options.accountId || listing.seller?.accountKey || 'default',
        companyName: listing.seller?.companyName || 'Company Name',
        phone: listing.seller?.phone || '',
        emails: listing.seller?.emails || [options.leadEmail || 'support@company.com'],
        fax: listing.seller?.fax || '',
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
      // MH-specific features
      roofType: listing.features?.roofType || '',
      sidingType: listing.features?.sidingType || '',
      ceilingType: listing.features?.ceilingType || '',
      lotRent: listing.features?.lotRent || 0,
      taxes: listing.features?.taxes || 0,
      utilities: listing.features?.utilities || '',
      // RV-specific features (if applicable)
      ...(listing.listingType === 'rv' && {
        vin: listing.vin || '',
        condition: listing.condition || 'used',
        odometerMiles: listing.odometerMiles || 0,
        vehicleType: listing.vehicleType || '',
        gvwr_lbs: listing.gvwr_lbs || 0,
        towRating_lbs: listing.towRating_lbs || 0,
        sleeps: listing.sleeps || 0,
        slides: listing.slides || 0,
        fuelType: listing.fuelType || '',
        engine: listing.engine || '',
        transmission: listing.transmission || '',
        drive: listing.drive || '4x2',
        freshWaterTank: listing.tanks?.freshWater || 0,
        grayWaterTank: listing.tanks?.grayWater || 0,
        blackWaterTank: listing.tanks?.blackWater || 0,
        generator: listing.features?.generator || false,
        solar: listing.features?.solar || false,
        inverter: listing.features?.inverter || false,
        hitchType: listing.hitchType || ''
      }),
      ...Object.keys(listing.features || {}).reduce((acc, key) => {
        if (typeof listing.features[key] === 'boolean') {
          acc[key] = listing.features[key] || false;
        }
        return acc;
      }, {})
    })
  },
  
  'zillow': {
    format: 'xml',
    mapListing: (listing, options = {}) => ({
      ListingKey: listing.id,
      MlsId: listing.id,
      ManagementIDValue: options.accountId || listing.companyId,
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
      LivingArea: listing.dimensions?.width_ft && listing.dimensions?.length_ft ? 
        (listing.dimensions.width_ft * listing.dimensions.length_ft) : null,
      PublicRemarks: listing.description || '',
      ContactEmail: options.leadEmail || 'support@company.com',
      ContactPhone: listing.seller?.phone || '',
      ...(listing.listingType === 'rv' && {
        VIN: listing.vin || '',
        BodyStyle: listing.vehicleType || '',
        FuelType: listing.fuelType || '',
        Odometer: listing.odometerMiles || 0,
        Engine: listing.engine || '',
        Transmission: listing.transmission || ''
      }),
      Media: (listing.media?.photos || []).map((photo, index) => ({
        Order: index + 1,
        MediaURL: photo,
        MediaType: 'Photo'
      }))
    })
  },

  // Add RV Trader mapping
  'rvtrader': {
    format: 'json',
    mapListing: (listing, options = {}) => ({
      id: listing.id,
      companyId: listing.companyId,
      accountId: options.accountId || listing.companyId,
      vin: listing.vin || '',
      year: listing.year || 0,
      make: listing.make || '',
      model: listing.model || '',
      category: listing.vehicleType || '',
      condition: listing.condition || 'used',
      price: listing.salePrice || 0,
      currency: listing.currency || 'USD',
      mileage: listing.odometerMiles || 0,
      length: listing.dimensions?.length_ft || 0,
      sleeps: listing.sleeps || 0,
      slideouts: listing.slides || 0,
      fuelType: listing.fuelType || '',
      engine: listing.engine || '',
      transmission: listing.transmission || '',
      freshWater: listing.tanks?.freshWater || 0,
      grayWater: listing.tanks?.grayWater || 0,
      blackWater: listing.tanks?.blackWater || 0,
      generator: listing.features?.generator || false,
      solar: listing.features?.solar || false,
      description: listing.description || '',
      photos: listing.media?.photos || [],
      primaryPhoto: listing.media?.primaryPhoto || '',
      location: {
        city: listing.location?.city || '',
        state: listing.location?.state || '',
        postalCode: listing.location?.postalCode || '',
        latitude: listing.location?.latitude || 0,
        longitude: listing.location?.longitude || 0
      },
      seller: {
        name: listing.seller?.companyName || '',
        phone: listing.seller?.phone || '',
        email: options.leadEmail || listing.seller?.emails?.[0] || '',
        website: listing.seller?.website || ''
      }
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
      accountId,
      leadEmail,
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
    const mappingOptions = {
      accountId,
      leadEmail,
      companyId
    };
    
    const mappedListings = listings.map(listing => partnerMapping.mapListing(listing, mappingOptions));

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