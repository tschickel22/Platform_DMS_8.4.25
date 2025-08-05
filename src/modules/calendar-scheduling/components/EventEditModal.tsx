import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { X, Save, Edit, Trash2, ExternalLink } from 'lucide-react'
import { CalendarEvent } from '../types'
import { useToast } from '@/hooks/use-toast'
import { useLeadManagement } from '@/modules/crm-prospecting/hooks/useLeadManagement'
import { useInventoryManagement } from '@/modules/inventory-management/hooks/useInventoryManagement'
import { formatDateTime } from '@/lib/utils'

interface EventEditModalProps {
  event: CalendarEvent
  onSave: (eventId: string, eventData: Partial<CalendarEvent>) => Promise<void>
  onDelete: (eventId: string) => Promise<void>
  onNavigateToSource: (sourceModule: string, sourceId: string) => void
  onCancel: () => void
}

export function EventEditModal({ 
  event, 
  onSave, 
  onDelete, 
  onNavigateToSource, 
  onCancel 
}: EventEditModalProps) {
  const { toast } = useToast()
  const { leads, salesReps } = useLeadManagement()
  const { vehicles } = useInventoryManagement()
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description || '',
    startDate: event.start.toISOString().slice(0, 16),
    endDate: event.end.toISOString().slice(0, 16),
    assignedTo: event.assignedTo || '',
    customerId: event.customerId || '',
    vehicleId: event.vehicleId || '',
    location: event.location || '',
    priority: event.priority || 'medium',
    status: event.status
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.startDate || !formData.endDate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast({
        title: 'Validation Error',
        description: 'End time must be after start time',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      const eventData: Partial<CalendarEvent> = {
        title: formData.title,
        description: formData.description,
        start: new Date(formData.startDate),
        end: new Date(formData.endDate),
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo || undefined,
        customerId: formData.customerId || undefined,
        vehicleId: formData.vehicleId || undefined,
        location: formData.location || undefined,
        metadata: {
          ...event.metadata,
          lastModifiedFromCalendar: new Date().toISOString(),
          customerName: formData.customerId ? leads.find(l => l.id === formData.customerId)?.firstName + ' ' + leads.find(l => l.id === formData.customerId)?.lastName : undefined,
          vehicleInfo: formData.vehicleId ? (() => {
            const vehicle = vehicles.find(v => v.id === formData.vehicleId)
            return vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : undefined
          })() : undefined,
          assignedToName: formData.assignedTo ? salesReps.find(r => r.id === formData.assignedTo)?.name : undefined
        }
      }

      await onSave(event.id, eventData)
      
      toast({
        title: 'Event Updated',
        description: 'Calendar event has been updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update calendar event',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return
    }

    setDeleteLoading(true)
    try {
      await onDelete(event.id)
      
      toast({
        title: 'Event Deleted',
        description: 'Calendar event has been deleted successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete calendar event',
        variant: 'destructive'
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Edit className="h-5 w-5 mr-2 text-primary" />
                Edit Calendar Event
              </CardTitle>
              <CardDescription>
                Modify event details - changes will sync to {event.sourceModule}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onNavigateToSource(event.sourceModule, event.sourceId)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in {event.sourceModule.charAt(0).toUpperCase() + event.sourceModule.slice(1)}
              </Button>
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Source Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-blue-900">Source:</span>
                <span className="text-blue-800">{event.sourceModule.charAt(0).toUpperCase() + event.sourceModule.slice(1)} Module</span>
                <span className="text-blue-600">•</span>
                <span className="text-blue-600">ID: {event.sourceId}</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Changes made here will be synchronized back to the source module
              </p>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Event Information</h3>
              
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter event title"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the event"
                  rows={3}
                />
              </div>
            </div>

            {/* Date and Time */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Schedule</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="startDate">Start Date & Time *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="endDate">End Date & Time *</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Assignment and Resources */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Assignment</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Select 
                    value={formData.assignedTo} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {salesReps.map(rep => (
                        <SelectItem key={rep.id} value={rep.id}>
                          {rep.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="customerId">Customer</Label>
                  <Select 
                    value={formData.customerId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Customer</SelectItem>
                      {leads.map(lead => (
                        <SelectItem key={lead.id} value={lead.id}>
                          {lead.firstName} {lead.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="vehicleId">Vehicle</Label>
                <Select 
                  value={formData.vehicleId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Vehicle</SelectItem>
                    {vehicles.map(vehicle => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Module-Specific Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {formData.sourceModule.charAt(0).toUpperCase() + formData.sourceModule.slice(1)} Specific
              </h3>
              {getModuleSpecificFields()}
            </div>

            {/* Form Actions */}
            <div className="flex justify-between pt-6 border-t">
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Event
                  </>
                )}
              </Button>
              
              <div className="flex space-x-3">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Event
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )

  function getModuleSpecificFields() {
    switch (formData.sourceModule) {
      case 'service':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Service Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="waiting_parts">Waiting for Parts</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      
      case 'delivery':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="location">Delivery Address</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter delivery address"
              />
            </div>
            <div>
              <Label htmlFor="status">Delivery Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      
      case 'task':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Task Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      
      case 'pdi':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Inspection Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }
}