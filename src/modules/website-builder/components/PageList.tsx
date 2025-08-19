import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Copy, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageListItem {
  id: string
  name: string
  slug: string
  isHomePage: boolean
  isPublished: boolean
  lastModified: string
  template?: string
}

interface PageListProps {
  pages: PageListItem[]
  currentPageId: string | null
  onSelectPage: (pageId: string) => void
  onCreatePage: (pageData: { name: string; slug: string; template?: string }) => void
  onEditPage: (pageId: string, updates: { name: string; slug: string }) => void
  onDeletePage: (pageId: string) => void
  onDuplicatePage: (pageId: string) => void
}

interface NewPageForm {
  name: string
  slug: string
  template: string
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
  const [showNewPageModal, setShowNewPageModal] = useState(false)
  const [editingPage, setEditingPage] = useState<PageListItem | null>(null)
  const [newPageForm, setNewPageForm] = useState<NewPageForm>({
    name: '',
    slug: '',
    template: 'blank'
  })

  const pageTemplates = [
    { value: 'blank', label: 'Blank Page' },
    { value: 'about', label: 'About Us' },
    { value: 'contact', label: 'Contact' },
    { value: 'inventory', label: 'Inventory Showcase' },
    { value: 'services', label: 'Services' }
  ]

  const handleCreatePage = () => {
    if (!newPageForm.name.trim()) return

    const slug = newPageForm.slug || newPageForm.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    onCreatePage({
      name: newPageForm.name,
      slug,
      template: newPageForm.template
    })

    setNewPageForm({ name: '', slug: '', template: 'blank' })
    setShowNewPageModal(false)
  }

  const handleEditPage = () => {
    if (!editingPage) return

    onEditPage(editingPage.id, {
      name: editingPage.name,
      slug: editingPage.slug
    })

    setEditingPage(null)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Pages</CardTitle>
          <Button
            size="sm"
            onClick={() => setShowNewPageModal(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Page
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {pages.map((page) => (
          <div
            key={page.id}
            className={cn(
              'group flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors',
              currentPageId === page.id
                ? 'bg-primary/10 border-primary'
                : 'hover:bg-accent'
            )}
            onClick={() => onSelectPage(page.id)}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {page.isHomePage && (
                <Home className="h-4 w-4 text-primary flex-shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{page.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  /{page.slug}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  setEditingPage(page)
                }}
                className="h-7 w-7 p-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  onDuplicatePage(page.id)
                }}
                className="h-7 w-7 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
              {!page.isHomePage && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeletePage(page.id)
                  }}
                  className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}

        {pages.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">📄</div>
            <p>No pages yet</p>
            <p className="text-sm">Create your first page to get started</p>
          </div>
        )}
      </CardContent>

      {/* New Page Modal */}
      <Dialog open={showNewPageModal} onOpenChange={setShowNewPageModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Page Name</label>
              <Input
                value={newPageForm.name}
                onChange={(e) => {
                  const name = e.target.value
                  setNewPageForm({
                    ...newPageForm,
                    name,
                    slug: name.toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/^-+|-+$/g, '')
                  })
                }}
                placeholder="e.g., About Us"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">URL Slug</label>
              <Input
                value={newPageForm.slug}
                onChange={(e) => setNewPageForm({ ...newPageForm, slug: e.target.value })}
                placeholder="e.g., about-us"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This will be the page URL: /{newPageForm.slug}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Template</label>
              <select
                value={newPageForm.template}
                onChange={(e) => setNewPageForm({ ...newPageForm, template: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                {pageTemplates.map(template => (
                  <option key={template.value} value={template.value}>
                    {template.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowNewPageModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePage} disabled={!newPageForm.name.trim()}>
              Create Page
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Page Modal */}
      <Dialog open={!!editingPage} onOpenChange={() => setEditingPage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Page</DialogTitle>
          </DialogHeader>
          
          {editingPage && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Page Name</label>
                <Input
                  value={editingPage.name}
                  onChange={(e) => setEditingPage({ ...editingPage, name: e.target.value })}
                  placeholder="e.g., About Us"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">URL Slug</label>
                <Input
                  value={editingPage.slug}
                  onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                  placeholder="e.g., about-us"
                  disabled={editingPage.isHomePage}
                />
                {editingPage.isHomePage && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Home page URL cannot be changed
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setEditingPage(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditPage}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}