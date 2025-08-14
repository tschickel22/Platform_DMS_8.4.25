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