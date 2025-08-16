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
    const demoInventory = [
      {
        id: 'demo-rv-1',
        type: 'rv',
        title: '2023 Forest River Cherokee 274RK',
        price: 45000,
        image: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=400',
        specs: {
          sleeps: 4,
          length: 28,
          slides: 1,
          year: 2023,
          make: 'Forest River',
          model: 'Cherokee 274RK'
        }
      },
      {
        id: 'demo-rv-2',
        type: 'rv',
        title: '2022 Jayco Jay Flight 28BHS',
        price: 38000,
        image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400',
        specs: {
          sleeps: 6,
          length: 32,
          slides: 1,
          year: 2022,
          make: 'Jayco',
          model: 'Jay Flight 28BHS'
        }
      },
      {
        id: 'demo-rv-3',
        type: 'rv',
        title: '2024 Grand Design Solitude 310GK',
        price: 85000,
        image: 'https://images.pexels.com/photos/2356002/pexels-photo-2356002.jpeg?auto=compress&cs=tinysrgb&w=400',
        specs: {
          sleeps: 6,
          length: 35,
          slides: 3,
          year: 2024,
          make: 'Grand Design',
          model: 'Solitude 310GK'
        }
      },
      {
        id: 'demo-mh-1',
        type: 'manufactured_home',
        title: '2023 Clayton The Edge',
        price: 95000,
        image: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=400',
        specs: {
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1450,
          year: 2023,
          make: 'Clayton',
          model: 'The Edge'
        }
      },
      {
        id: 'demo-mh-2',
        type: 'manufactured_home',
        title: '2022 Champion Titan',
        price: 75000,
        image: 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=400',
        specs: {
          bedrooms: 4,
          bathrooms: 2,
          sqft: 1800,
          year: 2022,
          make: 'Champion',
          model: 'Titan'
        }
      },
      {
        id: 'demo-mh-3',
        type: 'manufactured_home',
        title: '2024 Skyline Arrow',
        price: 125000,
        image: 'https://images.pexels.com/photos/2462014/pexels-photo-2462014.jpeg?auto=compress&cs=tinysrgb&w=400',
        specs: {
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1600,
          year: 2024,
          make: 'Skyline',
          model: 'Arrow'
        }
      }
    ]

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=1800' // 30 minutes
      },
      body: JSON.stringify(demoInventory)
    }
    
  } catch (error) {
    console.error('Get demo inventory error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}