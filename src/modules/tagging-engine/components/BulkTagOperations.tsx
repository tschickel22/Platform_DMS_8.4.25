import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Zap, Play, Pause, RotateCcw, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { Tag, TagType, BulkTagOperation } from '../types'
import { useTagging } from '../hooks/useTagging'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface BulkTagOperationsProps {
  entityType: TagType
  selectedEntityIds: string[]
  onComplete?: () => void
}

export function BulkTagOperations({ entityType, selectedEntityIds, onComplete }: BulkTagOperationsProps) {
  const {
    tags,
    bulkOperations,
    bulkAssignTags,
    getTagsByType
  } = useTagging()

  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [operation, setOperation] = useState<'add' | 'remove' | 'replace'>('add')
  const [processing, setProcessing] = useState(false)

  const availableTags = getTagsByType(entityType)
  const currentOperations = bulkOperations.filter(op => 
    op.entityType === entityType && op.status !== 'completed'
  )

  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId))
    } else {
      setSelectedTags([...selectedTags, tagId])
    }
  }

  const handleExecute = async () => {
    if (selectedTags.length === 0 || selectedEntityIds.length === 0) {
      return
    }

    setProcessing(true)
    try {
      await bulkAssignTags(selectedTags, selectedEntityIds, entityType)
      setSelectedTags([])
      onComplete?.()
    } finally {
      setProcessing(false)
    }
  }

  const getOperationIcon = (status: BulkTagOperation['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'processing': return <Play className="h-4 w-4 text-blue-500" />
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getOperationColor = (status: BulkTagOperation['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'processing': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'completed': return 'bg-green-50 text-green-700 border-green-200'
      case 'failed': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Bulk Operation Form */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-blue-500" />
            Bulk Tag Operations
          </CardTitle>
          <CardDescription>
            Apply tags to multiple {entityType}s at once
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Operation Type */}
          <div>
            <Label>Operation Type</Label>
            <Select value={operation} onValueChange={(value: 'add' | 'remove' | 'replace') => setOperation(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Add Tags</SelectItem>
                <SelectItem value="remove">Remove Tags</SelectItem>
                <SelectItem value="replace">Replace All Tags</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tag Selection */}
          <div className="space-y-4">
            <Label>Select Tags ({selectedTags.length} selected)</Label>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 max-h-60 overflow-y-auto p-2 border rounded-lg">
              {availableTags.map((tag) => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`bulk-tag-${tag.id}`}
                    checked={selectedTags.includes(tag.id)}
                    onCheckedChange={() => handleTagToggle(tag.id)}
                  />
                  <Label 
                    htmlFor={`bulk-tag-${tag.id}`}
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

          {/* Selected Tags Preview */}
          {selectedTags.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Tags</Label>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map(tagId => {
                  const tag = availableTags.find(t => t.id === tagId)
                  if (!tag) return null
                  
                  return (
                    <Badge
                      key={tagId}
                      style={{ backgroundColor: tag.color, color: 'white' }}
                      className="flex items-center space-x-1 pr-1"
                    >
                      <span>{tag.name}</span>
                      <button
                        type="button"
                        onClick={() => handleTagToggle(tagId)}
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="grid gap-2 md:grid-cols-3">
              <div>
                <span className="text-sm font-medium">Operation:</span>
                <p className="text-sm capitalize">{operation} tags</p>
              </div>
              <div>
                <span className="text-sm font-medium">Selected Entities:</span>
                <p className="text-sm">{selectedEntityIds.length} {entityType}s</p>
              </div>
              <div>
                <span className="text-sm font-medium">Selected Tags:</span>
                <p className="text-sm">{selectedTags.length} tags</p>
              </div>
            </div>
          </div>

          {/* Execute Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleExecute}
              disabled={processing || selectedTags.length === 0 || selectedEntityIds.length === 0}
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Execute Operation
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Operations */}
      {currentOperations.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Active Operations</CardTitle>
            <CardDescription>
              Currently running bulk tag operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentOperations.map((op) => (
                <div key={op.id} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getOperationIcon(op.status)}
                      <div>
                        <p className="font-medium capitalize">
                          {op.operation} {op.tagIds.length} tag(s) to {op.totalEntities} {op.entityType}(s)
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Started {formatDate(op.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Badge className={cn("ri-badge-status", getOperationColor(op.status))}>
                      {op.status.toUpperCase()}
                    </Badge>
                  </div>

                  {op.status === 'processing' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{op.processedEntities} / {op.totalEntities}</span>
                      </div>
                      <Progress value={op.progress} className="h-2" />
                    </div>
                  )}

                  {op.errors.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-red-600">Errors:</Label>
                      <div className="max-h-20 overflow-y-auto">
                        {op.errors.map((error, index) => (
                          <p key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                            {error}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}