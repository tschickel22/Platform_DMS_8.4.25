import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Home, 
  FileText,
  MoreHorizontal,
  Globe
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface PageData {
  id: string
  name: string
  slug: string
  isHomePage: boolean
  isPublished: boolean
  lastModified: string
  template?: string
}

interface PageListProps {
  pages: PageData[]
  currentPageId: string | null
  onSelectPage: (pageId: string) => void
  onCreatePage: (pageData: { name: string; slug: string; template?: string }) => void
  onEditPage: (pageId: string, updates: { name?: string; slug?: string }) => void
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
  const [showNewPageForm, setShowNewPageForm] = useState(false)
  const [editingPageId, setEditingPageId] = useState<string | null>(null)
  const [newPageName, setNewPageName] = useState('')
  const [newPageSlug, setNewPageSlug] = useState('')
  const [editPageName, setEditPageName] = useState('')
  const [editPageSlug, setEditPageSlug] = useState('')

  const handleCreatePage = () => {
    if (!newPageName.trim()) return
    
    const slug = newPageSlug || newPageName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    
    onCreatePage({
      name: newPageName,
      slug,
      template: 'blank'
    })
    
    setNewPageName('')
    setNewPageSlug('')
    setShowNewPageForm(false)
  }

  const handleEditPage = (pageId: string) => {
    const page = pages.find(p => p.id === pageId)
    if (!page) return
    
    setEditingPageId(pageId)
    setEditPageName(page.name)
    setEditPageSlug(page.slug)
  }

  const handleSaveEdit = () => {
    if (!editingPageId || !editPageName.trim()) return
    
    const slug = editPageSlug || editPageName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    
    onEditPage(editingPageId, {
      name: editPageName,
      slug
    })
    
    setEditingPageId(null)
    setEditPageName('')
    setEditPageSlug('')
  }

  const handleDeletePage = (pageId: string) => {
    const page = pages.find(p => p.id === pageId)
    if (!page) return
    
    if (page.isHomePage) {
      alert('Cannot delete the home page')
      return
    }
    
    if (confirm(`Are you sure you want to delete "${page.name}"?`)) {
      onDeletePage(pageId)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Pages</CardTitle>
          <Button
            size="sm"
            onClick={() => setShowNewPageForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Page
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* New Page Form */}
          {showNewPageForm && (
            <Card className="border-dashed">
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <Input
                    placeholder="Page name"
                    value={newPageName}
                    onChange={(e) => {
                      setNewPageName(e.target.value)
                      if (!newPageSlug) {
                        setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
                      }
                    }}
                  />
                  <Input
                    placeholder="URL slug (optional)"
                    value={newPageSlug}
                    onChange={(e) => setNewPageSlug(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleCreatePage}>
                      Create
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowNewPageForm(false)
                        setNewPageName('')
                        setNewPageSlug('')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Page List */}
          {pages.map((page) => (
            <div
              key={page.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                currentPageId === page.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-accent'
              }`}
              onClick={() => onSelectPage(page.id)}
            >
              {editingPageId === page.id ? (
                <div className="space-y-2">
                  <Input
                    value={editPageName}
                    onChange={(e) => setEditPageName(e.target.value)}
                    placeholder="Page name"
                  />
                  <Input
                    value={editPageSlug}
                    onChange={(e) => setEditPageSlug(e.target.value)}
                    placeholder="URL slug"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveEdit}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingPageId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {page.isHomePage ? (
                      <Home className="h-4 w-4 text-primary" />
                    ) : (
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <div className="font-medium text-sm">{page.name}</div>
                      <div className="text-xs text-muted-foreground">/{page.slug}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {page.isPublished && (
                      <Badge variant="secondary" className="text-xs">
                        <Globe className="h-3 w-3 mr-1" />
                        Live
                      </Badge>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditPage(page.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDuplicatePage(page.id)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        {!page.isHomePage && (
                          <DropdownMenuItem 
                            onClick={() => handleDeletePage(page.id)}
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
              )}
            </div>
          ))}

          {pages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No pages yet</p>
              <p className="text-xs">Create your first page to get started</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}