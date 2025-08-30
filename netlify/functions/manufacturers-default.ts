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
    const defaultManufacturers = [
      {
        id: 'forest-river',
        name: 'Forest River',
        slug: 'forest-river',
        logoUrl: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=100',
        externalUrl: 'https://forestriver.com',
        enabled: true,
        linkType: 'external'
      },
      {
        id: 'jayco',
        name: 'Jayco',
        slug: 'jayco',
        logoUrl: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=100',
        externalUrl: 'https://jayco.com',
        enabled: true,
        linkType: 'external'
      },
      {
        id: 'thor',
        name: 'Thor Motor Coach',
        slug: 'thor',
        logoUrl: 'https://images.pexels.com/photos/2339009/pexels-photo-2339009.jpeg?auto=compress&cs=tinysrgb&w=100',
        externalUrl: 'https://thormotorcoach.com',
        enabled: true,
        linkType: 'external'
      },
      {
        id: 'grand-design',
        name: 'Grand Design',
        slug: 'grand-design',
        logoUrl: 'https://images.pexels.com/photos/2356002/pexels-photo-2356002.jpeg?auto=compress&cs=tinysrgb&w=100',
        externalUrl: 'https://granddesignrv.com',
        enabled: true,
        linkType: 'external'
      },
      {
        id: 'clayton',
        name: 'Clayton Homes',
        slug: 'clayton',
        logoUrl: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=100',
        externalUrl: 'https://claytonhomes.com',
        enabled: true,
        linkType: 'external'
      },
      {
        id: 'champion',
        name: 'Champion Homes',
        slug: 'champion',
        logoUrl: 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=100',
        externalUrl: 'https://championhomes.com',
        enabled: true,
        linkType: 'external'
      }
    ]

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // 1 hour
      },
      body: JSON.stringify(defaultManufacturers)
    }
    
  } catch (error) {
    console.error('Get manufacturers error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}