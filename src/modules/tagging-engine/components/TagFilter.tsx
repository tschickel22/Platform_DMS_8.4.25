import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Filter, X, Plus, Minus } from 'lucide-react'
import { Tag, TagFilter as TagFilterType, TagType } from '../types'
import { useTagging } from '../hooks/useTagging'
import { cn } from '@/lib/utils'

interface TagFilterProps {
  entityType: TagType
  filters: TagFilterType[]
  onFiltersChange: (filters: TagFilterType[]) => void
  onApply?: () => void
  className?: string
}

export function TagFilter({
  entityType,
  filters,
  onFiltersChange,
  onApply,
  className
}: TagFilterProps) {
  const { getTagsByType } = useTagging()
  const [isExpanded, setIsExpanded] = useState(false)
  
  const availableTags = getTagsByType(entityType)

  const addFilter = () => {
    const newFilter: TagFilterType = {
      tagIds: [],
      operator: 'OR',
      exclude: false
    }
    onFiltersChange([...filters, newFilter])
  }

  const removeFilter = (index: number) => {
    const updatedFilters = filters.filter((_, i) => i !== index)
    onFiltersChange(updatedFilters)
  }

  const updateFilter = (index: number, updates: Partial<TagFilterType>) => {
    const updatedFilters = filters.map((filter, i) =>
      i === index ? { ...filter, ...updates } : filter
    )
    onFiltersChange(updatedFilters)
  }

  const toggleTagInFilter = (filterIndex: number, tagId: string) => {
    const filter = filters[filterIndex]
    const tagIds = filter.tagIds.includes(tagId)
      ? filter.tagIds.filter(id => id !== tagId)
      : [...filter.tagIds, tagId]
    
    updateFilter(filterIndex, { tagIds })
  }

  const clearAllFilters = () => {
    onFiltersChange([])
  }

  const hasActiveFilters = filters.length > 0 && filters.some(f => f.tagIds.length > 0)

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Tag Filters</span>
          {hasActiveFilters && (
            <Badge variant="secondary">
              {filters.reduce((sum, f) => sum + f.tagIds.length, 0)} tags
            </Badge>
          )}
        </div>
        <div className="flex space-x-2">
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && !isExpanded && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter, filterIndex) =>
            filter.tagIds.map(tagId => {
              const tag = availableTags.find(t => t.id === tagId)
              if (!tag) return null
              
              return (
                <Badge
                  key={`${filterIndex}-${tagId}`}
                  style={{ backgroundColor: tag.color, color: 'white' }}
                  className="flex items-center space-x-1 pr-1"
                >
                  {filter.exclude && <span className="text-xs">NOT</span>}
                  <span>{tag.name}</span>
                  <button
                    type="button"
                    onClick={() => toggleTagInFilter(filterIndex, tagId)}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )
            })
          )}
        </div>
      )}

      {/* Expanded Filter Interface */}
      {isExpanded && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Configure Tag Filters</CardTitle>
            <CardDescription>
              Filter entities by their assigned tags
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {filters.map((filter, filterIndex) => (
              <div key={filterIndex} className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Label>Filter {filterIndex + 1}</Label>
                    <Select
                      value={filter.operator}
                      onValueChange={(value: 'AND' | 'OR') => updateFilter(filterIndex, { operator: value })}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">AND</SelectItem>
                        <SelectItem value="OR">OR</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`exclude-${filterIndex}`}
                        checked={filter.exclude}
                        onCheckedChange={(checked) => updateFilter(filterIndex, { exclude: !!checked })}
                      />
                      <Label htmlFor={`exclude-${filterIndex}`} className="text-sm">
                        Exclude
                      </Label>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFilter(filterIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Select Tags</Label>
                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 max-h-40 overflow-y-auto">
                    {availableTags.map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${filterIndex}-${tag.id}`}
                          checked={filter.tagIds.includes(tag.id)}
                          onCheckedChange={() => toggleTagInFilter(filterIndex, tag.id)}
                        />
                        <Label 
                          htmlFor={`tag-${filterIndex}-${tag.id}`}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: tag.color }}
                          />
                          <span className="text-sm">{tag.name}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {filter.tagIds.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {filter.tagIds.map(tagId => {
                      const tag = availableTags.find(t => t.id === tagId)
                      if (!tag) return null
                      
                      return (
                        <Badge
                          key={tagId}
                          style={{ backgroundColor: tag.color, color: 'white' }}
                          className="text-xs"
                        >
                          {tag.name}
                        </Badge>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-between">
              <Button variant="outline" onClick={addFilter}>
                <Plus className="h-4 w-4 mr-2" />
                Add Filter Group
              </Button>
              {onApply && (
                <Button onClick={onApply}>
                  Apply Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}