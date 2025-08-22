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
    days: number[]
  }
}

export function useCalendarData() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [resources, setResources] = useState<CalendarResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedEvents = loadFromLocalStorage<CalendarEvent[]>('calendar-events', [])
      const savedResources = loadFromLocalStorage<CalendarResource[]>('calendar-resources', [])
      
      // Convert date strings back to Date objects
      const eventsWithDates = (savedEvents || []).map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt)
      }))
      
      setEvents(eventsWithDates)
      setResources(savedResources || [])
    } catch (err) {
      console.error('Failed to load calendar data:', err)
      setError('Failed to load calendar data')
    } finally {
      setLoading(false)
    }
  }, [])

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (events.length > 0 || !loading) {
      saveToLocalStorage('calendar-events', events)
    }
  }, [events, loading])

  // Save resources to localStorage whenever they change
  useEffect(() => {
    if (resources.length > 0 || !loading) {
      saveToLocalStorage('calendar-resources', resources)
    }
  }, [resources, loading])

  // Transform events for calendar display with defensive checks
  const calendarEvents = useMemo(() => {
    return (events || []).map(event => {
      const resource = (resources || []).find(r => r?.id === event.resource)
      
      return {
        ...event,
        resourceTitle: resource?.title || 'Unassigned',
        resourceType: resource?.type || 'unknown'
      }
    })
  }, [events, resources])

  // Get events for a specific date range
  const getEventsInRange = (start: Date, end: Date) => {
    return (events || []).filter(event => {
      if (!event?.start || !event?.end) return false
      return event.start >= start && event.end <= end
    })
  }

  // Get events for a specific resource
  const getEventsByResource = (resourceId: string) => {
    return (events || []).filter(event => event?.resource === resourceId)
  }

  // Create a new event
  const createEvent = async (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    setEvents(prev => [...(prev || []), newEvent])
    return newEvent
  }

  // Update an existing event
  const updateEvent = async (eventId: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => (prev || []).map(event => 
      event?.id === eventId 
        ? { ...event, ...updates, updatedAt: new Date() }
        : event
    ))
  }

  // Delete an event
  const deleteEvent = async (eventId: string) => {
    setEvents(prev => (prev || []).filter(event => event?.id !== eventId))
  }

  // Create a new resource
  const createResource = async (resourceData: Omit<CalendarResource, 'id'>) => {
    const newResource: CalendarResource = {
      ...resourceData,
      id: `resource-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    
    setResources(prev => [...(prev || []), newResource])
    return newResource
  }

  // Update an existing resource
  const updateResource = async (resourceId: string, updates: Partial<CalendarResource>) => {
    setResources(prev => (prev || []).map(resource => 
      resource?.id === resourceId 
        ? { ...resource, ...updates }
        : resource
    ))
  }

  // Delete a resource
  const deleteResource = async (resourceId: string) => {
    setResources(prev => (prev || []).filter(resource => resource?.id !== resourceId))
  }

  // Calendar metrics
  const metrics = useMemo(() => {
    const safeEvents = events || []
    const safeResources = resources || []
    
    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6))
    
    const thisWeekEvents = safeEvents.filter(event => {
      if (!event?.start) return false
      const eventDate = new Date(event.start)
      return eventDate >= startOfWeek && eventDate <= endOfWeek
    })
    
    const confirmedEvents = safeEvents.filter(event => event?.status === 'confirmed')
    const tentativeEvents = safeEvents.filter(event => event?.status === 'tentative')
    
    return {
      totalEvents: safeEvents.length,
      thisWeekEvents: thisWeekEvents.length,
      confirmedEvents: confirmedEvents.length,
      tentativeEvents: tentativeEvents.length,
      totalResources: safeResources.length,
      activeResources: safeResources.filter(r => r?.isActive).length
    }
  }, [events, resources])

  return {
    events: events || [],
    resources: resources || [],
    calendarEvents,
    loading,
    error,
    metrics,
    getEventsInRange,
    getEventsByResource,
    createEvent,
    updateEvent,
    deleteEvent,
    createResource,
    updateResource,
    deleteResource
  }
}