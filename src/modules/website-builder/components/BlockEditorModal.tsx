import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Block } from '../types'
import RichTextEditor from './RichTextEditor'

interface BlockEditorModalProps {
  block: Block | null
  isOpen: boolean
  onClose: () => void
  onSave: (content: any) => void
}

export function BlockEditorModal({ block, isOpen, onClose, onSave }: BlockEditorModalProps) {
  const [content, setContent] = useState<any>({})

  useEffect(() => {
    if (block) {
      setContent(block.content || {})
    }
  }, [block])

  const handleSave = () => {
    onSave(content)
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
                value={content.title || ''}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                placeholder="Enter hero title"
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={content.subtitle || ''}
                onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                placeholder="Enter hero subtitle"
              />
            </div>
            <div>
              <Label htmlFor="ctaText">Button Text</Label>
              <Input
                id="ctaText"
                value={content.ctaText || ''}
                onChange={(e) => setContent({ ...content, ctaText: e.target.value })}
                placeholder="Enter button text"
              />
            </div>
            <div>
              <Label htmlFor="ctaLink">Button Link</Label>
              <Input
                id="ctaLink"
                value={content.ctaLink || ''}
                onChange={(e) => setContent({ ...content, ctaLink: e.target.value })}
                placeholder="Enter button link URL"
              />
            </div>
            <div>
              <Label htmlFor="backgroundImage">Background Image URL</Label>
              <Input
                id="backgroundImage"
                value={content.backgroundImage || ''}
                onChange={(e) => setContent({ ...content, backgroundImage: e.target.value })}
                placeholder="Enter background image URL"
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
                content={content.html || content.text || ''}
                onChange={(html) => setContent({
                  ...content,
                  html,
                  text: html
                })}
                placeholder="Enter your text content..."
              />
            </div>
            <div>
              <Label htmlFor="alignment">Text Alignment</Label>
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
          <div className="space-y-4">
            <div>
              <Label htmlFor="src">Image URL</Label>
              <Input
                id="src"
                value={content.src || ''}
                onChange={(e) => setContent({ ...content, src: e.target.value })}
                placeholder="Enter image URL"
              />
            </div>
            <div>
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                value={content.alt || ''}
                onChange={(e) => setContent({ ...content, alt: e.target.value })}
                placeholder="Enter alt text for accessibility"
              />
            </div>
            <div>
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                value={content.caption || ''}
                onChange={(e) => setContent({ ...content, caption: e.target.value })}
                placeholder="Enter image caption (optional)"
              />
            </div>
            <div>
              <Label htmlFor="alignment">Alignment</Label>
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
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={content.title || ''}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                placeholder="Enter CTA title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <RichTextEditor
                content={content.description || ''}
                onChange={(html) => setContent({ ...content, description: html })}
                placeholder="Enter CTA description..."
              />
            </div>
            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={content.buttonText || ''}
                onChange={(e) => setContent({ ...content, buttonText: e.target.value })}
                placeholder="Enter button text"
              />
            </div>
            <div>
              <Label htmlFor="buttonLink">Button Link</Label>
              <Input
                id="buttonLink"
                value={content.buttonLink || ''}
                onChange={(e) => setContent({ ...content, buttonLink: e.target.value })}
                placeholder="Enter button link URL"
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <p>No editor available for block type: {block.type}</p>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {block.type} Block</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {renderEditor()}
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
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

export default BlockEditorModal