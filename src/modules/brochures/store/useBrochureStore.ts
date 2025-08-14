import { useState, useEffect } from 'react'
import { BrochureTemplate } from '../types'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

const STORAGE_KEY = 'renter-insight-brochure-templates'

// Default templates
const defaultTemplates: BrochureTemplate[] = [
  {
    id: 'template-rv-showcase',
    name: 'RV Showcase',
    description: 'Premium RV collection brochure template',
    type: 'rv',
    layout: 'modern',
    theme: {
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      fontFamily: 'Inter',
      backgroundColor: '#ffffff'
    },
    blocks: [
      {
        id: 'hero',
        type: 'hero',
        title: '{{year}} {{make}} {{model}}',
        subtitle: 'Premium RV Collection',
        backgroundImage: '{{primaryPhoto}}',
        showPrice: true
      },
      {
        id: 'specs',
        type: 'specs',
        title: 'Specifications',
        fields: ['year', 'make', 'model', 'sleeps', 'length', 'slides']
      },
      {
        id: 'features',
        type: 'features',
        title: 'Features & Amenities',
        showGrid: true
      },
      {
        id: 'gallery',
        type: 'gallery',
        title: 'Photo Gallery',
        layout: 'grid'
      },
      {
        id: 'cta',
        type: 'cta',
        title: 'Contact Us Today',
        buttonText: 'Get More Info',
        showContact: true
      }
    ],
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'template-mh-catalog',
    name: 'Manufactured Homes Catalog',
    description: 'Manufactured homes catalog template',
    type: 'manufactured_home',
    layout: 'classic',
    theme: {
      primaryColor: '#059669',
      secondaryColor: '#6b7280',
      fontFamily: 'Inter',
      backgroundColor: '#ffffff'
    },
    blocks: [
      {
        id: 'hero',
        type: 'hero',
        title: '{{year}} {{make}} {{model}}',
        subtitle: 'Quality Manufactured Homes',
        backgroundImage: '{{primaryPhoto}}',
        showPrice: true
      },
      {
        id: 'specs',
        type: 'specs',
        title: 'Home Details',
        fields: ['year', 'make', 'model', 'bedrooms', 'bathrooms', 'squareFootage']
      },
      {
        id: 'features',
        type: 'features',
        title: 'Home Features',
        showGrid: true
      },
      {
        id: 'gallery',
        type: 'gallery',
        title: 'Photo Gallery',
        layout: 'carousel'
      },
      {
        id: 'cta',
        type: 'cta',
        title: 'Schedule a Viewing',
        buttonText: 'Contact Us',
        showContact: true
      }
    ],
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export function useBrochureStore() {
  const [templates, setTemplates] = useState<BrochureTemplate[]>([])
  const [loading, setLoading] = useState(true)

  // Load templates from localStorage on mount
  useEffect(() => {
    try {
      const savedTemplates = loadFromLocalStorage<BrochureTemplate[]>(STORAGE_KEY, [])
      
      if (savedTemplates.length === 0) {
        // Initialize with default templates
        setTemplates(defaultTemplates)
        saveToLocalStorage(STORAGE_KEY, defaultTemplates)
      } else {
        setTemplates(savedTemplates)
      }
    } catch (error) {
      console.error('Error loading brochure templates:', error)
      setTemplates(defaultTemplates)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save templates to localStorage whenever they change
  useEffect(() => {
    if (!loading && templates.length > 0) {
      saveToLocalStorage(STORAGE_KEY, templates)
    }
  }, [templates, loading])

  const addTemplate = (template: Omit<BrochureTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: BrochureTemplate = {
      ...template,
      id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setTemplates(prev => [newTemplate, ...prev])
    return newTemplate
  }

  const updateTemplate = (id: string, updates: Partial<BrochureTemplate>) => {
    setTemplates(prev => prev.map(template => 
      template.id === id 
        ? { ...template, ...updates, updatedAt: new Date().toISOString() }
        : template
    ))
  }

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id))
  }

  const getTemplate = (id: string) => {
    return templates.find(template => template.id === id)
  }

  const getTemplatesByType = (type: 'rv' | 'manufactured_home' | 'all' = 'all') => {
    if (type === 'all') return templates
    return templates.filter(template => template.type === type)
  }

  return {
    templates,
    loading,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplate,
    getTemplatesByType
  }
}