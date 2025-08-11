import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { useTenant } from '@/contexts/TenantContext'
import { Trash2, ExternalLink } from 'lucide-react'

interface ShareToken {
  token: string
  type: 'single' | 'selection' | 'catalog'
  title: string
  listingIds: string[]
  createdAt: string
  expiresAt?: string
  isRevoked: boolean
  clickCount?: number
}

interface ListingPreviewSettings {
  enablePublicCatalog: boolean
  requireTokenForCatalog: boolean
  defaultTokenExpiry: string // '7d', '30d', '90d', 'never'
  enableAnalytics: boolean
}

export default function ListingPreviewsSettings() {
  const { tenant } = useTenant()
  const { toast } = useToast()
  
  const [settings, setSettings] = useState<ListingPreviewSettings>({
    enablePublicCatalog: true,
    requireTokenForCatalog: false,
    defaultTokenExpiry: '30d',
    enableAnalytics: true
  })
  const [shareTokens, setShareTokens] = useState<ShareToken[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Mock data for development - replace with actual API calls
  useEffect(() => {
    const mockTokens: ShareToken[] = [
      {
        token: 'abc123xyz',
        type: 'catalog',
        title: 'All Active Listings',
        listingIds: [],
        createdAt: '2024-01-15T10:00:00Z',
        expiresAt: '2024-02-15T10:00:00Z',
        isRevoked: false,
        clickCount: 45
      },
      {
        token: 'def456uvw',
        type: 'selection',
        title: 'Premium RV Collection',
        listingIds: ['rv-001', 'rv-002', 'rv-003'],
        createdAt: '2024-01-10T14:30:00Z',
        expiresAt: '2024-04-10T14:30:00Z',
        isRevoked: false,
        clickCount: 23
      }
    ]
    
    setShareTokens(mockTokens)
    setLoading(false)
  }, [])

  const saveSettings = async () => {
    setSaving(true)
    try {
      // TODO: Save to backend
      // await fetch(`/.netlify/functions/company-settings-crud`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ section: 'listing_previews', settings })
      // })
      
      toast({
        title: 'Settings Saved',
        description: 'Listing preview settings have been updated successfully.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings.',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const revokeToken = async (token: string) => {
    try {
      // TODO: Call revoke API
      // await fetch(`/.netlify/functions/share-link-crud?companyId=${tenant?.id}&token=${token}`, {
      //   method: 'DELETE'
      // })
      
      setShareTokens(tokens => 
        tokens.map(t => t.token === token ? { ...t, isRevoked: true } : t)
      )
      
      toast({
        title: 'Token Revoked',
        description: 'Share link has been revoked and is no longer accessible.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to revoke token.',
        variant: 'destructive'
      })
    }
  }

  const copyShareUrl = async (token: string, type: string) => {
    const baseUrl = window.location.origin
    const url = type === 'single' ? 
      `${baseUrl}/${tenant?.slug}/p/${token}` : 
      `${baseUrl}/${tenant?.slug}/l/${token}`
    
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: 'URL Copied',
        description: 'Share URL has been copied to clipboard.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy URL.',
        variant: 'destructive'
      })
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false
    return new Date() > new Date(expiresAt)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            Loading preview settings...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Listing Previews</CardTitle>
          <CardDescription>
            Control how your listings are shared and accessed publicly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Public Catalog</Label>
                <div className="text-sm text-muted-foreground">
                  Allow public access to your listings catalog at /{tenant?.slug}/listings
                </div>
              </div>
              <Switch
                checked={settings.enablePublicCatalog}
                onCheckedChange={(checked) => 
                  setSettings(s => ({ ...s, enablePublicCatalog: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Token for Catalog</Label>
                <div className="text-sm text-muted-foreground">
                  Require a share token to access the catalog (more private)
                </div>
              </div>
              <Switch
                checked={settings.requireTokenForCatalog}
                onCheckedChange={(checked) => 
                  setSettings(s => ({ ...s, requireTokenForCatalog: checked }))
                }
                disabled={!settings.enablePublicCatalog}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Share Analytics</Label>
                <div className="text-sm text-muted-foreground">
                  Track clicks and engagement on shared links
                </div>
              </div>
              <Switch
                checked={settings.enableAnalytics}
                onCheckedChange={(checked) => 
                  setSettings(s => ({ ...s, enableAnalytics: checked }))
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label>Default Token Expiry</Label>
              <Select
                value={settings.defaultTokenExpiry}
                onValueChange={(value) => 
                  setSettings(s => ({ ...s, defaultTokenExpiry: value }))
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                  <SelectItem value="never">Never expires</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">
                Default expiration time for new share links
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={saveSettings} disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Share Links</CardTitle>
          <CardDescription>
            Manage and monitor your active share links. You can revoke access at any time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {shareTokens.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No share links created yet.</p>
              <p className="text-sm">Share links will appear here when you create them from the listings workspace.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shareTokens.map((shareToken) => (
                  <TableRow key={shareToken.token}>
                    <TableCell className="font-medium">
                      {shareToken.title}
                      {shareToken.listingIds.length > 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {shareToken.listingIds.length} listings
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {shareToken.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(shareToken.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {shareToken.expiresAt ? formatDate(shareToken.expiresAt) : 'Never'}
                    </TableCell>
                    <TableCell>
                      {shareToken.isRevoked ? (
                        <Badge variant="destructive">Revoked</Badge>
                      ) : isExpired(shareToken.expiresAt) ? (
                        <Badge variant="secondary">Expired</Badge>
                      ) : (
                        <Badge variant="default">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {settings.enableAnalytics ? (shareToken.clickCount || 0) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyShareUrl(shareToken.token, shareToken.type)}
                          disabled={shareToken.isRevoked || isExpired(shareToken.expiresAt)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => revokeToken(shareToken.token)}
                          disabled={shareToken.isRevoked || isExpired(shareToken.expiresAt)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}