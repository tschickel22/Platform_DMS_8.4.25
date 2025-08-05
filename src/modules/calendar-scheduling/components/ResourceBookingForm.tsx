import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { X, Save, Calendar, MapPin, Users, Clock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Resource {
  id: string
  name: string
  type: 'room' | 'equipment' | 'vehicle' | 'person'
  capacity?: number
  location?: string
  isAvailable: boolean
  bookings: ResourceBooking[]
}

interface ResourceBooking {
  id: string
  resourceId: string
  eventId: string
  startTime: Date
  endTime: Date
  bookedBy: string
  notes?: string
}

interface ResourceBookingFormProps {
  selectedDate?: Date
  onSave: (bookingData: ResourceBookingData) => Promise<void>
  onCancel: () => void
}

interface ResourceBookingData {
  title: string
  description: string
  startTime: Date
  endTime: Date
  resourceIds: string[]
  attendees: string[]
  notes: string
}

export function ResourceBookingForm({ selectedDate, onSave, onCancel }: ResourceBookingFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  // Mock resources - in a real app, this would come from a hook
  const [resources] = useState<Resource[]>([
    {
      id: 'room-1',
      name: 'Conference Room A',
      type: 'room',
      capacity: 8,
      location: 'Main Building, 2nd Floor',
      isAvailable: true,
      bookings: []
    },
    {
      id: 'room-2',
      name: 'Meeting Room B',
      type: 'room',
      capacity: 4,
      location: 'Main Building, 1st Floor',
      isAvailable: true,
      bookings: []
    },
    {
      id: 'eq-1',
      name: 'Projector #1',
      type: 'equipment',
      location: 'Equipment Storage',
      isAvailable: true,
      bookings: []
    },
    {
      id: 'veh-1',
      name: 'Delivery Truck #1',
      type: 'vehicle',
      location: 'Parking Lot A',
      isAvailable: true,
      bookings: []
    }
  ])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: selectedDate ? selectedDate.toISOString().slice(0, 16) : '',
    endTime: selectedDate ? new Date(selectedDate.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16) : '',
    resourceIds: [] as string[],
    attendees: [] as string[],
    notes: ''
  })

  const [newAttendee, setNewAttendee] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.startTime || !formData.endTime) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      toast({
        title: 'Validation Error',
        description: 'End time must be after start time',
        variant: 'destructive'
      })
      return
    }

    if (formData.resourceIds.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one resource',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      const bookingData: ResourceBookingData = {
        title: formData.title,
        description: formData.description,
        startTime: new Date(formData.startTime),
        endTime: new Date(formData.endTime),
        resourceIds: formData.resourceIds,
        attendees: formData.attendees,
        notes: formData.notes
      }

      await onSave(bookingData)
      
      toast({
        title: 'Resource Booked',
        description: `Successfully booked ${formData.resourceIds.length} resource(s)`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to book resources',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleResource = (resourceId: string) => {
    setFormData(prev => ({
      ...prev,
      resourceIds: prev.resourceIds.includes(resourceId)
        ? prev.resourceIds.filter(id => id !== resourceId)
        : [...prev.resourceIds, resourceId]
    }))
  }

  const addAttendee = () => {
    if (newAttendee.trim() && !formData.attendees.includes(newAttendee.trim())) {
      setFormData(prev => ({
        ...prev,
        attendees: [...prev.attendees, newAttendee.trim()]
      }))
      setNewAttendee('')
    }
  }

  const removeAttendee = (attendee: string) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter(a => a !== attendee)
    }))
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'room': return <MapPin className="h-4 w-4" />
      case 'equipment': return <Calendar className="h-4 w-4" />
      case 'vehicle': return <Calendar className="h-4 w-4" />
      case 'person': return <Users className="h-4 w-4" />
      default: return <Calendar className="h-4 w-4" />
    }
  }

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'room': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'equipment': return 'bg-green-50 text-green-700 border-green-200'
      case 'vehicle': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'person': return 'bg-orange-50 text-orange-700 border-orange-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const checkResourceAvailability = (resource: Resource) => {
    if (!formData.startTime || !formData.endTime) return true
    
    const startTime = new Date(formData.startTime)
    const endTime = new Date(formData.endTime)
    
    // Check for conflicts with existing bookings
    return !resource.bookings.some(booking => 
      (startTime < booking.endTime && endTime > booking.startTime)
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Book Resources
              </CardTitle>
              <CardDescription>
                Reserve rooms, equipment, and other resources
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
              <h3 className="text-lg font-semibold">Booking Information</h3>
              
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

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Resource Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Resources</h3>
              
              <div className="grid gap-3 md:grid-cols-2">
                {resources.map(resource => {
                  const isSelected = formData.resourceIds.includes(resource.id)
                  const isAvailable = checkResourceAvailability(resource)
                  
                  return (
                    <div
                      key={resource.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        isSelected 
                          ? 'border-primary bg-primary/5' 
                          : isAvailable 
                            ? 'border-border hover:bg-accent' 
                            : 'border-red-200 bg-red-50 cursor-not-allowed'
                      }`}
                      onClick={() => isAvailable && toggleResource(resource.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {getResourceIcon(resource.type)}
                            <span className="font-medium">{resource.name}</span>
                            <Badge className={getResourceTypeColor(resource.type)}>
                              {resource.type}
                            </Badge>
                          </div>
                          
                          {resource.capacity && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Capacity: {resource.capacity} people
                            </p>
                          )}
                          
                          {resource.location && (
                            <p className="text-sm text-muted-foreground">
                              Location: {resource.location}
                            </p>
                          )}
                          
                          {!isAvailable && (
                            <p className="text-sm text-red-600 mt-1">
                              Not available during selected time
                            </p>
                          )}
                        </div>
                        
                        {isSelected && (
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {formData.resourceIds.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    Selected {formData.resourceIds.length} resource(s): {
                      formData.resourceIds.map(id => 
                        resources.find(r => r.id === id)?.name
                      ).join(', ')
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Attendees */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Attendees</h3>
              
              <div className="flex space-x-2">
                <Input
                  value={newAttendee}
                  onChange={(e) => setNewAttendee(e.target.value)}
                  placeholder="Add attendee email"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addAttendee()
                    }
                  }}
                />
                <Button type="button" onClick={addAttendee}>
                  Add
                </Button>
              </div>

              {formData.attendees.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.attendees.map(attendee => (
                    <Badge key={attendee} variant="secondary" className="flex items-center space-x-1">
                      <span>{attendee}</span>
                      <button
                        type="button"
                        onClick={() => removeAttendee(attendee)}
                        className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional notes for this booking"
                rows={3}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || formData.resourceIds.length === 0}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Booking...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Book Resources
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