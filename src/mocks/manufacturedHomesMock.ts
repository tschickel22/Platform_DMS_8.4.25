import { ManufacturedHomeListing, HomeType, LocationType, RoofType, SidingType, HeatingType, ConditionType, FinancingType } from '@/types/listings'

// Helper function to generate random values
const getRandomItem = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)]
const getRandomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min
const getRandomBoolean = (): boolean => Math.random() > 0.5

// Sample data arrays
const makes = ['Clayton', 'Champion', 'Fleetwood', 'Skyline', 'Palm Harbor', 'Cavco', 'Redman', 'Schult', 'Deer Valley', 'Liberty']
const models = ['Heritage', 'Summit', 'Classic', 'Premier', 'Elite', 'Signature', 'Tradition', 'Pinnacle', 'Prestige', 'Legacy']
const communityNames = [
  'Sunset Manor Mobile Home Community',
  'Pine Ridge Manufactured Home Park',
  'Golden Valley Estates',
  'Meadowbrook Mobile Village',
  'Riverside Manufactured Homes',
  'Oak Hill Community',
  'Countryside Mobile Estates',
  'Lakeside Manor',
  'Valley View Mobile Park',
  'Harmony Hills Community'
]

const appliances = [
  'Refrigerator', 'Stove/Oven', 'Dishwasher', 'Microwave', 'Washer/Dryer Hookups',
  'Garbage Disposal', 'Ice Maker', 'Wine Cooler', 'Built-in Microwave'
]

const sellerNames = [
  'John Smith', 'Mary Johnson', 'Robert Davis', 'Patricia Wilson', 'Michael Brown',
  'Linda Miller', 'William Jones', 'Elizabeth Garcia', 'David Rodriguez', 'Jennifer Martinez'
]

// Generate manufactured home images (using Pexels URLs for mobile/manufactured homes)
const generateHomeImages = (): string[] => {
  const imageUrls = [
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg', // Mobile home exterior
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg', // House exterior
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', // Interior living room
    'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg', // Interior kitchen
    'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg', // Interior bedroom
    'https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg', // Interior bathroom
    'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg', // Exterior view
    'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg', // Interior dining
  ]
  
  const numImages = getRandomNumber(4, 8)
  const selectedImages: string[] = []
  
  for (let i = 0; i < numImages; i++) {
    const randomImage = getRandomItem(imageUrls)
    if (!selectedImages.includes(randomImage)) {
      selectedImages.push(randomImage)
    }
  }
  
  return selectedImages
}

// Generate video URLs (mock YouTube/Vimeo links)
const generateVideoUrls = (): string[] => {
  const hasVideos = getRandomBoolean()
  if (!hasVideos) return []
  
  const videoUrls = [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Mock YouTube URL
    'https://vimeo.com/123456789', // Mock Vimeo URL
    'https://www.youtube.com/watch?v=abc123def456', // Mock YouTube URL
  ]
  
  const numVideos = getRandomNumber(1, 2)
  return videoUrls.slice(0, numVideos)
}

// Generate floor plan URLs
const generateFloorPlanUrls = (): string[] => {
  const hasFloorPlans = getRandomBoolean()
  if (!hasFloorPlans) return []
  
  const floorPlanUrls = [
    'https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg', // Floor plan image
    'https://images.pexels.com/photos/8293777/pexels-photo-8293777.jpeg', // Floor plan image
    'https://images.pexels.com/photos/8293776/pexels-photo-8293776.jpeg', // Floor plan image
  ]
  
  const numPlans = getRandomNumber(1, 3)
  return floorPlanUrls.slice(0, numPlans)
}

// Generate serial number
const generateSerialNumber = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  
  let serial = ''
  // Format: ABC123456789
  for (let i = 0; i < 3; i++) {
    serial += letters.charAt(Math.floor(Math.random() * letters.length))
  }
  for (let i = 0; i < 9; i++) {
    serial += numbers.charAt(Math.floor(Math.random() * numbers.length))
  }
  
  return serial
}

// Generate title number
const generateTitleNumber = (): string => {
  return `TN${getRandomNumber(100000, 999999)}`
}

// Generate realistic descriptions
const generateDescription = (listing: Partial<ManufacturedHomeListing>): string => {
  const descriptions = [
    `Beautiful ${listing.year} ${listing.make} ${listing.model} manufactured home featuring ${listing.bedrooms} bedrooms and ${listing.bathrooms} bathrooms. This well-maintained home offers ${listing.squareFootage} square feet of comfortable living space.`,
    
    `Stunning ${listing.homeType?.replace('_', ' ')} manufactured home by ${listing.make}. The ${listing.model} model showcases modern amenities and quality construction throughout its ${listing.squareFootage} square feet.`,
    
    `Move-in ready ${listing.year} ${listing.make} ${listing.model}! This spacious ${listing.bedrooms}/${listing.bathrooms} manufactured home is perfect for comfortable living. Located in a desirable community with excellent amenities.`,
    
    `Exceptional ${listing.make} ${listing.model} manufactured home offering the perfect blend of comfort and affordability. With ${listing.bedrooms} bedrooms and ${listing.bathrooms} bathrooms, this home provides ample space for relaxation and entertainment.`
  ]
  
  return getRandomItem(descriptions)
}

// Generate sample manufactured home listings
export const generateManufacturedHomeListings = (count: number = 20): ManufacturedHomeListing[] => {
  const listings: ManufacturedHomeListing[] = []
  
  for (let i = 1; i <= count; i++) {
    const year = getRandomNumber(1995, 2024)
    const make = getRandomItem(makes)
    const model = getRandomItem(models)
    const bedrooms = getRandomNumber(1, 4)
    const bathrooms = getRandomNumber(1, 3)
    const squareFootage = getRandomNumber(600, 2400)
    const homeType = getRandomItem(Object.values(HomeType))
    const locationType = getRandomItem(Object.values(LocationType))
    const sellerName = getRandomItem(sellerNames)
    const askingPrice = getRandomNumber(15000, 150000)
    
    const listing: ManufacturedHomeListing = {
      id: `mh-${i.toString().padStart(3, '0')}`,
      title: `${year} ${make} ${model} - ${bedrooms}BR/${bathrooms}BA`,
      description: '',
      address: `${getRandomNumber(100, 9999)} ${getRandomItem(['Oak', 'Pine', 'Maple', 'Cedar', 'Elm'])} ${getRandomItem(['Street', 'Avenue', 'Drive', 'Lane', 'Court'])}, ${getRandomItem(['Springfield', 'Franklin', 'Georgetown', 'Madison', 'Clinton'])}, ${getRandomItem(['FL', 'TX', 'NC', 'SC', 'GA'])} ${getRandomNumber(10000, 99999)}`,
      images: generateHomeImages(),
      videos: generateVideoUrls(),
      floorPlans: generateFloorPlanUrls(),
      contactInfo: {
        phone: `(${getRandomNumber(200, 999)}) ${getRandomNumber(200, 999)}-${getRandomNumber(1000, 9999)}`,
        email: `${sellerName.toLowerCase().replace(' ', '.')}@email.com`,
        name: sellerName
      },
      createdAt: new Date(Date.now() - getRandomNumber(1, 90) * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - getRandomNumber(0, 30) * 24 * 60 * 60 * 1000).toISOString(),
      status: getRandomItem(['active', 'pending', 'sold'] as const),
      featured: getRandomBoolean(),
      listingType: 'for_sale',
      
      // Seller Information
      sellerID: `seller-${i.toString().padStart(3, '0')}`,
      sellerName,
      sellerPhone: `(${getRandomNumber(200, 999)}) ${getRandomNumber(200, 999)}-${getRandomNumber(1000, 9999)}`,
      sellerEmail: `${sellerName.toLowerCase().replace(' ', '.')}@email.com`,
      
      // Pricing
      askingPrice,
      lotRent: locationType !== LocationType.PRIVATE_LAND ? getRandomNumber(200, 800) : undefined,
      taxes: getRandomNumber(500, 3000),
      utilities: getRandomNumber(100, 300),
      
      // Location Details
      locationType,
      communityName: locationType !== LocationType.PRIVATE_LAND ? getRandomItem(communityNames) : undefined,
      lotNumber: locationType !== LocationType.PRIVATE_LAND ? `${getRandomNumber(1, 200)}` : undefined,
      
      // Home Specifications
      homeType,
      make,
      model,
      year,
      bedrooms,
      bathrooms,
      squareFootage,
      
      // Construction Details
      roofType: getRandomItem(Object.values(RoofType)),
      sidingType: getRandomItem(Object.values(SidingType)),
      
      // Features & Amenities
      garage: getRandomBoolean(),
      carport: getRandomBoolean(),
      shed: getRandomBoolean(),
      deck: getRandomBoolean(),
      porch: getRandomBoolean(),
      centralAir: getRandomBoolean(),
      heating: getRandomItem(Object.values(HeatingType)),
      appliances: appliances.filter(() => getRandomBoolean()).slice(0, getRandomNumber(2, 6)),
      
      // Identification
      serialNumber: generateSerialNumber(),
      titleNumber: getRandomBoolean() ? generateTitleNumber() : undefined,
      
      // Media & Marketing
      virtualTour: getRandomBoolean() ? 'https://www.youtube.com/watch?v=virtual-tour-123' : undefined,
      
      // Additional Details
      condition: getRandomItem(Object.values(ConditionType)),
      financing: getRandomItem(Object.values(FinancingType)),
      moveInReady: getRandomBoolean(),
    }
    
    // Generate description after all properties are set
    listing.description = generateDescription(listing)
    
    listings.push(listing)
  }
  
  return listings
}

// Export sample data
export const sampleManufacturedHomes: ManufacturedHomeListing[] = generateManufacturedHomeListings(25)

// Export mock data object for consistency with other mocks
export const mockManufacturedHomes = {
  sampleManufacturedHomes,
  generateManufacturedHomeListings
}