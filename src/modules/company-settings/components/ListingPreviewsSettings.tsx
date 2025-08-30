import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { 
  Share2, 
  Link2, 
  Eye, 
  Copy, 
  ExternalLink,
  QrCode,
  Calendar,
  Settings,
  Trash2,
  RefreshCw,
  BarChart3,
  MousePointer,
  Users
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useTenant } from '@/contexts/TenantContext'
import { apiClient } from '@/utils/apiClient'
import QRCode from 'react-qr-code'

interface ShareLink {
  id: string
  token: string
  title: string
  type: 'single' | 'selection' | 'catalog'
  listingIds: string[]
  shortUrl: string
  canonicalUrl: string
  createdAt: string
  expiresAt?: string
  isRevoked: boolean
  watermark: boolean
  clicks: number
  uniqueClicks: number
  lastClicked?: string
}

interface ShareSettings {
  enablePublicCatalog: boolean
  enableShareLinks: boolean
  defaultExpiration: number // days
  requireWatermark: boolean
  customDomain?: string
  trackingEnabled: boolean
  maxLinksPerListing: number
  allowPasswordProtection: boolean
}

interface ShareAnalytics {
  totalClicks: number
  uniqueClicks: number
  topSources: Array<{source: string, clicks: number}>
  topReferrers: Array<{referrer: string, clicks: number}>
  recentActivity: Array<{
    token: string
    lastClick: string
    totalClicks: number
  }>
}

export default function ListingPreviewsSettings() {
  const { toast } = useToast()
  const { tenant } = useTenant()
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([])
  const [settings, setSettings] = useState<ShareSettings>({
    enablePublicCatalog: true,
    enableShareLinks: true,
    defaultExpiration: 30,
    requireWatermark: false,
    trackingEnabled: true,
    maxLinksPerListing: 5,
    allowPasswordProtection: false
  })
  const [analytics, setAnalytics] = useState<ShareAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedLink, setSelectedLink] = useState<ShareLink | null>(null)
  const [showQR, setShowQR] = useState<string | null>(null)

  useEffect(() => {
    loadShareSettings()
    loadShareLinks()
    loadAnalytics()
  }, [])

  const loadShareSettings = async () => {
    try {
      // Mock loading settings - in production, fetch from backend
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Settings are already initialized with defaults
      
    } catch (error) {
      console.error('Error loading share settings:', error)
      toast({
        title: "Error",
        description: "Failed to load share settings",
        variant: "destructive",
      })
    }
  }

  const loadShareLinks = async () => {
    try {
      const companyId = tenant?.id || 'demo-company'
      
      // Mock share links - in production, use apiClient
      const mockLinks: ShareLink[] = [
        {
          id: '1',
          token: 'abc123',
          title: 'Featured RV Inventory',
          type: 'selection',
          listingIds: ['rv1', 'rv2', 'rv3'],
          shortUrl: `https://previews.renterinsight.com/${tenant?.slug || 'demo'}/l/abc123`,
          canonicalUrl: `https://previews.renterinsight.com/${tenant?.slug || 'demo'}/listings`,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          isRevoked: false,
          watermark: false,
          clicks: 45,
          uniqueClicks: 32,
          lastClicked: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          token: 'def456',
          title: '2023 Forest River Cherokee',
          type: 'single',
          listingIds: ['rv1'],
          shortUrl: `https://previews.renterinsight.com/${tenant?.slug || 'demo'}/l/def456`,
          canonicalUrl: `https://previews.renterinsight.com/${tenant?.slug || 'demo'}/listing/rv1`,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          isRevoked: false,
          watermark: true,
          clicks: 12,
          uniqueClicks: 8,
          lastClicked: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      ]
      
      setShareLinks(mockLinks)
      
    } catch (error) {
      console.error('Error loading share links:', error)
      toast({
        title: "Error", 
        description: "Failed to load share links",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadAnalytics = async () => {
    try {
      const companyId = tenant?.id || 'demo-company'
      
      // Mock analytics - in production, use apiClient.shareAnalytics.getSummary()
      const mockAnalytics: ShareAnalytics = {
        totalClicks: 157,
        uniqueClicks: 89,
        topSources: [
          { source: 'direct', clicks: 45 },
          { source: 'facebook', clicks: 32 },
          { source: 'google', clicks: 18 }
        ],
        topReferrers: [
          { referrer: 'facebook.com', clicks: 32 },
          { referrer: 'google.com', clicks: 18 },
          { referrer: 'craigslist.org', clicks: 12 }
        ],
        recentActivity: [
          { token: 'abc123', lastClick: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), totalClicks: 45 },
          { token: 'def456', lastClick: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), totalClicks: 12 }
        ]
      }
      
      setAnalytics(mockAnalytics)
      
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      
      // Mock save - in production, save to backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Settings Saved",
        description: "Share link settings have been updated",
      })
      
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Error",
        description: "Failed to save share settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Link copied to clipboard",
    })
  }

  const revokeShareLink = async (token: string) => {
    try {
      // Mock revoke - in production, use apiClient.shareLinks.revoke()
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setShareLinks(prev => prev.map(link => 
        link.token === token ? { ...link, isRevoked: true } : link
      ))
      
      toast({
        title: "Link Revoked",
        description: "Share link has been revoked and is no longer accessible",
      })
      
    } catch (error) {
      console.error('Error revoking share link:', error)
      toast({
        title: "Error",
        description: "Failed to revoke share link",
        variant: "destructive",
      })
    }
  }

  const createTestShareLink = async () => {
    try {
      const companyId = tenant?.id || 'demo-company'
      
      // Mock create - in production, use apiClient.shareLinks.create()
      const mockLink: ShareLink = {
        id: String(shareLinks.length + 1),
        token: Math.random().toString(36).substr(2, 9),
        title: 'Full Catalog Preview',
        type: 'catalog',
        listingIds: [],
        shortUrl: `https://previews.renterinsight.com/${tenant?.slug || 'demo'}/l/${Math.random().toString(36).substr(2, 9)}`,
        canonicalUrl: `https://previews.renterinsight.com/${tenant?.slug || 'demo'}/listings`,
        createdAt: new Date().toISOString(),
        isRevoked: false,
        watermark: settings.requireWatermark,
        clicks: 0,
        uniqueClicks: 0
      }
      
      setShareLinks(prev => [mockLink, ...prev])
      
      toast({
        title: "Share Link Created",
        description: "New catalog share link has been created",
      })
      
    } catch (error) {
      console.error('Error creating share link:', error)
      toast({
        title: "Error",
        description: "Failed to create share link",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Listing Previews & Share Links</h2>
          <p className="text-muted-foreground">
            Manage public listing previews and shareable links
          </p>
        </div>
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Settings className="h-4 w-4 mr-2" />}
          Save Settings
        </Button>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="links">Share Links</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview Settings</CardTitle>
              <CardDescription>
                Configure how your listings appear in public previews
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enable-catalog">Enable Public Catalog</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow public access to your full listing catalog
                      </p>
                    </div>
                    <Switch
                      id="enable-catalog"
                      checked={settings.enablePublicCatalog}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, enablePublicCatalog: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enable-share">Enable Share Links</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow creation of shareable listing links
                      </p>
                    </div>
                    <Switch
                      id="enable-share"
                      checked={settings.enableShareLinks}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, enableShareLinks: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="require-watermark">Require Watermark</Label>
                      <p className="text-sm text-muted-foreground">
                        Add company watermark to shared listings
                      </p>
                    </div>
                    <Switch
                      id="require-watermark"
                      checked={settings.requireWatermark}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, requireWatermark: checked }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-expiration">Default Expiration (days)</Label>
                    <Input
                      id="default-expiration"
                      type="number"
                      min="1"
                      max="365"
                      value={settings.defaultExpiration}
                      onChange={(e) => 
                        setSettings(prev => ({ 
                          ...prev, 
                          defaultExpiration: parseInt(e.target.value) || 30 
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-links">Max Links Per Listing</Label>
                    <Input
                      id="max-links"
                      type="number"
                      min="1"
                      max="50"
                      value={settings.maxLinksPerListing}
                      onChange={(e) => 
                        setSettings(prev => ({ 
                          ...prev, 
                          maxLinksPerListing: parseInt(e.target.value) || 5 
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-domain">Custom Domain</Label>
                    <Input
                      id="custom-domain"
                      placeholder="previews.yourdomain.com"
                      value={settings.customDomain || ''}
                      onChange={(e) => 
                        setSettings(prev => ({ ...prev, customDomain: e.target.value }))
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional: Use your own domain for share links
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Share Links</CardTitle>
                  <CardDescription>
                    Manage your listing share links and their settings
                  </CardDescription>
                </div>
                <Button onClick={createTestShareLink}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Create Test Link
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {shareLinks.length === 0 ? (
                <div className="text-center py-8">
                  <Share2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Share Links</h3>
                  <p className="text-muted-foreground mb-4">
                    Create share links to allow public access to your listings
                  </p>
                  <Button onClick={createTestShareLink}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Create First Link
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {shareLinks.map(link => (
                    <div key={link.id} className={`border rounded-lg p-4 ${link.isRevoked ? 'opacity-50' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">{link.title}</h4>
                            <Badge variant={
                              link.type === 'single' ? 'default' : 
                              link.type === 'selection' ? 'secondary' : 'outline'
                            }>
                              {link.type}
                            </Badge>
                            {link.watermark && (
                              <Badge variant="outline" className="text-xs">Watermarked</Badge>
                            )}
                            {link.isRevoked && (
                              <Badge variant="destructive" className="text-xs">Revoked</Badge>
                            )}
                          </div>
                          
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-4">
                              <span>Created: {new Date(link.createdAt).toLocaleDateString()}</span>
                              <span>Clicks: {link.clicks}</span>
                              <span>Unique: {link.uniqueClicks}</span>
                              {link.lastClicked && (
                                <span>Last: {new Date(link.lastClicked).toLocaleDateString()}</span>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Link2 className="h-3 w-3" />
                              <code className="text-xs bg-gray-100 px-1 rounded">{link.shortUrl}</code>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={() => copyToClipboard(link.shortUrl)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowQR(showQR === link.token ? null : link.token)}
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(link.shortUrl, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          
                          {!link.isRevoked && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => revokeShareLink(link.token)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {showQR === link.token && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-center">
                            <div className="bg-white p-4 rounded-lg border">
                              <QRCode value={link.shortUrl} size={128} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {analytics && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.totalClicks}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MousePointer className="h-4 w-4 mr-1" />
                      All link interactions
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.uniqueClicks}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      Unique IP addresses
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {((analytics.uniqueClicks / analytics.totalClicks) * 100).toFixed(1)}%
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Unique vs total clicks
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Sources</CardTitle>
                    <CardDescription>
                      Where your share link traffic comes from
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.topSources.map((source, index) => (
                        <div key={source.source} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 text-center text-sm text-muted-foreground">
                              {index + 1}
                            </div>
                            <span className="capitalize">{source.source}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{source.clicks}</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{
                                  width: `${(source.clicks / analytics.totalClicks) * 100}%`
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest share link interactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.recentActivity.map((activity, index) => (
                        <div key={activity.token} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 text-center text-sm text-muted-foreground">
                              {index + 1}
                            </div>
                            <div>
                              <code className="text-sm">{activity.token}</code>
                              <div className="text-xs text-muted-foreground">
                                {new Date(activity.lastClick).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {activity.totalClicks} clicks
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}