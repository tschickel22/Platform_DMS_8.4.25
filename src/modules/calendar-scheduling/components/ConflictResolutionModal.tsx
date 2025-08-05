import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AlertTriangle, Calendar, Clock, User, X, Check } from 'lucide-react'
import { CalendarEvent } from '../types'
import { formatDateTime } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface EventConflict {
  id: string
  eventId: string
  conflictType: 'time_overlap' | 'data_mismatch' | 'deletion_conflict'
  boltEvent: CalendarEvent
  externalEvent: CalendarEvent
  conflictFields: string[]
  detectedAt: Date
  status: 'pending' | 'resolved' | 'ignored'
}

interface ConflictResolutionModalProps {
  conflicts: EventConflict[]
  onResolve: (conflictId: string, resolution: 'keep_bolt' | 'keep_external' | 'merge' | 'ignore') => Promise<void>
  onClose: () => void
}

export function ConflictResolutionModal({ conflicts, onResolve, onClose }: ConflictResolutionModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)
  const [selectedConflict, setSelectedConflict] = useState<EventConflict | null>(
    conflicts.length > 0 ? conflicts[0] : null
  )

  const handleResolve = async (conflictId: string, resolution: 'keep_bolt' | 'keep_external' | 'merge' | 'ignore') => {
    setLoading(conflictId)
    try {
      await onResolve(conflictId, resolution)
      
      toast({
        title: 'Conflict Resolved',
        description: `Applied ${resolution.replace('_', ' ')} resolution`,
      })
      
      // Move to next conflict or close if none left
      const remainingConflicts = conflicts.filter(c => c.id !== conflictId && c.status === 'pending')
      if (remainingConflicts.length > 0) {
        setSelectedConflict(remainingConflicts[0])
      } else {
        onClose()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resolve conflict',
        variant: 'destructive'
      })
    } finally {
      setLoading(null)
    }
  }

  const getConflictTypeDescription = (type: string) => {
    switch (type) {
      case 'time_overlap':
        return 'Time and date differences detected'
      case 'data_mismatch':
        return 'Event details have been modified in both places'
      case 'deletion_conflict':
        return 'Event was deleted in one calendar but modified in another'
      default:
        return 'Unknown conflict type'
    }
  }

  const getConflictTypeColor = (type: string) => {
    switch (type) {
      case 'time_overlap':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'data_mismatch':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'deletion_conflict':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const renderEventComparison = (boltEvent: CalendarEvent, externalEvent: CalendarEvent, conflictFields: string[]) => {
    const fields = [
      { key: 'title', label: 'Title' },
      { key: 'start', label: 'Start Time', format: (date: Date) => formatDateTime(date) },
      { key: 'end', label: 'End Time', format: (date: Date) => formatDateTime(date) },
      { key: 'description', label: 'Description' },
      { key: 'location', label: 'Location' },
      { key: 'assignedTo', label: 'Assigned To' }
    ]

    return (
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Bolt Version
          </h4>
          <div className="space-y-2">
            {fields.map(field => {
              const value = (boltEvent as any)[field.key]
              const isConflicted = conflictFields.includes(field.key)
              
              return (
                <div key={field.key} className={`p-2 rounded ${isConflicted ? 'bg-red-50 border border-red-200' : 'bg-muted/30'}`}>
                  <div className="text-xs font-medium text-muted-foreground">{field.label}</div>
                  <div className="text-sm">
                    {field.format && value instanceof Date ? field.format(value) : value || 'Not set'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-green-900 mb-3 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            External Version
          </h4>
          <div className="space-y-2">
            {fields.map(field => {
              const value = (externalEvent as any)[field.key]
              const isConflicted = conflictFields.includes(field.key)
              
              return (
                <div key={field.key} className={`p-2 rounded ${isConflicted ? 'bg-red-50 border border-red-200' : 'bg-muted/30'}`}>
                  <div className="text-xs font-medium text-muted-foreground">{field.label}</div>
                  <div className="text-sm">
                    {field.format && value instanceof Date ? field.format(value) : value || 'Not set'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (!selectedConflict) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Conflicts</CardTitle>
            <CardDescription>All conflicts have been resolved</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const pendingConflicts = conflicts.filter(c => c.status === 'pending')

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                Resolve Calendar Conflicts
              </CardTitle>
              <CardDescription>
                {pendingConflicts.length} conflict(s) need resolution
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Conflict Navigation */}
          {pendingConflicts.length > 1 && (
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium">
                Conflict {pendingConflicts.findIndex(c => c.id === selectedConflict.id) + 1} of {pendingConflicts.length}
              </span>
              <div className="flex space-x-2">
                {pendingConflicts.map((conflict, index) => (
                  <Button
                    key={conflict.id}
                    variant={conflict.id === selectedConflict.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedConflict(conflict)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Conflict Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge className={getConflictTypeColor(selectedConflict.conflictType)}>
                {selectedConflict.conflictType.replace('_', ' ').toUpperCase()}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Detected: {formatDateTime(selectedConflict.detectedAt)}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {getConflictTypeDescription(selectedConflict.conflictType)}
            </p>

            {/* Event Comparison */}
            {renderEventComparison(
              selectedConflict.boltEvent, 
              selectedConflict.externalEvent, 
              selectedConflict.conflictFields
            )}
          </div>

          {/* Resolution Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resolution Options</h3>
            
            <div className="grid gap-3 md:grid-cols-2">
              <Button
                variant="outline"
                className="h-auto p-4 text-left"
                onClick={() => handleResolve(selectedConflict.id, 'keep_bolt')}
                disabled={loading === selectedConflict.id}
              >
                <div>
                  <div className="font-medium text-blue-700">Keep Bolt Version</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Use the version from Bolt and overwrite external calendar
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 text-left"
                onClick={() => handleResolve(selectedConflict.id, 'keep_external')}
                disabled={loading === selectedConflict.id}
              >
                <div>
                  <div className="font-medium text-green-700">Keep External Version</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Use the version from external calendar and update Bolt
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 text-left"
                onClick={() => handleResolve(selectedConflict.id, 'merge')}
                disabled={loading === selectedConflict.id}
              >
                <div>
                  <div className="font-medium text-purple-700">Merge Changes</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Combine non-conflicting changes from both versions
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 text-left"
                onClick={() => handleResolve(selectedConflict.id, 'ignore')}
                disabled={loading === selectedConflict.id}
              >
                <div>
                  <div className="font-medium text-gray-700">Ignore Conflict</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Skip this conflict and keep both versions separate
                  </div>
                </div>
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {pendingConflicts.length > 1 && (
            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-medium">Bulk Actions</h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    pendingConflicts.forEach(conflict => {
                      handleResolve(conflict.id, 'keep_bolt')
                    })
                  }}
                  disabled={!!loading}
                >
                  Keep All Bolt Versions
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    pendingConflicts.forEach(conflict => {
                      handleResolve(conflict.id, 'keep_external')
                    })
                  }}
                  disabled={!!loading}
                >
                  Keep All External Versions
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    pendingConflicts.forEach(conflict => {
                      handleResolve(conflict.id, 'ignore')
                    })
                  }}
                  disabled={!!loading}
                >
                  Ignore All Conflicts
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}