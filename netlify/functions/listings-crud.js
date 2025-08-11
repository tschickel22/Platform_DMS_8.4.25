const { getStore, setStore, deleteStore, listStores } = require('@netlify/blobs');

// Utility functions for KV operations
const kvStore = {
  async getListing(companyId, listingId) {
    try {
      const store = getStore('listings');
      const data = await store.get(`${companyId}/${listingId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting listing:', error);
      return null;
    }
  },

  async setListing(companyId, listingId, data) {
    try {
      const store = getStore('listings');
      await store.set(`${companyId}/${listingId}`, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error setting listing:', error);
      return false;
    }
  },

  async deleteListing(companyId, listingId) {
    try {
      const store = getStore('listings');
      await store.delete(`${companyId}/${listingId}`);
      return true;
    } catch (error) {
      console.error('Error deleting listing:', error);
      return false;
    }
  },

  async listListings(companyId) {
    try {
      const store = getStore('listings');
      const { blobs } = await store.list({ prefix: `${companyId}/` });
      const listings = [];
      
      for (const blob of blobs) {
        try {
          const data = await store.get(blob.key);
          if (data) {
            listings.push(JSON.parse(data));
          }
        } catch (error) {
          console.error(`Error parsing listing ${blob.key}:`, error);
        }
      }
      
      return listings;
    } catch (error) {
      console.error('Error listing listings:', error);
      return [];
    }
  }
};

// Validation functions
const validateListing = (listing) => {
  const errors = [];
  
  // Basic required fields
  if (!listing.listingType || !['manufactured_home', 'rv'].includes(listing.listingType)) {
    errors.push('Invalid listing type. Must be "manufactured_home" or "rv"');
  }
  
  if (!listing.inventoryId) {
    errors.push('Inventory ID is required');
  }
  
  if (!listing.offerType || !['for_sale', 'for_rent', 'both'].includes(listing.offerType)) {
    errors.push('Invalid offer type. Must be "for_sale", "for_rent", or "both"');
  }
  
  // Price validation based on offer type
  if (listing.offerType === 'for_sale' || listing.offerType === 'both') {
    if (!listing.salePrice || listing.salePrice <= 0) {
      errors.push('Sale price is required for sale listings');
    }
  }
  
  if (listing.offerType === 'for_rent' || listing.offerType === 'both') {
    if (!listing.rentPrice || listing.rentPrice <= 0) {
      errors.push('Rent price is required for rental listings');
    }
  }
  
  return errors;
};

const validatePublishGates = (listing) => {
  const errors = [];
  
  // Description requirements
  if (!listing.description || listing.description.length < 50) {
    errors.push('Description must be at least 50 characters');
  }
  
  if (!listing.searchResultsText || listing.searchResultsText.length > 80) {
    errors.push('Search results text is required and must be 80 characters or less');
  }
  
  // Media requirements
  if (!listing.media?.photos || listing.media.photos.length === 0) {
    errors.push('At least one photo is required');
  }
  
  if (!listing.media?.primaryPhoto) {
    errors.push('Primary photo is required');
  }
  
  // Location requirements
  if (!listing.location?.city) {
    errors.push('City is required');
  }
  
  if (!listing.location?.state || listing.location.state.length !== 2) {
    errors.push('State is required (2-letter code)');
  }
  
  if (!listing.location?.postalCode) {
    errors.push('Postal code is required');
  }
  
  // Seller contact requirements
  const seller = listing.seller || {};
  if (!seller.phone && (!seller.emails || seller.emails.length === 0)) {
    errors.push('At least one phone number or email is required for seller contact');
  }
  
  // Basic listing info
  if (!listing.year || listing.year < 1900 || listing.year > new Date().getFullYear() + 1) {
    errors.push('Valid year is required');
  }
  
  if (!listing.make) {
    errors.push('Make is required');
  }
  
  if (!listing.model) {
    errors.push('Model is required');
  }
  
  // MH-specific requirements
  if (listing.listingType === 'manufactured_home') {
    if (listing.bedrooms === undefined || listing.bedrooms < 0) {
      errors.push('Number of bedrooms is required for manufactured homes');
    }
    if (listing.bathrooms === undefined || listing.bathrooms < 0) {
      errors.push('Number of bathrooms is required for manufactured homes');
    }
  }
  
  // Coordinate validation if present
  if (listing.location?.latitude !== undefined) {
    const lat = parseFloat(listing.location.latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.push('Invalid latitude. Must be between -90 and 90');
    }
  }
  
  if (listing.location?.longitude !== undefined) {
    const lng = parseFloat(listing.location.longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.push('Invalid longitude. Must be between -180 and 180');
    }
  }
  
  return errors;
};

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    const { httpMethod, path, body, queryStringParameters } = event;
    const companyId = queryStringParameters?.companyId;
    
    if (!companyId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'companyId is required' })
      };
    }

    switch (httpMethod) {
      case 'GET': {
        const listingId = queryStringParameters?.listingId;
        
        if (listingId) {
          // Get single listing
          const listing = await kvStore.getListing(companyId, listingId);
          if (!listing) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: 'Listing not found' })
            };
          }
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(listing)
          };
        } else {
          // Get all listings for company
          const listings = await kvStore.listListings(companyId);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(listings)
          };
        }
      }

      case 'POST': {
        const listingData = JSON.parse(body || '{}');
        
        // Generate listing ID
        const listingId = `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Add metadata
        const listing = {
          ...listingData,
          id: listingId,
          companyId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: listingData.status || 'draft'
        };
        
        // Validate listing
        const validationErrors = validateListing(listing);
        if (validationErrors.length > 0) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ errors: validationErrors })
          };
        }
        
        // Check publish gates if trying to set as active
        if (listing.status === 'active') {
          const publishErrors = validatePublishGates(listing);
          if (publishErrors.length > 0) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ errors: publishErrors, publishGateErrors: true })
            };
          }
        }
        
        // Save listing
        const success = await kvStore.setListing(companyId, listingId, listing);
        if (!success) {
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to save listing' })
          };
        }
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(listing)
        };
      }

      case 'PUT': {
        const listingId = queryStringParameters?.listingId;
        if (!listingId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'listingId is required for updates' })
          };
        }
        
        const existingListing = await kvStore.getListing(companyId, listingId);
        if (!existingListing) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Listing not found' })
          };
        }
        
        const updates = JSON.parse(body || '{}');
        const updatedListing = {
          ...existingListing,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        
        // Validate listing
        const validationErrors = validateListing(updatedListing);
        if (validationErrors.length > 0) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ errors: validationErrors })
          };
        }
        
        // Check publish gates if trying to set as active
        if (updatedListing.status === 'active') {
          const publishErrors = validatePublishGates(updatedListing);
          if (publishErrors.length > 0) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ errors: publishErrors, publishGateErrors: true })
            };
          }
        }
        
        // Save updated listing
        const success = await kvStore.setListing(companyId, listingId, updatedListing);
        if (!success) {
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to update listing' })
          };
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(updatedListing)
        };
      }

      case 'DELETE': {
        const listingId = queryStringParameters?.listingId;
        if (!listingId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'listingId is required for deletion' })
          };
        }
        
        const success = await kvStore.deleteListing(companyId, listingId);
        if (!success) {
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to delete listing' })
          };
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Listing deleted successfully' })
        };
      }

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Listings CRUD error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};