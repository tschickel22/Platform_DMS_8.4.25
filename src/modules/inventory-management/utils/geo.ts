// Geocoding utilities for deriving lat/long from address

export interface Address {
  address1: string
  city: string
  state: string
  zip9: string
}

export interface Coordinates {
  latitude: number
  longitude: number
}

// Mock geocoding function - in production, this would call a real geocoding service
export const geocodeAddress = async (address: Address): Promise<Coordinates | null> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Mock coordinates based on state (for demo purposes)
    const stateCoordinates: Record<string, Coordinates> = {
      'AL': { latitude: 32.806671, longitude: -86.791130 },
      'AK': { latitude: 61.570716, longitude: -152.404419 },
      'AZ': { latitude: 33.729759, longitude: -111.431221 },
      'AR': { latitude: 34.969704, longitude: -92.373123 },
      'CA': { latitude: 36.116203, longitude: -119.681564 },
      'CO': { latitude: 39.059811, longitude: -105.311104 },
      'CT': { latitude: 41.597782, longitude: -72.755371 },
      'DE': { latitude: 39.318523, longitude: -75.507141 },
      'FL': { latitude: 27.766279, longitude: -81.686783 },
      'GA': { latitude: 33.040619, longitude: -83.643074 },
      'HI': { latitude: 21.094318, longitude: -157.498337 },
      'ID': { latitude: 44.240459, longitude: -114.478828 },
      'IL': { latitude: 40.349457, longitude: -88.986137 },
      'IN': { latitude: 39.849426, longitude: -86.258278 },
      'IA': { latitude: 42.011539, longitude: -93.210526 },
      'KS': { latitude: 38.526600, longitude: -96.726486 },
      'KY': { latitude: 37.668140, longitude: -84.670067 },
      'LA': { latitude: 31.169546, longitude: -91.867805 },
      'ME': { latitude: 44.693947, longitude: -69.381927 },
      'MD': { latitude: 39.063946, longitude: -76.802101 },
      'MA': { latitude: 42.230171, longitude: -71.530106 },
      'MI': { latitude: 43.326618, longitude: -84.536095 },
      'MN': { latitude: 45.694454, longitude: -93.900192 },
      'MS': { latitude: 32.741646, longitude: -89.678696 },
      'MO': { latitude: 38.456085, longitude: -92.288368 },
      'MT': { latitude: 47.052952, longitude: -109.633040 },
      'NE': { latitude: 41.125370, longitude: -98.268082 },
      'NV': { latitude: 38.313515, longitude: -117.055374 },
      'NH': { latitude: 43.452492, longitude: -71.563896 },
      'NJ': { latitude: 40.298904, longitude: -74.521011 },
      'NM': { latitude: 34.840515, longitude: -106.248482 },
      'NY': { latitude: 42.165726, longitude: -74.948051 },
      'NC': { latitude: 35.630066, longitude: -79.806419 },
      'ND': { latitude: 47.528912, longitude: -99.784012 },
      'OH': { latitude: 40.388783, longitude: -82.764915 },
      'OK': { latitude: 35.565342, longitude: -96.928917 },
      'OR': { latitude: 44.931109, longitude: -123.029159 },
      'PA': { latitude: 40.590752, longitude: -77.209755 },
      'RI': { latitude: 41.680893, longitude: -71.51178 },
      'SC': { latitude: 33.856892, longitude: -80.945007 },
      'SD': { latitude: 44.299782, longitude: -99.438828 },
      'TN': { latitude: 35.747845, longitude: -86.692345 },
      'TX': { latitude: 31.054487, longitude: -97.563461 },
      'UT': { latitude: 40.150032, longitude: -111.862434 },
      'VT': { latitude: 44.045876, longitude: -72.710686 },
      'VA': { latitude: 37.769337, longitude: -78.169968 },
      'WA': { latitude: 47.400902, longitude: -121.490494 },
      'WV': { latitude: 38.491226, longitude: -80.954570 },
      'WI': { latitude: 44.268543, longitude: -89.616508 },
      'WY': { latitude: 42.755966, longitude: -107.302490 }
    }
    
    const baseCoords = stateCoordinates[address.state.toUpperCase()]
    if (!baseCoords) {
      return null
    }
    
    // Add some randomness based on city/zip for more realistic coordinates
    const cityHash = address.city.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    const zipHash = address.zip9.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    const latOffset = (cityHash % 200 - 100) / 1000 // ±0.1 degrees
    const lngOffset = (zipHash % 200 - 100) / 1000 // ±0.1 degrees
    
    return {
      latitude: baseCoords.latitude + latOffset,
      longitude: baseCoords.longitude + lngOffset
    }
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

// Batch geocode multiple addresses
export const batchGeocodeAddresses = async (addresses: Address[]): Promise<(Coordinates | null)[]> => {
  const results: (Coordinates | null)[] = []
  
  // Process in batches to avoid overwhelming the service
  const batchSize = 10
  for (let i = 0; i < addresses.length; i += batchSize) {
    const batch = addresses.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(address => geocodeAddress(address))
    )
    results.push(...batchResults)
    
    // Small delay between batches
    if (i + batchSize < addresses.length) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  return results
}

// Validate address format
export const validateAddress = (address: Address): boolean => {
  return !!(
    address.address1?.trim() &&
    address.city?.trim() &&
    address.state?.trim() &&
    address.zip9?.trim() &&
    /^[A-Z]{2}$/.test(address.state.toUpperCase()) &&
    /^\d{5}(-\d{4})?$/.test(address.zip9)
  )
}