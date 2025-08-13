/**
 * Brochure Builder - Block Controls Component
 * 
 * Right-side editor panel for modifying block properties.
 * Shows inputs based on selected block type and emits patch events.
 * Never throws on empty values and provides safe form handling.
 * 
 * Supported Block Types:
 * - Hero: title, subtitle, imageUrl
 * - Gallery: images[], title, columns
 * - Specs: specs{}, title, columns
 * - Price: amount, label, currency, originalPrice
 * - Features: features[], title, columns, showIcons
 * - CTA: headline, buttonText, link, description
 * - Legal: text, title, fontSize
 * 
 * Features:
 * - Type-safe form inputs
 * - Real-time preview updates
 * - Validation and error handling
 * - Undo/redo support ready
 */

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Trash2, 
  Plus, 
  Minus, 
  Image, 
  Link, 
  Type, 
  Hash,
  DollarSign,
  List,
  Settings
} from 'lucide-react'
import { BrochureBlock } from '../../types'

export interface BlockControlsProps {
  /** Currently selected block */
  block: BrochureBlock | null
  /** Callback when block properties change */
  onBlockChange: (blockId: string, changes: Partial<BrochureBlock>) => void
  /** Callback to delete the block */
  onBlockDelete: (blockId: string) => void
  /** Whether controls are disabled */
  disabled?: boolean
}

/**
 * Form field wrapper component
 */
const FormField: React.FC<{
  label: string
  description?: string
  children: React.ReactNode
  icon?: React.ReactNode
}> = ({ label, description, children, icon }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium flex items-center space-x-2">
      {icon}
      <span>{label}</span>
    </Label>
    {children}
    {description && (
      <p className="text-xs text-gray-500">{description}</p>
    )}
  </div>
)

/**
 * Array input component for lists (features, images, etc.)
 */
const ArrayInput: React.FC<{
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  maxItems?: number
}> = ({ value = [], onChange, placeholder = 'Add item', maxItems = 20 }) => {
  const handleItemChange = (index: number, newValue: string) => {
    const newArray = [...value]
    newArray[index] = newValue
    onChange(newArray)
  }

  const handleAddItem = () => {
    if (value.length < maxItems) {
      onChange([...value, ''])
    }
  }

  const handleRemoveItem = (index: number) => {
    const newArray = value.filter((_, i) => i !== index)
    onChange(newArray)
  }

  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={index} className="flex space-x-2">
          <Input
            value={item}
            onChange={(e) => handleItemChange(index, e.target.value)}
            placeholder={`${placeholder} ${index + 1}`}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRemoveItem(index)}
            disabled={value.length <= 1}
          >
            <Minus className="w-4 h-4" />
          </Button>
        </div>
      ))}
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleAddItem}
        disabled={value.length >= maxItems}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Item
      </Button>
    </div>
  )
}

/**
 * Object input component for key-value pairs (specs)
 */
const ObjectInput: React.FC<{
  value: Record<string, any>
  onChange: (value: Record<string, any>) => void
  maxItems?: number
}> = ({ value = {}, onChange, maxItems = 20 }) => {
  const entries = Object.entries(value)

  const handleEntryChange = (index: number, key: string, val: string) => {
    const newEntries = [...entries]
    newEntries[index] = [key, val]
    
    const newObject = Object.fromEntries(newEntries.filter(([k]) => k.trim()))
    onChange(newObject)
  }

  const handleAddEntry = () => {
    if (entries.length < maxItems) {
      const newObject = { ...value, '': '' }
      onChange(newObject)
    }
  }

  const handleRemoveEntry = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index)
    const newObject = Object.fromEntries(newEntries)
    onChange(newObject)
  }

  return (
    <div className="space-y-2">
      {entries.map(([key, val], index) => (
        <div key={index} className="grid grid-cols-5 gap-2">
          <Input
            value={key}
            onChange={(e) => handleEntryChange(index, e.target.value, val)}
            placeholder="Key"
            className="col-span-2"
          />
          <Input
            value={String(val)}
            onChange={(e) => handleEntryChange(index, key, e.target.value)}
            placeholder="Value"
            className="col-span-2"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRemoveEntry(index)}
            disabled={entries.length <= 1}
          >
            <Minus className="w-4 h-4" />
          </Button>
        </div>
      ))}
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleAddEntry}
        disabled={entries.length >= maxItems}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Pair
      </Button>
    </div>
  )
}

/**
 * Block controls component
 */
export const BlockControls: React.FC<BlockControlsProps> = ({
  block,
  onBlockChange,
  onBlockDelete,
  disabled = false,
}) => {
  const [localChanges, setLocalChanges] = useState<Partial<BrochureBlock>>({})

  // Reset local changes when block changes
  useEffect(() => {
    setLocalChanges({})
  }, [block?.id])

  // Handle input changes with debouncing
  const handleChange = (field: string, value: any) => {
    if (!block || disabled) return

    const changes = { ...localChanges, [field]: value }
    setLocalChanges(changes)

    // Debounce the actual update
    const timeoutId = setTimeout(() => {
      onBlockChange(block.id!, changes)
      setLocalChanges({})
    }, 300)

    return () => clearTimeout(timeoutId)
  }

  // Get current value (local changes override block values)
  const getValue = (field: string) => {
    if (field in localChanges) {
      return localChanges[field as keyof BrochureBlock]
    }
    return block?.[field as keyof BrochureBlock]
  }

  if (!block) {
    return (
      <div className="p-6 text-center text-gray-500">
        <Settings className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p className="text-sm">Select a block to edit its properties</p>
      </div>
    )
  }

  return (
    <div className="block-controls space-y-6 p-4">
      {/* Block header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-sm">
            {block.type.charAt(0).toUpperCase() + block.type.slice(1)} Block
          </h3>
          <Badge variant="outline" className="text-xs mt-1">
            {block.type}
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBlockDelete(block.id!)}
          disabled={disabled}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <Separator />

      {/* Block-specific controls */}
      <div className="space-y-4">
        {/* Hero Block Controls */}
        {block.type === 'hero' && (
          <>
            <FormField label="Title" icon={<Type className="w-4 h-4" />}>
              <Input
                value={getValue('title') || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter hero title"
                disabled={disabled}
              />
            </FormField>

            <FormField label="Subtitle">
              <Textarea
                value={getValue('subtitle') || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter supporting text"
                disabled={disabled}
                rows={2}
              />
            </FormField>

            <FormField 
              label="Background Image" 
              icon={<Image className="w-4 h-4" />}
              description="URL to background image"
            >
              <Input
                value={getValue('imageUrl') || ''}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
                disabled={disabled}
              />
            </FormField>
          </>
        )}

        {/* Gallery Block Controls */}
        {block.type === 'gallery' && (
          <>
            <FormField label="Gallery Title" icon={<Type className="w-4 h-4" />}>
              <Input
                value={getValue('title') || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Photo Gallery"
                disabled={disabled}
              />
            </FormField>

            <FormField 
              label="Images" 
              icon={<Image className="w-4 h-4" />}
              description="Add image URLs"
            >
              <ArrayInput
                value={getValue('images') || []}
                onChange={(value) => handleChange('images', value)}
                placeholder="https://example.com/image.jpg"
                maxItems={12}
              />
            </FormField>

            <FormField label="Columns" icon={<Hash className="w-4 h-4" />}>
              <Select
                value={String(getValue('columns') || 3)}
                onValueChange={(value) => handleChange('columns', parseInt(value))}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                  <SelectItem value="4">4 Columns</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </>
        )}

        {/* Specs Block Controls */}
        {block.type === 'specs' && (
          <>
            <FormField label="Section Title" icon={<Type className="w-4 h-4" />}>
              <Input
                value={getValue('title') || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Specifications"
                disabled={disabled}
              />
            </FormField>

            <FormField 
              label="Specifications" 
              icon={<List className="w-4 h-4" />}
              description="Add key-value specification pairs"
            >
              <ObjectInput
                value={getValue('specs') || {}}
                onChange={(value) => handleChange('specs', value)}
                maxItems={15}
              />
            </FormField>

            <FormField label="Columns" icon={<Hash className="w-4 h-4" />}>
              <Select
                value={String(getValue('columns') || 2)}
                onValueChange={(value) => handleChange('columns', parseInt(value))}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Column</SelectItem>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </>
        )}

        {/* Price Block Controls */}
        {block.type === 'price' && (
          <>
            <FormField label="Price Label" icon={<Type className="w-4 h-4" />}>
              <Input
                value={getValue('label') || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                placeholder="Starting Price"
                disabled={disabled}
              />
            </FormField>

            <FormField label="Amount" icon={<DollarSign className="w-4 h-4" />}>
              <Input
                type="number"
                value={getValue('amount') || ''}
                onChange={(e) => handleChange('amount', parseFloat(e.target.value) || null)}
                placeholder="45000"
                disabled={disabled}
              />
            </FormField>

            <FormField label="Original Price" description="For showing savings">
              <Input
                type="number"
                value={getValue('originalPrice') || ''}
                onChange={(e) => handleChange('originalPrice', parseFloat(e.target.value) || null)}
                placeholder="52000"
                disabled={disabled}
              />
            </FormField>

            <FormField label="Currency">
              <Select
                value={getValue('currency') || 'USD'}
                onValueChange={(value) => handleChange('currency', value)}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="CAD">CAD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Show Cents">
              <Switch
                checked={getValue('showCents') || false}
                onCheckedChange={(checked) => handleChange('showCents', checked)}
                disabled={disabled}
              />
            </FormField>
          </>
        )}

        {/* Features Block Controls */}
        {block.type === 'features' && (
          <>
            <FormField label="Section Title" icon={<Type className="w-4 h-4" />}>
              <Input
                value={getValue('title') || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Key Features"
                disabled={disabled}
              />
            </FormField>

            <FormField 
              label="Features" 
              icon={<List className="w-4 h-4" />}
              description="Add feature descriptions"
            >
              <ArrayInput
                value={getValue('features') || []}
                onChange={(value) => handleChange('features', value)}
                placeholder="Feature description"
                maxItems={15}
              />
            </FormField>

            <FormField label="Columns" icon={<Hash className="w-4 h-4" />}>
              <Select
                value={String(getValue('columns') || 2)}
                onValueChange={(value) => handleChange('columns', parseInt(value))}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Column</SelectItem>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Show Icons">
              <Switch
                checked={getValue('showIcons') !== false}
                onCheckedChange={(checked) => handleChange('showIcons', checked)}
                disabled={disabled}
              />
            </FormField>
          </>
        )}

        {/* CTA Block Controls */}
        {block.type === 'cta' && (
          <>
            <FormField label="Headline" icon={<Type className="w-4 h-4" />}>
              <Input
                value={getValue('headline') || ''}
                onChange={(e) => handleChange('headline', e.target.value)}
                placeholder="Ready to Get Started?"
                disabled={disabled}
              />
            </FormField>

            <FormField label="Button Text">
              <Input
                value={getValue('buttonText') || ''}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                placeholder="Contact Us Today"
                disabled={disabled}
              />
            </FormField>

            <FormField 
              label="Link" 
              icon={<Link className="w-4 h-4" />}
              description="URL, phone (tel:), email (mailto:), or SMS (sms:)"
            >
              <Input
                value={getValue('link') || ''}
                onChange={(e) => handleChange('link', e.target.value)}
                placeholder="https://example.com or tel:+1-555-123-4567"
                disabled={disabled}
              />
            </FormField>

            <FormField label="Description">
              <Textarea
                value={getValue('description') || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Supporting text for the call-to-action"
                disabled={disabled}
                rows={2}
              />
            </FormField>
          </>
        )}

        {/* Legal Block Controls */}
        {block.type === 'legal' && (
          <>
            <FormField label="Section Title" icon={<Type className="w-4 h-4" />}>
              <Input
                value={getValue('title') || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Legal Information"
                disabled={disabled}
              />
            </FormField>

            <FormField 
              label="Legal Text" 
              description="Disclaimers, terms, and legal information"
            >
              <Textarea
                value={getValue('text') || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                placeholder="Enter legal text, disclaimers, or terms..."
                disabled={disabled}
                rows={6}
              />
            </FormField>

            <FormField label="Font Size">
              <Select
                value={getValue('fontSize') || 'xs'}
                onValueChange={(value) => handleChange('fontSize', value)}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xs">Extra Small</SelectItem>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="base">Normal</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </>
        )}
      </div>
    </div>
  )
}

export default BlockControls