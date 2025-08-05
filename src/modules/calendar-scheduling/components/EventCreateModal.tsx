import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { X, Save, Calendar, Clock, User, MapPin } from 'lucide-react'
import { CalendarEvent } from '../types'
import { useToast } from '@/hooks/use-toast'
import { useLeadManagement } from '@/modules/crm-prospecting/hooks/useLeadManagement'
import { useInventoryManagement } from '@/modules/inventory-management/hooks/useInventoryManagement'

interface EventCreateModalProps {
  initialDate?: Date
  onSave: (eventData: Partial<CalendarEvent>) => Promise<void>
  onCancel: () => void
}

export function EventCreateModal({ initialDate, onSave, onCancel }: EventCreateModalProps) {
  const { toast } = useToast()
  const { leads, salesReps } = useLeadManagement()
  const { vehicles } = useInventoryManagement()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sourceModule: 'service' as 'service' | 'delivery' | 'task' | 'pdi',
    startDate: initialDate ? initialDate.toISOString().slice(0, 16) : '',
    endDate: initialDate ? new Date(initialDate.getTime() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16) : '',
    assignedTo: '',
    customerId: '',
    vehicleId: '',
    location: '',
    priority: 'medium',
    status: 'scheduled'
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
        sourceModule: formData.sourceModule,
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo || undefined,
        customerId: formData.customerId || undefined,
        vehicleId: formData.vehicleId || undefined,
        location: formData.location || undefined,
        metadata: {
          createdFromCalendar: true,
          customerName: formData.customerId ? leads.find(l => l.id === formData.customerId)?.firstName + ' ' + leads.find(l => l.id === formData.customerId)?.lastName : undefined,
          vehicleInfo: formData.vehicleId ? (() => {
            const vehicle = vehicles.find(v => v.id === formData.vehicleId)
            return vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : undefined
          })() : undefined,
          assignedToName: formData.assignedTo ? salesReps.find(r => r.id === formData.assignedTo)?.name : undefined
        }
      }

      await onSave(eventData)
      
      toast({
        title: 'Event Created',
        description: 'Calendar event has been created successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create calendar event',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const getModuleSpecificFields = () => {
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
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Create Calendar Event
              </CardTitle>
              <CardDescription>
                Create a new event that will sync with the appropriate module
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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

              <div>
                <Label htmlFor="sourceModule">Event Type *</Label>
                <Select 
                  value={formData.sourceModule} 
                  onValueChange={(value: 'service' | 'delivery' | 'task' | 'pdi') => 
                    setFormData(prev => ({ ...prev, sourceModule: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">Service Ticket</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="pdi">PDI Inspection</SelectItem>
                  </SelectContent>
                </Select>
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
                {formData.sourceModule.charAt(0).toUpperCase() + formData.sourceModule.slice(1)} Details
              </h3>
              {getModuleSpecificFields()}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Event
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}