import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tag, Plus } from 'lucide-react'

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

// Export TagSelector component for use in other modules
export function TagSelector({ 
  selectedTags = [], 
  onTagsChange = () => {},
  availableTags = [],
  placeholder = "Select tags..."
}: {
  selectedTags?: string[]
  onTagsChange?: (tags: string[]) => void
  availableTags?: string[]
  placeholder?: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tag => (
          <span 
            key={tag}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
          >
            {tag}
            <button
              onClick={() => onTagsChange(selectedTags.filter(t => t !== tag))}
              className="ml-1 text-primary/60 hover:text-primary"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <select 
        onChange={(e) => {
          const tag = e.target.value
          if (tag && !selectedTags.includes(tag)) {
            onTagsChange([...selectedTags, tag])
          }
          e.target.value = ''
        }}
        className="w-full px-3 py-2 border border-input rounded-md text-sm"
      >
        <option value="">{placeholder}</option>
        {availableTags
          .filter(tag => !selectedTags.includes(tag))
          .map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))
        }
      </select>
    </div>
  )
}