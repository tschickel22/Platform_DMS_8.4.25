import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Edit, Trash2, Plus, GripVertical, Copy, Layers } from 'lucide-react'
import { ComponentLibrary } from './ComponentLibrary'
import { Site, Page, Block } from '../types'
import { websiteService } from '@/services/website/service'
import { useToast } from '@/hooks/use-toast'
import RichTextEditor from './RichTextEditor'

interface EditorCanvasProps {
  site: Site
  currentPage: Page | null
  previewMode: 'desktop' | 'tablet' | 'mobile'
  onSiteUpdate?: (site: Site) => void
}

interface BlockEditorModalProps {
  block: Block | null
  isOpen: boolean
  const [showComponentLibrary, setShowComponentLibrary] = useState(false)
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

export default function EditorCanvas({ site, currentPage, previewMode, onSiteUpdate }: EditorCanvasProps) {
  const [editingBlock, setEditingBlock] = useState<Block | null>(null)
  const [showAddBlockMenu, setShowAddBlockMenu] = useState(false)
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
      default:
        return {}
    }
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
        className="relative group border-2 border-transparent hover:border-blue-300 transition-colors"
      >
        {/* Edit Overlay */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleEditBlock(block)}
              className="bg-white shadow-md hover:bg-gray-50"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleDeleteBlock(block.id)}
              className="bg-white shadow-md hover:bg-gray-50 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Block Content */}
        {blockContent}
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
  const handleAddBlock = (blockData?: any) => {
  return (
    <div className="h-full overflow-y-auto">
    const defaultBlock = {
      type: 'text',
      content: {
        html: '<p>New text block. Click edit to customize.</p>',
        alignment: 'left'
      }
          onClick={() => setShowAddBlockMenu(true)}
          className="flex items-center gap-2"
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: blocks.length,
      ...defaultBlock,
      ...blockData
    }

        >
          <Plus className="h-4 w-4" />
          Add Block
        </Button>
      </div>

      {/* Page Content */}
      <div className="bg-white">
        {sortedBlocks.length === 0 ? (
          <div className="h-96 flex items-center justify-center text-muted-foreground">
    const blockStyles = block.styles || {}
    
    // Convert styles to CSS
    const cssStyles: React.CSSProperties = {
      padding: blockStyles.padding ? 
        `${blockStyles.padding.top || 16}px ${blockStyles.padding.right || 16}px ${blockStyles.padding.bottom || 16}px ${blockStyles.padding.left || 16}px` :
        '16px',
      margin: blockStyles.margin ? 
        `${blockStyles.margin.top || 0}px 0 ${blockStyles.margin.bottom || 0}px 0` :
        '0',
      backgroundColor: blockStyles.backgroundColor || 'transparent',
      borderRadius: blockStyles.borderRadius || '0px',
      borderWidth: blockStyles.borderWidth || '0px',
      borderStyle: blockStyles.borderWidth && parseInt(blockStyles.borderWidth) > 0 ? 'solid' : 'none',
      borderColor: blockStyles.borderColor || '#e5e7eb',
      boxShadow: blockStyles.boxShadow || 'none'
    }
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Empty Page</h3>
              <p className="mb-4">This page doesn't have any content blocks yet.</p>
  const handleBlockDuplicate = async (blockId: string) => {
    if (!site || !currentPage || !onSiteUpdate) return

    const blockToDuplicate = blocks.find(block => block.id === blockId)
        style={cssStyles}
    if (!blockToDuplicate) return

    const newBlock = {
      ...blockToDuplicate,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: (blockToDuplicate.order || 0) + 1
    }

    const updatedBlocks = [...blocks, newBlock].sort((a, b) => (a.order || 0) - (b.order || 0))
    const updatedPages = site.pages.map(page =>
      page.id === currentPage.id ? { ...page, blocks: updatedBlocks } : page
    )
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleBlockDuplicate(block.id)}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>

    onSiteUpdate({ pages: updatedPages })
  }
              <Button onClick={() => setShowAddBlockMenu(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Block
              </Button>
            </div>
          </div>
        ) : (
          sortedBlocks.map(renderBlock)
              <Button onClick={() => setShowComponentLibrary(true)}>
      </div>
                Add Component
      {/* Add Block Button at Bottom */}
      {sortedBlocks.length > 0 && (
        <div className="p-8 text-center border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={() => setShowAddBlockMenu(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Block
          </Button>
              <Button onClick={() => setShowComponentLibrary(true)} variant="outline">
      )}
                Add Component
      {/* Modals */}
      <BlockEditorModal
        block={editingBlock}
        isOpen={!!editingBlock}
        onClose={() => setEditingBlock(null)}
        onSave={handleSaveBlock}
      />

      <AddBlockMenu
        isOpen={showAddBlockMenu}
        onClose={() => setShowAddBlockMenu(false)}
        onAddBlock={handleAddBlock}
      />

      {/* Component Library Modal */}
      {showComponentLibrary && (
        <ComponentLibrary
          onAddComponent={handleAddBlock}
          onClose={() => setShowComponentLibrary(false)}
        />
      )}
    </div>
  )
}
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