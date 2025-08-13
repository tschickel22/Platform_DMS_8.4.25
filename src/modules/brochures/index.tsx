/**
 * Brochure Builder Module - Entry Point
 * 
 * This module provides a complete brochure creation and management system.
 * Users can create modern, easy-to-edit brochure templates with company branding,
 * generate brochures from inventory/land/listings/quotes, and share them via
 * email, SMS, social media, or download as PNG/PDF.
 * 
 * Key Features:
 * - Template-based brochure creation with themes (sleek, card, poster)
 * - Drag-and-drop block editor (hero, gallery, specs, price, features, CTA, legal)
 * - Company branding integration (colors, fonts, logo)
 * - Token-based content binding ({{inventory.price}}, {{listing.title}}, etc.)
 * - Client-side sharing and export (no backend required)
 * - Analytics tracking for opens, shares, downloads
 * - Public brochure viewing with short URLs
 * 
 * Module Structure:
 * - /components - UI components (renderer, theme picker, share modal, tiles)
 * - /components/blocks - Individual block components and controls
 * - /hooks - Custom hooks for branding and data management
 * - /pages - Main page components (list, editor, public view)
 * - /store - Zustand store for state management
 * - /utils - Utilities for tokens, exports, sharing, analytics
 * 
 * Data Persistence:
 * - localStorage keys: ri_brochure_templates, ri_brochures, ri_branding, ri_brochure_analytics
 * - No backend dependencies - fully client-side for v1
 * - Rails/API integration planned for future versions
 * 
 * Navigation:
 * - /brochures - Main brochure management page
 * - /brochures/templates/new - Create new template
 * - /brochures/templates/:id/edit - Edit existing template
 * - /b/:publicId - Public brochure view
 * 
 * Integration Points:
 * - Can be launched from Inventory, Land, Listings, Quote Builder modules
 * - Uses company settings for branding defaults
 * - Tracks analytics for business insights
 * 
 * TODO: Implement all component files and wire up routing
 * TODO: Add export dependencies (html2canvas, jspdf)
 * TODO: Integrate with existing modules for data binding
 * TODO: Add comprehensive error boundaries and loading states
 */

import React from 'react'

// Main module exports
export { default as BrochureList } from './pages/BrochureList'
export { default as BrochureTemplateEditor } from './pages/BrochureTemplateEditor'
export { default as PublicBrochureView } from './pages/PublicBrochureView'

// Component exports
export { default as BrochureRenderer } from './components/BrochureRenderer'
export { default as ThemePicker } from './components/ThemePicker'
export { default as ShareBrochureModal } from './components/ShareBrochureModal'
export { default as Tiles } from './components/tiles/Tiles'

// Block component exports
export { default as HeroBlock } from './components/blocks/HeroBlock'
export { default as GalleryBlock } from './components/blocks/GalleryBlock'
export { default as SpecsBlock } from './components/blocks/SpecsBlock'
export { default as PriceBlock } from './components/blocks/PriceBlock'
export { default as FeaturesBlock } from './components/blocks/FeaturesBlock'
export { default as CTABlock } from './components/blocks/CTABlock'
export { default as LegalBlock } from './components/blocks/LegalBlock'
export { default as BlockPicker } from './components/blocks/BlockPicker'
export { default as BlockControls } from './components/blocks/BlockControls'

// Hook exports
export { default as useCompanyBranding } from './hooks/useCompanyBranding'

// Store exports
export { useBrochureStore } from './store/useBrochureStore'

// Utility exports
export * from './utils/tokens'
export * from './utils/exporters'
export * from './utils/sharing'
export * from './utils/analytics'

// Type exports
export * from './types'

/**
 * Helper function to open the brochure wizard from other modules
 * 
 * This function provides a programmatic way to launch the brochure creation
 * process from other parts of the application (Inventory, Land, Listings, Quote Builder).
 * 
 * @param options - Configuration for the brochure wizard
 * @param options.source - Source module type ('inventory' | 'land' | 'listing' | 'quote')
 * @param options.id - Optional ID of the source item for data binding
 * @param options.templateId - Optional template ID to start with
 * 
 * Usage Examples:
 * ```typescript
 * // Create brochure from inventory item
 * openBrochureWizard({ source: 'inventory', id: 'inv_123' })
 * 
 * // Create brochure from listing
 * openBrochureWizard({ source: 'listing', id: 'listing_456' })
 * 
 * // Create blank brochure
 * openBrochureWizard({})
 * ```
 * 
 * Navigation:
 * - Navigates to /brochures/templates/new with query parameters
 * - Editor will use mock snapshot data if available
 * - No cross-module imports required for v1
 * 
 * TODO: Implement navigation logic
 * TODO: Add data snapshot creation from source modules
 * TODO: Handle template pre-selection
 */
export const openBrochureWizard = (options: {
  source?: 'inventory' | 'land' | 'listing' | 'quote'
  id?: string
  templateId?: string
} = {}) => {
  const { source, id, templateId } = options
  
  // Build query parameters
  const params = new URLSearchParams()
  if (source) params.set('source', source)
  if (id) params.set('id', id)
  if (templateId) params.set('templateId', templateId)
  
  // Navigate to template editor
  const url = `/brochures/templates/new${params.toString() ? `?${params.toString()}` : ''}`
  
  // TODO: Use proper navigation method (React Router navigate)
  console.log('TODO: Navigate to:', url)
  window.location.href = url
}

/**
 * Helper function to create a brochure from template
 * 
 * @param templateId - ID of the template to use
 * @param options - Additional options for brochure creation
 */
export const createBrochureFromTemplate = (templateId: string, options: {
  source?: { type: 'inventory' | 'land' | 'listing' | 'quote', id?: string }
  snapshot?: Record<string, any>
} = {}) => {
  // TODO: Implement brochure creation logic
  console.log('TODO: Create brochure from template:', templateId, options)
}

/**
 * Helper function to get brochure analytics summary
 * 
 * @returns Analytics summary for dashboard display
 */
export const getBrochureAnalyticsSummary = () => {
  // TODO: Implement analytics summary
  return {
    totalTemplates: 0,
    totalBrochures: 0,
    totalViews: 0,
    totalShares: 0,
    totalDownloads: 0
  }
}

export default {
  openBrochureWizard,
  createBrochureFromTemplate,
  getBrochureAnalyticsSummary
}