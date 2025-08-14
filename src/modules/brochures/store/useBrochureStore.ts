import { create } from 'zustand'
import { BrochureTemplate, GeneratedBrochure, BrochureTheme } from '../types'

interface BrochureStore {
  templates: BrochureTemplate[]
  brochures: GeneratedBrochure[]
  themes: BrochureTheme[]
  
  // Template actions
  addTemplate: (template: BrochureTemplate) => void
  updateTemplate: (id: string, updates: Partial<BrochureTemplate>) => void
  deleteTemplate: (id: string) => void
  getTemplate: (id: string) => BrochureTemplate | undefined
  
  // Brochure actions
  addBrochure: (brochure: GeneratedBrochure) => void
  updateBrochure: (id: string, updates: Partial<GeneratedBrochure>) => void
  deleteBrochure: (id: string) => void
  getBrochure: (id: string) => GeneratedBrochure | undefined
  
  // Theme actions
  addTheme: (theme: BrochureTheme) => void
  updateTheme: (id: string, updates: Partial<BrochureTheme>) => void
  deleteTheme: (id: string) => void
}

// Mock initial data
const mockTemplates: BrochureTemplate[] = [
  {
    id: 'template-1',
    name: 'RV Showcase Brochure',
    description: 'Premium RV collection brochure template',
    theme: 'modern',
    blocks: [
      {
        id: 'hero-1',
        type: 'hero',
        config: {
          title: '{{company_name}} RV Collection',
          subtitle: 'Discover Your Next Adventure',
          backgroundImage: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1200'
        }
      },
      {
        id: 'gallery-1',
        type: 'gallery',
        config: {
          title: 'Featured RVs',
          layout: 'grid',
          showPrices: true,
          showSpecs: true
        }
      },
      {
        id: 'cta-1',
        type: 'cta',
        config: {
          title: 'Ready to Start Your Adventure?',
          subtitle: 'Contact us today to schedule a viewing',
          buttonText: 'Contact Us',
          buttonUrl: '{{contact_url}}'
        }
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'template-2',
    name: 'Manufactured Homes Catalog',
    description: 'Manufactured homes catalog template',
    theme: 'family',
    blocks: [
      {
        id: 'hero-2',
        type: 'hero',
        config: {
          title: 'Quality Manufactured Homes',
          subtitle: 'Find Your Perfect Home',
          backgroundImage: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1200'
        }
      },
      {
        id: 'features-1',
        type: 'features',
        config: {
          title: 'Why Choose Our Homes',
          features: [
            'Energy Efficient Design',
            'Modern Amenities',
            'Flexible Financing',
            'Professional Installation'
          ]
        }
      },
      {
        id: 'gallery-2',
        type: 'gallery',
        config: {
          title: 'Available Homes',
          layout: 'list',
          showPrices: true,
          showSpecs: true
        }
      }
    ],
    createdAt: '2024-01-12T14:30:00Z',
    updatedAt: '2024-01-12T14:30:00Z'
  }
]

const mockBrochures: GeneratedBrochure[] = [
  {
    id: 'brochure-1',
    templateId: 'template-1',
    templateName: 'RV Showcase Brochure',
    title: 'Premium RV Collection - January 2024',
    description: 'Featuring our top RV models for winter adventures',
    listingIds: ['rv001', 'rv002', 'rv003'],
    publicId: 'pub-rv-jan-2024',
    isPublic: true,
    downloadCount: 45,
    shareCount: 12,
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-20T09:00:00Z'
  },
  {
    id: 'brochure-2',
    templateId: 'template-2',
    templateName: 'Manufactured Homes Catalog',
    title: 'New Home Arrivals - Winter 2024',
    description: 'Latest manufactured home models now available',
    listingIds: ['mh001', 'mh002', 'mh004'],
    publicId: 'pub-mh-winter-2024',
    isPublic: true,
    downloadCount: 28,
    shareCount: 8,
    createdAt: '2024-01-18T11:30:00Z',
    updatedAt: '2024-01-18T11:30:00Z'
  }
]

const mockThemes: BrochureTheme[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, contemporary design with bold typography',
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    accentColor: '#f59e0b',
    fontFamily: 'Inter',
    headerFont: 'Inter',
    bodyFont: 'Inter'
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Elegant design for premium properties',
    primaryColor: '#1f2937',
    secondaryColor: '#6b7280',
    accentColor: '#d97706',
    fontFamily: 'Playfair Display',
    headerFont: 'Playfair Display',
    bodyFont: 'Inter'
  },
  {
    id: 'outdoor',
    name: 'Outdoor Adventure',
    description: 'Nature-inspired design for RV and outdoor properties',
    primaryColor: '#059669',
    secondaryColor: '#374151',
    accentColor: '#dc2626',
    fontFamily: 'Montserrat',
    headerFont: 'Montserrat',
    bodyFont: 'Open Sans'
  },
  {
    id: 'family',
    name: 'Family Friendly',
    description: 'Warm, welcoming design for family homes',
    primaryColor: '#7c3aed',
    secondaryColor: '#6b7280',
    accentColor: '#f59e0b',
    fontFamily: 'Poppins',
    headerFont: 'Poppins',
    bodyFont: 'Inter'
  }
]

export const useBrochureStore = create<BrochureStore>((set, get) => ({
  templates: mockTemplates,
  brochures: mockBrochures,
  themes: mockThemes,
  
  // Template actions
  addTemplate: (template) => set((state) => ({
    templates: [...state.templates, template]
  })),
  
  updateTemplate: (id, updates) => set((state) => ({
    templates: state.templates.map(template =>
      template.id === id ? { ...template, ...updates, updatedAt: new Date().toISOString() } : template
    )
  })),
  
  deleteTemplate: (id) => set((state) => ({
    templates: state.templates.filter(template => template.id !== id)
  })),
  
  getTemplate: (id) => get().templates.find(template => template.id === id),
  
  // Brochure actions
  addBrochure: (brochure) => set((state) => ({
    brochures: [...state.brochures, brochure]
  })),
  
  updateBrochure: (id, updates) => set((state) => ({
    brochures: state.brochures.map(brochure =>
      brochure.id === id ? { ...brochure, ...updates, updatedAt: new Date().toISOString() } : brochure
    )
  })),
  
  deleteBrochure: (id) => set((state) => ({
    brochures: state.brochures.filter(brochure => brochure.id !== id)
  })),
  
  getBrochure: (id) => get().brochures.find(brochure => brochure.id === id),
  
  // Theme actions
  addTheme: (theme) => set((state) => ({
    themes: [...state.themes, theme]
  })),
  
  updateTheme: (id, updates) => set((state) => ({
    themes: state.themes.map(theme =>
      theme.id === id ? { ...theme, ...updates } : theme
    )
  })),
  
  deleteTheme: (id) => set((state) => ({
    themes: state.themes.filter(theme => theme.id !== id)
  }))
}))