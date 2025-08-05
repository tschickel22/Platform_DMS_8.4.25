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