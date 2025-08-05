import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Link } from 'react-router-dom'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowLeft
} from 'lucide-react'
import { useContractorManagement } from '../hooks/useContractorManagement'
import { ContractorTrade, ContractorJobStatus, Priority, AvailabilityStatus } from '@/types'
import { cn } from '@/lib/utils'

// Helper function to get trade display name
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

// Helper function to get priority badge variant
const getPriorityBadgeVariant = (priority: Priority) => {
  switch (priority) {
    case Priority.URGENT:
      return 'destructive'
    case Priority.HIGH:
      return 'destructive'
    case Priority.MEDIUM:
      return 'secondary'
    case Priority.LOW:
      return 'outline'
    default:
      return 'outline'
  }
}

// Helper function to format time
const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

// Helper function to get dates for the week
const getWeekDates = (startDate: Date) => {
  const dates = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    dates.push(date)
  }
  return dates
}

export function DispatchBoard() {
  const {
    contractors,
    availabilitySlots,
    contractorJobs,
    pendingJobs,
    assignJobToContractor,
    loading,
    error
  } = useContractorManagement()

  const [currentWeek, setCurrentWeek] = useState(() => {
    const today = new Date()
    const monday = new Date(today)
    monday.setDate(today.getDate() - today.getDay() + 1)
    return monday
  })
  
  const [selectedTrade, setSelectedTrade] = useState<string>('all')
  const [draggedJob, setDraggedJob] = useState<string | null>(null)

  // Get week dates
  const weekDates = useMemo(() => getWeekDates(currentWeek), [currentWeek])

  // Filter contractors by trade
  const filteredContractors = useMemo(() => {
    return contractors.filter(contractor => 
      contractor.isActive && 
      (selectedTrade === 'all' || contractor.trade === selectedTrade)
    )
  }, [contractors, selectedTrade])

  // Navigate weeks
  const goToPreviousWeek = () => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(currentWeek.getDate() - 7)
    setCurrentWeek(newWeek)
  }

  const goToNextWeek = () => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(currentWeek.getDate() + 7)
    setCurrentWeek(newWeek)
  }

  const goToCurrentWeek = () => {
    const today = new Date()
    const monday = new Date(today)
    monday.setDate(today.getDate() - today.getDay() + 1)
    setCurrentWeek(monday)
  }

  // Handle drag and drop
  const handleDragStart = (jobId: string) => {
    setDraggedJob(jobId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, contractorId: string, slotId?: string) => {
    e.preventDefault()
    if (draggedJob) {
      try {
        assignJobToContractor(draggedJob, contractorId, slotId)
        setDraggedJob(null)
      } catch (error) {
        console.error('Failed to assign job:', error)
      }
    }
  }

  // Get availability slots for a contractor on a specific date
  const getContractorSlotsForDate = (contractorId: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return availabilitySlots.filter(slot => 
      slot.contractorId === contractorId && slot.date === dateStr
    )
  }

  // Get assigned jobs for a contractor on a specific date
  const getContractorJobsForDate = (contractorId: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return contractorJobs.filter(job => 
      job.assignedContractorId === contractorId &&
      job.scheduledDate.toISOString().split('T')[0] === dateStr
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/contractors">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Directory
            </Button>
          </Link>
          <div className="ri-page-header">
            <h1 className="ri-page-title">Dispatch Board</h1>
            <p className="ri-page-description">
              Assign jobs to contractors using drag and drop
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Week Navigation */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium ml-4">
            Week of {currentWeek.toLocaleDateString()}
          </span>
        </div>

        {/* Trade Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedTrade} onValueChange={setSelectedTrade}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by trade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trades</SelectItem>
              {Object.values(ContractorTrade).map(trade => (
                <SelectItem key={trade} value={trade}>
                  {getTradeDisplayName(trade)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Pending Jobs Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Pending Jobs ({pendingJobs.length})
              </CardTitle>
              <CardDescription>
                Drag jobs to assign them to contractors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingJobs.map((job) => (
                  <div
                    key={job.id}
                    draggable
                    onDragStart={() => handleDragStart(job.id)}
                    className={cn(
                      "p-3 border rounded-lg cursor-move hover:bg-accent transition-colors",
                      draggedJob === job.id && "opacity-50"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={getPriorityBadgeVariant(job.priority)}>
                        {job.priority}
                      </Badge>
                      <Badge variant="outline">
                        {getTradeDisplayName(job.trade)}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{job.description}</h4>
                    <div className="flex items-center text-xs text-muted-foreground mb-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {job.unitAddress}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {job.scheduledDate.toLocaleDateString()} - {job.estimatedDuration}h
                    </div>
                    {job.customerName && (
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <User className="h-3 w-3 mr-1" />
                        {job.customerName}
                      </div>
                    )}
                  </div>
                ))}
                
                {pendingJobs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No pending jobs</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>
                Contractor availability and assigned jobs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Header Row */}
                  <div className="grid grid-cols-8 gap-2 mb-4">
                    <div className="font-medium text-sm text-muted-foreground">
                      Contractor
                    </div>
                    {weekDates.map((date, index) => (
                      <div key={index} className="text-center">
                        <div className="font-medium text-sm">
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Contractor Rows */}
                  {filteredContractors.map((contractor) => (
                    <div key={contractor.id} className="grid grid-cols-8 gap-2 mb-4 pb-4 border-b">
                      {/* Contractor Info */}
                      <div className="flex items-center space-x-2">
                        <div>
                          <div className="font-medium text-sm">{contractor.name}</div>
                          <Badge variant="outline" className="text-xs">
                            {getTradeDisplayName(contractor.trade)}
                          </Badge>
                        </div>
                      </div>

                      {/* Daily Slots */}
                      {weekDates.map((date, dateIndex) => {
                        const slots = getContractorSlotsForDate(contractor.id, date)
                        const jobs = getContractorJobsForDate(contractor.id, date)
                        
                        return (
                          <div
                            key={dateIndex}
                            className="min-h-[100px] border rounded-lg p-2 space-y-1"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, contractor.id)}
                          >
                            {/* Availability Slots */}
                            {slots.map((slot) => (
                              <div
                                key={slot.id}
                                className={cn(
                                  "text-xs p-1 rounded border",
                                  slot.status === AvailabilityStatus.AVAILABLE
                                    ? "bg-green-50 border-green-200 text-green-700"
                                    : slot.status === AvailabilityStatus.BOOKED
                                    ? "bg-red-50 border-red-200 text-red-700"
                                    : "bg-gray-50 border-gray-200 text-gray-700"
                                )}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, contractor.id, slot.id)}
                              >
                                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                {slot.status === AvailabilityStatus.BOOKED && slot.jobId && (
                                  <div className="font-medium">Booked</div>
                                )}
                              </div>
                            ))}

                            {/* Assigned Jobs */}
                            {jobs.map((job) => (
                              <div
                                key={job.id}
                                className="text-xs p-1 rounded bg-blue-50 border-blue-200 text-blue-700"
                              >
                                <div className="font-medium">{job.description}</div>
                                <div className="flex items-center">
                                  <MapPin className="h-2 w-2 mr-1" />
                                  {job.unitAddress}
                                </div>
                              </div>
                            ))}

                            {slots.length === 0 && jobs.length === 0 && (
                              <div className="text-xs text-muted-foreground text-center py-4">
                                No schedule
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ))}

                  {filteredContractors.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No contractors found for selected trade</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}