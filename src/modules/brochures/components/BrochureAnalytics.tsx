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
  Calendar,
  FileText,
  Users
} from 'lucide-react'
import { useBrochureStore } from '../store/useBrochureStore'

interface BrochureAnalyticsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BrochureAnalytics({ open, onOpenChange }: BrochureAnalyticsProps) {
  const { brochures, templates } = useBrochureStore()

  // Calculate analytics
  const totalViews = brochures.reduce((sum, b) => sum + b.analytics.views, 0)
  const totalDownloads = brochures.reduce((sum, b) => sum + b.analytics.downloads, 0)
  const totalShares = brochures.reduce((sum, b) => sum + b.analytics.shares, 0)
  
  const topPerforming = brochures
    .sort((a, b) => b.analytics.views - a.analytics.views)
    .slice(0, 5)

  const templateUsage = templates.map(template => ({
    ...template,
    usageCount: brochures.filter(b => b.templateId === template.id).length,
    totalViews: brochures
      .filter(b => b.templateId === template.id)
      .reduce((sum, b) => sum + b.analytics.views, 0)
  })).sort((a, b) => b.usageCount - a.usageCount)

  const recentActivity = brochures
    .filter(b => b.analytics.lastViewed)
    .sort((a, b) => new Date(b.analytics.lastViewed!).getTime() - new Date(a.analytics.lastViewed!).getTime())
    .slice(0, 10)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Brochure Analytics</DialogTitle>
          <DialogDescription>
            Performance insights for your brochures and templates
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="brochures">
              <FileText className="h-4 w-4 mr-2" />
              Brochures
            </TabsTrigger>
            <TabsTrigger value="templates">
              <Users className="h-4 w-4 mr-2" />
              Templates
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Across {brochures.length} brochures
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Downloads</CardTitle>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalDownloads.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalViews > 0 ? `${((totalDownloads / totalViews) * 100).toFixed(1)}% conversion` : 'No data'}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Shares</CardTitle>
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalShares.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Social & direct shares
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Templates</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{templates.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Active templates
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Brochures */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Brochures</CardTitle>
                <CardDescription>
                  Brochures with the most engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerforming.map((brochure, index) => (
                    <div key={brochure.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <div>
                          <p className="font-medium">{brochure.name}</p>
                          <p className="text-sm text-muted-foreground">{brochure.templateName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="text-center">
                          <p className="font-medium">{brochure.analytics.views}</p>
                          <p className="text-muted-foreground">Views</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{brochure.analytics.downloads}</p>
                          <p className="text-muted-foreground">Downloads</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{brochure.analytics.shares}</p>
                          <p className="text-muted-foreground">Shares</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Brochures Performance Tab */}
          <TabsContent value="brochures" className="space-y-4">
            <div className="grid gap-4">
              {brochures.map((brochure) => (
                <Card key={brochure.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{brochure.name}</CardTitle>
                        <CardDescription>{brochure.templateName}</CardDescription>
                      </div>
                      <Badge variant="outline">
                        {brochure.listingIds.length} listings
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{brochure.analytics.views}</p>
                        <p className="text-sm text-muted-foreground">Views</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{brochure.analytics.downloads}</p>
                        <p className="text-sm text-muted-foreground">Downloads</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">{brochure.analytics.shares}</p>
                        <p className="text-sm text-muted-foreground">Shares</p>
                      </div>
                    </div>
                    {brochure.analytics.lastViewed && (
                      <p className="text-xs text-muted-foreground mt-3 text-center">
                        Last viewed: {new Date(brochure.analytics.lastViewed).toLocaleString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Template Usage Tab */}
          <TabsContent value="templates" className="space-y-4">
            <div className="grid gap-4">
              {templateUsage.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{template.theme}</Badge>
                        <Badge variant="secondary">{template.usageCount} uses</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-xl font-bold text-blue-600">{template.usageCount}</p>
                        <p className="text-sm text-muted-foreground">Brochures Generated</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-green-600">{template.totalViews}</p>
                        <p className="text-sm text-muted-foreground">Total Views</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}