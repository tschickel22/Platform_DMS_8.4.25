import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Eye,
  Save,
  Palette,
  Layout,
  Image as ImageIcon,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  PanelRightOpen,
  PanelRightClose,
} from 'lucide-react'
import { websiteService } from '@/services/website/service'
import { Site, Page, Block } from '../types'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useToast } from '@/hooks/use-toast'
import EditorCanvas from './EditorCanvas'
import PageList from './PageList'
import ThemePalette from './ThemePalette'
import MediaManager from './MediaManager'
import PublishPanel from './PublishPanel'
import { useTenant } from '@/contexts/TenantContext'

interface SiteEditorProps {
  mode?: 'platform' | 'company'
}

const LS_KEYS = {
  previewMode: 'wb.previewMode',
  rightOpen: 'wb.rightSidebarOpen',
  activeTab: 'wb.activeTab',
}

export default function SiteEditor({ mode = 'platform' }: SiteEditorProps) {
  const { siteId } = useParams<{ siteId: string }>()
  const navigate = useNavigate()
  const { handleError } = useErrorHandler()
  const { toast } = useToast()
  const tenant = useTenant()

  const [site, setSite] = useState<Site | null>(null)
  const [currentPage, setCurrentPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>(
    ((localStorage.getItem(LS_KEYS.previewMode) as 'desktop' | 'tablet' | 'mobile') ?? 'desktop')
  )
  const [activeTab, setActiveTab] = useState<'editor' | 'pages' | 'theme' | 'media'>(
    ((localStorage.getItem(LS_KEYS.activeTab) as 'editor' | 'pages' | 'theme' | 'media') ?? 'pages')
  )
  const [rightOpen, setRightOpen] = useState<boolean>(
    localStorage.getItem(LS_KEYS.rightOpen) !== 'false'
  )

  useEffect(() => {
    if (siteId) loadSite()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId])

  useEffect(() => { localStorage.setItem(LS_KEYS.previewMode, previewMode) }, [previewMode])
  useEffect(() => { localStorage.setItem(LS_KEYS.activeTab, activeTab) }, [activeTab])
  useEffect(() => { localStorage.setItem(LS_KEYS.rightOpen, String(rightOpen)) }, [rightOpen])

  const loadSite = async () => {
    if (!siteId) return
    try {
      setLoading(true)
      const s = await websiteService.getSite(siteId)
      if (!s) throw new Error('Site not found')

      // normalize IDs for pages/blocks (needed for selection + rendering)
      const pages: Page[] = (s.pages || []).map((p: any, idx: number) => ({
        id: p.id || p.path || `page-${idx}`,
        title: p.title,
        path: p.path,
        seo: p.seo,
        blocks: (p.blocks || []).map((b: any, i: number) => ({ id: b.id || `block-${i}`, ...b })),
      }))

      const normalized: Site = { ...s, pages }
      setSite(normalized)
      setCurrentPage(pages[0] || null) // ensure preview shows on load
    } catch (error) {
      handleError(error, 'loading site')
      const basePath = mode === 'platform' ? '/platform/website-builder' : '/company/settings/website'
      navigate(basePath)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!site) return
    try {
      setSaving(true)
      await websiteService.updateSite(site.id, site)
      toast({ title: 'Changes Saved', description: 'Your website changes have been saved.' })
    } catch (error) {
      handleError(error, 'saving changes')
    } finally {
      setSaving(false)
    }
  }

  const handleBackToBuilder = () => {
    const basePath = mode === 'platform' ? '/platform/website-builder' : '/company/settings/website'
    navigate(basePath)
  }

  const handlePreview = () => {
    if (!site) return
    const previewUrl = `/s/${site.slug}/`
    window.open(previewUrl, '_blank')
  }

  // Keep Pages list visible unless you choose to switch; PageList selection can switch to Editor.
  const handlePageSelect = (page: Page) => setCurrentPage(page)

  const handleBlockUpdate = (blockId: string, updates: Partial<Block>) => {
    if (!site || !currentPage) return
    const updatedBlocks = currentPage.blocks.map(b => (b.id === blockId ? { ...b, ...updates } : b))
    const updatedPage = { ...currentPage, blocks: updatedBlocks }
    const updatedPages = site.pages.map(p => (p.id === currentPage.id ? updatedPage : p))
    setSite({ ...site, pages: updatedPages })
    setCurrentPage(updatedPage)
  }

  // Safe theme to prevent ThemePalette crashes
  const safeTheme = useMemo(() => {
    const t = site?.theme || {}
    return {
      primaryColor: (t as any).primaryColor || '#1d4ed8',
      secondaryColor: (t as any).secondaryColor || '#f59e0b',
      fontFamily: (t as any).fontFamily || 'Inter',
      logoUrl: (t as any).logoUrl || (site as any)?.logoUrl || '',
    }
  }, [site])

  const handleThemeUpdate = (themeUpdates: any) => {
    if (!site) return
    setSite({ ...site, theme: { ...safeTheme, ...themeUpdates } as any })
  }

  const applyCompanyBranding = () => {
    if (!site) return
    const brand = (tenant?.company?.branding || tenant?.branding || {}) as any
    const updates = {
      primaryColor: brand.primaryColor || safeTheme.primaryColor,
      secondaryColor: brand.secondaryColor || safeTheme.secondaryColor,
      fontFamily: brand.fontFamily || safeTheme.fontFamily,
      logoUrl: brand.logoUrl || safeTheme.logoUrl,
    }
    setSite({ ...site, theme: { ...safeTheme, ...updates } as any })
    toast({ title: 'Branding Applied', description: 'Company branding has been applied to the site.' })
  }

  // ----- PageList compatibility (new + old prop APIs) -----
  const pagesForList = useMemo(() => {
    const pages = site?.pages || []
    return pages.map((p) => ({
      id: (p as any).id || p.path || p.title,
      name: p.title,
      slug: (p.path || '/').replace(/^\//, ''),
      isHomePage: (p.path || '/') === '/',
      isPublished: false,
      lastModified: new Date().toISOString(),
      template: undefined,
    }))
  }, [site?.pages])

  const currentPageId = currentPage ? ((currentPage as any).id || currentPage.path || currentPage.title) : null

  const onSelectPageId = (id: string) => {
    const found = (site?.pages || []).find((p: any) => (p.id || p.path || p.title) === id) || null
    if (found) {
      setCurrentPage(found)
      setActiveTab('editor') // feel free to remove if you want the list to remain focused
    }
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
            <Button onClick={handleBackToBuilder}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Website Builder
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBackToBuilder}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{site.name}</h1>
              <p className="text-sm text-muted-foreground">
                {site.slug}.{mode === 'platform' ? 'platform' : 'renterinsight'}.com
                {site.isPublished && <Badge variant="default" className="ml-2">Published</Badge>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Right sidebar toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRightOpen(v => !v)}
              title={rightOpen ? 'Hide Publish Panel' : 'Show Publish Panel'}
            >
              {rightOpen ? <PanelRightClose className="h-4 w-4 mr-2" /> : <PanelRightOpen className="h-4 w-4 mr-2" />}
              {rightOpen ? 'Hide Panel' : 'Show Panel'}
            </Button>

            {/* Preview Mode Toggle */}
            <div className="flex items-center border rounded-md ml-1">
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
                className="rounded-r-none"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('tablet')}
                className="rounded-none border-x"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
                className="rounded-l-none"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>

            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 border-r bg-card overflow-y-auto">
          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="h-full">
            <TabsList className="grid w-full grid-cols-4 m-4">
              <TabsTrigger value="editor" className="text-xs" title="Editor"><Layout className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="pages" className="text-xs" title="Pages"><Globe className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="theme" className="text-xs" title="Theme"><Palette className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="media" className="text-xs" title="Media"><ImageIcon className="h-4 w-4" /></TabsTrigger>
            </TabsList>

            <div className="px-4 pb-4">
              <TabsContent value="editor" className="mt-0">
                <Card>
                  <CardHeader><CardTitle className="text-sm">Page Editor</CardTitle></CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {currentPage ? `${currentPage.blocks?.length || 0} blocks` : 'Select a page to start editing'}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pages" className="mt-0">
                {/* Pass both prop styles so either PageList implementation works */}
                <PageList
                  pages={pagesForList}
                  currentPageId={currentPageId as any}
                  onSelectPage={onSelectPageId}
                  // legacy props:
                  site={site as any}
                  currentPage={currentPage as any}
                  onPageSelect={(p: any) => { setCurrentPage(p); setActiveTab('editor') }}
                  onPageUpdate={(pageId: string, updates: any) => {
                    const updatedPages = site.pages.map(p => (p.id === pageId ? { ...p, ...updates } : p))
                    setSite({ ...site, pages: updatedPages })
                  }}
                />
              </TabsContent>

              <TabsContent value="theme" className="mt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={applyCompanyBranding}>
                      Apply Company Branding
                    </Button>
                  </div>
                  {/* pass both a resolved theme and site for maximum compatibility */}
                  <ThemePalette theme={safeTheme} site={site} onThemeUpdate={handleThemeUpdate} />
                </div>
              </TabsContent>

              <TabsContent value="media" className="mt-0">
                <MediaManager siteId={site.id} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 bg-gray-50 overflow-hidden">
          <div className="h-full flex items-center justify-center p-6">
            <div
              className={`bg-white shadow-lg transition-all duration-300 ${
                previewMode === 'mobile'
                  ? 'w-[375px] h-[667px]'
                  : previewMode === 'tablet'
                  ? 'w-[768px] h-[1024px]'
                  : 'w-full max-w-6xl h-full'
              } rounded-lg overflow-hidden`}
            >
              {currentPage ? (
                <EditorCanvas
                  site={site}
                  currentPage={currentPage}   // <-- what EditorCanvas in your app expects
                  page={currentPage}          // <-- also provide legacy "page" just in case
                  previewMode={previewMode}
                  onBlockUpdate={handleBlockUpdate}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select a page to edit</h3>
                    <p className="text-muted-foreground">Choose a page from the Pages tab to start editing</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar (toggleable) */}
        {rightOpen && (
          <div className="w-80 border-l bg-card overflow-y-auto">
            <div className="p-4">
              <PublishPanel
                site={site}
                onSiteUpdate={(updates) => setSite({ ...site, ...updates })}
                mode={mode}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
