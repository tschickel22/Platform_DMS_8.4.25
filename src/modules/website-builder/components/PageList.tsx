import React, { useState } from 'react'
import { Page } from '../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react'
import { usePages } from '../hooks/useSite'

interface PageListProps {
  siteId: string
  onPageSelect: (page: Page) => void
  selectedPageId?: string
}

interface PageFormData {
  title: string
  path: string
  isVisible: boolean
}

export function PageList({ siteId, onPageSelect, selectedPageId }: PageListProps) {
  const { pages, loading, createPage, updatePage, deletePage, reorderPages } = usePages(siteId)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const [formData, setFormData] = useState<PageFormData>({
    title: '',
    path: '',
    isVisible: true
  })

  const handleCreatePage = async () => {
    if (!formData.title.trim()) return

    const newPage = await createPage({
      title: formData.title,
      path: formData.path || `/${formData.title.toLowerCase().replace(/\s+/g, '-')}`,
      blocks: [],
      isVisible: formData.isVisible,
      order: pages.length
    })

    if (newPage) {
      setShowCreateDialog(false)
      setFormData({ title: '', path: '', isVisible: true })
      onPageSelect(newPage)
    }
  }

  const handleUpdatePage = async () => {
    if (!editingPage || !formData.title.trim()) return

    const updatedPage = await updatePage(editingPage.id, {
      title: formData.title,
      path: formData.path,
      isVisible: formData.isVisible
    })

    if (updatedPage) {
      setEditingPage(null)
      setFormData({ title: '', path: '', isVisible: true })
    }
  }

  const handleDeletePage = async (page: Page) => {
    if (confirm(`Are you sure you want to delete "${page.title}"?`)) {
      await deletePage(page.id)
    }
  }

  const openEditDialog = (page: Page) => {
    setEditingPage(page)
    setFormData({
      title: page.title,
      path: page.path,
      isVisible: page.isVisible
    })
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const items = Array.from(pages)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const pageIds = items.map(page => page.id)
    await reorderPages(pageIds)
  }

  if (loading && pages.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Pages</h3>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Page
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Page</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="About Us"
                />
              </div>
              <div>
                <Label htmlFor="path">Page Path</Label>
                <Input
                  id="path"
                  value={formData.path}
                  onChange={(e) => setFormData(prev => ({ ...prev, path: e.target.value }))}
                  placeholder="/about"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="visible"
                  checked={formData.isVisible}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVisible: checked }))}
                />
                <Label htmlFor="visible">Visible in navigation</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePage}>
                  Create Page
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {pages.map((page) => (
          <Card 
            key={page.id} 
            className={`cursor-pointer transition-colors ${
              selectedPageId === page.id ? 'ring-2 ring-primary' : 'hover:bg-accent/50'
            }`}
            onClick={() => onPageSelect(page)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{page.title}</h4>
                      {page.isVisible ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{page.path}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    {page.blocks.length} blocks
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      openEditDialog(page)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeletePage(page)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Page Dialog */}
      <Dialog open={!!editingPage} onOpenChange={(open) => !open && setEditingPage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Page Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-path">Page Path</Label>
              <Input
                id="edit-path"
                value={formData.path}
                onChange={(e) => setFormData(prev => ({ ...prev, path: e.target.value }))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-visible"
                checked={formData.isVisible}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVisible: checked }))}
              />
              <Label htmlFor="edit-visible">Visible in navigation</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingPage(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdatePage}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}