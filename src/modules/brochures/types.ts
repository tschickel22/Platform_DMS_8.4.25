/**
 * Brochure Builder - Type Definitions
 * 
 * This file contains all TypeScript type definitions for the Brochure Builder module.
 * These types define the data contracts and interfaces used throughout the system.
 * 
 * Key Type Categories:
 * - Theme Types: Visual styling options for brochures
 * - Block Types: Individual content blocks that make up brochures
 * - Template Types: Reusable brochure templates
 * - Brochure Types: Generated brochures from templates
 * - Branding Types: Company branding and styling information
 * - Analytics Types: Tracking and metrics data
 * 
 * Design Principles:
 * - All types are designed to be resilient to missing or malformed data
 * - Unknown block types must not crash the renderer
 * - Optional properties use ? modifier for flexibility
 * - Union types provide type safety while allowing extensibility
 * 
 * Data Persistence:
 * - These types map directly to localStorage data structures
 * - All objects include metadata fields (id, createdAt, updatedAt)
 * - Version fields support future migration scenarios
 * 
 * TODO: Add validation schemas for runtime type checking
 * TODO: Add migration utilities for version upgrades
 * TODO: Consider adding JSDoc examples for complex types
 */

// =============================================================================
// THEME TYPES
// =============================================================================

/**
 * Available brochure themes
 * 
 * Each theme provides different visual styling:
 * - sleek: Modern, minimal design with clean lines
 * - card: Card-based layout with shadows and borders
 * - poster: Bold, poster-style design with large typography
 */
export type ThemeId = 'sleek' | 'card' | 'poster'

/**
 * Theme configuration and styling rules
 */
export interface ThemeConfig {
  id: ThemeId
  name: string
  description: string
  
  // Layout properties
  spacing: 'compact' | 'normal' | 'spacious'
  borderRadius: number
  shadows: boolean
  
  // Typography
  fontScale: number
  headingWeight: 'normal' | 'bold' | 'black'
  
  // Colors (will be merged with branding)
  accentColorUsage: 'minimal' | 'moderate' | 'prominent'
}

// =============================================================================
// BLOCK TYPES
// =============================================================================

/**
 * Base interface for all brochure blocks
 */
export interface BaseBlock {
  id: string
  type: string
  order: number
  visible: boolean
}

/**
 * Hero block - Large header section with title, subtitle, and background
 */
export interface HeroBlock extends BaseBlock {
  type: 'hero'
  title: string
  subtitle?: string
  imageUrl?: string
  backgroundColor?: string
  textColor?: string
  alignment: 'left' | 'center' | 'right'
  height: 'small' | 'medium' | 'large'
}

/**
 * Gallery block - Grid of images with captions
 */
export interface GalleryBlock extends BaseBlock {
  type: 'gallery'
  images: Array<{
    url: string
    caption?: string
    alt?: string
  }>
  layout: 'grid' | 'carousel' | 'masonry'
  columns: 1 | 2 | 3 | 4
  showCaptions: boolean
}

/**
 * Specifications block - Key-value pairs in a structured format
 */
export interface SpecsBlock extends BaseBlock {
  type: 'specs'
  title?: string
  specs: Array<{
    label: string
    value: string
    highlight?: boolean
  }>
  layout: 'table' | 'grid' | 'list'
  columns: 1 | 2 | 3
}

/**
 * Price block - Pricing information with formatting
 */
export interface PriceBlock extends BaseBlock {
  type: 'price'
  amount: number | null
  currency: string
  label?: string
  originalAmount?: number
  showDiscount?: boolean
  size: 'small' | 'medium' | 'large'
  alignment: 'left' | 'center' | 'right'
}

/**
 * Features block - Bulleted list of features or benefits
 */
export interface FeaturesBlock extends BaseBlock {
  type: 'features'
  title?: string
  features: string[]
  icon?: string
  layout: 'list' | 'grid' | 'columns'
  columns: 1 | 2 | 3
}

/**
 * Call-to-action block - Button or link with compelling text
 */
export interface CTABlock extends BaseBlock {
  type: 'cta'
  headline?: string
  buttonText: string
  link?: string
  style: 'primary' | 'secondary' | 'outline'
  size: 'small' | 'medium' | 'large'
  alignment: 'left' | 'center' | 'right'
}

/**
 * Legal block - Fine print, disclaimers, terms
 */
export interface LegalBlock extends BaseBlock {
  type: 'legal'
  text: string
  fontSize: 'xs' | 'sm' | 'base'
  alignment: 'left' | 'center' | 'right'
  backgroundColor?: string
}

/**
 * Union type of all possible block types
 * 
 * Note: The renderer must handle unknown block types gracefully
 * by rendering a fallback component instead of crashing.
 */
export type BrochureBlock = 
  | HeroBlock 
  | GalleryBlock 
  | SpecsBlock 
  | PriceBlock 
  | FeaturesBlock 
  | CTABlock 
  | LegalBlock

/**
 * Block type registry for dynamic component mapping
 */
export interface BlockTypeInfo {
  type: string
  name: string
  description: string
  icon: string
  category: 'content' | 'media' | 'data' | 'action'
  defaultProps: Partial<BrochureBlock>
}

// =============================================================================
// TEMPLATE TYPES
// =============================================================================

/**
 * Brochure template - Reusable design with blocks and styling
 */
export interface BrochureTemplate {
  id: string
  name: string
  description?: string
  
  // Design configuration
  theme: ThemeId
  blocks: BrochureBlock[]
  
  // Branding override (optional, falls back to company branding)
  branding?: Partial<BrandingProfile>
  
  // Metadata
  createdAt: string
  updatedAt: string
  version: number
  
  // Usage tracking
  usageCount?: number
  lastUsedAt?: string
  
  // Template settings
  isPublic?: boolean
  tags?: string[]
}

// =============================================================================
// BROCHURE TYPES
// =============================================================================

/**
 * Source information for data-bound brochures
 */
export interface BrochureSource {
  type: 'inventory' | 'land' | 'listing' | 'quote'
  id?: string
  name?: string
}

/**
 * Generated brochure instance from a template
 */
export interface Brochure {
  id: string
  templateId: string
  
  // Data binding
  source?: BrochureSource
  snapshot?: Record<string, any> // Cached data for token resolution
  
  // Sharing
  publicId?: string // For public URLs like /b/:publicId
  isPublic?: boolean
  
  // Metadata
  createdAt: string
  updatedAt?: string
  
  // Analytics
  viewCount?: number
  shareCount?: number
  downloadCount?: number
  lastViewedAt?: string
}

// =============================================================================
// BRANDING TYPES
// =============================================================================

/**
 * Company branding profile for consistent styling
 */
export interface BrandingProfile {
  // Visual identity
  logoUrl?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  
  // Typography
  fontFamily?: string
  headingFont?: string
  
  // Contact information
  companyName?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  
  // Social media
  socialLinks?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
  
  // Legal
  disclaimer?: string
  copyright?: string
}

// =============================================================================
// ANALYTICS TYPES
// =============================================================================

/**
 * Analytics event for tracking user interactions
 */
export interface AnalyticsEvent {
  event: string
  timestamp: string
  brochureId?: string
  templateId?: string
  publicId?: string
  metadata?: Record<string, any>
}

/**
 * Analytics summary for dashboard display
 */
export interface AnalyticsSummary {
  // Template metrics
  totalTemplates: number
  templatesCreated: number
  templatesUsed: number
  
  // Brochure metrics
  totalBrochures: number
  brochuresCreated: number
  brochuresShared: number
  
  // Engagement metrics
  totalViews: number
  totalShares: number
  totalDownloads: number
  totalCTAClicks: number
  
  // Time period
  period: string
  lastUpdated: string
}

/**
 * Detailed analytics for a specific brochure or template
 */
export interface DetailedAnalytics {
  id: string
  type: 'template' | 'brochure'
  
  // View metrics
  views: number
  uniqueViews: number
  viewsByDate: Record<string, number>
  
  // Sharing metrics
  shares: number
  sharesByPlatform: Record<string, number>
  
  // Download metrics
  downloads: number
  downloadsByFormat: Record<string, number>
  
  // Engagement metrics
  ctaClicks: number
  averageViewTime?: number
  
  // Geographic data (if available)
  viewsByLocation?: Record<string, number>
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Token context for resolving dynamic content
 */
export interface TokenContext {
  // Source data
  inventory?: Record<string, any>
  land?: Record<string, any>
  listing?: Record<string, any>
  quote?: Record<string, any>
  
  // Company data
  company?: BrandingProfile
  
  // User data
  user?: Record<string, any>
  
  // Custom data
  custom?: Record<string, any>
}

/**
 * Export options for brochure generation
 */
export interface ExportOptions {
  format: 'png' | 'pdf'
  quality?: number
  scale?: number
  filename?: string
  watermark?: boolean
}

/**
 * Share options for brochure distribution
 */
export interface ShareOptions {
  platform: 'email' | 'sms' | 'facebook' | 'twitter' | 'linkedin' | 'copy' | 'download'
  message?: string
  subject?: string
  includePreview?: boolean
}

/**
 * Validation result for templates and brochures
 */
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// =============================================================================
// STORE TYPES
// =============================================================================

/**
 * Brochure store state interface
 */
export interface BrochureStoreState {
  // Templates
  templates: BrochureTemplate[]
  currentTemplate: BrochureTemplate | null
  
  // Brochures
  brochures: Brochure[]
  currentBrochure: Brochure | null
  
  // Branding
  branding: BrandingProfile
  
  // UI state
  selectedBlockId: string | null
  autosaveEnabled: boolean
  lastOpenedTemplateId: string | null
  
  // Loading states
  isLoading: boolean
  isSaving: boolean
  isExporting: boolean
  
  // Error handling
  error: string | null
}

/**
 * Brochure store actions interface
 */
export interface BrochureStoreActions {
  // Template actions
  createTemplate: (template: Partial<BrochureTemplate>) => string
  updateTemplate: (id: string, updates: Partial<BrochureTemplate>) => void
  deleteTemplate: (id: string) => void
  duplicateTemplate: (id: string) => string
  getTemplate: (id: string) => BrochureTemplate | null
  listTemplates: () => BrochureTemplate[]
  
  // Brochure actions
  createBrochure: (templateId: string, options?: Partial<Brochure>) => string
  updateBrochure: (id: string, updates: Partial<Brochure>) => void
  deleteBrochure: (id: string) => void
  getBrochure: (id: string) => Brochure | null
  getBrochureByPublicId: (publicId: string) => Brochure | null
  listBrochures: () => Brochure[]
  
  // Branding actions
  setBranding: (branding: Partial<BrandingProfile>) => void
  getBranding: () => BrandingProfile
  
  // UI actions
  setCurrentTemplate: (template: BrochureTemplate | null) => void
  setCurrentBrochure: (brochure: Brochure | null) => void
  setSelectedBlock: (blockId: string | null) => void
  setAutosave: (enabled: boolean) => void
  
  // Utility actions
  clearError: () => void
  setLoading: (loading: boolean) => void
  setSaving: (saving: boolean) => void
  setExporting: (exporting: boolean) => void
}

export type BrochureStore = BrochureStoreState & BrochureStoreActions