export interface BrochureTemplate {
  id: string
  name: string
  description: string
  theme: string
  blocks: BrochureBlock[]
  createdAt: string
  updatedAt: string
}

export interface BrochureBlock {
  id: string
  type: 'hero' | 'gallery' | 'features' | 'specs' | 'price' | 'cta' | 'legal'
  config: Record<string, any>
}

export interface BrochureTheme {
  id: string
  name: string
  description: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  headerFont: string
  bodyFont: string
}

export interface GeneratedBrochure {
  id: string
  templateId: string
  templateName: string
  title: string
  description?: string
  listingIds: string[]
  publicId: string
  isPublic: boolean
  downloadCount: number
  shareCount: number
  createdAt: string
  updatedAt: string
}

export interface BrochureAnalytics {
  brochureId: string
  views: number
  downloads: number
  shares: number
  clickThroughs: number
  conversionRate: number
  topReferrers: Array<{ domain: string; count: number }>
  viewsByDate: Array<{ date: string; views: number }>
}