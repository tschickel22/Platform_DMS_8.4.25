import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { BrochureTemplate, GeneratedBrochure, BrochureTheme } from '../types'

interface BrochureState {
  templates: BrochureTemplate[]
  brochures: GeneratedBrochure[]
  
  // Template actions
  createTemplate: (template: Omit<BrochureTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<BrochureTemplate>
  updateTemplate: (id: string, updates: Partial<BrochureTemplate>) => Promise<void>
  deleteTemplate: (id: string) => Promise<void>
  
  // Brochure actions
  generateBrochure: (data: {
    templateId: string
    name: string
    listingIds: string[]
    customizations?: any
  }) => Promise<GeneratedBrochure>
  deleteBrochure: (id: string) => Promise<void>
  shareBrochure: (id: string, method: 'email' | 'sms' | 'link', options: any) => Promise<void>
}

// Sample templates to start with
const sampleTemplates: BrochureTemplate[] = [
  {
    id: 'template-rv-showcase',
    name: 'RV Showcase Brochure',
    description: 'Premium RV collection brochure template',
    theme: 'modern',
    listingType: 'rv',
    layout: {
      coverPage: true,
      tableOfContents: false,
      listingPages: true,
      contactPage: true
    },
    design: {
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      fontFamily: 'Inter',
      logoPosition: 'top-left'
    },
    content: {
      coverTitle: 'Premium RV Collection',
      coverSubtitle: 'Discover Your Next Adventure',
      companyDescription: 'Your trusted RV dealer with over 20 years of experience.',
      contactInfo: {
        phone: '(555) 123-4567',
        email: 'sales@company.com',
        website: 'www.company.com',
        address: '123 RV Lane, City, State 12345'
      }
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'template-mh-homes',
    name: 'Manufactured Homes',
    description: 'Manufactured homes catalog template',
    theme: 'luxury',
    listingType: 'manufactured_home',
    layout: {
      coverPage: true,
      tableOfContents: true,
      listingPages: true,
      contactPage: true
    },
    design: {
      primaryColor: '#059669',
      secondaryColor: '#374151',
      fontFamily: 'Inter',
      logoPosition: 'center'
    },
    content: {
      coverTitle: 'Quality Manufactured Homes',
      coverSubtitle: 'Find Your Perfect Home',
      companyDescription: 'Building dreams with quality manufactured homes.',
      contactInfo: {
        phone: '(555) 987-6543',
        email: 'homes@company.com',
        website: 'www.company.com',
        address: '456 Home Street, City, State 12345'
      }
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
]

// Sample generated brochures
const sampleBrochures: GeneratedBrochure[] = [
  {
    id: 'brochure-001',
    name: 'Spring 2024 RV Collection',
    templateId: 'template-rv-showcase',
    templateName: 'RV Showcase Brochure',
    listingIds: ['rv001', 'rv002', 'rv003'],
    pdfUrl: '/mock/brochures/spring-2024-rv-collection.pdf',
    shareUrl: 'https://company.com/brochures/spring-2024-rv',
    analytics: {
      views: 245,
      downloads: 67,
      shares: 23,
      lastViewed: '2024-01-25T14:30:00Z'
    },
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-25T14:30:00Z'
  },
  {
    id: 'brochure-002',
    name: 'Luxury Manufactured Homes',
    templateId: 'template-mh-homes',
    templateName: 'Manufactured Homes',
    listingIds: ['mh001', 'mh002', 'mh004'],
    pdfUrl: '/mock/brochures/luxury-manufactured-homes.pdf',
    shareUrl: 'https://company.com/brochures/luxury-homes',
    analytics: {
      views: 189,
      downloads: 45,
      shares: 12,
      lastViewed: '2024-01-24T16:15:00Z'
    },
    createdAt: '2024-01-18T11:30:00Z',
    updatedAt: '2024-01-24T16:15:00Z'
  }
]

export const useBrochureStore = create<BrochureState>()(
  persist(
    (set, get) => ({
      templates: sampleTemplates,
      brochures: sampleBrochures,

      createTemplate: async (templateData) => {
        const newTemplate: BrochureTemplate = {
          ...templateData,
          id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        set((state) => ({
          templates: [newTemplate, ...state.templates]
        }))

        return newTemplate
      },

      updateTemplate: async (id, updates) => {
        set((state) => ({
          templates: state.templates.map(template =>
            template.id === id
              ? { ...template, ...updates, updatedAt: new Date().toISOString() }
              : template
          )
        }))
      },

      deleteTemplate: async (id) => {
        set((state) => ({
          templates: state.templates.filter(template => template.id !== id)
        }))
      },

      generateBrochure: async (data) => {
        const template = get().templates.find(t => t.id === data.templateId)
        if (!template) {
          throw new Error('Template not found')
        }

        const newBrochure: GeneratedBrochure = {
          id: `brochure-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: data.name,
          templateId: data.templateId,
          templateName: template.name,
          listingIds: data.listingIds,
          pdfUrl: `/mock/brochures/${data.name.toLowerCase().replace(/\s+/g, '-')}.pdf`,
          shareUrl: `https://company.com/brochures/${data.name.toLowerCase().replace(/\s+/g, '-')}`,
          analytics: {
            views: 0,
            downloads: 0,
            shares: 0,
            lastViewed: null
          },
          customizations: data.customizations,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        set((state) => ({
          brochures: [newBrochure, ...state.brochures]
        }))

        return newBrochure
      },

      deleteBrochure: async (id) => {
        set((state) => ({
          brochures: state.brochures.filter(brochure => brochure.id !== id)
        }))
      },

      shareBrochure: async (id, method, options) => {
        // Update analytics when shared
        set((state) => ({
          brochures: state.brochures.map(brochure =>
            brochure.id === id
              ? {
                  ...brochure,
                  analytics: {
                    ...brochure.analytics,
                    shares: brochure.analytics.shares + 1
                  },
                  updatedAt: new Date().toISOString()
                }
              : brochure
          )
        }))
      }
    }),
    {
      name: 'brochure-store',
      version: 1
    }
  )
)