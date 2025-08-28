import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

interface UseUnsavedChangesOptions {
  hasUnsavedChanges: boolean
  message?: string
  onBeforeUnload?: () => void
  onNavigateAway?: () => Promise<boolean> | boolean
}

export function useUnsavedChanges({
  hasUnsavedChanges,
  message = 'You have unsaved changes. Are you sure you want to leave?',
  onBeforeUnload,
  onNavigateAway
}: UseUnsavedChangesOptions) {
  const navigate = useNavigate()
  const location = useLocation()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const hasUnsavedRef = useRef(hasUnsavedChanges)

  // Update ref when hasUnsavedChanges changes
  useEffect(() => {
    hasUnsavedRef.current = hasUnsavedChanges
  }, [hasUnsavedChanges])

  // Handle browser refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedRef.current) {
        e.preventDefault()
        e.returnValue = message
        onBeforeUnload?.()
        return message
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [message, onBeforeUnload])

  // Handle navigation within the app
  useEffect(() => {
    if (!hasUnsavedChanges) return

    const handlePopState = async (e: PopStateEvent) => {
      if (hasUnsavedRef.current) {
        e.preventDefault()
        
        const shouldNavigate = onNavigateAway 
          ? await onNavigateAway()
          : window.confirm(message)
          
        if (shouldNavigate) {
          hasUnsavedRef.current = false
          // Allow the navigation to proceed
          window.history.go(1)
        } else {
          // Stay on current page
          window.history.pushState(null, '', location.pathname + location.search)
        }
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [hasUnsavedChanges, message, onNavigateAway, location])

  const confirmNavigation = async () => {
    if (!pendingNavigation) return

    const shouldNavigate = onNavigateAway 
      ? await onNavigateAway()
      : true

    if (shouldNavigate) {
      hasUnsavedRef.current = false
      navigate(pendingNavigation)
    }
    
    setShowConfirmDialog(false)
    setPendingNavigation(null)
  }

  const cancelNavigation = () => {
    setShowConfirmDialog(false)
    setPendingNavigation(null)
  }

  // Custom navigate function that checks for unsaved changes
  const navigateWithConfirm = (to: string) => {
    if (hasUnsavedRef.current) {
      setPendingNavigation(to)
      setShowConfirmDialog(true)
    } else {
      navigate(to)
    }
  }

  return {
    showConfirmDialog,
    confirmNavigation,
    cancelNavigation,
    navigateWithConfirm,
    message
  }
}