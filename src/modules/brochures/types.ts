export type BrochureTheme = 'modern' | 'luxury' | 'outdoor' | 'family'
export type ListingType = 'rv' | 'manufactured_home' | 'both'

export interface BrochureTemplate {
  id: string
  name: string
  description: string
  theme: BrochureTheme
  listingType: ListingType
  layout: {
    coverPage: boolean
    tableOfContents: boolean
    listingPages: boolean
    contactPage: boolean
  }
  design: {
    primaryColor: string
    secondaryColor: string
    fontFamily: string
    logoPosition: 'top-left' | 'top-center' | 'top-right' | 'center'
  }
  content: {
    coverTitle: string
    coverSubtitle: string
    companyDescription: string
    contactInfo: {
      phone: string
      email: string
      website: string
      address: string
    }
  }
  createdAt: string
  updatedAt: string
}

export interface GeneratedBrochure {
  id: string
  name: string
  templateId: string
  templateName: string
  listingIds: string[]
  pdfUrl: string
  shareUrl: string
  analytics: {
    views: number
    downloads: number
    shares: number
    lastViewed: string | null
  }
  customizations?: any
  createdAt: string
  updatedAt: string
}

export interface BrochureAnalytics {
  totalViews: number
  totalDownloads: number
  totalShares: number
  topPerformingBrochures: Array<{
    id: string
    name: string
    views: number
    downloads: number
  }>
  viewsByDate: Array<{
    date: string
    views: number
    downloads: number
  }>
}