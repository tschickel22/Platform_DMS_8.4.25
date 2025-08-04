import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Filter, Tag, Settings, BarChart3, Zap, TrendingUp } from 'lucide-react'
import { useTagging } from '../hooks/useTagging'
import { TagType, TagCategory } from '../types'
import { TagForm } from './TagForm'
import { cn } from '@/lib/utils'

interface TagManagerProps {
  activeFilter?: string
  onFilterChange?: (filter: string) => void
}

export function TagManager({ activeFilter = 'all', onFilterChange }: TagManagerProps) {
  const { tags, loading } = useTagging()
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showTagForm, setShowTagForm] = useState(false)
  const [selectedTag, setSelectedTag] = useState(null)

  // Calculate metrics
  const totalTags = tags.length
  const activeTags = tags.filter(tag => tag.isActive).length
  const systemTags = tags.filter(tag => tag.isSystem).length
  const autoRules = 2 // Mock data for auto rules
  const totalUsage = 0 // Mock data for total usage

  // Filter tags based on active filter and other filters
  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tag.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === 'all' || tag.type.includes(typeFilter as TagType)
    const matchesCategory = categoryFilter === 'all' || tag.category === categoryFilter
    
    // Apply active filter from stat cards
    let matchesActiveFilter = true
    if (activeFilter === 'system') {
      matchesActiveFilter = tag.isSystem
    } else if (activeFilter === 'custom') {
      matchesActiveFilter = !tag.isSystem
    } else if (activeFilter === 'active') {
      matchesActiveFilter = tag.isActive
    }

    return matchesSearch && matchesType && matchesCategory && matchesActiveFilter
  })

  const handleStatCardClick = (filterType: string) => {
    // Toggle filter if clicking the same card, otherwise set new filter
    const newFilter = activeFilter === filterType ? 'all' : filterType
    onFilterChange?.(newFilter)
    
    // Reset other filters when using stat card filters
    if (newFilter !== 'all') {
      setTypeFilter('all')
      setCategoryFilter('all')
    }
  }

  const handleCreateTag = () => {
    setSelectedTag(null)
    setShowTagForm(true)
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
      {/* Tag Form Modal */}
      {showTagForm && (
        <TagForm
          tag={selectedTag}
          onSave={async (tagData) => {
            // Handle tag save
            setShowTagForm(false)
            setSelectedTag(null)
          }}
          onCancel={() => {
            setShowTagForm(false)
            setSelectedTag(null)
          }}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Tag Manager</h1>
            <p className="ri-page-description">
              Manage tags and tagging rules across all modules
            </p>
          </div>
          <Button onClick={handleCreateTag} className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            New Tag
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card 
          className={`shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 cursor-pointer transition-all hover:shadow-md ${
            activeFilter === 'all' ? 'ring-2 ring-blue-300' : ''
          }`}
          onClick={() => handleStatCardClick('all')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Tags</CardTitle>
            <Tag className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{totalTags}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {activeTags} active
            </p>
          </CardContent>
        </Card>

        <Card 
          className={`shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50 cursor-pointer transition-all hover:shadow-md ${
            activeFilter === 'system' ? 'ring-2 ring-green-300' : ''
          }`}
          onClick={() => handleStatCardClick('system')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">System Tags</CardTitle>
            <Settings className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{systemTags}</div>
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
          onClick={() => handleStatCardClick('auto_rules')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Auto Rules</CardTitle>
            <Zap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{autoRules}</div>
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
          onClick={() => handleStatCardClick('usage')}
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
                className="ri-search-input shadow-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Type" />
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

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value={TagCategory.STATUS}>Status</SelectItem>
                  <SelectItem value={TagCategory.PRIORITY}>Priority</SelectItem>
                  <SelectItem value={TagCategory.SOURCE}>Source</SelectItem>
                  <SelectItem value={TagCategory.BEHAVIOR}>Behavior</SelectItem>
                  <SelectItem value={TagCategory.CUSTOM}>Custom</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="shadow-sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags List */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Tags ({filteredTags.length})</CardTitle>
          <CardDescription>
            Manage tags and their assignments across all modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTags.length > 0 ? (
              filteredTags.map((tag) => (
                <div key={tag.id} className="ri-table-row">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: tag.color }}
                        ></div>
                        <h3 className="font-semibold text-foreground">{tag.name}</h3>
                        <Badge className={tag.isSystem ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}>
                          {tag.isSystem ? 'SYSTEM' : 'CUSTOM'}
                        </Badge>
                        <Badge className={tag.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}>
                          {tag.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </Badge>
                      </div>
                      
                      {tag.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {tag.description}
                        </p>
                      )}
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Category:</span> 
                          <span className="ml-1">{tag.category}</span>
                        </div>
                        <div>
                          <span className="font-medium">Types:</span> 
                          <span className="ml-1">{tag.type.join(', ')}</span>
                        </div>
                        <div>
                          <span className="font-medium">Usage:</span> 
                          <span className="ml-1">{tag.usageCount}</span>
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> 
                          <span className="ml-1">{tag.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ri-action-buttons">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="shadow-sm"
                      onClick={() => {
                        setSelectedTag(tag)
                        setShowTagForm(true)
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No tags found</p>
                <p className="text-sm">
                  {searchTerm || typeFilter !== 'all' || categoryFilter !== 'all' || activeFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Create your first tag to get started'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}