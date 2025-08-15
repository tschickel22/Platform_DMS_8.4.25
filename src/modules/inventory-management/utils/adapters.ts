import { Vehicle, RVVehicle, MHVehicle, CSVRow } from '../state/types'

// Normalize mock data to arrays
export const normalizeVehicleData = (data: any): Vehicle[] => {
  if (!data) return []
  
  // Handle different mock data structures
  if (Array.isArray(data)) {
    return data
  }
  
  if (data.sampleVehicles && Array.isArray(data.sampleVehicles)) {
    return data.sampleVehicles
  }
  
  if (data.vehicles && Array.isArray(data.vehicles)) {
    return data.vehicles
  }
  
  return []
}

// CSV column mapping with fuzzy matching
export const getColumnMappings = (headers: string[], vehicleType: 'RV' | 'MH'): Array<{
  csvColumn: string
  suggestedField: string
  confidence: number
}> => {
  const mappings: Array<{ csvColumn: string; suggestedField: string; confidence: number }> = []
  
  const rvFieldMappings: Record<string, string[]> = {
    vehicleIdentificationNumber: ['vin', 'vehicle_identification_number', 'vehicle_id'],
    brand: ['make', 'brand', 'manufacturer'],
    model: ['model'],
    modelDate: ['year', 'model_year', 'model_date'],
    mileage: ['mileage', 'miles', 'odometer'],
    bodyStyle: ['body_style', 'class', 'type', 'rv_class'],
    fuelType: ['fuel_type', 'fuel'],
    vehicleTransmission: ['transmission', 'trans'],
    color: ['color', 'exterior_color'],
    price: ['price', 'asking_price', 'list_price'],
    priceCurrency: ['currency', 'price_currency'],
    availability: ['status', 'availability'],
    description: ['description', 'notes'],
    sellerName: ['seller_name', 'dealer_name'],
    sellerPhone: ['seller_phone', 'phone'],
    sellerEmail: ['seller_email', 'email']
  }
  
  const mhFieldMappings: Record<string, string[]> = {
    askingPrice: ['asking_price', 'price', 'list_price'],
    homeType: ['home_type', 'type'],
    make: ['make', 'manufacturer'],
    model: ['model'],
    year: ['year', 'model_year'],
    bedrooms: ['bedrooms', 'beds', 'bedroom_count'],
    bathrooms: ['bathrooms', 'baths', 'bathroom_count'],
    address1: ['address', 'address1', 'street_address'],
    city: ['city'],
    state: ['state', 'st'],
    zip9: ['zip', 'zipcode', 'postal_code', 'zip_code'],
    serialNumber: ['serial_number', 'serial', 'hin'],
    width1: ['width', 'width1'],
    length1: ['length', 'length1'],
    color: ['color', 'exterior_color'],
    sellerFirstName: ['seller_first_name', 'first_name'],
    sellerLastName: ['seller_last_name', 'last_name'],
    sellerPhone: ['seller_phone', 'phone'],
    sellerEmail: ['seller_email', 'email']
  }
  
  const fieldMappings = vehicleType === 'RV' ? rvFieldMappings : mhFieldMappings
  
  headers.forEach(header => {
    const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '_')
    let bestMatch = ''
    let bestConfidence = 0
    
    Object.entries(fieldMappings).forEach(([field, synonyms]) => {
      synonyms.forEach(synonym => {
        const normalizedSynonym = synonym.toLowerCase().replace(/[^a-z0-9]/g, '_')
        
        // Exact match
        if (normalizedHeader === normalizedSynonym) {
          bestMatch = field
          bestConfidence = 1.0
        }
        // Partial match
        else if (normalizedHeader.includes(normalizedSynonym) || normalizedSynonym.includes(normalizedHeader)) {
          const confidence = Math.max(
            normalizedSynonym.length / normalizedHeader.length,
            normalizedHeader.length / normalizedSynonym.length
          ) * 0.8
          
          if (confidence > bestConfidence) {
            bestMatch = field
            bestConfidence = confidence
          }
        }
      })
    })
    
    mappings.push({
      csvColumn: header,
      suggestedField: bestMatch,
      confidence: bestConfidence
    })
  })
  
  return mappings
}

// Convert CSV row to RV vehicle
export const csvRowToRV = (row: CSVRow, mapping: Record<string, string>): Partial<RVVehicle> => {
  const rv: Partial<RVVehicle> = {
    type: 'RV',
    status: 'Available',
    priceCurrency: 'USD',
    images: []
  }
  
  Object.entries(mapping).forEach(([csvColumn, vehicleField]) => {
    const value = row[csvColumn]
    if (!value) return
    
    switch (vehicleField) {
      case 'vehicleIdentificationNumber':
        rv.vehicleIdentificationNumber = value.trim()
        break
      case 'brand':
        rv.brand = value.trim()
        break
      case 'model':
        rv.model = value.trim()
        break
      case 'modelDate':
        rv.modelDate = parseInt(value)
        break
      case 'mileage':
        rv.mileage = parseInt(value) || 0
        break
      case 'price':
        rv.price = parseFloat(value) || 0
        break
      case 'bodyStyle':
        rv.bodyStyle = value.trim()
        break
      case 'fuelType':
        rv.fuelType = value.trim()
        break
      case 'vehicleTransmission':
        rv.vehicleTransmission = value.trim()
        break
      case 'color':
        rv.color = value.trim()
        break
      case 'availability':
        if (['Available', 'Reserved', 'Sold', 'Pending'].includes(value)) {
          rv.availability = value
          rv.status = value as any
        }
        break
      case 'description':
        rv.description = value.trim()
        break
      case 'sellerName':
        rv.sellerName = value.trim()
        break
      case 'sellerPhone':
        rv.sellerPhone = value.trim()
        break
      case 'sellerEmail':
        rv.sellerEmail = value.trim()
        break
    }
  })
  
  return rv
}

// Convert CSV row to MH vehicle
export const csvRowToMH = (row: CSVRow, mapping: Record<string, string>): Partial<MHVehicle> => {
  const mh: Partial<MHVehicle> = {
    type: 'MH',
    status: 'Available'
  }
  
  Object.entries(mapping).forEach(([csvColumn, vehicleField]) => {
    const value = row[csvColumn]
    if (!value) return
    
    switch (vehicleField) {
      case 'askingPrice':
        mh.askingPrice = parseFloat(value) || 0
        break
      case 'homeType':
        mh.homeType = value.trim()
        break
      case 'make':
        mh.make = value.trim()
        break
      case 'model':
        mh.model = value.trim()
        break
      case 'year':
        mh.year = parseInt(value)
        break
      case 'bedrooms':
        mh.bedrooms = parseInt(value) || 0
        break
      case 'bathrooms':
        mh.bathrooms = parseFloat(value) || 0
        break
      case 'address1':
        mh.address1 = value.trim()
        break
      case 'city':
        mh.city = value.trim()
        break
      case 'state':
        mh.state = value.trim().toUpperCase()
        break
      case 'zip9':
        mh.zip9 = value.trim()
        break
      case 'serialNumber':
        mh.serialNumber = value.trim()
        break
      case 'color':
        mh.color = value.trim()
        break
      case 'width1':
        mh.width1 = parseInt(value) || undefined
        break
      case 'length1':
        mh.length1 = parseInt(value) || undefined
        break
      case 'sellerFirstName':
        mh.sellerFirstName = value.trim()
        break
      case 'sellerLastName':
        mh.sellerLastName = value.trim()
        break
      case 'sellerPhone':
        mh.sellerPhone = value.trim()
        break
      case 'sellerEmail':
        mh.sellerEmail = value.trim()
        break
    }
  })
  
  return mh
}

// Detect vehicle type from CSV headers
export const detectVehicleType = (headers: string[]): 'RV' | 'MH' | 'unknown' => {
  const normalizedHeaders = headers.map(h => h.toLowerCase())
  
  // RV indicators
  const rvIndicators = ['vin', 'vehicle_identification_number', 'rv_class', 'body_style']
  const hasRVIndicators = rvIndicators.some(indicator => 
    normalizedHeaders.some(header => header.includes(indicator))
  )
  
  // MH indicators
  const mhIndicators = ['home_type', 'serial_number', 'lot_rent', 'community']
  const hasMHIndicators = mhIndicators.some(indicator => 
    normalizedHeaders.some(header => header.includes(indicator))
  )
  
  if (hasRVIndicators && !hasMHIndicators) return 'RV'
  if (hasMHIndicators && !hasRVIndicators) return 'MH'
  
  return 'unknown'
}