/**
 * Brochure Builder - Type Definitions
 * 
 * This file contains all TypeScript interfaces and types used throughout
 * the Brochure Builder module. These types ensure type safety and provide
 * clear contracts for data structures.
 * 
 * Key Types:
 * - ThemeId: Visual theme options for brochures
 * - BrochureBlock: Union of all block types with flexible props
 * - BrochureTemplate: Template structure with metadata
 * - Brochure: Generated brochure instance
 * - BrandingProfile: Company branding configuration
 * 
 * Design Principles:
 * - All types are resilient to missing/malformed data
 * - Unknown block types must not crash the renderer
 * - Optional fields use ? modifier for flexibility
 */

// Theme options for brochure visual styling
export type ThemeId = 'sleek' | 'card' | 'poster'

// Base interface for all block types
interface BaseBlock {
  id: string
  type: string
}

// Hero block - main banner with title, subtitle, and image
export interface HeroBlock extends BaseBlock {
  type: 'hero'
  title?: string
  subtitle?: string
  imageUrl?: string
  backgroundColor?: string
}

// Gallery block - image grid display
export interface GalleryBlock extends BaseBlock {
  type: 'gallery'
  images?: string[]
  layout?: 'grid' | 'carousel' | 'masonry'
  columns?: number
}

// Specifications block - key/value pairs
export interface SpecsBlock extends BaseBlock {
  type: 'specs'
  title?: string
  specs?: Record<string, any>
  layout?: 'table' | 'grid' | 'list'
}

// Price block - pricing information
export interface PriceBlock extends BaseBlock {
  type: 'price'
  amount?: number | null
  label?: string
  currency?: string
  showCurrency?: boolean
  prefix?: string
  suffix?: string
}

// Features block - bullet point list
export interface FeaturesBlock extends BaseBlock {
  type: 'features'
  title?: string
  features?: string[]
  layout?: 'list' | 'grid' | 'columns'
  showBullets?: boolean
}

// Call-to-action block - button with action
export interface CTABlock extends BaseBlock {
  type: 'cta'
  headline?: string
  buttonText?: string
  link?: string
  backgroundColor?: string
  textColor?: string
}

// Legal block - fine print and disclaimers
export interface LegalBlock extends BaseBlock {
  type: 'legal'
  text?: string
  fontSize?: 'xs' | 'sm' | 'base'
  alignment?: 'left' | 'center' | 'right'
}

// Union of all block types - extensible for future block types
// Unknown types will render as fallback components
export type BrochureBlock = 
  | HeroBlock 
  | GalleryBlock 
  | SpecsBlock 
  | PriceBlock 
  | FeaturesBlock 
  | CTABlock 
  | LegalBlock
  | (BaseBlock & { type: string; [key: string]: any }) // Catch-all for unknown types

// Template structure - reusable brochure design
export interface BrochureTemplate {
  id: string
  name: string
  theme: ThemeId
  blocks: BrochureBlock[]
  branding?: BrandingProfile
  createdAt: string
  updatedAt: string
  version: number
}

// Source data reference for brochure generation
export interface BrochureSource {
  type: 'inventory' | 'land' | 'listing' | 'quote'
  id?: string
}

// Generated brochure instance
export interface Brochure {
  id: string
  templateId: string
  source?: BrochureSource
  snapshot?: Record<string, any> // Data snapshot for token resolution
  publicId?: string // For public sharing
  createdAt: string
  updatedAt?: string
}

// Company branding configuration
export interface BrandingProfile {
  logoUrl?: string
  primaryColor?: string
  secondaryColor?: string
  fontFamily?: string
  address?: string
  phone?: string
  email?: string
  website?: string
}

// Analytics event types
export type AnalyticsEvent = 
  | 'template_save'
  | 'template_duplicate'
  | 'brochure_create'
  | 'brochure_open'
  | 'brochure_share'
  | 'brochure_download'
  | 'cta_click'

// Analytics data structure
export interface AnalyticsData {
  event: AnalyticsEvent
  timestamp: string
  templateId?: string
  brochureId?: string
  metadata?: Record<string, any>
}

// Store state interface
export interface BrochureStoreState {
  // Templates
  templates: BrochureTemplate[]
  
  // Brochures
  brochures: Brochure[]
  
  // Branding
  branding: BrandingProfile | null
  
  // UI State
  autosaveOn: boolean
  lastOpenedTemplateId: string | null
  
  // Loading states
  isLoading: boolean
  error: string | null
}

// localStorage keys used for persistence
export const STORAGE_KEYS = {
  TEMPLATES: 'ri_brochure_templates',
  BROCHURES: 'ri_brochures', 
  BRANDING: 'ri_branding',
  ANALYTICS: 'ri_brochure_analytics',
  PUBLIC_PREFIX: 'ri_brochure_public_'
} as const