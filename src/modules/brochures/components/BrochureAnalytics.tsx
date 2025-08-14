import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Download, 
  Share2, 
  Users,
  Calendar,
  FileText
} from 'lucide-react'
import { useBrochureStore } from '../store/useBrochureStore'

interface BrochureAnalyticsProps {
  onClose: () => void
}

export function BrochureAnalytics({ onClose }: BrochureAnalyticsProps) {
  const { generatedBrochures, templates } = useBrochureStore()

  // Calculate analytics
  const totalBrochures = generatedBrochures.length
  const totalViews = generatedBrochures.reduce((sum, b) => sum + (b.analytics?.views || 0), 0)
  const totalDownloads = generatedBrochures.reduce((sum, b) => sum + (b.analytics?.downloads || 0), 0)
  const totalShares = generatedBrochures.reduce((sum, b) => sum + (b.analytics?.shares || 0), 0)

  // Top performing brochures
  const topBrochures = [...generatedBrochures]
    .sort((a, b) => (b.analytics?.views || 0) - (a.analytics?.views || 0))
    .slice(0, 5)

  // Template usage
  const templateUsage = templates.map(template => {
    const usageCount = generatedBrochures.filter(b => b.templateId === template.id).length
    const totalViews = generatedBrochures
      .filter(b => b.templateId === template.id)
      .reduce((sum, b) => sum + (b.analytics?.views || 0), 0)
    
    return {
      template,
      usageCount,
      totalViews,
      avgViews: usageCount > 0 ? Math.round(totalViews / usageCount) : 0
    }
  }).sort((a, b) => b.usageCount - a.usageCount)

  // Recent activity (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const recentBrochures = generatedBrochures.filter(b => 
    new Date(b.createdAt) > thirtyDaysAgo
  )

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Brochure Analytics</DialogTitle>
          <DialogDescription>
            Performance insights for your marketing brochures
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Brochures</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalBrochures}</div>
                  <p className="text-xs text-muted-foreground">
                    {recentBrochures.length} created this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalViews}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalBrochures > 0 ? Math.round(totalViews / totalBrochures) : 0} avg per brochure
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Downloads</CardTitle>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalDownloads}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalViews > 0 ? ((totalDownloads / totalViews) * 100).toFixed(1) : 0}% conversion rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Shares</CardTitle>
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalShares}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalViews > 0 ? ((totalShares / totalViews) * 100).toFixed(1) : 0}% share rate
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest brochure activity and engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentBrochures.length > 0 ? (
                  <div className="space-y-3">
                    {recentBrochures.slice(0, 5).map((brochure) => (
                      <div key={brochure.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{brochure.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            Created {new Date(brochure.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{brochure.analytics?.views || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Download className="h-3 w-3" />
                            <span>{brochure.analytics?.downloads || 0}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {brochure.listingCount} listings
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Brochures</CardTitle>
                <CardDescription>
                  Brochures with the highest engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                {topBrochures.length > 0 ? (
                  <div className="space-y-3">
                    {topBrochures.map((brochure, index) => (
                      <div key={brochure.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{brochure.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {brochure.templateName} • {brochure.listingCount} listings
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="text-center">
                            <div className="font-bold">{brochure.analytics?.views || 0}</div>
                            <div className="text-xs text-muted-foreground">Views</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">{brochure.analytics?.downloads || 0}</div>
                            <div className="text-xs text-muted-foreground">Downloads</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">
                              {brochure.analytics?.views ? 
                                ((brochure.analytics.downloads / brochure.analytics.views) * 100).toFixed(1) : 0}%
                            </div>
                            <div className="text-xs text-muted-foreground">Conversion</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No performance data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Template Usage</CardTitle>
                <CardDescription>
                  How often each template is used and their performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {templateUsage.length > 0 ? (
                  <div className="space-y-3">
                    {templateUsage.map((item) => (
                      <div key={item.template.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-8 h-6 rounded border"
                            style={{ backgroundColor: item.template.theme.primaryColor }}
                          />
                          <div>
                            <h4 className="font-medium text-sm">{item.template.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {item.template.listingType === 'both' ? 'RV & MH' : item.template.listingType.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="text-center">
                            <div className="font-bold">{item.usageCount}</div>
                            <div className="text-xs text-muted-foreground">Used</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">{item.totalViews}</div>
                            <div className="text-xs text-muted-foreground">Total Views</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">{item.avgViews}</div>
                            <div className="text-xs text-muted-foreground">Avg Views</div>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={item.template.status === 'active' ? 'text-green-700' : 'text-gray-700'}
                          >
                            {item.template.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No template usage data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}