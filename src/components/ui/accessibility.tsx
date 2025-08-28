import React from 'react'
import { cn } from '@/lib/utils'

interface VisuallyHiddenProps {
  children: React.ReactNode
  className?: string
}

/**
 * Visually hidden content that's still accessible to screen readers
 */
export function VisuallyHidden({ children, className }: VisuallyHiddenProps) {
  return (
    <span className={cn('sr-only', className)}>
      {children}
    </span>
  )
}

interface SkipLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

/**
 * Skip link for keyboard navigation
 */
export function SkipLink({ href, children, className }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'absolute left-4 top-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md',
        'transform -translate-y-16 focus:translate-y-0 transition-transform',
        'ri-focus-ring',
        className
      )}
    >
      {children}
    </a>
  )
}

interface FocusTrapProps {
  children: React.ReactNode
  enabled?: boolean
}

/**
 * Simple focus trap for modals and dialogs
 */
export function FocusTrap({ children, enabled = true }: FocusTrapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!enabled || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }, [enabled])

  return (
    <div ref={containerRef} className="focus-trap">
      {children}
    </div>
  )
}

interface AnnouncementProps {
  message: string
  priority?: 'polite' | 'assertive'
}

/**
 * Live region for screen reader announcements
 */
export function Announcement({ message, priority = 'polite' }: AnnouncementProps) {
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}

/**
 * Hook for managing focus restoration
 */
export function useFocusRestore() {
  const previousFocusRef = React.useRef<HTMLElement | null>(null)

  const saveFocus = React.useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement
  }, [])

  const restoreFocus = React.useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus()
      previousFocusRef.current = null
    }
  }, [])

  return { saveFocus, restoreFocus }
}

/**
 * Hook for keyboard navigation in lists
 */
export function useKeyboardNavigation(
  items: any[],
  onSelect: (item: any) => void,
  enabled: boolean = true
) {
  const [focusedIndex, setFocusedIndex] = React.useState(0)

  React.useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex(prev => Math.min(prev + 1, items.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex(prev => Math.max(prev - 1, 0))
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (items[focusedIndex]) {
            onSelect(items[focusedIndex])
          }
          break
        case 'Home':
          e.preventDefault()
          setFocusedIndex(0)
          break
        case 'End':
          e.preventDefault()
          setFocusedIndex(items.length - 1)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [enabled, items, focusedIndex, onSelect])

  return { focusedIndex, setFocusedIndex }
}