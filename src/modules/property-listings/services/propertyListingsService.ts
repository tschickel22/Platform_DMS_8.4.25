import { PropertyListing, ListingTemplate, SyndicationPartner } from '../types'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

class PropertyListingsService {
  private readonly STORAGE_KEYS = {
    LISTINGS: 'property-listings',
    TEMPLATES: 'property-listing-templates',
    PARTNERS: 'syndication-partners',
    MEDIA: 'property-listing-media'
  }

  // Listings CRUD
  async getListings(): Promise<PropertyListing[]> {
    return loadFromLocalStorage(this.STORAGE_KEYS.LISTINGS, [])
  }

  async getListing(id: string): Promise<PropertyListing | null> {
    const listings = await this.getListings()
    return listings.find(listing => listing.id === id) || null
  }

  async createListing(listing: Omit<PropertyListing, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyListing> {
    const listings = await this.getListings()
    const newListing: PropertyListing = {
      ...listing,
      id: `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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

  // Templates
  async getTemplates(): Promise<ListingTemplate[]> {
    const stored = loadFromLocalStorage(this.STORAGE_KEYS.TEMPLATES, [])
    
    // If no templates exist, create defaults
    if (stored.length === 0) {
      const defaultTemplates = this.createDefaultTemplates()
      saveToLocalStorage(this.STORAGE_KEYS.TEMPLATES, defaultTemplates)
      return defaultTemplates
    }
    
    return stored
  }

  async getTemplate(id: string): Promise<ListingTemplate | null> {
    const templates = await this.getTemplates()
    return templates.find(template => template.id === id) || null
  }

  async createTemplate(template: Omit<ListingTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<ListingTemplate> {
    const templates = await this.getTemplates()
    const newTemplate: ListingTemplate = {
      ...template,
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    templates.push(newTemplate)
    saveToLocalStorage(this.STORAGE_KEYS.TEMPLATES, templates)
    
    return newTemplate
  }

  // Media handling (replacing Netlify blobs)
  async uploadMedia(file: File): Promise<{ url: string; id: string }> {
    return new Promise((resolve, reject) => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        reject(new Error('File size must be less than 5MB'))
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        const mediaId = `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const mediaItem = {
          id: mediaId,
          name: file.name,
          type: file.type,
          size: file.size,
          url: reader.result as string,
          uploadedAt: new Date().toISOString()
        }
        
        // Store media metadata
        const media = loadFromLocalStorage(this.STORAGE_KEYS.MEDIA, [])
        media.push(mediaItem)
        saveToLocalStorage(this.STORAGE_KEYS.MEDIA, media)
        
        resolve({ url: mediaItem.url, id: mediaId })
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  async getMedia(): Promise<Array<{ id: string; name: string; url: string; uploadedAt: string }>> {
    return loadFromLocalStorage(this.STORAGE_KEYS.MEDIA, [])
  }

  async deleteMedia(id: string): Promise<void> {
    const media = loadFromLocalStorage(this.STORAGE_KEYS.MEDIA, [])
    const filtered = media.filter(item => item.id !== id)
    saveToLocalStorage(this.STORAGE_KEYS.MEDIA, filtered)
  }

  // Syndication Partners
  async getSyndicationPartners(): Promise<SyndicationPartner[]> {
    return loadFromLocalStorage(this.STORAGE_KEYS.PARTNERS, [])
  }

  async createSyndicationPartner(partner: Omit<SyndicationPartner, 'id'>): Promise<SyndicationPartner> {
    const partners = await this.getSyndicationPartners()
    const newPartner: SyndicationPartner = {
      ...partner,
      id: `partner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    
    partners.push(newPartner)
    saveToLocalStorage(this.STORAGE_KEYS.PARTNERS, partners)
    
    return newPartner
  }

  // Export functionality (replacing Netlify functions)
  async exportListings(partnerId: string, listingIds: string[]): Promise<{ success: boolean; message: string }> {
    try {
      const partner = (await this.getSyndicationPartners()).find(p => p.id === partnerId)
      if (!partner) {
        throw new Error('Syndication partner not found')
      }

      const listings = await this.getListings()
      const selectedListings = listings.filter(listing => listingIds.includes(listing.id))
      
      // Format data based on partner requirements
      const exportData = selectedListings.map(listing => this.formatListingForExport(listing, partner))
      
      // In a real implementation, this would send to the partner's API
      // For now, we'll just log and return success
      console.log(`Exporting ${exportData.length} listings to ${partner.name}:`, exportData)
      
      return {
        success: true,
        message: `Successfully exported ${exportData.length} listings to ${partner.name}`
      }
    } catch (error) {
      console.error('Export failed:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Export failed'
      }
    }
  }

  private formatListingForExport(listing: PropertyListing, partner: SyndicationPartner): any {
    // Transform listing data based on partner's field mapping
    const exportData: any = {}
    
    Object.entries(partner.fieldMapping).forEach(([partnerField, listingField]) => {
      const value = this.getNestedValue(listing, listingField)
      if (value !== undefined) {
        exportData[partnerField] = value
      }
    })
    
    return exportData
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  private createDefaultTemplates(): ListingTemplate[] {
    return [
      {
        id: 'rv-standard',
        name: 'Standard RV Listing',
        description: 'Standard template for RV listings',
        listingType: 'rv',
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fields: [
          {
            id: 'title',
            name: 'title',
            label: 'Listing Title',
            type: 'text',
            required: true,
            section: 'Basic Info',
            order: 1,
            placeholder: 'e.g., 2023 Forest River Cherokee 274RK'
          },
          {
            id: 'year',
            name: 'year',
            label: 'Year',
            type: 'number',
            required: true,
            section: 'Basic Info',
            order: 2,
            validation: { min: 1950, max: new Date().getFullYear() + 1 }
          },
          {
            id: 'make',
            name: 'make',
            label: 'Make',
            type: 'text',
            required: true,
            section: 'Basic Info',
            order: 3
          },
          {
            id: 'model',
            name: 'model',
            label: 'Model',
            type: 'text',
            required: true,
            section: 'Basic Info',
            order: 4
          },
          {
            id: 'sleeps',
            name: 'sleeps',
            label: 'Sleeps',
            type: 'number',
            required: false,
            section: 'Specifications',
            order: 5
          },
          {
            id: 'length',
            name: 'length',
            label: 'Length (ft)',
            type: 'number',
            required: false,
            section: 'Specifications',
            order: 6
          },
          {
            id: 'slides',
            name: 'slides',
            label: 'Slide Outs',
            type: 'number',
            required: false,
            section: 'Specifications',
            order: 7
          },
          {
            id: 'salePrice',
            name: 'salePrice',
            label: 'Sale Price',
            type: 'number',
            required: false,
            section: 'Pricing',
            order: 8
          },
          {
            id: 'rentPrice',
            name: 'rentPrice',
            label: 'Rent Price',
            type: 'number',
            required: false,
            section: 'Pricing',
            order: 9
          }
        ]
      },
      {
        id: 'mh-standard',
        name: 'Standard Manufactured Home Listing',
        description: 'Standard template for manufactured home listings',
        listingType: 'manufactured_home',
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fields: [
          {
            id: 'title',
            name: 'title',
            label: 'Listing Title',
            type: 'text',
            required: true,
            section: 'Basic Info',
            order: 1,
            placeholder: 'e.g., 3BR/2BA Clayton The Edge'
          },
          {
            id: 'year',
            name: 'year',
            label: 'Year',
            type: 'number',
            required: true,
            section: 'Basic Info',
            order: 2
          },
          {
            id: 'make',
            name: 'make',
            label: 'Make',
            type: 'text',
            required: true,
            section: 'Basic Info',
            order: 3
          },
          {
            id: 'model',
            name: 'model',
            label: 'Model',
            type: 'text',
            required: true,
            section: 'Basic Info',
            order: 4
          },
          {
            id: 'bedrooms',
            name: 'bedrooms',
            label: 'Bedrooms',
            type: 'number',
            required: true,
            section: 'Specifications',
            order: 5
          },
          {
            id: 'bathrooms',
            name: 'bathrooms',
            label: 'Bathrooms',
            type: 'number',
            required: true,
            section: 'Specifications',
            order: 6
          },
          {
            id: 'sqft',
            name: 'dimensions.sqft',
            label: 'Square Feet',
            type: 'number',
            required: false,
            section: 'Specifications',
            order: 7
          },
          {
            id: 'salePrice',
            name: 'salePrice',
            label: 'Sale Price',
            type: 'number',
            required: false,
            section: 'Pricing',
            order: 8
          },
          {
            id: 'rentPrice',
            name: 'rentPrice',
            label: 'Rent Price',
            type: 'number',
            required: false,
            section: 'Pricing',
            order: 9
          }
        ]
      }
    ]
  }
}

export const propertyListingsService = new PropertyListingsService()