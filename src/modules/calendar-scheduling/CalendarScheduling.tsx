import React, { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, TrendingUp, Clock, CheckCircle, AlertTriangle, Users } from 'lucide-react'
import { useCalendarData } from './hooks/useCalendarData'
import { CalendarView } from './components/CalendarView'
import { CalendarFilters } from './components/CalendarFilters'
import { useToast } from '@/hooks/use-toast'

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

  const [showFilters, setShowFilters] = useState(false)

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

  return (
    <div className="space-y-6">
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
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="shadow-sm"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
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

      {/* Calendar View */}
      <CalendarView
        events={events}
        onNavigateToSource={handleNavigateToSource}
      />
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