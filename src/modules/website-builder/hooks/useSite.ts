import { useState, useEffect, useCallback } from 'react'
import { Site, Page, Block, Media, Version, DomainConfig, PublishResult, Manufacturer, DemoInventoryItem, DemoLandHomePackage } from '../types'
import { websiteService } from '@/services/website/service'
import { useToast } from '@/hooks/use-toast'

export function useSite(siteId?: string) {
  const [site, setSite] = useState<Site | null>(null)
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleError = useCallback((error: any, action: string) => {
    const message = error instanceof Error ? error.message : 'Unknown error'
    setError(message)
    toast({
      title: `Failed to ${action}`,
      description: message,
      variant: 'destructive'
    })
  }, [toast])

  const loadSites = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await websiteService.getSites()
      setSites(data)
    } catch (error) {
      handleError(error, 'load sites')
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const loadSite = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await websiteService.getSite(id)
      setSite(data)
    } catch (error) {
      handleError(error, 'load site')
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const createSite = useCallback(async (siteData: Omit<Site, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true)
    setError(null)
    try {
      const newSite = await websiteService.createSite(siteData)
      setSites(prev => [...prev, newSite])
      toast({
        title: 'Site created',
        description: `${newSite.name} has been created successfully`
      })
      return newSite
    } catch (error) {
      handleError(error, 'create site')
      return null
    } finally {
      setLoading(false)
    }
  }, [handleError, toast])

  const updateSite = useCallback(async (id: string, updates: Partial<Site>) => {
    setLoading(true)
    setError(null)
    try {
      const updatedSite = await websiteService.updateSite(id, updates)
      setSite(updatedSite)
      setSites(prev => prev.map(s => s.id === id ? updatedSite : s))
      return updatedSite
    } catch (error) {
      handleError(error, 'update site')
      return null
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const deleteSite = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await websiteService.deleteSite(id)
      setSites(prev => prev.filter(s => s.id !== id))
      if (site?.id === id) {
        setSite(null)
      }
      toast({
        title: 'Site deleted',
        description: 'The site has been deleted successfully'
      })
    } catch (error) {
      handleError(error, 'delete site')
    } finally {
      setLoading(false)
    }
  }, [handleError, toast, site])

  const publishSite = useCallback(async (id: string): Promise<PublishResult | null> => {
    setLoading(true)
    setError(null)
    try {
      const result = await websiteService.publishSite(id)
      if (result.success) {
        toast({
          title: 'Site published',
          description: 'Your website is now live!'
        })
      } else {
        toast({
          title: 'Publish failed',
          description: result.error || 'Unknown error',
          variant: 'destructive'
        })
      }
      return result
    } catch (error) {
      handleError(error, 'publish site')
      return null
    } finally {
      setLoading(false)
    }
  }, [handleError, toast])

  const setDomain = useCallback(async (id: string, domain: DomainConfig) => {
    setLoading(true)
    setError(null)
    try {
      const result = await websiteService.setDomain(id, domain)
      if (result.success) {
        toast({
          title: 'Domain mapped',
          description: result.message
        })
      } else {
        toast({
          title: 'Domain mapping failed',
          description: result.message,
          variant: 'destructive'
        })
      }
      return result
    } catch (error) {
      handleError(error, 'map domain')
      return { success: false, message: 'Failed to map domain' }
    } finally {
      setLoading(false)
    }
  }, [handleError, toast])

  // Load initial data
  useEffect(() => {
    loadSites()
  }, [loadSites])

  useEffect(() => {
    if (siteId) {
      loadSite(siteId)
    }
  }, [siteId, loadSite])

  return {
    site,
    sites,
    loading,
    error,
    createSite,
    updateSite,
    deleteSite,
    publishSite,
    setDomain,
    refreshSites: loadSites,
    refreshSite: loadSite
  }
}

export function usePages(siteId: string) {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleError = useCallback((error: any, action: string) => {
    const message = error instanceof Error ? error.message : 'Unknown error'
    setError(message)
    toast({
      title: `Failed to ${action}`,
      description: message,
      variant: 'destructive'
    })
  }, [toast])

  const loadPages = useCallback(async () => {
    if (!siteId) return
    
    setLoading(true)
    setError(null)
    try {
      const data = await websiteService.getPages(siteId)
      setPages(data.sort((a, b) => a.order - b.order))
    } catch (error) {
      handleError(error, 'load pages')
    } finally {
      setLoading(false)
    }
  }, [siteId, handleError])

  const createPage = useCallback(async (pageData: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true)
    setError(null)
    try {
      const newPage = await websiteService.createPage(siteId, pageData)
      setPages(prev => [...prev, newPage].sort((a, b) => a.order - b.order))
      toast({
        title: 'Page created',
        description: `${newPage.title} has been created`
      })
      return newPage
    } catch (error) {
      handleError(error, 'create page')
      return null
    } finally {
      setLoading(false)
    }
  }, [siteId, handleError, toast])

  const updatePage = useCallback(async (pageId: string, updates: Partial<Page>) => {
    setLoading(true)
    setError(null)
    try {
      const updatedPage = await websiteService.updatePage(siteId, pageId, updates)
      setPages(prev => prev.map(p => p.id === pageId ? updatedPage : p))
      return updatedPage
    } catch (error) {
      handleError(error, 'update page')
      return null
    } finally {
      setLoading(false)
    }
  }, [siteId, handleError])

  const deletePage = useCallback(async (pageId: string) => {
    setLoading(true)
    setError(null)
    try {
      await websiteService.deletePage(siteId, pageId)
      setPages(prev => prev.filter(p => p.id !== pageId))
      toast({
        title: 'Page deleted',
        description: 'The page has been deleted'
      })
    } catch (error) {
      handleError(error, 'delete page')
    } finally {
      setLoading(false)
    }
  }, [siteId, handleError, toast])

  const reorderPages = useCallback(async (pageIds: string[]) => {
    setLoading(true)
    setError(null)
    try {
      await websiteService.reorderPages(siteId, pageIds)
      setPages(prev => {
        const reordered = pageIds.map((id, index) => {
          const page = prev.find(p => p.id === id)
          return page ? { ...page, order: index } : null
        }).filter(Boolean) as Page[]
        return reordered
      })
    } catch (error) {
      handleError(error, 'reorder pages')
    } finally {
      setLoading(false)
    }
  }, [siteId, handleError])

  useEffect(() => {
    loadPages()
  }, [loadPages])

  return {
    pages,
    loading,
    error,
    createPage,
    updatePage,
    deletePage,
    reorderPages,
    refreshPages: loadPages
  }
}

export function useMedia(siteId: string) {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleError = useCallback((error: any, action: string) => {
    const message = error instanceof Error ? error.message : 'Unknown error'
    setError(message)
    toast({
      title: `Failed to ${action}`,
      description: message,
      variant: 'destructive'
    })
  }, [toast])

  const loadMedia = useCallback(async () => {
    if (!siteId) return
    
    setLoading(true)
    setError(null)
    try {
      const data = await websiteService.getMedia(siteId)
      setMedia(data)
    } catch (error) {
      handleError(error, 'load media')
    } finally {
      setLoading(false)
    }
  }, [siteId, handleError])

  const uploadMedia = useCallback(async (file: File) => {
    setLoading(true)
    setError(null)
    try {
      const newMedia = await websiteService.uploadMedia(siteId, file)
      setMedia(prev => [...prev, newMedia])
      toast({
        title: 'Media uploaded',
        description: `${file.name} has been uploaded`
      })
      return newMedia
    } catch (error) {
      handleError(error, 'upload media')
      return null
    } finally {
      setLoading(false)
    }
  }, [siteId, handleError, toast])

  const deleteMedia = useCallback(async (mediaId: string) => {
    setLoading(true)
    setError(null)
    try {
      await websiteService.deleteMedia(siteId, mediaId)
      setMedia(prev => prev.filter(m => m.id !== mediaId))
      toast({
        title: 'Media deleted',
        description: 'The media file has been deleted'
      })
    } catch (error) {
      handleError(error, 'delete media')
    } finally {
      setLoading(false)
    }
  }, [siteId, handleError, toast])

  useEffect(() => {
    loadMedia()
  }, [loadMedia])

  return {
    media,
    loading,
    error,
    uploadMedia,
    deleteMedia,
    refreshMedia: loadMedia
  }
}

export function useExternalData() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([])
  const [inventory, setInventory] = useState<DemoInventoryItem[]>([])
  const [landHomePackages, setLandHomePackages] = useState<DemoLandHomePackage[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const loadDefaultManufacturers = useCallback(async () => {
    setLoading(true)
    try {
      const data = await websiteService.getDefaultManufacturers()
      setManufacturers(data)
    } catch (error) {
      console.warn('Failed to load manufacturers:', error)
      toast({
        title: 'Warning',
        description: 'Failed to load default manufacturers',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const loadDemoInventory = useCallback(async () => {
    setLoading(true)
    try {
      const data = await websiteService.getDemoInventory()
      setInventory(data)
    } catch (error) {
      console.warn('Failed to load demo inventory:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadDemoLandHomePackages = useCallback(async () => {
    setLoading(true)
    try {
      const data = await websiteService.getDemoLandHomePackages()
      setLandHomePackages(data)
    } catch (error) {
      console.warn('Failed to load demo packages:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    manufacturers,
    inventory,
    landHomePackages,
    loading,
    loadDefaultManufacturers,
    loadDemoInventory,
    loadDemoLandHomePackages
  }
}