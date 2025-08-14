import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown,
  Settings
} from 'lucide-react'
import { useBrochureStore } from '../store/useBrochureStore'
import { BrochureRenderer } from '../components/BrochureRenderer'
import { ThemePicker } from '../components/ThemePicker'
import { BlockPicker } from '../components/blocks/BlockPicker'
import { BlockControls } from '../components/blocks/BlockControls'
import { mockInventory } from '@/mocks/inventoryMock'

export function BrochureTemplateEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getTemplate, updateTemplate, addTemplate, themes } = useBrochureStore()
  
  const [template, setTemplate] = useState<any>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTheme, setSelectedTheme] = useState('')
  const [activeTab, setActiveTab] = useState('design')
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)
  const [showBlockPicker, setShowBlockPicker] = useState(false)

  const isNewTemplate = id === 'new'

  useEffect(() => {
    if (isNewTemplate) {
      // Initialize new template
      const newTemplate = {
        id: `template-${Date.now()}`,
        name: '',
        description: '',
        theme: 'modern',
        blocks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setTemplate(newTemplate)
      setSelectedTheme('modern')
    } else if (id) {
      const existingTemplate = getTemplate(id)
      if (existingTemplate) {
        setTemplate(existingTemplate)
        setName(existingTemplate.name)
        setDescription(existingTemplate.description)
        setSelectedTheme(existingTemplate.theme)
      }
    }
  }, [id, getTemplate, isNewTemplate])

  const handleSave = () => {
    if (!template || !name) return

    const updatedTemplate = {
      ...template,
      name,
      description,
      theme: selectedTheme,
      updatedAt: new Date().toISOString()
    }

    if (isNewTemplate) {
      addTemplate(updatedTemplate)
    } else {
      updateTemplate(template.id, updatedTemplate)
    }

    navigate('/brochures')
  }

  const handleAddBlock = (blockType: string) => {
    if (!template) return

    const newBlock = {
      id: `block-${Date.now()}`,
      type: blockType,
      config: getDefaultBlockConfig(blockType)
    }

    setTemplate({
      ...template,
      blocks: [...template.blocks, newBlock]
    })
    setShowBlockPicker(false)
  }

  const handleUpdateBlock = (blockId: string, config: any) => {
    if (!template) return

    setTemplate({
      ...template,
      blocks: template.blocks.map(block =>
        block.id === blockId ? { ...block, config } : block
      )
    })
  }

  const handleDeleteBlock = (blockId: string) => {
    if (!template) return

    setTemplate({
      ...template,
      blocks: template.blocks.filter(block => block.id !== blockId)
    })
    setSelectedBlock(null)
  }

  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    if (!template) return

    const blocks = [...template.blocks]
    const index = blocks.findIndex(block => block.id === blockId)
    
    if (direction === 'up' && index > 0) {
      [blocks[index], blocks[index - 1]] = [blocks[index - 1], blocks[index]]
    } else if (direction === 'down' && index < blocks.length - 1) {
      [blocks[index], blocks[index + 1]] = [blocks[index + 1], blocks[index]]
    }

    setTemplate({
      ...template,
      blocks
    })
  }

  const getDefaultBlockConfig = (blockType: string) => {
    switch (blockType) {
      case 'hero':
        return {
          title: 'Your Title Here',
          subtitle: 'Your subtitle here',
          backgroundImage: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1200'
        }
      case 'gallery':
        return {
          title: 'Featured Properties',
          layout: 'grid',
          showPrices: true,
          showSpecs: true
        }
      case 'features':
        return {
          title: 'Why Choose Us',
          features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4']
        }
      case 'cta':
        return {
          title: 'Ready to Get Started?',
          subtitle: 'Contact us today',
          buttonText: 'Contact Us',
          buttonUrl: '#'
        }
      default:
        return {}
    }
  }

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/brochures')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Brochures
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {isNewTemplate ? 'New Template' : 'Edit Template'}
              </h1>
              <p className="text-muted-foreground">
                {isNewTemplate ? 'Create a new brochure template' : `Editing: ${template.name}`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setActiveTab('preview')}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSave} disabled={!name}>
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Sidebar */}
        <div className="w-80 border-r bg-card overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-3 m-4">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="blocks">Blocks</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="design" className="p-4 space-y-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Template name"
                />
              </div>
              
              <div>
                <Label htmlFor="template-description">Description</Label>
                <Input
                  id="template-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Template description"
                />
              </div>

              <div>
                <Label>Theme</Label>
                <ThemePicker
                  themes={themes}
                  selectedTheme={selectedTheme}
                  onThemeChange={setSelectedTheme}
                />
              </div>
            </TabsContent>

            <TabsContent value="blocks" className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Template Blocks</h3>
                <Button size="sm" onClick={() => setShowBlockPicker(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Block
                </Button>
              </div>

              <div className="space-y-2">
                {template.blocks.map((block: any, index: number) => (
                  <Card 
                    key={block.id}
                    className={`cursor-pointer transition-colors ${
                      selectedBlock === block.id ? 'ring-2 ring-primary' : 'hover:bg-accent/50'
                    }`}
                    onClick={() => setSelectedBlock(block.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium capitalize">{block.type}</h4>
                          <p className="text-xs text-muted-foreground">
                            {block.config.title || `${block.type} block`}
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
                            <MoveUp className="h-3 w-3" />
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
                            <MoveDown className="h-3 w-3" />
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
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedBlock && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Block Settings</h4>
                  <BlockControls
                    block={template.blocks.find((b: any) => b.id === selectedBlock)}
                    onUpdate={(config) => handleUpdateBlock(selectedBlock, config)}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Template Settings</CardTitle>
                  <CardDescription>
                    Configure template-wide settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Blocks:</span>
                      <span>{template.blocks.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Theme:</span>
                      <Badge variant="outline">{selectedTheme}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Updated:</span>
                      <span>{new Date(template.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="p-0">
              <div className="h-full overflow-y-auto">
                <BrochureRenderer 
                  template={template}
                  listings={mockInventory.sampleVehicles.slice(0, 6)}
                  preview={true}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'preview' ? (
            <BrochureRenderer 
              template={template}
              listings={mockInventory.sampleVehicles.slice(0, 6)}
              preview={true}
            />
          ) : (
            <div className="p-6">
              <Card>
                <CardContent className="p-8 text-center">
                  <Settings className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Template Editor</h3>
                  <p className="text-muted-foreground mb-4">
                    Use the sidebar to configure your template, then switch to Preview to see your changes.
                  </p>
                  <Button onClick={() => setActiveTab('preview')}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Template
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Block Picker Modal */}
      {showBlockPicker && (
        <BlockPicker
          onSelectBlock={handleAddBlock}
          onClose={() => setShowBlockPicker(false)}
        />
      )}
    </div>
  )
}