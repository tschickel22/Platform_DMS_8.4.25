export interface BrochureTheme {
  id: string
  name: string
  description: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  preview: string
}

export interface BrochureBlock {
  id: string
  type: 'hero' | 'gallery' | 'specs' | 'price' | 'features' | 'cta' | 'legal'
  title?: string
  subtitle?: string
  content?: string
  backgroundImage?: string
  showPrices?: boolean
  columns?: number
  buttonText?: string
  buttonUrl?: string
  order: number
  settings?: Record<string, any>
}

export interface BrochureTemplate {
  id: string
  name: string
  description: string
  listingType: 'rv' | 'manufactured_home' | 'both'
  theme: BrochureTheme
  blocks: BrochureBlock[]
  status: 'active' | 'draft' | 'archived'
  createdAt: string
  updatedAt: string
}

export interface GeneratedBrochure {
  id: string
  templateId: string
  templateName: string
  title: string
  listingType: 'rv' | 'manufactured_home' | 'both'
  listingIds: string[]
  listingCount: number
  pdfUrl: string
  publicId: string
  shareUrl: string
  analytics?: {
    views: number
    downloads: number
    shares: number
    lastViewed: string | null
  }
  createdAt: string
  updatedAt: string
}

export interface BrochureAnalytics {
  totalBrochures: number
  totalViews: number
  totalDownloads: number
  totalShares: number
  topPerforming: GeneratedBrochure[]
  templateUsage: Array<{
    templateId: string
    templateName: string
    usageCount: number
    avgViews: number
  }>
}