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

    const { siteId, domain } = JSON.parse(event.body || '{}')
    
    if (!siteId || !domain) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'siteId and domain are required' })
      }
    }

    // Generate domain string based on type
    let domainString = ''
    switch (domain.type) {
      case 'subdomain':
        domainString = `${domain.subdomain}.renterinsight.com`
        break
      case 'custom':
        domainString = domain.customDomain
        break
      case 'subdomain_custom':
        domainString = `${domain.subdomain}.${domain.baseDomain}`
        break
      case 'multi_dealer':
        domainString = `${domain.dealerCode}.${domain.groupDomain}`
        break
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid domain type' })
        }
    }

    // Store domain mapping
    const domainsStore = getStore('domain_mappings')
    const domainKey = domainString.toLowerCase()
    
    const mapping = {
      domain: domainString,
      siteId,
      type: domain.type,
      createdAt: new Date().toISOString(),
      config: domain
    }
    
    await domainsStore.set(domainKey, JSON.stringify(mapping))
    
    // Log domain mapping event
    const logsStore = getStore('logs')
    const date = new Date().toISOString().split('T')[0]
    const logKey = `events/${date}`
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: 'domain.mapped',
      siteId,
      domain: domainString,
      type: domain.type
    }
    
    let existingLogs = ''
    try {
      existingLogs = await logsStore.get(logKey) || ''
    } catch (error) {
      // File doesn't exist yet
    }
    
    await logsStore.set(logKey, existingLogs + JSON.stringify(logEntry) + '\n')
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        domain: domainString,
        message: 'Website address saved. DNS may take a few minutes to propagate.'
      })
    }
    
  } catch (error) {
    console.error('Set domain error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}