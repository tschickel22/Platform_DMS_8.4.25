// Minimal mock you can expand later
export type PublicListing = {
  id: string
  title: string
  listingType: 'manufactured_home' | 'rv'
  year?: number
  make?: string
  model?: string
  salePrice?: number
  rentPrice?: number
  bedrooms?: number
  bathrooms?: number
  sleeps?: number
  length?: number
  slides?: number
  dimensions?: { sqft?: number }
  location: { city: string; state: string }
  media?: { primaryPhoto?: string | null; photos?: string[] }
}

// Ensure mockListings is properly exported and available
export const mockListings: PublicListing[] = [
  {
    id: 'listing_001',
    title: '3BR Manufactured Home in Austin',
    listingType: 'manufactured_home',
    year: 2020,
    make: 'Clayton',
    model: 'Everest',
    salePrice: 189000,
    bedrooms: 3,
    bathrooms: 2,
    dimensions: { sqft: 1450 },
    location: { city: 'Austin', state: 'TX' },
    media: { primaryPhoto: 'https://picsum.photos/800/450?mh1', photos: [] },
  },
  {
    id: 'listing_002',
    title: '2021 Jayco Jay Flight',
    listingType: 'rv',
    year: 2021,
    make: 'Jayco',
    model: 'Jay Flight',
    rentPrice: 1100,
    sleeps: 6,
    length: 28,
    slides: 1,
    location: { city: 'Boise', state: 'ID' },
    media: { primaryPhoto: 'https://picsum.photos/800/450?rv1', photos: [] },
  },
  {
    id: 'listing_003',
    title: '2BR Manufactured Home in Phoenix',
    listingType: 'manufactured_home',
    year: 2019,
    make: 'Fleetwood',
    model: 'Berkshire',
    salePrice: 145000,
    bedrooms: 2,
    bathrooms: 2,
    dimensions: { sqft: 1200 },
    location: { city: 'Phoenix', state: 'AZ' },
    media: { primaryPhoto: 'https://picsum.photos/800/450?mh2', photos: [] },
  },
  {
    id: 'listing_004',
    title: '2022 Forest River Cherokee',
    listingType: 'rv',
    year: 2022,
    make: 'Forest River',
    model: 'Cherokee',
    salePrice: 45000,
    sleeps: 4,
    length: 25,
    slides: 1,
    location: { city: 'Denver', state: 'CO' },
    media: { primaryPhoto: 'https://picsum.photos/800/450?rv2', photos: [] },
  },
  {
    id: 'listing_005',
    title: '4BR Manufactured Home in Tampa',
    listingType: 'manufactured_home',
    year: 2021,
    make: 'Champion',
    model: 'Homes',
    salePrice: 225000,
    rentPrice: 1800,
    bedrooms: 4,
    bathrooms: 3,
    dimensions: { sqft: 1800 },
    location: { city: 'Tampa', state: 'FL' },
    media: { primaryPhoto: 'https://picsum.photos/800/450?mh3', photos: [] },
  },
  {
    id: 'listing_006',
    title: '2020 Winnebago Minnie',
    listingType: 'rv',
    year: 2020,
    make: 'Winnebago',
    model: 'Minnie',
    rentPrice: 950,
    sleeps: 8,
    length: 32,
    slides: 2,
    location: { city: 'Portland', state: 'OR' },
    media: { primaryPhoto: 'https://picsum.photos/800/450?rv3', photos: [] },
  },
]