import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface BlockControlsProps {
  block: any
  onUpdate: (config: any) => void
}

export function BlockControls({ block, onUpdate }: BlockControlsProps) {
  if (!block) return null

  const updateConfig = (key: string, value: any) => {
    onUpdate({
      ...block.config,
      [key]: value
    })
  }

  const renderControls = () => {
    switch (block.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={block.config.title || ''}
                onChange={(e) => updateConfig('title', e.target.value)}
                placeholder="Hero title"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={block.config.subtitle || ''}
                onChange={(e) => updateConfig('subtitle', e.target.value)}
                placeholder="Hero subtitle"
              />
            </div>
            <div>
              <Label>Background Image URL</Label>
              <Input
                value={block.config.backgroundImage || ''}
                onChange={(e) => updateConfig('backgroundImage', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        )

      case 'gallery':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input
                value={block.config.title || ''}
                onChange={(e) => updateConfig('title', e.target.value)}
                placeholder="Gallery title"
              />
            </div>
            <div>
              <Label>Layout</Label>
              <Select 
                value={block.config.layout || 'grid'} 
                onValueChange={(value) => updateConfig('layout', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={block.config.showPrices || false}
                onCheckedChange={(checked) => updateConfig('showPrices', checked)}
              />
              <Label>Show Prices</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={block.config.showSpecs || false}
                onCheckedChange={(checked) => updateConfig('showSpecs', checked)}
              />
              <Label>Show Specifications</Label>
            </div>
          </div>
        )

      case 'features':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input
                value={block.config.title || ''}
                onChange={(e) => updateConfig('title', e.target.value)}
                placeholder="Features title"
              />
            </div>
            <div>
              <Label>Features (one per line)</Label>
              <Textarea
                value={(block.config.features || []).join('\n')}
                onChange={(e) => updateConfig('features', e.target.value.split('\n').filter(Boolean))}
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                rows={6}
              />
            </div>
          </div>
        )

      case 'cta':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={block.config.title || ''}
                onChange={(e) => updateConfig('title', e.target.value)}
                placeholder="CTA title"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={block.config.subtitle || ''}
                onChange={(e) => updateConfig('subtitle', e.target.value)}
                placeholder="CTA subtitle"
              />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input
                value={block.config.buttonText || ''}
                onChange={(e) => updateConfig('buttonText', e.target.value)}
                placeholder="Contact Us"
              />
            </div>
            <div>
              <Label>Button URL</Label>
              <Input
                value={block.config.buttonUrl || ''}
                onChange={(e) => updateConfig('buttonUrl', e.target.value)}
                placeholder="https://example.com/contact"
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <p>No settings available for this block type</p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium capitalize">{block.type} Block</h4>
      </div>
      {renderControls()}
    </div>
  )
}