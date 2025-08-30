import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { X, Save, Plus, Trash2, Zap } from 'lucide-react'
import { Tag, TagRule, TagCondition, TagOperator } from '../types'
import { useToast } from '@/hooks/use-toast'

interface TagRuleFormProps {
  rule?: TagRule | null
  tags: Tag[]
  onSave: (ruleData: Partial<TagRule>) => Promise<void>
  onCancel: () => void
}

const fieldOptions = [
  // Lead fields
  { value: 'score', label: 'Lead Score', entityTypes: ['lead'] },
  { value: 'status', label: 'Status', entityTypes: ['lead', 'deal', 'client'] },
  { value: 'source', label: 'Source', entityTypes: ['lead'] },
  { value: 'customFields.budget', label: 'Budget', entityTypes: ['lead'] },
  { value: 'customFields.timeframe', label: 'Timeframe', entityTypes: ['lead'] },
  
  // Deal fields
  { value: 'value', label: 'Deal Value', entityTypes: ['deal'] },
  { value: 'probability', label: 'Probability', entityTypes: ['deal'] },
  { value: 'stage', label: 'Stage', entityTypes: ['deal'] },
  { value: 'expectedCloseDate', label: 'Expected Close Date', entityTypes: ['deal'] },
  
  // Client fields
  { value: 'totalPurchases', label: 'Total Purchases', entityTypes: ['client'] },
  { value: 'lastPurchaseDate', label: 'Last Purchase Date', entityTypes: ['client'] },
  { value: 'customerSince', label: 'Customer Since', entityTypes: ['client'] },
  
  // Inventory fields
  { value: 'price', label: 'Price', entityTypes: ['inventory'] },
  { value: 'cost', label: 'Cost', entityTypes: ['inventory'] },
  { value: 'type', label: 'Vehicle Type', entityTypes: ['inventory'] },
  { value: 'year', label: 'Year', entityTypes: ['inventory'] },
  { value: 'location', label: 'Location', entityTypes: ['inventory'] }
]

export function TagRuleForm({ rule, tags, onSave, onCancel }: TagRuleFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: rule?.name || '',
    description: rule?.description || '',
    tagId: rule?.tagId || '',
    conditions: rule?.conditions || [],
    isActive: rule?.isActive ?? true,
    autoApply: rule?.autoApply ?? true,
    priority: rule?.priority || 1
  })

  const [newCondition, setNewCondition] = useState<Partial<TagCondition>>({
    field: '',
    operator: TagOperator.EQUALS,
    value: '',
    logicalOperator: 'AND'
  })

  const selectedTag = tags.find(t => t.id === formData.tagId)
  const availableFields = selectedTag 
    ? fieldOptions.filter(field => 
        field.entityTypes.some(type => selectedTag.type.includes(type as any))
      )
    : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.tagId || formData.conditions.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Name, tag, and at least one condition are required',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
      toast({
        title: 'Success',
        description: `Rule ${rule ? 'updated' : 'created'} successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${rule ? 'update' : 'create'} rule`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const addCondition = () => {
    if (!newCondition.field || !newCondition.operator) {
      toast({
        title: 'Validation Error',
        description: 'Field and operator are required',
        variant: 'destructive'
      })
      return
    }

    const condition: TagCondition = {
      id: Math.random().toString(36).substr(2, 9),
      field: newCondition.field,
      operator: newCondition.operator,
      value: newCondition.value,
      logicalOperator: formData.conditions.length > 0 ? newCondition.logicalOperator : undefined
    }

    setFormData(prev => ({
      ...prev,
      conditions: [...prev.conditions, condition]
    }))

    setNewCondition({
      field: '',
      operator: TagOperator.EQUALS,
      value: '',
      logicalOperator: 'AND'
    })
  }

  const removeCondition = (conditionId: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter(c => c.id !== conditionId)
    }))
  }

  const getOperatorLabel = (operator: TagOperator) => {
    switch (operator) {
      case TagOperator.EQUALS: return 'equals'
      case TagOperator.NOT_EQUALS: return 'does not equal'
      case TagOperator.CONTAINS: return 'contains'
      case TagOperator.NOT_CONTAINS: return 'does not contain'
      case TagOperator.STARTS_WITH: return 'starts with'
      case TagOperator.ENDS_WITH: return 'ends with'
      case TagOperator.GREATER_THAN: return 'is greater than'
      case TagOperator.LESS_THAN: return 'is less than'
      case TagOperator.BETWEEN: return 'is between'
      case TagOperator.IN: return 'is in'
      case TagOperator.NOT_IN: return 'is not in'
      case TagOperator.IS_EMPTY: return 'is empty'
      case TagOperator.IS_NOT_EMPTY: return 'is not empty'
      default: return operator
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-blue-500" />
                {rule ? 'Edit Auto-Tag Rule' : 'Create Auto-Tag Rule'}
              </CardTitle>
              <CardDescription>
                {rule ? 'Update rule conditions' : 'Automatically apply tags based on entity conditions'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Rule Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter rule name"
                />
              </div>
              
              <div>
                <Label htmlFor="tagId">Tag to Apply *</Label>
                <Select
                  value={formData.tagId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, tagId: value, conditions: [] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags.filter(t => t.isActive).map(tag => (
                      <SelectItem key={tag.id} value={tag.id}>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: tag.color }}
                          />
                          <span>{tag.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {tag.type.join(', ')}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
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
                placeholder="Describe when this rule should apply"
                rows={2}
              />
            </div>

            {/* Conditions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Conditions *</Label>
                <span className="text-sm text-muted-foreground">
                  {formData.conditions.length} condition(s)
                </span>
              </div>

              {/* Existing Conditions */}
              <div className="space-y-3">
                {formData.conditions.map((condition, index) => {
                  const field = availableFields.find(f => f.value === condition.field)
                  return (
                    <div key={condition.id} className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
                      {index > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {condition.logicalOperator}
                        </Badge>
                      )}
                      <span className="font-medium text-sm">
                        {field?.label || condition.field}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {getOperatorLabel(condition.operator)}
                      </span>
                      <span className="text-sm font-medium">
                        {Array.isArray(condition.value) ? condition.value.join(', ') : condition.value}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCondition(condition.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )
                })}
              </div>

              {/* Add New Condition */}
              {selectedTag && (
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      {formData.conditions.length > 0 && (
                        <div>
                          <Label>Logical Operator</Label>
                          <Select
                            value={newCondition.logicalOperator}
                            onValueChange={(value: 'AND' | 'OR') => 
                              setNewCondition(prev => ({ ...prev, logicalOperator: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AND">AND</SelectItem>
                              <SelectItem value="OR">OR</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      <div>
                        <Label>Field</Label>
                        <Select
                          value={newCondition.field}
                          onValueChange={(value) => setNewCondition(prev => ({ ...prev, field: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableFields.map(field => (
                              <SelectItem key={field.value} value={field.value}>
                                {field.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Operator</Label>
                        <Select
                          value={newCondition.operator}
                          onValueChange={(value: TagOperator) => 
                            setNewCondition(prev => ({ ...prev, operator: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={TagOperator.EQUALS}>Equals</SelectItem>
                            <SelectItem value={TagOperator.NOT_EQUALS}>Not Equals</SelectItem>
                            <SelectItem value={TagOperator.CONTAINS}>Contains</SelectItem>
                            <SelectItem value={TagOperator.NOT_CONTAINS}>Not Contains</SelectItem>
                            <SelectItem value={TagOperator.STARTS_WITH}>Starts With</SelectItem>
                            <SelectItem value={TagOperator.ENDS_WITH}>Ends With</SelectItem>
                            <SelectItem value={TagOperator.GREATER_THAN}>Greater Than</SelectItem>
                            <SelectItem value={TagOperator.LESS_THAN}>Less Than</SelectItem>
                            <SelectItem value={TagOperator.BETWEEN}>Between</SelectItem>
                            <SelectItem value={TagOperator.IN}>In List</SelectItem>
                            <SelectItem value={TagOperator.NOT_IN}>Not In List</SelectItem>
                            <SelectItem value={TagOperator.IS_EMPTY}>Is Empty</SelectItem>
                            <SelectItem value={TagOperator.IS_NOT_EMPTY}>Is Not Empty</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Value</Label>
                        <Input
                          value={newCondition.value}
                          onChange={(e) => setNewCondition(prev => ({ ...prev, value: e.target.value }))}
                          placeholder="Enter value"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          For lists, separate values with commas
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button type="button" onClick={addCondition}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Condition
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Rule Settings */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority.toString()}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, priority: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Highest</SelectItem>
                    <SelectItem value="2">2 - High</SelectItem>
                    <SelectItem value="3">3 - Medium</SelectItem>
                    <SelectItem value="4">4 - Low</SelectItem>
                    <SelectItem value="5">5 - Lowest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoApply"
                  checked={formData.autoApply}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoApply: !!checked }))}
                />
                <Label htmlFor="autoApply">Auto-apply this rule</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
                />
                <Label htmlFor="isActive">Active rule</Label>
              </div>
            </div>

            {/* Preview */}
            {selectedTag && formData.conditions.length > 0 && (
              <div className="space-y-2">
                <Label>Rule Preview</Label>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm">When</span>
                    <Badge 
                      style={{ backgroundColor: selectedTag.color, color: 'white' }}
                      className="text-xs"
                    >
                      {selectedTag.name}
                    </Badge>
                    <span className="text-sm">will be applied if:</span>
                  </div>
                  <div className="space-y-1">
                    {formData.conditions.map((condition, index) => (
                      <div key={condition.id} className="text-sm">
                        {index > 0 && (
                          <span className="font-medium text-blue-600 mr-2">
                            {condition.logicalOperator}
                          </span>
                        )}
                        <span className="font-medium">{condition.field}</span>
                        <span className="mx-1 text-muted-foreground">
                          {getOperatorLabel(condition.operator)}
                        </span>
                        <span className="font-medium">{condition.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {rule ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {rule ? 'Update' : 'Create'} Rule
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}