const { getStore } = require('@netlify/blobs')

exports.handler = async (event: any, context: any) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-publish-secret',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    // Verify publish secret
    const publishSecret = event.headers['x-publish-secret']
    const expectedSecret = process.env.PUBLISH_SECRET || 'demo-secret'
    
    if (publishSecret !== expectedSecret) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid publish secret' })
      }
    }

    const { site } = JSON.parse(event.body || '{}')
    
    if (!site || !site.id || !site.slug) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid site data' })
      }
    }

    // Store site snapshot
    const sitesStore = getStore('published_sites')
    const siteKey = `${site.slug}`
    
    const publishedSite = {
      ...site,
      publishedAt: new Date().toISOString(),
      version: Date.now()
    }
    
    await sitesStore.set(siteKey, JSON.stringify(publishedSite))
    
    // Log publish event
    const logsStore = getStore('logs')
    const date = new Date().toISOString().split('T')[0]
    const logKey = `events/${date}`
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: 'site.published',
      siteId: site.id,
      slug: site.slug,
      pageCount: site.pages?.length || 0
    }
    
    let existingLogs = ''
    try {
      existingLogs = await logsStore.get(logKey) || ''
    } catch (error) {
      // File doesn't exist yet
    }
    
    await logsStore.set(logKey, existingLogs + JSON.stringify(logEntry) + '\n')
    
    const baseUrl = process.env.SITE_BASE_URL || event.headers.origin || 'https://localhost:3000'
    const previewUrl = `${baseUrl}/s/${site.slug}/`
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        previewUrl,
        publishedAt: publishedSite.publishedAt
      })
    }
    
  } catch (error) {
    console.error('Publish site error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}