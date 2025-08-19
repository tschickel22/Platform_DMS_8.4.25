import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
  Plus,
  Search as SearchIcon,
  FileText,
  Home,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

type PageSEO = {
  title?: string
  description?: string
}

export interface Page {
  id: string
  name: string
  slug: string
  isHomePage: boolean
  isPublished: boolean
  lastModified: string
  template?: string
  seo?: PageSEO
}

interface PageListProps {
  pages: Page[]
  currentPageId?: string
  onSelectPage: (pageId: string) => void
  onCreatePage: () => void
  onEditPage: (pageId: string) => void
  onDeletePage: (pageId: string) => void
  onDuplicatePage: (pageId: string) => void
  onPageUpdate?: (pageId: string, updates: Partial<Page> & { path?: string; seo?: PageSEO }) => void
}

export default function PageList({
  pages,
  currentPageId,
  onSelectPage,
  onCreatePage,
  onEditPage,
  onDeletePage,
  onDuplicatePage,
  onPageUpdate
}: PageListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [editingPageId, setEditingPageId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
  mode?: 'platform' | 'company'
    seoDescription: ''
  })

  // Resolve current & editing pages
  const currentPage = useMemo(
    () => pages.find((p) => p.id === currentPageId),
    [pages, currentPageId]
  )
  const editingPage = useMemo(
    () => pages.find((p) => p.id === editingPageId) || null,
    [pages, editingPageId]
  )

  // Auto-select first page if none selected and pages exist
  useEffect(() => {
    if (!currentPageId && pages.length > 0) {
      onSelectPage(pages[0].id)
    }
  }, [currentPageId, pages, onSelectPage])

  const filteredPages = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return pages
    return pages.filter(
      (page) =>
        page.name.toLowerCase().includes(q) ||
        page.slug.toLowerCase().includes(q)
    )
  }, [pages, searchTerm])

  const getPageIcon = (page: Page) =>
    page.isHomePage ? <Home className="h-4 w-4" /> : <FileText className="h-4 w-4" />

  const startEditing = (page: Page) => {
    setEditingPageId(page.id)
    setEditForm({
      title: page.name,
      path: page.slug.startsWith('/') ? page.slug : `/${page.slug}`,
      seoTitle: page.seo?.title ?? '',
      seoDescription: page.seo?.description ?? ''
    })
  }

  const saveEditing = () => {
    if (!editingPageId || !onPageUpdate) return

    // Normalize slug/path
    let path = editForm.path.trim()
    if (!path.startsWith('/')) path = `/${path}`
    path = path.replace(/[^a-zA-Z0-9\-_\/]/g, '-').replace(/--+/g, '-')

    onPageUpdate(editingPageId, {
      name: editForm.title,
      path,
      seo: {
        title: editForm.seoTitle,
        description: editForm.seoDescription
      }
    })
    setEditingPageId(null)
  }

  const cancelEditing = () => setEditingPageId(null)

  return (
    <div className="space-y-4">
      {/* Header: Add Page + Search */}
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={onCreatePage}>
          <Plus className="h-4 w-4 mr-2" />
          Add Page
        </Button>

        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Pages List */}
      <div className="space-y-2">
        {filteredPages.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                {searchTerm ? 'No pages match your search' : 'No pages yet'}
              </p>
              {!searchTerm && (
                <Button size="sm" variant="outline" onClick={onCreatePage} className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Page
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredPages.map((page) => (
            <Card
              key={page.id}
              className={cn(
                'cursor-pointer transition-colors hover:bg-muted/50',
                currentPageId === page.id ? 'ring-2 ring-primary' : ''
              )}
              onClick={() => onSelectPage(page.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="text-muted-foreground">{getPageIcon(page)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium truncate">{page.name}</h4>
                        {page.isHomePage && (
                          <Badge variant="secondary" className="text-xs">
                            Home
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {page.slug?.startsWith('/') ? page.slug : `/${page.slug}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Modified {new Date(page.lastModified).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={page.isPublished ? 'default' : 'secondary'} className="text-xs">
                      {page.isPublished ? 'Published' : 'Draft'}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            startEditing(page)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Quick Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            onEditPage(page.id)
                          }}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Edit Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            onDuplicatePage(page.id)
                          }}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        {!page.isHomePage && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeletePage(page.id)
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Quick Stats */}
      {pages.length > 0 && (
        <div className="text-xs text-muted-foreground pt-2 border-t">
          {pages.length} page{pages.length !== 1 ? 's' : ''} •{' '}
          {pages.filter((p) => p.isPublished).length} published
        </div>
      )}

      {/* Page SEO (inline) */}
      {currentPage && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Page SEO</CardTitle>
            <p className="text-xs text-muted-foreground">Editing: {currentPage.name}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="seo-title" className="text-xs">
                SEO Title
              </Label>
              <Input
                id="seo-title"
                value={currentPage.seo?.title || ''}
                onChange={(e) =>
                  onPageUpdate?.(currentPage.id, {
                    seo: { ...currentPage.seo, title: e.target.value }
                  })
                }
                placeholder="Page title for search engines"
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="seo-description" className="text-xs">
                SEO Description
              </Label>
              <Textarea
                id="seo-description"
                value={currentPage.seo?.description || ''}
                onChange={(e) =>
                  onPageUpdate?.(currentPage.id, {
                    seo: { ...currentPage.seo, description: e.target.value }
                  })
                }
                placeholder="Brief description for search results"
                className="text-xs min-h-[60px]"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inline Quick Edit panel */}
      {editingPage && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Edit Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="page-title" className="text-xs">
                Page Title
              </Label>
              <Input
                id="page-title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Page title"
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="page-slug" className="text-xs">
                Page URL
              </Label>
              <Input
                id="page-slug"
                value={editForm.path}
                onChange={(e) => setEditForm({ ...editForm, path: e.target.value })}
                placeholder="/page-url"
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="page-seo-title" className="text-xs">
                SEO Title
              </Label>
              <Input
                id="page-seo-title"
                value={editForm.seoTitle}
                onChange={(e) => setEditForm({ ...editForm, seoTitle: e.target.value })}
                placeholder="SEO title"
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="page-seo-description" className="text-xs">
                SEO Description
              </Label>
              <Textarea
                id="page-seo-description"
                value={editForm.seoDescription}
                onChange={(e) =>
                  setEditForm({ ...editForm, seoDescription: e.target.value })
                }
                placeholder="SEO description"
                className="text-xs min-h-[50px]"
              />
            </div>

            <div className="flex gap-2">
              <Button size="sm" onClick={saveEditing} className="flex-1">
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={cancelEditing}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
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
  const [isDirty, setIsDirty] = useState(false)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [activeTab, setActiveTab] = useState<'editor' | 'pages' | 'theme' | 'media'>('editor')
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)

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
        id: p.id || p.path || `page-${idx}`,
        title: p.title,
        path: p.path,
        seo: p.seo,
        blocks: (p.blocks || []).map((b: any, i: number) => ({ id: b.id || `block-${i}`, ...b })),
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
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

  // Auto-save with debouncing
  useEffect(() => {
    if (!isDirty || !site) return
    
    const timeoutId = setTimeout(async () => {
      try {
        await websiteService.updateSite(site.id, site)
        setIsDirty(false)
        toast({ 
          title: 'Auto-saved', 
          description: 'Your changes have been automatically saved.',
          variant: 'default'
        })
      } catch (err) {
        console.error('Auto-save failed:', err)
        // Don't show error toast for auto-save failures to avoid spam
      }
    }, 1500)

    return () => clearTimeout(timeoutId)
  }, [site, isDirty, toast])

  const handleSave = async () => {
    if (!site) return
    try {
      setSaving(true)
      await websiteService.updateSite(site.id, site)
      setIsDirty(false)
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

  const handleBlockUpdate = (blockId: string, updates: Partial<Block>) => {
    if (!site || !currentPage) return
    
    const updatedBlocks = currentPage.blocks.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    )
    
    const updatedPages = site.pages.map(page =>
      page.id === currentPage.id ? { ...page, blocks: updatedBlocks } : page
    )
    
    const updatedSite = { ...site, pages: updatedPages }
    setSite(updatedSite)
    setCurrentPage({ ...currentPage, blocks: updatedBlocks })
    setIsDirty(true)
  }

  const handleSelectBlock = (blockId: string) => {
    setSelectedBlockId(blockId)
  }

  const handleCreateBlock = (type: string) => {
    if (!site || !currentPage) return
    
    const newBlock: Block = {
      id: generateId(),
      type,
      order: currentPage.blocks.length,
      props: getDefaultBlockProps(type)
    }
    
    const updatedBlocks = [...currentPage.blocks, newBlock]
    const updatedPages = site.pages.map(page =>
      page.id === currentPage.id ? { ...page, blocks: updatedBlocks } : page
    )
    
    const updatedSite = { ...site, pages: updatedPages }
    setSite(updatedSite)
    setCurrentPage({ ...currentPage, blocks: updatedBlocks })
    setSelectedBlockId(newBlock.id)
    setIsDirty(true)
  }

  const getDefaultBlockProps = (type: string) => {
    switch (type) {
      case 'hero':
        return {
          title: 'Welcome to Our Website',
          subtitle: 'Discover amazing products and services',
          ctaText: 'Get Started',
          ctaLink: '#'
        }
      case 'text':
        return {
          html: '<h2>Heading</h2><p>Your content goes here.</p>',
          alignment: 'left'
        }
      case 'image':
        return {
          src: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
          alt: 'Image',
          alignment: 'center'
        }
      case 'cta':
        return {
          title: 'Ready to Get Started?',
          description: 'Contact us today to learn more',
          buttonText: 'Contact Us',
          buttonLink: '#'
        }
      default:
        return {}
    }
  }

  // Adapt data to PageList's expected props
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
      seo: p.seo
    }))
  }, [site?.pages])

  const currentPageIdForList =
    currentPage ? ((currentPage as any).id || currentPage.path || currentPage.title) : null

  const onSelectPageId = (id: string) => {
    const found =
      (site?.pages || []).find((p: any) => (p.id || p.path || p.title) === id) || null
    setCurrentPage(found)
    setActiveTab('editor')
    setSelectedBlockId(null) // Clear block selection when switching pages
  }

  const selectedBlock = useMemo(() => {
    if (!selectedBlockId || !currentPage) return null
    return currentPage.blocks.find(block => block.id === selectedBlockId) || null
  }, [selectedBlockId, currentPage])

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
              {saving ? 'Saving...' : isDirty ? 'Save*' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 border-r bg-card overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Pages Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <PageList
                  pages={pagesForList}
                  currentPageId={currentPageIdForList}
                  onSelectPage={onSelectPageId}
                  onCreatePage={() => {}}
                  onEditPage={() => {}}
                  onDeletePage={() => {}}
                  onDuplicatePage={() => {}}
                />
              </CardContent>
            </Card>

            {/* Blocks Section */}
            {currentPage && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Blocks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentPage.blocks.map((block) => (
                      <div
                        key={block.id}
                        className={`p-2 border rounded cursor-pointer transition-colors ${
                          selectedBlockId === block.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-accent'
                        }`}
                        onClick={() => setSelectedBlockId(block.id)}
                      >
                        <div className="text-sm font-medium capitalize">{block.type}</div>
                        <div className="text-xs text-muted-foreground">
                          {getBlockPreviewText(block)}
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleCreateBlock('text')}
                    >
                      Add Block
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
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
                page={currentPage} // backward compatibility
                previewMode={previewMode}
                selectedBlockId={selectedBlockId}
                onSelectBlock={handleSelectBlock}
                onBlockUpdate={handleBlockUpdate}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l bg-card overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Block Inspector */}
            {selectedBlock && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Edit Block</CardTitle>
                </CardHeader>
                <CardContent>
                  <BlockInspector
                    block={selectedBlock}
                    onChange={(updates) => handleBlockUpdate(selectedBlock.id, updates)}
                    onPickImage={(url) => {
                      const bagKey = 'props' in selectedBlock ? 'props' : 'data'
                      const bag = selectedBlock[bagKey] || {}
                      handleBlockUpdate(selectedBlock.id, { [bagKey]: { ...bag, imageUrl: url } })
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Publish Panel */}
            <PublishPanel
              site={site}
              onSiteUpdate={(updates) => {
                setSite({ ...site, ...updates })
                setIsDirty(true)
              }}
              mode={mode}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function getBlockPreviewText(block: Block): string {
  const bag = ('props' in block ? block.props : block.data) || {}
  return bag.title || bag.text || bag.html || bag.label || 'No content'
}