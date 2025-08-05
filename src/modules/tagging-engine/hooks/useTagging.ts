import { useMemo } from 'react'
import { useState, useEffect } from 'react'
import { 
  Tag, 
  TagAssignment, 
  TagRule, 
  TagSegment, 
  TagType, 
  TagCategory, 
  TagCondition,
  TagOperator,
  TagFilter,
  BulkTagOperation,
  TagSuggestion,
  TagAnalytics
} from '../types'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

export function useTagging() {
  const [tags, setTags] = useState<Tag[]>([])
  const [assignments, setAssignments] = useState<TagAssignment[]>([])
  const [rules, setRules] = useState<TagRule[]>([])
  const [segments, setSegments] = useState<TagSegment[]>([])
  const [bulkOperations, setBulkOperations] = useState<BulkTagOperation[]>([])
  const [suggestions, setSuggestions] = useState<TagSuggestion[]>([])
  const [loading, setLoading] = useState(false)

  // Calculate total usage across all tags
  const totalUsage = useMemo(() => {
    return tags.reduce((sum, tag) => sum + tag.usageCount, 0)
  }, [tags])

  useEffect(() => {
    initializeTaggingData()
  }, [])

  const initializeTaggingData = () => {
    // Load existing data from localStorage or initialize with system tags
    const savedTags = loadFromLocalStorage('renter-insight-tags', getSystemTags())
    const savedAssignments = loadFromLocalStorage('renter-insight-tag-assignments', [])
    const savedRules = loadFromLocalStorage('renter-insight-tag-rules', getDefaultRules())
    const savedSegments = loadFromLocalStorage('renter-insight-tag-segments', [])

    setTags(savedTags)
    setAssignments(savedAssignments)
    setRules(savedRules)
    setSegments(savedSegments)
  }

  const getSystemTags = (): Tag[] => [
    // Lead tags
    {
      id: 'tag-lead-hot',
      name: 'Hot Lead',
      description: 'High-priority lead with strong buying signals',
      color: '#ef4444',
      category: TagCategory.PRIORITY,
      type: [TagType.LEAD],
      isSystem: true,
      isActive: true,
      usageCount: 0,
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'tag-lead-warm',
      name: 'Warm Lead',
      description: 'Engaged lead showing interest',
      color: '#f59e0b',
      category: TagCategory.PRIORITY,
      type: [TagType.LEAD],
      isSystem: true,
      isActive: true,
      usageCount: 0,
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'tag-lead-cold',
      name: 'Cold Lead',
      description: 'Low engagement, needs nurturing',
      color: '#6b7280',
      category: TagCategory.PRIORITY,
      type: [TagType.LEAD],
      isSystem: true,
      isActive: true,
      usageCount: 0,
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Deal tags
    {
      id: 'tag-deal-high-value',
      name: 'High Value',
      description: 'Deal value above $100k',
      color: '#10b981',
      category: TagCategory.PRIORITY,
      type: [TagType.DEAL],
      isSystem: true,
      isActive: true,
      usageCount: 0,
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'tag-deal-quick-close',
      name: 'Quick Close',
      description: 'Deal expected to close within 30 days',
      color: '#8b5cf6',
      category: TagCategory.STATUS,
      type: [TagType.DEAL],
      isSystem: true,
      isActive: true,
      usageCount: 0,
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Client tags
    {
      id: 'tag-client-vip',
      name: 'VIP Client',
      description: 'High-value customer requiring special attention',
      color: '#dc2626',
      category: TagCategory.STATUS,
      type: [TagType.CLIENT],
      isSystem: true,
      isActive: true,
      usageCount: 0,
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'tag-client-repeat',
      name: 'Repeat Customer',
      description: 'Customer with multiple purchases',
      color: '#059669',
      category: TagCategory.BEHAVIOR,
      type: [TagType.CLIENT],
      isSystem: true,
      isActive: true,
      usageCount: 0,
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Inventory tags
    {
      id: 'tag-inventory-featured',
      name: 'Featured',
      description: 'Featured inventory item',
      color: '#3b82f6',
      category: TagCategory.STATUS,
      type: [TagType.INVENTORY],
      isSystem: true,
      isActive: true,
      usageCount: 0,
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'tag-inventory-clearance',
      name: 'Clearance',
      description: 'Inventory marked for clearance',
      color: '#dc2626',
      category: TagCategory.STATUS,
      type: [TagType.INVENTORY],
      isSystem: true,
      isActive: true,
      usageCount: 0,
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  const getDefaultRules = (): TagRule[] => [
    {
      id: 'rule-hot-lead',
      name: 'Auto-tag Hot Leads',
      description: 'Automatically tag leads with score > 80 as hot',
      tagId: 'tag-lead-hot',
      conditions: [
        {
          id: 'cond-1',
          field: 'score',
          operator: TagOperator.GREATER_THAN,
          value: 80
        }
      ],
      isActive: true,
      autoApply: true,
      priority: 1,
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'rule-high-value-deal',
      name: 'Auto-tag High Value Deals',
      description: 'Automatically tag deals over $100k as high value',
      tagId: 'tag-deal-high-value',
      conditions: [
        {
          id: 'cond-2',
          field: 'value',
          operator: TagOperator.GREATER_THAN,
          value: 100000
        }
      ],
      isActive: true,
      autoApply: true,
      priority: 1,
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  const saveTagsToStorage = (updatedTags: Tag[]) => {
    saveToLocalStorage('renter-insight-tags', updatedTags)
  }

  const saveAssignmentsToStorage = (updatedAssignments: TagAssignment[]) => {
    saveToLocalStorage('renter-insight-tag-assignments', updatedAssignments)
  }

  const saveRulesToStorage = (updatedRules: TagRule[]) => {
    saveToLocalStorage('renter-insight-tag-rules', updatedRules)
  }

  const saveSegmentsToStorage = (updatedSegments: TagSegment[]) => {
    saveToLocalStorage('renter-insight-tag-segments', updatedSegments)
  }

  const createTag = async (tagData: Partial<Tag>) => {
    setLoading(true)
    try {
      const newTag: Tag = {
        id: Math.random().toString(36).substr(2, 9),
        name: tagData.name || '',
        description: tagData.description,
        color: tagData.color || '#3b82f6',
        category: tagData.category || TagCategory.CUSTOM,
        type: tagData.type || [TagType.CUSTOM],
        isSystem: false,
        isActive: true,
        usageCount: 0,
        createdBy: 'current-user',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedTags = [...tags, newTag]
      setTags(updatedTags)
      saveTagsToStorage(updatedTags)

      return newTag
    } finally {
      setLoading(false)
    }
  }

  const updateTag = async (tagId: string, updates: Partial<Tag>) => {
    const updatedTags = tags.map(tag =>
      tag.id === tagId
        ? { ...tag, ...updates, updatedAt: new Date() }
        : tag
    )
    setTags(updatedTags)
    saveTagsToStorage(updatedTags)
  }

  const deleteTag = async (tagId: string) => {
    // Remove tag assignments first
    const updatedAssignments = assignments.filter(a => a.tagId !== tagId)
    setAssignments(updatedAssignments)
    saveAssignmentsToStorage(updatedAssignments)

    // Remove the tag
    const updatedTags = tags.filter(tag => tag.id !== tagId)
    setTags(updatedTags)
    saveTagsToStorage(updatedTags)
  }

  const assignTag = async (tagId: string, entityId: string, entityType: TagType, metadata?: Record<string, any>) => {
    // Check if assignment already exists
    const existingAssignment = assignments.find(a => 
      a.tagId === tagId && a.entityId === entityId && a.entityType === entityType
    )
    
    if (existingAssignment) {
      return existingAssignment
    }

    const assignment: TagAssignment = {
      id: Math.random().toString(36).substr(2, 9),
      tagId,
      entityId,
      entityType,
      assignedBy: 'current-user',
      assignedAt: new Date(),
      metadata
    }

    const updatedAssignments = [...assignments, assignment]
    setAssignments(updatedAssignments)
    saveAssignmentsToStorage(updatedAssignments)

    // Update tag usage count
    const updatedTags = tags.map(tag =>
      tag.id === tagId
        ? { ...tag, usageCount: tag.usageCount + 1, updatedAt: new Date() }
        : tag
    )
    setTags(updatedTags)
    saveTagsToStorage(updatedTags)

    return assignment
  }

  const removeTag = async (tagId: string, entityId: string, entityType: TagType) => {
    const updatedAssignments = assignments.filter(a => 
      !(a.tagId === tagId && a.entityId === entityId && a.entityType === entityType)
    )
    setAssignments(updatedAssignments)
    saveAssignmentsToStorage(updatedAssignments)

    // Update tag usage count
    const updatedTags = tags.map(tag =>
      tag.id === tagId
        ? { ...tag, usageCount: Math.max(0, tag.usageCount - 1), updatedAt: new Date() }
        : tag
    )
    setTags(updatedTags)
    saveTagsToStorage(updatedTags)
  }

  const getEntityTags = (entityId: string, entityType: TagType) => {
    const entityAssignments = assignments.filter(a => 
      a.entityId === entityId && a.entityType === entityType
    )
    
    return entityAssignments.map(assignment => {
      const tag = tags.find(t => t.id === assignment.tagId)
      return tag ? { ...tag, assignment } : null
    }).filter(Boolean) as (Tag & { assignment: TagAssignment })[]
  }

  const getTagsByType = (type: TagType) => {
    return tags.filter(tag => tag.type.includes(type) && tag.isActive)
  }

  const getTagsByCategory = (category: TagCategory) => {
    return tags.filter(tag => tag.category === category && tag.isActive)
  }

  const searchTags = (query: string, type?: TagType) => {
    let filteredTags = tags.filter(tag => tag.isActive)
    
    if (type) {
      filteredTags = filteredTags.filter(tag => tag.type.includes(type))
    }
    
    if (query) {
      const lowerQuery = query.toLowerCase()
      filteredTags = filteredTags.filter(tag =>
        tag.name.toLowerCase().includes(lowerQuery) ||
        tag.description?.toLowerCase().includes(lowerQuery)
      )
    }
    
    return filteredTags
  }

  const createTagRule = async (ruleData: Partial<TagRule>) => {
    const newRule: TagRule = {
      id: Math.random().toString(36).substr(2, 9),
      name: ruleData.name || '',
      description: ruleData.description || '',
      tagId: ruleData.tagId || '',
      conditions: ruleData.conditions || [],
      isActive: true,
      autoApply: ruleData.autoApply || false,
      priority: ruleData.priority || 1,
      createdBy: 'current-user',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const updatedRules = [...rules, newRule]
    setRules(updatedRules)
    saveRulesToStorage(updatedRules)

    return newRule
  }

  const applyTagRules = async (entityId: string, entityType: TagType, entityData: any) => {
    const applicableRules = rules.filter(rule => 
      rule.isActive && rule.autoApply &&
      tags.find(tag => tag.id === rule.tagId)?.type.includes(entityType)
    )

    for (const rule of applicableRules) {
      const shouldApplyTag = evaluateConditions(rule.conditions, entityData)
      
      if (shouldApplyTag) {
        await assignTag(rule.tagId, entityId, entityType, {
          appliedByRule: rule.id,
          appliedAt: new Date()
        })
      }
    }
  }

  const evaluateConditions = (conditions: TagCondition[], entityData: any): boolean => {
    if (conditions.length === 0) return false

    let result = true
    let currentLogicalOp: 'AND' | 'OR' = 'AND'

    for (let i = 0; i < conditions.length; i++) {
      const condition = conditions[i]
      const fieldValue = getNestedValue(entityData, condition.field)
      const conditionResult = evaluateCondition(condition, fieldValue)

      if (i === 0) {
        result = conditionResult
      } else {
        if (currentLogicalOp === 'AND') {
          result = result && conditionResult
        } else {
          result = result || conditionResult
        }
      }

      // Set logical operator for next iteration
      if (condition.logicalOperator) {
        currentLogicalOp = condition.logicalOperator
      }
    }

    return result
  }

  const evaluateCondition = (condition: TagCondition, fieldValue: any): boolean => {
    const { operator, value } = condition

    switch (operator) {
      case TagOperator.EQUALS:
        return fieldValue === value
      case TagOperator.NOT_EQUALS:
        return fieldValue !== value
      case TagOperator.CONTAINS:
        return String(fieldValue).toLowerCase().includes(String(value).toLowerCase())
      case TagOperator.NOT_CONTAINS:
        return !String(fieldValue).toLowerCase().includes(String(value).toLowerCase())
      case TagOperator.STARTS_WITH:
        return String(fieldValue).toLowerCase().startsWith(String(value).toLowerCase())
      case TagOperator.ENDS_WITH:
        return String(fieldValue).toLowerCase().endsWith(String(value).toLowerCase())
      case TagOperator.GREATER_THAN:
        return Number(fieldValue) > Number(value)
      case TagOperator.LESS_THAN:
        return Number(fieldValue) < Number(value)
      case TagOperator.BETWEEN:
        const [min, max] = Array.isArray(value) ? value : [0, 0]
        return Number(fieldValue) >= Number(min) && Number(fieldValue) <= Number(max)
      case TagOperator.IN:
        return Array.isArray(value) ? value.includes(fieldValue) : false
      case TagOperator.NOT_IN:
        return Array.isArray(value) ? !value.includes(fieldValue) : true
      case TagOperator.IS_EMPTY:
        return !fieldValue || fieldValue === '' || (Array.isArray(fieldValue) && fieldValue.length === 0)
      case TagOperator.IS_NOT_EMPTY:
        return fieldValue && fieldValue !== '' && (!Array.isArray(fieldValue) || fieldValue.length > 0)
      default:
        return false
    }
  }

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  const createSegment = async (segmentData: Partial<TagSegment>) => {
    const newSegment: TagSegment = {
      id: Math.random().toString(36).substr(2, 9),
      name: segmentData.name || '',
      description: segmentData.description || '',
      entityType: segmentData.entityType || TagType.LEAD,
      filters: segmentData.filters || [],
      conditions: segmentData.conditions || [],
      isActive: true,
      entityCount: 0,
      lastCalculated: new Date(),
      createdBy: 'current-user',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const updatedSegments = [...segments, newSegment]
    setSegments(updatedSegments)
    saveSegmentsToStorage(updatedSegments)

    return newSegment
  }

  const calculateSegmentEntities = (segment: TagSegment, entities: any[]) => {
    return entities.filter(entity => {
      // Check tag filters
      for (const filter of segment.filters) {
        const entityTags = getEntityTags(entity.id, segment.entityType)
        const entityTagIds = entityTags.map(t => t.id)
        
        const hasMatchingTags = filter.operator === 'AND'
          ? filter.tagIds.every(tagId => entityTagIds.includes(tagId))
          : filter.tagIds.some(tagId => entityTagIds.includes(tagId))
        
        if (filter.exclude ? hasMatchingTags : !hasMatchingTags) {
          return false
        }
      }

      // Check conditions
      if (segment.conditions.length > 0) {
        return evaluateConditions(segment.conditions, entity)
      }

      return true
    })
  }

  const bulkAssignTags = async (tagIds: string[], entityIds: string[], entityType: TagType) => {
    const operation: BulkTagOperation = {
      id: Math.random().toString(36).substr(2, 9),
      operation: 'add',
      tagIds,
      entityIds,
      entityType,
      status: 'processing',
      progress: 0,
      totalEntities: entityIds.length,
      processedEntities: 0,
      errors: [],
      createdBy: 'current-user',
      createdAt: new Date()
    }

    setBulkOperations(prev => [...prev, operation])

    // Process assignments
    for (let i = 0; i < entityIds.length; i++) {
      const entityId = entityIds[i]
      
      for (const tagId of tagIds) {
        try {
          await assignTag(tagId, entityId, entityType)
        } catch (error) {
          operation.errors.push(`Failed to assign tag ${tagId} to entity ${entityId}`)
        }
      }

      operation.processedEntities = i + 1
      operation.progress = Math.round((operation.processedEntities / operation.totalEntities) * 100)
      
      setBulkOperations(prev => prev.map(op => 
        op.id === operation.id ? { ...operation } : op
      ))
    }

    operation.status = 'completed'
    operation.completedAt = new Date()
    
    setBulkOperations(prev => prev.map(op => 
      op.id === operation.id ? { ...operation } : op
    ))

    return operation
  }

  const generateTagSuggestions = async (entityId: string, entityType: TagType, entityData: any) => {
    const suggestions: TagSuggestion['suggestedTags'] = []
    const availableTags = getTagsByType(entityType)

    // AI-like suggestions based on entity data
    for (const tag of availableTags) {
      let confidence = 0
      let reason = ''

      // Score-based suggestions for leads
      if (entityType === TagType.LEAD && entityData.score) {
        if (tag.name === 'Hot Lead' && entityData.score > 80) {
          confidence = 90
          reason = `High lead score (${entityData.score})`
        } else if (tag.name === 'Warm Lead' && entityData.score > 60 && entityData.score <= 80) {
          confidence = 85
          reason = `Good lead score (${entityData.score})`
        } else if (tag.name === 'Cold Lead' && entityData.score <= 60) {
          confidence = 80
          reason = `Low lead score (${entityData.score})`
        }
      }

      // Value-based suggestions for deals
      if (entityType === TagType.DEAL && entityData.value) {
        if (tag.name === 'High Value' && entityData.value > 100000) {
          confidence = 95
          reason = `Deal value over $100k (${entityData.value})`
        } else if (tag.name === 'Quick Close' && entityData.expectedCloseDate) {
          const daysToClose = Math.ceil((new Date(entityData.expectedCloseDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          if (daysToClose <= 30) {
            confidence = 85
            reason = `Expected to close in ${daysToClose} days`
          }
        }
      }

      // Behavior-based suggestions for clients
      if (entityType === TagType.CLIENT) {
        // This would analyze client behavior patterns
        if (tag.name === 'VIP Client' && entityData.totalPurchases > 200000) {
          confidence = 90
          reason = 'High lifetime value customer'
        }
      }

      if (confidence > 0) {
        suggestions.push({
          tagId: tag.id,
          tagName: tag.name,
          confidence,
          reason
        })
      }
    }

    const suggestion: TagSuggestion = {
      id: Math.random().toString(36).substr(2, 9),
      entityId,
      entityType,
      suggestedTags: suggestions.sort((a, b) => b.confidence - a.confidence),
      generatedAt: new Date(),
      isApplied: false
    }

    setSuggestions(prev => [...prev, suggestion])
    return suggestion
  }

  const getTagAnalytics = (tagId: string): TagAnalytics => {
    const tag = tags.find(t => t.id === tagId)
    if (!tag) throw new Error('Tag not found')

    const tagAssignments = assignments.filter(a => a.tagId === tagId)
    
    const entityBreakdown = tagAssignments.reduce((acc, assignment) => {
      acc[assignment.entityType] = (acc[assignment.entityType] || 0) + 1
      return acc
    }, {} as Record<TagType, number>)

    // Generate trend data (mock for now)
    const trendData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return {
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 10)
      }
    })

    return {
      tagId,
      tagName: tag.name,
      totalUsage: tag.usageCount,
      entityBreakdown,
      trendData,
      topEntities: tagAssignments.slice(0, 10).map(assignment => ({
        entityId: assignment.entityId,
        entityName: `Entity ${assignment.entityId}`,
        entityType: assignment.entityType
      }))
    }
  }

  const filterEntitiesByTags = (entities: any[], filters: TagFilter[], entityType: TagType) => {
    return entities.filter(entity => {
      for (const filter of filters) {
        const entityTags = getEntityTags(entity.id, entityType)
        const entityTagIds = entityTags.map(t => t.id)
        
        const hasMatchingTags = filter.operator === 'AND'
          ? filter.tagIds.every(tagId => entityTagIds.includes(tagId))
          : filter.tagIds.some(tagId => entityTagIds.includes(tagId))
        
        if (filter.exclude ? hasMatchingTags : !hasMatchingTags) {
          return false
        }
      }
      return true
    })
  }

  return {
    tags,
    assignments,
    rules,
    segments,
    bulkOperations,
    suggestions,
    loading,
    createTag,
    updateTag,
    deleteTag,
    assignTag,
    removeTag,
    getEntityTags,
    getTagsByType,
    getTagsByCategory,
    searchTags,
    createTagRule,
    applyTagRules,
    createSegment,
    calculateSegmentEntities,
    bulkAssignTags,
    generateTagSuggestions,
    getTagAnalytics,
    filterEntitiesByTags
  }
}

export { totalUsage }