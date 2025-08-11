import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Globe, 
  Lock, 
  Clock, 
  Link, 
  Eye, 
  Calendar, 
  BarChart3,
  Trash,
  Copy,
  ExternalLink
} from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'

interface ShareToken {
  id: string
  title: string
  type: 'catalog' | 'selection' | 'single'
  url: string
  shortUrl: string
  createdAt: string
  expiresAt?: string
  isActive: boolean
  views: number
  clicks: number
}

export default function ListingPreviewsSettings() {
  const { tenant } = useTenant()
  const [settings, setSettings] = useState({
    enablePublicCatalog: true,
    requireTokenAccess: false,
    defaultTokenExpiry: 30, // days
    allowGuestViewing: true,
    enableShareAnalytics: true,
    watermarkEnabled: false
  })

  const [tokens, setTokens] = useState<ShareToken[]>([
    {
      id: 'token_1',
      title: 'Main Catalog',
      type: 'catalog',
      url: 'https://yourcompany.listings.com/catalog',
      shortUrl: 'https://short.ly/abc123',
      createdAt: '2024-01-10T10:30:00Z',
      expiresAt: '2024-02-10T10:30:00Z',
      isActive: true,
      views: 1247,
      clicks: 89
    },
    {
      id: 'token_2',
      title: 'RV Selection',
      type: 'selection',
      url: 'https://yourcompany.listings.com/selection/rv',
      shortUrl: 'https://short.ly/def456',
      createdAt: '2024-01-15T14:20:00Z',
      isActive: true,
      views: 456,
      clicks: 23
    },
    {
      id: 'token_3',
      title: 'Premium MH Listing',
      type: 'single',
      url: 'https://yourcompany.listings.com/listing/premium-mh',
      shortUrl: 'https://short.ly/ghi789',
      createdAt: '2024-01-20T09:15:00Z',
      expiresAt: '2024-01-27T09:15:00Z',
      isActive: false,
      views: 89,
      clicks: 7
    }
  ])

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleRevokeToken = (tokenId: string) => {
    if (confirm('Are you sure you want to revoke this share token?')) {
      setTokens(prev => prev.map(token => 
        token.id === tokenId ? { ...token, isActive: false } : token
      ))
    }
  }

  const handleDeleteToken = (tokenId: string) => {
    if (confirm('Are you sure you want to delete this share token?')) {
      setTokens(prev => prev.filter(token => token.id !== tokenId))
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getTokenTypeColor = (type: string) => {
    switch (type) {
      case 'catalog': return 'bg-blue-100 text-blue-800'
      case 'selection': return 'bg-green-100 text-green-800'
      case 'single': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const isExpired = (expiresAt?: string) => {
    return expiresAt ? new Date() > new Date(expiresAt) : false
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Listing Previews</h2>
        <p className="text-gray-600">Configure public catalog access and manage share tokens</p>
      </div>

      {/* Public Catalog Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Public Catalog Settings
          </CardTitle>
          <CardDescription>
            Control how your listings are publicly accessible
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable public catalog</Label>
                  <p className="text-sm text-gray-600">
                    Allow public access to your listing catalog
                  </p>
                </div>
                <Switch
                  checked={settings.enablePublicCatalog}
                  onCheckedChange={(checked) => handleSettingChange('enablePublicCatalog', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Require token for access</Label>
                  <p className="text-sm text-gray-600">
                    Require share tokens to view listings
                  </p>
                </div>
                <Switch
                  checked={settings.requireTokenAccess}
                  onCheckedChange={(checked) => handleSettingChange('requireTokenAccess', checked)}
                  disabled={!settings.enablePublicCatalog}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow guest viewing</Label>
                  <p className="text-sm text-gray-600">
                    Allow non-registered users to view listings
                  </p>
                </div>
                <Switch
                  checked={settings.allowGuestViewing}
                  onCheckedChange={(checked) => handleSettingChange('allowGuestViewing', checked)}
                  disabled={!settings.enablePublicCatalog}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable share analytics</Label>
                  <p className="text-sm text-gray-600">
                    Track views and clicks on shared listings
                  </p>
                </div>
                <Switch
                  checked={settings.enableShareAnalytics}
                  onCheckedChange={(checked) => handleSettingChange('enableShareAnalytics', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Watermark images</Label>
                  <p className="text-sm text-gray-600">
                    Add company branding to shared images
                  </p>
                </div>
                <Switch
                  checked={settings.watermarkEnabled}
                  onCheckedChange={(checked) => handleSettingChange('watermarkEnabled', checked)}
                />
              </div>

              <div>
                <Label htmlFor="defaultExpiry">Default token expiry (days)</Label>
                <Input
                  id="defaultExpiry"
                  type="number"
                  value={settings.defaultTokenExpiry}
                  onChange={(e) => handleSettingChange('defaultTokenExpiry', parseInt(e.target.value) || 30)}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Default expiration for new share tokens
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Public URLs */}
      {settings.enablePublicCatalog && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Public URLs
            </CardTitle>
            <CardDescription>
              Direct access URLs for your public listings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Main Catalog URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={`https://${tenant?.slug || 'yourcompany'}.listings.com/catalog`}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(`https://${tenant?.slug || 'yourcompany'}.listings.com/catalog`)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(`https://${tenant?.slug || 'yourcompany'}.listings.com/catalog`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Individual Listing URL Pattern</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={`https://${tenant?.slug || 'yourcompany'}.listings.com/listing/{listingId}`}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(`https://${tenant?.slug || 'yourcompany'}.listings.com/listing/{listingId}`)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Share Tokens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Active Share Tokens
          </CardTitle>
          <CardDescription>
            Manage existing share tokens and their analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tokens.length === 0 ? (
            <div className="text-center py-12">
              <Lock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No share tokens</h3>
              <p className="text-gray-600">
                Share tokens will appear here when you create them from the listings page
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Analytics</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokens.map((token) => (
                  <TableRow key={token.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{token.title}</p>
                        <p className="text-sm text-gray-600 font-mono">{token.shortUrl}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTokenTypeColor(token.type)}>
                        {token.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {token.isActive ? (
                          isExpired(token.expiresAt) ? (
                            <Badge variant="outline" className="text-red-600 border-red-200">
                              <Clock className="h-3 w-3 mr-1" />
                              Expired
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-green-600 border-green-200">
                              Active
                            </Badge>
                          )
                        ) : (
                          <Badge variant="outline" className="text-gray-600">
                            Revoked
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        {new Date(token.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {token.expiresAt ? (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="h-3 w-3" />
                          {new Date(token.expiresAt).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {settings.enableShareAnalytics ? (
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {token.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <BarChart3 className="h-3 w-3" />
                            {token.clicks}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(token.shortUrl)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        {token.isActive && !isExpired(token.expiresAt) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevokeToken(token.id)}
                          >
                            <Lock className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteToken(token.id)}
                        >
                          <Trash className="h-3 w-3" />
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

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button size="lg">
          Save Preview Settings
        </Button>
      </div>
    </div>
  )
}