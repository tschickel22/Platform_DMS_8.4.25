import { useState, useEffect } from 'react'
import { BrochureTemplate } from '../types'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

interface BrochureStore {
  templates: BrochureTemplate[]
  loading: boolean
  error: string | null
}

export function useBrochureStore() {
  const [store, setStore] = useState<BrochureStore>({
    templates: [],
    {
      id: 'template-rv-showcase',
      name: 'RV Showcase',
      description: 'Premium RV collection brochure template',
      type: 'rv',
      theme: 'modern',
      layout: 'grid',
      content: {
        hero: {
          title: 'Premium RV Collection',
          subtitle: 'Discover your next adventure',
          backgroundImage: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1200'
        },
        specs: {
          title: 'Specifications',
          items: []
        },
        price: {
          title: 'Pricing',
          salePrice: null,
          rentPrice: null,
          showFinancing: true
        },
        gallery: {
          title: 'Gallery',
          images: []
        },
        features: {
          title: 'Features & Amenities',
          items: []
        },
        cta: {
          title: 'Ready to Experience This RV?',
          subtitle: 'Contact us today to schedule a viewing',
          buttonText: 'Contact Us',
          buttonUrl: '#contact'
        }
      },
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'template-mh-catalog',
      name: 'Manufactured Homes Catalog',
      description: 'Manufactured homes catalog template',
      type: 'manufactured_home',
      theme: 'classic',
      layout: 'list',
      content: {
        hero: {
          title: 'Quality Manufactured Homes',
          subtitle: 'Find your perfect home',
          backgroundImage: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1200'
        },
        specs: {
          title: 'Home Details',
          items: []
        },
        price: {
          title: 'Pricing Options',
          salePrice: null,
          rentPrice: null,
          showFinancing: true
        },
        gallery: {
          title: 'Photos',
          images: []
        },
        features: {
          title: 'Home Features',
          items: []
        },
        cta: {
          title: 'Schedule a Tour Today',
          subtitle: 'See this beautiful home in person',
          buttonText: 'Schedule Tour',
          buttonUrl: '#schedule'
        }
      },
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    }
    loading: true,
    error: null
  })

  useEffect(() => {
    // Load templates from localStorage
    const savedTemplates = loadFromLocalStorage<BrochureTemplate[]>('brochure-templates', [])
    setStore({
      templates: savedTemplates,
      loading: false,
      error: null
    })
  }, [])

  const saveTemplates = (templates: BrochureTemplate[]) => {
    saveToLocalStorage('brochure-templates', templates)
    setStore(prev => ({ ...prev, templates }))
  }

  const createTemplate = (template: Omit<BrochureTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: BrochureTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const updatedTemplates = [...store.templates, newTemplate]
    saveTemplates(updatedTemplates)
    return newTemplate
  }

  const updateTemplate = (id: string, updates: Partial<BrochureTemplate>) => {
    const updatedTemplates = store.templates.map(template =>
      template.id === id
        ? { ...template, ...updates, updatedAt: new Date().toISOString() }
        : template
    )
    saveTemplates(updatedTemplates)
  }

  const deleteTemplate = (id: string) => {
    const updatedTemplates = store.templates.filter(template => template.id !== id)
    saveTemplates(updatedTemplates)
  }

  return {
    ...store,
    createTemplate,
    updateTemplate,
    deleteTemplate
  }
}