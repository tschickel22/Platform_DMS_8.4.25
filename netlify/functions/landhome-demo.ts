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
    const demoPackages = [
      {
        id: 'demo-land-1',
        type: 'land',
        title: 'Premium Corner Lot #42',
        price: 25000,
        image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Beautiful corner lot with all utilities available',
        features: ['Water hookup', 'Sewer connection', 'Electric service', 'Corner location', 'Mature trees']
      },
      {
        id: 'demo-land-2',
        type: 'land',
        title: 'Waterfront Lot #15',
        price: 35000,
        image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Stunning waterfront lot with private dock access',
        features: ['Waterfront', 'Private dock', 'All utilities', 'Paved road access', 'HOA amenities']
      },
      {
        id: 'demo-home-1',
        type: 'home',
        title: '2023 Clayton The Edge - 3BR/2BA',
        price: 95000,
        image: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Brand new manufactured home with modern finishes',
        features: ['3 bedrooms', '2 bathrooms', '1450 sq ft', 'Energy efficient', 'Modern appliances']
      },
      {
        id: 'demo-package-1',
        type: 'package',
        title: 'Complete Home + Land Package',
        price: 120000,
        image: 'https://images.pexels.com/photos/2462014/pexels-photo-2462014.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Everything you need - home, land, and setup included',
        features: ['3BR/2BA Clayton home', 'Premium corner lot', 'Complete setup', 'Financing available', 'Move-in ready']
      },
      {
        id: 'demo-package-2',
        type: 'package',
        title: 'Waterfront Living Package',
        price: 155000,
        image: 'https://images.pexels.com/photos/1546166/pexels-photo-1546166.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Luxury waterfront living with premium home',
        features: ['4BR/2BA Champion home', 'Waterfront lot', 'Private dock', 'Premium finishes', 'Turnkey solution']
      },
      {
        id: 'demo-package-3',
        type: 'package',
        title: 'Starter Home Package',
        price: 85000,
        image: 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Affordable starter package perfect for first-time buyers',
        features: ['2BR/1BA home', 'Standard lot', 'Basic setup', 'Low down payment', 'First-time buyer friendly']
      }
    ]

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=1800' // 30 minutes
      },
      body: JSON.stringify(demoPackages)
    }
    
  } catch (error) {
    console.error('Get demo packages error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}