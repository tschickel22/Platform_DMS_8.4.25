import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Plus, Users, Filter, BarChart3, X, Save } from 'lucide-react'
import { TagSegment, TagType, TagFilter } from '../types'
import { useTagging } from '../hooks/useTagging'
import { TagFilter as TagFilterComponent } from './TagFilter'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function TagSegments() {
  const {
    segments,
    createSegment,
    calculateSegmentEntities
  } = useTagging()

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    entityType: TagType.LEAD,
    filters: [] as TagFilter[],
    conditions: []
  })

  const handleSaveSegment = async () => {
    if (!formData.name.trim()) return

    await createSegment(formData)
    setShowForm(false)
    setFormData({
      name: '',
      description: '',
      entityType: TagType.LEAD,
      filters: [],
      conditions: []
    })
  }

  const getEntityTypeColor = (type: TagType) => {
    switch (type) {
      case TagType.LEAD: return 'bg-blue-50 text-blue-700 border-blue-200'
      case TagType.DEAL: return 'bg-green-50 text-green-700 border-green-200'
      case TagType.CLIENT: return 'bg-purple-50 text-purple-700 border-purple-200'
      case TagType.INVENTORY: return 'bg-orange-50 text-orange-700 border-orange-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Segment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Create Segment</CardTitle>
                  <CardDescription>
                    Create a segment based on tag filters and conditions
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Segment Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter segment name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="entityType">Entity Type</Label>
                  <Select
                    value={formData.entityType}
                    onValueChange={(value: TagType) => setFormData(prev => ({ ...prev, entityType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TagType.LEAD}>Leads</SelectItem>
                      <SelectItem value={TagType.DEAL}>Deals</SelectItem>
                      <SelectItem value={TagType.CLIENT}>Clients</SelectItem>
                      <SelectItem value={TagType.INVENTORY}>Inventory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this segment"
                  rows={3}
                />
              </div>

              <div>
                <Label>Tag Filters</Label>
                <TagFilterComponent
                  entityType={formData.entityType}
                  filters={formData.filters}
                  onFiltersChange={(filters) => setFormData(prev => ({ ...prev, filters }))}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveSegment}>
                  <Save className="h-4 w-4 mr-2" />
                  Create Segment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tag Segments</h2>
          <p className="text-muted-foreground">
            Create dynamic segments based on tag combinations
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Segment
        </Button>
      </div>

      {/* Segments List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {segments.map((segment) => (
          <Card key={segment.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{segment.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {segment.description}
                    </p>
                  </div>
                  <Badge className={cn("ri-badge-status", getEntityTypeColor(segment.entityType))}>
                    {segment.entityType}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Entity Count</span>
                    <span className="font-bold text-lg">{segment.entityCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Filters</span>
                    <span className="text-sm font-medium">{segment.filters.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                    <span className="text-sm">{formatDate(segment.lastCalculated)}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Users className="h-3 w-3 mr-1" />
                    View Entities
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {segments.length === 0 && (
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Filter className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Segments Created</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create segments to group entities by their tags and properties
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Segment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}