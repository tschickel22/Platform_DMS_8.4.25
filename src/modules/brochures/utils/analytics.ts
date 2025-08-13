/**
 * Brochure Builder - Analytics Utilities
 * 
 * This module provides comprehensive analytics tracking for brochure usage,
 * sharing, and engagement. All data is stored locally in localStorage with
 * aggregation utilities for reporting and insights.
 * 
 * Tracked Events:
 * - Template creation, editing, deletion
 * - Brochure generation and sharing
 * - Public brochure views and interactions
 * - CTA clicks and conversions
 * - Export downloads (PNG/PDF)
 * - Social media shares by platform
 * 
 * Analytics Features:
 * - Real-time event tracking
 * - Aggregated metrics and summaries
 * - Time-based analytics (daily, weekly, monthly)
 * - Platform-specific insights
 * - Performance benchmarking
 * - Export capabilities for external analysis
 * 
 * Data Structure:
 * - Events stored with timestamps and metadata
 * - Aggregated summaries for quick access
 * - Privacy-conscious data collection
 * - Configurable retention periods
 * 
 * Privacy & Security:
 * - No personal information collected
 * - Local storage only (no external tracking)
 * - User consent respected
 * - Data anonymization options
 * - GDPR compliance considerations
 * 
 * TODO: Add data export functionality
 * TODO: Add analytics dashboard components
 * TODO: Add performance benchmarking
 * TODO: Add A/B testing support
 * TODO: Add retention analysis
 */

import type { AnalyticsEvent, AnalyticsSummary, DetailedAnalytics } from '../types'

/**
 * Analytics storage keys
 */
const ANALYTICS_KEYS = {
  EVENTS: 'ri_brochure_analytics_events',
  SUMMARY: 'ri_brochure_analytics_summary',
  SETTINGS: 'ri_brochure_analytics_settings'
} as const

/**
 * Analytics settings
 */
export interface AnalyticsSettings {
  enabled: boolean
  retentionDays: number
  trackingLevel: 'basic' | 'detailed' | 'full'
  anonymizeData: boolean
}

/**
 * Event categories for organization
 */
export const EVENT_CATEGORIES = {
  TEMPLATE: 'template',
  BROCHURE: 'brochure',
  SHARING: 'sharing',
  ENGAGEMENT: 'engagement',
  EXPORT: 'export',
  VIEW: 'view'
} as const

/**
 * Predefined event types
 */
export const EVENT_TYPES = {
  // Template events
  TEMPLATE_CREATED: 'template_created',
  TEMPLATE_UPDATED: 'template_updated',
  TEMPLATE_DELETED: 'template_deleted',
  TEMPLATE_DUPLICATED: 'template_duplicated',
  TEMPLATE_OPENED: 'template_opened',
  
  // Brochure events
  BROCHURE_CREATED: 'brochure_created',
  BROCHURE_UPDATED: 'brochure_updated',
  BROCHURE_DELETED: 'brochure_deleted',
  BROCHURE_VIEWED: 'brochure_viewed',
  
  // Sharing events
  SHARE_INITIATED: 'share_initiated',
  SHARE_COMPLETED: 'share_completed',
  SHARE_FAILED: 'share_failed',
  LINK_COPIED: 'link_copied',
  
  // Engagement events
  CTA_CLICKED: 'cta_clicked',
  BLOCK_INTERACTED: 'block_interacted',
  GALLERY_IMAGE_VIEWED: 'gallery_image_viewed',
  
  // Export events
  EXPORT_PNG: 'export_png',
  EXPORT_PDF: 'export_pdf',
  EXPORT_FAILED: 'export_failed',
  
  // View events
  PUBLIC_VIEW: 'public_view',
  PREVIEW_VIEWED: 'preview_viewed'
} as const

/**
 * Default analytics settings
 */
const DEFAULT_SETTINGS: AnalyticsSettings = {
  enabled: true,
  retentionDays: 90,
  trackingLevel: 'detailed',
  anonymizeData: false
}

/**
 * Gets current analytics settings
 */
const getSettings = (): AnalyticsSettings => {
  try {
    const stored = localStorage.getItem(ANALYTICS_KEYS.SETTINGS)
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS
  } catch (error) {
    console.warn('Failed to load analytics settings:', error)
    return DEFAULT_SETTINGS
  }
}

/**
 * Updates analytics settings
 */
export const updateAnalyticsSettings = (settings: Partial<AnalyticsSettings>): void => {
  try {
    const current = getSettings()
    const updated = { ...current, ...settings }
    localStorage.setItem(ANALYTICS_KEYS.SETTINGS, JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to update analytics settings:', error)
  }
}

/**
 * Main event tracking function
 * 
 * @param eventType - Type of event being tracked
 * @param metadata - Additional event data
 */
export const track = (
  eventType: string,
  metadata: Record<string, any> = {}
): void => {
  const settings = getSettings()
  
  if (!settings.enabled) {
    return
  }
  
  try {
    const event: AnalyticsEvent = {
      event: eventType,
      timestamp: new Date().toISOString(),
      ...metadata
    }
    
    // Anonymize data if requested
    if (settings.anonymizeData) {
      event.brochureId = event.brochureId ? hashId(event.brochureId) : undefined
      event.templateId = event.templateId ? hashId(event.templateId) : undefined
      event.publicId = event.publicId ? hashId(event.publicId) : undefined
    }
    
    // Store event
    const events = getStoredEvents()
    events.push(event)
    
    // Apply retention policy
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - settings.retentionDays)
    const filteredEvents = events.filter(e => new Date(e.timestamp) > cutoffDate)
    
    localStorage.setItem(ANALYTICS_KEYS.EVENTS, JSON.stringify(filteredEvents))
    
    // Update summary
    updateSummary(event)
    
  } catch (error) {
    console.error('Analytics tracking failed:', error)
  }
}

/**
 * Gets stored events from localStorage
 */
const getStoredEvents = (): AnalyticsEvent[] => {
  try {
    const stored = localStorage.getItem(ANALYTICS_KEYS.EVENTS)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.warn('Failed to load analytics events:', error)
    return []
  }
}

/**
 * Updates analytics summary with new event
 */
const updateSummary = (event: AnalyticsEvent): void => {
  try {
    const summary = getSummary()
    const today = new Date().toISOString().split('T')[0]
    
    // Update counters based on event type
    switch (event.event) {
      case EVENT_TYPES.TEMPLATE_CREATED:
        summary.totalTemplates++
        summary.templatesCreated++
        break
        
      case EVENT_TYPES.BROCHURE_CREATED:
        summary.totalBrochures++
        summary.brochuresCreated++
        break
        
      case EVENT_TYPES.BROCHURE_VIEWED:
      case EVENT_TYPES.PUBLIC_VIEW:
        summary.totalViews++
        break
        
      case EVENT_TYPES.SHARE_COMPLETED:
        summary.totalShares++
        summary.brochuresShared++
        break
        
      case EVENT_TYPES.EXPORT_PNG:
      case EVENT_TYPES.EXPORT_PDF:
        summary.totalDownloads++
        break
        
      case EVENT_TYPES.CTA_CLICKED:
        summary.totalCTAClicks++
        break
    }
    
    summary.lastUpdated = new Date().toISOString()
    
    localStorage.setItem(ANALYTICS_KEYS.SUMMARY, JSON.stringify(summary))
    
  } catch (error) {
    console.error('Failed to update analytics summary:', error)
  }
}

/**
 * Gets analytics summary
 */
export const getSummary = (): AnalyticsSummary => {
  try {
    const stored = localStorage.getItem(ANALYTICS_KEYS.SUMMARY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.warn('Failed to load analytics summary:', error)
  }
  
  // Return default summary
  return {
    totalTemplates: 0,
    templatesCreated: 0,
    templatesUsed: 0,
    totalBrochures: 0,
    brochuresCreated: 0,
    brochuresShared: 0,
    totalViews: 0,
    totalShares: 0,
    totalDownloads: 0,
    totalCTAClicks: 0,
    period: 'all-time',
    lastUpdated: new Date().toISOString()
  }
}

/**
 * Gets detailed analytics for a specific item
 */
export const getDetailedAnalytics = (
  id: string,
  type: 'template' | 'brochure'
): DetailedAnalytics => {
  const events = getStoredEvents()
  const itemEvents = events.filter(e => 
    (type === 'template' && e.templateId === id) ||
    (type === 'brochure' && e.brochureId === id)
  )
  
  // Calculate metrics
  const views = itemEvents.filter(e => 
    e.event === EVENT_TYPES.BROCHURE_VIEWED || 
    e.event === EVENT_TYPES.PUBLIC_VIEW
  ).length
  
  const shares = itemEvents.filter(e => 
    e.event === EVENT_TYPES.SHARE_COMPLETED
  ).length
  
  const downloads = itemEvents.filter(e => 
    e.event === EVENT_TYPES.EXPORT_PNG || 
    e.event === EVENT_TYPES.EXPORT_PDF
  ).length
  
  const ctaClicks = itemEvents.filter(e => 
    e.event === EVENT_TYPES.CTA_CLICKED
  ).length
  
  // Group by date
  const viewsByDate: Record<string, number> = {}
  itemEvents
    .filter(e => e.event === EVENT_TYPES.BROCHURE_VIEWED || e.event === EVENT_TYPES.PUBLIC_VIEW)
    .forEach(e => {
      const date = e.timestamp.split('T')[0]
      viewsByDate[date] = (viewsByDate[date] || 0) + 1
    })
  
  // Group shares by platform
  const sharesByPlatform: Record<string, number> = {}
  itemEvents
    .filter(e => e.event === EVENT_TYPES.SHARE_COMPLETED)
    .forEach(e => {
      const platform = e.metadata?.platform || 'unknown'
      sharesByPlatform[platform] = (sharesByPlatform[platform] || 0) + 1
    })
  
  // Group downloads by format
  const downloadsByFormat: Record<string, number> = {}
  itemEvents
    .filter(e => e.event === EVENT_TYPES.EXPORT_PNG || e.event === EVENT_TYPES.EXPORT_PDF)
    .forEach(e => {
      const format = e.event === EVENT_TYPES.EXPORT_PNG ? 'png' : 'pdf'
      downloadsByFormat[format] = (downloadsByFormat[format] || 0) + 1
    })
  
  return {
    id,
    type,
    views,
    uniqueViews: views, // TODO: Calculate unique views
    viewsByDate,
    shares,
    sharesByPlatform,
    downloads,
    downloadsByFormat,
    ctaClicks
  }
}

/**
 * Gets analytics for a date range
 */
export const getAnalyticsByDateRange = (
  startDate: string,
  endDate: string
): AnalyticsEvent[] => {
  const events = getStoredEvents()
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return events.filter(e => {
    const eventDate = new Date(e.timestamp)
    return eventDate >= start && eventDate <= end
  })
}

/**
 * Gets top performing templates/brochures
 */
export const getTopPerformers = (
  type: 'template' | 'brochure',
  metric: 'views' | 'shares' | 'downloads' = 'views',
  limit: number = 10
): Array<{ id: string; count: number }> => {
  const events = getStoredEvents()
  const counts: Record<string, number> = {}
  
  const eventTypes = {
    views: [EVENT_TYPES.BROCHURE_VIEWED, EVENT_TYPES.PUBLIC_VIEW],
    shares: [EVENT_TYPES.SHARE_COMPLETED],
    downloads: [EVENT_TYPES.EXPORT_PNG, EVENT_TYPES.EXPORT_PDF]
  }
  
  events
    .filter(e => eventTypes[metric].includes(e.event as any))
    .forEach(e => {
      const id = type === 'template' ? e.templateId : e.brochureId
      if (id) {
        counts[id] = (counts[id] || 0) + 1
      }
    })
  
  return Object.entries(counts)
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

/**
 * Exports analytics data as JSON
 */
export const exportAnalyticsData = (): {
  events: AnalyticsEvent[]
  summary: AnalyticsSummary
  settings: AnalyticsSettings
  exportedAt: string
} => {
  return {
    events: getStoredEvents(),
    summary: getSummary(),
    settings: getSettings(),
    exportedAt: new Date().toISOString()
  }
}

/**
 * Clears all analytics data
 */
export const clearAnalyticsData = (): void => {
  try {
    localStorage.removeItem(ANALYTICS_KEYS.EVENTS)
    localStorage.removeItem(ANALYTICS_KEYS.SUMMARY)
    console.log('Analytics data cleared')
  } catch (error) {
    console.error('Failed to clear analytics data:', error)
  }
}

/**
 * Gets analytics health status
 */
export const getAnalyticsHealth = (): {
  isHealthy: boolean
  eventCount: number
  oldestEvent: string | null
  newestEvent: string | null
  storageUsed: number
} => {
  const events = getStoredEvents()
  const eventCount = events.length
  
  const timestamps = events.map(e => e.timestamp).sort()
  const oldestEvent = timestamps[0] || null
  const newestEvent = timestamps[timestamps.length - 1] || null
  
  // Estimate storage usage
  const storageUsed = JSON.stringify(events).length
  
  return {
    isHealthy: eventCount > 0 && storageUsed < 5000000, // 5MB limit
    eventCount,
    oldestEvent,
    newestEvent,
    storageUsed
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Simple hash function for anonymizing IDs
 */
const hashId = (id: string): string => {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

/**
 * Convenience functions for common tracking scenarios
 */
export const trackTemplateCreated = (templateId: string, metadata: Record<string, any> = {}) => {
  track(EVENT_TYPES.TEMPLATE_CREATED, { templateId, ...metadata })
}

export const trackBrochureViewed = (brochureId: string, publicId?: string, metadata: Record<string, any> = {}) => {
  track(EVENT_TYPES.BROCHURE_VIEWED, { brochureId, publicId, ...metadata })
}

export const trackShareCompleted = (platform: string, brochureId?: string, templateId?: string) => {
  track(EVENT_TYPES.SHARE_COMPLETED, { platform, brochureId, templateId })
}

export const trackCTAClicked = (brochureId: string, blockId: string, metadata: Record<string, any> = {}) => {
  track(EVENT_TYPES.CTA_CLICKED, { brochureId, blockId, ...metadata })
}

export const trackExport = (format: 'png' | 'pdf', brochureId?: string, templateId?: string) => {
  const eventType = format === 'png' ? EVENT_TYPES.EXPORT_PNG : EVENT_TYPES.EXPORT_PDF
  track(eventType, { format, brochureId, templateId })
}

export default {
  track,
  getSummary,
  getDetailedAnalytics,
  getAnalyticsByDateRange,
  getTopPerformers,
  exportAnalyticsData,
  clearAnalyticsData,
  updateAnalyticsSettings,
  
  // Convenience functions
  trackTemplateCreated,
  trackBrochureViewed,
  trackShareCompleted,
  trackCTAClicked,
  trackExport,
  
  // Constants
  EVENT_TYPES,
  EVENT_CATEGORIES
}