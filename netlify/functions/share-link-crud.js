const { getStore } = require('@netlify/blobs');
const crypto = require('crypto');

// Utility functions for share link management
const shareStore = {
  async getShareLink(companyId, token) {
    try {
      const store = getStore('share_links');
      const data = await store.get(`${companyId}/${token}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting share link:', error);
      return null;
    }
  },

  async setShareLink(companyId, token, data) {
    try {
      const store = getStore('share_links');
      await store.set(`${companyId}/${token}`, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error setting share link:', error);
      return false;
    }
  },

  async deleteShareLink(companyId, token) {
    try {
      const store = getStore('share_links');
      await store.delete(`${companyId}/${token}`);
      return true;
    } catch (error) {
      console.error('Error deleting share link:', error);
      return false;
    }
  },

  async listShareLinks(companyId) {
    try {
      const store = getStore('share_links');
      const { blobs } = await store.list({ prefix: `${companyId}/` });
      const links = [];
      
      for (const blob of blobs) {
        try {
          const data = await store.get(blob.key);
          if (data) {
            const linkData = JSON.parse(data);
            // Extract token from key
            const token = blob.key.split('/')[1];
            links.push({ ...linkData, token });
          }
        } catch (error) {
          console.error(`Error parsing share link ${blob.key}:`, error);
        }
      }
      
      return links;
    } catch (error) {
      console.error('Error listing share links:', error);
      return [];
    }
  }
};

// Generate HMAC signed token
const generateToken = (payload) => {
  const secret = process.env.SHARE_TOKEN_SECRET || 'default-secret-key';
  const data = JSON.stringify(payload);
  const signature = crypto.createHmac('sha256', secret).update(data).digest('hex');
  return Buffer.from(`${data}.${signature}`).toString('base64url');
};

// Verify HMAC signed token
const verifyToken = (token) => {
  try {
    const secret = process.env.SHARE_TOKEN_SECRET || 'default-secret-key';
    const decoded = Buffer.from(token, 'base64url').toString();
    const [data, signature] = decoded.split('.');
    
    const expectedSignature = crypto.createHmac('sha256', secret).update(data).digest('hex');
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    return JSON.parse(data);
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
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
    const { httpMethod, body, queryStringParameters } = event;
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
        const token = queryStringParameters?.token;
        
        if (token) {
          // Get single share link
          const shareLink = await shareStore.getShareLink(companyId, token);
          if (!shareLink) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: 'Share link not found' })
            };
          }
          
          // Check if expired
          if (shareLink.expiresAt && new Date() > new Date(shareLink.expiresAt)) {
            return {
              statusCode: 410,
              headers,
              body: JSON.stringify({ error: 'Share link expired' })
            };
          }
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(shareLink)
          };
        } else {
          // Get all share links for company
          const links = await shareStore.listShareLinks(companyId);
          // Filter out expired links
          const activeLinks = links.filter(link => 
            !link.expiresAt || new Date() <= new Date(link.expiresAt)
          );
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(activeLinks)
          };
        }
      }

      case 'POST': {
        const linkData = JSON.parse(body || '{}');
        
        // Generate token payload
        const tokenPayload = {
          companyId,
          type: linkData.type, // 'single', 'selection', 'catalog'
          listingIds: linkData.listingIds || [],
          filters: linkData.filters || {},
          createdAt: new Date().toISOString(),
          expiresAt: linkData.expiresAt || null
        };
        
        const token = generateToken(tokenPayload);
        
        // Create share link record
        const shareLink = {
          companyId,
          type: linkData.type,
          title: linkData.title || 'Shared Listings',
          listingIds: linkData.listingIds || [],
          filters: linkData.filters || {},
          watermark: linkData.watermark || false,
          createdAt: new Date().toISOString(),
          expiresAt: linkData.expiresAt || null,
          isRevoked: false
        };
        
        // Save share link
        const success = await shareStore.setShareLink(companyId, token, shareLink);
        if (!success) {
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to create share link' })
          };
        }
        
        // Generate URLs
        const baseUrl = process.env.SITE_BASE_URL || 'https://localhost:3000';
        const urls = {
          shortUrl: `${baseUrl}/${companyId}/l/${token}`,
          canonicalUrl: shareLink.type === 'single' && shareLink.listingIds.length === 1
            ? `${baseUrl}/${companyId}/listing/${shareLink.listingIds[0]}`
            : `${baseUrl}/${companyId}/listings`
        };
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            ...shareLink,
            token,
            urls
          })
        };
      }

      case 'DELETE': {
        const token = queryStringParameters?.token;
        if (!token) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'token is required for revocation' })
          };
        }
        
        // Mark as revoked instead of deleting (for audit trail)
        const existingLink = await shareStore.getShareLink(companyId, token);
        if (!existingLink) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Share link not found' })
          };
        }
        
        const revokedLink = {
          ...existingLink,
          isRevoked: true,
          revokedAt: new Date().toISOString()
        };
        
        const success = await shareStore.setShareLink(companyId, token, revokedLink);
        if (!success) {
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to revoke share link' })
          };
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Share link revoked successfully' })
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
    console.error('Share link CRUD error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};