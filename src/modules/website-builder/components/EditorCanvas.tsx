import React, { useState, useCallback } from 'react'
import { Site, Page, Block } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Edit, Image, Type, Layout, Plus, Trash2 } from 'lucide-react'
import { websiteService } from '@/services/website/service'
import { useToast } from '@/hooks/use-toast'

interface EditorCanvasProps {
  site: Site
  currentPage: Page | null
  previewMode: 'desktop' | 'tablet' | 'mobile'
  onSiteUpdate?: (site: Site) => void
  onPageUpdate?: (page: Page) => void
}

interface EditingBlock {
  blockId: string
  type: 'text' | 'image' | 'hero' | 'cta'
  content: any
}

export default function EditorCanvas({ 
  site, 
  currentPage, 
  previewMode,
  onSiteUpdate,
  onPageUpdate 
}: EditorCanvasProps) {
  const [editingBlock, setEditingBlock] = useState<EditingBlock | null>(null)
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleBlockEdit = useCallback((block: Block) => {
    setEditingBlock({
      blockId: block.id,
      type: block.type as any,
      content: { ...block.content }
    })
  }, [])

  const handleBlockSave = useCallback(async (updatedContent: any) => {
    if (!editingBlock || !currentPage) return

    try {
      const updatedBlocks = currentPage.blocks.map(block =>
        block.id === editingBlock.blockId
          ? { ...block, content: updatedContent }
          : block
      )

      const updatedPage = { ...currentPage, blocks: updatedBlocks }
      
      // Update via service
      await websiteService.updatePage(site.id, currentPage.id, { blocks: updatedBlocks })
      
      // Update local state
      if (onPageUpdate) {
        onPageUpdate(updatedPage)
      }
      
      if (onSiteUpdate) {
        const updatedSite = {
          ...site,
          pages: site.pages.map(p => p.id === currentPage.id ? updatedPage : p)
        }
        onSiteUpdate(updatedSite)
      }

      setEditingBlock(null)
      toast({ title: 'Block updated', description: 'Your changes have been saved.' })
    } catch (error) {
      console.error('Failed to save block:', error)
      toast({ 
        title: 'Save failed', 
        description: 'Failed to save changes. Please try again.',
        variant: 'destructive'
      })
    }
  }, [editingBlock, currentPage, site, onPageUpdate, onSiteUpdate, toast])

  const handleAddBlock = useCallback(async (type: string, afterBlockId?: string) => {
    if (!currentPage) return

    try {
      const newBlock: Omit<Block, 'id'> = {
        type,
        content: getDefaultBlockContent(type),
        order: currentPage.blocks.length
      }

      const createdBlock = await websiteService.createBlock(site.id, currentPage.id, newBlock)
      
      const updatedPage = {
        ...currentPage,
        blocks: [...currentPage.blocks, createdBlock]
      }

      if (onPageUpdate) {
        onPageUpdate(updatedPage)
      }

      toast({ title: 'Block added', description: `New ${type} block added to page.` })
    } catch (error) {
      console.error('Failed to add block:', error)
      toast({ 
        title: 'Add failed', 
        description: 'Failed to add block. Please try again.',
        variant: 'destructive'
      })
    }
  }, [currentPage, site.id, onPageUpdate, toast])

  const handleDeleteBlock = useCallback(async (blockId: string) => {
    if (!currentPage) return

    try {
      await websiteService.deleteBlock(site.id, currentPage.id, blockId)
      
      const updatedPage = {
        ...currentPage,
        blocks: currentPage.blocks.filter(b => b.id !== blockId)
      }

      if (onPageUpdate) {
        onPageUpdate(updatedPage)
      }

      toast({ title: 'Block deleted', description: 'Block has been removed from the page.' })
    } catch (error) {
      console.error('Failed to delete block:', error)
      toast({ 
        title: 'Delete failed', 
        description: 'Failed to delete block. Please try again.',
        variant: 'destructive'
      })
    }
  }, [currentPage, site.id, onPageUpdate, toast])

  const renderBlock = (block: Block) => {
    const isHovered = hoveredBlockId === block.id
    const primaryColor = site.theme?.primaryColor || '#3b82f6'

    const blockContent = (() => {
      switch (block.type) {
        case 'hero':
          return (
            <section className="relative bg-gray-900 text-white min-h-[400px] flex items-center justify-center">
              {block.content.backgroundImage && (
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${block.content.backgroundImage})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                </div>
              )}
              <div className="relative text-center px-6">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  {block.content.title || 'Hero Title'}
                </h1>
                {block.content.subtitle && (
                  <p className="text-xl md:text-2xl mb-8 text-gray-200">
                    {block.content.subtitle}
                  </p>
                )}
                {block.content.ctaText && (
                  <button 
                    className="px-8 py-3 text-lg font-semibold rounded-lg"
                    style={{ backgroundColor: primaryColor, color: 'white' }}
                  >
                    {block.content.ctaText}
                  </button>
                )}
              </div>
            </section>
          )

        case 'text':
          return (
            <section className="py-16">
              <div className="max-w-4xl mx-auto px-6">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: block.content.html || block.content.text || '<p>Add your text content here...</p>' 
                  }}
                />
              </div>
            </section>
          )

        case 'image':
          return (
            <section className="py-16">
              <div className="max-w-7xl mx-auto px-6 text-center">
                {block.content.src ? (
                  <img 
                    src={block.content.src} 
                    alt={block.content.alt || ''} 
                    className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Image className="h-12 w-12 mx-auto mb-2" />
                      <p>Click to add image</p>
                    </div>
                  </div>
                )}
                {block.content.caption && (
                  <p className="mt-4 text-gray-600 text-sm">{block.content.caption}</p>
                )}
              </div>
            </section>
          )

        case 'cta':
          return (
            <section className="py-16" style={{ backgroundColor: `${primaryColor}10` }}>
              <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  {block.content.title || 'Call to Action Title'}
                </h2>
                {block.content.description && (
                  <p className="text-lg text-gray-600 mb-8">{block.content.description}</p>
                )}
                <button 
                  className="px-8 py-3 text-lg font-semibold rounded-lg"
                  style={{ backgroundColor: primaryColor, color: 'white' }}
                >
                  {block.content.buttonText || 'Get Started'}
                </button>
              </div>
            </section>
          )

        default:
          return (
            <div className="py-8 px-6 bg-yellow-50 border border-yellow-200 text-center">
              <p className="text-yellow-800">Unknown block type: {block.type}</p>
            </div>
          )
      }
    })()

    return (
      <div
        key={block.id}
        className={`relative group ${isHovered ? 'ring-2 ring-blue-500' : ''}`}
        onMouseEnter={() => setHoveredBlockId(block.id)}
        onMouseLeave={() => setHoveredBlockId(null)}
      >
        {blockContent}
        
        {/* Edit Overlay */}
        {isHovered && (
          <div className="absolute top-2 right-2 flex gap-2 bg-white shadow-lg rounded-md p-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleBlockEdit(block)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDeleteBlock(block.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    )
  }

  if (!currentPage) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a page to start editing</p>
        </div>
      </div>
    )
  }

  const sortedBlocks = [...currentPage.blocks].sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <div className="h-full overflow-y-auto">
      {/* Page Content */}
      <div className="min-h-full">
        {sortedBlocks.map(renderBlock)}
        
        {/* Add Block Button */}
        <div className="py-8 text-center border-t border-dashed border-gray-300">
          <AddBlockMenu onAddBlock={handleAddBlock} />
        </div>
      </div>

      {/* Block Editor Modal */}
      <BlockEditorModal
        editingBlock={editingBlock}
        onSave={handleBlockSave}
        onCancel={() => setEditingBlock(null)}
        siteId={site.id}
      />
    </div>
  )
}

// Add Block Menu Component
function AddBlockMenu({ onAddBlock }: { onAddBlock: (type: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)

  const blockTypes = [
    { type: 'hero', label: 'Hero Section', icon: Layout },
    { type: 'text', label: 'Text Content', icon: Type },
    { type: 'image', label: 'Image', icon: Image },
    { type: 'cta', label: 'Call to Action', icon: Plus }
  ]

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="border-dashed"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Block
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white shadow-lg rounded-lg border p-2 z-10">
          <div className="grid grid-cols-2 gap-2 min-w-[200px]">
            {blockTypes.map(({ type, label, icon: Icon }) => (
              <Button
                key={type}
                variant="ghost"
                size="sm"
                onClick={() => {
                  onAddBlock(type)
                  setIsOpen(false)
                }}
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Block Editor Modal Component
function BlockEditorModal({ 
  editingBlock, 
  onSave, 
  onCancel,
  siteId 
}: { 
  editingBlock: EditingBlock | null
  onSave: (content: any) => void
  onCancel: () => void
  siteId: string
}) {
  const [content, setContent] = useState<any>({})
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  React.useEffect(() => {
    if (editingBlock) {
      setContent({ ...editingBlock.content })
    }
  }, [editingBlock])

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true)
      const media = await websiteService.uploadMedia(siteId, file)
      setContent({ ...content, src: media.url })
      toast({ title: 'Image uploaded', description: 'Image has been uploaded successfully.' })
    } catch (error) {
      console.error('Upload failed:', error)
      toast({ 
        title: 'Upload failed', 
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  const renderEditor = () => {
    if (!editingBlock) return null

    switch (editingBlock.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={content.title || ''}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                placeholder="Enter hero title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <Input
                value={content.subtitle || ''}
                onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                placeholder="Enter hero subtitle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Button Text</label>
              <Input
                value={content.ctaText || ''}
                onChange={(e) => setContent({ ...content, ctaText: e.target.value })}
                placeholder="Enter button text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Button Link</label>
              <Input
                value={content.ctaLink || ''}
                onChange={(e) => setContent({ ...content, ctaLink: e.target.value })}
                placeholder="Enter button link"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Background Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file)
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={uploading}
              />
              {content.backgroundImage && (
                <img src={content.backgroundImage} alt="Background" className="mt-2 h-20 object-cover rounded" />
              )}
            </div>
          </div>
        )

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <Textarea
                value={content.text || content.html || ''}
                onChange={(e) => setContent({ ...content, text: e.target.value, html: e.target.value })}
                placeholder="Enter your text content"
                rows={8}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                You can use HTML tags for formatting
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Alignment</label>
              <select
                value={content.alignment || 'left'}
                onChange={(e) => setContent({ ...content, alignment: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        )

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file)
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={uploading}
              />
              {content.src && (
                <img src={content.src} alt="Preview" className="mt-2 max-h-40 object-cover rounded" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Alt Text</label>
              <Input
                value={content.alt || ''}
                onChange={(e) => setContent({ ...content, alt: e.target.value })}
                placeholder="Describe the image"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Caption</label>
              <Input
                value={content.caption || ''}
                onChange={(e) => setContent({ ...content, caption: e.target.value })}
                placeholder="Optional image caption"
              />
            </div>
          </div>
        )

      case 'cta':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={content.title || ''}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                placeholder="Enter CTA title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={content.description || ''}
                onChange={(e) => setContent({ ...content, description: e.target.value })}
                placeholder="Enter CTA description"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Button Text</label>
              <Input
                value={content.buttonText || ''}
                onChange={(e) => setContent({ ...content, buttonText: e.target.value })}
                placeholder="Enter button text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Button Link</label>
              <Input
                value={content.buttonLink || ''}
                onChange={(e) => setContent({ ...content, buttonLink: e.target.value })}
                placeholder="Enter button link"
              />
            </div>
          </div>
        )

      default:
        return <div>No editor available for this block type</div>
    }
  }

  return (
    <Dialog open={!!editingBlock} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Edit {editingBlock?.type} Block
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {renderEditor()}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave(content)} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Helper function to get default content for new blocks
function getDefaultBlockContent(type: string) {
  switch (type) {
    case 'hero':
      return {
        title: 'Welcome to Our Dealership',
        subtitle: 'Find your perfect RV or manufactured home',
        ctaText: 'Browse Inventory',
        ctaLink: '/inventory'
      }
    case 'text':
      return {
        text: '<h2>About Us</h2><p>Add your content here...</p>',
        html: '<h2>About Us</h2><p>Add your content here...</p>',
        alignment: 'left'
      }
    case 'image':
      return {
        src: '',
        alt: '',
        caption: ''
      }
    case 'cta':
      return {
        title: 'Ready to Get Started?',
        description: 'Contact us today to learn more about our services.',
        buttonText: 'Contact Us',
        buttonLink: '/contact'
      }
    default:
      return {}
  }
}