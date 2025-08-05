import React, { useState, useCallback } from 'react'
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'
import moment from 'moment'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarEvent } from '../types'
import { CalendarEventDetail } from './CalendarEventDetail'
import { cn } from '@/lib/utils'
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Grid3X3,
  Columns,
  Square,
  List
} from 'lucide-react'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment)

interface CalendarViewProps {
  events: CalendarEvent[]
  onNavigateToSource: (sourceModule: string, sourceId: string) => void
}

export function CalendarView({ events, onNavigateToSource }: CalendarViewProps) {
  const [currentView, setCurrentView] = useState<View>(Views.MONTH)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  // Custom event style getter
  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    let backgroundColor = '#3174ad'
    let borderColor = '#3174ad'
    
    // Color by source module
    switch (event.sourceModule) {
      case 'service':
        backgroundColor = '#8b5cf6' // Purple
        borderColor = '#7c3aed'
        break
      case 'delivery':
        backgroundColor = '#10b981' // Green
        borderColor = '#059669'
        break
      case 'task':
        backgroundColor = '#3b82f6' // Blue
        borderColor = '#2563eb'
        break
      case 'pdi':
        backgroundColor = '#f59e0b' // Orange
        borderColor = '#d97706'
        break
    }
    
    // Adjust opacity based on status
    if (event.status === 'completed' || event.status === 'delivered' || event.status === 'approved') {
      backgroundColor = backgroundColor + '80' // 50% opacity
    } else if (event.status === 'cancelled' || event.status === 'failed') {
      backgroundColor = '#ef4444' // Red
      borderColor = '#dc2626'
    }
    
    return {
      style: {
        backgroundColor,
        borderColor,
        color: 'white',
        border: `2px solid ${borderColor}`,
        borderRadius: '4px',
        fontSize: '12px',
        padding: '2px 4px'
      }
    }
  }, [])

  // Custom event component
  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    const getModuleIcon = () => {
      switch (event.sourceModule) {
        case 'service':
          return '🔧'
        case 'delivery':
          return '🚚'
        case 'task':
          return '📋'
        case 'pdi':
          return '✅'
        default:
          return '📅'
      }
    }

    return (
      <div className="flex items-center space-x-1 text-xs">
        <span>{getModuleIcon()}</span>
        <span className="truncate">{event.title}</span>
        {event.metadata?.isOverdue && <span className="text-red-200">⚠</span>}
      </div>
    )
  }

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
  }

  const handleNavigate = (date: Date) => {
    setCurrentDate(date)
  }

  const handleViewChange = (view: View) => {
    setCurrentView(view)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const goToPrevious = () => {
    let newDate = new Date(currentDate)
    
    switch (currentView) {
      case Views.MONTH:
        newDate.setMonth(newDate.getMonth() - 1)
        break
      case Views.WEEK:
        newDate.setDate(newDate.getDate() - 7)
        break
      case Views.DAY:
        newDate.setDate(newDate.getDate() - 1)
        break
      case Views.AGENDA:
        newDate.setDate(newDate.getDate() - 7)
        break
    }
    
    setCurrentDate(newDate)
  }

  const goToNext = () => {
    let newDate = new Date(currentDate)
    
    switch (currentView) {
      case Views.MONTH:
        newDate.setMonth(newDate.getMonth() + 1)
        break
      case Views.WEEK:
        newDate.setDate(newDate.getDate() + 7)
        break
      case Views.DAY:
        newDate.setDate(newDate.getDate() + 1)
        break
      case Views.AGENDA:
        newDate.setDate(newDate.getDate() + 7)
        break
    }
    
    setCurrentDate(newDate)
  }

  const getViewIcon = (view: View) => {
    switch (view) {
      case Views.MONTH:
        return <Grid3X3 className="h-4 w-4" />
      case Views.WEEK:
        return <Columns className="h-4 w-4" />
      case Views.DAY:
        return <Square className="h-4 w-4" />
      case Views.AGENDA:
        return <List className="h-4 w-4" />
      default:
        return <CalendarIcon className="h-4 w-4" />
    }
  }

  const getDateRangeText = () => {
    switch (currentView) {
      case Views.MONTH:
        return moment(currentDate).format('MMMM YYYY')
      case Views.WEEK:
        const startOfWeek = moment(currentDate).startOf('week')
        const endOfWeek = moment(currentDate).endOf('week')
        return `${startOfWeek.format('MMM D')} - ${endOfWeek.format('MMM D, YYYY')}`
      case Views.DAY:
        return moment(currentDate).format('dddd, MMMM D, YYYY')
      case Views.AGENDA:
        return 'Agenda View'
      default:
        return moment(currentDate).format('MMMM YYYY')
    }
  }

  return (
    <div className="space-y-4">
      {/* Event Detail Modal */}
      {selectedEvent && (
        <CalendarEventDetail
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onNavigateToSource={onNavigateToSource}
        />
      )}

      {/* Calendar Header */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={goToPrevious}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Today
                </Button>
              </div>
              
              <div className="text-lg font-semibold">
                {getDateRangeText()}
              </div>
            </div>

            {/* View Selector */}
            <div className="flex items-center space-x-2">
              {[
                { view: Views.MONTH, label: 'Month' },
                { view: Views.WEEK, label: 'Week' },
                { view: Views.DAY, label: 'Day' },
                { view: Views.AGENDA, label: 'Agenda' }
              ].map(({ view, label }) => (
                <Button
                  key={view}
                  variant={currentView === view ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleViewChange(view)}
                  className="flex items-center space-x-1"
                >
                  {getViewIcon(view)}
                  <span>{label}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="calendar-container" style={{ height: '600px', padding: '1rem' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={currentView}
              onView={handleViewChange}
              date={currentDate}
              onNavigate={handleNavigate}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              components={{
                event: EventComponent
              }}
              popup
              showMultiDayTimes
              step={30}
              timeslots={2}
              defaultDate={new Date()}
              views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
              toolbar={false} // We're using our custom toolbar
              style={{
                height: '100%',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Event Types</CardTitle>
          <CardDescription>
            Color coding for different event sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#8b5cf6' }}></div>
              <span className="text-sm font-medium">Service Tickets</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
              <span className="text-sm font-medium">Deliveries</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
              <span className="text-sm font-medium">Tasks</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
              <span className="text-sm font-medium">PDI Inspections</span>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-muted-foreground">
            <p>• Completed events appear with reduced opacity</p>
            <p>• Cancelled/failed events appear in red</p>
            <p>• Click on any event to view details</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}