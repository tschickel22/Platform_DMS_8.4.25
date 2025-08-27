import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export type StatCardVariant = 'blue' | 'orange' | 'green' | 'purple'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: React.ComponentType<{ className?: string }>
  variant: StatCardVariant
  isActive?: boolean
  onClick?: () => void
  className?: string
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  variant,
  isActive = false,
  onClick,
  className
}: StatCardProps) {
  const getVariantClasses = () => {
    const baseClasses = 'stat-card-base'
    const variantClass = isActive ? `stat-card-${variant}-active` : `stat-card-${variant}`
    return `${baseClasses} ${variantClass}`
  }

  return (
    <Card 
      className={cn(getVariantClasses(), className)}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs opacity-80 mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}