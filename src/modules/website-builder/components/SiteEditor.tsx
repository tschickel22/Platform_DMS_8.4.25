import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  FileText, 
  Home, 
  Settings, 
  Eye, 
  Edit, 
  Trash2,
  MoreVertical
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Page {
  id: string
  name: string
  slug: string
  isHomePage: boolean
  isPublished: boolean
  lastModified: string
  template?: string
}
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)

interface PageListProps {
  const [isDirty, setIsDirty] = useState(false)
  pages: Page[]
  currentPageId?: string
  onSelectPage: (pageId: string) => void
  onCreatePage: () => void
  onEditPage: (pageId: string) => void
  onDeletePage: (pageId: string) => void
  onDuplicatePage: (pageId: string) => void
}
  // Auto-save with debounce
  useEffect(() => {
    if (!isDirty || !site) return

    const timeoutId = setTimeout(async () => {
      try {
        await websiteService.updateSite(site.id, site)
        setIsDirty(false)
        // Silent auto-save, no toast
      } catch (err) {
        console.warn('Auto-save failed:', err)
        // Don't show error toast for auto-save failures
      }
    }, 1500)

    return () => clearTimeout(timeoutId)
  }, [site, isDirty])
export default function PageList({
  pages,
  currentPageId,
  onSelectPage,
  onCreatePage,
  onEditPage,
  onDeletePage,
  onDuplicatePage
}: PageListProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPages = pages.filter(page =>
    page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
        createdAt: p.createdAt || new Date().toISOString(),
        updatedAt: p.updatedAt || new Date().toISOString(),
  )

  const getPageIcon = (page: Page) => {
    if (page.isHomePage) return <Home className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }
      setIsDirty(false)
import BlockInspector from './BlockInspector'
import { generateId } from '@/lib/utils'
  // Auto-select first page if none selected and pages exist
  React.useEffect(() => {
    if (!currentPageId && pages.length > 0) {
      onSelectPage(pages[0].id)
    }
  }, [currentPageId, pages, onSelectPage])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Pages</h3>
        <Button size="sm" onClick={onCreatePage}>
          <Plus className="h-4 w-4 mr-2" />
          Add Page
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search pages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
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
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                currentPageId === page.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onSelectPage(page.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="text-muted-foreground">
                      {getPageIcon(page)}
                    </div>
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
                        /{page.slug}
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
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
      setIsDirty(false)
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          onEditPage(page.id)
  const handleSiteUpdate = (updates: Partial<Site>) => {
    if (!site) return
    setSite({ ...site, ...updates })
    setIsDirty(true)
  }

  const handlePageUpdate = (pageId: string, updates: Partial<Page>) => {
    if (!site) return
    
    const updatedPages = site.pages.map(p => 
      p.id === pageId 
        ? { ...p, ...updates, updatedAt: new Date().toISOString() }
        : p
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
    
    const updatedPage = { ...currentPage, blocks: updatedBlocks }
    setCurrentPage(updatedPage)
    
    const updatedPages = site.pages.map(p => 
      p.id === currentPage.id ? updatedPage : p
    )
    
    setSite({ ...site, pages: updatedPages })
    setIsDirty(true)
  }

  const handleCreatePage = () => {
    if (!site) return
    
    const newPage: Page = {
      id: generateId(),
      title: 'New Page',
      path: `/page-${site.pages.length + 1}`,
      blocks: [],
      seo: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const updatedPages = [...site.pages, newPage]
    setSite({ ...site, pages: updatedPages })
    setCurrentPage(newPage)
                {isDirty && <span className="ml-2 text-amber-600">• Unsaved changes</span>}
    setIsDirty(true)
    setActiveTab('editor')
  }

  const handleDeletePage = (pageId: string) => {
    if (!site) return
    
    const updatedPages = site.pages.filter(p => p.id !== pageId)
    setSite({ ...site, pages: updatedPages })
    
    // If we deleted the current page, select the first remaining page
    if (currentPage?.id === pageId) {
      setCurrentPage(updatedPages[0] || null)
      setSelectedBlockId(null)
    }
    
    setIsDirty(true)
  }

  const handleAddBlock = (type: string) => {
    if (!currentPage) return
    
    const newBlock: Block = {
      id: generateId(),
      type,
      order: currentPage.blocks.length,
      props: getDefaultBlockProps(type)
    }
    
    const updatedBlocks = [...currentPage.blocks, newBlock]
    handlePageUpdate(currentPage.id, { blocks: updatedBlocks })
    setSelectedBlockId(newBlock.id)
  }

  const getDefaultBlockProps = (type: string) => {
    switch (type) {
      case 'hero':
        return {
            <TabsList className="grid w-full grid-cols-4 m-4">
          subtitle: 'Hero subtitle text',
          ctaText: 'Get Started',
          ctaLink: '#'
              <TabsTrigger value="media" className="text-xs">Media</TabsTrigger>
        }
      case 'heading':
        return {
          text: 'Heading Text',
                <div className="space-y-4">
                  {/* Block List */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Blocks</CardTitle>
                        <Button variant="outline" size="sm" onClick={() => handleAddBlock('paragraph')}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {currentPage ? (
                        <div className="space-y-2">
                          {currentPage.blocks.length === 0 ? (
                            <div className="text-xs text-muted-foreground text-center py-4">
                              No blocks yet. Add some content!
                            </div>
                          ) : (
                            currentPage.blocks
                              .sort((a, b) => (a.order || 0) - (b.order || 0))
                              .map((block) => (
                                <div
                                  key={block.id}
                                  className={`p-2 border rounded cursor-pointer transition-colors text-xs ${
                                    selectedBlockId === block.id
                                      ? 'border-blue-500 bg-blue-50'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                  onClick={() => setSelectedBlockId(block.id)}
                                >
                                  <div className="font-medium capitalize">{block.type}</div>
                                  <div className="text-muted-foreground truncate">
                                    {(() => {
                                      const bagKey = 'props' in block ? 'props' : ('data' in block ? 'data' : null)
                                      const bag = bagKey ? (block as any)[bagKey] : {}
                                      return bag.title || bag.text || bag.label || 'Block content'
                                    })()}
                                  </div>
                                </div>
                              ))
                          )}
                          
                          {/* Quick Add Buttons */}
                          <div className="pt-2 border-t">
                            <div className="text-xs text-muted-foreground mb-2">Quick Add:</div>
                            <div className="grid grid-cols-2 gap-1">
                              <Button variant="outline" size="sm" onClick={() => handleAddBlock('heading')} className="text-xs">
                                Heading
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleAddBlock('paragraph')} className="text-xs">
                                Text
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleAddBlock('image')} className="text-xs">
                                Image
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleAddBlock('button')} className="text-xs">
                                Button
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">Select a page to edit</div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Block Inspector */}
                  {selectedBlock && (
                    <BlockInspector
                      block={selectedBlock}
                      onChange={(updates) => handleBlockUpdate(selectedBlockId!, updates)}
                      onPickImage={(url) => {
                        const bagKey = 'props' in selectedBlock ? 'props' : ('data' in selectedBlock ? 'data' : null)
                        if (bagKey) {
                          const bag = (selectedBlock as any)[bagKey] || {}
                          const field = 'imageUrl' in bag ? 'imageUrl' : 'src' in bag ? 'src' : 'backgroundImage'
                          handleBlockUpdate(selectedBlockId!, { [bagKey]: { ...bag, [field]: url } })
                        }
                      }}
                    />
                  )}
                </div>
        return {
          src: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
          alt: 'Image',
          alignment: 'center'
        }
      case 'cta':
        return {
                  onCreatePage={handleCreatePage}
                  onEditPage={(pageId) => {
                    onSelectPageId(pageId)
                    setActiveTab('editor')
                  }}
                  onDeletePage={handleDeletePage}
          buttonLink: '#'
                  onPageUpdate={handlePageUpdate}
        }
      default:
        return {}
    }
  }
                        }}>
                  onThemeUpdate={(t) => handleSiteUpdate({ theme: t })}
                          Edit Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          onDuplicatePage(page.id)
                        }}>
                          <FileText className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        {!page.isHomePage && (
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeletePage(page.id)
                            }}
      seo: p.seo || {}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                page={currentPage} // backward compatibility
                </div>
                selectedBlockId={selectedBlockId}
                onSelectBlock={setSelectedBlockId}
                onBlockUpdate={handleBlockUpdate}
    setSelectedBlockId(null) // Clear block selection when switching pages
              </CardContent>
            </Card>
          ))
  const selectedBlock = selectedBlockId && currentPage 
    ? currentPage.blocks.find(b => b.id === selectedBlockId) 
    : null
        )}
      </div>

              onSiteUpdate={handleSiteUpdate}
      {pages.length > 0 && (
        <div className="text-xs text-muted-foreground pt-2 border-t">
          {pages.length} page{pages.length !== 1 ? 's' : ''} • {pages.filter(p => p.isPublished).length} published
        </div>
      )}
    </div>
  )
}