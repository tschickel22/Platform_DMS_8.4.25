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
  Globe, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Database,
  Zap
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { apiClient } from '@/utils/apiClient'

interface Partner {
  id: string
  name: string
  description: string
  enabled: boolean
  feedFormat: 'json' | 'xml'
  status: 'active' | 'inactive' | 'error'
  lastSync?: string
  totalListings?: number
  apiEndpoint: string
  supportedTypes: ('manufactured_home' | 'rv')[]
  features: string[]
}

interface SyndicationSettings {
  partners: Partner[]
  globalSettings: {
    autoSync: boolean
    syncInterval: number
    maxRetries: number
    enableLogging: boolean
    requireApproval: boolean
  }
  feedSettings: {
    cacheTimeout: number
    enableCompression: boolean
    includeInactiveListings: boolean
    customFields: Record<string, any>
  }
}

export default function SyndicationSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<SyndicationSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testingPartner, setTestingPartner] = useState<string | null>(null)

  const defaultPartners: Partner[] = [
    {
      id: 'mhvillage',
      name: 'MH Village',
      description: 'Leading marketplace for manufactured homes',
      enabled: false,
      feedFormat: 'json',
      status: 'inactive',
      apiEndpoint: '/.netlify/functions/syndication-feed',
      supportedTypes: ['manufactured_home'],
      features: ['Photos', 'Community Integration', 'Lead Routing', 'Premium Listings']
    },
    {
      id: 'rvtrader',
      name: 'RV Trader',
      description: 'Premier RV marketplace and classifieds',
      enabled: false,
      feedFormat: 'json', 
      status: 'inactive',
      apiEndpoint: '/.netlify/functions/syndication-feed',
      supportedTypes: ['rv'],
      features: ['VIN Decode', 'Dealer Network', 'Finance Tools', 'Trade Values']
    },
    {
      id: 'zillow',
      name: 'Zillow',
      description: 'Real estate platform with MH support',
      enabled: false,
      feedFormat: 'xml',
      status: 'inactive', 
      apiEndpoint: '/.netlify/functions/syndication-feed',
      supportedTypes: ['manufactured_home'],
      features: ['Zestimate', 'Market Analytics', 'Rental Manager', 'Agent Network']
    }
  ]

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      
      // Mock loading settings - in production, fetch from backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockSettings: SyndicationSettings = {
        partners: defaultPartners,
        globalSettings: {
          autoSync: true,
          syncInterval: 60,
          maxRetries: 3,
          enableLogging: true,
          requireApproval: false
        },
        feedSettings: {
          cacheTimeout: 3600,
          enableCompression: true,
          includeInactiveListings: false,
          customFields: {}
        }
      }
      
      setSettings(mockSettings)
      
    } catch (error) {
      console.error('Error loading syndication settings:', error)
      toast({
        title: "Error",
        description: "Failed to load syndication settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!settings) return
    
    try {
      setSaving(true)
      
      // Mock saving - in production, save to backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Settings Saved",
        description: "Syndication settings have been updated successfully",
      })
      
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Error",
        description: "Failed to save syndication settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const testPartnerFeed = async (partnerId: string) => {
    try {
      setTestingPartner(partnerId)
      
      // Test feed with a sample company
      const testResponse = await apiClient.syndicationFeeds.getFeed(partnerId, 'test_company', {
        preview: '1'
      })
      
      if (testResponse) {
        toast({
          title: "Feed Test Successful",
          description: `${partnerId} feed is working correctly`,
        })
        
        // Update partner status
        setSettings(prev => prev ? {
          ...prev,
          partners: prev.partners.map(p => 
            p.id === partnerId 
              ? { ...p, status: 'active', lastSync: new Date().toISOString() }
              : p
          )
        } : null)
      } else {
        throw new Error('Feed test failed')
      }
      
    } catch (error) {
      console.error('Feed test error:', error)
      toast({
        title: "Feed Test Failed",
        description: `Failed to test ${partnerId} feed`,
        variant: "destructive",
      })
      
      // Update partner status to error
      setSettings(prev => prev ? {
        ...prev,
        partners: prev.partners.map(p => 
          p.id === partnerId 
            ? { ...p, status: 'error' }
            : p
        )
      } : null)
    } finally {
      setTestingPartner(null)
    }
  }

  const togglePartner = (partnerId: string, enabled: boolean) => {
    setSettings(prev => prev ? {
      ...prev,
      partners: prev.partners.map(p => 
        p.id === partnerId 
          ? { ...p, enabled, status: enabled ? p.status : 'inactive' }
          : p
      )
    } : null)
  }

  if (loading || !settings) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Syndication Settings</h1>
          <p className="text-muted-foreground">
            Configure listing syndication to partner marketplaces
          </p>
        </div>
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Settings className="h-4 w-4 mr-2" />}
          Save Settings
        </Button>
      </div>

      <Tabs defaultValue="partners" className="space-y-6">
        <TabsList>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="global">Global Settings</TabsTrigger>
          <TabsTrigger value="feeds">Feed Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="partners" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {settings.partners.map((partner) => (
              <Card key={partner.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-8 w-8 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{partner.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {partner.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={partner.enabled}
                      onCheckedChange={(checked) => togglePartner(partner.id, checked)}
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <div className="flex items-center space-x-2">
                      {partner.status === 'active' && (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <Badge variant="secondary" className="bg-green-50 text-green-700">Active</Badge>
                        </>
                      )}
                      {partner.status === 'inactive' && (
                        <>
                          <XCircle className="h-4 w-4 text-gray-400" />
                          <Badge variant="secondary">Inactive</Badge>
                        </>
                      )}
                      {partner.status === 'error' && (
                        <>
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <Badge variant="destructive">Error</Badge>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Format</span>
                      <Badge variant="outline">{partner.feedFormat.toUpperCase()}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Types</span>
                      <div className="flex space-x-1">
                        {partner.supportedTypes.map(type => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type === 'manufactured_home' ? 'MH' : 'RV'}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {partner.lastSync && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Last Sync</span>
                        <span className="text-xs">
                          {new Date(partner.lastSync).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Features</h4>
                    <div className="flex flex-wrap gap-1">
                      {partner.features.slice(0, 3).map(feature => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {partner.features.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{partner.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testPartnerFeed(partner.id)}
                      disabled={testingPartner === partner.id}
                      className="flex-1"
                    >
                      {testingPartner === partner.id ? (
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Zap className="h-3 w-3 mr-1" />
                      )}
                      Test Feed
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`${partner.apiEndpoint}?partnerId=${partner.id}&companyId=test_company&preview=1`, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="global" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Syndication Settings</CardTitle>
              <CardDescription>
                Configure system-wide syndication behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-sync">Auto Sync</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically sync listings to enabled partners
                      </p>
                    </div>
                    <Switch
                      id="auto-sync"
                      checked={settings.globalSettings.autoSync}
                      onCheckedChange={(checked) => 
                        setSettings(prev => prev ? {
                          ...prev,
                          globalSettings: { ...prev.globalSettings, autoSync: checked }
                        } : null)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sync-interval">Sync Interval (minutes)</Label>
                    <Input
                      id="sync-interval"
                      type="number"
                      min="15"
                      max="1440"
                      value={settings.globalSettings.syncInterval}
                      onChange={(e) => 
                        setSettings(prev => prev ? {
                          ...prev,
                          globalSettings: { 
                            ...prev.globalSettings, 
                            syncInterval: parseInt(e.target.value) || 60 
                          }
                        } : null)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-retries">Max Retries</Label>
                    <Input
                      id="max-retries"
                      type="number"
                      min="1"
                      max="10"
                      value={settings.globalSettings.maxRetries}
                      onChange={(e) => 
                        setSettings(prev => prev ? {
                          ...prev,
                          globalSettings: { 
                            ...prev.globalSettings, 
                            maxRetries: parseInt(e.target.value) || 3 
                          }
                        } : null)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enable-logging">Enable Logging</Label>
                      <p className="text-sm text-muted-foreground">
                        Log syndication activity for debugging
                      </p>
                    </div>
                    <Switch
                      id="enable-logging"
                      checked={settings.globalSettings.enableLogging}
                      onCheckedChange={(checked) => 
                        setSettings(prev => prev ? {
                          ...prev,
                          globalSettings: { ...prev.globalSettings, enableLogging: checked }
                        } : null)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="require-approval">Require Approval</Label>
                      <p className="text-sm text-muted-foreground">
                        Require manual approval before syndication
                      </p>
                    </div>
                    <Switch
                      id="require-approval"
                      checked={settings.globalSettings.requireApproval}
                      onCheckedChange={(checked) => 
                        setSettings(prev => prev ? {
                          ...prev,
                          globalSettings: { ...prev.globalSettings, requireApproval: checked }
                        } : null)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feeds" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feed Configuration</CardTitle>
              <CardDescription>
                Configure feed generation and caching behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cache-timeout">Cache Timeout (seconds)</Label>
                    <Input
                      id="cache-timeout"
                      type="number"
                      min="300"
                      max="86400"
                      value={settings.feedSettings.cacheTimeout}
                      onChange={(e) => 
                        setSettings(prev => prev ? {
                          ...prev,
                          feedSettings: { 
                            ...prev.feedSettings, 
                            cacheTimeout: parseInt(e.target.value) || 3600 
                          }
                        } : null)
                      }
                    />
                    <p className="text-sm text-muted-foreground">
                      How long to cache generated feeds
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enable-compression">Enable Compression</Label>
                      <p className="text-sm text-muted-foreground">
                        Compress feeds to reduce bandwidth
                      </p>
                    </div>
                    <Switch
                      id="enable-compression"
                      checked={settings.feedSettings.enableCompression}
                      onCheckedChange={(checked) => 
                        setSettings(prev => prev ? {
                          ...prev,
                          feedSettings: { ...prev.feedSettings, enableCompression: checked }
                        } : null)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="include-inactive">Include Inactive Listings</Label>
                      <p className="text-sm text-muted-foreground">
                        Include draft/inactive listings in feeds
                      </p>
                    </div>
                    <Switch
                      id="include-inactive"
                      checked={settings.feedSettings.includeInactiveListings}
                      onCheckedChange={(checked) => 
                        setSettings(prev => prev ? {
                          ...prev,
                          feedSettings: { ...prev.feedSettings, includeInactiveListings: checked }
                        } : null)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}