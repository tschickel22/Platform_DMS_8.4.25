import React from 'react'
import { Tracking } from '../types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Code, AlertTriangle } from 'lucide-react'

interface TrackingTagsPanelProps {
  tracking: Tracking
  onUpdateTracking: (tracking: Tracking) => void
}

export function TrackingTagsPanel({ tracking, onUpdateTracking }: TrackingTagsPanelProps) {
  const updateTracking = (updates: Partial<Tracking>) => {
    onUpdateTracking({
      ...tracking,
      ...updates
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <BarChart3 className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Analytics & Tracking</h3>
      </div>

      {/* Analytics Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Analytics Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ga4-id">Google Analytics 4 ID</Label>
            <Input
              id="ga4-id"
              value={tracking.ga4Id || ''}
              onChange={(e) => updateTracking({ ga4Id: e.target.value })}
              placeholder="G-XXXXXXXXXX"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Your GA4 measurement ID (starts with G-)
            </p>
          </div>

          <div>
            <Label htmlFor="gtag-id">Google Tag (gtag) ID</Label>
            <Input
              id="gtag-id"
              value={tracking.gtagId || ''}
              onChange={(e) => updateTracking({ gtagId: e.target.value })}
              placeholder="AW-XXXXXXXXX"
            />
            <p className="text-xs text-muted-foreground mt-1">
              For Google Ads conversion tracking
            </p>
          </div>

          <div>
            <Label htmlFor="gtm-id">Google Tag Manager ID</Label>
            <Input
              id="gtm-id"
              value={tracking.gtmId || ''}
              onChange={(e) => updateTracking({ gtmId: e.target.value })}
              placeholder="GTM-XXXXXXX"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Your GTM container ID
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Custom Code */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center space-x-2">
            <Code className="h-4 w-4" />
            <span>Custom Code</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Security Notice</p>
              <p>Custom code is stored but not executed in the admin interface. It will only run on the published website.</p>
            </div>
          </div>

          <div>
            <Label htmlFor="head-html">Custom Head HTML</Label>
            <Textarea
              id="head-html"
              value={tracking.headHtml || ''}
              onChange={(e) => updateTracking({ headHtml: e.target.value })}
              placeholder="<!-- Custom scripts, meta tags, etc. -->"
              rows={6}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Code inserted before &lt;/head&gt; tag
            </p>
          </div>

          <div>
            <Label htmlFor="body-html">Custom Body End HTML</Label>
            <Textarea
              id="body-html"
              value={tracking.bodyEndHtml || ''}
              onChange={(e) => updateTracking({ bodyEndHtml: e.target.value })}
              placeholder="<!-- Analytics, chat widgets, etc. -->"
              rows={6}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Code inserted before &lt;/body&gt; tag
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tracking.ga4Id && (
              <Badge variant="default">
                <BarChart3 className="h-3 w-3 mr-1" />
                Google Analytics 4
              </Badge>
            )}
            {tracking.gtagId && (
              <Badge variant="default">
                <BarChart3 className="h-3 w-3 mr-1" />
                Google Ads
              </Badge>
            )}
            {tracking.gtmId && (
              <Badge variant="default">
                <Code className="h-3 w-3 mr-1" />
                Tag Manager
              </Badge>
            )}
            {tracking.headHtml && (
              <Badge variant="secondary">
                <Code className="h-3 w-3 mr-1" />
                Custom Head
              </Badge>
            )}
            {tracking.bodyEndHtml && (
              <Badge variant="secondary">
                <Code className="h-3 w-3 mr-1" />
                Custom Body
              </Badge>
            )}
            {!tracking.ga4Id && !tracking.gtagId && !tracking.gtmId && !tracking.headHtml && !tracking.bodyEndHtml && (
              <Badge variant="outline">No tracking configured</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}