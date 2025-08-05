import { useState, useCallback } from 'react'
import { CalendarEvent } from '../types'
import { useServiceManagement } from '@/modules/service-ops/hooks/useServiceManagement'
import { useDeliveryManagement } from '@/modules/delivery-tracker/hooks/useDeliveryManagement'
import { useTasks } from '@/hooks/useTasks'
import { usePDIManagement } from '@/modules/pdi-checklist/hooks/usePDIManagement'
import { useInventoryManagement } from '@/modules/inventory-management/hooks/useInventoryManagement'
import { useLeadManagement } from '@/modules/crm-prospecting/hooks/useLeadManagement'
import { ServiceTicket, ServiceStatus, Priority } from '@/types'
import { Delivery, DeliveryStatus } from '@/types'
import { Task, TaskStatus, TaskPriority, TaskModule } from '@/types'
import { PDIInspection, PDIInspectionStatus } from '@/modules/pdi-checklist/types'

export function useCalendarManagement() {
  const { createTicket, updateTicket } = useServiceManagement()
  const { createDelivery, updateDelivery } = useDeliveryManagement()
  const { createTask, updateTask } = useTasks()
  const { createInspection, updateInspection } = usePDIManagement()
  const { vehicles } = useInventoryManagement()
  const { leads } = useLeadManagement()
  
  const [loading, setLoading] = useState(false)

  // Create a new event and sync to appropriate module
  const createCalendarEvent = useCallback(async (eventData: Partial<CalendarEvent>) => {
    setLoading(true)
    try {
      let sourceId: string

      switch (eventData.sourceModule) {
        case 'service':
          const serviceTicket = await createTicket({
            title: eventData.title || '',
            description: eventData.description || '',
            customerId: eventData.customerId || '',
            vehicleId: eventData.vehicleId,
            priority: mapPriorityToService(eventData.priority),
            status: mapStatusToService(eventData.status),
            assignedTo: eventData.assignedTo,
            scheduledDate: eventData.start,
            notes: `Created from calendar on ${new Date().toLocaleString()}`,
            parts: [],
            labor: [],
            customFields: {
              createdFromCalendar: true,
              calendarEventId: `calendar-${Date.now()}`
            }
          })
          sourceId = serviceTicket.id
          break

        case 'delivery':
          const delivery = await createDelivery({
            customerId: eventData.customerId || '',
            vehicleId: eventData.vehicleId || '',
            status: mapStatusToDelivery(eventData.status),
            scheduledDate: eventData.start || new Date(),
            address: parseAddressFromLocation(eventData.location),
            notes: eventData.description || `Created from calendar on ${new Date().toLocaleString()}`,
            customFields: {
              createdFromCalendar: true,
              calendarEventId: `calendar-${Date.now()}`
            }
          })
          sourceId = delivery.id
          break

        case 'task':
          const task = await createTask({
            title: eventData.title || '',
            description: eventData.description || '',
            status: mapStatusToTask(eventData.status),
            priority: mapPriorityToTask(eventData.priority),
            module: TaskModule.CRM, // Default module
            assignedTo: eventData.assignedTo,
            dueDate: eventData.start || new Date(),
            sourceId: `calendar-${Date.now()}`,
            sourceType: 'calendar_event',
            customFields: {
              createdFromCalendar: true,
              calendarEventId: `calendar-${Date.now()}`,
              customerId: eventData.customerId,
              vehicleId: eventData.vehicleId
            }
          })
          sourceId = task.id
          break

        case 'pdi':
          const inspection = await createInspection({
            vehicleId: eventData.vehicleId || '',
            inspectorId: eventData.assignedTo || 'current-user',
            templateId: 'default-template', // Would need to be selected
            notes: eventData.description || `Created from calendar on ${new Date().toLocaleString()}`,
            customFields: {
              createdFromCalendar: true,
              calendarEventId: `calendar-${Date.now()}`
            }
          })
          sourceId = inspection.id
          break

        default:
          throw new Error(`Unsupported source module: ${eventData.sourceModule}`)
      }

      return {
        ...eventData,
        id: `${eventData.sourceModule}-${sourceId}`,
        sourceId
      } as CalendarEvent

    } finally {
      setLoading(false)
    }
  }, [createTicket, createDelivery, createTask, createInspection])

  // Update an existing event and sync to appropriate module
  const updateCalendarEvent = useCallback(async (eventId: string, eventData: Partial<CalendarEvent>) => {
    setLoading(true)
    try {
      const [sourceModule, sourceId] = eventId.split('-', 2)

      switch (sourceModule) {
        case 'service':
          await updateTicket(sourceId, {
            title: eventData.title,
            description: eventData.description,
            customerId: eventData.customerId,
            vehicleId: eventData.vehicleId,
            priority: mapPriorityToService(eventData.priority),
            status: mapStatusToService(eventData.status),
            assignedTo: eventData.assignedTo,
            scheduledDate: eventData.start,
            notes: eventData.description,
            customFields: {
              lastModifiedFromCalendar: new Date().toISOString()
            }
          })
          break

        case 'delivery':
          await updateDelivery(sourceId, {
            customerId: eventData.customerId,
            vehicleId: eventData.vehicleId,
            status: mapStatusToDelivery(eventData.status),
            scheduledDate: eventData.start,
            address: parseAddressFromLocation(eventData.location),
            notes: eventData.description,
            customFields: {
              lastModifiedFromCalendar: new Date().toISOString()
            }
          })
          break

        case 'task':
          await updateTask(sourceId, {
            title: eventData.title,
            description: eventData.description,
            status: mapStatusToTask(eventData.status),
            priority: mapPriorityToTask(eventData.priority),
            assignedTo: eventData.assignedTo,
            dueDate: eventData.start,
            customFields: {
              lastModifiedFromCalendar: new Date().toISOString(),
              customerId: eventData.customerId,
              vehicleId: eventData.vehicleId
            }
          })
          break

        case 'pdi':
          await updateInspection(sourceId, {
            inspectorId: eventData.assignedTo,
            notes: eventData.description,
            customFields: {
              lastModifiedFromCalendar: new Date().toISOString()
            }
          })
          break

        default:
          throw new Error(`Unsupported source module: ${sourceModule}`)
      }

    } finally {
      setLoading(false)
    }
  }, [updateTicket, updateDelivery, updateTask, updateInspection])

  // Delete an event and sync to appropriate module
  const deleteCalendarEvent = useCallback(async (eventId: string) => {
    setLoading(true)
    try {
      const [sourceModule, sourceId] = eventId.split('-', 2)

      switch (sourceModule) {
        case 'service':
          // For service tickets, we might want to cancel rather than delete
          await updateTicket(sourceId, {
            status: ServiceStatus.CANCELLED,
            notes: `Cancelled from calendar on ${new Date().toLocaleString()}`
          })
          break

        case 'delivery':
          await updateDelivery(sourceId, {
            status: DeliveryStatus.CANCELLED,
            notes: `Cancelled from calendar on ${new Date().toLocaleString()}`
          })
          break

        case 'task':
          await updateTask(sourceId, {
            status: TaskStatus.CANCELLED
          })
          break

        case 'pdi':
          // For PDI, we might want to mark as cancelled rather than delete
          await updateInspection(sourceId, {
            notes: `Cancelled from calendar on ${new Date().toLocaleString()}`
          })
          break

        default:
          throw new Error(`Unsupported source module: ${sourceModule}`)
      }

    } finally {
      setLoading(false)
    }
  }, [updateTicket, updateDelivery, updateTask, updateInspection])

  // Drag and drop event rescheduling
  const rescheduleEvent = useCallback(async (eventId: string, newStart: Date, newEnd: Date) => {
    setLoading(true)
    try {
      const [sourceModule, sourceId] = eventId.split('-', 2)

      switch (sourceModule) {
        case 'service':
          await updateTicket(sourceId, {
            scheduledDate: newStart,
            customFields: {
              rescheduledFromCalendar: new Date().toISOString(),
              originalScheduledDate: new Date().toISOString()
            }
          })
          break

        case 'delivery':
          await updateDelivery(sourceId, {
            scheduledDate: newStart,
            customFields: {
              rescheduledFromCalendar: new Date().toISOString()
            }
          })
          break

        case 'task':
          await updateTask(sourceId, {
            dueDate: newStart,
            customFields: {
              rescheduledFromCalendar: new Date().toISOString()
            }
          })
          break

        case 'pdi':
          // PDI inspections don't have a direct scheduled date, but we can update notes
          await updateInspection(sourceId, {
            notes: `Rescheduled from calendar to ${newStart.toLocaleString()}`
          })
          break

        default:
          throw new Error(`Unsupported source module: ${sourceModule}`)
      }

    } finally {
      setLoading(false)
    }
  }, [updateTicket, updateDelivery, updateTask, updateInspection])

  return {
    loading,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    rescheduleEvent
  }
}

// Helper functions to map calendar values to module-specific values
function mapPriorityToService(priority?: string): Priority {
  switch (priority) {
    case 'low': return Priority.LOW
    case 'medium': return Priority.MEDIUM
    case 'high': return Priority.HIGH
    case 'urgent': return Priority.URGENT
    default: return Priority.MEDIUM
  }
}

function mapStatusToService(status?: string): ServiceStatus {
  switch (status) {
    case 'open': return ServiceStatus.OPEN
    case 'in_progress': return ServiceStatus.IN_PROGRESS
    case 'waiting_parts': return ServiceStatus.WAITING_PARTS
    case 'completed': return ServiceStatus.COMPLETED
    case 'cancelled': return ServiceStatus.CANCELLED
    default: return ServiceStatus.OPEN
  }
}

function mapStatusToDelivery(status?: string): DeliveryStatus {
  switch (status) {
    case 'scheduled': return DeliveryStatus.SCHEDULED
    case 'in_transit': return DeliveryStatus.IN_TRANSIT
    case 'delivered': return DeliveryStatus.DELIVERED
    case 'cancelled': return DeliveryStatus.CANCELLED
    default: return DeliveryStatus.SCHEDULED
  }
}

function mapPriorityToTask(priority?: string): TaskPriority {
  switch (priority) {
    case 'low': return TaskPriority.LOW
    case 'medium': return TaskPriority.MEDIUM
    case 'high': return TaskPriority.HIGH
    case 'urgent': return TaskPriority.URGENT
    default: return TaskPriority.MEDIUM
  }
}

function mapStatusToTask(status?: string): TaskStatus {
  switch (status) {
    case 'pending': return TaskStatus.PENDING
    case 'in_progress': return TaskStatus.IN_PROGRESS
    case 'on_hold': return TaskStatus.ON_HOLD
    case 'completed': return TaskStatus.COMPLETED
    case 'cancelled': return TaskStatus.CANCELLED
    default: return TaskStatus.PENDING
  }
}

function parseAddressFromLocation(location?: string) {
  if (!location) {
    return {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    }
  }

  // Simple address parsing - in a real app, you might use a geocoding service
  const parts = location.split(',').map(part => part.trim())
  
  return {
    street: parts[0] || '',
    city: parts[1] || '',
    state: parts[2] || '',
    zipCode: parts[3] || '',
    country: 'USA'
  }
}