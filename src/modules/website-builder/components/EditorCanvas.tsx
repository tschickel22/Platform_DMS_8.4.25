import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Edit, Trash2, Plus, GripVertical } from 'lucide-react'
import { Site, Page, Block } from '../types'
import BlockEditorModal from './BlockEditorModal'
import AddBlockMenu from './AddBlockMenu'

interface EditorCanvasProps {
  site: Site
  currentPage: Page | null
  previewMode: 'desktop' | 'tablet' | 'mobile'
}

interface EditorCanvasProps {
  site: Site
  currentPage: Page | null
  previewMode: 'desktop' | 'tablet' | 'mobile'
  onUpdateSite?: (updatedSite: Site) => void
}

export default function EditorCanvas({ site, currentPage, previewMode, onUpdateSite }: EditorCanvasProps) {
  const [editingBlock, setEditingBlock] = useState<Block | null>(null)
  const [showAddBlock, setShowAddBlock] = useState(false)
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null)
  
  const handleBlockUpdate = async (blockId: string, updates: Partial<Block>) => {
    if (!currentPage || !onUpdateSite) return
    
    // Create updated site with modified block
    const updatedSite = {
      ...site,
      pages: site.pages.map(page => 
        page.id === currentPage.id 
          ? {
              ...page,
              blocks: page.blocks.map(block =>
                block.id === blockId ? { ...block, ...updates } : block
              )
            }
          : page
      )
    }
    
    // Update the site state in parent component
    onUpdateSite(updatedSite)
    
    // Also update localStorage for persistence
    try {
      await websiteService.updateSite(site.id, updatedSite)
    } catch (error) {
      console.error('Failed to save block update:', error)
    }
  }

  const handleEditBlock = (block: Block) => {
    setEditingBlock(block)
  }

  const handleDeleteBlock = (blockId: string) => {
    // In a real implementation, this would call the website service
    console.log('Delete block:', blockId)
  }

  if (!currentPage) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-lg mb-2">No page selected</p>
          <p className="text-sm">Select a page from the Pages tab to start editing</p>
        </div>
      </div>
    )
  }

  const handleSaveBlock = async (blockId: string, updates: Partial<Block>) => {
    await handleBlockUpdate(blockId, updates)
    setEditingBlock(null)
  }

  const handleAddBlock = (blockType: string) => {
    // In a real implementation, this would call the website service
    console.log('Add block:', blockType)
    setShowAddBlock(false)
  }

  const renderBlock = (block: Block) => {
    const primaryColor = site.theme?.primaryColor || '#3b82f6'
    const isHovered = hoveredBlockId === block.id

    const blockContent = (() => {
      switch (block.type) {
        case 'hero':
          return (
            <section className="relative bg-gray-900 text-white min-h-[400px] flex items-center">
              {block.content?.backgroundImage && (
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${block.content.backgroundImage})` }}
                >
                  <div className="absolute inset-0 bg-black/50" />
                </div>
              )}
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                {block.content?.title && (
                  <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    {block.content.title}
                  </h1>
                )}
                {block.content?.subtitle && (
                  <p className="text-xl md:text-2xl mb-8 text-gray-200">
                    {block.content.subtitle}
                  </p>
                )}
                {block.content?.ctaText && (
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
                  className={`prose prose-lg max-w-none ${block.content?.alignment || 'text-left'}`}
                  dangerouslySetInnerHTML={{ __html: block.content?.html || block.content?.text || 'Add your text content here...' }}
                />
              </div>
            </section>
          )

        case 'image':
          return (
            <section className="py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`text-${block.content?.alignment || 'center'}`}>
                  {block.content?.src ? (
                    <img
                      src={block.content.src}
                      alt={block.content?.alt || ''}
                      className="max-w-full h-auto rounded-lg shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Click to add image</p>
                    </div>
                  )}
                  {block.content?.caption && (
                    <p className="mt-4 text-gray-600 text-sm">{block.content.caption}</p>
                  )}
                </div>
              </div>
            </section>
          )

        case 'cta':
          return (
            <section className="py-16 bg-gray-50">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {block.content?.title && (
                  <h2 className="text-3xl font-bold mb-4">{block.content.title}</h2>
                )}
                {block.content?.description && (
                  <p className="text-lg text-gray-600 mb-8">{block.content.description}</p>
                )}
                {block.content?.buttonText && (
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
        className="relative group border-2 transition-all duration-200 border-transparent"
        onMouseEnter={() => setHoveredBlockId(block.id)}
        onMouseLeave={() => setHoveredBlockId(null)}
      >
        {/* Edit Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 z-10 pointer-events-none">
            <div className="absolute top-2 right-2 flex gap-2 pointer-events-auto">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleEditBlock(block)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDeleteBlock(block.id)}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute top-2 left-2 pointer-events-auto">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 cursor-grab"
              >
                <GripVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="relative group border-2 border-transparent hover:border-blue-300 transition-all duration-200">
          {blockContent}
        </div>
      </div>
    )
  }

  const sortedBlocks = [...(currentPage.blocks || [])].sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <div className="h-full overflow-y-auto">
      <div className="bg-white">
        {sortedBlocks.length === 0 ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-muted-foreground mb-4">This page is empty</p>
              <Button onClick={() => setShowAddBlock(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Block
              </Button>
            </div>
          </div>
        ) : (
          <>
            {sortedBlocks.map(renderBlock)}
            <div className="py-8 text-center">
              <Button
                variant="outline"
                onClick={() => setShowAddBlock(true)}
                className="border-dashed"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Block
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Block Editor Modal */}
      {editingBlock && (
        <BlockEditorModal
          block={editingBlock}
          onSave={(updates) => handleSaveBlock(editingBlock.id, updates)}
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