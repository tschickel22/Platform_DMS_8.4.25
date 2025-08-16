export interface Manufacturer {
  id: string
  name: string
  slug: string
  logoUrl?: string
  externalUrl?: string
  enabled: boolean
  linkType: 'inventory' | 'external'
}

export interface NavConfig {
  manufacturersMenu: {
    enabled: boolean
    label: string
    items: Manufacturer[]
    allowCustom: boolean
  }
  showLandHomeMenu?: boolean
  landHomeLabel?: string
}

export interface SeoMeta {
  siteDefaults: {
    title?: string
    description?: string
    ogImageUrl?: string
    robots?: string
    canonicalBase?: string
  }
  pages: Record<string, {
    title?: string
    description?: string
    ogImageUrl?: string
    robots?: string
    canonicalPath?: string
  }>
}

export interface Tracking {
  ga4Id?: string
  gtagId?: string
  gtmId?: string
  headHtml?: string
  bodyEndHtml?: string
}

export interface Theme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  fonts: {
    heading: string
    body: string
  }
  spacing: {
    section: string
    container: string
  }
}

export interface Brand {
  logoUrl?: string
  color?: string
}

export interface Block {
  id: string
  type: BlockType
  content: Record<string, any>
  styles?: Record<string, any>
  order: number
}

export interface Page {
  id: string
  title: string
  path: string
  blocks: Block[]
  isVisible: boolean
  order: number
  seo?: {
    title?: string
    description?: string
    ogImageUrl?: string
    robots?: string
    canonicalPath?: string
  }
  createdAt: string
  updatedAt: string
}

export interface Site {
  id: string
  name: string
  slug: string
  pages: Page[]
  theme?: Theme
  nav?: NavConfig
  brand?: Brand
  faviconUrl?: string
  seo?: SeoMeta
  tracking?: Tracking
  domain?: string
  createdAt: string
  updatedAt: string
}

export interface Media {
  id: string
  name: string
  url: string
  type: 'image' | 'video' | 'document'
  size: number
  uploadedAt: string
}

export interface Version {
  id: string
  siteId: string
  name: string
  snapshot: Site
  createdAt: string
  isPublished: boolean
}

export enum BlockType {
  HERO = 'hero',
  TEXT = 'text',
  IMAGE = 'image',
  GALLERY = 'gallery',
  CTA = 'cta',
  CONTACT = 'contact',
  INVENTORY = 'inventory',
  LAND_HOME = 'landHome'
}

export interface DomainConfig {
  type: 'subdomain' | 'custom' | 'subdomain_custom' | 'multi_dealer'
  subdomain?: string
  customDomain?: string
  baseDomain?: string
  dealerCode?: string
  groupDomain?: string
}

export interface PublishResult {
  success: boolean
  previewUrl?: string
  error?: string
  publishedAt?: string
}

// Template types
export interface SiteTemplate {
  id: string
  name: string
  description: string
  category: 'rv_dealer' | 'mh_park' | 'brochure' | 'landing' | 'minimal'
  preview: string
  pages: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>[]
  theme: Theme
  nav: NavConfig
}

// Demo data types
export interface DemoInventoryItem {
  id: string
  type: 'rv' | 'manufactured_home'
  title: string
  price: number
  image: string
  specs: Record<string, any>
}

export interface DemoLandHomePackage {
  id: string
  type: 'land' | 'home' | 'package'
  title: string
  price: number
  image: string
  description: string
  features: string[]
}