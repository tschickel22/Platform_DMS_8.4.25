import React, { useState } from 'react'
import { Page, Block, BlockType } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react'
import { BlockRegistry } from './BlockRegistry'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface EditorCanvasProps {
  page: Page
  onUpdatePage: (updates: Partial<Page>) => void
}

export function EditorCanvas({ page, onUpdatePage }: EditorCanvasProps) {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  const [showBlockPicker, setShowBlockPicker] = useState(false)

  const handleAddBlock = (blockType: BlockType) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type: blockType,
      content: getDefaultBlockContent(blockType),
      order: page.blocks.length,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const updatedBlocks = [...page.blocks, newBlock]
    onUpdatePage({ blocks: updatedBlocks })
    setShowBlockPicker(false)
    setSelectedBlock(newBlock)
  }

  const handleUpdateBlock = (blockId: string, updates: Partial<Block>) => {
    const updatedBlocks = page.blocks.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    )
    onUpdatePage({ blocks: updatedBlocks })
    
    if (selectedBlock?.id === blockId) {
      setSelectedBlock({ ...selectedBlock, ...updates })
    }
  }

  const handleDeleteBlock = (blockId: string) => {
    if (confirm('Are you sure you want to delete this block?')) {
      const updatedBlocks = page.blocks.filter(block => block.id !== blockId)
      onUpdatePage({ blocks: updatedBlocks })
      
      if (selectedBlock?.id === blockId) {
        setSelectedBlock(null)
      }
    }
  }

  const handleReorderBlocks = (dragIndex: number, hoverIndex: number) => {
    const draggedBlock = page.blocks[dragIndex]
    const updatedBlocks = [...page.blocks]
    updatedBlocks.splice(dragIndex, 1)
    updatedBlocks.splice(hoverIndex, 0, draggedBlock)
    
    // Update order values
    const reorderedBlocks = updatedBlocks.map((block, index) => ({
      ...block,
      order: index
    }))
    
    onUpdatePage({ blocks: reorderedBlocks })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Canvas */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Page Content</h3>
          <Button onClick={() => setShowBlockPicker(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Block
          </Button>
        </div>

        <div className="space-y-4 min-h-[400px] border-2 border-dashed border-muted rounded-lg p-4">
          {page.blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-muted-foreground mb-4">
                <Plus className="h-12 w-12 mx-auto mb-2" />
                <p>No blocks yet</p>
                <p className="text-sm">Add your first block to get started</p>
              </div>
              <Button onClick={() => setShowBlockPicker(true)}>
                Add Block
              </Button>
            </div>
          ) : (
            page.blocks
              .sort((a, b) => a.order - b.order)
              .map((block, index) => (
                <Card 
                  key={block.id}
                  className={`cursor-pointer transition-colors ${
                    selectedBlock?.id === block.id ? 'ring-2 ring-primary' : 'hover:bg-accent/50'
                  }`}
                  onClick={() => setSelectedBlock(block)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <Badge variant="outline">{block.type}</Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedBlock(block)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteBlock(block.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <BlockPreview block={block} />
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </div>

      {/* Inspector */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Block Inspector</h3>
        
        {selectedBlock ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {selectedBlock.type} Block
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BlockEditor
                block={selectedBlock}
                onUpdate={(updates) => handleUpdateBlock(selectedBlock.id, updates)}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <Edit className="h-8 w-8 mx-auto mb-2" />
              <p>Select a block to edit its properties</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Block Picker Dialog */}
      {showBlockPicker && (
        <BlockRegistry
          onSelectBlock={handleAddBlock}
          onClose={() => setShowBlockPicker(false)}
        />
      )}
    </div>
  )
}

function BlockPreview({ block }: { block: Block }) {
  switch (block.type) {
    case BlockType.HERO:
      return (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded">
          <h2 className="text-xl font-bold">{block.content.title || 'Hero Title'}</h2>
          <p className="text-sm opacity-90">{block.content.subtitle || 'Hero subtitle'}</p>
        </div>
      )
    case BlockType.TEXT:
      return (
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: block.content.html || '<p>Text content</p>' }}
        />
      )
    case BlockType.IMAGE:
      return (
        <div className="text-center">
          {block.content.url ? (
            <img 
              src={block.content.url} 
              alt={block.content.alt || 'Image'} 
              className="max-w-full h-32 object-cover rounded mx-auto"
            />
          ) : (
            <div className="h-32 bg-muted rounded flex items-center justify-center">
              <span className="text-muted-foreground">No image selected</span>
            </div>
          )}
        </div>
      )
    case BlockType.CTA:
      return (
        <div className="text-center p-4 bg-primary/10 rounded">
          <h3 className="font-semibold">{block.content.title || 'Call to Action'}</h3>
          <Button className="mt-2" size="sm">
            {block.content.buttonText || 'Click Here'}
          </Button>
        </div>
      )
    case BlockType.INVENTORY:
      return (
        <div className="text-center p-4 bg-muted rounded">
          <h3 className="font-semibold">{block.content.title || 'Inventory Showcase'}</h3>
          <p className="text-sm text-muted-foreground">Dynamic inventory content</p>
        </div>
      )
    case BlockType.LAND_HOME:
      return (
        <div className="text-center p-4 bg-green-50 rounded">
          <h3 className="font-semibold">{block.content.title || 'Land & Home Packages'}</h3>
          <p className="text-sm text-muted-foreground">Land and home deals</p>
        </div>
      )
    default:
      return (
        <div className="text-center p-4 bg-muted rounded">
          <span className="text-muted-foreground">{block.type} block</span>
        </div>
      )
  }
}

function BlockEditor({ block, onUpdate }: { block: Block; onUpdate: (updates: Partial<Block>) => void }) {
  const updateContent = (key: string, value: any) => {
    onUpdate({
      content: {
        ...block.content,
        [key]: value
      }
    })
  }

  switch (block.type) {
    case BlockType.HERO:
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              placeholder="Hero title"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={block.content.subtitle || ''}
              onChange={(e) => updateContent('subtitle', e.target.value)}
              placeholder="Hero subtitle"
            />
          </div>
          <div>
            <Label>Background Image URL</Label>
            <Input
              value={block.content.backgroundImage || ''}
              onChange={(e) => updateContent('backgroundImage', e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div>
            <Label>Button Text</Label>
            <Input
              value={block.content.ctaText || ''}
              onChange={(e) => updateContent('ctaText', e.target.value)}
              placeholder="Get Started"
            />
          </div>
          <div>
            <Label>Button Link</Label>
            <Input
              value={block.content.ctaLink || ''}
              onChange={(e) => updateContent('ctaLink', e.target.value)}
              placeholder="/contact"
            />
          </div>
        </div>
      )
    
    case BlockType.TEXT:
      return (
        <div className="space-y-4">
          <div>
            <Label>Content (HTML)</Label>
            <textarea
              className="w-full h-32 p-2 border rounded-md"
              value={block.content.html || ''}
              onChange={(e) => updateContent('html', e.target.value)}
              placeholder="<p>Your content here...</p>"
            />
          </div>
          <div>
            <Label>Alignment</Label>
            <select
              className="w-full p-2 border rounded-md"
              value={block.content.alignment || 'left'}
              onChange={(e) => updateContent('alignment', e.target.value)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      )
    
    case BlockType.CTA:
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              placeholder="Call to action title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={block.content.description || ''}
              onChange={(e) => updateContent('description', e.target.value)}
              placeholder="Description text"
            />
          </div>
          <div>
            <Label>Button Text</Label>
            <Input
              value={block.content.buttonText || ''}
              onChange={(e) => updateContent('buttonText', e.target.value)}
              placeholder="Click Here"
            />
          </div>
          <div>
            <Label>Button Link</Label>
            <Input
              value={block.content.buttonLink || ''}
              onChange={(e) => updateContent('buttonLink', e.target.value)}
              placeholder="/contact"
            />
          </div>
        </div>
      )
    
    default:
      return (
        <div className="text-center text-muted-foreground">
          <p>No editor available for {block.type} blocks yet</p>
        </div>
      )
  }
}

function getDefaultBlockContent(blockType: BlockType): Record<string, any> {
  switch (blockType) {
    case BlockType.HERO:
      return {
        title: 'Welcome to Our Website',
        subtitle: 'Discover amazing products and services',
        backgroundImage: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200',
        ctaText: 'Get Started',
        ctaLink: '/contact'
      }
    case BlockType.TEXT:
      return {
        html: '<p>Add your content here...</p>',
        alignment: 'left'
      }
    case BlockType.CTA:
      return {
        title: 'Ready to Get Started?',
        description: 'Contact us today to learn more',
        buttonText: 'Contact Us',
        buttonLink: '/contact'
      }
    case BlockType.INVENTORY:
      return {
        title: 'Our Inventory',
        subtitle: 'Browse our available products',
        limit: 6,
        showFilters: false
      }
    case BlockType.LAND_HOME:
      return {
        title: 'Land & Home Packages',
        subtitle: 'Complete packages available',
        showPackages: true
      }
    default:
      return {}
  }
}