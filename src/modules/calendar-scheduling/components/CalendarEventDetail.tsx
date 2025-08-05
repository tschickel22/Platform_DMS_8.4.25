import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarEvent } from '../types'
import { formatDate, formatDateTime, formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { 
  X, 
  ExternalLink, 
  Wrench, 
  Truck, 
  ListTodo, 
  ClipboardCheck,
  Calendar,
  User,
  MapPin,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Phone,
  Edit
} from 'lucide-react';
import { loadFromLocalStorage } from '@/lib/utils';

interface CalendarEventDetailProps {
  event: CalendarEvent
  onClose: () => void
  onEdit?: () => void
  onNavigateToSource: (sourceModule: string, sourceId: string) => void
}


export function CalendarEventDetail({ event, onClose, onEdit, onNavigateToSource }: CalendarEventDetailProps) {
  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'service':
        return <Wrench className="h-5 w-5 text-purple-500" />
      case 'delivery':
        return <Truck className="h-5 w-5 text-green-500" />
      case 'task':
        return <ListTodo className="h-5 w-5 text-blue-500" />
      case 'pdi':
        return <ClipboardCheck className="h-5 w-5 text-orange-500" />
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />
    }
  }

  const getModuleColor = (module: string) => {
    switch (module) {
      case 'service':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'delivery':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'task':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'pdi':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'in_progress':
      case 'in progress':
      case 'in_transit':
      case 'in transit':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'pending':
      case 'scheduled':
      case 'open':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'cancelled':
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'high':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getModuleLink = (module: string) => {
    switch (module) {
      case 'service':
        return '/service'
      case 'delivery':
        return '/delivery'
      case 'task':
        return '/tasks'
      case 'pdi':
        return '/pdi'
      default:
        return '/'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getModuleIcon(event.sourceModule)}
              <div>
                <CardTitle className="text-xl">{event.title}</CardTitle>
                <CardDescription>
                  {event.sourceModule.charAt(0).toUpperCase() + event.sourceModule.slice(1)} Event
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onNavigateToSource(event.sourceModule, event.sourceId)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View in {event.sourceModule.charAt(0).toUpperCase() + event.sourceModule.slice(1)}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Event Status and Priority */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn("ri-badge-status", getModuleColor(event.sourceModule))}>
              {event.sourceModule.toUpperCase()}
            </Badge>
            <Badge className={cn("ri-badge-status", getStatusColor(event.status))}>
              {event.status.replace('_', ' ').toUpperCase()}
            </Badge>
            {event.priority && (
              <Badge className={cn("ri-badge-status", getPriorityColor(event.priority))}>
                {event.priority.toUpperCase()} PRIORITY
              </Badge>
            )}
            {event.metadata?.isOverdue && (
              <Badge className="bg-red-50 text-red-700 border-red-200">
                <AlertTriangle className="h-3 w-3 mr-1" />
                OVERDUE
              </Badge>
            )}
          </div>

          {/* Event Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Start Time</p>
                  <p className="text-sm text-muted-foreground">{formatDateTime(event.start)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">End Time</p>
                  <p className="text-sm text-muted-foreground">{formatDateTime(event.end)}</p>
                </div>
              </div>
              
              {event.assignedTo && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Assigned To</p>
                    <p className="text-sm text-muted-foreground">
                      {event.metadata?.assignedToName || event.assignedTo}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              {event.metadata?.customerName && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Customer</p>
                    <p className="text-sm text-muted-foreground">{event.metadata.customerName}</p>
                  </div>
                </div>
              )}
              
              {event.metadata?.vehicleInfo && (
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Vehicle</p>
                    <p className="text-sm text-muted-foreground">{event.metadata.vehicleInfo}</p>
                  </div>
                </div>
              )}
              
              {event.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div>
              <p className="text-sm font-medium mb-2">Description</p>
              <div className="bg-muted/30 p-3 rounded-md">
                <p className="text-sm">{event.description}</p>
              </div>
            </div>
          )}

          {/* Module-Specific Information */}
          {event.sourceModule === 'service' && event.metadata && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Service Details</p>
              <div className="grid gap-3 md:grid-cols-2">
                {event.metadata.category && (
                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="text-sm font-medium">{event.metadata.category}</p>
                  </div>
                )}
                {event.metadata.estimatedHours && (
                  <div>
                    <p className="text-xs text-muted-foreground">Estimated Hours</p>
                    <p className="text-sm font-medium">{event.metadata.estimatedHours}h</p>
                  </div>
                )}
                {event.metadata.totalCost && (
                  <div>
                    <p className="text-xs text-muted-foreground">Total Cost</p>
                    <p className="text-sm font-medium">{formatCurrency(event.metadata.totalCost)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {event.sourceModule === 'delivery' && event.metadata && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Delivery Details</p>
              <div className="grid gap-3 md:grid-cols-2">
                {event.metadata.driver && (
                  <div>
                    <p className="text-xs text-muted-foreground">Driver</p>
                    <p className="text-sm font-medium">{event.metadata.driver}</p>
                  </div>
                )}
                {event.metadata.estimatedArrival && (
                  <div>
                    <p className="text-xs text-muted-foreground">Estimated Arrival</p>
                    <p className="text-sm font-medium">{event.metadata.estimatedArrival}</p>
                  </div>
                )}
                {event.metadata.contactPhone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Contact</p>
                      <p className="text-sm font-medium">{event.metadata.contactPhone}</p>
                    </div>
                  </div>
                )}
                {event.metadata.address && (
                  <div className="md:col-span-2">
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="text-sm font-medium">
                      {event.metadata.address.street}, {event.metadata.address.city}, {event.metadata.address.state} {event.metadata.address.zipCode}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {event.sourceModule === 'task' && event.metadata && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Task Details</p>
              <div className="grid gap-3 md:grid-cols-2">
                {event.metadata.module && (
                  <div>
                    <p className="text-xs text-muted-foreground">Module</p>
                    <p className="text-sm font-medium">{event.metadata.module.toUpperCase()}</p>
                  </div>
                )}
                {event.metadata.sourceType && (
                  <div>
                    <p className="text-xs text-muted-foreground">Source Type</p>
                    <p className="text-sm font-medium">{event.metadata.sourceType.replace('_', ' ')}</p>
                  </div>
                )}
                {event.metadata.tags && event.metadata.tags.length > 0 && (
                  <div className="md:col-span-2">
                    <p className="text-xs text-muted-foreground">Tags</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {event.metadata.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {event.sourceModule === 'pdi' && event.metadata && (
            <div className="space-y-3">
              <p className="text-sm font-medium">PDI Details</p>
              <div className="grid gap-3 md:grid-cols-2">
                {event.metadata.templateName && (
                  <div>
                    <p className="text-xs text-muted-foreground">Template</p>
                    <p className="text-sm font-medium">{event.metadata.templateName}</p>
                  </div>
                )}
                {event.metadata.inspectorName && (
                  <div>
                    <p className="text-xs text-muted-foreground">Inspector</p>
                    <p className="text-sm font-medium">{event.metadata.inspectorName}</p>
                  </div>
                )}
                {event.metadata.progress !== undefined && (
                  <div>
                    <p className="text-xs text-muted-foreground">Progress</p>
                    <p className="text-sm font-medium">{Math.round(event.metadata.progress)}% Complete</p>
                  </div>
                )}
                {event.metadata.defectCount !== undefined && (
                  <div>
                    <p className="text-xs text-muted-foreground">Defects</p>
                    <p className="text-sm font-medium">
                      {event.metadata.defectCount} {event.metadata.defectCount === 1 ? 'defect' : 'defects'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Duration */}
          <div className="bg-muted/30 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Duration</span>
              <span className="text-sm">
                {Math.round((event.end.getTime() - event.start.getTime()) / (1000 * 60))} minutes
              </span>
            </div>
          </div>

          {/* Export to External Calendar */}
          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold mb-3">Export to External Calendar</h3>
            
            {/* Recurring Event Info */}
            {event.metadata?.isRecurring && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Repeat className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Recurring Event</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  {event.metadata.parentEventId 
                    ? `Instance ${event.metadata.instanceNumber} of recurring series`
                    : 'Parent event of recurring series'
                  }
                </p>
                {event.metadata.recurrencePattern && (
                  <p className="text-xs text-blue-600 mt-1">
                    Pattern: {event.metadata.recurrencePattern.type} every {event.metadata.recurrencePattern.interval} {event.metadata.recurrencePattern.type}(s)
                  </p>
                )}
              </div>
            )}

            {/* Resource Booking Info */}
            {event.metadata?.isResourceBooking && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-900">Resource Booking</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Resources: {event.metadata.resourceIds?.length || 0} booked
                </p>
                {event.metadata.attendees && event.metadata.attendees.length > 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    Attendees: {event.metadata.attendees.join(', ')}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {loadFromLocalStorage('external_calendar_connections', { google: false, outlook: false }).google && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Simulate export to Google Calendar with enhanced data
                    const exportData = {
                      title: event.title,
                      description: event.description,
                      start: event.start,
                      end: event.end,
                      location: event.location,
                      attendees: event.metadata?.attendees || [],
                      isRecurring: event.metadata?.isRecurring || false,
                      recurrencePattern: event.metadata?.recurrencePattern
                    }
                    console.log('Exporting to Google Calendar:', exportData)
                    alert(`Exporting "${event.title}" to Google Calendar with ${event.metadata?.isRecurring ? 'recurring pattern' : 'single occurrence'}!`)
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Export to Google Calendar
                </Button>
              )}
              {loadFromLocalStorage('external_calendar_connections', { google: false, outlook: false }).outlook && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Simulate export to Outlook Calendar with enhanced data
                    const exportData = {
                      title: event.title,
                      description: event.description,
                      start: event.start,
                      end: event.end,
                      location: event.location,
                      attendees: event.metadata?.attendees || [],
                      isRecurring: event.metadata?.isRecurring || false,
                      recurrencePattern: event.metadata?.recurrencePattern
                    }
                    console.log('Exporting to Outlook Calendar:', exportData)
                    alert(`Exporting "${event.title}" to Outlook Calendar with ${event.metadata?.isRecurring ? 'recurring pattern' : 'single occurrence'}!`)
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Export to Outlook Calendar
                </Button>
              )}
              {!loadFromLocalStorage('external_calendar_connections', { google: false, outlook: false }).google && !loadFromLocalStorage('external_calendar_connections', { google: false, outlook: false }).outlook && (
                <p className="text-sm text-muted-foreground">Connect an external calendar in the Integrations tab to export events.</p>
              )}
            </div>

            {/* Advanced Export Options */}
            {(loadFromLocalStorage('external_calendar_connections', { google: false, outlook: false }).google || 
              loadFromLocalStorage('external_calendar_connections', { google: false, outlook: false }).outlook) && (
              <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">Export Options</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Event will include all details (title, description, time, location)</p>
                  {event.metadata?.isRecurring && (
                    <p>• Recurring pattern will be preserved in external calendar</p>
                  )}
                  {event.metadata?.attendees && event.metadata.attendees.length > 0 && (
                    <p>• Attendees will be invited to the external calendar event</p>
                  )}
                  <p>• Changes made in external calendar may create sync conflicts</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {onEdit && (
              <Button variant="outline" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Event
              </Button>
            )}
            <Button onClick={() => onNavigateToSource(event.sourceModule, event.sourceId)}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in {event.sourceModule.charAt(0).toUpperCase() + event.sourceModule.slice(1)}
            </Button>
            <p>• Drag events to reschedule them</p>
            <p>• Double-click empty slots to create recurring events</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}