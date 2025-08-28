import React from 'react'
import { cn } from '@/lib/utils'

interface SafeRenderProps {
  data: any
  fallback?: React.ReactNode
  className?: string
  children: (data: any) => React.ReactNode
}

/**
 * SafeRender component that handles null/undefined data gracefully
 * Prevents crashes when data is missing or malformed
 */
export function SafeRender({ data, fallback = '—', className, children }: SafeRenderProps) {
  if (data === null || data === undefined) {
    return <span className={cn('text-muted-foreground', className)}>{fallback}</span>
  }
  
  try {
    return <>{children(data)}</>
  } catch (error) {
    console.warn('SafeRender: Error rendering data', error)
    return <span className={cn('text-muted-foreground', className)}>{fallback}</span>
  }
}

interface SafeListProps<T> {
  data: T[] | null | undefined
  fallback?: React.ReactNode
  className?: string
  children: (items: T[]) => React.ReactNode
}

/**
 * SafeList component that ensures arrays are never null/undefined
 * Always provides an empty array as fallback
 */
export function SafeList<T>({ data, fallback, className, children }: SafeListProps<T>) {
  const safeData = Array.isArray(data) ? data : []
  
  if (safeData.length === 0 && fallback) {
    return <div className={className}>{fallback}</div>
  }
  
  try {
    return <>{children(safeData)}</>
  } catch (error) {
    console.warn('SafeList: Error rendering list', error)
    return <div className={cn('text-muted-foreground', className)}>Error loading list</div>
  }
}

interface SafeLookupProps {
  id: string | null | undefined
  lookup: (id: string) => any
  fallback?: React.ReactNode
  className?: string
  children: (item: any) => React.ReactNode
}

/**
 * SafeLookup component that handles entity lookups gracefully
 * Shows fallback when ID is missing or lookup returns null
 */
export function SafeLookup({ id, lookup, fallback = 'N/A', className, children }: SafeLookupProps) {
  if (!id) {
    return <span className={cn('text-muted-foreground', className)}>{fallback}</span>
  }
  
  try {
    const item = lookup(id)
    if (!item) {
      return <span className={cn('text-muted-foreground', className)}>{fallback}</span>
    }
    return <>{children(item)}</>
  } catch (error) {
    console.warn('SafeLookup: Error during lookup', error)
    return <span className={cn('text-muted-foreground', className)}>{fallback}</span>
  }
}

/**
 * Utility function to safely coerce checkbox values to boolean
 */
export function coerceBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value === 'true' || value === '1'
  if (typeof value === 'number') return value === 1
  return !!value
}

/**
 * Utility function to safely get nested object properties
 */
export function safeGet(obj: any, path: string, fallback: any = null): any {
  try {
    return path.split('.').reduce((current, key) => current?.[key], obj) ?? fallback
  } catch {
    return fallback
  }
}