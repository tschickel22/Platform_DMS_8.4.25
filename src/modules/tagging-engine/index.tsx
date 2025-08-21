import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tag, Plus, X } from 'lucide-react'

export default function TaggingEngine() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tag Manager</h1>
        <p className="text-muted-foreground">
          Organize and manage tags across your system
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              Create New Tag
            </CardTitle>
            <CardDescription>
              Add new tags to organize your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Tag
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tag Analytics</CardTitle>
            <CardDescription>
              View tag usage and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Tag className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm">No tags created yet</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface TagSelectorProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  availableTags: string[]
}

// Export TagSelector component for use in other modules
export function TagSelector({ selectedTags, onTagsChange, availableTags }: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove))
  }

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag])
    }
    setIsOpen(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Tag
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {availableTags
            .filter(tag => !selectedTags.includes(tag))
            .map((tag) => (
              <DropdownMenuItem key={tag} onClick={() => handleAddTag(tag)}>
                {tag}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// TagFilter component for filtering by tags
interface TagFilterProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  availableTags: string[]
  placeholder?: string
}

export function TagFilter({ selectedTags, onTagsChange, availableTags, placeholder = "Filter by tags..." }: TagFilterProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Tags</label>
      <TagSelector 
        selectedTags={selectedTags}
        onTagsChange={onTagsChange}
        availableTags={availableTags}
      />
    </div>
  )
}