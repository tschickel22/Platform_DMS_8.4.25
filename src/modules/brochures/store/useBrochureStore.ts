import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

export interface BrochureTemplate {
  id: string
  name: string
  description: string
  blocks: BrochureBlock[]
  theme: BrochureTheme
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface BrochureBlock {
  id: string
  type: 'hero' | 'gallery' | 'specs' | 'price' | 'features' | 'cta' | 'legal'
  content: Record<string, any>
  order: number
}

export interface BrochureTheme {
  id: string
  name: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  layout: 'modern' | 'classic' | 'minimal'
}

export interface BrochureInstance {
  id: string
  templateId: string
  listingId: string
  customizations: Record<string, any>
  publicId: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

interface BrochureStore {
  templates: BrochureTemplate[]
  instances: BrochureInstance[]
  themes: BrochureTheme[]
  
  // Template actions
  createTemplate: (template: Omit<BrochureTemplate, 'id' | 'createdAt' | 'updatedAt'>) => BrochureTemplate
  updateTemplate: (id: string, updates: Partial<BrochureTemplate>) => void
  deleteTemplate: (id: string) => void
  getTemplate: (id: string) => BrochureTemplate | undefined
  
  // Instance actions
  createInstance: (instance: Omit<BrochureInstance, 'id' | 'publicId' | 'createdAt' | 'updatedAt'>) => BrochureInstance
  updateInstance: (id: string, updates: Partial<BrochureInstance>) => void
  deleteInstance: (id: string) => void
  getInstance: (id: string) => BrochureInstance | undefined
  getInstanceByPublicId: (publicId: string) => BrochureInstance | undefined
  
  // Block actions
  addBlock: (templateId: string, block: Omit<BrochureBlock, 'id' | 'order'>) => void
  updateBlock: (templateId: string, blockId: string, updates: Partial<BrochureBlock>) => void
  deleteBlock: (templateId: string, blockId: string) => void
  reorderBlocks: (templateId: string, blockIds: string[]) => void
}

const STORAGE_KEY = 'renter-insight-brochures'

// Default themes
const defaultThemes: BrochureTheme[] = [
  {
    id: 'modern',
    name: 'Modern',
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    fontFamily: 'Inter',
    layout: 'modern'
  },
  {
    id: 'classic',
    name: 'Classic',
    primaryColor: '#1f2937',
    secondaryColor: '#6b7280',
    fontFamily: 'Georgia',
    layout: 'classic'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    primaryColor: '#000000',
    secondaryColor: '#9ca3af',
    fontFamily: 'Helvetica',
    layout: 'minimal'
  }
]

// Load initial state from localStorage
const loadState = (): Pick<BrochureStore, 'templates' | 'instances'> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.warn('Failed to load brochure state from localStorage:', error)
  }
  
  return {
    templates: [],
    instances: []
  }
}

// Save state to localStorage
const saveState = (state: Pick<BrochureStore, 'templates' | 'instances'>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.warn('Failed to save brochure state to localStorage:', error)
  }
}

export const useBrochureStore = create<BrochureStore>((set, get) => {
  const initialState = loadState()
  
  return {
    templates: initialState.templates,
    instances: initialState.instances,
    themes: defaultThemes,
    
    createTemplate: (templateData) => {
      const template: BrochureTemplate = {
        ...templateData,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      set((state) => {
        const newState = {
          ...state,
          templates: [template, ...state.templates]
        }
        saveState(newState)
        return newState
      })
      
      return template
    },
    
    updateTemplate: (id, updates) => {
      set((state) => {
        const newState = {
          ...state,
          templates: state.templates.map(template =>
            template.id === id
              ? { ...template, ...updates, updatedAt: new Date().toISOString() }
              : template
          )
        }
        saveState(newState)
        return newState
      })
    },
    
    deleteTemplate: (id) => {
      set((state) => {
        const newState = {
          ...state,
          templates: state.templates.filter(template => template.id !== id),
          instances: state.instances.filter(instance => instance.templateId !== id)
        }
        saveState(newState)
        return newState
      })
    },
    
    getTemplate: (id) => {
      return get().templates.find(template => template.id === id)
    },
    
    createInstance: (instanceData) => {
      const instance: BrochureInstance = {
        ...instanceData,
        id: uuidv4(),
        publicId: `brochure_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      set((state) => {
        const newState = {
          ...state,
          instances: [instance, ...state.instances]
        }
        saveState(newState)
        return newState
      })
      
      return instance
    },
    
    updateInstance: (id, updates) => {
      set((state) => {
        const newState = {
          ...state,
          instances: state.instances.map(instance =>
            instance.id === id
              ? { ...instance, ...updates, updatedAt: new Date().toISOString() }
              : instance
          )
        }
        saveState(newState)
        return newState
      })
    },
    
    deleteInstance: (id) => {
      set((state) => {
        const newState = {
          ...state,
          instances: state.instances.filter(instance => instance.id !== id)
        }
        saveState(newState)
        return newState
      })
    },
    
    getInstance: (id) => {
      return get().instances.find(instance => instance.id === id)
    },
    
    getInstanceByPublicId: (publicId) => {
      return get().instances.find(instance => instance.publicId === publicId)
    },
    
    addBlock: (templateId, blockData) => {
      set((state) => {
        const template = state.templates.find(t => t.id === templateId)
        if (!template) return state
        
        const newBlock: BrochureBlock = {
          ...blockData,
          id: uuidv4(),
          order: template.blocks.length
        }
        
        const newState = {
          ...state,
          templates: state.templates.map(t =>
            t.id === templateId
              ? { ...t, blocks: [...t.blocks, newBlock], updatedAt: new Date().toISOString() }
              : t
          )
        }
        saveState(newState)
        return newState
      })
    },
    
    updateBlock: (templateId, blockId, updates) => {
      set((state) => {
        const newState = {
          ...state,
          templates: state.templates.map(template =>
            template.id === templateId
              ? {
                  ...template,
                  blocks: template.blocks.map(block =>
                    block.id === blockId ? { ...block, ...updates } : block
                  ),
                  updatedAt: new Date().toISOString()
                }
              : template
          )
        }
        saveState(newState)
        return newState
      })
    },
    
    deleteBlock: (templateId, blockId) => {
      set((state) => {
        const newState = {
          ...state,
          templates: state.templates.map(template =>
            template.id === templateId
              ? {
                  ...template,
                  blocks: template.blocks.filter(block => block.id !== blockId),
                  updatedAt: new Date().toISOString()
                }
              : template
          )
        }
        saveState(newState)
        return newState
      })
    },
    
    reorderBlocks: (templateId, blockIds) => {
      set((state) => {
        const template = state.templates.find(t => t.id === templateId)
        if (!template) return state
        
        const reorderedBlocks = blockIds.map((id, index) => {
          const block = template.blocks.find(b => b.id === id)
          return block ? { ...block, order: index } : null
        }).filter(Boolean) as BrochureBlock[]
        
        const newState = {
          ...state,
          templates: state.templates.map(t =>
            t.id === templateId
              ? { ...t, blocks: reorderedBlocks, updatedAt: new Date().toISOString() }
              : t
          )
        }
        saveState(newState)
        return newState
      })
    }
  }
})