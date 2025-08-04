import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, BarChart3, TrendingUp, Users, Calendar } from 'lucide-react'
import { TagAnalytics as TagAnalyticsType } from '../types'
import { formatDate } from '@/lib/utils'

interface TagAnalyticsProps {
  analytics: TagAnalyticsType
  onClose: () => void
}

export function TagAnalytics({ analytics, onClose }: TagAnalyticsProps) {
  const maxTrendValue = Math.max(...analytics.trendData.map(d => d.count))

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                Tag Analytics: {analytics.tagName}
              </CardTitle>
              <CardDescription>
                Usage statistics and trends for this tag
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overview Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Total Usage</p>
                    <p className="text-2xl font-bold text-blue-900">{analytics.totalUsage}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-900">Leads</p>
                    <p className="text-2xl font-bold text-green-900">
                      {analytics.entityBreakdown.lead || 0}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-900">Deals</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {analytics.entityBreakdown.deal || 0}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-900">Inventory</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {analytics.entityBreakdown.inventory || 0}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Entity Breakdown */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Entity Distribution</CardTitle>
              <CardDescription>
                How this tag is distributed across different entity types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analytics.entityBreakdown).map(([entityType, count]) => {
                  const percentage = analytics.totalUsage > 0 ? (count / analytics.totalUsage) * 100 : 0
                  
                  return (
                    <div key={entityType} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium capitalize">{entityType}s</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Usage Trend */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Usage Trend (Last 30 Days)
              </CardTitle>
              <CardDescription>
                Daily usage of this tag over the past month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-end space-x-1 h-32">
                  {analytics.trendData.map((data, index) => {
                    const height = maxTrendValue > 0 ? (data.count / maxTrendValue) * 100 : 0
                    
                    return (
                      <div
                        key={index}
                        className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                        title={`${data.date}: ${data.count} uses`}
                      />
                    )
                  })}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>30 days ago</span>
                  <span>Today</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Entities */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Top Tagged Entities</CardTitle>
              <CardDescription>
                Entities that have been assigned this tag
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topEntities.length > 0 ? (
                  analytics.topEntities.map((entity, index) => (
                    <div key={entity.entityId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-muted-foreground">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-medium">{entity.entityName}</p>
                          <p className="text-sm text-muted-foreground">
                            ID: {entity.entityId}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {entity.entityType}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No entities tagged yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end pt-6 border-t">
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}