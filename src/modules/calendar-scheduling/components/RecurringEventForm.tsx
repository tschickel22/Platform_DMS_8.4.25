import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { X, Save, Repeat, Calendar, Clock } from 'lucide-react'
import { CalendarEvent } from '../types'
import { useToast } from '@/hooks/use-toast'

interface RecurringEventFormProps {
  event?: CalendarEvent
  onSave: (eventData: Partial<CalendarEvent> & { recurrence: RecurrencePattern }) => Promise<void>
  onCancel: () => void
}

interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number
  daysOfWeek?: number[] // 0 = Sunday, 1 = Monday, etc.
  dayOfMonth?: number
  weekOfMonth?: number
  endType: 'never' | 'after' | 'on'
  endAfter?: number
  endOn?: Date
  exceptions?: Date[]
}

export function RecurringEventForm({ event, onSave, onCancel }: RecurringEventFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    sourceModule: event?.sourceModule || 'task' as const,
    startDate: event?.start ? event.start.toISOString().slice(0, 16) : '',
    endDate: event?.end ? event.end.toISOString().slice(0, 16) : '',
    assignedTo: event?.assignedTo || '',
    location: event?.location || '',
    priority: event?.priority || 'medium',
    status: event?.status || 'scheduled'
  })

  const [recurrence, setRecurrence] = useState<RecurrencePattern>({
    type: 'weekly',
    interval: 1,
    daysOfWeek: [1], // Default to Monday
    endType: 'never'
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

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

    // Validate recurrence pattern
    if (recurrence.endType === 'after' && (!recurrence.endAfter || recurrence.endAfter <= 0)) {
      toast({
        title: 'Validation Error',
        description: 'Please specify how many occurrences',
        variant: 'destructive'
      })
      return
    }

    if (recurrence.endType === 'on' && !recurrence.endOn) {
      toast({
        title: 'Validation Error',
        description: 'Please specify end date',
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
        location: formData.location || undefined,
        metadata: {
          isRecurring: true,
          recurrencePattern: recurrence
        }
      }

      await onSave({ ...eventData, recurrence })
      
      toast({
        title: 'Recurring Event Created',
        description: `Created recurring ${recurrence.type} event`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create recurring event',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateRecurrence = (field: keyof RecurrencePattern, value: any) => {
    setRecurrence(prev => ({ ...prev, [field]: value }))
  }

  const toggleDayOfWeek = (day: number) => {
    const currentDays = recurrence.daysOfWeek || []
    if (currentDays.includes(day)) {
      updateRecurrence('daysOfWeek', currentDays.filter(d => d !== day))
    } else {
      updateRecurrence('daysOfWeek', [...currentDays, day].sort())
    }
  }

  const getDayName = (day: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days[day]
  }

  const getRecurrencePreview = () => {
    const { type, interval, daysOfWeek, endType, endAfter, endOn } = recurrence
    
    let preview = `Repeats ${interval > 1 ? `every ${interval}` : 'every'} ${type}`
    
    if (type === 'weekly' && daysOfWeek && daysOfWeek.length > 0) {
      const dayNames = daysOfWeek.map(getDayName).join(', ')
      preview += ` on ${dayNames}`
    }
    
    if (endType === 'after') {
      preview += `, ${endAfter} times`
    } else if (endType === 'on') {
      preview += `, until ${endOn?.toLocaleDateString()}`
    }
    
    return preview
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Repeat className="h-5 w-5 mr-2 text-primary" />
                Create Recurring Event
              </CardTitle>
              <CardDescription>
                Create an event that repeats on a schedule
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Event Information */}
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
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the event"
                />
              </div>

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

            {/* Recurrence Pattern */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recurrence Pattern</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="recurrenceType">Repeat</Label>
                  <Select 
                    value={recurrence.type} 
                    onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'yearly') => 
                      updateRecurrence('type', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="interval">Every</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="interval"
                      type="number"
                      min="1"
                      max="99"
                      value={recurrence.interval}
                      onChange={(e) => updateRecurrence('interval', parseInt(e.target.value) || 1)}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">
                      {recurrence.type}(s)
                    </span>
                  </div>
                </div>
              </div>

              {/* Weekly specific options */}
              {recurrence.type === 'weekly' && (
                <div>
                  <Label>Days of the week</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[0, 1, 2, 3, 4, 5, 6].map(day => (
                      <Button
                        key={day}
                        type="button"
                        variant={recurrence.daysOfWeek?.includes(day) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleDayOfWeek(day)}
                        className="w-12"
                      >
                        {getDayName(day)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* End condition */}
              <div>
                <Label>Ends</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="never"
                      name="endType"
                      checked={recurrence.endType === 'never'}
                      onChange={() => updateRecurrence('endType', 'never')}
                    />
                    <Label htmlFor="never">Never</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="after"
                      name="endType"
                      checked={recurrence.endType === 'after'}
                      onChange={() => updateRecurrence('endType', 'after')}
                    />
                    <Label htmlFor="after">After</Label>
                    <Input
                      type="number"
                      min="1"
                      value={recurrence.endAfter || ''}
                      onChange={(e) => updateRecurrence('endAfter', parseInt(e.target.value) || undefined)}
                      className="w-20"
                      disabled={recurrence.endType !== 'after'}
                    />
                    <span className="text-sm text-muted-foreground">occurrences</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="on"
                      name="endType"
                      checked={recurrence.endType === 'on'}
                      onChange={() => updateRecurrence('endType', 'on')}
                    />
                    <Label htmlFor="on">On</Label>
                    <Input
                      type="date"
                      value={recurrence.endOn ? recurrence.endOn.toISOString().split('T')[0] : ''}
                      onChange={(e) => updateRecurrence('endOn', e.target.value ? new Date(e.target.value) : undefined)}
                      disabled={recurrence.endType !== 'on'}
                    />
                  </div>
                </div>
              </div>

              {/* Recurrence Preview */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Repeat className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Preview:</span>
                </div>
                <p className="text-blue-800 mt-1">{getRecurrencePreview()}</p>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Advanced Options</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? 'Hide' : 'Show'} Advanced
                </Button>
              </div>

              {showAdvanced && (
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Event location"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="assignedTo">Assigned To</Label>
                    <Input
                      id="assignedTo"
                      value={formData.assignedTo}
                      onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                      placeholder="Assignee"
                    />
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={formData.priority} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                    >
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
              )}
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
                    Create Recurring Event
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