import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, Globe, Smartphone, Monitor, Plus } from 'lucide-react'
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
import { debounce } from '@/lib/utils'
import EditorCanvas from './EditorCanvas'
import PageList from './PageList'
import ThemePalette from './ThemePalette'
import MediaManager from './MediaManager'
import PublishPanel from './PublishPanel'
import BlockInspector from './BlockInspector'
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
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
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

  // Auto-save with debounce
  const debouncedAutoSave = useMemo(
    () => debounce(async (siteToSave: Site) => {
      if (!isDirty) return
      try {
        await websiteService.updateSite(siteToSave.id, siteToSave)
        setIsDirty(false)
        console.log('Auto-saved at', new Date().toLocaleTimeString())
      } catch (err) {
        console.warn('Auto-save failed:', err)
        // Don't show error toast for auto-save failures to avoid spam
      }
    }, 1500),
    [isDirty]
  )

  // Trigger auto-save when site changes
  useEffect(() => {
    if (site && isDirty) {
      debouncedAutoSave(site)
    }
  }, [site, isDirty, debouncedAutoSave])

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
        createdAt: p.createdAt || new Date().toISOString(),
        updatedAt: p.updatedAt || new Date().toISOString(),
        blocks: (p.blocks || []).map((b: any, i: number) => ({ id: b.id || `block-${i}`, ...b })),
      }))

      const normalized: Site = { ...s, pages }
      setSite(normalized)
      setCurrentPage(pages[0] || null) // ensure preview shows on load
      setIsDirty(false)
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
      setIsDirty(false)
      toast({ title: 'Changes Saved', description: 'Your website changes have been saved.' })
    } catch (error) {
      handleError(error, 'saving changes')
    } finally {
      setSaving(false)
    }
  }

  const handleSiteUpdate = (updates: Partial<Site>) => {
    if (!site) return
    setSite({ ...site, ...updates })
    setIsDirty(true)
  }

  const handlePageUpdate = (pageId: string, updates: Partial<Page>) => {
    if (!site) return
    const updatedPages = site.pages.map(p => 
      p.id === pageId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    )
    setSite({ ...site, pages: updatedPages })
    setIsDirty(true)
    
    // Update current page if it's the one being edited
    if (currentPage?.id === pageId) {
      setCurrentPage({ ...currentPage, ...updates, updatedAt: new Date().toISOString() })
    }
  }

  const handleBlockUpdate = (blockId: string, updates: Partial<Block>) => {
    if (!site || !currentPage) return
    
    const updatedBlocks = currentPage.blocks.map(b => 
      b.id === blockId ? { ...b, ...updates } : b
    )
    
    const updatedPage = { ...currentPage, blocks: updatedBlocks, updatedAt: new Date().toISOString() }
    setCurrentPage(updatedPage)
    
    const updatedPages = site.pages.map(p => 
      p.id === currentPage.id ? updatedPage : p
    )
    setSite({ ...site, pages: updatedPages })
    setIsDirty(true)
  }

  const handleSelectBlock = (blockId: string) => {
    setSelectedBlockId(blockId || null)
  }

  const handleAddBlock = (type: string) => {
    if (!site || !currentPage) return
    
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      order: currentPage.blocks.length,
      props: getDefaultBlockProps(type)
    }
    
    const updatedBlocks = [...currentPage.blocks, newBlock]
    const updatedPage = { ...currentPage, blocks: updatedBlocks, updatedAt: new Date().toISOString() }
    setCurrentPage(updatedPage)
    
    const updatedPages = site.pages.map(p => 
      p.id === currentPage.id ? updatedPage : p
    )
    setSite({ ...site, pages: updatedPages })
    setIsDirty(true)
    setSelectedBlockId(newBlock.id)
  }

  const getDefaultBlockProps = (type: string) => {
    switch (type) {
      case 'hero':
        return {
          title: 'Hero Title',
          subtitle: 'Hero subtitle text',
          ctaText: 'Get Started',
          ctaLink: '#'
        }
      case 'heading':
        return {
          text: 'New Heading',
          alignment: 'left'
        }
      case 'paragraph':
        return {
          text: 'New paragraph text. Click to edit this content.',
          alignment: 'left'
        }
      case 'button':
        return {
          label: 'Click Me',
          href: '#',
          variant: 'default',
          alignment: 'center'
        }
      case 'image':
        return {
          src: '',
          alt: 'Image description',
          alignment: 'center'
        }
      case 'cta':
        return {
          title: 'Call to Action',
          description: 'Compelling description text',
          buttonText: 'Take Action',
          buttonLink: '#'
        }
      case 'text':
        return {
          html: '<p>Rich text content. You can edit this in the inspector.</p>',
          alignment: 'left'
        }
      default:
        return {}
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
    setSelectedBlockId(null) // Clear block selection when switching pages
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

  // Get currently selected block
  const selectedBlock = selectedBlockId && currentPage 
    ? currentPage.blocks.find(b => b.id === selectedBlockId) 
    : null

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
                {isDirty && <span className="ml-2 text-orange-600">• Unsaved changes</span>}
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

            <Button onClick={handleSave} disabled={saving} variant={isDirty ? 'default' : 'outline'}>
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
          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 m-4">
              <TabsTrigger value="editor" className="text-xs" title="Editor"><Layout className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="pages" className="text-xs" title="Pages"><Globe className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="theme" className="text-xs" title="Theme"><Palette className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="media" className="text-xs" title="Media"><ImageIcon className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="media" className="text-xs">Media</TabsTrigger>
            </TabsList>

            <div className="px-4 pb-4 flex-1 overflow-y-auto">
              <TabsContent value="editor" className="mt-0">
                <div className="space-y-4">
                  {/* Current Page Info */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Current Page</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {currentPage ? (
                        <div className="space-y-2">
                          <div className="text-sm font-medium">{currentPage.title}</div>
                          <div className="text-xs text-muted-foreground">{currentPage.path}</div>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">No page selected</div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Block List */}
                  {currentPage && (
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">Blocks</CardTitle>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddBlock('heading')}
                              className="h-6 px-2 text-xs"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Text
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddBlock('image')}
                              className="h-6 px-2 text-xs"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Image
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {currentPage.blocks.length > 0 ? (
                          currentPage.blocks
                            .sort((a, b) => (a.order || 0) - (b.order || 0))
                            .map((block) => (
                              <div
                                key={block.id}
                                className={`p-2 border rounded cursor-pointer transition-colors ${
                                  selectedBlockId === block.id
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50'
                                }`}
                                onClick={() => setSelectedBlockId(block.id)}
                              >
                                <div className="text-xs font-medium">{block.type}</div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {getBlockPreviewText(block)}
                                </div>
                              </div>
                            ))
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            <div className="text-xs">No blocks yet</div>
                            <div className="text-xs">Add blocks to start building</div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Block Inspector */}
                  {selectedBlock && (
                    <BlockInspector
                      block={selectedBlock}
                      onChange={(updates) => handleBlockUpdate(selectedBlock.id, updates)}
                      onPickImage={(url) => {
                        const bagKey = 'props' in selectedBlock ? 'props' : ('data' in selectedBlock ? 'data' : 'props')
                        const bag = (selectedBlock as any)[bagKey] || {}
                        handleBlockUpdate(selectedBlock.id, {
                          [bagKey]: { ...bag, imageUrl: url }
                        })
                      }}
                    />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="pages" className="mt-0">
                <div className="space-y-4">
                  <PageList
                    pages={pagesForList}
                    currentPageId={currentPageId as any}
                    onSelectPage={onSelectPageId}
                    onCreatePage={() => {}}
                    onEditPage={() => {}}
                    onDeletePage={() => {}}
                    onDuplicatePage={() => {}}
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-xs">Page Title</Label>
                          <Input
                            value={currentPage.title || ''}
                            onChange={(e) => handlePageUpdate(currentPage.id, { title: e.target.value })}
                            placeholder="Page title"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs">URL Path</Label>
                          <Input
                            value={currentPage.path || ''}
                            onChange={(e) => {
                              let path = e.target.value
                              if (path && !path.startsWith('/')) path = '/' + path
                              handlePageUpdate(currentPage.id, { path })
                            }}
                            placeholder="/page-url"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs">SEO Description</Label>
                          <Textarea
                            value={currentPage.seo?.description || ''}
                            onChange={(e) => handlePageUpdate(currentPage.id, { 
                              seo: { ...currentPage.seo, description: e.target.value }
                            })}
                            placeholder="Page description for search engines"
                            rows={3}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs">SEO Title</Label>
                          <Input
                            value={currentPage.seo?.title || ''}
                            onChange={(e) => handlePageUpdate(currentPage.id, { 
                              seo: { ...currentPage.seo, title: e.target.value }
                            })}
                            placeholder="Custom title for search engines"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Page Settings</CardTitle>
                {/* Pass both prop styles so either PageList implementation works */}
                  }}
                />
              </TabsContent>
                  onThemeUpdate={(t) => handleSiteUpdate({ theme: t })}
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
              onSiteUpdate={handleSiteUpdate}
        )}
                selectedBlockId={selectedBlockId}
                onSelectBlock={handleSelectBlock}
                onBlockUpdate={handleBlockUpdate}
      </div>
    </div>
  )
}

// Helper function to get preview text for blocks
function getBlockPreviewText(block: Block): string {
  const bagKey = 'props' in block ? 'props' : ('data' in block ? 'data' : 'props')
  const bag = (block as any)[bagKey] || {}
  
  return bag.title || bag.text || bag.label || bag.ctaText || bag.buttonText || bag.subtitle || 'No content'
}
