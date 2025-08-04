import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Filter, Tag as TagIcon, Edit, Trash2, BarChart3, Settings, Zap } from 'lucide-react'
import { Tag, TagType, TagCategory } from '../types'
import { useTagging } from '../hooks/useTagging'
import { TagForm } from './TagForm'
import { TagRuleForm } from './TagRuleForm'
import { TagAnalytics } from './TagAnalytics'
import { cn } from '@/lib/utils'

export function TagManager() {
  const {
    tags,
    rules,
    createTag,
    updateTag,
    deleteTag,
    createTagRule,
    getTagAnalytics
  } = useTagging()

  const [activeTab, setActiveTab] = useState('tags')
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showTagForm, setShowTagForm] = useState(false)
  const [showRuleForm, setShowRuleForm] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)
  const [selectedTagForAnalytics, setSelectedTagForAnalytics] = useState<string | null>(null)

  const getTagTypeColor = (types: TagType[]) => {
    if (types.includes(TagType.LEAD)) return 'bg-blue-50 text-blue-700 border-blue-200'
    if (types.includes(TagType.DEAL)) return 'bg-green-50 text-green-700 border-green-200'
    if (types.includes(TagType.CLIENT)) return 'bg-purple-50 text-purple-700 border-purple-200'
    if (types.includes(TagType.INVENTORY)) return 'bg-orange-50 text-orange-700 border-orange-200'
    return 'bg-gray-50 text-gray-700 border-gray-200'
  }

  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tag.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || tag.type.includes(typeFilter as TagType)
    const matchesCategory = categoryFilter === 'all' || tag.category === categoryFilter

    return matchesSearch && matchesType && matchesCategory
  })

  const handleCreateTag = () => {
    setSelectedTag(null)
    setShowTagForm(true)
  }

  const handleEditTag = (tag: Tag) => {
    setSelectedTag(tag)
    setShowTagForm(true)
  }

  const handleDeleteTag = async (tagId: string) => {
    if (window.confirm('Are you sure you want to delete this tag? This will remove it from all entities.')) {
      await deleteTag(tagId)
    }
  }

  const handleSaveTag = async (tagData: Partial<Tag>) => {
    if (selectedTag) {
      await updateTag(selectedTag.id, tagData)
    } else {
      await createTag(tagData)
    }
    setShowTagForm(false)
    setSelectedTag(null)
  }

  const handleViewAnalytics = (tagId: string) => {
    setSelectedTagForAnalytics(tagId)
    setShowAnalytics(true)
  }

  return (
    <div className="space-y-6">
      {/* Tag Form Modal */}
      {showTagForm && (
        <TagForm
          tag={selectedTag}
          onSave={handleSaveTag}
          onCancel={() => {
            setShowTagForm(false)
            setSelectedTag(null)
          }}
        />
      )}

      {/* Tag Rule Form Modal */}
      {showRuleForm && (
        <TagRuleForm
          tags={tags}
          onSave={async (ruleData) => {
            await createTagRule(ruleData)
            setShowRuleForm(false)
          }}
          onCancel={() => setShowRuleForm(false)}
        />
      )}

      {/* Tag Analytics Modal */}
      {showAnalytics && selectedTagForAnalytics && (
        <TagAnalytics
          analytics={getTagAnalytics(selectedTagForAnalytics)}
          onClose={() => {
            setShowAnalytics(false)
            setSelectedTagForAnalytics(null)
          }}
        />
      )}

      {/* Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Tag Manager</h1>
            <p className="ri-page-description">
              Create and manage tags for leads, deals, clients, and inventory
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowRuleForm(true)}>
              <Zap className="h-4 w-4 mr-2" />
              Auto-Tag Rules
            </Button>
            <Button onClick={handleCreateTag}>
              <Plus className="h-4 w-4 mr-2" />
              Create Tag
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="ri-stats-grid">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Tags</CardTitle>
            <TagIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{tags.length}</div>
            <p className="text-xs text-blue-600">
              {tags.filter(t => t.isActive).length} active
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">System Tags</CardTitle>
            <Settings className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {tags.filter(t => t.isSystem).length}
            </div>
            <p className="text-xs text-green-600">
              Built-in tags
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Auto Rules</CardTitle>
            <Zap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {rules.filter(r => r.isActive).length}
            </div>
            <p className="text-xs text-purple-600">
              Active rules
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Total Usage</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {tags.reduce((sum, tag) => sum + tag.usageCount, 0)}
            </div>
            <p className="text-xs text-orange-600">
              Tag assignments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="rules">Auto-Tag Rules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tags" className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ri-search-input shadow-sm"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value={TagType.LEAD}>Leads</SelectItem>
                <SelectItem value={TagType.DEAL}>Deals</SelectItem>
                <SelectItem value={TagType.CLIENT}>Clients</SelectItem>
                <SelectItem value={TagType.INVENTORY}>Inventory</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
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
            <Button variant="outline" onClick={handleCreateTag}>
              <Plus className="h-4 w-4 mr-2" />
              Create Tag
            </Button>
          </div>

          {/* Tags Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTags.map((tag) => (
              <Card key={tag.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: tag.color }}
                      />
                      <h3 className="font-semibold">{tag.name}</h3>
                      {tag.isSystem && (
                        <Badge variant="outline" className="text-xs">
                          System
                        </Badge>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewAnalytics(tag.id)}
                      >
                        <BarChart3 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTag(tag)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      {!tag.isSystem && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTag(tag.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {tag.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {tag.description}
                    </p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Category</span>
                      <Badge variant="secondary" className="text-xs">
                        {tag.category.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Applies to</span>
                      <div className="flex flex-wrap gap-1">
                        {tag.type.map(type => (
                          <Badge 
                            key={type} 
                            className={cn("text-xs", getTagTypeColor(tag.type))}
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Usage</span>
                      <span className="text-xs font-medium">{tag.usageCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTags.length === 0 && (
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <TagIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Tags Found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm || typeFilter !== 'all' || categoryFilter !== 'all'
                    ? 'No tags match your current filters'
                    : 'Create your first tag to get started'
                  }
                </p>
                <Button onClick={handleCreateTag}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Tag
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Auto-Tag Rules</h3>
              <p className="text-sm text-muted-foreground">
                Automatically apply tags based on conditions
              </p>
            </div>
            <Button onClick={() => setShowRuleForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </div>

          <div className="space-y-4">
            {rules.map((rule) => {
              const tag = tags.find(t => t.id === rule.tagId)
              return (
                <Card key={rule.id} className="shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold">{rule.name}</h4>
                          {tag && (
                            <Badge 
                              style={{ backgroundColor: tag.color, color: 'white' }}
                              className="text-xs"
                            >
                              {tag.name}
                            </Badge>
                          )}
                          <Badge className={rule.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          {rule.autoApply && (
                            <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                              Auto-Apply
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {rule.description}
                        </p>
                        
                        <div className="space-y-1">
                          <span className="text-xs font-medium text-muted-foreground">Conditions:</span>
                          {rule.conditions.map((condition, index) => (
                            <div key={condition.id} className="text-xs bg-muted/30 p-2 rounded">
                              {index > 0 && condition.logicalOperator && (
                                <span className="font-medium text-blue-600 mr-2">
                                  {condition.logicalOperator}
                                </span>
                              )}
                              <span className="font-medium">{condition.field}</span>
                              <span className="mx-1 text-muted-foreground">{condition.operator}</span>
                              <span>{condition.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {rules.length === 0 && (
              <Card className="shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Zap className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Auto-Tag Rules</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Create rules to automatically apply tags based on conditions
                  </p>
                  <Button onClick={() => setShowRuleForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Rule
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Tag Analytics</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tags.filter(t => t.usageCount > 0).map((tag) => (
                <Card 
                  key={tag.id} 
                  className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleViewAnalytics(tag.id)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: tag.color }}
                      />
                      <h4 className="font-semibold">{tag.name}</h4>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Usage Count</span>
                        <span className="font-bold text-lg">{tag.usageCount}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Category</span>
                        <Badge variant="secondary" className="text-xs">
                          {tag.category.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {tags.filter(t => t.usageCount > 0).length === 0 && (
              <Card className="shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Usage Data</h3>
                  <p className="text-muted-foreground text-center">
                    Tag analytics will appear here once tags are assigned to entities
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}