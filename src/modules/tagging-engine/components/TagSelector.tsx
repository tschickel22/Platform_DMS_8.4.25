import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, X, Search, Tag as TagIcon } from 'lucide-react'
import { Tag, TagType } from '../types'
import { useTagging } from '../hooks/useTagging'
import { cn } from '@/lib/utils'

interface TagSelectorProps {
  entityId: string
  entityType: TagType
  selectedTags?: Tag[]
  onTagsChange: (tags: Tag[]) => void
  placeholder?: string
  maxTags?: number
  allowCreate?: boolean
  className?: string
}

export function TagSelector({
  entityId,
  entityType,
  selectedTags = [],
  onTagsChange,
  placeholder = "Add tags...",
  maxTags,
  allowCreate = true,
  className
}: TagSelectorProps) {
  const {
    tags,
    searchTags,
    createTag,
    assignTag,
    removeTag,
    getEntityTags
  } = useTagging()

  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentTags, setCurrentTags] = useState<Tag[]>(selectedTags)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load current tags for the entity
    const entityTags = getEntityTags(entityId, entityType)
    setCurrentTags(entityTags)
  }, [entityId, entityType])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const availableTags = searchTags(searchQuery, entityType).filter(tag => 
    !currentTags.some(selectedTag => selectedTag.id === tag.id)
  )

  const handleTagSelect = async (tag: Tag) => {
    if (maxTags && currentTags.length >= maxTags) {
      return
    }

    const updatedTags = [...currentTags, tag]
    setCurrentTags(updatedTags)
    onTagsChange(updatedTags)
    
    // Assign tag to entity
    await assignTag(tag.id, entityId, entityType)
    
    setSearchQuery('')
    setIsOpen(false)
  }

  const handleTagRemove = async (tagToRemove: Tag) => {
    const updatedTags = currentTags.filter(tag => tag.id !== tagToRemove.id)
    setCurrentTags(updatedTags)
    onTagsChange(updatedTags)
    
    // Remove tag from entity
    await removeTag(tagToRemove.id, entityId, entityType)
  }

  const handleCreateTag = async () => {
    if (!searchQuery.trim()) return

    try {
      const newTag = await createTag({
        name: searchQuery.trim(),
        type: [entityType],
        color: '#3b82f6'
      })

      await handleTagSelect(newTag)
    } catch (error) {
      console.error('Failed to create tag:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault()
      if (availableTags.length > 0) {
        handleTagSelect(availableTags[0])
      } else if (allowCreate) {
        handleCreateTag()
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {currentTags.map((tag) => (
          <Badge
            key={tag.id}
            style={{ backgroundColor: tag.color, color: 'white' }}
            className="flex items-center space-x-1 pr-1"
          >
            <span>{tag.name}</span>
            <button
              type="button"
              onClick={() => handleTagRemove(tag)}
              className="ml-1 hover:bg-white/20 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {/* Input */}
      <div className="relative">
        <Input
          ref={inputRef}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={currentTags.length === 0 ? placeholder : "Add more tags..."}
          className="pr-10"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isOpen ? (
            <X className="h-4 w-4 text-muted-foreground" />
          ) : (
            <TagIcon className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
          <CardContent className="p-2 max-h-60 overflow-y-auto">
            {availableTags.length > 0 ? (
              <div className="space-y-1">
                {availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagSelect(tag)}
                    className="w-full flex items-center space-x-2 p-2 hover:bg-accent rounded-md text-left"
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="font-medium">{tag.name}</span>
                    {tag.description && (
                      <span className="text-sm text-muted-foreground truncate">
                        - {tag.description}
                      </span>
                    )}
                    <div className="ml-auto">
                      <Badge variant="outline" className="text-xs">
                        {tag.category.replace('_', ' ')}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <div className="p-2">
                {allowCreate ? (
                  <button
                    type="button"
                    onClick={handleCreateTag}
                    className="w-full flex items-center space-x-2 p-2 hover:bg-accent rounded-md text-left"
                  >
                    <Plus className="h-4 w-4 text-blue-500" />
                    <span>Create tag "{searchQuery}"</span>
                  </button>
                ) : (
                  <div className="text-sm text-muted-foreground p-2">
                    No tags found matching "{searchQuery}"
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground p-2">
                Start typing to search tags
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}