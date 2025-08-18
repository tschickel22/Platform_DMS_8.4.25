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

interface PageListProps {
  pages: Page[]
  currentPageId?: string
  onSelectPage: (pageId: string) => void
  onCreatePage: () => void
  onEditPage: (pageId: string) => void
  onDeletePage: (pageId: string) => void
  onDuplicatePage: (pageId: string) => void
  onPageUpdate?: (pageId: string, updates: any) => void
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
  const [editingPageId, setEditingPageId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    path: '',
    seoTitle: '',
    seoDescription: ''
  })

  const currentPage = pages.find(p => p.id === currentPageId)
  const editingPage = pages.find(p => p.id === editingPageId)

  const [isDirty, setIsDirty] = useState(false)
  const startEditing = (page: PageListItem) => {
    setEditingPageId(page.id)
    setEditForm({
      title: page.name,
      path: page.slug.startsWith('/') ? page.slug : `/${page.slug}`,
      seoTitle: page.seo?.title || '',
      seoDescription: page.seo?.description || ''
    })
  }

  const saveEditing = () => {
    if (!editingPageId || !onPageUpdate) return
    
    // Validate slug
    let path = editForm.path.trim()
    if (!path.startsWith('/')) {
      path = `/${path}`
    }
    
    // Remove spaces and special characters from slug
    path = path.replace(/[^a-zA-Z0-9\-_\/]/g, '-').replace(/--+/g, '-')
    
    onPageUpdate(editingPageId, {
      title: editForm.title,
      path: path,
      seo: {
        title: editForm.seoTitle,
        description: editForm.seoDescription
      }
    })
    
    setEditingPageId(null)
  }

  const cancelEditing = () => {
    setEditingPageId(null)
  }

  const [searchTerm, setSearchTerm] = useState('')

  const filteredPages = pages.filter(page =>
    page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPageIcon = (page: Page) => {
    if (page.isHomePage) return <Home className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }
  // Auto-select first page if none selected and pages exist
  React.useEffect(() => {
    if (!currentPageId && pages.length > 0) {
      onSelectPage(pages[0].id)
    }
  }, [currentPageId, pages, onSelectPage])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Pages</CardTitle>
            <Button variant="outline" size="sm" onClick={onCreatePage}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {pages.map((page) => (
              <div
                key={page.id}
                className={cn(
                  "p-3 border rounded-lg cursor-pointer transition-colors",
                  currentPageId === page.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
                onClick={() => onSelectPage(page.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {page.isHomePage && <Home className="h-3 w-3 text-blue-600" />}
                    <span className="text-sm font-medium">{page.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        startEditing(page)
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    {!page.isHomePage && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeletePage(page.id)
                        }}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {page.slug || '/'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Page SEO Editor */}
      {currentPage && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Page SEO</CardTitle>
            <p className="text-xs text-muted-foreground">
              Editing: {currentPage.name}
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="seo-title" className="text-xs">SEO Title</Label>
              <Input
                id="seo-title"
                value={currentPage.seo?.title || ''}
                onChange={(e) => {
                  if (onPageUpdate) {
                    onPageUpdate(currentPage.id, {
                      seo: { ...currentPage.seo, title: e.target.value }
                    })
                  }
                }}
                placeholder="Page title for search engines"
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="seo-description" className="text-xs">SEO Description</Label>
              <Textarea
                id="seo-description"
                value={currentPage.seo?.description || ''}
                onChange={(e) => {
                  if (onPageUpdate) {
                    onPageUpdate(currentPage.id, {
                      seo: { ...currentPage.seo, description: e.target.value }
                    })
                  }
                }}
                placeholder="Brief description for search results"
                className="text-xs min-h-[60px]"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Page Edit Modal */}
      {editingPage && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Edit Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="page-title" className="text-xs">Page Title</Label>
              <Input
                id="page-title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Page title"
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="page-slug" className="text-xs">Page URL</Label>
              <Input
                id="page-slug"
                value={editForm.path}
                onChange={(e) => setEditForm({ ...editForm, path: e.target.value })}
                placeholder="/page-url"
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="page-seo-title" className="text-xs">SEO Title</Label>
              <Input
                id="page-seo-title"
                value={editForm.seoTitle}
                onChange={(e) => setEditForm({ ...editForm, seoTitle: e.target.value })}
                placeholder="SEO title"
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="page-seo-description" className="text-xs">SEO Description</Label>
              <Textarea
                id="page-seo-description"
                value={editForm.seoDescription}
                onChange={(e) => setEditForm({ ...editForm, seoDescription: e.target.value })}
                placeholder="SEO description"
                className="text-xs min-h-[50px]"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={saveEditing} className="flex-1">
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={cancelEditing} className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
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
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          onEditPage(page.id)
                        }}>
                          <Edit className="h-4 w-4 mr-2" />
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
          {pages.length} page{pages.length !== 1 ? 's' : ''} • {pages.filter(p => p.isPublished).length} published
        </div>
      )}
    </div>
  )
}