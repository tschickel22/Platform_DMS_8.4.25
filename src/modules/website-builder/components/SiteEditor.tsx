import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Save, Globe, Smartphone, Monitor } from 'lucide-react'
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
  const [activeTab, setActiveTab] = useState<'editor' | 'pages' | 'theme' | 'media' | 'components'>('editor')

  useEffect(() => {
    loadSite()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId])

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
        order: p.order || idx,
        seo: p.seo,
        createdAt: p.createdAt || new Date().toISOString(),
        updatedAt: p.updatedAt || new Date().toISOString(),
        blocks: (p.blocks || []).map((b: any, i: number) => ({ id: b.id || `block-${i}`, ...b }))
      }))

      const normalized: Site = { ...s, pages }
      setSite(normalized)
      setCurrentPage(pages[0] || null)
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
    // Update current page if it was modified
    if (currentPage) {
      const updatedPage = updatedSite.pages.find(p => p.id === currentPage.id)
      if (updatedPage) {
        setCurrentPage(updatedPage)
      }
    }
  }

  const handleSave = async () => {
    if (!site) return
    try {
      setSaving(true)
      await websiteService.updateSite(site.id, site)
      toast({ title: 'Saved', description: 'Your changes have been saved.' })
    } catch (err) {
      handleError(err, 'saving site')
    } finally {
      setSaving(false)
    }
  }

  const handleBackToBuilder = () => {
    const basePath = mode === 'platform' ? '/platform/website-builder' : '/company/settings/website'
    navigate(basePath)
  }

  // Add component from the library to the current page
  const handleAddComponent = (componentData: any) => {
    if (!site || !currentPage) {
      toast({
        title: 'No Page Selected',
        description: 'Please select a page first',
        variant: 'destructive'
      })
      return
    }

    const newBlock = {
      id: `block-${Date.now()}`,
      order: (currentPage.blocks?.length || 0),
      ...componentData
    }

    const updatedPage: Page = {
      ...currentPage,
      blocks: [...(currentPage.blocks || []), newBlock]
    }

    const updatedPages = site.pages.map(p => (p.id === currentPage.id ? updatedPage : p))
    setSite({ ...site, pages: updatedPages })
    setCurrentPage(updatedPage)
  }

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

  const onSelectPageId = (id: string) => {
    const found = (site?.pages || []).find((p: any) => p.id === id) || null
    setCurrentPage(found)
    setActiveTab('editor')
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
          <CardHeader>
            <CardTitle>Site Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The website you're looking for could not be found.
            </p>
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleBackToBuilder}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{site.name}</h1>
              <div className="text-sm text-muted-foreground">
                {site.slug}.{mode === 'platform' ? 'platform' : 'renterinsight'}.com
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === 'tablet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('tablet')}
            >
              <Globe className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
            >
              <Smartphone className="h-4 w-4" />
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
            <TabsList className="grid w-full grid-cols-5 m-4">
              <TabsTrigger value="editor" className="text-xs">Editor</TabsTrigger>
              <TabsTrigger value="pages" className="text-xs">Pages</TabsTrigger>
              <TabsTrigger value="theme" className="text-xs">Theme</TabsTrigger>
              <TabsTrigger value="components" className="text-xs">Library</TabsTrigger>
              <TabsTrigger value="media" className="text-xs">Media</TabsTrigger>
            </TabsList>

            <div className="px-4 pb-4">
              <TabsContent value="editor" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Page Editor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Page Editor</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {currentPage ? (
                            <div className="space-y-2">
                              <div className="text-sm font-medium">{currentPage.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {currentPage.blocks?.length || 0} blocks
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Click on any content block to edit it
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">Select a page to edit</div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pages" className="mt-0">
                <PageList
                  pages={pagesForList}
                  currentPageId={currentPageId as any}
                  onSelectPage={onSelectPageId}
                  onCreatePage={() => {}}
                  onEditPage={() => {}}
                  onDeletePage={() => {}}
                  onDuplicatePage={() => {}}
                />
              </TabsContent>

              <TabsContent value="theme" className="mt-0">
                <ThemePalette
                  theme={site.theme}
                  onThemeUpdate={(t) => {
                    const updatedSite = { ...site, theme: t }
                    setSite(updatedSite)
                  }}
                />
              </TabsContent>

              <TabsContent value="components" className="mt-0">
                <ComponentLibrary onAddComponent={handleAddComponent} />
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
              <EditorCanvas
                site={site}
                currentPage={currentPage}
                previewMode={previewMode}
                onSiteUpdate={handleSiteUpdate}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l bg-card overflow-y-auto">
          <div className="p-4">
            <Tabs defaultValue="publish" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="publish">Publish</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
              </TabsList>

              <TabsContent value="publish" className="mt-4">
                <PublishPanel
                  site={site}
                  onSiteUpdate={(updates) => setSite({ ...site, ...updates })}
                  mode={mode}
                />
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
