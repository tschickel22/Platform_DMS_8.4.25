import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Block } from '../types'
import { ImagePickerButton } from './ImagePickerButton'

interface BlockInspectorProps {
  block: Block
  onChange: (updates: Partial<Block>) => void
  onPickImage?: (url: string) => void
}

export default function BlockInspector({ block, onChange, onPickImage }: BlockInspectorProps) {
  // Detect the bag key: props or data
  const bagKey = 'props' in block ? 'props' : ('data' in block ? 'data' : null)
  const bag = bagKey ? (block as any)[bagKey] : {}

  const updateField = (field: string, value: any) => {
    if (!bagKey) return
    
    const updatedBag = { ...bag, [field]: value }
    onChange({ [bagKey]: updatedBag })
  }

  const handleImagePick = (field: string) => (url: string) => {
    updateField(field, url)
    if (onPickImage) {
      onPickImage(url)
    }
  }

  // Basic URL validation
  const isValidUrl = (url: string): boolean => {
    if (!url) return true // Empty is valid
    try {
      // Allow relative URLs starting with /
      if (url.startsWith('/')) return true
      // Allow absolute URLs
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  if (!bagKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Block Inspector</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No editable properties found for this block type.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Block Inspector</CardTitle>
        <p className="text-xs text-muted-foreground">
          Block Type: {block.type}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Title field */}
        {('title' in bag) && (
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs">Title</Label>
            <Input
              id="title"
              value={bag.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Enter title"
              className="text-sm"
            />
          </div>
        )}

        {/* Subtitle field */}
        {('subtitle' in bag) && (
          <div className="space-y-2">
            <Label htmlFor="subtitle" className="text-xs">Subtitle</Label>
            <Input
              id="subtitle"
              value={bag.subtitle || ''}
              onChange={(e) => updateField('subtitle', e.target.value)}
              placeholder="Enter subtitle"
              className="text-sm"
            />
          </div>
        )}

        {/* Text field */}
        {('text' in bag) && (
          <div className="space-y-2">
            <Label htmlFor="text" className="text-xs">Text</Label>
            <Textarea
              id="text"
              value={bag.text || ''}
              onChange={(e) => updateField('text', e.target.value)}
              placeholder="Enter text"
              className="text-sm min-h-[80px]"
            />
          </div>
        )}

        {/* HTML field */}
        {('html' in bag) && (
          <div className="space-y-2">
            <Label htmlFor="html" className="text-xs">HTML Content</Label>
            <Textarea
              id="html"
              value={bag.html || ''}
              onChange={(e) => updateField('html', e.target.value)}
              placeholder="Enter HTML content"
              className="text-sm min-h-[120px] font-mono"
            />
          </div>
        )}

        {/* Label field */}
        {('label' in bag) && (
          <div className="space-y-2">
            <Label htmlFor="label" className="text-xs">Label</Label>
            <Input
              id="label"
              value={bag.label || ''}
              onChange={(e) => updateField('label', e.target.value)}
              placeholder="Enter label"
              className="text-sm"
            />
          </div>
        )}

        {/* Button Text field */}
        {('buttonText' in bag) && (
          <div className="space-y-2">
            <Label htmlFor="buttonText" className="text-xs">Button Text</Label>
            <Input
              id="buttonText"
              value={bag.buttonText || ''}
              onChange={(e) => updateField('buttonText', e.target.value)}
              placeholder="Enter button text"
              className="text-sm"
            />
          </div>
        )}

        {/* CTA Text field */}
        {('ctaText' in bag) && (
          <div className="space-y-2">
            <Label htmlFor="ctaText" className="text-xs">CTA Text</Label>
            <Input
              id="ctaText"
              value={bag.ctaText || ''}
              onChange={(e) => updateField('ctaText', e.target.value)}
              placeholder="Enter call-to-action text"
              className="text-sm"
            />
          </div>
        )}

        {/* Link/Href field */}
        {('href' in bag || 'link' in bag || 'ctaLink' in bag || 'buttonLink' in bag) && (
          <div className="space-y-2">
            <Label htmlFor="href" className="text-xs">Link URL</Label>
            <Input
              id="href"
              value={bag.href || bag.link || bag.ctaLink || bag.buttonLink || ''}
              onChange={(e) => {
                const value = e.target.value
                // Update the appropriate field based on what exists
                if ('href' in bag) updateField('href', value)
                else if ('link' in bag) updateField('link', value)
                else if ('ctaLink' in bag) updateField('ctaLink', value)
                else if ('buttonLink' in bag) updateField('buttonLink', value)
              }}
              placeholder="Enter URL (e.g., /page or https://example.com)"
              className={`text-sm ${
                !isValidUrl(bag.href || bag.link || bag.ctaLink || bag.buttonLink || '') 
                  ? 'border-red-300 focus:border-red-500' 
                  : ''
              }`}
            />
            {!isValidUrl(bag.href || bag.link || bag.ctaLink || bag.buttonLink || '') && (
              <p className="text-xs text-red-600">Please enter a valid URL</p>
            )}
          </div>
        )}

        {/* Open in New Tab */}
        {('openInNewTab' in bag) && (
          <div className="flex items-center space-x-2">
            <Switch
              id="openInNewTab"
              checked={bag.openInNewTab || false}
              onCheckedChange={(checked) => updateField('openInNewTab', checked)}
            />
            <Label htmlFor="openInNewTab" className="text-xs">Open in new tab</Label>
          </div>
        )}

        {/* Image URL field */}
        {('imageUrl' in bag || 'src' in bag || 'backgroundImage' in bag) && (
          <div className="space-y-2">
            <Label className="text-xs">Image</Label>
            {(bag.imageUrl || bag.src || bag.backgroundImage) && (
              <div className="relative">
                <img
                  src={bag.imageUrl || bag.src || bag.backgroundImage}
                  alt="Preview"
                  className="w-full h-24 object-cover rounded border"
                />
              </div>
            )}
            <ImagePickerButton
              onImageSelect={handleImagePick('imageUrl' in bag ? 'imageUrl' : 'src' in bag ? 'src' : 'backgroundImage')}
              buttonText="Choose Image"
              variant="outline"
              size="sm"
            />
          </div>
        )}

        {/* Alignment field */}
        {('alignment' in bag) && (
          <div className="space-y-2">
            <Label htmlFor="alignment" className="text-xs">Alignment</Label>
            <Select
              value={bag.alignment || 'left'}
              onValueChange={(value) => updateField('alignment', value)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Variant field */}
        {('variant' in bag) && (
          <div className="space-y-2">
            <Label htmlFor="variant" className="text-xs">Variant</Label>
            <Select
              value={bag.variant || 'default'}
              onValueChange={(value) => updateField('variant', value)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Description field */}
        {('description' in bag) && (
          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs">Description</Label>
            <Textarea
              id="description"
              value={bag.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Enter description"
              className="text-sm min-h-[60px]"
            />
          </div>
        )}

        {/* Alt text for images */}
        {('alt' in bag) && (
          <div className="space-y-2">
            <Label htmlFor="alt" className="text-xs">Alt Text</Label>
            <Input
              id="alt"
              value={bag.alt || ''}
              onChange={(e) => updateField('alt', e.target.value)}
              placeholder="Describe the image"
              className="text-sm"
            />
          </div>
        )}

        {/* Caption field */}
        {('caption' in bag) && (
          <div className="space-y-2">
            <Label htmlFor="caption" className="text-xs">Caption</Label>
            <Input
              id="caption"
              value={bag.caption || ''}
              onChange={(e) => updateField('caption', e.target.value)}
              placeholder="Enter caption"
              className="text-sm"
            />
          </div>
        )}

        {/* Show/Hide toggle */}
        {('visible' in bag || 'hidden' in bag) && (
          <div className="flex items-center space-x-2">
            <Switch
              id="visible"
              checked={bag.visible !== false && bag.hidden !== true}
              onCheckedChange={(checked) => {
                if ('visible' in bag) updateField('visible', checked)
                if ('hidden' in bag) updateField('hidden', !checked)
              }}
            />
            <Label htmlFor="visible" className="text-xs">Visible</Label>
          </div>
        )}

        {/* Generic boolean fields */}
        {Object.entries(bag).map(([key, value]) => {
          if (typeof value === 'boolean' && !['openInNewTab', 'visible', 'hidden'].includes(key)) {
            return (
              <div key={key} className="flex items-center space-x-2">
                <Switch
                  id={key}
                  checked={value}
                  onCheckedChange={(checked) => updateField(key, checked)}
                />
                <Label htmlFor={key} className="text-xs capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
              </div>
            )
          }
          return null
        })}

        {/* Generic number fields */}
        {Object.entries(bag).map(([key, value]) => {
          if (typeof value === 'number' && !['order'].includes(key)) {
            return (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="text-xs capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                <Input
                  id={key}
                  type="number"
                  value={value}
                  onChange={(e) => updateField(key, parseFloat(e.target.value) || 0)}
                  className="text-sm"
                />
              </div>
            )
          }
          return null
        })}
      </CardContent>
    </Card>
  )
}