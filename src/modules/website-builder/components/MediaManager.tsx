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
}

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
  const handleMediaClick = (mediaItem: Media) => {
    if (mode === 'picker' && onImageSelect) {
      onImageSelect(mediaItem.url)
    }
  }
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
        {mode === 'manager' && (
          <div className="mb-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleUpload(e.target.files)}
              className="hidden"
              id="media-upload"
            />
            <label
              htmlFor="media-upload"
              className={`block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-gray-400 transition-colors ${
                uploading ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              {uploading ? (
                <div className="text-sm text-muted-foreground">Uploading...</div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Click to upload images or drag and drop
                </div>
              )}
            </label>
          </div>
        )}
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          onEditPage(page.id)
                        }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Settings
              className={`relative group border rounded-lg overflow-hidden ${
                mode === 'picker' ? 'cursor-pointer hover:border-blue-500' : ''
              }`}
              onClick={() => handleMediaClick(item)}
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
              {mode === 'manager' && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(item.id)
                    }}
                  >
                    Delete
                  </Button>
                </div>
              )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Quick Stats */}
      {pages.length > 0 && (
        <div className="text-xs text-muted-foreground pt-2 border-t">
            {mode === 'manager' && (
              <p className="text-xs">Upload some images to get started</p>
            )}
          {pages.length} page{pages.length !== 1 ? 's' : ''} • {pages.filter(p => p.isPublished).length} published
        </div>
      )}
    </div>
  )
}
        {mode === 'picker' && (
          <p className="text-xs text-muted-foreground">Click an image to select it</p>
        )}