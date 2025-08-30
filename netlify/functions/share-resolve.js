const { getStore } = require('@netlify/blobs');
const crypto = require('crypto');

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

// Record click analytics
const recordClick = async (companyId, token, source = 'direct', referrer = '') => {
  try {
    const statsStore = getStore('share_stats');
    const statsKey = `${companyId}/${token}`;
    
    let stats;
    try {
      const existingStats = await statsStore.get(statsKey);
      stats = existingStats ? JSON.parse(existingStats) : {
        totalClicks: 0,
        uniqueClicks: 0,
        clicksBySource: {},
        clicksByReferrer: {},
        firstClick: new Date().toISOString(),
        lastClick: null
      };
    } catch (error) {
      stats = {
        totalClicks: 0,
        uniqueClicks: 0,
        clicksBySource: {},
        clicksByReferrer: {},
        firstClick: new Date().toISOString(),
        lastClick: null
      };
    }
    
    // Update stats
    stats.totalClicks += 1;
    stats.lastClick = new Date().toISOString();
    
    // Track source
    if (source) {
      stats.clicksBySource[source] = (stats.clicksBySource[source] || 0) + 1;
    }
    
    // Track referrer
    if (referrer) {
      const domain = referrer.includes('://') 
        ? new URL(referrer).hostname 
        : referrer;
      stats.clicksByReferrer[domain] = (stats.clicksByReferrer[domain] || 0) + 1;
    }
    
    await statsStore.set(statsKey, JSON.stringify(stats));
  } catch (error) {
    console.error('Error recording click:', error);
  }
};

// Generate HTML for expired/revoked page
const generateErrorPage = (companySlug, message, statusCode = 410) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Link Unavailable - ${companySlug}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 400px;
          margin: 1rem;
        }
        .icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.6;
        }
        h1 {
          color: #333;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }
        p {
          color: #666;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .company-name {
          color: #667eea;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">🔗</div>
        <h1>Link Unavailable</h1>
        <p>${message}</p>
        <p>If you believe this is an error, please contact <span class="company-name">${companySlug}</span> directly.</p>
      </div>
    </body>
    </html>
  `;
  
  return {
    statusCode,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    },
    body: html
  };
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
    const pathSegments = event.path.split('/').filter(Boolean);
    
    // Expected paths:
    // /{companySlug}/l/{token} - short token link
    // /{companySlug}/p/{token} - single listing short link
    
    if (pathSegments.length < 3) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid path format' })
      };
    }
    
    const [companySlug, linkType, token] = pathSegments;
    
    if (!['l', 'p'].includes(linkType)) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Invalid link type' })
      };
    }
    
    // Verify token
    const tokenPayload = verifyToken(token);
    if (!tokenPayload) {
      return generateErrorPage(companySlug, 'This link is invalid or has been tampered with.');
    }
    
    // Check if token is expired
    if (tokenPayload.expiresAt && new Date() > new Date(tokenPayload.expiresAt)) {
      return generateErrorPage(companySlug, 'This link has expired.');
    }
    
    // Get share link details
    const shareStore = getStore('share_links');
    const shareLink = await shareStore.get(`${tokenPayload.companyId}/${token}`);
    
    if (!shareLink) {
      return generateErrorPage(companySlug, 'This link could not be found.');
    }
    
    const linkData = JSON.parse(shareLink);
    
    // Check if revoked
    if (linkData.isRevoked) {
      return generateErrorPage(companySlug, 'This link has been revoked and is no longer available.');
    }
    
    // Record click analytics
    const source = event.queryStringParameters?.utm_source || 'direct';
    const referrer = event.headers?.referer || event.headers?.referrer || '';
    
    await recordClick(tokenPayload.companyId, token, source, referrer);
    
    // Determine redirect URL based on link type and content
    const baseUrl = process.env.SITE_BASE_URL || 'https://localhost:3000';
    let redirectUrl;
    
    if (linkType === 'p' || (linkData.type === 'single' && linkData.listingIds.length === 1)) {
      // Single listing
      const listingId = linkData.listingIds[0];
      redirectUrl = `${baseUrl}/${companySlug}/listing/${listingId}`;
    } else {
      // Catalog or selection
      redirectUrl = `${baseUrl}/${companySlug}/listings`;
      
      // Add filters as query parameters if present
      const params = new URLSearchParams();
      
      if (linkData.listingIds && linkData.listingIds.length > 0) {
        params.set('ids', linkData.listingIds.join(','));
      }
      
      if (linkData.filters) {
        Object.keys(linkData.filters).forEach(key => {
          if (linkData.filters[key] !== null && linkData.filters[key] !== undefined) {
            params.set(key, String(linkData.filters[key]));
          }
        });
      }
      
      // Preserve UTM parameters
      if (event.queryStringParameters) {
        Object.keys(event.queryStringParameters).forEach(key => {
          if (key.startsWith('utm_')) {
            params.set(key, event.queryStringParameters[key]);
          }
        });
      }
      
      if (params.toString()) {
        redirectUrl += `?${params.toString()}`;
      }
    }
    
    // Redirect to the resolved URL
    return {
      statusCode: 302,
      headers: {
        ...headers,
        'Location': redirectUrl,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    };
    
  } catch (error) {
    console.error('Share resolve error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};