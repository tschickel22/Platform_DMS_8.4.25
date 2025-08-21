import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, Palette, Layout, Type } from 'lucide-react'
import GoogleMapBlockEditor from './blocks/editors/GoogleMapBlockEditor'
import SocialLinksEditor from './blocks/editors/SocialLinksEditor'
import MultiImageGalleryEditor from './blocks/editors/MultiImageGalleryEditor'
import MultiTextBlockEditor from './blocks/editors/MultiTextBlockEditor'
import { Block } from '../types'
import RichTextEditor from './RichTextEditor'
import ImageEditor from './ImageEditor'
import LayoutControls from './LayoutControls'

interface BlockEditorModalProps {
  block: Block
  onSave: (updates: Partial<Block>) => void
  onClose: () => void
}

export default function BlockEditorModal({ block, onSave, onClose }: BlockEditorModalProps) {
  const [content, setContent] = useState(block.content || {})
  const [activeTab, setActiveTab] = useState('content')

  useEffect(() => {
    setContent(block.content || {})
  }, [block])

  const handleSave = () => {
    onSave({ content })
    onClose()
  }

  const renderContentEditor = () => {
    switch (block.type) {
      case 'hero':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="hero-title">Title</Label>
              <Input
                id="hero-title"
                value={content.title || ''}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                placeholder="Enter hero title"
              />
            </div>
            
            <div>
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Textarea
                id="hero-subtitle"
                value={content.subtitle || ''}
                onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                placeholder="Enter hero subtitle"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="hero-cta">Call to Action Text</Label>
              <Input
                id="hero-cta"
                value={content.ctaText || ''}
                onChange={(e) => setContent({ ...content, ctaText: e.target.value })}
                placeholder="e.g., Browse Inventory"
              />
            </div>
            
            <div>
              <Label htmlFor="hero-cta-link">Call to Action Link</Label>
              <Input
                id="hero-cta-link"
                value={content.ctaLink || ''}
                onChange={(e) => setContent({ ...content, ctaLink: e.target.value })}
                placeholder="e.g., /inventory"
              />
            </div>
            
            <div>
              <Label htmlFor="hero-bg">Background Image URL</Label>
              <Input
                id="hero-bg"
                value={content.backgroundImage || ''}
                onChange={(e) => setContent({ ...content, backgroundImage: e.target.value })}
                placeholder="Enter image URL or upload"
              />
            </div>
          </div>
        )

      case 'text':
        return (
          <div className="space-y-6">
            <div>
              <Label>Text Content</Label>
              <RichTextEditor
                content={content.html || content.text || ''}
                onChange={(html) => setContent({ ...content, html })}
              />
            </div>
            
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
          </div>
        )

      case 'image':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="image-src">Image URL</Label>
              <Input
                id="image-src"
                value={content.src || ''}
                onChange={(e) => setContent({ ...content, src: e.target.value })}
                placeholder="Enter image URL"
              />
            </div>
            
            <div>
              <Label htmlFor="image-alt">Alt Text</Label>
              <Input
                id="image-alt"
                value={content.alt || ''}
                onChange={(e) => setContent({ ...content, alt: e.target.value })}
                placeholder="Describe the image"
              />
            </div>
            
            <div>
              <Label htmlFor="image-caption">Caption</Label>
              <Input
                id="image-caption"
                value={content.caption || ''}
                onChange={(e) => setContent({ ...content, caption: e.target.value })}
                placeholder="Optional image caption"
              />
            </div>
            
            <div>
              <Label>Image Alignment</Label>
              <Select
                value={content.alignment || 'center'}
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
          </div>
        )

      case 'cta':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="cta-title">Title</Label>
              <Input
                id="cta-title"
                value={content.title || ''}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                placeholder="Enter CTA title"
              />
            </div>
            
            <div>
              <Label htmlFor="cta-description">Description</Label>
              <Textarea
                id="cta-description"
                value={content.description || ''}
                onChange={(e) => setContent({ ...content, description: e.target.value })}
                placeholder="Enter CTA description"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="cta-button">Button Text</Label>
              <Input
                id="cta-button"
                value={content.buttonText || ''}
                onChange={(e) => setContent({ ...content, buttonText: e.target.value })}
                placeholder="e.g., Get Started"
              />
            </div>
            
            <div>
              <Label htmlFor="cta-link">Button Link</Label>
              <Input
                id="cta-link"
                value={content.buttonLink || ''}
                onChange={(e) => setContent({ ...content, buttonLink: e.target.value })}
                placeholder="e.g., /contact"
              />
            </div>
          </div>
        )

      case 'google_map':
        return <GoogleMapBlockEditor value={content} onChange={setContent} />
      case 'social_links':
        return <SocialLinksEditor value={content} onChange={setContent} />
      case 'multi_image_gallery':
        return <MultiImageGalleryEditor value={content} onChange={setContent} />
      case 'multi_text':
        return <MultiTextBlockEditor value={content} onChange={setContent} />

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <p>No editor available for block type: {block.type}</p>
          </div>
        )
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            Edit {block.type.charAt(0).toUpperCase() + block.type.slice(1)} Block
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="design" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Design
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Layout
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 overflow-y-auto max-h-[60vh]">
            <TabsContent value="content" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Content Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderContentEditor()}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="design" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Design Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Label>Background Color</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="color"
                          value={content.backgroundColor || '#ffffff'}
                          onChange={(e) => setContent({ ...content, backgroundColor: e.target.value })}
                          className="w-12 h-8 rounded border"
                        />
                        <Input
                          value={content.backgroundColor || '#ffffff'}
                          onChange={(e) => setContent({ ...content, backgroundColor: e.target.value })}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Text Color</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="color"
                          value={content.textColor || '#000000'}
                          onChange={(e) => setContent({ ...content, textColor: e.target.value })}
                          className="w-12 h-8 rounded border"
                        />
                        <Input
                          value={content.textColor || '#000000'}
                          onChange={(e) => setContent({ ...content, textColor: e.target.value })}
                          placeholder="#000000"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Border Radius</Label>
                      <Slider
                        value={[content.borderRadius || 0]}
                        onValueChange={([value]) => setContent({ ...content, borderRadius: value })}
                        max={50}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-sm text-muted-foreground mt-1">
                        {content.borderRadius || 0}px
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="layout" className="mt-0">
              <LayoutControls
                content={content}
                onChange={setContent}
              />
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