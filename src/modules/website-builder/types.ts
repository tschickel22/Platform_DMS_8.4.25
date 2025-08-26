export interface Site {
  id: string
  name: string
  slug: string
  pages: Page[]
  theme?: Theme
  nav?: NavConfig
  brand?: { logoUrl?: string; color?: string }
  faviconUrl?: string
  seo?: SeoMeta
  tracking?: Tracking
  domain?: string
  createdAt: string
  updatedAt: string
}

export interface Page {
  id: string
  title: string
  path: string
  blocks: Block[]
  seo?: PageSeo
  order?: number
  createdAt?: string
  updatedAt?: string
}

export interface Block {
  id: string
  type: string
  content: any
  order: number
}

export interface Theme {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
}

export interface NavConfig {
  manufacturersMenu: {
    enabled: boolean
    label: string
    items: Manufacturer[]
  }
  showLandHomeMenu?: boolean
  landHomeLabel?: string
}

export interface Manufacturer {
  id: string
  name: string
  slug: string
  logoUrl?: string
  externalUrl?: string
  enabled: boolean
  linkType: 'inventory' | 'external'
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

export interface PageSeo {
  title?: string
  description?: string
  ogImageUrl?: string
  robots?: string
  canonicalPath?: string
}

export interface Tracking {
  ga4Id?: string
  gtagId?: string
  gtmId?: string
  headHtml?: string
  bodyEndHtml?: string
}

export interface Media {
  id: string
  name: string
  url: string
  type: 'image' | 'document'
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
  publishedAt?: string
  error?: string
}

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