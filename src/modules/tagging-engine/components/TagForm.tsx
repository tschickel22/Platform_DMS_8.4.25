import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Save, Palette } from 'lucide-react'
import { Tag, TagType, TagCategory } from '../types'
import { useToast } from '@/hooks/use-toast'

interface TagFormProps {
  tag?: Tag | null
  onSave: (tagData: Partial<Tag>) => Promise<void>
  onCancel: () => void
}

const predefinedColors = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', 
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
]

export function TagForm({ tag, onSave, onCancel }: TagFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    category: TagCategory.CUSTOM,
    type: [] as TagType[],
    isActive: true
  })

  useEffect(() => {
    if (tag) {
      setFormData({
        name: tag.name,
        description: tag.description || '',
        color: tag.color,
        category: tag.category,
        type: [...tag.type],
        isActive: tag.isActive
      })
    }
  }, [tag])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Tag name is required',
        variant: 'destructive'
      })
      return
    }

    if (formData.type.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'At least one tag type must be selected',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
      toast({
        title: 'Success',
        description: `Tag ${tag ? 'updated' : 'created'} successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${tag ? 'update' : 'create'} tag`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTypeToggle = (type: TagType, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        type: [...prev.type, type]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        type: prev.type.filter(t => t !== type)
      }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{tag ? 'Edit Tag' : 'Create Tag'}</CardTitle>
              <CardDescription>
                {tag ? 'Update tag details' : 'Create a new tag for organizing entities'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Tag Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter tag name"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this tag represents"
                  rows={3}
                />
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-4">
              <Label>Tag Color</Label>
              <div className="flex items-center space-x-4">
                <div className="flex flex-wrap gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color ? 'border-gray-400' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                    />
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-16 h-8 p-1 border rounded"
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: TagCategory) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TagCategory.STATUS}>Status</SelectItem>
                  <SelectItem value={TagCategory.PRIORITY}>Priority</SelectItem>
                  <SelectItem value={TagCategory.SOURCE}>Source</SelectItem>
                  <SelectItem value={TagCategory.BEHAVIOR}>Behavior</SelectItem>
                  <SelectItem value={TagCategory.DEMOGRAPHIC}>Demographic</SelectItem>
                  <SelectItem value={TagCategory.PRODUCT}>Product</SelectItem>
                  <SelectItem value={TagCategory.LOCATION}>Location</SelectItem>
                  <SelectItem value={TagCategory.CUSTOM}>Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tag Types */}
            <div className="space-y-4">
              <Label>Applies To *</Label>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="type-lead"
                    checked={formData.type.includes(TagType.LEAD)}
                    onCheckedChange={(checked) => handleTypeToggle(TagType.LEAD, !!checked)}
                  />
                  <Label htmlFor="type-lead">Leads</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="type-deal"
                    checked={formData.type.includes(TagType.DEAL)}
                    onCheckedChange={(checked) => handleTypeToggle(TagType.DEAL, !!checked)}
                  />
                  <Label htmlFor="type-deal">Deals</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="type-client"
                    checked={formData.type.includes(TagType.CLIENT)}
                    onCheckedChange={(checked) => handleTypeToggle(TagType.CLIENT, !!checked)}
                  />
                  <Label htmlFor="type-client">Clients</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="type-inventory"
                    checked={formData.type.includes(TagType.INVENTORY)}
                    onCheckedChange={(checked) => handleTypeToggle(TagType.INVENTORY, !!checked)}
                  />
                  <Label htmlFor="type-inventory">Inventory</Label>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
              />
              <Label htmlFor="isActive">Active tag</Label>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: formData.color }}
                  />
                  <span className="font-medium">{formData.name || 'Tag Name'}</span>
                  {formData.type.map(type => (
                    <span key={type} className="text-xs bg-white/50 px-2 py-1 rounded">
                      {type}
                    </span>
                  ))}
                </div>
                {formData.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {formData.description}
                  </p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {tag ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {tag ? 'Update' : 'Create'} Tag
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}