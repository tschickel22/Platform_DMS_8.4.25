import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Plus, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Edit, Trash2, Copy, GripVertical } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Layers } from 'lucide-react'
import { ComponentLibrary } from './ComponentLibrary'
import { Site, Page, Block } from '../types'
import { websiteService } from '@/services/website/service'
import { useToast } from '@/hooks/use-toast'
import RichTextEditor from './RichTextEditor'

interface EditorCanvasProps {
  site: Site
  currentPage: Page | null
  previewMode: 'desktop' | 'tablet' | 'mobile'
  onUpdatePage?: (updates: Partial<Page>) => void
  onSiteUpdate?: (site: Site) => void
}


interface BlockEditorModalProps {
  block: Block | null
  isOpen: boolean
  onClose: () => void
  onSave: (blockData: Partial<Block>) => void
}

function BlockEditorModal({ block, isOpen, onClose, onSave }: BlockEditorModalProps) {
  const [formData, setFormData] = useState<any>({})
  const [editingContent, setEditingContent] = useState<any>({})

  React.useEffect(() => {
    if (block) {
      setFormData(block.content || {})
      setEditingContent(block.content || {})
    }
  }, [block])

  const handleSave = () => {
    onSave({ content: formData })
    onClose()
  }

  if (!block) return null

  const renderEditor = () => {
    switch (block.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter hero title"
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle || ''}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Enter hero subtitle"
              />
            </div>
            <div>
              <Label htmlFor="ctaText">Button Text</Label>
              <Input
                id="ctaText"
                value={formData.ctaText || ''}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                placeholder="Enter button text"
              />
            </div>
            <div>
              <Label htmlFor="ctaLink">Button Link</Label>
              <Input
                id="ctaLink"
                value={formData.ctaLink || ''}
                onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                placeholder="Enter button link"
              />
            </div>
            <div>
              <Label htmlFor="backgroundImage">Background Image URL</Label>
              <Input
                id="backgroundImage"
                value={formData.backgroundImage || ''}
                onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
                placeholder="Enter image URL"
              />
            </div>
          </div>
        )

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content">Content</Label>
              <RichTextEditor
                content={editingContent.html || editingContent.text || ''}
                onChange={(html) => setEditingContent({
                  ...editingContent,
                  html,
                  text: html
                })}
                placeholder="Enter your text content..."
              />
            </div>
            <div>
              <Label htmlFor="alignment">Text Alignment</Label>
              <Select
                value={formData.alignment || 'left'}
                onValueChange={(value) => setFormData({ ...formData, alignment: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="src">Image URL</Label>
              <Input
                id="src"
                value={formData.src || ''}
                onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                placeholder="Enter image URL"
              />
            </div>
            <div>
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                value={formData.alt || ''}
                onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                placeholder="Enter alt text for accessibility"
              />
            </div>
            <div>
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                value={formData.caption || ''}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                placeholder="Enter image caption"
              />
            </div>
            <div>
              <Label htmlFor="alignment">Alignment</Label>
              <Select
                value={formData.alignment || 'center'}
                onValueChange={(value) => setFormData({ ...formData, alignment: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'cta':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter CTA title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter CTA description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={formData.buttonText || ''}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                placeholder="Enter button text"
              />
            </div>
            <div>
              <Label htmlFor="buttonLink">Button Link</Label>
              <Input
                id="buttonLink"
                value={formData.buttonLink || ''}
                onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                placeholder="Enter button link"
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={JSON.stringify(formData, null, 2)}
                onChange={(e) => {
                  try {
                    setFormData(JSON.parse(e.target.value))
                  } catch {
                    // Invalid JSON, ignore
                  }
                }}
                rows={10}
              />
            </div>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit {block.type} Block</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {renderEditor()}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface AddBlockMenuProps {
  isOpen: boolean
  onClose: () => void
  onAddBlock: (blockType: string) => void
}

function AddBlockMenu({ isOpen, onClose, onAddBlock }: AddBlockMenuProps) {
  const blockTypes = [
    { type: 'hero', name: 'Hero Section', description: 'Large banner with title and call-to-action' },
    { type: 'text', name: 'Text Block', description: 'Rich text content' },
    { type: 'image', name: 'Image', description: 'Single image with caption' },
    { type: 'gallery', name: 'Image Gallery', description: 'Multiple images in a grid' },
    { type: 'cta', name: 'Call to Action', description: 'Highlighted section with button' },
    { type: 'contact', name: 'Contact Form', description: 'Contact information and form' },
    { type: 'inventory', name: 'Inventory Showcase', description: 'Display featured inventory items' },
    { type: 'landHome', name: 'Land & Home Packages', description: 'Showcase land and home packages' }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Block</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 max-h-96 overflow-y-auto">
          {blockTypes.map((blockType) => (
            <button
              key={blockType.type}
              onClick={() => {
                onAddBlock(blockType.type)
                onClose()
              }}
              className="flex items-start gap-3 p-4 text-left border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{blockType.name}</h3>
                <p className="text-sm text-muted-foreground">{blockType.description}</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function EditorCanvas({ site, currentPage, previewMode, onUpdatePage, onSiteUpdate }: EditorCanvasProps) {
  const [editingBlock, setEditingBlock] = useState<Block | null>(null)
  const [showAddBlockMenu, setShowAddBlockMenu] = useState(false)
  const [showComponentLibrary, setShowComponentLibrary] = useState(false)
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null)
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null)
  const { toast } = useToast()

  // Safely get blocks from current page
  const blocks = currentPage?.blocks || []

  const handleEditBlock = (block: Block) => {
    setEditingBlock(block)
  }

  const handleSaveBlock = async (blockData: Partial<Block>) => {
    if (!editingBlock || !currentPage || !site) return

    try {
      const updatedBlock = { ...editingBlock, ...blockData }
      const updatedBlocks = blocks.map(b => b.id === editingBlock.id ? updatedBlock : b)
      const updatedPage = { ...currentPage, blocks: updatedBlocks }
      const updatedPages = site.pages.map(p => p.id === currentPage.id ? updatedPage : p)
      const updatedSite = { ...site, pages: updatedPages }

      await websiteService.updateSite(site.id, updatedSite)
      
      if (onSiteUpdate) {
        onSiteUpdate(updatedSite)
      }

      toast({
        title: 'Block Updated',
        description: 'Your changes have been saved successfully.'
      })
    } catch (error) {
      console.error('Error saving block:', error)
      toast({
        title: 'Error',
        description: 'Failed to save changes. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteBlock = async (blockId: string) => {
    if (!currentPage || !site) return

    try {
      const updatedBlocks = blocks.filter(b => b.id !== blockId)
      const updatedPage = { ...currentPage, blocks: updatedBlocks }
      const updatedPages = site.pages.map(p => p.id === currentPage.id ? updatedPage : p)
      const updatedSite = { ...site, pages: updatedPages }

      await websiteService.updateSite(site.id, updatedSite)
      
      if (onSiteUpdate) {
        onSiteUpdate(updatedSite)
      }

      toast({
        title: 'Block Deleted',
        description: 'The block has been removed from the page.'
      })
    } catch (error) {
      console.error('Error deleting block:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete block. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleAddBlock = async (blockType: string) => {
    if (!currentPage || !site) return

    try {
      const newBlock: Block = {
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: blockType,
        order: blocks.length,
        content: getDefaultBlockContent(blockType)
      }

      const updatedBlocks = [...blocks, newBlock]
      const updatedPage = { ...currentPage, blocks: updatedBlocks }
      const updatedPages = site.pages.map(p => p.id === currentPage.id ? updatedPage : p)
      const updatedSite = { ...site, pages: updatedPages }

      await websiteService.updateSite(site.id, updatedSite)
      
      if (onSiteUpdate) {
        onSiteUpdate(updatedSite)
      }

      toast({
        title: 'Block Added',
        description: `New ${blockType} block has been added to the page.`
      })
    } catch (error) {
      console.error('Error adding block:', error)
      toast({
        title: 'Error',
        description: 'Failed to add block. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleDuplicateBlock = async (block: Block) => {
    if (!currentPage || !site) return

    try {
      const newBlock: Block = {
        ...block,
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        order: blocks.length
      }

      const updatedBlocks = [...blocks, newBlock]
      const updatedPage = { ...currentPage, blocks: updatedBlocks }
      const updatedPages = site.pages.map(p => p.id === currentPage.id ? updatedPage : p)
      const updatedSite = { ...site, pages: updatedPages }

      await websiteService.updateSite(site.id, updatedSite)
      
      if (onSiteUpdate) {
        onSiteUpdate(updatedSite)
      }

      toast({
        title: 'Block Duplicated',
        description: 'Block has been duplicated successfully.'
      })
    } catch (error) {
      console.error('Error duplicating block:', error)
      toast({
        title: 'Error',
        description: 'Failed to duplicate block. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleCopyBlock = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId)
    if (block) {
      handleDuplicateBlock(block)
    }
  }

  const getDefaultBlockContent = (blockType: string) => {
    switch (blockType) {
      case 'hero':
        return {
          title: 'Welcome to Our Dealership',
          subtitle: 'Find your perfect RV or manufactured home',
          ctaText: 'Browse Inventory',
          ctaLink: '/inventory',
          backgroundImage: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1200'
        }
      case 'text':
        return {
          html: '<h2>About Us</h2><p>We are a leading dealership specializing in RVs and manufactured homes.</p>',
          alignment: 'left'
        }
      case 'image':
        return {
          src: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=800',
          alt: 'Placeholder image',
          caption: '',
          alignment: 'center'
        }
      case 'cta':
        return {
          title: 'Ready to Get Started?',
          description: 'Contact us today to learn more about our inventory and services.',
          buttonText: 'Contact Us',
          buttonLink: '/contact'
        }
      case 'contact':
        return {
          title: 'Contact Us',
          description: 'Get in touch with our team',
          phone: '(555) 123-4567',
          email: 'info@dealership.com',
          address: '123 Main St, City, State 12345'
        }
      case 'inventory':
        return {
          title: 'Featured Inventory',
          items: []
        }
      case 'landHome':
        return {
          title: 'Land & Home Packages',
          packages: []
        }
      case 'gallery':
        return {
          title: 'Image Gallery',
          images: []
        }
      default:
        return {}
    }
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !currentPage || !onUpdatePage) {
      return
    }

    const { source, destination } = result
    
    if (source.index === destination.index) {
      return
    }

    // Reorder blocks
    const reorderedBlocks = Array.from(currentPage.blocks)
    const [removed] = reorderedBlocks.splice(source.index, 1)
    reorderedBlocks.splice(destination.index, 0, removed)

    // Update order property
    const updatedBlocks = reorderedBlocks.map((block, index) => ({
      ...block,
      order: index
    }))

    onUpdatePage({ blocks: updatedBlocks })
  }

  const renderBlock = (block: Block) => {
    const primaryColor = site.theme?.primaryColor || '#3b82f6'

    const blockContent = (() => {
      switch (block.type) {
        case 'hero':
          return (
            <section className="relative bg-gray-900 text-white min-h-[400px] flex items-center">
              {block.content.backgroundImage && (
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${block.content.backgroundImage})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                </div>
              )}
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                {block.content.title && (
                  <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    {block.content.title}
                  </h1>
                )}
                {block.content.subtitle && (
                  <p className="text-xl md:text-2xl mb-8 text-gray-200">
                    {block.content.subtitle}
                  </p>
                )}
                {block.content.ctaText && (
                  <button 
                    className="px-8 py-3 text-lg font-semibold rounded-lg transition-colors"
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
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div 
                  className={`prose prose-lg max-w-none text-${block.content.alignment || 'left'}`}
                  dangerouslySetInnerHTML={{ __html: block.content.html || block.content.text || '' }}
                />
              </div>
            </section>
          )

        case 'image':
          return (
            <section className="py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`text-${block.content.alignment || 'center'}`}>
                  <img 
                    src={block.content.src} 
                    alt={block.content.alt || ''} 
                    className="max-w-full h-auto rounded-lg shadow-lg"
                  />
                  {block.content.caption && (
                    <p className="mt-4 text-gray-600 text-sm">{block.content.caption}</p>
                  )}
                </div>
              </div>
            </section>
          )

        case 'gallery':
          return (
            <section className="py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {block.content.title && (
                  <h2 className="text-3xl font-bold text-center mb-12">{block.content.title}</h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(block.content.images || []).map((image: any, index: number) => (
                    <div key={index} className="relative group">
                      <img 
                        src={image.src} 
                        alt={image.alt || ''} 
                        className="w-full h-64 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                      />
                      {image.caption && (
                        <p className="mt-2 text-sm text-gray-600">{image.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )

        case 'cta':
          return (
            <section className="py-16" style={{ backgroundColor: `${primaryColor}10` }}>
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {block.content.title && (
                  <h2 className="text-3xl font-bold mb-4">{block.content.title}</h2>
                )}
                {block.content.description && (
                  <p className="text-lg text-gray-600 mb-8">{block.content.description}</p>
                )}
                {block.content.buttonText && (
                  <button 
                    className="px-8 py-3 text-lg font-semibold rounded-lg transition-colors"
                    style={{ backgroundColor: primaryColor, color: 'white' }}
                  >
                    {block.content.buttonText}
                  </button>
                )}
              </div>
            </section>
          )

        case 'contact':
          return (
            <section className="py-16 bg-gray-50">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {block.content.title && (
                  <h2 className="text-3xl font-bold text-center mb-12">{block.content.title}</h2>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div>
                    {block.content.description && (
                      <p className="text-lg text-gray-600 mb-6">{block.content.description}</p>
                    )}
                    <div className="space-y-4">
                      {block.content.phone && (
                        <div className="flex items-center">
                          <span className="font-semibold mr-2">Phone:</span>
                          <span>{block.content.phone}</span>
                        </div>
                      )}
                      {block.content.email && (
                        <div className="flex items-center">
                          <span className="font-semibold mr-2">Email:</span>
                          <span>{block.content.email}</span>
                        </div>
                      )}
                      {block.content.address && (
                        <div className="flex items-start">
                          <span className="font-semibold mr-2">Address:</span>
                          <span>{block.content.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="Your Name" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                      <input 
                        type="email" 
                        placeholder="Your Email" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                      <textarea 
                        placeholder="Your Message" 
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      ></textarea>
                      <button 
                        className="w-full px-6 py-3 font-semibold rounded-md transition-colors"
                        style={{ backgroundColor: primaryColor, color: 'white' }}
                      >
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )

        default:
          return (
            <div className="py-8 px-4 bg-yellow-50 border border-yellow-200">
              <p className="text-center text-yellow-800">
                Unknown block type: {block.type}
              </p>
            </div>
          )
      }
    })()

    return (
      <div 
        key={block.id}
        className="relative group border-2 border-transparent hover:border-blue-300 transition-all duration-200"
        onMouseEnter={() => setHoveredBlockId(block.id)}
        onMouseLeave={() => setHoveredBlockId(null)}
      >
        {/* Block Content */}
        {blockContent}

        {/* Enhanced Edit overlay */}
        {hoveredBlockId === block.id && (
          <div className="absolute inset-0 bg-blue-500/5 border-2 border-blue-500 pointer-events-none">
            <div className="absolute top-2 right-2 flex gap-2 pointer-events-auto">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 px-2 bg-white shadow-md hover:bg-gray-50"
                onClick={() => handleEditBlock(block)}
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="h-8 px-2 bg-white shadow-md hover:bg-gray-50"
                onClick={() => handleDuplicateBlock(block)}
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="h-8 px-2 shadow-md"
                onClick={() => handleDeleteBlock(block.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            
            {/* Block type indicator */}
            <div className="absolute top-2 left-2 pointer-events-none">
              <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                {block.type.charAt(0).toUpperCase() + block.type.slice(1)} Block
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (!currentPage) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">No Page Selected</h3>
          <p>Select a page from the Pages tab to start editing</p>
        </div>
      </div>
    )
  }

  // Sort blocks by order
  const sortedBlocks = [...blocks].sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="h-full overflow-y-auto">
        <div className="bg-white">
          {sortedBlocks.length === 0 ? (
            <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-lg font-medium mb-2">Start Building</h3>
                <p className="mb-4">Add your first content block to get started</p>
                <Button onClick={() => setShowAddBlockMenu(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Block
                </Button>
              </div>
            </div>
          ) : (
            <Droppable droppableId="blocks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {sortedBlocks.map((block, index) => (
                    <Draggable key={block.id} draggableId={block.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`relative group border-2 transition-all duration-200 ${
                            snapshot.isDragging 
                              ? 'border-blue-500 shadow-lg bg-blue-50' 
                              : hoveredBlock === block.id 
                                ? 'border-blue-300' 
                                : 'border-transparent'
                          }`}
                          onMouseEnter={() => setHoveredBlock(block.id)}
                          onMouseLeave={() => setHoveredBlock(null)}
                        >
                          {/* Drag Handle */}
                          <div
                            {...provided.dragHandleProps}
                            className={`absolute left-2 top-2 z-20 p-1 rounded bg-white shadow-sm border cursor-grab active:cursor-grabbing transition-opacity ${
                              hoveredBlock === block.id || snapshot.isDragging ? 'opacity-100' : 'opacity-0'
                            }`}
                          >
                            <GripVertical className="h-4 w-4 text-gray-500" />
                          </div>

                          {/* Block Controls */}
                          {(hoveredBlock === block.id || snapshot.isDragging) && (
                            <div className="absolute top-2 right-2 z-10 flex gap-1">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setEditingBlock(block)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleCopyBlock(block.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteBlock(block.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}

                          {renderBlock(block)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </div>

        {/* Add Block Button */}
        <div className="p-4 border-t bg-gray-50">
          <Button 
            className="w-full"
            onClick={() => setShowComponentLibrary(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Block
          </Button>
        </div>

        {/* Component Library Modal */}
        {showComponentLibrary && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Add Component</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowComponentLibrary(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
                <ComponentLibrary
                  onSelectComponent={(component) => {
                    // Handle component selection
                    console.log('Selected component:', component)
                    setShowComponentLibrary(false)
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Block Editor Modal */}
      <BlockEditorModal
        block={editingBlock}
        isOpen={!!editingBlock}
        onClose={() => setEditingBlock(null)}
        onSave={handleSaveBlock}
      />

      {/* Add Block Menu */}
      <AddBlockMenu
        isOpen={showAddBlockMenu}
        onClose={() => setShowAddBlockMenu(false)}
        onAddBlock={handleAddBlock}
      />
    </DragDropContext>
  )
}