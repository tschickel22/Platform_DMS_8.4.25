import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ImagePickerButton } from './ImagePickerButton'
import { Block } from '../types'

interface BlockInspectorProps {
  block: Block
  onChange: (updates: Partial<Block>) => void
  onPickImage?: (url: string) => void
}

export default function BlockInspector({ block, onChange, onPickImage }: BlockInspectorProps) {
  // Detect the bag key: props or data
  const bagKey = 'props' in block ? 'props' : ('data' in block ? 'data' : null)
  const bag = bagKey ? (block as any)[bagKey] : {}

  const updateBag = (updates: Record<string, any>) => {
    if (!bagKey) return
    onChange({
      [bagKey]: { ...bag, ...updates }
    })
  }

  const handleImagePick = (field: string) => (url: string) => {
    updateBag({ [field]: url })
    onPickImage?.(url)
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

  const renderField = (key: string, value: any) => {
    const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')

    switch (key) {
      case 'title':
      case 'subtitle':
      case 'label':
      case 'text':
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <Input
              id={key}
              value={value || ''}
              onChange={(e) => updateBag({ [key]: e.target.value })}
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          </div>
        )

      case 'html':
      case 'description':
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <Textarea
              id={key}
              value={value || ''}
              onChange={(e) => updateBag({ [key]: e.target.value })}
              placeholder={`Enter ${label.toLowerCase()}`}
              rows={4}
            />
          </div>
        )

      case 'href':
      case 'ctaLink':
      case 'buttonLink':
        const isValid = isValidUrl(value || '')
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <Input
              id={key}
              value={value || ''}
              onChange={(e) => updateBag({ [key]: e.target.value })}
              placeholder="https://example.com or /page"
              className={!isValid ? 'border-red-500' : ''}
            />
            {!isValid && (
              <p className="text-xs text-red-500">Please enter a valid URL</p>
            )}
          </div>
        )

      case 'imageUrl':
      case 'backgroundImage':
      case 'src':
        return (
          <div key={key} className="space-y-2">
            <Label>{label}</Label>
            {value && (
              <div className="relative">
                <img 
                  src={value} 
                  alt="Preview" 
                  className="w-full h-24 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
            <ImagePickerButton onImageSelect={handleImagePick(key)}>
              {value ? 'Change Image' : 'Choose Image'}
            </ImagePickerButton>
            <Input
              value={value || ''}
              onChange={(e) => updateBag({ [key]: e.target.value })}
              placeholder="Image URL"
              className="text-xs"
            />
          </div>
        )

      case 'openInNewTab':
        return (
          <div key={key} className="flex items-center justify-between">
            <Label htmlFor={key}>{label}</Label>
            <Switch
              id={key}
              checked={!!value}
              onCheckedChange={(checked) => updateBag({ [key]: checked })}
            />
          </div>
        )

      case 'alignment':
        return (
          <div key={key} className="space-y-2">
            <Label>{label}</Label>
            <Select value={value || 'left'} onValueChange={(val) => updateBag({ [key]: val })}>
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
        )

      case 'variant':
        return (
          <div key={key} className="space-y-2">
            <Label>{label}</Label>
            <Select value={value || 'default'} onValueChange={(val) => updateBag({ [key]: val })}>
              <SelectTrigger>
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
        )

      default:
        // Handle other string/number fields
        if (typeof value === 'string' || typeof value === 'number') {
          return (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                value={value || ''}
                onChange={(e) => updateBag({ [key]: e.target.value })}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          )
        }
        return null
    }
  }

  if (!bagKey || !bag) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Block Inspector</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No editable properties found for this block.
          </p>
        </CardContent>
      </Card>
    )
  }

  const editableFields = Object.entries(bag).filter(([key, value]) => {
    // Only show editable field types
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Block Inspector</CardTitle>
        <p className="text-xs text-muted-foreground">
          {block.type} block
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {editableFields.length > 0 ? (
          editableFields.map(([key, value]) => renderField(key, value))
        ) : (
          <p className="text-sm text-muted-foreground">
            No editable properties available.
          </p>
        )}
      </CardContent>
    </Card>
  )
}