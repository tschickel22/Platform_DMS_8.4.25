export enum TagType {
  LEAD = 'lead',
  DEAL = 'deal',
  CLIENT = 'client',
  INVENTORY = 'inventory',
  CUSTOM = 'custom'
}

export enum TagCategory {
  STATUS = 'status',
  PRIORITY = 'priority',
  SOURCE = 'source',
  BEHAVIOR = 'behavior',
  DEMOGRAPHIC = 'demographic',
  PRODUCT = 'product',
  LOCATION = 'location',
  CUSTOM = 'custom'
}

export interface Tag {
  id: string
  name: string
  description?: string
  color: string
  category: TagCategory
  type: TagType[]
  isSystem: boolean
  isActive: boolean
  usageCount: number
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface TagAssignment {
  id: string
  tagId: string
  entityId: string
  entityType: TagType
  assignedBy: string
  assignedAt: Date
  metadata?: Record<string, any>
}

export interface TagRule {
  id: string
  name: string
  description: string
  tagId: string
  conditions: TagCondition[]
  isActive: boolean
  autoApply: boolean
  priority: number
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface TagCondition {
  id: string
  field: string
  operator: TagOperator
  value: any
  logicalOperator?: 'AND' | 'OR'
}

export enum TagOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  BETWEEN = 'between',
  IN = 'in',
  NOT_IN = 'not_in',
  IS_EMPTY = 'is_empty',
  IS_NOT_EMPTY = 'is_not_empty'
}

export interface TagFilter {
  tagIds: string[]
  operator: 'AND' | 'OR'
  exclude?: boolean
}

export interface TagSegment {
  id: string
  name: string
  description: string
  entityType: TagType
  filters: TagFilter[]
  conditions: TagCondition[]
  isActive: boolean
  entityCount: number
  lastCalculated: Date
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface TagAnalytics {
  tagId: string
  tagName: string
  totalUsage: number
  entityBreakdown: Record<TagType, number>
  trendData: Array<{
    date: string
    count: number
  }>
  topEntities: Array<{
    entityId: string
    entityName: string
    entityType: TagType
  }>
}

export interface TagSuggestion {
  id: string
  entityId: string
  entityType: TagType
  suggestedTags: Array<{
    tagId: string
    tagName: string
    confidence: number
    reason: string
  }>
  generatedAt: Date
  isApplied: boolean
}

export interface BulkTagOperation {
  id: string
  operation: 'add' | 'remove' | 'replace'
  tagIds: string[]
  entityIds: string[]
  entityType: TagType
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  totalEntities: number
  processedEntities: number
  errors: string[]
  createdBy: string
  createdAt: Date
  completedAt?: Date
}