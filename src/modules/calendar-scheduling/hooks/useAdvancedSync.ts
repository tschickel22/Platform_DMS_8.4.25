import { useState, useEffect, useCallback } from 'react'
import { CalendarEvent } from '../types'
import { useToast } from '@/hooks/use-toast'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

interface SyncStatus {
  isActive: boolean
  lastSync: Date
  nextSync: Date
  conflicts: EventConflict[]
  syncHistory: SyncHistoryEntry[]
}

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

interface SyncHistoryEntry {
  id: string
  timestamp: Date
  action: 'export' | 'import' | 'conflict_resolved' | 'sync_started' | 'sync_completed'
  eventId?: string
  details: string
  success: boolean
  error?: string
}

interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number
  daysOfWeek?: number[]
  dayOfMonth?: number
  weekOfMonth?: number
  endType: 'never' | 'after' | 'on'
  endAfter?: number
  endOn?: Date
  exceptions?: Date[]
}

export function useAdvancedSync() {
  const { toast } = useToast()
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isActive: false,
    lastSync: new Date(),
    nextSync: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    conflicts: [],
    syncHistory: []
  })
  const [loading, setLoading] = useState(false)

  // Load sync status from localStorage
  useEffect(() => {
    const savedStatus = loadFromLocalStorage('calendar_sync_status', null)
    if (savedStatus) {
      setSyncStatus({
        ...savedStatus,
        lastSync: new Date(savedStatus.lastSync),
        nextSync: new Date(savedStatus.nextSync),
        conflicts: savedStatus.conflicts.map((c: any) => ({
          ...c,
          detectedAt: new Date(c.detectedAt),
          boltEvent: {
            ...c.boltEvent,
            start: new Date(c.boltEvent.start),
            end: new Date(c.boltEvent.end)
          },
          externalEvent: {
            ...c.externalEvent,
            start: new Date(c.externalEvent.start),
            end: new Date(c.externalEvent.end)
          }
        })),
        syncHistory: savedStatus.syncHistory.map((h: any) => ({
          ...h,
          timestamp: new Date(h.timestamp)
        }))
      })
    }
  }, [])

  // Save sync status to localStorage
  useEffect(() => {
    saveToLocalStorage('calendar_sync_status', syncStatus)
  }, [syncStatus])

  const startTwoWaySync = useCallback(async () => {
    setLoading(true)
    setSyncStatus(prev => ({ ...prev, isActive: true }))
    
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Add sync history entry
      const historyEntry: SyncHistoryEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        action: 'sync_started',
        details: 'Two-way synchronization started',
        success: true
      }
      
      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        nextSync: new Date(Date.now() + 15 * 60 * 1000),
        syncHistory: [historyEntry, ...prev.syncHistory.slice(0, 49)] // Keep last 50 entries
      }))
      
      toast({
        title: 'Sync Started',
        description: 'Two-way synchronization is now active',
      })
    } catch (error) {
      setSyncStatus(prev => ({ ...prev, isActive: false }))
      toast({
        title: 'Sync Failed',
        description: 'Failed to start synchronization',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const stopTwoWaySync = useCallback(async () => {
    setSyncStatus(prev => ({ ...prev, isActive: false }))
    
    const historyEntry: SyncHistoryEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      action: 'sync_completed',
      details: 'Two-way synchronization stopped',
      success: true
    }
    
    setSyncStatus(prev => ({
      ...prev,
      syncHistory: [historyEntry, ...prev.syncHistory.slice(0, 49)]
    }))
    
    toast({
      title: 'Sync Stopped',
      description: 'Two-way synchronization has been disabled',
    })
  }, [toast])

  const createRecurringEvent = useCallback(async (
    eventData: Partial<CalendarEvent>, 
    recurrence: RecurrencePattern
  ) => {
    setLoading(true)
    try {
      const events: CalendarEvent[] = []
      const baseEvent = {
        ...eventData,
        id: Math.random().toString(36).substr(2, 9),
        sourceModule: eventData.sourceModule || 'task',
        sourceId: Math.random().toString(36).substr(2, 9),
        status: eventData.status || 'scheduled',
        metadata: {
          ...eventData.metadata,
          isRecurring: true,
          recurrencePattern: recurrence,
          parentEventId: null
        }
      } as CalendarEvent

      // Generate recurring instances
      const instances = generateRecurringInstances(baseEvent, recurrence)
      events.push(baseEvent, ...instances)

      // Simulate saving to calendar
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Add to sync history
      const historyEntry: SyncHistoryEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        action: 'export',
        eventId: baseEvent.id,
        details: `Created recurring ${recurrence.type} event with ${instances.length} instances`,
        success: true
      }
      
      setSyncStatus(prev => ({
        ...prev,
        syncHistory: [historyEntry, ...prev.syncHistory.slice(0, 49)]
      }))

      return events
    } finally {
      setLoading(false)
    }
  }, [])

  const generateRecurringInstances = (baseEvent: CalendarEvent, recurrence: RecurrencePattern): CalendarEvent[] => {
    const instances: CalendarEvent[] = []
    const startDate = new Date(baseEvent.start)
    const endDate = new Date(baseEvent.end)
    const duration = endDate.getTime() - startDate.getTime()
    
    let currentDate = new Date(startDate)
    let instanceCount = 0
    const maxInstances = recurrence.endType === 'after' ? recurrence.endAfter || 10 : 100
    const endOnDate = recurrence.endType === 'on' ? recurrence.endOn : null

    while (instanceCount < maxInstances) {
      // Calculate next occurrence
      switch (recurrence.type) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + recurrence.interval)
          break
        case 'weekly':
          if (recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
            // Find next occurrence on specified days
            let found = false
            for (let i = 1; i <= 7 * recurrence.interval; i++) {
              const testDate = new Date(currentDate)
              testDate.setDate(testDate.getDate() + i)
              if (recurrence.daysOfWeek.includes(testDate.getDay())) {
                currentDate = testDate
                found = true
                break
              }
            }
            if (!found) break
          } else {
            currentDate.setDate(currentDate.getDate() + 7 * recurrence.interval)
          }
          break
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + recurrence.interval)
          break
        case 'yearly':
          currentDate.setFullYear(currentDate.getFullYear() + recurrence.interval)
          break
      }

      // Check end conditions
      if (endOnDate && currentDate > endOnDate) break
      if (recurrence.endType === 'never' && instanceCount >= 52) break // Limit to 1 year for 'never'

      // Skip if in exceptions
      if (recurrence.exceptions?.some(exception => 
        exception.toDateString() === currentDate.toDateString()
      )) {
        continue
      }

      // Create instance
      const instanceEndDate = new Date(currentDate.getTime() + duration)
      const instance: CalendarEvent = {
        ...baseEvent,
        id: `${baseEvent.id}-${instanceCount + 1}`,
        start: new Date(currentDate),
        end: instanceEndDate,
        metadata: {
          ...baseEvent.metadata,
          parentEventId: baseEvent.id,
          instanceNumber: instanceCount + 1
        }
      }

      instances.push(instance)
      instanceCount++
    }

    return instances
  }

  const resolveConflict = useCallback(async (
    conflictId: string, 
    resolution: 'keep_bolt' | 'keep_external' | 'merge' | 'ignore'
  ) => {
    const conflict = syncStatus.conflicts.find(c => c.id === conflictId)
    if (!conflict) return

    setLoading(true)
    try {
      // Simulate conflict resolution
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update conflict status
      const updatedConflicts = syncStatus.conflicts.map(c =>
        c.id === conflictId ? { ...c, status: 'resolved' as const } : c
      )

      // Add to sync history
      const historyEntry: SyncHistoryEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        action: 'conflict_resolved',
        eventId: conflict.eventId,
        details: `Conflict resolved using ${resolution.replace('_', ' ')} strategy`,
        success: true
      }

      setSyncStatus(prev => ({
        ...prev,
        conflicts: updatedConflicts,
        syncHistory: [historyEntry, ...prev.syncHistory.slice(0, 49)]
      }))

      return true
    } catch (error) {
      const historyEntry: SyncHistoryEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        action: 'conflict_resolved',
        eventId: conflict.eventId,
        details: `Failed to resolve conflict: ${error}`,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }

      setSyncStatus(prev => ({
        ...prev,
        syncHistory: [historyEntry, ...prev.syncHistory.slice(0, 49)]
      }))

      throw error
    } finally {
      setLoading(false)
    }
  }, [syncStatus.conflicts])

  const importExternalEvents = useCallback(async (calendarType: 'google' | 'outlook') => {
    setLoading(true)
    try {
      // Simulate importing events from external calendar
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock imported events
      const importedEvents: CalendarEvent[] = [
        {
          id: `imported-${Date.now()}-1`,
          title: 'External Meeting',
          start: new Date(Date.now() + 24 * 60 * 60 * 1000),
          end: new Date(Date.now() + 25 * 60 * 60 * 1000),
          sourceModule: 'task',
          sourceId: 'external-import',
          status: 'scheduled',
          description: `Imported from ${calendarType} calendar`,
          metadata: {
            importedFrom: calendarType,
            importedAt: new Date(),
            externalEventId: `ext-${Date.now()}`
          }
        }
      ]

      // Add to sync history
      const historyEntry: SyncHistoryEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        action: 'import',
        details: `Imported ${importedEvents.length} events from ${calendarType}`,
        success: true
      }

      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        syncHistory: [historyEntry, ...prev.syncHistory.slice(0, 49)]
      }))

      toast({
        title: 'Import Successful',
        description: `Imported ${importedEvents.length} events from ${calendarType}`,
      })

      return importedEvents
    } catch (error) {
      const historyEntry: SyncHistoryEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        action: 'import',
        details: `Failed to import from ${calendarType}`,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }

      setSyncStatus(prev => ({
        ...prev,
        syncHistory: [historyEntry, ...prev.syncHistory.slice(0, 49)]
      }))

      throw error
    } finally {
      setLoading(false)
    }
  }, [toast])

  const exportToExternalCalendar = useCallback(async (
    event: CalendarEvent, 
    calendarType: 'google' | 'outlook'
  ) => {
    setLoading(true)
    try {
      // Simulate export to external calendar
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Add to sync history
      const historyEntry: SyncHistoryEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        action: 'export',
        eventId: event.id,
        details: `Exported "${event.title}" to ${calendarType}`,
        success: true
      }

      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        syncHistory: [historyEntry, ...prev.syncHistory.slice(0, 49)]
      }))

      return true
    } catch (error) {
      const historyEntry: SyncHistoryEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        action: 'export',
        eventId: event.id,
        details: `Failed to export "${event.title}" to ${calendarType}`,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }

      setSyncStatus(prev => ({
        ...prev,
        syncHistory: [historyEntry, ...prev.syncHistory.slice(0, 49)]
      }))

      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const detectConflicts = useCallback(async (boltEvents: CalendarEvent[], externalEvents: CalendarEvent[]) => {
    const conflicts: EventConflict[] = []

    for (const boltEvent of boltEvents) {
      const matchingExternal = externalEvents.find(ext => 
        ext.metadata?.externalEventId === boltEvent.metadata?.externalEventId ||
        (ext.title === boltEvent.title && 
         Math.abs(ext.start.getTime() - boltEvent.start.getTime()) < 60000) // Within 1 minute
      )

      if (matchingExternal) {
        const conflictFields: string[] = []
        
        // Check for differences
        if (boltEvent.title !== matchingExternal.title) conflictFields.push('title')
        if (Math.abs(boltEvent.start.getTime() - matchingExternal.start.getTime()) > 60000) conflictFields.push('start')
        if (Math.abs(boltEvent.end.getTime() - matchingExternal.end.getTime()) > 60000) conflictFields.push('end')
        if (boltEvent.description !== matchingExternal.description) conflictFields.push('description')
        if (boltEvent.location !== matchingExternal.location) conflictFields.push('location')

        if (conflictFields.length > 0) {
          conflicts.push({
            id: Math.random().toString(36).substr(2, 9),
            eventId: boltEvent.id,
            conflictType: 'data_mismatch',
            boltEvent,
            externalEvent: matchingExternal,
            conflictFields,
            detectedAt: new Date(),
            status: 'pending'
          })
        }
      }
    }

    setSyncStatus(prev => ({
      ...prev,
      conflicts: [...prev.conflicts, ...conflicts]
    }))

    return conflicts
  }, [])

  const createResourceBooking = useCallback(async (bookingData: any) => {
    setLoading(true)
    try {
      // Simulate creating resource booking
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Create calendar event for the booking
      const event: CalendarEvent = {
        id: Math.random().toString(36).substr(2, 9),
        title: bookingData.title,
        description: bookingData.description,
        start: bookingData.startTime,
        end: bookingData.endTime,
        sourceModule: 'task',
        sourceId: 'resource-booking',
        status: 'scheduled',
        location: bookingData.location,
        metadata: {
          isResourceBooking: true,
          resourceIds: bookingData.resourceIds,
          attendees: bookingData.attendees,
          bookingNotes: bookingData.notes
        }
      }

      // Add to sync history
      const historyEntry: SyncHistoryEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        action: 'export',
        eventId: event.id,
        details: `Created resource booking for ${bookingData.resourceIds.length} resource(s)`,
        success: true
      }

      setSyncStatus(prev => ({
        ...prev,
        syncHistory: [historyEntry, ...prev.syncHistory.slice(0, 49)]
      }))

      return event
    } finally {
      setLoading(false)
    }
  }, [])

  const getSyncStatistics = useCallback(() => {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const recentHistory = syncStatus.syncHistory.filter(h => h.timestamp > last24Hours)
    
    return {
      totalSyncs: syncStatus.syncHistory.length,
      syncsLast24Hours: recentHistory.length,
      successfulSyncs: syncStatus.syncHistory.filter(h => h.success).length,
      failedSyncs: syncStatus.syncHistory.filter(h => !h.success).length,
      pendingConflicts: syncStatus.conflicts.filter(c => c.status === 'pending').length,
      resolvedConflicts: syncStatus.conflicts.filter(c => c.status === 'resolved').length,
      lastSyncTime: syncStatus.lastSync,
      nextSyncTime: syncStatus.nextSync,
      isActive: syncStatus.isActive
    }
  }, [syncStatus])

  return {
    syncStatus,
    loading,
    startTwoWaySync,
    stopTwoWaySync,
    createRecurringEvent,
    detectConflicts,
    resolveConflict,
    importExternalEvents,
    exportToExternalCalendar,
    createResourceBooking,
    getSyncStatistics
  }
}