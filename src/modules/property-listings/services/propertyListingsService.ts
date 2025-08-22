import { PropertyListing, ListingTemplate, SyndicationPartner, ShareSettings, ListingExport, ListingAnalytics } from '../types'
import { saveToLocalStorage, loadFromLocalStorage, generateId } from '@/lib/utils'

class PropertyListingsService {
  private readonly STORAGE_KEYS = {
    LISTINGS: 'property-listings',
    TEMPLATES: 'property-listing-templates',
    PARTNERS: 'syndication-partners',
    ANALYTICS: 'listing-analytics',
    SHARE_TOKENS: 'listing-share-tokens'
  }

  // Listings CRUD
  async getListings(): Promise<PropertyListing[]> {
    return loadFromLocalStorage(this.STORAGE_KEYS.LISTINGS, this.getDefaultListings())
  }

  async getListing(id: string): Promise<PropertyListing | null> {
    const listings = await this.getListings()
    return listings.find(listing => listing.id === id) || null
  }

  async createListing(listingData: Omit<PropertyListing, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyListing> {
    const listings = await this.getListings()
    
    const newListing: PropertyListing = {
      ...listingData,
      id: generateId(),
      shareToken: generateId(),
      viewCount: 0,
      leadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    listings.push(newListing)
    saveToLocalStorage(this.STORAGE_KEYS.LISTINGS, listings)
    
    return newListing
  }

  async updateListing(id: string, updates: Partial<PropertyListing>): Promise<PropertyListing> {
    const listings = await this.getListings()
    const index = listings.findIndex(listing => listing.id === id)
    
    if (index === -1) {
      throw new Error('Listing not found')
    }
    
    const updatedListing = {
      ...listings[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    listings[index] = updatedListing
    saveToLocalStorage(this.STORAGE_KEYS.LISTINGS, listings)
    
    return updatedListing
  }

  async deleteListing(id: string): Promise<void> {
    const listings = await this.getListings()
    const filtered = listings.filter(listing => listing.id !== id)
    saveToLocalStorage(this.STORAGE_KEYS.LISTINGS, filtered)
  }

  async duplicateListing(id: string): Promise<PropertyListing> {
    const original = await this.getListing(id)
    if (!original) throw new Error('Listing not found')
    
    const duplicate = {
      ...original,
      title: `${original.title} (Copy)`,
      status: 'draft' as const,
      isPublic: false,
      shareToken: undefined
    }
    
    delete duplicate.id
    delete duplicate.createdAt
    delete duplicate.updatedAt
    delete duplicate.publishedAt
    
    return this.createListing(duplicate)
  }

  // Templates
  async getTemplates(): Promise<ListingTemplate[]> {
    return loadFromLocalStorage(this.STORAGE_KEYS.TEMPLATES, this.getDefaultTemplates())
  }

  async getTemplate(id: string): Promise<ListingTemplate | null> {
    const templates = await this.getTemplates()
    return templates.find(template => template.id === id) || null
  }

  async createTemplate(templateData: Omit<ListingTemplate, 'id'>): Promise<ListingTemplate> {
    const templates = await this.getTemplates()
    
    const newTemplate: ListingTemplate = {
      ...templateData,
      id: generateId()
    }
    
    templates.push(newTemplate)
    saveToLocalStorage(this.STORAGE_KEYS.TEMPLATES, templates)
    
    return newTemplate
  }

  async updateTemplate(id: string, updates: Partial<ListingTemplate>): Promise<ListingTemplate> {
    const templates = await this.getTemplates()
    const index = templates.findIndex(template => template.id === id)
    
    if (index === -1) {
      throw new Error('Template not found')
    }
    
    const updatedTemplate = { ...templates[index], ...updates }
    templates[index] = updatedTemplate
    saveToLocalStorage(this.STORAGE_KEYS.TEMPLATES, templates)
    
    return updatedTemplate
  }

  // Media Upload (Base64 for Bolt hosting)
  async uploadMedia(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('File size must be less than 5MB'))
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        reject(new Error('Only image files are allowed'))
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        resolve(reader.result as string)
      }
      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }
      reader.readAsDataURL(file)
    })
  }

  // Sharing
  async generateShareUrl(listingId: string, settings: ShareSettings): Promise<string> {
    const listing = await this.getListing(listingId)
    if (!listing) throw new Error('Listing not found')
    
    const shareToken = generateId()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + settings.expiresIn)
    
    // Update listing with share info
    await this.updateListing(listingId, {
      shareToken,
      expiresAt: expiresAt.toISOString(),
      isPublic: true
    })
    
    // Store share settings
    const shareTokens = loadFromLocalStorage(this.STORAGE_KEYS.SHARE_TOKENS, {})
    shareTokens[shareToken] = {
      listingId,
      settings,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString()
    }
    saveToLocalStorage(this.STORAGE_KEYS.SHARE_TOKENS, shareTokens)
    
    return `${window.location.origin}/public/demo/l/${shareToken}`
  }

  async generateShareAllUrl(settings: ShareSettings): Promise<string> {
    const shareToken = generateId()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + settings.expiresIn)
    
    // Store share settings for all listings
    const shareTokens = loadFromLocalStorage(this.STORAGE_KEYS.SHARE_TOKENS, {})
    shareTokens[shareToken] = {
      listingId: 'all',
      settings,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString()
    }
    saveToLocalStorage(this.STORAGE_KEYS.SHARE_TOKENS, shareTokens)
    
    return `${window.location.origin}/public/demo/l/${shareToken}`
  }

  // Export
  async exportListings(exportSettings: ListingExport): Promise<string> {
    const listings = await this.getListings()
    let filteredListings = listings

    // Apply filters
    if (exportSettings.filterBy) {
      const { status, type, priceRange } = exportSettings.filterBy
      
      filteredListings = listings.filter(listing => {
        if (status && !status.includes(listing.status)) return false
        if (type && !type.includes(listing.listingType)) return false
        if (priceRange) {
          const price = listing.salePrice || listing.rentPrice || 0
          if (price < priceRange.min || price > priceRange.max) return false
        }
        return true
      })
    }

    switch (exportSettings.format) {
      case 'CSV':
        return this.exportToCSV(filteredListings, exportSettings)
      case 'JSON':
        return this.exportToJSON(filteredListings, exportSettings)
      case 'XML':
        return this.exportToXML(filteredListings, exportSettings)
      default:
        throw new Error('Unsupported export format')
    }
  }

  // Analytics
  async getListingAnalytics(listingId: string): Promise<ListingAnalytics> {
    const analytics = loadFromLocalStorage(this.STORAGE_KEYS.ANALYTICS, {})
    return analytics[listingId] || {
      listingId,
      views: 0,
      leads: 0,
      shares: 0,
      topSources: [],
      conversionRate: 0
    }
  }

  async trackView(listingId: string, source: string = 'direct'): Promise<void> {
    const analytics = loadFromLocalStorage(this.STORAGE_KEYS.ANALYTICS, {})
    
    if (!analytics[listingId]) {
      analytics[listingId] = {
        listingId,
        views: 0,
        leads: 0,
        shares: 0,
        topSources: [],
        conversionRate: 0
      }
    }
    
    analytics[listingId].views++
    analytics[listingId].lastViewed = new Date().toISOString()
    
    // Update top sources
    const sourceIndex = analytics[listingId].topSources.findIndex((s: any) => s.source === source)
    if (sourceIndex >= 0) {
      analytics[listingId].topSources[sourceIndex].count++
    } else {
      analytics[listingId].topSources.push({ source, count: 1 })
    }
    
    saveToLocalStorage(this.STORAGE_KEYS.ANALYTICS, analytics)
  }

  // Syndication Partners
  async getSyndicationPartners(): Promise<SyndicationPartner[]> {
    return loadFromLocalStorage(this.STORAGE_KEYS.PARTNERS, this.getDefaultSyndicationPartners())
  }

  async updateSyndicationPartner(id: string, updates: Partial<SyndicationPartner>): Promise<SyndicationPartner> {
    const partners = await this.getSyndicationPartners()
    const index = partners.findIndex(partner => partner.id === id)
    
    if (index === -1) {
      throw new Error('Syndication partner not found')
    }
    
    const updatedPartner = { ...partners[index], ...updates }
    partners[index] = updatedPartner
    saveToLocalStorage(this.STORAGE_KEYS.PARTNERS, partners)
    
    return updatedPartner
  }

  async syncToPartner(partnerId: string, listingIds: string[]): Promise<{ success: boolean; message: string }> {
    // Mock syndication sync for Bolt hosting
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const partner = (await this.getSyndicationPartners()).find(p => p.id === partnerId)
    if (!partner) throw new Error('Partner not found')
    
    // Update sync status
    await this.updateSyndicationPartner(partnerId, {
      lastSync: new Date().toISOString(),
      syncStatus: 'success'
    })
    
    return {
      success: true,
      message: `Successfully synced ${listingIds.length} listings to ${partner.name}`
    }
  }

  // Private helper methods
  private exportToCSV(listings: PropertyListing[], settings: ListingExport): string {
    const headers = [
      'ID', 'Title', 'Type', 'Year', 'Make', 'Model', 'Sale Price', 'Rent Price',
      'City', 'State', 'Status', 'Created', 'Updated'
    ]
    
    const rows = listings.map(listing => [
      listing.id,
      listing.title,
      listing.listingType,
      listing.year,
      listing.make,
      listing.model,
      listing.salePrice || '',
      listing.rentPrice || '',
      listing.location.city,
      listing.location.state,
      listing.status,
      listing.createdAt,
      listing.updatedAt
    ])
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  private exportToJSON(listings: PropertyListing[], settings: ListingExport): string {
    const data = listings.map(listing => {
      const exported = { ...listing }
      
      if (!settings.includePrivateFields) {
        delete exported.exportMeta
        delete exported.shareToken
      }
      
      if (!settings.includePhotos) {
        exported.media = {
          ...exported.media,
          photos: [],
          primaryPhoto: ''
        }
      }
      
      return exported
    })
    
    return JSON.stringify(data, null, 2)
  }

  private exportToXML(listings: PropertyListing[], settings: ListingExport): string {
    const xmlListings = listings.map(listing => {
      return `
        <listing id="${listing.id}">
          <title><![CDATA[${listing.title}]]></title>
          <type>${listing.listingType}</type>
          <year>${listing.year}</year>
          <make><![CDATA[${listing.make}]]></make>
          <model><![CDATA[${listing.model}]]></model>
          <salePrice>${listing.salePrice || ''}</salePrice>
          <rentPrice>${listing.rentPrice || ''}</rentPrice>
          <city><![CDATA[${listing.location.city}]]></city>
          <state>${listing.location.state}</state>
          <status>${listing.status}</status>
          <created>${listing.createdAt}</created>
          <updated>${listing.updatedAt}</updated>
        </listing>
      `
    }).join('')
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<listings>
  ${xmlListings}
</listings>`
  }

  private getDefaultListings(): PropertyListing[] {
    return [
      {
        id: 'listing-001',
        title: '2023 Forest River Cherokee 274RK',
        description: 'Beautiful 2023 Forest River Cherokee travel trailer with slide-out. Perfect for family camping adventures with modern amenities and spacious interior.',
        listingType: 'rv',
        offerType: 'for_sale',
        status: 'active',
        salePrice: 45000,
        year: 2023,
        make: 'Forest River',
        model: 'Cherokee 274RK',
        condition: 'new',
        vin: 'FR123456789',
        stockNumber: 'RV-2023-001',
        sleeps: 4,
        slides: 1,
        length: 28.5,
        fuelType: 'gasoline',
        location: {
          city: 'Phoenix',
          state: 'AZ',
          postalCode: '85001',
          latitude: 33.4484,
          longitude: -112.0740
        },
        media: {
          primaryPhoto: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800',
          photos: [
            'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/2356086/pexels-photo-2356086.jpeg?auto=compress&cs=tinysrgb&w=800'
          ]
        },
        features: {
          generator: true,
          solar: false,
          awning: true,
          slideOut: true,
          appliances: ['Refrigerator', 'Microwave', 'Stove'],
          utilities: ['Electric', 'Water', 'Sewer']
        },
        searchResultsText: '2023 Forest River Cherokee - 28ft Travel Trailer',
        keywords: ['travel trailer', 'family camping', 'slide out', 'forest river'],
        isPublic: true,
        shareToken: 'share-001',
        viewCount: 45,
        leadCount: 3,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'listing-002',
        title: '2023 Clayton The Edge - 3BR/2BA',
        description: 'Brand new 2023 Clayton double-wide manufactured home with modern finishes and energy-efficient features. Perfect for families looking for affordable homeownership.',
        listingType: 'manufactured_home',
        offerType: 'both',
        status: 'active',
        salePrice: 95000,
        rentPrice: 1200,
        lotRent: 350,
        year: 2023,
        make: 'Clayton',
        model: 'The Edge',
        condition: 'new',
        serialNumber: 'CL987654321',
        stockNumber: 'MH-2023-001',
        bedrooms: 3,
        bathrooms: 2,
        dimensions: {
          width_ft: 28,
          length_ft: 66,
          sqft: 1450,
          sections: 2
        },
        location: {
          city: 'Tampa',
          state: 'FL',
          postalCode: '33601',
          communityName: 'Sunset Palms Mobile Home Community',
          latitude: 27.9506,
          longitude: -82.4572
        },
        media: {
          primaryPhoto: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=800',
          photos: [
            'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1546166/pexels-photo-1546166.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=800'
          ]
        },
        features: {
          centralAir: true,
          fireplace: true,
          dishwasher: true,
          washerDryer: true,
          vaultedCeilings: true,
          energyStar: true,
          appliances: ['Refrigerator', 'Dishwasher', 'Washer/Dryer'],
          flooring: ['Vinyl Plank', 'Carpet']
        },
        searchResultsText: '2023 Clayton The Edge - 3BR/2BA Double-wide',
        keywords: ['manufactured home', 'double wide', 'energy star', 'clayton'],
        isPublic: true,
        shareToken: 'share-002',
        viewCount: 67,
        leadCount: 8,
        createdAt: '2024-01-12T11:00:00Z',
        updatedAt: '2024-01-12T11:00:00Z'
      }
    ]
  }

  private getDefaultTemplates(): ListingTemplate[] {
    return [
      {
        id: 'template-rv-standard',
        name: 'Standard RV Template',
        description: 'Comprehensive template for RV listings',
        listingType: 'rv',
        isDefault: true,
        isActive: true,
        fields: [
          // Basic Info
          { id: 'title', name: 'title', label: 'Title', type: 'text', required: true, section: 'Basic Info', order: 1 },
          { id: 'description', name: 'description', label: 'Description', type: 'textarea', required: true, section: 'Basic Info', order: 2 },
          { id: 'year', name: 'year', label: 'Year', type: 'number', required: true, section: 'Basic Info', order: 3 },
          { id: 'make', name: 'make', label: 'Make', type: 'text', required: true, section: 'Basic Info', order: 4 },
          { id: 'model', name: 'model', label: 'Model', type: 'text', required: true, section: 'Basic Info', order: 5 },
          { id: 'condition', name: 'condition', label: 'Condition', type: 'select', required: true, options: ['new', 'used', 'refurbished'], section: 'Basic Info', order: 6 },
          { id: 'vin', name: 'vin', label: 'VIN', type: 'text', required: false, section: 'Basic Info', order: 7 },
          { id: 'stockNumber', name: 'stockNumber', label: 'Stock Number', type: 'text', required: false, section: 'Basic Info', order: 8 },
          
          // RV Specifications
          { id: 'sleeps', name: 'sleeps', label: 'Sleeps', type: 'number', required: false, section: 'Specifications', order: 9 },
          { id: 'slides', name: 'slides', label: 'Slide Outs', type: 'number', required: false, section: 'Specifications', order: 10 },
          { id: 'length', name: 'length', label: 'Length (ft)', type: 'number', required: false, section: 'Specifications', order: 11 },
          { id: 'fuelType', name: 'fuelType', label: 'Fuel Type', type: 'select', required: false, options: ['gasoline', 'diesel', 'electric', 'hybrid'], section: 'Specifications', order: 12 },
          { id: 'engine', name: 'engine', label: 'Engine', type: 'text', required: false, section: 'Specifications', order: 13 },
          { id: 'transmission', name: 'transmission', label: 'Transmission', type: 'select', required: false, options: ['automatic', 'manual'], section: 'Specifications', order: 14 },
          { id: 'odometerMiles', name: 'odometerMiles', label: 'Odometer Miles', type: 'number', required: false, section: 'Specifications', order: 15 },
          
          // Pricing
          { id: 'salePrice', name: 'salePrice', label: 'Sale Price', type: 'currency', required: false, section: 'Pricing', order: 16 },
          { id: 'rentPrice', name: 'rentPrice', label: 'Rent Price', type: 'currency', required: false, section: 'Pricing', order: 17 },
          
          // Location
          { id: 'city', name: 'location.city', label: 'City', type: 'text', required: true, section: 'Location', order: 18 },
          { id: 'state', name: 'location.state', label: 'State', type: 'text', required: true, section: 'Location', order: 19 },
          { id: 'postalCode', name: 'location.postalCode', label: 'Postal Code', type: 'text', required: false, section: 'Location', order: 20 },
          
          // Features
          { id: 'generator', name: 'features.generator', label: 'Generator', type: 'boolean', required: false, section: 'Features', order: 21 },
          { id: 'solar', name: 'features.solar', label: 'Solar Panels', type: 'boolean', required: false, section: 'Features', order: 22 },
          { id: 'awning', name: 'features.awning', label: 'Awning', type: 'boolean', required: false, section: 'Features', order: 23 },
          { id: 'slideOut', name: 'features.slideOut', label: 'Slide Out', type: 'boolean', required: false, section: 'Features', order: 24 }
        ]
      },
      {
        id: 'template-mh-standard',
        name: 'Standard Manufactured Home Template',
        description: 'Comprehensive template for manufactured home listings',
        listingType: 'manufactured_home',
        isDefault: true,
        isActive: true,
        fields: [
          // Basic Info
          { id: 'title', name: 'title', label: 'Title', type: 'text', required: true, section: 'Basic Info', order: 1 },
          { id: 'description', name: 'description', label: 'Description', type: 'textarea', required: true, section: 'Basic Info', order: 2 },
          { id: 'year', name: 'year', label: 'Year', type: 'number', required: true, section: 'Basic Info', order: 3 },
          { id: 'make', name: 'make', label: 'Make', type: 'text', required: true, section: 'Basic Info', order: 4 },
          { id: 'model', name: 'model', label: 'Model', type: 'text', required: true, section: 'Basic Info', order: 5 },
          { id: 'condition', name: 'condition', label: 'Condition', type: 'select', required: true, options: ['new', 'used', 'refurbished'], section: 'Basic Info', order: 6 },
          { id: 'serialNumber', name: 'serialNumber', label: 'Serial Number', type: 'text', required: false, section: 'Basic Info', order: 7 },
          { id: 'stockNumber', name: 'stockNumber', label: 'Stock Number', type: 'text', required: false, section: 'Basic Info', order: 8 },
          
          // MH Specifications
          { id: 'bedrooms', name: 'bedrooms', label: 'Bedrooms', type: 'number', required: false, section: 'Specifications', order: 9 },
          { id: 'bathrooms', name: 'bathrooms', label: 'Bathrooms', type: 'number', required: false, section: 'Specifications', order: 10 },
          { id: 'sqft', name: 'dimensions.sqft', label: 'Square Feet', type: 'number', required: false, section: 'Specifications', order: 11 },
          { id: 'width_ft', name: 'dimensions.width_ft', label: 'Width (ft)', type: 'number', required: false, section: 'Specifications', order: 12 },
          { id: 'length_ft', name: 'dimensions.length_ft', label: 'Length (ft)', type: 'number', required: false, section: 'Specifications', order: 13 },
          { id: 'sections', name: 'dimensions.sections', label: 'Sections', type: 'select', required: false, options: ['1', '2', '3'], section: 'Specifications', order: 14 },
          
          // Pricing
          { id: 'salePrice', name: 'salePrice', label: 'Sale Price', type: 'currency', required: false, section: 'Pricing', order: 15 },
          { id: 'rentPrice', name: 'rentPrice', label: 'Rent Price', type: 'currency', required: false, section: 'Pricing', order: 16 },
          { id: 'lotRent', name: 'lotRent', label: 'Lot Rent', type: 'currency', required: false, section: 'Pricing', order: 17 },
          { id: 'taxes', name: 'taxes', label: 'Annual Taxes', type: 'currency', required: false, section: 'Pricing', order: 18 },
          
          // Location
          { id: 'city', name: 'location.city', label: 'City', type: 'text', required: true, section: 'Location', order: 19 },
          { id: 'state', name: 'location.state', label: 'State', type: 'text', required: true, section: 'Location', order: 20 },
          { id: 'postalCode', name: 'location.postalCode', label: 'Postal Code', type: 'text', required: false, section: 'Location', order: 21 },
          { id: 'communityName', name: 'location.communityName', label: 'Community Name', type: 'text', required: false, section: 'Location', order: 22 },
          
          // Features
          { id: 'centralAir', name: 'features.centralAir', label: 'Central Air', type: 'boolean', required: false, section: 'Features', order: 23 },
          { id: 'fireplace', name: 'features.fireplace', label: 'Fireplace', type: 'boolean', required: false, section: 'Features', order: 24 },
          { id: 'dishwasher', name: 'features.dishwasher', label: 'Dishwasher', type: 'boolean', required: false, section: 'Features', order: 25 },
          { id: 'washerDryer', name: 'features.washerDryer', label: 'Washer/Dryer', type: 'boolean', required: false, section: 'Features', order: 26 },
          { id: 'vaultedCeilings', name: 'features.vaultedCeilings', label: 'Vaulted Ceilings', type: 'boolean', required: false, section: 'Features', order: 27 },
          { id: 'deck', name: 'features.deck', label: 'Deck', type: 'boolean', required: false, section: 'Features', order: 28 },
          { id: 'shed', name: 'features.shed', label: 'Shed', type: 'boolean', required: false, section: 'Features', order: 29 },
          { id: 'energyStar', name: 'features.energyStar', label: 'Energy Star Certified', type: 'boolean', required: false, section: 'Features', order: 30 }
        ]
      }
    ]
  }

  private getDefaultSyndicationPartners(): SyndicationPartner[] {
    return [
      {
        id: 'zillow',
        name: 'Zillow',
        description: 'Leading real estate marketplace',
        exportFormat: 'XML',
        isActive: true,
        supportedTypes: ['manufactured_home'],
        fieldMapping: {
          'title': 'ListingTitle',
          'salePrice': 'Price',
          'location.city': 'City',
          'location.state': 'State'
        }
      },
      {
        id: 'rvtrader',
        name: 'RV Trader',
        description: 'Premier RV marketplace',
        exportFormat: 'JSON',
        isActive: true,
        supportedTypes: ['rv'],
        fieldMapping: {
          'title': 'title',
          'salePrice': 'price',
          'make': 'make',
          'model': 'model'
        }
      },
      {
        id: 'mhvillage',
        name: 'MH Village',
        description: 'Manufactured home marketplace',
        exportFormat: 'XML',
        isActive: true,
        supportedTypes: ['manufactured_home'],
        fieldMapping: {
          'title': 'Title',
          'salePrice': 'SalePrice',
          'rentPrice': 'RentPrice'
        }
      }
    ]
  }
}

export const propertyListingsService = new PropertyListingsService()