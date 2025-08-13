/**
 * Brochure Builder - Zustand Store
 * 
 * This store manages all state for the Brochure Builder module using Zustand.
 * It provides actions for templates, brochures, branding, and UI state management.
 * All data is persisted to localStorage with automatic serialization/deserialization.
 * 
 * Store Features:
 * - Template CRUD operations with versioning
 * - Brochure generation and management
 * - Company branding integration
 * - Autosave functionality with debouncing
 * - Error handling and loading states
 * - Analytics event tracking
 * 
 * LocalStorage Keys:
 * - ri_brochure_templates: Template data
 * - ri_brochures: Generated brochure instances
 * - ri_branding: Company branding profile
 * - ri_brochure_analytics: Usage analytics
 * - ri_brochure_public_<id>: Public brochure data
 * 
 * State Management:
 * - Immutable updates using Zustand patterns
 * - Automatic persistence on state changes
 * - Debounced saves for performance
 * - Error boundaries for resilience
 * 
 * TODO: Implement all store actions
 * TODO: Add data validation and sanitization
 * TODO: Add migration utilities for version upgrades
 * TODO: Add offline support and sync capabilities
 * TODO: Add undo/redo functionality for editor
 */

import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { 
  BrochureStore, 
  BrochureTemplate, 
  Brochure, 
  BrandingProfile,
  BrochureBlock,
  ThemeId
} from '../types'

// =============================================================================
// PERSISTENCE UTILITIES
// =============================================================================

/**
 * LocalStorage keys for data persistence
 */
const STORAGE_KEYS = {
  TEMPLATES: 'ri_brochure_templates',
  BROCHURES: 'ri_brochures', 
  BRANDING: 'ri_branding',
  ANALYTICS: 'ri_brochure_analytics',
  PUBLIC_PREFIX: 'ri_brochure_public_'
} as const

/**
 * Safely parse JSON from localStorage
 */
const safeParseJSON = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.warn(`Failed to parse localStorage key "${key}":`, error)
    return defaultValue
  }
}

/**
 * Safely stringify and save to localStorage
 */
const safeSaveJSON = (key: string, data: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error(`Failed to save to localStorage key "${key}":`, error)
    return false
  }
}

// =============================================================================
// DEFAULT DATA
// =============================================================================

/**
 * Default branding profile with neutral colors and placeholders
 */
const DEFAULT_BRANDING: BrandingProfile = {
  companyName: 'Your Company',
  primaryColor: '#3B82F6', // Blue
  secondaryColor: '#64748B', // Slate
  accentColor: '#10B981', // Emerald
  fontFamily: 'Inter, system-ui, sans-serif',
  headingFont: 'Inter, system-ui, sans-serif',
  logoUrl: undefined,
  address: undefined,
  phone: undefined,
  email: undefined,
  website: undefined,
  disclaimer: 'All information subject to change without notice.',
  copyright: `© ${new Date().getFullYear()} Your Company. All rights reserved.`
}

/**
 * Default block configurations for new blocks
 */
const DEFAULT_BLOCKS: Record<string, Partial<BrochureBlock>> = {
  hero: {
    type: 'hero',
    title: 'Your Headline Here',
    subtitle: 'Add a compelling subtitle',
    alignment: 'center',
    height: 'medium',
    visible: true
  },
  gallery: {
    type: 'gallery',
    images: [],
    layout: 'grid',
    columns: 3,
    showCaptions: true,
    visible: true
  },
  specs: {
    type: 'specs',
    title: 'Specifications',
    specs: [
      { label: 'Year', value: '{{inventory.year}}' },
      { label: 'Make', value: '{{inventory.make}}' },
      { label: 'Model', value: '{{inventory.model}}' }
    ],
    layout: 'table',
    columns: 2,
    visible: true
  },
  price: {
    type: 'price',
    amount: null,
    currency: 'USD',
    label: 'Price',
    size: 'large',
    alignment: 'center',
    visible: true
  },
  features: {
    type: 'features',
    title: 'Key Features',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    layout: 'list',
    columns: 1,
    visible: true
  },
  cta: {
    type: 'cta',
    headline: 'Ready to Learn More?',
    buttonText: 'Contact Us',
    style: 'primary',
    size: 'large',
    alignment: 'center',
    visible: true
  },
  legal: {
    type: 'legal',
    text: 'All information is subject to change without notice. Please verify all details.',
    fontSize: 'sm',
    alignment: 'center',
    visible: true
  }
}

// =============================================================================
// STORE IMPLEMENTATION
// =============================================================================

/**
 * Main brochure store using Zustand
 */
export const useBrochureStore = create<BrochureStore>((set, get) => ({
  // =============================================================================
  // STATE
  // =============================================================================
  
  // Templates
  templates: safeParseJSON(STORAGE_KEYS.TEMPLATES, []),
  currentTemplate: null,
  
  // Brochures
  brochures: safeParseJSON(STORAGE_KEYS.BROCHURES, []),
  currentBrochure: null,
  
  // Branding
  branding: { ...DEFAULT_BRANDING, ...safeParseJSON(STORAGE_KEYS.BRANDING, {}) },
  
  // UI state
  selectedBlockId: null,
  autosaveEnabled: true,
  lastOpenedTemplateId: null,
  
  // Loading states
  isLoading: false,
  isSaving: false,
  isExporting: false,
  
  // Error handling
  error: null,

  // =============================================================================
  // TEMPLATE ACTIONS
  // =============================================================================

  /**
   * Creates a new template with default values
   * Returns the new template ID
   */
  createTemplate: (templateData = {}) => {
    const id = uuidv4()
    const now = new Date().toISOString()
    const { branding } = get()
    
    const newTemplate: BrochureTemplate = {
      id,
      name: templateData.name || 'Untitled Template',
      description: templateData.description || '',
      theme: templateData.theme || 'sleek',
      blocks: templateData.blocks || [],
      branding: { ...branding, ...templateData.branding },
      createdAt: now,
      updatedAt: now,
      version: 1,
      usageCount: 0,
      isPublic: false,
      tags: templateData.tags || [],
      ...templateData
    }
    
    set((state) => {
      const updatedTemplates = [...state.templates, newTemplate]
      safeSaveJSON(STORAGE_KEYS.TEMPLATES, updatedTemplates)
      
      return {
        templates: updatedTemplates,
        currentTemplate: newTemplate,
        lastOpenedTemplateId: id,
        error: null
      }
    })
    
    // TODO: Track analytics event
    console.log('TODO: Track template_created event')
    
    return id
  },

  /**
   * Updates an existing template with new data
   * Automatically updates the updatedAt timestamp and increments version
   */
  updateTemplate: (id, updates) => {
    set((state) => {
      const templateIndex = state.templates.findIndex(t => t.id === id)
      if (templateIndex === -1) {
        console.warn(`Template with id "${id}" not found`)
        return { error: 'Template not found' }
      }
      
      const updatedTemplate = {
        ...state.templates[templateIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
        version: state.templates[templateIndex].version + 1
      }
      
      const updatedTemplates = [...state.templates]
      updatedTemplates[templateIndex] = updatedTemplate
      
      safeSaveJSON(STORAGE_KEYS.TEMPLATES, updatedTemplates)
      
      return {
        templates: updatedTemplates,
        currentTemplate: state.currentTemplate?.id === id ? updatedTemplate : state.currentTemplate,
        error: null
      }
    })
    
    // TODO: Implement debounced autosave
    console.log('TODO: Implement debounced autosave for template updates')
  },

  /**
   * Deletes a template and all associated brochures
   */
  deleteTemplate: (id) => {
    set((state) => {
      const updatedTemplates = state.templates.filter(t => t.id !== id)
      const updatedBrochures = state.brochures.filter(b => b.templateId !== id)
      
      safeSaveJSON(STORAGE_KEYS.TEMPLATES, updatedTemplates)
      safeSaveJSON(STORAGE_KEYS.BROCHURES, updatedBrochures)
      
      return {
        templates: updatedTemplates,
        brochures: updatedBrochures,
        currentTemplate: state.currentTemplate?.id === id ? null : state.currentTemplate,
        selectedBlockId: null,
        error: null
      }
    })
    
    // TODO: Track analytics event
    console.log('TODO: Track template_deleted event')
  },

  /**
   * Duplicates an existing template with a new ID and " (Copy)" suffix
   */
  duplicateTemplate: (id) => {
    const { templates, createTemplate } = get()
    const originalTemplate = templates.find(t => t.id === id)
    
    if (!originalTemplate) {
      set({ error: 'Template not found for duplication' })
      return ''
    }
    
    const duplicateData = {
      ...originalTemplate,
      name: `${originalTemplate.name} (Copy)`,
      usageCount: 0,
      lastUsedAt: undefined
    }
    
    // Remove fields that should be regenerated
    delete duplicateData.id
    delete duplicateData.createdAt
    delete duplicateData.updatedAt
    
    return createTemplate(duplicateData)
  },

  /**
   * Retrieves a single template by ID
   */
  getTemplate: (id) => {
    const { templates } = get()
    return templates.find(t => t.id === id) || null
  },

  /**
   * Returns all templates sorted by updatedAt descending
   */
  listTemplates: () => {
    const { templates } = get()
    return [...templates].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  },

  // =============================================================================
  // BROCHURE ACTIONS
  // =============================================================================

  /**
   * Creates a new brochure from a template
   * Optionally includes source data and snapshot for token resolution
   */
  createBrochure: (templateId, options = {}) => {
    const { templates } = get()
    const template = templates.find(t => t.id === templateId)
    
    if (!template) {
      set({ error: 'Template not found for brochure creation' })
      return ''
    }
    
    const id = uuidv4()
    const publicId = options.publicId || `pub_${uuidv4().slice(0, 8)}`
    const now = new Date().toISOString()
    
    const newBrochure: Brochure = {
      id,
      templateId,
      source: options.source,
      snapshot: options.snapshot,
      publicId,
      isPublic: options.isPublic !== false, // Default to public
      createdAt: now,
      viewCount: 0,
      shareCount: 0,
      downloadCount: 0,
      ...options
    }
    
    set((state) => {
      const updatedBrochures = [...state.brochures, newBrochure]
      safeSaveJSON(STORAGE_KEYS.BROCHURES, updatedBrochures)
      
      // Save public brochure data for public access
      if (newBrochure.isPublic && publicId) {
        const publicData = {
          brochure: newBrochure,
          template: template,
          createdAt: now
        }
        safeSaveJSON(`${STORAGE_KEYS.PUBLIC_PREFIX}${publicId}`, publicData)
      }
      
      // Update template usage count
      const templateIndex = state.templates.findIndex(t => t.id === templateId)
      if (templateIndex !== -1) {
        const updatedTemplates = [...state.templates]
        updatedTemplates[templateIndex] = {
          ...updatedTemplates[templateIndex],
          usageCount: (updatedTemplates[templateIndex].usageCount || 0) + 1,
          lastUsedAt: now
        }
        safeSaveJSON(STORAGE_KEYS.TEMPLATES, updatedTemplates)
        
        return {
          brochures: updatedBrochures,
          templates: updatedTemplates,
          currentBrochure: newBrochure,
          error: null
        }
      }
      
      return {
        brochures: updatedBrochures,
        currentBrochure: newBrochure,
        error: null
      }
    })
    
    // TODO: Track analytics event
    console.log('TODO: Track brochure_created event')
    
    return id
  },

  /**
   * Updates an existing brochure
   */
  updateBrochure: (id, updates) => {
    set((state) => {
      const brochureIndex = state.brochures.findIndex(b => b.id === id)
      if (brochureIndex === -1) {
        console.warn(`Brochure with id "${id}" not found`)
        return { error: 'Brochure not found' }
      }
      
      const updatedBrochure = {
        ...state.brochures[brochureIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      
      const updatedBrochures = [...state.brochures]
      updatedBrochures[brochureIndex] = updatedBrochure
      
      safeSaveJSON(STORAGE_KEYS.BROCHURES, updatedBrochures)
      
      // Update public data if brochure is public
      if (updatedBrochure.isPublic && updatedBrochure.publicId) {
        const publicData = safeParseJSON(`${STORAGE_KEYS.PUBLIC_PREFIX}${updatedBrochure.publicId}`, null)
        if (publicData) {
          publicData.brochure = updatedBrochure
          safeSaveJSON(`${STORAGE_KEYS.PUBLIC_PREFIX}${updatedBrochure.publicId}`, publicData)
        }
      }
      
      return {
        brochures: updatedBrochures,
        currentBrochure: state.currentBrochure?.id === id ? updatedBrochure : state.currentBrochure,
        error: null
      }
    })
  },

  /**
   * Deletes a brochure and its public data
   */
  deleteBrochure: (id) => {
    set((state) => {
      const brochure = state.brochures.find(b => b.id === id)
      const updatedBrochures = state.brochures.filter(b => b.id !== id)
      
      safeSaveJSON(STORAGE_KEYS.BROCHURES, updatedBrochures)
      
      // Remove public data if exists
      if (brochure?.publicId) {
        localStorage.removeItem(`${STORAGE_KEYS.PUBLIC_PREFIX}${brochure.publicId}`)
      }
      
      return {
        brochures: updatedBrochures,
        currentBrochure: state.currentBrochure?.id === id ? null : state.currentBrochure,
        error: null
      }
    })
    
    // TODO: Track analytics event
    console.log('TODO: Track brochure_deleted event')
  },

  /**
   * Retrieves a single brochure by ID
   */
  getBrochure: (id) => {
    const { brochures } = get()
    return brochures.find(b => b.id === id) || null
  },

  /**
   * Retrieves a brochure by its public ID
   */
  getBrochureByPublicId: (publicId) => {
    const publicData = safeParseJSON(`${STORAGE_KEYS.PUBLIC_PREFIX}${publicId}`, null)
    return publicData?.brochure || null
  },

  /**
   * Returns all brochures sorted by creation date descending
   */
  listBrochures: () => {
    const { brochures } = get()
    return [...brochures].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },

  // =============================================================================
  // BRANDING ACTIONS
  // =============================================================================

  /**
   * Updates the company branding profile
   * Automatically applies to new templates unless overridden
   */
  setBranding: (brandingUpdates) => {
    set((state) => {
      const updatedBranding = { ...state.branding, ...brandingUpdates }
      safeSaveJSON(STORAGE_KEYS.BRANDING, updatedBranding)
      
      return {
        branding: updatedBranding,
        error: null
      }
    })
  },

  /**
   * Returns the current branding profile
   */
  getBranding: () => {
    const { branding } = get()
    return branding
  },

  // =============================================================================
  // UI ACTIONS
  // =============================================================================

  /**
   * Sets the currently active template
   */
  setCurrentTemplate: (template) => {
    set({
      currentTemplate: template,
      lastOpenedTemplateId: template?.id || null,
      selectedBlockId: null,
      error: null
    })
  },

  /**
   * Sets the currently active brochure
   */
  setCurrentBrochure: (brochure) => {
    set({
      currentBrochure: brochure,
      error: null
    })
  },

  /**
   * Sets the currently selected block for editing
   */
  setSelectedBlock: (blockId) => {
    set({ selectedBlockId: blockId })
  },

  /**
   * Toggles autosave functionality
   */
  setAutosave: (enabled) => {
    set({ autosaveEnabled: enabled })
  },

  // =============================================================================
  // UTILITY ACTIONS
  // =============================================================================

  /**
   * Clears any error state
   */
  clearError: () => {
    set({ error: null })
  },

  /**
   * Sets loading state
   */
  setLoading: (loading) => {
    set({ isLoading: loading })
  },

  /**
   * Sets saving state
   */
  setSaving: (saving) => {
    set({ isSaving: saving })
  },

  /**
   * Sets exporting state
   */
  setExporting: (exporting) => {
    set({ isExporting: exporting })
  }
}))

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Creates a new block with default properties
 */
export const createDefaultBlock = (type: string): BrochureBlock => {
  const id = uuidv4()
  const defaultProps = DEFAULT_BLOCKS[type] || { type, visible: true }
  
  return {
    id,
    order: 0,
    ...defaultProps
  } as BrochureBlock
}

/**
 * Applies branding to a template's blocks
 */
export const applyBrandingToTemplate = (template: BrochureTemplate, branding: BrandingProfile): BrochureTemplate => {
  // TODO: Implement branding application logic
  console.log('TODO: Apply branding to template blocks')
  return template
}

/**
 * Validates template data before saving
 */
export const validateTemplate = (template: Partial<BrochureTemplate>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!template.name || template.name.trim().length === 0) {
    errors.push('Template name is required')
  }
  
  if (!template.theme || !['sleek', 'card', 'poster'].includes(template.theme)) {
    errors.push('Valid theme is required')
  }
  
  if (!Array.isArray(template.blocks)) {
    errors.push('Template must have a blocks array')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Export store hook as default
export default useBrochureStore