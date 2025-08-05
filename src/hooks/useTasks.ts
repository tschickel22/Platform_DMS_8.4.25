import { useState, useEffect, useMemo } from 'react'
import { Task, TaskStatus, TaskModule, TaskPriority, Lead, ServiceTicket } from '@/types'
import { useLeadManagement } from '@/modules/crm-prospecting/hooks/useLeadManagement'
import { useServiceManagement } from '@/modules/service-ops/hooks/useServiceManagement'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [userCreatedTasks, setUserCreatedTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Import data from modules
  const { leads, salesReps } = useLeadManagement()
  const { tickets } = useServiceManagement()

  // Load user-created tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = loadFromLocalStorage<Task[]>('renter-insight-user-tasks', [])
    setUserCreatedTasks(savedTasks)
  }, [])

  // Save user-created tasks to localStorage whenever they change
  useEffect(() => {
    saveToLocalStorage('renter-insight-user-tasks', userCreatedTasks)
  }, [userCreatedTasks])

  // Helper function to map lead status to task status
  const mapLeadStatusToTaskStatus = (leadStatus: string): TaskStatus => {
    switch (leadStatus) {
      case 'new':
        return TaskStatus.PENDING
      case 'contacted':
        return TaskStatus.IN_PROGRESS
      case 'qualified':
        return TaskStatus.IN_PROGRESS
      case 'proposal':
        return TaskStatus.IN_PROGRESS
      case 'negotiation':
        return TaskStatus.IN_PROGRESS
      case 'closed_won':
        return TaskStatus.COMPLETED
      case 'closed_lost':
        return TaskStatus.CANCELLED
      default:
        return TaskStatus.PENDING
    }
  }

  // Helper function to map service ticket status to task status
  const mapServiceStatusToTaskStatus = (serviceStatus: string): TaskStatus => {
    switch (serviceStatus) {
      case 'open':
        return TaskStatus.PENDING
      case 'in_progress':
        return TaskStatus.IN_PROGRESS
      case 'waiting_parts':
        return TaskStatus.ON_HOLD
      case 'completed':
        return TaskStatus.COMPLETED
      case 'cancelled':
        return TaskStatus.CANCELLED
      default:
        return TaskStatus.PENDING
    }
  }

  // Helper function to determine task priority based on lead score and other factors
  const getLeadTaskPriority = (lead: Lead): TaskPriority => {
    if (lead.score && lead.score >= 80) return TaskPriority.HIGH
    if (lead.score && lead.score >= 60) return TaskPriority.MEDIUM
    return TaskPriority.LOW
  }

  // Helper function to determine service ticket priority
  const getServiceTaskPriority = (ticket: ServiceTicket): TaskPriority => {
    switch (ticket.priority) {
      case 'urgent':
        return TaskPriority.URGENT
      case 'high':
        return TaskPriority.HIGH
      case 'medium':
        return TaskPriority.MEDIUM
      case 'low':
        return TaskPriority.LOW
      default:
        return TaskPriority.MEDIUM
    }
  }

  // Helper function to get assignee name
  const getAssigneeName = (assigneeId?: string): string => {
    if (!assigneeId) return 'Unassigned'
    const rep = salesReps.find(rep => rep.id === assigneeId)
    return rep?.name || assigneeId
  }

  // Helper function to calculate due date for leads
  const getLeadDueDate = (lead: Lead): Date => {
    const lastActivity = lead.lastActivity ? new Date(lead.lastActivity) : new Date(lead.createdAt)
    const daysSinceActivity = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
    
    // If no activity for more than 3 days, it's overdue
    if (daysSinceActivity > 3) {
      return lastActivity
    }
    
    // Otherwise, due in 1 day from last activity
    const dueDate = new Date(lastActivity)
    dueDate.setDate(dueDate.getDate() + 1)
    return dueDate
  }

  // Transform leads into tasks
  const transformLeadsToTasks = useMemo((): Task[] => {
    return leads
      .filter(lead => {
        // Only include leads that need action (not closed)
        return !['closed_won', 'closed_lost'].includes(lead.status)
      })
      .map(lead => {
        const dueDate = getLeadDueDate(lead)
        const isOverdue = dueDate < new Date()
        
        return {
          id: `lead-${lead.id}`,
          title: `Follow up with ${lead.firstName} ${lead.lastName}`,
          description: lead.notes || `${lead.status.replace('_', ' ')} lead from ${lead.source}`,
          dueDate,
          status: mapLeadStatusToTaskStatus(lead.status),
          priority: getLeadTaskPriority(lead),
          module: TaskModule.CRM,
          sourceId: lead.id,
          sourceType: 'lead',
          assignedTo: lead.assignedTo,
          assignedToName: getAssigneeName(lead.assignedTo),
          link: `/crm`,
          tags: lead.customFields?.tags || [],
          isOverdue,
          customFields: {
            leadScore: lead.score,
            leadSource: lead.source,
            leadEmail: lead.email,
            leadPhone: lead.phone
          },
          createdAt: lead.createdAt,
          updatedAt: lead.updatedAt
        }
      })
  }, [leads, salesReps])

  // Transform service tickets into tasks
  const transformServiceTicketsToTasks = useMemo((): Task[] => {
    return tickets
      .filter(ticket => {
        // Only include tickets that are not completed or cancelled
        return !['completed', 'cancelled'].includes(ticket.status)
      })
      .map(ticket => {
        const dueDate = ticket.scheduledDate || new Date()
        const isOverdue = dueDate < new Date() && ticket.status !== 'completed'
        
        return {
          id: `service-${ticket.id}`,
          title: ticket.title,
          description: ticket.description,
          dueDate,
          status: mapServiceStatusToTaskStatus(ticket.status),
          priority: getServiceTaskPriority(ticket),
          module: TaskModule.SERVICE,
          sourceId: ticket.id,
          sourceType: 'service_ticket',
          assignedTo: ticket.assignedTo,
          assignedToName: ticket.assignedTo || 'Unassigned',
          link: `/service`,
          tags: [],
          isOverdue,
          customFields: {
            customerId: ticket.customerId,
            vehicleId: ticket.vehicleId,
            partsTotal: ticket.parts.reduce((sum, part) => sum + part.total, 0),
            laborTotal: ticket.labor.reduce((sum, labor) => sum + labor.total, 0)
          },
          createdAt: ticket.createdAt,
          updatedAt: ticket.updatedAt
        }
      })
  }, [tickets])

  // Combine all tasks
  const allTasks = useMemo(() => {
    const combined = [
      ...transformLeadsToTasks,
      ...transformServiceTicketsToTasks,
      ...userCreatedTasks
    ]
    
    // Sort by due date (overdue first, then by date)
    return combined.sort((a, b) => {
      if (a.isOverdue && !b.isOverdue) return -1
      if (!a.isOverdue && b.isOverdue) return 1
      return a.dueDate.getTime() - b.dueDate.getTime()
    })
  }, [transformLeadsToTasks, transformServiceTicketsToTasks, userCreatedTasks])

  // Update tasks when data changes
  useEffect(() => {
    setLoading(true)
    try {
      setTasks(allTasks)
      setError(null)
    } catch (err) {
      console.error('Error aggregating tasks:', err)
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [allTasks])

  // Calculate task metrics
  const metrics = useMemo(() => {
    const totalTasks = tasks.length
    const overdueTasks = tasks.filter(task => task.isOverdue).length
    const pendingTasks = tasks.filter(task => task.status === TaskStatus.PENDING).length
    const inProgressTasks = tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length
    const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED).length
    
    const tasksByModule = tasks.reduce((acc, task) => {
      acc[task.module] = (acc[task.module] || 0) + 1
      return acc
    }, {} as Record<TaskModule, number>)

    const tasksByPriority = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1
      return acc
    }, {} as Record<TaskPriority, number>)

    return {
      totalTasks,
      overdueTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      tasksByModule,
      tasksByPriority
    }
  }, [tasks])

  // Filter functions for future use
  const filterTasks = (filters: {
    module?: TaskModule
    status?: TaskStatus
    priority?: TaskPriority
    assignedTo?: string
    isOverdue?: boolean
  }) => {
    return tasks.filter(task => {
      if (filters.module && task.module !== filters.module) return false
      if (filters.status && task.status !== filters.status) return false
      if (filters.priority && task.priority !== filters.priority) return false
      if (filters.assignedTo && task.assignedTo !== filters.assignedTo) return false
      if (filters.isOverdue !== undefined && task.isOverdue !== filters.isOverdue) return false
      return true
    })
  }

  // Get tasks by module
  const getTasksByModule = (module: TaskModule) => {
    return tasks.filter(task => task.module === module)
  }

  // Get overdue tasks
  const getOverdueTasks = () => {
    return tasks.filter(task => task.isOverdue)
  }

  // Get tasks assigned to a specific user
  const getTasksByAssignee = (assigneeId: string) => {
    return tasks.filter(task => task.assignedTo === assigneeId)
  }

  // Helper function to get module link
  const getModuleLink = (module: TaskModule): string => {
    switch (module) {
      case TaskModule.CRM:
        return '/crm'
      case TaskModule.SERVICE:
        return '/service'
      case TaskModule.DELIVERY:
        return '/delivery'
      case TaskModule.FINANCE:
        return '/finance'
      case TaskModule.WARRANTY:
        return '/warranty-mgmt'
      default:
        return '/'
    }
  }

  // Create a new task
  const createTask = async (taskData: Partial<Task>): Promise<Task> => {
    setLoading(true)
    try {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: taskData.title || '',
      description: taskData.description || '',
      status: taskData.status || TaskStatus.PENDING,
      priority: taskData.priority || TaskPriority.MEDIUM,
      module: taskData.module || TaskModule.CRM,
      assignedTo: taskData.assignedTo,
      assignedToName: taskData.assignedToName || getAssigneeName(taskData.assignedTo),
      dueDate: taskData.dueDate || new Date(Date.now() + 24 * 60 * 60 * 1000),
      sourceId: taskData.sourceId || '',
      sourceType: taskData.sourceType || '',
      link: taskData.link || getModuleLink(taskData.module || TaskModule.CRM),
      tags: taskData.tags || [],
      isOverdue: false,
      customFields: taskData.customFields || {},
      createdAt: new Date(),
      updatedAt: new Date()
    }

      // Add to user-created tasks
      setUserCreatedTasks(prev => [newTask, ...prev])
      
      return newTask
    } finally {
      setLoading(false)
    }
  }

  // Update an existing task
  const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task | null> => {
    const existingTask = userCreatedTasks.find(t => t.id === taskId)
    if (!existingTask) return null

    const updatedTask = {
      ...existingTask,
      ...updates,
      updatedAt: new Date()
    }

    setUserCreatedTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t))

    return updatedTask
  }

  // Delete a task
  const deleteTask = async (taskId: string): Promise<void> => {
    setUserCreatedTasks(prev => prev.filter(t => t.id !== taskId))
  }

  return {
    tasks,
    loading,
    error,
    metrics,
    filterTasks,
    getTasksByModule,
    getOverdueTasks,
    getTasksByAssignee,
    createTask,
    updateTask,
    deleteTask
  }
}