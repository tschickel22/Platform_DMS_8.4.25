import { create } from 'zustand'
import { BrochureTemplate, GeneratedBrochure, BrochureTheme } from '../types'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

interface BrochureStore {
  templates: BrochureTemplate[]
  generatedBrochures: GeneratedBrochure[]
  
  // Template CRUD
  createTemplate: (template: Omit<BrochureTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<BrochureTemplate>
  updateTemplate: (id: string, updates: Partial<BrochureTemplate>) => Promise<void>
  deleteTemplate: (id: string) => Promise<void>
  duplicateTemplate: (id: string) => Promise<BrochureTemplate>
  
  // Brochure generation
  generateBrochure: (params: {
    templateId: string
    title: string
    listingIds: string[]
  }) => Promise<GeneratedBrochure>
  
  // Brochure CRUD
  deleteBrochure: (id: string) => Promise<void>
  updateBrochureAnalytics: (id: string, analytics: Partial<GeneratedBrochure['analytics']>) => Promise<void>
}

const STORAGE_KEY = 'renter-insight-brochures'

// Mock initial data
const initialTemplates: BrochureTemplate[] = [
  {
    id: 'template-1',
    name: 'RV Showcase Brochure',
    description: 'Premium RV collection brochure template',
    listingType: 'rv',
    theme: {
      id: 'modern',
      name: 'Modern',
      description: 'Clean, contemporary design',
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      accentColor: '#f59e0b',
      fontFamily: 'Inter',
      preview: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400&h=300'
    },
    blocks: [
      {
        id: 'hero-1',
        type: 'hero',
        title: 'Premium RV Collection',
        subtitle: 'Discover your next adventure',
        backgroundImage: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
        order: 0
      },
      {
        id: 'gallery-1',
        type: 'gallery',
        title: 'Featured RVs',
        showPrices: true,
        columns: 2,
        order: 1
      }
    ],
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'template-2',
    name: 'Manufactured Homes',
    description: 'Manufactured homes catalog template',
    listingType: 'manufactured_home',
    theme: {
      id: 'family',
      name: 'Family Friendly',
      description: 'Warm, welcoming design',
      primaryColor: '#dc2626',
      secondaryColor: '#7c3aed',
      accentColor: '#f97316',
      fontFamily: 'Open Sans',
      preview: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=400&h=300'
    },
    blocks: [
      {
        id: 'hero-2',
        type: 'hero',
        title: 'Quality Manufactured Homes',
        subtitle: 'Find your perfect home today',
        backgroundImage: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=800',
        order: 0
      },
      {
        id: 'gallery-2',
        type: 'gallery',
        title: 'Available Homes',
        showPrices: true,
        columns: 3,
        order: 1
      }
    ],
    status: 'active',
    createdAt: '2024-01-12T14:30:00Z',
    updatedAt: '2024-01-12T14:30:00Z'
  }
]

const initialBrochures: GeneratedBrochure[] = [
  {
    id: 'brochure-1',
    templateId: 'template-1',
    templateName: 'RV Showcase Brochure',
    title: 'January 2024 RV Collection',
    listingType: 'rv',
    listingIds: ['rv001', 'rv002'],
    listingCount: 2,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    publicId: 'pub-brochure-1',
    shareUrl: `${window.location.origin}/b/pub-brochure-1`,
    analytics: {
      views: 45,
      downloads: 12,
      shares: 3,
      lastViewed: '2024-01-20T15:30:00Z'
    },
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    id: 'brochure-2',
    templateId: 'template-2',
    templateName: 'Manufactured Homes',
    title: 'Winter 2024 Home Catalog',
    listingType: 'manufactured_home',
    listingIds: ['mh001', 'mh002'],
    listingCount: 2,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    publicId: 'pub-brochure-2',
    shareUrl: `${window.location.origin}/b/pub-brochure-2`,
    analytics: {
      views: 28,
      downloads: 8,
      shares: 1,
      lastViewed: '2024-01-19T11:15:00Z'
    },
    createdAt: '2024-01-16T11:30:00Z',
    updatedAt: '2024-01-19T11:15:00Z'
  }
]

export const useBrochureStore = create<BrochureStore>((set, get) => {
  // Load initial data from localStorage or use defaults
  const savedData = loadFromLocalStorage(STORAGE_KEY, {
    templates: initialTemplates,
    generatedBrochures: initialBrochures
  })

  return {
    templates: savedData.templates,
    generatedBrochures: savedData.generatedBrochures,

    createTemplate: async (templateData) => {
      const newTemplate: BrochureTemplate = {
        ...templateData,
        id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      set(state => {
        const newState = {
          ...state,
          templates: [newTemplate, ...state.templates]
        }
        saveToLocalStorage(STORAGE_KEY, newState)
        return newState
      })

      return newTemplate
    },

    updateTemplate: async (id, updates) => {
      set(state => {
        const newState = {
          ...state,
          templates: state.templates.map(template =>
            template.id === id
              ? { ...template, ...updates, updatedAt: new Date().toISOString() }
              : template
          )
        }
        saveToLocalStorage(STORAGE_KEY, newState)
        return newState
      })
    },

    deleteTemplate: async (id) => {
      set(state => {
        const newState = {
          ...state,
          templates: state.templates.filter(template => template.id !== id)
        }
        saveToLocalStorage(STORAGE_KEY, newState)
        return newState
      })
    },

    duplicateTemplate: async (id) => {
      const template = get().templates.find(t => t.id === id)
      if (!template) throw new Error('Template not found')

      const duplicatedTemplate: BrochureTemplate = {
        ...template,
        id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `${template.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      set(state => {
        const newState = {
          ...state,
          templates: [duplicatedTemplate, ...state.templates]
        }
        saveToLocalStorage(STORAGE_KEY, newState)
        return newState
      })

      return duplicatedTemplate
    },

    generateBrochure: async ({ templateId, title, listingIds }) => {
      const template = get().templates.find(t => t.id === templateId)
      if (!template) throw new Error('Template not found')

      // Simulate PDF generation
      const mockPdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      const publicId = `pub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      const newBrochure: GeneratedBrochure = {
        id: `brochure-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        templateId,
        templateName: template.name,
        title,
        listingType: template.listingType,
        listingIds,
        listingCount: listingIds.length,
        pdfUrl: mockPdfUrl,
        publicId,
        shareUrl: `${window.location.origin}/b/${publicId}`,
        analytics: {
          views: 0,
          downloads: 0,
          shares: 0,
          lastViewed: null
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      set(state => {
        const newState = {
          ...state,
          generatedBrochures: [newBrochure, ...state.generatedBrochures]
        }
        saveToLocalStorage(STORAGE_KEY, newState)
        return newState
      })

      return newBrochure
    },

    deleteBrochure: async (id) => {
      set(state => {
        const newState = {
          ...state,
          generatedBrochures: state.generatedBrochures.filter(brochure => brochure.id !== id)
        }
        saveToLocalStorage(STORAGE_KEY, newState)
        return newState
      })
    },

    updateBrochureAnalytics: async (id, analytics) => {
      set(state => {
        const newState = {
          ...state,
          generatedBrochures: state.generatedBrochures.map(brochure =>
            brochure.id === id
              ? { 
                  ...brochure, 
                  analytics: { ...brochure.analytics, ...analytics },
                  updatedAt: new Date().toISOString()
                }
              : brochure
          )
        }
        saveToLocalStorage(STORAGE_KEY, newState)
        return newState
      })
    }
  }
})