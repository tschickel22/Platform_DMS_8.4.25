const { getStore } = require('@netlify/blobs');

// Simple canvas-like image generation (mock implementation)
// In production, you might use libraries like canvas, puppeteer, or a service like Bannerbear
const generateOGImage = async (listing, companyBranding) => {
  // This is a mock implementation
  // In production, you would use actual image generation libraries
  
  const imageData = {
    width: 1200,
    height: 630,
    elements: [
      {
        type: 'background',
        color: companyBranding.primaryColor || '#667eea',
        gradient: {
          from: companyBranding.primaryColor || '#667eea',
          to: companyBranding.secondaryColor || '#764ba2',
          direction: '135deg'
        }
      },
      {
        type: 'image',
        src: listing.media?.primaryPhoto || '/placeholder-property.jpg',
        x: 50,
        y: 50,
        width: 500,
        height: 400,
        borderRadius: 12
      },
      {
        type: 'logo',
        src: companyBranding.logo || '/logo.png',
        x: 600,
        y: 50,
        width: 120,
        height: 60
      },
      {
        type: 'text',
        content: listing.searchResultsText || `${listing.year} ${listing.make} ${listing.model}`,
        x: 600,
        y: 150,
        fontSize: 36,
        fontWeight: 'bold',
        color: '#ffffff',
        maxWidth: 500
      },
      {
        type: 'text',
        content: `$${(listing.salePrice || listing.rentPrice || 0).toLocaleString()}`,
        x: 600,
        y: 220,
        fontSize: 48,
        fontWeight: 'bold',
        color: '#ffffff'
      },
      {
        type: 'text',
        content: listing.offerType === 'for_rent' ? '/month' : '',
        x: 600,
        y: 280,
        fontSize: 24,
        color: '#ffffff'
      },
      {
        type: 'text',
        content: `${listing.location?.city || ''}, ${listing.location?.state || ''}`,
        x: 600,
        y: 320,
        fontSize: 28,
        color: '#ffffff'
      },
      {
        type: 'text',
        content: companyBranding.name || 'Property Listing',
        x: 600,
        y: 500,
        fontSize: 24,
        color: '#ffffff',
        opacity: 0.8
      },
      {
        type: 'text',
        content: companyBranding.website || companyBranding.phone || '',
        x: 600,
        y: 540,
        fontSize: 20,
        color: '#ffffff',
        opacity: 0.7
      }
    ]
  };
  
  // In production, this would generate an actual image
  // For now, return a mock base64 image or URL to a placeholder service
  const mockImageUrl = `https://via.placeholder.com/1200x630/${companyBranding.primaryColor?.replace('#', '') || '667eea'}/ffffff?text=${encodeURIComponent(listing.searchResultsText || 'Property Listing')}`;
  
  return {
    url: mockImageUrl,
    data: imageData, // Keep the configuration for future use
    generated: new Date().toISOString()
  };
};

// Generate cache key based on listing content
const generateCacheKey = (listing, companyBranding) => {
  const crypto = require('crypto');
  const contentHash = crypto.createHash('md5')
    .update(JSON.stringify({
      listingId: listing.id,
      price: listing.salePrice || listing.rentPrice,
      title: listing.searchResultsText,
      primaryPhoto: listing.media?.primaryPhoto,
      logo: companyBranding.logo,
      colors: [companyBranding.primaryColor, companyBranding.secondaryColor],
      updatedAt: listing.updatedAt
    }))
    .digest('hex');
  
  return contentHash;
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
    const { companyId, listingId, format = 'url' } = event.queryStringParameters || {};
    
    if (!companyId || !listingId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'companyId and listingId are required' })
      };
    }

    // Get listing data
    const listingsStore = getStore('listings');
    const listingKey = `${companyId}/${listingId}`;
    const listingData = await listingsStore.get(listingKey);
    
    if (!listingData) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Listing not found' })
      };
    }
    
    const listing = JSON.parse(listingData);
    
    // Get company branding
    let companyBranding = {
      name: 'Property Listings',
      primaryColor: '#667eea',
      secondaryColor: '#764ba2',
      logo: null,
      website: null,
      phone: null
    };
    
    try {
      const companiesStore = getStore('companies');
      const brandingData = await companiesStore.get(`${companyId}/branding`);
      if (brandingData) {
        const branding = JSON.parse(brandingData);
        companyBranding = { ...companyBranding, ...branding };
      }
    } catch (error) {
      console.warn('Could not fetch company branding:', error);
    }
    
    // Generate cache key
    const cacheKey = generateCacheKey(listing, companyBranding);
    
    // Check cache first
    const cacheStore = getStore('og_cache');
    const cachedImageKey = `${companyId}/${cacheKey}`;
    
    let cachedImage;
    try {
      const cached = await cacheStore.get(cachedImageKey);
      if (cached) {
        cachedImage = JSON.parse(cached);
        // Check if cached image is less than 24 hours old
        const cacheAge = Date.now() - new Date(cachedImage.generated).getTime();
        if (cacheAge < 24 * 60 * 60 * 1000) { // 24 hours
          if (format === 'redirect') {
            return {
              statusCode: 302,
              headers: {
                ...headers,
                'Location': cachedImage.url,
                'Cache-Control': 'public, max-age=86400' // 24 hours
              }
            };
          } else {
            return {
              statusCode: 200,
              headers: {
                ...headers,
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=86400'
              },
              body: JSON.stringify(cachedImage)
            };
          }
        }
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }
    
    // Generate new OG image
    const ogImage = await generateOGImage(listing, companyBranding);
    
    // Cache the result
    try {
      await cacheStore.set(cachedImageKey, JSON.stringify(ogImage));
    } catch (error) {
      console.error('Cache write error:', error);
    }
    
    // Log the generation
    try {
      const logsStore = getStore('logs');
      const date = new Date().toISOString().split('T')[0];
      const logKey = `events/${date}`;
      
      const logEntry = {
        timestamp: new Date().toISOString(),
        event: 'og_image.generated',
        companyId,
        listingId,
        cacheKey,
        format
      };
      
      let existingLogs = '';
      try {
        existingLogs = await logsStore.get(logKey) || '';
      } catch (error) {
        // File doesn't exist yet
      }
      
      await logsStore.set(logKey, existingLogs + JSON.stringify(logEntry) + '\n');
    } catch (error) {
      console.error('Error logging event:', error);
    }
    
    if (format === 'redirect') {
      return {
        statusCode: 302,
        headers: {
          ...headers,
          'Location': ogImage.url,
          'Cache-Control': 'public, max-age=86400'
        }
      };
    } else {
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=86400'
        },
        body: JSON.stringify(ogImage)
      };
    }
    
  } catch (error) {
    console.error('OG image generation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};