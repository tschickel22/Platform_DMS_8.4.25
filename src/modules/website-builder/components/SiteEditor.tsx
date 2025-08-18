import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  Eye, 
  Save, 
  Settings, 
  Palette, 
  Layout, 
  Image,
  Globe,
  Smartphone,
  Monitor,
  Tablet
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
  const [activeTab, setActiveTab] = useState('editor')

  useEffect(() => {
    if (siteId) {
      loadSite()
    }
  }, [siteId])

  const loadSite = async () => {
    if (!siteId) return

    try {
      setLoading(true)
      const siteData = await websiteService.getSite(siteId)
      
      if (!siteData) {
        throw new Error('Site not found')
      }

      setSite(siteData)
      
      // Set the first page as current page
      if (siteData.pages && siteData.pages.length > 0) {
        setCurrentPage(siteData.pages[0])
      }
    } catch (error) {
      handleError(error, 'loading site')
      // Navigate back to website builder if site not found
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
      toast({
        title: 'Changes Saved',
        description: 'Your website changes have been saved successfully'
      })
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
    if (site) {
      const previewUrl = `/s/${site.slug}/`
      window.open(previewUrl, '_blank')
    }
  }

  const handlePageSelect = (page: Page) => {
    setCurrentPage(page)
    setActiveTab('editor')
  }

  const handleBlockUpdate = (blockId: string, updates: Partial<Block>) => {
    if (!site || !currentPage) return

    const updatedBlocks = currentPage.blocks.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    )

    const updatedPage = { ...currentPage, blocks: updatedBlocks }
    const updatedPages = site.pages.map(page =>
      page.id === currentPage.id ? updatedPage : page
    )

    setSite({ ...site, pages: updatedPages })
    setCurrentPage(updatedPage)
  }

  const handleThemeUpdate = (themeUpdates: any) => {
    if (!site) return
    setSite({ ...site, theme: { ...site.theme, ...themeUpdates } })
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
                {site.slug}.renterinsight.com
                {site.isPublished && (
                  <Badge variant="default" className="ml-2">Published</Badge>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Preview Mode Toggle */}
            <div className="flex items-center border rounded-md">
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-4 m-4">
              <TabsTrigger value="editor" className="text-xs">
                <Layout className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="pages" className="text-xs">
                <Globe className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="theme" className="text-xs">
                <Palette className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="media" className="text-xs">
                <Image className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>

            <div className="px-4 pb-4">
              <TabsContent value="editor" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Page Editor</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentPage ? (
                      <div>
                        <h3 className="font-medium mb-2">{currentPage.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {currentPage.blocks?.length || 0} blocks
                        </p>
                        <div className="space-y-2">
                          {currentPage.blocks?.map((block, index) => (
                            <div
                              key={block.id}
                              className="p-3 border rounded-md hover:bg-accent cursor-pointer"
                              onClick={() => {
                                // Focus on block in canvas
                                console.log('Focus block:', block.id)
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium capitalize">
                                  {block.type}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  #{index + 1}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Select a page to start editing
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pages" className="mt-0">
                <PageList
                  site={site}
                  currentPage={currentPage}
                  onPageSelect={handlePageSelect}
                  onPageUpdate={(pageId, updates) => {
                    const updatedPages = site.pages.map(page =>
                      page.id === pageId ? { ...page, ...updates } : page
                    )
                    setSite({ ...site, pages: updatedPages })
                  }}
                />
              </TabsContent>

              <TabsContent value="theme" className="mt-0">
                <ThemePalette
                  theme={site.theme}
                  onThemeUpdate={handleThemeUpdate}
                />
              </TabsContent>

              <TabsContent value="media" className="mt-0">
                <MediaManager siteId={site.id} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Main Canvas */}
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
                  page={currentPage}
                  previewMode={previewMode}
                  onBlockUpdate={handleBlockUpdate}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select a page to edit</h3>
                    <p className="text-muted-foreground">
                      Choose a page from the Pages tab to start editing
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Publish Panel */}
        <div className="w-80 border-l bg-card overflow-y-auto">
          <div className="p-4">
            <PublishPanel
              site={site}
              onSiteUpdate={(updates) => setSite({ ...site, ...updates })}
              mode={mode}
            />
          </div>
        </div>
      </div>
    </div>
  )
}