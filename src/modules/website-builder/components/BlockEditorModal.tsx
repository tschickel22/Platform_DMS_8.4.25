
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RichTextEditor } from './RichTextEditor'
import { ImageEditor } from './ImageEditor'
import { LayoutControls } from './LayoutControls'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Image as ImageIcon, Type, Palette } from 'lucide-react'

interface BlockEditorModalProps {
  block: any
  isOpen: boolean
  onClose: () => void
  onSave: (updates: any) => void
}

export default function BlockEditorModal({ block, isOpen, onClose, onSave }: BlockEditorModalProps) {
  const [content, setContent] = useState(block?.content || {})
  const [styles, setStyles] = useState(block?.styles || {})
  const [showImageEditor, setShowImageEditor] = useState(false)
  const [activeTab, setActiveTab] = useState('content')

  const handleSave = () => {
    onSave({ content, styles })
    onClose()
  }

  const handleImageEdit = (newSrc: string, alt?: string) => {
    setContent({ ...content, src: newSrc, alt: alt || content.alt })
    setShowImageEditor(false)
  }

  const handleStyleUpdate = (newStyles: any) => {
    setStyles(newStyles)
  }

  if (!block) return null

  if (showImageEditor && block.type === 'image') {
    return (
      <ImageEditor
        src={content.src || ''}
        alt={content.alt || ''}
        onSave={handleImageEdit}
        onCancel={() => setShowImageEditor(false)}
      />
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Edit {block.type} Block</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="design" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Design
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="content" className="h-full overflow-y-auto p-4 space-y-4">
              {block.type === 'text' && (
                <div>
                  <Label>Content</Label>
                  <RichTextEditor
                    content={content.html || content.text || ''}
                    onChange={(html) => setContent({ ...content, html })}
                    placeholder="Enter your text content..."
                    showAdvancedTools={true}
                  />
                </div>
              )}

              {block.type === 'hero' && (
                <>
                  <div>
                    <Label htmlFor="hero-title">Title</Label>
                    <Input
                      id="hero-title"
                      value={content.title || ''}
                      onChange={(e) => setContent({ ...content, title: e.target.value })}
                      placeholder="Enter hero title..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-subtitle">Subtitle</Label>
                    <Input
                      id="hero-subtitle"
                      value={content.subtitle || ''}
                      onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                      placeholder="Enter hero subtitle..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-cta">Button Text</Label>
                    <Input
                      id="hero-cta"
                      value={content.ctaText || ''}
                      onChange={(e) => setContent({ ...content, ctaText: e.target.value })}
                      placeholder="Enter button text..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-link">Button Link</Label>
                    <Input
                      id="hero-link"
                      value={content.ctaLink || ''}
                      onChange={(e) => setContent({ ...content, ctaLink: e.target.value })}
                      placeholder="Enter button link..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-bg">Background Image URL</Label>
                    <Input
                      id="hero-bg"
                      value={content.backgroundImage || ''}
                      onChange={(e) => setContent({ ...content, backgroundImage: e.target.value })}
                      placeholder="Enter image URL..."
                    />
                  </div>
                </>
              )}

              {block.type === 'image' && (
                <>
                  <div>
                    <Label htmlFor="image-src">Image URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="image-src"
                        value={content.src || ''}
                        onChange={(e) => setContent({ ...content, src: e.target.value })}
                        placeholder="Enter image URL..."
                      />
                      <Button
                        variant="outline"
                        onClick={() => setShowImageEditor(true)}
                        disabled={!content.src}
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="image-alt">Alt Text</Label>
                    <Input
                      id="image-alt"
                      value={content.alt || ''}
                      onChange={(e) => setContent({ ...content, alt: e.target.value })}
                      placeholder="Describe the image..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="image-caption">Caption</Label>
                    <Input
                      id="image-caption"
                      value={content.caption || ''}
                      onChange={(e) => setContent({ ...content, caption: e.target.value })}
                      placeholder="Optional image caption..."
                    />
                  </div>
                  {content.src && (
                    <div className="mt-4">
                      <Label>Preview</Label>
                      <img 
                        src={content.src} 
                        alt={content.alt || 'Preview'} 
                        className="w-full max-w-sm h-auto rounded border mt-2"
                      />
                    </div>
                  )}
                </>
              )}

              {block.type === 'cta' && (
                <>
                  <div>
                    <Label htmlFor="cta-title">Title</Label>
                    <Input
                      id="cta-title"
                      value={content.title || ''}
                      onChange={(e) => setContent({ ...content, title: e.target.value })}
                      placeholder="Enter CTA title..."
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <RichTextEditor
                      content={content.description || ''}
                      onChange={(html) => setContent({ ...content, description: html })}
                      placeholder="Enter CTA description..."
                      showAdvancedTools={true}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cta-button">Button Text</Label>
                    <Input
                      id="cta-button"
                      value={content.buttonText || ''}
                      onChange={(e) => setContent({ ...content, buttonText: e.target.value })}
                      placeholder="Enter button text..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="cta-link">Button Link</Label>
                    <Input
                      id="cta-link"
                      value={content.buttonLink || ''}
                      onChange={(e) => setContent({ ...content, buttonLink: e.target.value })}
                      placeholder="Enter button link..."
                    />
                  </div>
                </>
              )}

              {/* Text Alignment for all block types */}
              <div>
                <Label>Text Alignment</Label>
                <Select
                  value={content.alignment || 'left'}
                  onValueChange={(value) => setContent({ ...content, alignment: value })}
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
            </TabsContent>

            <TabsContent value="design" className="h-full overflow-y-auto">
              <LayoutControls
                blockId={block.id}
                currentStyles={styles}
                onStyleUpdate={handleStyleUpdate}
              />
            </TabsContent>

            <TabsContent value="settings" className="p-4 space-y-4">
              <div>
                <Label htmlFor="block-id">Block ID</Label>
                <Input
                  id="block-id"
                  value={block.id}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="block-type">Block Type</Label>
                <Input
                  id="block-type"
                  value={block.type}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

