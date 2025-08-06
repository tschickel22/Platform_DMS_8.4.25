import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { X, Plus } from 'lucide-react'

interface Tag {
  id: string
  name: string
  color: string
  category?: string
}

interface TagSelectorProps {
  selectedTags?: Tag[]
  availableTags?: Tag[]
  onTagsChange?: (tags: Tag[]) => void
  placeholder?: string
  maxTags?: number
}

export function TagSelector({
  selectedTags = [],
  availableTags = [],
  onTagsChange,
  placeholder = "Search or create tags...",
  maxTags
}: TagSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const filteredTags = availableTags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedTags.some(selected => selected.id === tag.id)
  )

  const handleAddTag = (tag: Tag) => {
    if (maxTags && selectedTags.length >= maxTags) return
    const newTags = [...selectedTags, tag]
    onTagsChange?.(newTags)
    setSearchTerm('')
  }

  const handleRemoveTag = (tagId: string) => {
    const newTags = selectedTags.filter(tag => tag.id !== tagId)
    onTagsChange?.(newTags)
  }

  const handleCreateTag = () => {
    if (!searchTerm.trim()) return
    
    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name: searchTerm.trim(),
      color: '#3b82f6'
    }
    
    handleAddTag(newTag)
    setIsCreating(false)
  }

  const canCreateTag = searchTerm.trim() && 
    !availableTags.some(tag => tag.name.toLowerCase() === searchTerm.toLowerCase()) &&
    (!maxTags || selectedTags.length < maxTags)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tags</CardTitle>
        <CardDescription>
          Select or create tags to organize your content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="flex items-center gap-1"
                style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
              >
                {tag.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemoveTag(tag.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* Search Input */}
        <div className="space-y-2">
          <Input
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={maxTags ? selectedTags.length >= maxTags : false}
          />
          
          {/* Create New Tag Button */}
          {canCreateTag && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateTag}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create "{searchTerm}"
            </Button>
          )}
        </div>

        {/* Available Tags */}
        {filteredTags.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Available tags:</p>
            <div className="flex flex-wrap gap-2">
              {filteredTags.slice(0, 10).map((tag) => (
                <Button
                  key={tag.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddTag(tag)}
                  className="h-8"
                  disabled={maxTags ? selectedTags.length >= maxTags : false}
                >
                  {tag.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Max Tags Warning */}
        {maxTags && selectedTags.length >= maxTags && (
          <p className="text-sm text-muted-foreground">
            Maximum of {maxTags} tags allowed
          </p>
        )}
      </CardContent>
    </Card>
  )
}