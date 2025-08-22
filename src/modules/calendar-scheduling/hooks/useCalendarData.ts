import { useState, useEffect, useMemo } from 'react'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  allDay?: boolean
  resource?: string
  description?: string
  attendees?: string[]
  location?: string
  type?: 'appointment' | 'delivery' | 'service' | 'meeting'
  status?: 'confirmed' | 'tentative' | 'cancelled'
  customerId?: string
  vehicleId?: string
  createdAt: Date
  updatedAt: Date
}

export interface CalendarResource {
  id: string
  title: string
  type: 'technician' | 'delivery_truck' | 'meeting_room'
  isActive: boolean
  capacity?: number
  workingHours?: {
    start: string
    end: string
    daysOfWeek: number[]
  }
}

export function useCalendarData() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [resources, setResources] = useState<CalendarResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Transform events for calendar display with proper null checks
  const calendarEvents = useMemo(() => {
    if (!Array.isArray(events)) return []
    
    return events.map(event => {
      // Ensure we have valid event data
      if (!event || typeof event !== 'object') return null
      
      // Find resource with null check
      const resource = Array.isArray(resources) 
        ? resources.find(r => r && r.id === event.resource) 
        : null

      return {
        id: event.id || '',
        title: event.title || 'Untitled Event',
        start: event.start ? new Date(event.start) : new Date(),
        end: event.end ? new Date(event.end) : new Date(),
        allDay: event.allDay || false,
        resource: resource?.title || event.resource || undefined,
        description: event.description || '',
        attendees: Array.isArray(event.attendees) ? event.attendees : [],
        location: event.location || '',
        type: event.type || 'appointment',
        status: event.status || 'confirmed'
      }
    }).filter(Boolean) // Remove any null entries
  }, [events, resources])

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load events from localStorage with fallback
        const savedEvents = loadFromLocalStorage<CalendarEvent[]>('calendar-events', [])
        const savedResources = loadFromLocalStorage<CalendarResource[]>('calendar-resources', [])

        // Ensure we have arrays
        const eventsArray = Array.isArray(savedEvents) ? savedEvents : []
        const resourcesArray = Array.isArray(savedResources) ? savedResources : []

        // If no data exists, create sample data
        if (eventsArray.length === 0) {
          const sampleEvents: CalendarEvent[] = [
            {
              id: 'event-1',
              title: 'RV Delivery - John Smith',
              start: new Date(2024, 1, 15, 10, 0),
              end: new Date(2024, 1, 15, 12, 0),
              type: 'delivery',
              status: 'confirmed',
              customerId: 'cust-001',
              vehicleId: 'veh-001',
              location: '123 Main St, Austin, TX',
              description: 'Deliver 2023 Forest River Cherokee',
              attendees: ['delivery-team@company.com'],
              resource: 'truck-1',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              id: 'event-2',
              title: 'Service Appointment - AC Repair',
              start: new Date(2024, 1, 16, 14, 0),
              end: new Date(2024, 1, 16, 16, 0),
              type: 'service',
              status: 'confirmed',
              customerId: 'cust-002',
              vehicleId: 'veh-002',
              location: 'Service Bay 2',
              description: 'AC unit not cooling properly',
              attendees: ['tech-sarah@company.com'],
              resource: 'tech-1',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ]
          setEvents(sampleEvents)
          saveToLocalStorage('calendar-events', sampleEvents)
        } else {
          setEvents(eventsArray)
        }

        if (resourcesArray.length === 0) {
          const sampleResources: CalendarResource[] = [
            {
              id: 'tech-1',
              title: 'Sarah Davis (Technician)',
              type: 'technician',
              isActive: true,
              workingHours: {
                start: '08:00',
                end: '17:00',
                daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
              }
            },
            {
              id: 'truck-1',
              title: 'Delivery Truck #1',
              type: 'delivery_truck',
              isActive: true,
              capacity: 1,
              workingHours: {
                start: '07:00',
                end: '18:00',
                daysOfWeek: [1, 2, 3, 4, 5, 6] // Monday to Saturday
              }
            },
            {
              id: 'room-1',
              title: 'Conference Room A',
              type: 'meeting_room',
              isActive: true,
              capacity: 8,
              workingHours: {
                start: '08:00',
                end: '18:00',
                daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
              }
            }
          ]
          setResources(sampleResources)
          saveToLocalStorage('calendar-resources', sampleResources)
        } else {
          setResources(resourcesArray)
        }

      } catch (err) {
        console.error('Error loading calendar data:', err)
        setError('Failed to load calendar data')
        // Set empty arrays as fallback
        setEvents([])
        setResources([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Create new event
  const createEvent = async (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<CalendarEvent> => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const updatedEvents = [...(events || []), newEvent]
    setEvents(updatedEvents)
    saveToLocalStorage('calendar-events', updatedEvents)

    return newEvent
  }

  // Update existing event
  const updateEvent = async (eventId: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent | null> => {
    if (!Array.isArray(events)) return null
    
    const eventIndex = events.findIndex(e => e && e.id === eventId)
    if (eventIndex === -1) return null

    const updatedEvent = {
      ...events[eventIndex],
      ...updates,
      updatedAt: new Date()
    }

    const updatedEvents = [...events]
    updatedEvents[eventIndex] = updatedEvent
    setEvents(updatedEvents)
    saveToLocalStorage('calendar-events', updatedEvents)

    return updatedEvent
  }

  // Delete event
  const deleteEvent = async (eventId: string): Promise<void> => {
    if (!Array.isArray(events)) return
    
    const updatedEvents = events.filter(e => e && e.id !== eventId)
    setEvents(updatedEvents)
    saveToLocalStorage('calendar-events', updatedEvents)
  }

  // Create new resource
  const createResource = async (resourceData: Omit<CalendarResource, 'id'>): Promise<CalendarResource> => {
    const newResource: CalendarResource = {
      ...resourceData,
      id: `resource-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    const updatedResources = [...(resources || []), newResource]
    setResources(updatedResources)
    saveToLocalStorage('calendar-resources', updatedResources)

    return newResource
  }

  // Update existing resource
  const updateResource = async (resourceId: string, updates: Partial<CalendarResource>): Promise<CalendarResource | null> => {
    if (!Array.isArray(resources)) return null
    
    const resourceIndex = resources.findIndex(r => r && r.id === resourceId)
    if (resourceIndex === -1) return null

    const updatedResource = {
      ...resources[resourceIndex],
      ...updates
    }

    const updatedResources = [...resources]
    updatedResources[resourceIndex] = updatedResource
    setResources(updatedResources)
    saveToLocalStorage('calendar-resources', updatedResources)

    return updatedResource
  }

  // Delete resource
  const deleteResource = async (resourceId: string): Promise<void> => {
    if (!Array.isArray(resources)) return
    
    const updatedResources = resources.filter(r => r && r.id !== resourceId)
    setResources(updatedResources)
    saveToLocalStorage('calendar-resources', updatedResources)
  }

  // Get events for a specific date range
  const getEventsInRange = (startDate: Date, endDate: Date): CalendarEvent[] => {
    if (!Array.isArray(events)) return []
    
    return events.filter(event => {
      if (!event || !event.start || !event.end) return false
      
      const eventStart = new Date(event.start)
      const eventEnd = new Date(event.end)
      
      return eventStart <= endDate && eventEnd >= startDate
    })
  }

  // Get events for a specific resource
  const getEventsByResource = (resourceId: string): CalendarEvent[] => {
    if (!Array.isArray(events)) return []
    
    return events.filter(event => event && event.resource === resourceId)
  }

  // Check if a resource is available at a specific time
  const isResourceAvailable = (resourceId: string, start: Date, end: Date, excludeEventId?: string): boolean => {
    if (!Array.isArray(events)) return true
    
    const conflictingEvents = events.filter(event => {
      if (!event || event.id === excludeEventId || event.resource !== resourceId) return false
      
      const eventStart = new Date(event.start)
      const eventEnd = new Date(event.end)
      
      return start < eventEnd && end > eventStart
    })

    return conflictingEvents.length === 0
  }

  return {
    events: events || [],
    resources: resources || [],
    calendarEvents: calendarEvents || [],
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    createResource,
    updateResource,
    deleteResource,
    getEventsInRange,
    getEventsByResource,
    isResourceAvailable
  }
}