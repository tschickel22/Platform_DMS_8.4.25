import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Save, Globe, Smartphone, Monitor, ChevronRight, ChevronLeft } from 'lucide-react'
import { websiteService } from '@/services/website/service'
import { Site, Page } from '../types'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useToast } from '@/hooks/use-toast'
import EditorCanvas from './EditorCanvas'
import PageList from './PageList'
import ThemePalette from './ThemePalette'
import MediaManager from './MediaManager'
import PublishPanel from './PublishPanel'
import { ComponentLibrary } from './ComponentLibrary'

interface SiteEditorProps {
  mode?: 'platform' | 'company'
}

export default function SiteEditor({ mode = 'platform' }: SiteEditorProps) {
  const { siteId } = useParams<{ siteId: string }>()
  const navigate = useNavigate()
  const { handleError } = useErrorHandler()
  const { toast } = useToast()

  const [site, setSite] = useState<Site | null>(null)
  const [currentPage, setCurrentPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [activeTab, setActiveTab] = useState<'theme' | 'media' | 'components'>('theme')
  const [rightSidebarVisible, setRightSidebarVisible] = useState(true)

  // --- helpers ----------------------------------------------------------------
  const writePreview = (s: Site) => {
    try {
      const key = `wb2:preview-site:${s.slug}`
      const json = JSON.stringify(s)
      try { localStorage.setItem(key, json) } catch {}
      try { sessionStorage.setItem(key, json) } catch {}
    } catch {}
  }

  const slugify = (s: string) =>
    s.toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  // Listen for preview requests (one listener only)
  useEffect(() => {
    const onMessage = (evt: MessageEvent) => {
      const data = evt.data as any
      if (data?.type !== 'wb2:site-preview:request' || !site) return
      if (data.slug && data.slug !== site.slug) return
      const payload = { type: 'wb2:site-preview:response', slug: site.slug, site }
      try { (evt.source as WindowProxy | null)?.postMessage(payload, '*') } catch { window.postMessage(payload, '*') }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [site])
  // ---------------------------------------------------------------------------

  useEffect(() => { loadSite() /* eslint-disable-next-line */ }, [siteId])

  const loadSite = async () => {
    if (!siteId) return
    try {
      setLoading(true)
      const s = await websiteService.getSite(siteId)
      if (!s) throw new Error('Site not found')

      // normalize pages/blocks to ensure IDs exist
      const pages: Page[] = (s.pages || []).map((p: any, idx: number) => ({
        id: p.id || `page-${idx}`,
        title: p.title,
        path: p.path,
        order: p.order ?? idx,
        seo: p.seo,
        createdAt: p.createdAt || new Date().toISOString(),
        updatedAt: p.updatedAt || new Date().toISOString(),
        blocks: (p.blocks || []).map((b: any, i: number) => ({ id: b.id || `block-${i}`, ...b }))
      }))

      const normalized: Site = { ...s, pages }
      setSite(normalized)
      setCurrentPage(pages[0] || null)
      writePreview(normalized)
    } catch (err) {
      handleError(err, 'loading site')
      const basePath = mode === 'platform' ? '/platform/website-builder' : '/company/settings/website'
      navigate(basePath)
    } finally {
      setLoading(false)
    }
  }

  const handleSiteUpdate = (updatedSite: Site) => {
    setSite(updatedSite)
    if (currentPage) {
      const updatedPage = updatedSite.pages.find(p => p.id === currentPage.id)
      if (updatedPage) setCurrentPage(updatedPage)
    }
    writePreview(updatedSite)
  }

  const handleUpdatePage = (updatedPage: Page) => {
    if (!site) return
    const updatedPages = site.pages.map(p => (p.id === updatedPage.id ? updatedPage : p))
    const updatedSite = { ...site, pages: updatedPages }
    setSite(updatedSite)
    setCurrentPage(updatedPage)
    writePreview(updatedSite)
  }

  const persistNow = async (s: Site) => {
    try {
      setSaving(true)
      await websiteService.updateSite(s.id, s)
      toast({ title: 'Saved', description: 'Your changes have been saved.' })
    } catch (err) {
      handleError(err, 'saving site')
    } finally {
      setSaving(false)
    }
  }

  // Update preview data whenever site changes
  useEffect(() => {
    if (site) {
      const previewKey = `wb2:preview:${site.slug}`
      sessionStorage.setItem(previewKey, JSON.stringify(site))
    }
  }, [site])

  const handleUpdateSite = (updatedSite: Site) => {
    setSite(updatedSite)
  }

  const handleSave = async () => {
    if (!site) return
    await persistNow(site)
  }

  const handlePreview = () => {
    if (!site) return
    try {
      writePreview(site)
      const encoded = btoa(encodeURIComponent(JSON.stringify({ ...site, lastPreviewUpdate: new Date().toISOString() })))
      window.open(`/s/${site.slug}/?data=${encoded}`, '_blank')
      toast({ title: 'Preview Opened', description: 'Your site preview has opened in a new tab.' })
    } catch (error) {
      handleError(error, 'opening preview')
    }
  }

  const handleBackToBuilder = () => {
    const basePath = mode === 'platform' ? '/platform/website-builder' : '/company/settings/website'
    navigate(basePath)
  }

  // Add component from the library to the current page
  const handleAddComponent = (blockData: any, meta?: { templateId: string; name: string; category: string }) => {
    if (!site || !currentPage) {
      toast({ title: 'Error', description: 'Please select a page first', variant: 'destructive' })
      return
    }

    try {
      const newBlock = {
        id: `block-${Date.now()}`,
        type: blockData?.type,
        order: currentPage.blocks?.length || 0,
        content: blockData?.content ?? blockData?.defaultContent ?? {}
      }

      const updatedPage: Page = { ...currentPage, blocks: [...(currentPage.blocks || []), newBlock] }
      const updatedPages = site.pages.map(p => (p.id === currentPage.id ? updatedPage : p))
      const updatedSite = { ...site, pages: updatedPages }

      setSite(updatedSite)
      setCurrentPage(updatedPage)
      writePreview(updatedSite)

      toast({
        title: 'Component Added',
        description: `${meta?.name ?? blockData?.type ?? 'Component'} has been added to your page`
      })
    } catch (error) {
      handleError(error, 'adding component')
    }
  }

  // -------- PageList bindings (create/edit/delete/duplicate) ------------------
  const handleCreatePageFromList = async (data: { name: string; slug: string; template?: string }) => {
    if (!site) return
    const now = Date.now()
    const newPage: Page = {
      id: `page-${now}`,
      title: data.name.trim(),
      path: `/${slugify(data.slug || data.name)}`,
      order: (site.pages?.length ?? 0),
      seo: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      blocks: []
    }
    const updated: Site = { ...site, pages: [...(site.pages || []), newPage] }
    setSite(updated)
    setCurrentPage(newPage)
    writePreview(updated)
    await persistNow(updated)
  }

  const handleEditPageFromList = async (pageId: string, updates: { name: string; slug: string }) => {
    if (!site) return
    const updatedPages = (site.pages || []).map(p =>
      p.id === pageId
        ? {
            ...p,
            title: updates.name.trim(),
            path: `/${slugify(updates.slug || updates.name)}`,
            updatedAt: new Date().toISOString()
          }
        : p
    )
    const updated = { ...site, pages: updatedPages }
    setSite(updated)
    if (currentPage?.id === pageId) {
      const newCurr = updatedPages.find(p => p.id === pageId) || null
      setCurrentPage(newCurr)
    }
    writePreview(updated)
    await persistNow(updated)
  }

  const handleDeletePageFromList = async (pageId: string) => {
    if (!site) return
    const remaining = (site.pages || []).filter(p => p.id !== pageId)
    const updated = { ...site, pages: remaining }
    setSite(updated)
    if (currentPage?.id === pageId) {
      setCurrentPage(remaining[0] || null)
    }
    writePreview(updated)
    await persistNow(updated)
  }

  const handleDuplicatePageFromList = async (pageId: string) => {
    if (!site) return
    const src = (site.pages || []).find(p => p.id === pageId)
    if (!src) return
    const now = Date.now()
    const baseSlug = (src.path || '/').replace(/^\//, '')
    const newPage: Page = {
      ...src,
      id: `page-${now}`,
      title: `${src.title} (Copy)`,
      path: `/${slugify(`${baseSlug}-copy-${now}`)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: (site.pages?.length ?? 0),
      blocks: (src.blocks || []).map((b, i) => ({ ...b, id: `${b.id || 'block'}-${now}-${i}` }))
    }
    const updated = { ...site, pages: [...(site.pages || []), newPage] }
    setSite(updated)
    setCurrentPage(newPage)
    writePreview(updated)
    await persistNow(updated)
    toast({ title: 'Page Cloned', description: `"${src.title}" has been duplicated.` })
  }
  // ---------------------------------------------------------------------------

  // Adapt data to PageList's expected props
  const pagesForList = useMemo(() => {
    const pgs = site?.pages || []
    return pgs.map((p) => ({
      id: p.id,
      name: p.title,
      slug: (p.path || '/').replace(/^\//, ''),
      isHomePage: (p.path || '/') === '/',
      isPublished: false,
      lastModified: new Date().toISOString(),
      template: undefined
    }))
  }, [site?.pages])

  const currentPageId = currentPage ? currentPage.id : null

  // Do NOT change tabs on selection
  const onSelectPageId = (id: string) => {
    const found = (site?.pages || []).find((p: any) => p.id === id) || null
    setCurrentPage(found)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading website editor...</p>
        </div>
      </div>
    )
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader><CardTitle>Site Not Found</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">The website you're looking for could not be found.</p>
            <Button onClick={handleBackToBuilder}><ArrowLeft className="h-4 w-4 mr-2" />Back to Website Builder</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleBackToBuilder}>
              <ArrowLeft className="h-4 w-4 mr-2" />Back
            </Button>
            <div>
              <input
                type="text"
                value={site.name}
                onChange={(e) => setSite({ ...site, name: e.target.value })}
                onBlur={() => site && persistNow(site)}
                className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1 -mx-1"
                placeholder="Enter site name"
              />
              <div className="text-sm text-muted-foreground">
                {site?.slug || 'loading'}.{mode === 'platform' ? 'platform' : 'renterinsight'}.com
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Keep ONLY this working Preview */}
            <Button variant="outline" size="sm" onClick={handlePreview} className="flex items-center gap-2">
              <Globe className="h-4 w-4" />Preview
            </Button>
            <Button variant={previewMode === 'desktop' ? 'default' : 'outline'} size="sm" onClick={() => setPreviewMode('desktop')}>
              <Monitor className="h-4 w-4" />
            </Button>
            <Button variant={previewMode === 'tablet' ? 'default' : 'outline'} size="sm" onClick={() => setPreviewMode('tablet')}>
              <Globe className="h-4 w-4" />
            </Button>
            <Button variant={previewMode === 'mobile' ? 'default' : 'outline'} size="sm" onClick={() => setPreviewMode('mobile')}>
              <Smartphone className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRightSidebarVisible(!rightSidebarVisible)}
              title={rightSidebarVisible ? 'Hide sidebar for larger preview' : 'Show sidebar'}
            >
              {rightSidebarVisible ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            <Button onClick={handleSave} disabled={saving}><Save className="h-4 w-4 mr-2" />{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 border-r bg-card overflow-y-auto">
          {/* Always-visible Page List */}
          <div className="p-4">
            <PageList
              pages={pagesForList}
              currentPageId={currentPageId as any}
              onSelectPage={onSelectPageId}
              onCreatePage={handleCreatePageFromList}
              site={site}
              onSiteUpdate={(updates) => site && setSite({ ...site, ...updates })}
              onDuplicatePage={handleDuplicatePageFromList}
            />
          </div>

          {/* Secondary tools (Theme / Library / Media) */}
          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="h-full">
            <TabsList className="grid w-full grid-cols-3 mx-4 mb-4">
              <TabsTrigger value="theme" className="text-xs">Theme</TabsTrigger>
              <TabsTrigger value="components" className="text-xs">Library</TabsTrigger>
              <TabsTrigger value="media" className="text-xs">Media</TabsTrigger>
            </TabsList>

            <div className="px-4 pb-4">
              <TabsContent value="theme" className="mt-0">
                <ThemePalette
                  theme={site?.theme}
                  onThemeUpdate={(t) => {
                    const updatedSite = { ...site, theme: t }
                    setSite(updatedSite)
                    writePreview(updatedSite)
                  }}
                />
              </TabsContent>

              <TabsContent value="components" className="mt-0">
                <ComponentLibrary onAddComponent={handleAddComponent} onClose={() => setActiveTab('theme')} />
              </TabsContent>

              <TabsContent value="media" className="mt-0">
                <MediaManager siteId={site?.id || ''} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Center Canvas */}
        <div className={`flex-1 bg-gray-50 overflow-hidden transition-all duration-300 ${rightSidebarVisible ? '' : 'mr-0'}`}>
          <div className="h-full flex items-center justify-center p-6">
            <div
              className={`bg-white shadow-lg transition-all duration-300 ${
                previewMode === 'mobile'
                  ? 'w-[375px] h-[667px]'
                  : previewMode === 'tablet'
                  ? 'w-[768px] h-[1024px]'
                  : rightSidebarVisible 
                    ? 'w-full max-w-6xl h-full'
                    : 'w-full max-w-7xl h-full'
              } rounded-lg overflow-hidden`}
            >
              <EditorCanvas
                site={site}
                currentPage={currentPage}
                previewMode={previewMode}
                onUpdateSite={(updatedSite) => setSite(updatedSite)}
                onUpdatePage={handleUpdatePage}
                onSiteUpdate={handleSiteUpdate}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className={`transition-all duration-300 border-l bg-card overflow-y-auto ${
          rightSidebarVisible ? 'w-80' : 'w-0 border-l-0'
        }`}>
          <div className="p-4">
            <Tabs defaultValue="publish" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="publish">Publish</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
              </TabsList>

              <TabsContent value="publish" className="mt-4">
                <PublishPanel site={site} onSiteUpdate={(updates) => setSite({ ...site, ...updates })} mode={mode} />
              </TabsContent>

              <TabsContent value="media" className="mt-4">
                <MediaManager siteId={site.id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
