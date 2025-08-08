import React from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

interface BooleanIndicatorProps {
  value?: boolean
  label: string
}

export function BooleanIndicator({ value, label }: BooleanIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {value ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-gray-400" />
      )}
      <span className={value ? 'text-foreground' : 'text-muted-foreground'}>{label}</span>
    </div>
  )
}