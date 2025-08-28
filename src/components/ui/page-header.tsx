import React from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  children,
  className
}: PageHeaderProps) {
  return (
    <div className={cn('ri-page-header', className)}>
      <div className="ri-page-header-main">
        <div className="ri-page-header-content">
          <h1 className="ri-page-title">{title}</h1>
          {description && (
            <p className="ri-page-description">{description}</p>
          )}
        </div>
        {children && (
          <div className="ri-page-actions">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

interface StatsGridProps {
  children: React.ReactNode
  className?: string
}

export function StatsGrid({ children, className }: StatsGridProps) {
  return (
    <div className={cn('ri-stats-grid', className)}>
      {children}
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ComponentType<{ className?: string }>
  onClick?: () => void
  className?: string
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  onClick,
  className
}: StatCardProps) {
  const CardComponent = onClick ? 'button' : 'div'
  
  return (
    <CardComponent
      onClick={onClick}
      className={cn(
        'ri-stat-card',
        onClick && 'ri-card-interactive ri-interactive',
        className
      )}
    >
      <div className="ri-stat-header">
        <div className="ri-stat-title">{title}</div>
        {Icon && <Icon className="ri-stat-icon" />}
      </div>
      <div className="ri-stat-value">{value}</div>
      {change && (
        <p className={cn('ri-stat-change', changeType)}>
          {change}
        </p>
      )}
    </CardComponent>
  )
}