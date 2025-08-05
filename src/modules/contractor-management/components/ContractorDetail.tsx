import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft,
  ArrowRight,
  Star, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Clock,
  Plus,
  Edit,
  Save,
  X,
  User,
  Briefcase,
  CheckCircle
} from 'lucide-react'
import { useContractorManagement } from '../hooks/useContractorManagement'
import { ContractorTrade, ContractorJobType, Priority, AvailabilityStatus } from '@/types'
import { cn } from '@/lib/utils'

// Helper functions
const getTradeDisplayName = (trade: ContractorTrade): string => {
  const tradeNames: Record<ContractorTrade, string> = {
    [ContractorTrade.ELECTRICAL]: 'Electrical',
    [ContractorTrade.PLUMBING]: 'Plumbing',
    [ContractorTrade.SKIRTING]: 'Skirting',
    [ContractorTrade.HVAC]: 'HVAC',
    [ContractorTrade.FLOORING]: 'Flooring',
    [ContractorTrade.ROOFING]: 'Roofing',
    [ContractorTrade.GENERAL]: 'General',
    [ContractorTrade.LANDSCAPING]: 'Landscaping'
  }
  return tradeNames[trade] || trade
}

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

const getWeekDates = (startDate: Date) => {
  const dates = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    dates.push(date)
  }
  return dates
}

export function ContractorDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    getContractorById,
    getJobsByContractor,
    getContractorAvailability,
    pendingJobs,
    assignJobToContractor,
    updateContractor,
    addAvailabilitySlot,
    loading,
    error
  } = useContractorManagement()

  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    trade: ContractorTrade.GENERAL,
    notes: ''
  })

  const [currentWeek, setCurrentWeek] = useState(() => {
    const today = new Date()
    const monday = new Date(today)
    monday.setDate(today.getDate() - today.getDay() + 1)
    return monday
  })

  const contractorJobs = useMemo(() => {
    if (!contractor) return []
    return getJobsByContractor(contractor.id)
  }, [contractor, getJobsByContractor])

  const contractorAvailability = useMemo(() => {
    if (!contractor) return []
    return getContractorAvailability(contractor.id)
  }, [contractor, getContractorAvailability])

  const weekDates = useMemo(() => getWeekDates(currentWeek), [currentWeek])

  // Initialize edit form when contractor loads
  React.useEffect(() => {
    if (contractor) {
      setEditForm({
        name: contractor.name,
        email: contractor.contactInfo.email,
        phone: contractor.contactInfo.phone,
        address: contractor.contactInfo.address || '',
        trade: contractor.trade,
        notes: contractor.notes || ''
      })
    }
  }, [contractor])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !contractor) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error || 'Contractor not found'}</p>
        <Button onClick={() => navigate('/contractors')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Directory
        </Button>
      </div>
    )
  }

  const handleSave = () => {
    updateContractor(contractor.id, {
      name: editForm.name,
      contactInfo: {
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address
      },
      trade: editForm.trade,
      notes: editForm.notes
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm({
      name: contractor.name,
      email: contractor.contactInfo.email,
      phone: contractor.contactInfo.phone,
      address: contractor.contactInfo.address || '',
      trade: contractor.trade,
      notes: contractor.notes || ''
    })
    setIsEditing(false)
  }

  const handleAssignJob = (jobId: string) => {
    try {
      assignJobToContractor(jobId, contractor.id)
    } catch (error) {
      console.error('Failed to assign job:', error)
    }
  }

  const getAvailabilityForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return contractorAvailability.filter(slot => slot.date === dateStr)
  }

  const getJobsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return contractorJobs.filter(job => 
      job.scheduledDate.toISOString().split('T')[0] === dateStr
    )
  }

  const [newSlotDate, setNewSlotDate] = useState('')
  const [newSlotStartTime, setNewSlotStartTime] = useState('09:00')
  const [newSlotEndTime, setNewSlotEndTime] = useState('17:00')
  const [newSlotStatus, setNewSlotStatus] = useState<AvailabilityStatus>(AvailabilityStatus.AVAILABLE)

  // Always call hooks at the top level, before any early returns
  const contractor = useMemo(() => {
    if (!id) return null
    return getContractorById(id)
  }, [id, getContractorById])

  const handleAddAvailability = async () => {
    if (!newSlotDate || !newSlotStartTime || !newSlotEndTime) {
      alert('Please fill all availability fields.')
      return
    }
    try {
      await addAvailabilitySlot({
        contractorId: contractor.id,
        date: newSlotDate,
        startTime: newSlotStartTime,
        endTime: newSlotEndTime,
        status: newSlotStatus,
      })
      setNewSlotDate('')
      setNewSlotStartTime('09:00')
      setNewSlotEndTime('17:00')
      setNewSlotStatus(AvailabilityStatus.AVAILABLE)
    } catch (error) {
      console.error('Failed to add availability slot:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/contractors')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{contractor.name}</h1>
            <p className="text-muted-foreground">
              {getTradeDisplayName(contractor.trade)} Contractor
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contractor Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contractor Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="trade">Trade</Label>
                    <Select value={editForm.trade} onValueChange={(value) => setEditForm(prev => ({ ...prev, trade: value as ContractorTrade }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ContractorTrade).map(trade => (
                          <SelectItem key={trade} value={trade}>
                            {getTradeDisplayName(trade)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={editForm.address}
                      onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={editForm.notes}
                      onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label>Trade</Label>
                    <Badge variant="outline" className="mt-1">
                      {getTradeDisplayName(contractor.trade)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{contractor.contactInfo.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{contractor.contactInfo.phone}</span>
                  </div>
                  {contractor.contactInfo.address && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{contractor.contactInfo.address}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-medium">{contractor.ratings.averageRating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({contractor.ratings.reviewCount} reviews)
                    </span>
                  </div>
                  {contractor.notes && (
                    <div>
                      <Label>Notes</Label>
                      <p className="text-sm text-muted-foreground mt-1">{contractor.notes}</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Jobs</span>
                <span className="font-medium">{contractor.assignedJobIds.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Completed Jobs</span>
                <span className="font-medium">
                  {contractorJobs.filter(job => job.status === 'completed').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Average Rating</span>
                <span className="font-medium">{contractor.ratings.averageRating}/5.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={contractor.isActive ? 'default' : 'secondary'}>
                  {contractor.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Assign Job */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Assign Job
              </CardTitle>
              <CardDescription>
                Assign pending jobs to this contractor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingJobs
                  .filter(job => job.trade === contractor.trade)
                  .map((job) => (
                    <div key={job.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{job.description}</h4>
                        <Badge variant="outline">
                          {job.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        {job.unitAddress}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mb-3">
                        <Clock className="h-3 w-3 mr-1" />
                        {job.scheduledDate.toLocaleDateString()} - {job.estimatedDuration}h
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleAssignJob(job.id)}
                      >
                        Assign Job
                      </Button>
                    </div>
                  ))}
                
                {pendingJobs.filter(job => job.trade === contractor.trade).length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No pending jobs for this trade</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule and Jobs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="schedule" className="space-y-4">
            <TabsList>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
            </TabsList>

            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Weekly Schedule
                  </CardTitle>
                  <CardDescription>
                    Availability and assigned jobs for the week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="min-w-[600px]">
                      {/* Week Header */}
                      <div className="grid grid-cols-7 gap-2 mb-4">
                        {weekDates.map((date, index) => (
                          <div key={index} className="text-center p-2 border rounded">
                            <div className="font-medium text-sm">
                              {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Schedule Grid */}
                      <div className="grid grid-cols-7 gap-2">
                        {weekDates.map((date, dateIndex) => {
                          const availability = getAvailabilityForDate(date)
                          const jobs = getJobsForDate(date)
                          
                          return (
                            <div key={dateIndex} className="min-h-[200px] border rounded-lg p-2 space-y-2">
                              {/* Availability Slots */}
                              {availability.map((slot) => (
                                <div
                                  key={slot.id}
                                  className={cn(
                                    "text-xs p-2 rounded border",
                                    slot.status === AvailabilityStatus.AVAILABLE
                                      ? "bg-green-50 border-green-200 text-green-700"
                                      : slot.status === AvailabilityStatus.BOOKED
                                      ? "bg-red-50 border-red-200 text-red-700"
                                      : "bg-gray-50 border-gray-200 text-gray-700"
                                  )}
                                >
                                  <div className="font-medium">
                                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                  </div>
                                  <div>
                                    {slot.status === AvailabilityStatus.AVAILABLE ? 'Available' : 
                                     slot.status === AvailabilityStatus.BOOKED ? 'Booked' : 'Unavailable'}
                                  </div>
                                </div>
                              ))}

                              {/* Assigned Jobs */}
                              {jobs.map((job) => (
                                <div
                                  key={job.id}
                                  className="text-xs p-2 rounded bg-blue-50 border-blue-200 text-blue-700"
                                >
                                  <div className="font-medium">{job.description}</div>
                                  <div className="flex items-center mt-1">
                                    <MapPin className="h-2 w-2 mr-1" />
                                    {job.unitAddress}
                                  </div>
                                  <div className="flex items-center mt-1">
                                    <Clock className="h-2 w-2 mr-1" />
                                    {job.estimatedDuration}h
                                  </div>
                                </div>
                              ))}

                              {availability.length === 0 && jobs.length === 0 && (
                                <div className="text-xs text-muted-foreground text-center py-8">
                                  No schedule
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {/* Add New Availability Slot */}
                      <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                        <h4 className="font-semibold text-lg mb-3">Add New Availability</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <Label htmlFor="newSlotDate">Date</Label>
                            <Input
                              id="newSlotDate"
                              type="date"
                              value={newSlotDate}
                              onChange={(e) => setNewSlotDate(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="newSlotStartTime">Start Time</Label>
                            <Input
                              id="newSlotStartTime"
                              type="time"
                              value={newSlotStartTime}
                              onChange={(e) => setNewSlotStartTime(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="newSlotEndTime">End Time</Label>
                            <Input
                              id="newSlotEndTime"
                              type="time"
                              value={newSlotEndTime}
                              onChange={(e) => setNewSlotEndTime(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="newSlotStatus">Status</Label>
                            <Select value={newSlotStatus} onValueChange={(value) => setNewSlotStatus(value as AvailabilityStatus)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(AvailabilityStatus).map(status => (
                                  <SelectItem key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button onClick={handleAddAvailability} className="mt-4 w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Availability Slot
                        </Button>
                      </div>

                      {/* Week Navigation */}
                      <div className="flex items-center justify-center space-x-2 mt-6">
                        <Button variant="outline" size="sm" onClick={() => setCurrentWeek(prev => {
                          const newWeek = new Date(prev); newWeek.setDate(prev.getDate() - 7); return newWeek;
                        })}>
                          <ArrowLeft className="h-4 w-4" /> Previous Week
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setCurrentWeek(new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)))}>
                          Today
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setCurrentWeek(prev => {
                          const newWeek = new Date(prev); newWeek.setDate(prev.getDate() + 7); return newWeek;
                        })}>
                          Next Week <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jobs">
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Jobs</CardTitle>
                  <CardDescription>
                    All jobs assigned to this contractor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contractorJobs.map((job) => (
                      <div key={job.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{job.description}</h4>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {job.unitAddress}
                            </div>
                          </div>
                          <Badge variant={
                            job.status === 'completed' ? 'default' :
                            job.status === 'in_progress' ? 'secondary' :
                            job.status === 'assigned' ? 'outline' : 'destructive'
                          }>
                            {job.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Scheduled:</span>
                            <div>{job.scheduledDate.toLocaleDateString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration:</span>
                            <div>{job.estimatedDuration} hours</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Priority:</span>
                            <div>{job.priority}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Customer:</span>
                            <div>{job.customerName || 'N/A'}</div>
                          </div>
                        </div>

                        {job.specialInstructions && (
                          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                            <strong>Special Instructions:</strong> {job.specialInstructions}
                          </div>
                        )}
                      </div>
                    ))}

                    {contractorJobs.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No jobs assigned to this contractor</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}