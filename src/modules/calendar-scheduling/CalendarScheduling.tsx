import React, { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, TrendingUp, Clock, CheckCircle, AlertTriangle, Users, Plus, Repeat } from 'lucide-react'
import { useCalendarData } from './hooks/useCalendarData'
import { useCalendarManagement } from './hooks/useCalendarManagement'
import { CalendarView } from './components/CalendarView'
import { CalendarFilters } from './components/CalendarFilters'
import { EventSyncStatus } from './components/EventSyncStatus'
import { ExternalCalendarIntegration } from './components/ExternalCalendarIntegration'
import { RecurringEventForm } from './components/RecurringEventForm'
import { ResourceBookingForm } from './components/ResourceBookingForm'
import { SyncSettingsForm } from './components/SyncSettingsForm'
import { ConflictResolutionModal } from './components/ConflictResolutionModal'
import { useAdvancedSync } from './hooks/useAdvancedSync'
import { useToast } from '@/hooks/use-toast'
import { CalendarAnalytics } from './components/CalendarAnalytics'
import { AISchedulingOptimizer } from './components/AISchedulingOptimizer'
import { AdvancedReporting } from './components/AdvancedReporting'
import { SmartSchedulingSuggestions } from './components/SmartSchedulingSuggestions'
import { CapacityPlanning } from './components/CapacityPlanning'

function CalendarDashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const {
    events,
    allEvents,
    filters,
    setFilters,
    searchTerm,
    setSearchTerm,
    filterOptions,
    getAssigneeName,
    stats
  } = useCalendarData()

  const {
    loading: managementLoading,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    rescheduleEvent
  } = useCalendarManagement()
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState('calendar')
  const [showSyncStatus, setShowSyncStatus] = useState(false)
  const [showRecurringForm, setShowRecurringForm] = useState(false)
  const [showResourceBooking, setShowResourceBooking] = useState(false)
  const [showConflictResolution, setShowConflictResolution] = useState(false)
  const [resourceBookingDate, setResourceBookingDate] = useState<Date | undefined>(undefined)
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date()
  })

  // Advanced sync functionality
  const {
    syncStatus,
    loading: syncLoading,
    createRecurringEvent,
    resolveConflict,
    createResourceBooking,
    getSyncStatistics
  } = useAdvancedSync()

  // Calculate additional stats
  const todayEvents = allEvents.filter(event => {
    const today = new Date()
    const eventDate = new Date(event.start)
    return eventDate.toDateString() === today.toDateString()
  })

  const upcomingEvents = allEvents.filter(event => {
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    return event.start > now && event.start <= nextWeek
  })

  const overdueEvents = allEvents.filter(event => {
    const now = new Date()
    return event.start < now && 
           !['completed', 'delivered', 'approved', 'cancelled'].includes(event.status.toLowerCase())
  })

  const handleNavigateToSource = (sourceModule: string, sourceId: string) => {
    const moduleRoutes = {
      service: '/service',
      delivery: '/delivery',
      task: '/tasks',
      pdi: '/pdi'
    }
    
    const route = moduleRoutes[sourceModule as keyof typeof moduleRoutes]
    if (route) {
      navigate(route)
      toast({
        title: 'Navigating',
        description: `Opening ${sourceModule} module`,
      })
    }
  }

  const handleCreateEvent = async (eventData: Partial<CalendarEvent>) => {
    try {
      await createCalendarEvent(eventData)
      toast({
        title: 'Event Created',
        description: `New ${eventData.sourceModule} event created successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create event',
        variant: 'destructive'
      })
      throw error
    }
  }

  const handleUpdateEvent = async (eventId: string, eventData: Partial<CalendarEvent>) => {
    try {
      await updateCalendarEvent(eventId, eventData)
      toast({
        title: 'Event Updated',
        description: 'Event has been updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update event',
        variant: 'destructive'
      })
      throw error
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteCalendarEvent(eventId)
      toast({
        title: 'Event Deleted',
        description: 'Event has been deleted successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete event',
        variant: 'destructive'
      })
      throw error
    }
  }

  const handleRescheduleEvent = async (eventId: string, newStart: Date, newEnd: Date) => {
    try {
      await rescheduleEvent(eventId, newStart, newEnd)
      toast({
        title: 'Event Rescheduled',
        description: 'Event has been rescheduled successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reschedule event',
        variant: 'destructive'
      })
      throw error
    }
  }

  // Mock sync statuses - in a real app, this would track actual sync state
  const syncStatuses = [
    {
      module: 'service',
      lastSync: new Date(),
      status: 'synced' as const,
      eventCount: stats.service
    },
    {
      module: 'delivery',
      lastSync: new Date(),
      status: 'synced' as const,
      eventCount: stats.delivery
    },
    {
      module: 'tasks',
      lastSync: new Date(),
      status: 'synced' as const,
      eventCount: stats.tasks
    },
    {
      module: 'pdi',
      lastSync: new Date(),
      status: 'synced' as const,
      eventCount: stats.pdi
    }
  ]

  const handleRefreshSync = async (module: string) => {
    // In a real app, this would trigger a sync refresh for the specific module
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const handleRefreshAllSync = async () => {
    // In a real app, this would trigger a sync refresh for all modules
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  const handleCreateRecurringEvent = async (eventData: Partial<CalendarEvent> & { recurrence: any }) => {
    try {
      const { recurrence, ...baseEventData } = eventData
      await createRecurringEvent(baseEventData, recurrence)
      setShowRecurringForm(false)
      toast({
        title: 'Recurring Event Created',
        description: 'Recurring event series has been created successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create recurring event',
        variant: 'destructive'
      })
    }
  }

  const handleCreateResourceBooking = async (bookingData: any) => {
    try {
      await createResourceBooking(bookingData)
      setShowResourceBooking(false)
      setResourceBookingDate(undefined)
      toast({
        title: 'Resources Booked',
        description: 'Resources have been successfully booked',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to book resources',
        variant: 'destructive'
      })
    }
  }

  const handleResolveConflict = async (conflictId: string, resolution: any) => {
    try {
      await resolveConflict(conflictId, resolution)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resolve conflict',
        variant: 'destructive'
      })
    }
  }

  // Get sync statistics
  const syncStats = getSyncStatistics()
  const pendingConflicts = syncStatus.conflicts.filter(c => c.status === 'pending')
  return (
    <div className="space-y-6">
      {/* Recurring Event Form Modal */}
      {showRecurringForm && (
        <RecurringEventForm
          onSave={handleCreateRecurringEvent}
          onCancel={() => setShowRecurringForm(false)}
        />
      )}

      {/* Resource Booking Form Modal */}
      {showResourceBooking && (
        <ResourceBookingForm
          selectedDate={resourceBookingDate}
          onSave={handleCreateResourceBooking}
          onCancel={() => {
            setShowResourceBooking(false)
            setResourceBookingDate(undefined)
          }}
        />
      )}

      {/* Conflict Resolution Modal */}
      {showConflictResolution && pendingConflicts.length > 0 && (
        <ConflictResolutionModal
          conflicts={pendingConflicts}
          onResolve={handleResolveConflict}
          onClose={() => setShowConflictResolution(false)}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Calendar & Scheduling</h1>
            <p className="ri-page-description">
              Unified view of all scheduled events across modules
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-50 text-blue-700 border-blue-200">
              {events.length} events shown
            </Badge>
            {pendingConflicts.length > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setShowConflictResolution(true)}
                className="shadow-sm bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
              >
                {pendingConflicts.length} Conflicts
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => setShowSyncStatus(!showSyncStatus)}
              className="shadow-sm"
            >
              Sync Status
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="shadow-sm"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <Button 
              onClick={() => setShowRecurringForm(true)}
              className="shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Recurring Event
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowResourceBooking(true)}
              className="shadow-sm"
            >
              Book Resources
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Today's Events</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{todayEvents.length}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <Clock className="h-3 w-3 mr-1" />
              Scheduled for today
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Upcoming (7 days)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{upcomingEvents.length}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              Next week
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-red-50 to-red-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{overdueEvents.length}</div>
            <p className="text-xs text-red-600 flex items-center mt-1">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Total Events</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{stats.total}</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <Users className="h-3 w-3 mr-1" />
              All modules
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Filters (Collapsible) */}
        {showFilters && (
          <CalendarFilters
            filters={filters}
            onFiltersChange={setFilters}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterOptions={filterOptions}
            getAssigneeName={getAssigneeName}
            stats={stats}
          />
        )}

        {/* Sync Status (Collapsible) */}
        {showSyncStatus && (
          <EventSyncStatus
            syncStatuses={syncStatuses}
            onRefreshSync={handleRefreshSync}
            onRefreshAll={handleRefreshAllSync}
          />
        )}
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="ai-optimizer">AI Optimizer</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <CalendarView
            events={events}
            onNavigateToSource={handleNavigateToSource}
            onCreateEvent={handleCreateEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            onRescheduleEvent={handleRescheduleEvent}
          />
        </TabsContent>
        <TabsContent value="integrations">
          <ExternalCalendarIntegration />
        </TabsContent>
        <TabsContent value="analytics">
          <CalendarAnalytics 
            events={allEvents}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </TabsContent>
        <TabsContent value="ai-optimizer">
          <div className="space-y-8">
            <AISchedulingOptimizer
              events={allEvents}
              onApplyOptimization={async (suggestion) => {
                // Simulate applying optimization
                await new Promise(resolve => setTimeout(resolve, 1000))
                console.log('Applied optimization:', suggestion)
              }}
              onOptimizeSchedule={async () => {
                // Return mock suggestions
                return []
              }}
            />
            
            <SmartSchedulingSuggestions
              events={allEvents}
              onApplySuggestion={async (suggestion) => {
                // Simulate applying suggestion
                await new Promise(resolve => setTimeout(resolve, 1000))
                console.log('Applied suggestion:', suggestion)
              }}
              onDismissSuggestion={(suggestionId) => {
                console.log('Dismissed suggestion:', suggestionId)
              }}
            />
            
            <CapacityPlanning
              events={allEvents}
              teamMembers={[]}
              onOptimizeCapacity={async () => {
                await new Promise(resolve => setTimeout(resolve, 1000))
                console.log('Optimized capacity')
              }}
              onRebalanceWorkload={async (recommendations) => {
                await new Promise(resolve => setTimeout(resolve, 1000))
                console.log('Rebalanced workload:', recommendations)
              }}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Additional Tabs for Advanced Features */}
      <div className="mt-8">
        <div className="border-b">
          <nav className="-mb-px flex space-x-8">
            <button className="border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
              Advanced Reporting
            </button>
            <button className="border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
              Sync Settings
            </button>
            <button className="border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
              Sync Status
            </button>
          </nav>
        </div>
        
        <div className="mt-6">
          <AdvancedReporting
            events={allEvents}
            onGenerateReport={async (config) => {
              await new Promise(resolve => setTimeout(resolve, 2000))
              console.log('Generated report:', config)
            }}
            onScheduleReport={async (config) => {
              await new Promise(resolve => setTimeout(resolve, 1000))
              console.log('Scheduled report:', config)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default function CalendarScheduling() {
  return (
    <Routes>
      <Route path="/" element={<CalendarDashboard />} />
      <Route path="/*" element={<CalendarDashboard />} />
    </Routes>
  )
}