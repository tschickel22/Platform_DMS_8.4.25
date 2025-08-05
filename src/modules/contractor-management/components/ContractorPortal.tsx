import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Mail,
  Camera,
  CheckCircle,
  AlertCircle,
  Calendar,
  Star,
  Upload,
  Play,
  Pause,
  Square
} from 'lucide-react'
import { useContractorManagement } from '../hooks/useContractorManagement'
import { ContractorJobStatus, Priority } from '@/types'
import { cn } from '@/lib/utils'

// Helper functions
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

const getStatusBadgeVariant = (status: ContractorJobStatus) => {
  switch (status) {
    case ContractorJobStatus.COMPLETED:
      return 'default'
    case ContractorJobStatus.ON_SITE:
      return 'secondary'
    case ContractorJobStatus.EN_ROUTE:
      return 'outline'
    case ContractorJobStatus.ASSIGNED:
      return 'outline'
    default:
      return 'outline'
  }
}

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

interface TimeTracker {
  jobId: string
  startTime: Date | null
  totalMinutes: number
  isRunning: boolean
}

export function ContractorPortal() {
  const [searchParams] = useSearchParams()
  const contractorId = searchParams.get('contractorId') || 'contractor-1' // Default for demo
  
  const {
    getContractorById,
    getJobsByContractor,
    updateContractorJob,
    loading,
    error
  } = useContractorManagement()

  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [jobNotes, setJobNotes] = useState('')
  const [jobPhotos, setJobPhotos] = useState<string[]>([])
  const [timeTrackers, setTimeTrackers] = useState<Record<string, TimeTracker>>({})

  const contractor = useMemo(() => {
    return getContractorById(contractorId)
  }, [contractorId, getContractorById])

  const contractorJobs = useMemo(() => {
    if (!contractor) return []
    return getJobsByContractor(contractor.id).filter(job => 
      job.status !== ContractorJobStatus.COMPLETED &&
      job.status !== ContractorJobStatus.CANCELLED
    )
  }, [contractor, getJobsByContractor])

  const completedJobs = useMemo(() => {
    if (!contractor) return []
    return getJobsByContractor(contractor.id).filter(job => 
      job.status === ContractorJobStatus.COMPLETED
    )
  }, [contractor, getJobsByContractor])

  const todaysJobs = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return contractorJobs.filter(job => 
      job.scheduledDate.toISOString().split('T')[0] === today
    )
  }, [contractorJobs])

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
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">{error || 'Contractor not found'}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please check your contractor ID or contact support.
        </p>
      </div>
    )
  }

  const handleStatusUpdate = (jobId: string, newStatus: ContractorJobStatus) => {
    updateContractorJob(jobId, { 
      status: newStatus,
      ...(newStatus === ContractorJobStatus.COMPLETED && { completedAt: new Date() })
    })
    
    // Stop time tracker if completing job
    if (newStatus === ContractorJobStatus.COMPLETED && timeTrackers[jobId]?.isRunning) {
      stopTimeTracker(jobId)
    }
  }

  const handleAddNotes = (jobId: string) => {
    if (!jobNotes.trim()) return
    
    const job = contractorJobs.find(j => j.id === jobId)
    if (job) {
      const updatedNotes = job.notes ? `${job.notes}\n\n[${new Date().toLocaleString()}] ${jobNotes}` : jobNotes
      updateContractorJob(jobId, { notes: updatedNotes })
      setJobNotes('')
    }
  }

  const handlePhotoUpload = (jobId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    // Simulate photo upload - in real app, would upload to cloud storage
    const newPhotos = Array.from(files).map(file => URL.createObjectURL(file))
    const job = contractorJobs.find(j => j.id === jobId)
    if (job) {
      updateContractorJob(jobId, { 
        photos: [...job.photos, ...newPhotos]
      })
    }
  }

  const startTimeTracker = (jobId: string) => {
    setTimeTrackers(prev => ({
      ...prev,
      [jobId]: {
        jobId,
        startTime: new Date(),
        totalMinutes: prev[jobId]?.totalMinutes || 0,
        isRunning: true
      }
    }))
  }

  const stopTimeTracker = (jobId: string) => {
    setTimeTrackers(prev => {
      const tracker = prev[jobId]
      if (!tracker || !tracker.startTime) return prev

      const elapsedMinutes = Math.floor((Date.now() - tracker.startTime.getTime()) / (1000 * 60))
      return {
        ...prev,
        [jobId]: {
          ...tracker,
          startTime: null,
          totalMinutes: tracker.totalMinutes + elapsedMinutes,
          isRunning: false
        }
      }
    })
  }

  const resetTimeTracker = (jobId: string) => {
    setTimeTrackers(prev => ({
      ...prev,
      [jobId]: {
        jobId,
        startTime: null,
        totalMinutes: 0,
        isRunning: false
      }
    }))
  }

  const getDisplayTime = (jobId: string): number => {
    const tracker = timeTrackers[jobId]
    if (!tracker) return 0
    
    let totalMinutes = tracker.totalMinutes
    if (tracker.isRunning && tracker.startTime) {
      const elapsedMinutes = Math.floor((Date.now() - tracker.startTime.getTime()) / (1000 * 60))
      totalMinutes += elapsedMinutes
    }
    
    return totalMinutes
  }

  return (
    <div className="min-h-screen bg-background p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome, {contractor.name}</h1>
            <p className="text-muted-foreground">Contractor Portal</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{todaysJobs.length}</div>
              <p className="text-xs text-muted-foreground">Today's Jobs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{completedJobs.length}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{contractorJobs.length}</div>
              <p className="text-xs text-muted-foreground">Active Jobs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-2xl font-bold">{contractor.ratings.averageRating}</span>
              </div>
              <p className="text-xs text-muted-foreground">Rating</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Jobs ({contractorJobs.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedJobs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="space-y-4">
            {contractorJobs.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active jobs assigned</p>
                </CardContent>
              </Card>
            ) : (
              contractorJobs.map((job) => {
                const isToday = job.scheduledDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
                const tracker = timeTrackers[job.id]
                const displayTime = getDisplayTime(job.id)
                
                return (
                  <Card key={job.id} className={cn("", isToday && "border-primary")}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{job.description}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {job.unitAddress}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge variant={getPriorityBadgeVariant(job.priority)}>
                            {job.priority}
                          </Badge>
                          <Badge variant={getStatusBadgeVariant(job.status)}>
                            {job.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Job Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{job.scheduledDate.toLocaleDateString()} at {job.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Est. {job.estimatedDuration} hours</span>
                        </div>
                        {job.customerName && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{job.customerName}</span>
                          </div>
                        )}
                        {job.customerPhone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{job.customerPhone}</span>
                          </div>
                        )}
                      </div>

                      {/* Special Instructions */}
                      {job.specialInstructions && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                          <p className="text-sm font-medium text-yellow-800">Special Instructions:</p>
                          <p className="text-sm text-yellow-700 mt-1">{job.specialInstructions}</p>
                        </div>
                      )}

                      {/* Time Tracker */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Time: {formatTime(displayTime)}</span>
                          {tracker?.isRunning && (
                            <Badge variant="secondary" className="animate-pulse">Recording</Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {!tracker?.isRunning ? (
                            <Button size="sm" onClick={() => startTimeTracker(job.id)}>
                              <Play className="h-3 w-3 mr-1" />
                              Start
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => stopTimeTracker(job.id)}>
                              <Pause className="h-3 w-3 mr-1" />
                              Stop
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => resetTimeTracker(job.id)}>
                            <Square className="h-3 w-3 mr-1" />
                            Reset
                          </Button>
                        </div>
                      </div>

                      {/* Status Update Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {job.status === ContractorJobStatus.ASSIGNED && (
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusUpdate(job.id, ContractorJobStatus.EN_ROUTE)}
                          >
                            Mark En Route
                          </Button>
                        )}
                        {job.status === ContractorJobStatus.EN_ROUTE && (
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusUpdate(job.id, ContractorJobStatus.ON_SITE)}
                          >
                            Mark On Site
                          </Button>
                        )}
                        {(job.status === ContractorJobStatus.ON_SITE || job.status === ContractorJobStatus.EN_ROUTE) && (
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusUpdate(job.id, ContractorJobStatus.COMPLETED)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                      </div>

                      {/* Photo Upload */}
                      <div className="space-y-2">
                        <Label htmlFor={`photos-${job.id}`} className="text-sm font-medium">
                          Job Photos ({job.photos.length})
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id={`photos-${job.id}`}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handlePhotoUpload(job.id, e)}
                            className="hidden"
                          />
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => document.getElementById(`photos-${job.id}`)?.click()}
                          >
                            <Camera className="h-3 w-3 mr-1" />
                            Add Photos
                          </Button>
                          {job.photos.length > 0 && (
                            <span className="text-sm text-muted-foreground">
                              {job.photos.length} photo{job.photos.length !== 1 ? 's' : ''} uploaded
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add Notes */}
                      <div className="space-y-2">
                        <Label htmlFor={`notes-${job.id}`} className="text-sm font-medium">Add Notes</Label>
                        <div className="flex space-x-2">
                          <Textarea
                            id={`notes-${job.id}`}
                            placeholder="Add job notes, progress updates, or issues..."
                            value={selectedJob === job.id ? jobNotes : ''}
                            onChange={(e) => {
                              setSelectedJob(job.id)
                              setJobNotes(e.target.value)
                            }}
                            rows={2}
                            className="flex-1"
                          />
                          <Button 
                            size="sm" 
                            onClick={() => handleAddNotes(job.id)}
                            disabled={!jobNotes.trim() || selectedJob !== job.id}
                          >
                            Add
                          </Button>
                        </div>
                      </div>

                      {/* Existing Notes */}
                      {job.notes && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <p className="text-sm font-medium text-blue-800">Notes:</p>
                          <p className="text-sm text-blue-700 mt-1 whitespace-pre-wrap">{job.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="space-y-4">
            {completedJobs.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No completed jobs yet</p>
                </CardContent>
              </Card>
            ) : (
              completedJobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{job.description}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {job.unitAddress}
                        </CardDescription>
                      </div>
                      <Badge variant="default">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Completed: {job.completedAt?.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Camera className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{job.photos.length} photos</span>
                      </div>
                    </div>
                    {job.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm font-medium">Final Notes:</p>
                        <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{job.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}