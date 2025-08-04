import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Filter, Tag, Settings, BarChart3, Zap, TrendingUp, Edit, Target, Trash2 } from 'lucide-react'
import { useTagging } from '../hooks/useTagging'
import { TagType, TagCategory } from '../types'
import { TagForm } from './TagForm'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

interface TagManagerProps {
  activeFilter?: string
  onFilterChange?: (filter: string) => void
}

export function TagManager({ activeFilter = 'all', onFilterChange }: TagManagerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<TagType | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<TagCategory | 'all'>('all')
  const [showNewTagForm, setShowNewTagForm] = useState(false)

  const {
    tags,
    assignments,
    rules,
    loading,
    searchTags,
    createTag,
    updateTag,
    deleteTag,
    totalUsage
  } = useTagging()

  // Calculate metrics
  const systemTags = tags.filter(tag => tag.isSystem)
  const customTags = tags.filter(tag => !tag.isSystem)
  const activeTags = tags.filter(tag => tag.isActive)
  const tagsWithRules = tags.filter(tag => 
    rules.some(rule => rule.tagId === tag.id && rule.isActive)
  )
  const tagsWithUsage = tags.filter(tag => tag.usageCount > 0)

  // Filter tags based on active filter and search
  const filteredTags = useMemo(() => {
    let filtered = tags

    // Apply active filter
    switch (activeFilter) {
      case 'system':
        filtered = tags.filter(tag => tag.isSystem)
        break
      case 'auto_rules':
        filtered = tags.filter(tag => 
          rules.some(rule => rule.tagId === tag.id && rule.isActive)
        )
        break
      case 'usage':
        filtered = [...tags].sort((a, b) => b.usageCount - a.usageCount)
        break
      default:
        filtered = tags
    }

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      filtered = filtered.filter(tag =>
        tag.name.toLowerCase().includes(lowerSearchTerm) ||
        tag.description?.toLowerCase().includes(lowerSearchTerm)
      )
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(tag => tag.type.includes(typeFilter))
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(tag => tag.category === categoryFilter)
    }

    return filtered
  }, [tags, rules, activeFilter, searchTerm, typeFilter, categoryFilter])

  const handleCreateTag = async (tagData: Partial<Tag>) => {
    try {
      await createTag(tagData)
      setShowNewTagForm(false)
    } catch (error) {
      console.error('Failed to create tag:', error)
    }
  }

  const handleFilterChange = (newFilter: string) => {
    // Reset other filters when using stat card filters
    if (newFilter !== 'all') {
      setSearchTerm('')
      setTypeFilter('all')
      setCategoryFilter('all')
    }
    onFilterChange(newFilter)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Tag Manager</h1>
            <p className="ri-page-description">
              Manage tags and tagging rules across all modules
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card 
          className={`shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 cursor-pointer transition-all hover:shadow-md ${
            activeFilter === 'all' ? 'ring-2 ring-blue-300' : ''
          }`}
          onClick={() => handleFilterChange(activeFilter === 'all' ? 'all' : 'all')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Tags</CardTitle>
            <Tag className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{tags.length}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {activeTags.length} active
            </p>
          </CardContent>
        </Card>

        <Card 
          className={`shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50 cursor-pointer transition-all hover:shadow-md ${
            activeFilter === 'system' ? 'ring-2 ring-green-300' : ''
          }`}
          onClick={() => handleFilterChange(activeFilter === 'system' ? 'all' : 'system')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">System Tags</CardTitle>
            <Settings className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{systemTags.length}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <Settings className="h-3 w-3 mr-1" />
              Built-in tags
            </p>
          </CardContent>
        </Card>

        <Card 
          className={`shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 cursor-pointer transition-all hover:shadow-md ${
            activeFilter === 'auto_rules' ? 'ring-2 ring-purple-300' : ''
          }`}
          onClick={() => handleFilterChange(activeFilter === 'auto_rules' ? 'all' : 'auto_rules')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Auto Rules</CardTitle>
            <Zap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{tagsWithRules.length}</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <Zap className="h-3 w-3 mr-1" />
              Active rules
            </p>
          </CardContent>
        </Card>

        <Card 
          className={`shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50 cursor-pointer transition-all hover:shadow-md ${
            activeFilter === 'usage' ? 'ring-2 ring-orange-300' : ''
          }`}
          onClick={() => handleFilterChange(activeFilter === 'usage' ? 'all' : 'usage')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Total Usage</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{totalUsage}</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <BarChart3 className="h-3 w-3 mr-1" />
              Tag assignments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="ri-search-bar flex-1">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={(value: TagType | 'all') => setTypeFilter(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value={TagType.LEAD}>Lead</SelectItem>
                <SelectItem value={TagType.DEAL}>Deal</SelectItem>
                <SelectItem value={TagType.CLIENT}>Client</SelectItem>
                <SelectItem value={TagType.INVENTORY}>Inventory</SelectItem>
                <SelectItem value={TagType.CUSTOM}>Custom</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={(value: TagCategory | 'all') => setCategoryFilter(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
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
            <Button variant="outline" className="shadow-sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
            <Button onClick={() => setShowNewTagForm(true)} className="shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              New Tag
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tags List */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">
            Tags ({filteredTags.length})
            {activeFilter !== 'all' && (
              <Badge className="ml-2" variant="outline">
                Filtered by: {activeFilter.replace('_', ' ')}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Manage tags and their assignments across all modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* New Tag Form */}
          {showNewTagForm && (
            <TagForm
              onSave={handleCreateTag}
              onCancel={() => setShowNewTagForm(false)}
            />
          )}

          <div className="space-y-4">
            {filteredTags.length > 0 ? (
              filteredTags.map((tag) => (
                <div key={tag.id} className="ri-table-row">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div 
                          className="w-4 h-4 rounded-full border-2" 
                          style={{ backgroundColor: tag.color, borderColor: tag.color }}
                        />
                        <h3 className="font-semibold text-foreground">{tag.name}</h3>
                        <Badge className={tag.isSystem ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-700 border-gray-200'}>
                          {tag.isSystem ? 'SYSTEM' : 'CUSTOM'}
                        </Badge>
                        <Badge className={tag.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}>
                          {tag.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </Badge>
                        {tagsWithRules.some(t => t.id === tag.id) && (
                          <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                            <Zap className="h-3 w-3 mr-1" />
                            AUTO RULE
                          </Badge>
                        )}
                        {tag.usageCount > 0 && (
                          <Badge className="bg-orange-50 text-orange-700 border-orange-200">
                            <BarChart3 className="h-3 w-3 mr-1" />
                            {tag.usageCount} uses
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Category:</span> 
                          <span className="ml-1 capitalize">{tag.category.replace('_', ' ')}</span>
                        </div>
                        <div>
                          <span className="font-medium">Types:</span> 
                          <span className="ml-1">{tag.type.join(', ')}</span>
                        </div>
                        <div>
                          <span className="font-medium">Usage Count:</span> 
                          <span className="ml-1">{tag.usageCount}</span>
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> 
                          <span className="ml-1">{formatDate(tag.createdAt)}</span>
                        </div>
                      </div>
                      {tag.description && (
                        <p className="text-sm text-muted-foreground mt-2 bg-muted/30 p-2 rounded-md">
                          {tag.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="ri-action-buttons">
                    <Button variant="outline" size="sm" className="shadow-sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="shadow-sm">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Analytics
                    </Button>
                    <Button variant="outline" size="sm" className="shadow-sm text-red-600 hover:text-red-700">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>
                  {activeFilter === 'auto_rules' ? 'No tags with automation rules found' :
                   activeFilter === 'system' ? 'No system tags found' :
                   activeFilter === 'usage' ? 'No tags with usage found' :
                   searchTerm ? 'No tags found matching your search' : 'No tags found'}
                </p>
                <p className="text-sm">
                  {activeFilter === 'auto_rules' ? 'Create automation rules for tags to see them here' :
                   activeFilter === 'system' ? 'System tags are created automatically' :
                   activeFilter === 'usage' ? 'Tags will appear here once they are assigned to entities' :
                   searchTerm ? 'Try adjusting your search terms' : 'Create your first tag to get started'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}