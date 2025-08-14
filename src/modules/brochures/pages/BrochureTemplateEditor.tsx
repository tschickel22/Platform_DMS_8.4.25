import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Move,
  Settings,
  Palette,
  Share2
} from 'lucide-react'
import { useBrochureStore } from '../store/useBrochureStore'
import { BrochureTemplate, BrochureBlock, BlockType } from '../types'
import { BrochureRenderer } from '../components/BrochureRenderer'
import { ThemePicker } from '../components/ThemePicker'
import { BlockPicker } from '../components/blocks/BlockPicker'
import { BlockControls } from '../components/blocks/BlockControls'
import { ShareBrochureModal } from '../components/ShareBrochureModal'
import { useToast } from '@/hooks/use-toast'

export default function BrochureTemplateEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const {
    templates,
    createTemplate,
    updateTemplate,
    getTemplate
  } = useBrochureStore()

  const [template, setTemplate] = useState<BrochureTemplate | null>(null)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showThemePicker, setShowThemePicker] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Load template if editing existing one
  useEffect(() => {
    if (id && id !== 'new') {
      const existingTemplate = getTemplate(id)
      if (existingTemplate) {
        setTemplate(existingTemplate)
      } else {
        toast({
          title: 'Template not found',
          description: 'The requested template could not be found.',
          variant: 'destructive'
        })
        navigate('/brochures')
      }
    } else {
      // Create new template
      const newTemplate: BrochureTemplate = {
        id: `template-${Date.now()}`,
        name: 'Untitled Brochure',
        description: '',
        theme: 'sleek',
        blocks: [],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setTemplate(newTemplate)
    }
  }, [id, getTemplate, navigate, toast])

  const handleSave = async () => {
    if (!template) return

    setIsLoading(true)
    try {
      const updatedTemplate = {
        ...template,
        updatedAt: new Date().toISOString()
      }

      if (id && id !== 'new') {
        updateTemplate(template.id, updatedTemplate)
        toast({
          title: 'Template saved',
          description: 'Your brochure template has been saved successfully.'
        })
      } else {
        createTemplate(updatedTemplate)
        toast({
          title: 'Template created',
          description: 'Your new brochure template has been created successfully.'
        })
        navigate(`/brochures/templates/${template.id}/edit`)
      }
    } catch (error) {
      toast({
        title: 'Save failed',
        description: 'Failed to save the template. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddBlock = (blockType: BlockType) => {
    if (!template) return

    const newBlock: BrochureBlock = {
      id: `block-${Date.now()}`,
      type: blockType,
      props: {},
      order: template.blocks.length
    }

    setTemplate({
      ...template,
      blocks: [...template.blocks, newBlock]
    })

    setSelectedBlockId(newBlock.id)
  }

  const handleUpdateBlock = (blockId: string, props: any) => {
    if (!template) return

    setTemplate({
      ...template,
      blocks: template.blocks.map(block =>
        block.id === blockId ? { ...block, props } : block
      )
    })
  }

  const handleDeleteBlock = (blockId: string) => {
    if (!template) return

    setTemplate({
      ...template,
      blocks: template.blocks.filter(block => block.id !== blockId)
    })

    if (selectedBlockId === blockId) {
      setSelectedBlockId(null)
    }
  }

  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    if (!template) return

    const blocks = [...template.blocks]
    const index = blocks.findIndex(block => block.id === blockId)
    
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= blocks.length) return

    // Swap blocks
    const temp = blocks[index]
    blocks[index] = blocks[newIndex]
    blocks[newIndex] = temp

    // Update order
    blocks.forEach((block, i) => {
      block.order = i
    })

    setTemplate({
      ...template,
      blocks
    })
  }

  const selectedBlock = template?.blocks.find(block => block.id === selectedBlockId)

  if (!template) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/brochures')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Brochures
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{template.name}</h1>
              <p className="text-sm text-muted-foreground">
                {id === 'new' ? 'Creating new template' : 'Editing template'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowThemePicker(true)}
            >
              <Palette className="h-4 w-4 mr-2" />
              Theme
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowShareModal(true)}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {!showPreview && (
          <>
            {/* Left Sidebar - Template Settings & Block List */}
            <div className="w-80 border-r bg-card flex flex-col">
              <div className="p-4 border-b">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      value={template.name}
                      onChange={(e) => setTemplate({
                        ...template,
                        name: e.target.value
                      })}
                      placeholder="Enter template name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="template-description">Description</Label>
                    <Textarea
                      id="template-description"
                      value={template.description}
                      onChange={(e) => setTemplate({
                        ...template,
                        description: e.target.value
                      })}
                      placeholder="Describe this template"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Blocks List */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Blocks</h3>
                    <BlockPicker onSelectBlock={handleAddBlock}>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Block
                      </Button>
                    </BlockPicker>
                  </div>

                  <div className="space-y-2">
                    {template.blocks.map((block, index) => (
                      <div
                        key={block.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedBlockId === block.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-accent'
                        }`}
                        onClick={() => setSelectedBlockId(block.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm capitalize">
                              {block.type.replace('_', ' ')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Block {index + 1}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMoveBlock(block.id, 'up')
                              }}
                              disabled={index === 0}
                            >
                              <Move className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteBlock(block.id)
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {template.blocks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">No blocks added yet</p>
                      <p className="text-xs">Click "Add Block" to get started</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Block Properties */}
            {selectedBlock && (
              <div className="w-80 border-l bg-card">
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <h3 className="font-medium">Block Properties</h3>
                  </div>
                  <p className="text-sm text-muted-foreground capitalize">
                    {selectedBlock.type.replace('_', ' ')} Block
                  </p>
                </div>
                <div className="p-4">
                  <BlockControls
                    block={selectedBlock}
                    onChange={(props) => handleUpdateBlock(selectedBlock.id, props)}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            {showPreview ? (
              <div className="max-w-4xl mx-auto">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-medium">Preview</h2>
                  <Badge variant="outline">
                    {template.theme} theme
                  </Badge>
                </div>
                <BrochureRenderer
                  template={template}
                  data={{}}
                  className="shadow-lg"
                />
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                <div className="mb-4">
                  <h2 className="text-lg font-medium">Template Editor</h2>
                  <p className="text-sm text-muted-foreground">
                    Design your brochure template by adding and configuring blocks
                  </p>
                </div>

                {template.blocks.length > 0 ? (
                  <div className="space-y-4">
                    {template.blocks.map((block, index) => (
                      <div
                        key={block.id}
                        className={`border rounded-lg overflow-hidden transition-all ${
                          selectedBlockId === block.id
                            ? 'border-primary shadow-md'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedBlockId(block.id)}
                      >
                        <div className="p-2 bg-muted/50 border-b flex items-center justify-between">
                          <span className="text-xs font-medium capitalize">
                            {block.type.replace('_', ' ')} Block
                          </span>
                          <div className="flex items-center space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMoveBlock(block.id, 'up')
                              }}
                              disabled={index === 0}
                            >
                              ↑
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMoveBlock(block.id, 'down')
                              }}
                              disabled={index === template.blocks.length - 1}
                            >
                              ↓
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteBlock(block.id)
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-4">
                          <BrochureRenderer
                            template={{
                              ...template,
                              blocks: [block]
                            }}
                            data={{}}
                            className="pointer-events-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <div className="text-center space-y-4">
                        <div className="text-muted-foreground/50">
                          <Plus className="h-12 w-12 mx-auto mb-4" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">Start Building</h3>
                          <p className="text-muted-foreground">
                            Add your first block to begin creating your brochure template
                          </p>
                        </div>
                        <BlockPicker onSelectBlock={handleAddBlock}>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Your First Block
                          </Button>
                        </BlockPicker>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showThemePicker && (
        <ThemePicker
          currentTheme={template.theme}
          onThemeChange={(theme) => {
            setTemplate({ ...template, theme })
            setShowThemePicker(false)
          }}
          onClose={() => setShowThemePicker(false)}
        />
      )}

      {showShareModal && (
        <ShareBrochureModal
          template={template}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  )
}