export interface BrochureTemplate {
  id: string
  name: string
  description: string
  thumbnail?: string
  blocks: BrochureBlock[]
  theme: BrochureTheme
  createdAt: string
  updatedAt: string
}

export interface BrochureBlock {
  id: string
  type: BlockType
  content: any
  style?: BlockStyle
  order: number
}

export interface BrochureTheme {
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
}

export interface BlockStyle {
  backgroundColor?: string
  textColor?: string
  padding?: string
  margin?: string
  borderRadius?: string
  border?: string
}

export enum BlockType {
  HERO = 'hero',
  GALLERY = 'gallery',
  SPECS = 'specs',
  PRICE = 'price',
  FEATURES = 'features',
  CTA = 'cta',
  LEGAL = 'legal'
}

export interface ShareOptions {
  platform: 'email' | 'sms' | 'social' | 'qr' | 'link'
  recipients?: string[]
  message?: string
  trackClicks?: boolean
}

export interface BrochureAnalytics {
  views: number
  downloads: number
  shares: number
  clickThroughRate: number
  topSources: Array<{ source: string; count: number }>
}