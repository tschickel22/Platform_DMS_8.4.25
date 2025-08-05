import { useState, useEffect, useMemo } from 'react'
import { CalendarEvent, CalendarFilter } from '../types'
import { useServiceManagement } from '@/modules/service-ops/hooks/useServiceManagement'
import { useDeliveryManagement } from '@/modules/delivery-tracker/hooks/useDeliveryManagement'
import { useTasks } from '@/hooks/useTasks'
import { usePDIManagement } from '@/modules/pdi-checklist/hooks/usePDIManagement'
import { useInventoryManagement } from '@/modules/inventory-management/hooks/useInventoryManagement'
import { useLeadManagement } from '@/modules/crm-prospecting/hooks/useLeadManagement'

export function useCalendarData() {
  const { tickets } = useServiceManagement()
  const { deliveries } = useDeliveryManagement()
  const { tasks } = useTasks()
  const { inspections } = usePDIManagement()
  const { vehicles } = useInventoryManagement()
  const { leads, salesReps } = useLeadManagement()
  
  // Add refresh trigger to force re-render when data changes
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  
  // Trigger refresh when any source data changes
  useEffect(() => {
    setRefreshTrigger(prev => prev + 1)
  }, [tickets, deliveries, tasks, inspections])
  
  const [filters, setFilters] = useState<CalendarFilter>({
    showService: true,
    showDelivery: true,
    showTasks: true,
    showPDI: true,
    assignedToFilter: 'all',
    statusFilter: 'all',
    priorityFilter: 'all'
  })
  
  const [searchTerm, setSearchTerm] = useState('')

  // Convert service tickets to calendar events
  const serviceEvents = useMemo((): CalendarEvent[] => {
    if (!filters.showService) return []
    
    return tickets.map(ticket => {
      const vehicle = vehicles.find(v => v.id === ticket.vehicleId)
      const customer = leads.find(l => l.id === ticket.customerId)
      const assignedRep = salesReps.find(r => r.id === ticket.assignedTo)
      
      const startDate = ticket.scheduledDate || ticket.createdAt
      const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)) // Default 2 hours
      
      return {
        id: `service-${ticket.id}`,
        title: `Service: ${ticket.title}`,
        start: startDate,
        end: endDate,
        sourceModule: 'service' as const,
        sourceId: ticket.id,
        status: ticket.status,
        priority: ticket.priority,
        assignedTo: ticket.assignedTo,
        customerId: ticket.customerId,
        vehicleId: ticket.vehicleId,
        description: ticket.description,
        location: customer ? `${customer.firstName} ${customer.lastName}` : ticket.customerId,
        metadata: {
          category: ticket.customFields?.category || 'Service',
          estimatedHours: ticket.customFields?.estimatedHours || 2,
          totalCost: ticket.parts.reduce((sum, p) => sum + p.total, 0) + 
                    ticket.labor.reduce((sum, l) => sum + l.total, 0),
          customerName: customer ? `${customer.firstName} ${customer.lastName}` : ticket.customerId,
          vehicleInfo: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : ticket.vehicleId,
          assignedToName: assignedRep?.name || ticket.assignedTo
        }
      }
    })
  }, [tickets, vehicles, leads, salesReps, filters.showService])

  // Convert deliveries to calendar events
  const deliveryEvents = useMemo((): CalendarEvent[] => {
    if (!filters.showDelivery) return []
    
    return deliveries.map(delivery => {
      const vehicle = vehicles.find(v => v.id === delivery.vehicleId)
      const customer = leads.find(l => l.id === delivery.customerId)
      
      const events: CalendarEvent[] = []
      
      // Scheduled delivery event
      const scheduledDate = new Date(delivery.scheduledDate)
      const scheduledEndTime = new Date(scheduledDate.getTime() + (4 * 60 * 60 * 1000)) // 4 hours for delivery
      events.push({
        id: `delivery-scheduled-${delivery.id}`,
        title: `Delivery: ${customer ? `${customer.firstName} ${customer.lastName}` : delivery.customerId}`,
        start: scheduledDate,
        end: scheduledEndTime,
        sourceModule: 'delivery' as const,
        sourceId: delivery.id,
        status: delivery.status,
        customerId: delivery.customerId,
        vehicleId: delivery.vehicleId,
        description: `Delivery to ${delivery.address.city}, ${delivery.address.state}`,
        location: `${delivery.address.street}, ${delivery.address.city}, ${delivery.address.state}`,
        metadata: {
          driver: delivery.driver,
          vehicleInfo: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : delivery.vehicleId,
          customerName: customer ? `${customer.firstName} ${customer.lastName}` : delivery.customerId,
          address: delivery.address,
          estimatedArrival: delivery.customFields?.estimatedArrival,
          contactPhone: delivery.customFields?.contactPhone
        }
      })
      
      // Delivered event (if completed)
      if (delivery.deliveredDate && delivery.status === 'delivered') {
        const deliveredDate = new Date(delivery.deliveredDate)
        events.push({
          id: `delivery-completed-${delivery.id}`,
          title: `✓ Delivered: ${customer ? `${customer.firstName} ${customer.lastName}` : delivery.customerId}`,
          start: deliveredDate,
          end: new Date(deliveredDate.getTime() + (30 * 60 * 1000)), // 30 minutes
          sourceModule: 'delivery' as const,
          sourceId: delivery.id,
          status: 'completed',
          customerId: delivery.customerId,
          vehicleId: delivery.vehicleId,
          description: `Delivery completed`,
          location: `${delivery.address.city}, ${delivery.address.state}`,
          metadata: {
            isCompletion: true,
            originalScheduledDate: scheduledDate,
            vehicleInfo: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : delivery.vehicleId,
            customerName: customer ? `${customer.firstName} ${customer.lastName}` : delivery.customerId
          }
        })
      }
      
      return events
    }).flat()
  }, [deliveries, vehicles, leads, filters.showDelivery])

  // Convert tasks to calendar events
  const taskEvents = useMemo((): CalendarEvent[] => {
    if (!filters.showTasks) return []
    
    return tasks.map(task => {
      const assignedRep = salesReps.find(r => r.id === task.assignedTo)
      
      // Tasks are typically shorter events
      const dueDate = new Date(task.dueDate)
      const endDate = new Date(dueDate.getTime() + (60 * 60 * 1000)) // 1 hour default
      
      return {
        id: `task-${task.id}`,
        title: `Task: ${task.title}`,
        start: dueDate,
        end: endDate,
        sourceModule: 'task' as const,
        sourceId: task.id,
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo,
        description: task.description,
        metadata: {
          module: task.module,
          sourceType: task.sourceType,
          isOverdue: task.isOverdue,
          assignedToName: task.assignedToName || assignedRep?.name,
          tags: task.tags
        }
      }
    })
  }, [tasks, salesReps, filters.showTasks])

  // Convert PDI inspections to calendar events
  const pdiEvents = useMemo((): CalendarEvent[] => {
    if (!filters.showPDI) return []
    
    return inspections.map(inspection => {
      const vehicle = vehicles.find(v => v.id === inspection.vehicleId)
      const inspector = salesReps.find(r => r.id === inspection.inspectorId)
      
      const events: CalendarEvent[] = []
      
      // PDI start event
      const estimatedDuration = 4 * 60 * 60 * 1000 // 4 hours for PDI
      const startDate = new Date(inspection.startedAt)
      const endTime = inspection.completedAt ? new Date(inspection.completedAt) : new Date(startDate.getTime() + estimatedDuration)
      
      events.push({
        id: `pdi-${inspection.id}`,
        title: `PDI: ${vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : inspection.vehicleId}`,
        start: startDate,
        end: endTime,
        sourceModule: 'pdi' as const,
        sourceId: inspection.id,
        status: inspection.status,
        assignedTo: inspection.inspectorId,
        vehicleId: inspection.vehicleId,
        description: inspection.notes || 'Pre-delivery inspection',
        metadata: {
          templateName: inspection.template?.name,
          vehicleInfo: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : inspection.vehicleId,
          inspectorName: inspector?.name || inspection.inspectorId,
          defectCount: inspection.defects.length,
          photoCount: inspection.photos.length,
          progress: inspection.items.filter(i => i.status !== 'pending').length / Math.max(inspection.items.length, 1) * 100
        }
      })
      
      return events
    }).flat()
  }, [inspections, vehicles, salesReps, filters.showPDI])

  // Combine all events
  const allEvents = useMemo(() => {
    return [
      ...serviceEvents,
      ...deliveryEvents,
      ...taskEvents,
      ...pdiEvents
    ]
  }, [serviceEvents, deliveryEvents, taskEvents, pdiEvents])

  // Apply filters and search
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      // Apply assignee filter
      if (filters.assignedToFilter !== 'all' && event.assignedTo !== filters.assignedToFilter) {
        return false
      }
      
      // Apply status filter
      if (filters.statusFilter !== 'all' && event.status !== filters.statusFilter) {
        return false
      }
      
      // Apply priority filter
      if (filters.priorityFilter !== 'all' && event.priority !== filters.priorityFilter) {
        return false
      }
      
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const matchesTitle = event.title.toLowerCase().includes(searchLower)
        const matchesDescription = event.description?.toLowerCase().includes(searchLower)
        const matchesCustomer = event.metadata?.customerName?.toLowerCase().includes(searchLower)
        const matchesVehicle = event.metadata?.vehicleInfo?.toLowerCase().includes(searchLower)
        
        if (!matchesTitle && !matchesDescription && !matchesCustomer && !matchesVehicle) {
          return false
        }
      }
      
      return true
    })
  }, [allEvents, filters, searchTerm])

  // Get unique values for filter dropdowns
  const filterOptions = useMemo(() => {
    const assignees = new Set<string>()
    const statuses = new Set<string>()
    const priorities = new Set<string>()
    
    allEvents.forEach(event => {
      if (event.assignedTo) assignees.add(event.assignedTo)
      if (event.status) statuses.add(event.status)
      if (event.priority) priorities.add(event.priority)
    })
    
    return {
      assignees: Array.from(assignees),
      statuses: Array.from(statuses),
      priorities: Array.from(priorities)
    }
  }, [allEvents])

  // Get assignee name
  const getAssigneeName = (assigneeId: string) => {
    const rep = salesReps.find(r => r.id === assigneeId)
    return rep?.name || assigneeId
  }

  return {
    events: filteredEvents,
    allEvents,
    refreshTrigger,
    filters,
    setFilters,
    searchTerm,
    setSearchTerm,
    filterOptions,
    getAssigneeName,
    // Stats
    stats: {
      total: allEvents.length,
      service: serviceEvents.length,
      delivery: deliveryEvents.length,
      tasks: taskEvents.length,
      pdi: pdiEvents.length
    }
  }
}