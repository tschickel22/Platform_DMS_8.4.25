import { useState, useEffect, useCallback } from 'react'
import { Activity, ActivityType } from '@/types'
import { generateId } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

export function useActivityTracking() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Load activities from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('renter-insight-activities')
      if (stored) {
        const parsedActivities = JSON.parse(stored)
        setActivities(parsedActivities)
      }
    } catch (error) {
      console.error('Failed to load activities:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save activities to localStorage
  const saveActivities = useCallback((newActivities: Activity[]) => {
    try {
      localStorage.setItem('renter-insight-activities', JSON.stringify(newActivities))
      setActivities(newActivities)
    } catch (error) {
      console.error('Failed to save activities:', error)
    }
  }, [])

  // Log a new activity
  const logActivity = useCallback((
    type: ActivityType,
    title: string,
    options: {
      description?: string
      accountId?: string
      contactId?: string
      leadId?: string
      metadata?: Record<string, any>
      relatedEntityType?: string
      relatedEntityId?: string
    } = {}
  ) => {
    if (!user) return

    const newActivity: Activity = {
      id: generateId(),
      type,
      title,
      description: options.description,
      accountId: options.accountId,
      contactId: options.contactId,
      leadId: options.leadId,
      userId: user.id,
      userName: user.name,
      timestamp: new Date().toISOString(),
      metadata: options.metadata,
      relatedEntityType: options.relatedEntityType,
      relatedEntityId: options.relatedEntityId
    }

    const updatedActivities = [newActivity, ...activities].slice(0, 1000) // Keep last 1000 activities
    saveActivities(updatedActivities)
  }, [activities, saveActivities, user])

  // Get activities for a specific entity
  const getActivitiesForEntity = useCallback((entityType: string, entityId: string) => {
    return activities.filter(activity => {
      switch (entityType) {
        case 'account':
          return activity.accountId === entityId
        case 'contact':
          return activity.contactId === entityId
        case 'lead':
          return activity.leadId === entityId
        default:
          return activity.relatedEntityType === entityType && activity.relatedEntityId === entityId
      }
    })
  }, [activities])

  // Get recent activities (last 50)
  const getRecentActivities = useCallback((limit: number = 50) => {
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  }, [activities])

  // Get activities by type
  const getActivitiesByType = useCallback((type: ActivityType) => {
    return activities.filter(activity => activity.type === type)
  }, [activities])

  return {
    activities,
    loading,
    logActivity,
    getActivitiesForEntity,
    getRecentActivities,
    getActivitiesByType
  }
}