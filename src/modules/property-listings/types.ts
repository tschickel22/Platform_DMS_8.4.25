export interface PropertyListing {
  id: string
  title: string
  description: string
  listingType: 'manufactured_home' | 'rv'
  offerType: 'for_sale' | 'for_rent' | 'both'
  status: 'active' | 'draft' | 'inactive'
  
  // Pricing
  salePrice?: number
  rentPrice?: number
  lotRent?: number
  taxes?: number
  hoa?: number
  
  // Basic Info
  year: number
  make: string
  model: string
  condition: 'new' | 'used' | 'refurbished'
  vin?: string
  serialNumber?: string
  stockNumber?: string
  
  // RV Specific
  sleeps?: number
  slides?: number
  length?: number
  fuelType?: string
  engine?: string
  transmission?: string
  odometerMiles?: number
  
  // Manufactured Home Specific
  bedrooms?: number
  bathrooms?: number
  dimensions?: {
    width_ft?: number
    length_ft?: number
    sqft?: number
    sections?: number
  }
  
  // Location
  location: {
    city: string
    state: string
    postalCode?: string
    address?: string
    communityName?: string
    township?: string
    schoolDistrict?: string
    latitude?: number
    longitude?: number
  }
  
  // Media
  media: {
    primaryPhoto: string
    photos: string[]
    virtualTour?: string
    videoUrl?: string
  }
  
  // Features (comprehensive)
  features: {
    // RV Features
    generator?: boolean
    solar?: boolean
    awning?: boolean
    slideOut?: boolean
    garage?: boolean
    
    // Manufactured Home Features
    centralAir?: boolean
    fireplace?: boolean
    dishwasher?: boolean
    washerDryer?: boolean
    vaultedCeilings?: boolean
    deck?: boolean
    shed?: boolean
    energyStar?: boolean
    
    // General Features
    furnished?: boolean
    petFriendly?: boolean
    smokingAllowed?: boolean
    utilities?: string[]
    appliances?: string[]
    flooring?: string[]
    
    // Custom features
    [key: string]: any
  }
  
  // SEO & Marketing
  searchResultsText?: string
  keywords?: string[]
  metaDescription?: string
  
  // Syndication & Export
  exportMeta?: {
    SellerID?: string
    CompanyID?: string
    RentalPrice?: number
    Township?: string
    SchoolDistrict?: string
    Latitude?: number
    Longitude?: number
    LotRent?: string
    Taxes?: string
    SellerAccountKey?: number
    SellerFirstName?: string
    SellerLastName?: string
    SellerCompanyName?: string
    SellerPhone?: string
    SellerEmail?: string
    SellerFax?: string
    SoldPrice?: number
    SellerWebsite?: string
    SellerEmail2?: string
    SellerEmail3?: string
    SellerEmail4?: string
    SellerPhone2?: string
  }
  
  // Sharing & Visibility
  isPublic: boolean
  shareToken?: string
  expiresAt?: string
  viewCount?: number
  leadCount?: number
  
  // Timestamps
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface ListingTemplate {
  id: string
  name: string
  description: string
  listingType: 'manufactured_home' | 'rv'
  fields: TemplateField[]
  isDefault: boolean
  isActive: boolean
}

export interface TemplateField {
  id: string
  name: string
  label: string
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean' | 'textarea' | 'currency' | 'date'
  required: boolean
  placeholder?: string
  options?: string[]
  defaultValue?: any
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
  description: string
  exportFormat: 'XML' | 'JSON' | 'CSV'
  endpoint?: string
  apiKey?: string
  isActive: boolean
  supportedTypes: ('manufactured_home' | 'rv')[]
  fieldMapping: Record<string, string>
  lastSync?: string
  syncStatus?: 'success' | 'error' | 'pending'
}

export interface ShareSettings {
  type: 'single' | 'all'
  expiresIn: number // days
  includeContact: boolean
  customMessage?: string
  allowLeadCapture: boolean
  trackViews: boolean
}

export interface ListingExport {
  format: 'CSV' | 'XML' | 'JSON' | 'PDF'
  includePhotos: boolean
  includePrivateFields: boolean
  filterBy?: {
    status?: string[]
    type?: string[]
    priceRange?: { min: number; max: number }
  }
}

export interface ListingAnalytics {
  listingId: string
  views: number
  leads: number
  shares: number
  lastViewed?: string
  topSources: Array<{ source: string; count: number }>
  conversionRate: number
}