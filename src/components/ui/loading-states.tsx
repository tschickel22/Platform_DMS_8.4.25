import React from 'react'
import { Skeleton } from '@/components/ui/loading-skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function PageHeaderSkeleton() {
  return (
    <div className="ri-page-header">
      <div className="ri-page-header-main">
        <div className="ri-page-header-content">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="ri-page-actions">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  )
}

export function StatsGridSkeleton() {
  return (
    <div className="ri-stats-grid">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="ri-stat-card">
          <CardHeader className="ri-stat-header">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function FilterBarSkeleton() {
  return (
    <div className="ri-filter-bar">
      <div className="ri-filter-left">
        <div className="ri-search-container">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="ri-filter-right">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

export function FormSectionSkeleton() {
  return (
    <Card className="ri-form-section">
      <CardHeader>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="ri-form-grid">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function DetailViewSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <FormSectionSkeleton />
          <FormSectionSkeleton />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}