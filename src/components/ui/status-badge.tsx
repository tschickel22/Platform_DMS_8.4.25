import React from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  className?: string
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  // Auto-detect variant based on common status patterns if not provided
  const autoVariant = variant || getStatusVariant(status)
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200'
  }

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'ri-badge-status border',
        variantClasses[autoVariant],
        className
      )}
    >
      {status}
    </Badge>
  )
}

function getStatusVariant(status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  const statusLower = status.toLowerCase()
  
  // Success patterns
  if (['active', 'completed', 'paid', 'delivered', 'signed', 'current', 'approved'].includes(statusLower)) {
    return 'success'
  }
  
  // Warning patterns
  if (['pending', 'in_progress', 'scheduled', 'processing', 'review', 'waiting'].includes(statusLower)) {
    return 'warning'
  }
  
  // Danger patterns
  if (['failed', 'cancelled', 'overdue', 'expired', 'rejected', 'late', 'default'].includes(statusLower)) {
    return 'danger'
  }
  
  // Info patterns
  if (['draft', 'new', 'open', 'sent', 'viewed'].includes(statusLower)) {
    return 'info'
  }
  
  return 'default'
}

interface PriorityBadgeProps {
  priority: string
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const priorityLower = priority.toLowerCase()
  
  const variant = priorityLower === 'urgent' || priorityLower === 'high' 
    ? 'danger'
    : priorityLower === 'medium'
    ? 'warning' 
    : priorityLower === 'low'
    ? 'info'
    : 'default'

  return (
    <StatusBadge 
      status={priority} 
      variant={variant}
      className={className}
    />
  )
}