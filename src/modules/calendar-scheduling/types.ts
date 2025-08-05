export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  allDay?: boolean
  resource?: any
  sourceModule: 'service' | 'delivery' | 'task' | 'pdi'
  sourceId: string
  status: string
  priority?: string
  assignedTo?: string
  customerId?: string
  vehicleId?: string
  description?: string
  location?: string
  metadata?: Record<string, any>
}

export interface CalendarFilter {
  showService: boolean
  showDelivery: boolean
  showTasks: boolean
  showPDI: boolean
  assignedToFilter: string
  statusFilter: string
  priorityFilter: string
}

export interface CalendarView {
  view: 'month' | 'week' | 'day' | 'agenda'
  date: Date
}

export interface EventTypeConfig {
  color: string
  icon: string
  label: string
  enabled: boolean
}

export interface CalendarSettings {
  defaultView: 'month' | 'week' | 'day'
  startHour: number
  endHour: number
  eventTypes: Record<string, EventTypeConfig>
  showWeekends: boolean
  timeZone: string
}

export interface ExternalCalendarConnection {
  google: boolean;
  outlook: boolean;
  lastSync?: Date;
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number
  daysOfWeek?: number[] // 0 = Sunday, 1 = Monday, etc.
  dayOfMonth?: number
  weekOfMonth?: number
  endType: 'never' | 'after' | 'on'
  endAfter?: number
  endOn?: Date
  exceptions?: Date[]
}

export interface SyncSettings {
  twoWaySync: boolean
  syncInterval: number // minutes
  conflictResolution: 'bolt_wins' | 'external_wins' | 'manual'
  syncModules: {
    service: boolean
    delivery: boolean
    tasks: boolean
    pdi: boolean
  }
  externalCalendars: {
    google: {
      enabled: boolean
      calendarId?: string
      syncDirection: 'export_only' | 'import_only' | 'bidirectional'
    }
    outlook: {
      enabled: boolean
      calendarId?: string
      syncDirection: 'export_only' | 'import_only' | 'bidirectional'
    }
  }
  filters: {
    onlyAssignedToMe: boolean
    excludeCompleted: boolean
    priorityFilter: string[]
    statusFilter: string[]
  }
}

export interface EventConflict {
  id: string
  eventId: string
  conflictType: 'time_overlap' | 'data_mismatch' | 'deletion_conflict'
  boltEvent: CalendarEvent
  externalEvent: CalendarEvent
  conflictFields: string[]
  detectedAt: Date
  status: 'pending' | 'resolved' | 'ignored'
}

export interface ResourceBooking {
  id: string
  resourceId: string
  eventId: string
  startTime: Date
  endTime: Date
  bookedBy: string
  notes?: string
}

export interface CalendarResource {
  id: string
  name: string
  type: 'room' | 'equipment' | 'vehicle' | 'person'
  capacity?: number
  location?: string
  isAvailable: boolean
  bookings: ResourceBooking[]
}

export interface OptimizationSuggestion {
  id: string
  type: 'reschedule' | 'redistribute' | 'consolidate' | 'buffer_time' | 'resource_conflict'
  title: string
  description: string
  confidence: number
  impact: 'low' | 'medium' | 'high'
  affectedEvents: string[]
  estimatedTimeSaving: number
  estimatedEfficiencyGain: number
}

export interface SchedulingSuggestion {
  id: string
  type: 'optimal_time' | 'resource_optimization' | 'travel_optimization' | 'workload_balance' | 'customer_preference'
  title: string
  description: string
  confidence: number
  priority: 'low' | 'medium' | 'high'
  eventId?: string
  suggestedTime?: Date
  suggestedAssignee?: string
  estimatedImprovement: string
  reasoning: string[]
  actionRequired: boolean
}

export interface TeamMember {
  id: string
  name: string
  role: string
  capacity: number
  currentLoad: number
  efficiency: number
  specialties: string[]
}

export interface CalendarAnalyticsData {
  totalEvents: number
  completedEvents: number
  overdueEvents: number
  utilizationRate: number
  moduleStats: Record<string, any>
  assigneeStats: Record<string, any>
  timeUtilization: {
    totalScheduledHours: number
    productiveHours: number
    wastedHours: number
    utilizationRate: number
  }
}

export interface ReportConfig {
  name: string
  description: string
  dateRange: {
    start: Date
    end: Date
  }
  modules: string[]
  statuses: string[]
  assignees: string[]
  includeMetrics: boolean
  includeCharts: boolean
  format: 'pdf' | 'excel' | 'csv'
  schedule?: {
    enabled: boolean
    frequency: 'daily' | 'weekly' | 'monthly'
    recipients: string[]
  }
}