const { getStore } = require('@netlify/blobs')

exports.handler = async (event: any, context: any) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers }
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { site: siteSlug } = event.queryStringParameters || {}
    
    if (!siteSlug) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'site parameter is required' })
      }
    }

    const sitesStore = getStore('published_sites')
    const siteData = await sitesStore.get(siteSlug)
    
    if (!siteData) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Site not found' })
      }
    }

    const site = JSON.parse(siteData)
    
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // 5 minutes
      },
      body: JSON.stringify(site)
    }
    
  } catch (error) {
    console.error('Get site error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}