export interface PropertyListing {
  id: string
  title: string
  description: string
  listingType: 'manufactured_home' | 'rv'
  offerType: 'for_sale' | 'for_rent' | 'both'
  status: 'active' | 'draft' | 'inactive'
  salePrice?: number
  rentPrice?: number
  year: number
  make: string
  model: string
  vin?: string
  serialNumber?: string
  condition: 'new' | 'used' | 'refurbished'
  
  // RV specific fields
  sleeps?: number
  slides?: number
  length?: number
  fuelType?: string
  engine?: string
  transmission?: string
  odometerMiles?: number
  
  // Manufactured Home specific fields
  bedrooms?: number
  bathrooms?: number
  dimensions?: {
    width_ft?: number
    length_ft?: number
    sections?: number
    sqft?: number
  }
  
  location: {
    city: string
    state: string
    postalCode?: string
    address?: string
    communityName?: string
    coordinates?: {
      latitude: number
      longitude: number
    }
  }
  
  media: {
    primaryPhoto: string
    photos: string[]
    virtualTour?: string
  }
  
  features: Record<string, boolean | string | number>
  
  // SEO and marketing
  searchResultsText?: string
  seoTitle?: string
  seoDescription?: string
  keywords?: string[]
  
  // Pricing and terms
  lotRent?: number
  taxes?: number
  financing?: {
    available: boolean
    downPayment?: number
    monthlyPayment?: number
    termMonths?: number
    interestRate?: number
  }
  
  // Contact and seller info
  contactInfo?: {
    name: string
    phone: string
    email: string
    website?: string
  }
  
  // Syndication
  syndicationPartners?: string[]
  lastSynced?: string
  
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export interface ListingTemplate {
  id: string
  name: string
  description: string
  listingType: 'manufactured_home' | 'rv'
  fields: TemplateField[]
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface TemplateField {
  id: string
  name: string
  label: string
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean' | 'textarea' | 'image' | 'date'
  required: boolean
  options?: string[]
  defaultValue?: any
  placeholder?: string
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
  section: string
  order: number
}

export interface SyndicationPartner {
  id: string
  name: string
  exportFormat: 'XML' | 'JSON'
  exportUrl: string
  isActive: boolean
  lastSync?: string
  supportedListingTypes: string[]
  fieldMapping: Record<string, string>
}

export interface ListingExport {
  id: string
  listingId: string
  partnerId: string
  exportedAt: string
  status: 'success' | 'failed' | 'pending'
  errorMessage?: string
}