import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Site, Page, Block } from '../types'
import { SiteRenderer } from '@/components/SiteRenderer'
import BlockEditorModal from './BlockEditorModal'
import AddBlockMenu from './AddBlockMenu'
import { websiteService } from '@/services/website/service'
import { useToast } from '@/hooks/use-toast'

interface EditorCanvasProps {
  site: Site
  currentPage: Page | null
  previewMode: 'desktop' | 'tablet' | 'mobile'
  onUpdateSite: (updatedSite: Site) => void
}

export default function EditorCanvas({ site, currentPage, previewMode, onUpdateSite }: EditorCanvasProps) {
  const [editingBlock, setEditingBlock] = useState<Block | null>(null)
  const [showAddBlock, setShowAddBlock] = useState(false)
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleBlockUpdate = async (blockId: string, updates: Partial<Block>) => {
    if (!currentPage || !site) return

    try {
      // Create updated site with new block content
      const updatedSite = { ...site }
      const pageIndex = updatedSite.pages.findIndex(p => p.id === currentPage.id)
      
      if (pageIndex >= 0) {
        const updatedPage = { ...updatedSite.pages[pageIndex] }
        const blockIndex = updatedPage.blocks.findIndex(b => b.id === blockId)
        
        if (blockIndex >= 0) {
          updatedPage.blocks[blockIndex] = { ...updatedPage.blocks[blockIndex], ...updates }
          updatedSite.pages[pageIndex] = updatedPage
          updatedSite.updatedAt = new Date().toISOString()
          
          // Update the site state in parent component
      
      // Update sessionStorage for preview
      if (site.slug) {
        const previewKey = `wb2:preview:${site.slug}`
        sessionStorage.setItem(previewKey, JSON.stringify(updatedSite))
      }
          onUpdateSite(updatedSite)
          
          // Also save to localStorage for persistence
          await websiteService.updateSite(site.id, updatedSite)
          
          toast({
            title: 'Block updated',
            description: 'Your changes have been saved.'
          })
        }
      }
    } catch (error) {
      console.error('Failed to update block:', error)
      toast({
        title: 'Update failed',
        description: 'Failed to save block changes.',
        variant: 'destructive'
      })
    }
  }

  const handleBlockDelete = async (blockId: string) => {
    if (!currentPage || !site) return

    try {
      // Create updated site without the deleted block
      const updatedSite = { ...site }
      const pageIndex = updatedSite.pages.findIndex(p => p.id === currentPage.id)
      
      if (pageIndex >= 0) {
        const updatedPage = { ...updatedSite.pages[pageIndex] }
        updatedPage.blocks = updatedPage.blocks.filter(b => b.id !== blockId)
        updatedSite.pages[pageIndex] = updatedPage
        updatedSite.updatedAt = new Date().toISOString()
        
        // Update the site state in parent component
        onUpdateSite(updatedSite)
        
        // Also save to localStorage for persistence
        await websiteService.updateSite(site.id, updatedSite)
        
        toast({
          title: 'Block deleted',
          description: 'The block has been removed.'
        })
      }
    } catch (error) {
      console.error('Failed to delete block:', error)
      toast({
        title: 'Delete failed',
        description: 'Failed to delete block.',
        variant: 'destructive'
      })
    }
  }

  const handleAddBlock = async (blockType: string) => {
    if (!currentPage || !site) return

    try {
      const newBlock: Block = {
        id: `block-${Date.now()}`,
        type: blockType,
        order: (currentPage.blocks?.length || 0),
        content: getDefaultBlockContent(blockType)
      }

      // Create updated site with new block
      const updatedSite = { ...site }
      const pageIndex = updatedSite.pages.findIndex(p => p.id === currentPage.id)
      
      if (pageIndex >= 0) {
        const updatedPage = { ...updatedSite.pages[pageIndex] }
        updatedPage.blocks = [...(updatedPage.blocks || []), newBlock]
        updatedSite.pages[pageIndex] = updatedPage
        updatedSite.updatedAt = new Date().toISOString()
        
        // Update the site state in parent component
        onUpdateSite(updatedSite)
        
        // Also save to localStorage for persistence
        await websiteService.updateSite(site.id, updatedSite)
        
        setShowAddBlock(false)
        toast({
          title: 'Block added',
          description: `New ${blockType} block has been added.`
        })
      }
    } catch (error) {
      console.error('Failed to add block:', error)
      toast({
        title: 'Add failed',
        description: 'Failed to add new block.',
        variant: 'destructive'
      })
    }
  }

  const getDefaultBlockContent = (blockType: string) => {
    switch (blockType) {
      case 'hero':
        return {
          title: 'New Hero Section',
          subtitle: 'Add your subtitle here',
          ctaText: 'Call to Action',
          ctaLink: '#',
          backgroundImage: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1200'
        }
      case 'text':
        return {
          html: '<h2>New Text Section</h2><p>Add your content here.</p>',
          alignment: 'left'
        }
      case 'image':
        return {
          src: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800',
          alt: 'Image description',
          caption: 'Image caption',
          alignment: 'center'
        }
      case 'cta':
        return {
          title: 'Ready to Get Started?',
          description: 'Contact us today to learn more.',
          buttonText: 'Get Started',
          buttonLink: '/contact'
        }
      case 'contact':
        return {
          title: 'Contact Us',
          description: 'Get in touch with our team.',
          phone: '(555) 123-4567',
          email: 'info@example.com',
          address: '123 Main St, City, State 12345'
        }
      default:
        return {}
    }
  }

  if (!currentPage) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Page Selected</h3>
          <p className="text-gray-600">Select a page from the Pages tab to start editing.</p>
        </div>
      </div>
    )
  }

  const blocks = currentPage.blocks || []

  return (
    <div className="h-full overflow-auto relative">
      {/* Render the site with editing overlays */}
      <div className="relative">
        {/* Site content */}
        <div className="relative">
          <SiteRenderer site={site} />
          
          {/* Editing overlays */}
          <div className="absolute inset-0 pointer-events-none">
            {blocks.map((block, index) => (
              <div
                key={block.id}
                className="absolute pointer-events-auto"
                style={{
                  top: `${index * 200}px`, // Approximate positioning
                  left: 0,
                  right: 0,
                  height: '200px',
                  zIndex: 10
                }}
                onMouseEnter={() => setHoveredBlockId(block.id)}
                onMouseLeave={() => setHoveredBlockId(null)}
              >
                {hoveredBlockId === block.id && (
                  <div className="absolute top-2 right-2 flex gap-2 bg-white shadow-lg rounded-md p-1 border">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingBlock(block)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this block?')) {
                          handleBlockDelete(block.id)
                        }
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add block button */}
        <div className="sticky bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <Button
            onClick={() => setShowAddBlock(true)}
            className="shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Block
          </Button>
        </div>
      </div>

      {/* Block Editor Modal */}
      {editingBlock && (
        <BlockEditorModal
          block={editingBlock}
          onSave={(updates) => {
            handleBlockUpdate(editingBlock.id, updates)
            setEditingBlock(null)
          }}
          onClose={() => setEditingBlock(null)}
        />
      )}

      {/* Add Block Menu */}
      {showAddBlock && (
        <AddBlockMenu
          onSelectBlock={handleAddBlock}
          onClose={() => setShowAddBlock(false)}
        />
      )}
    </div>
  )
}