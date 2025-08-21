import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Globe, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Settings,
  Loader2
} from 'lucide-react'
import { Site, DomainConfig } from '../types'
import { websiteService } from '@/services/website/service'
import { useToast } from '@/hooks/use-toast'
import { useErrorHandler } from '@/hooks/useErrorHandler'

interface PublishPanelProps {
  site: Site
  onSiteUpdate: (updates: Partial<Site>) => void
  mode?: 'platform' | 'company'
}

export default function PublishPanel({ site, onSiteUpdate, mode = 'platform' }: PublishPanelProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishResult, setPublishResult] = useState<{ success: boolean; previewUrl?: string; publishedAt?: string } | null>(null)
  const [domainConfig, setDomainConfig] = useState<DomainConfig>({
    type: 'subdomain',
    subdomain: site.slug || ''
  })
  const [isDomainSaving, setIsDomainSaving] = useState(false)
  const [domainResult, setDomainResult] = useState<{ success: boolean; message: string } | null>(null)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  
  const { toast } = useToast()
  const { handleError } = useErrorHandler()

  const handlePreview = () => {
    try {
      // Store site data in sessionStorage for the preview window
      const previewKey = `wb2:preview:${site.slug}`
      sessionStorage.setItem(previewKey, JSON.stringify(site))
      
      // Also encode site data in URL as backup
      const encodedData = encodeURIComponent(JSON.stringify(site))
      const previewUrl = `/s/${site.slug}/?data=${encodedData}`
      
      // Open preview in new window
      const previewWindow = window.open(previewUrl, '_blank', 'width=1200,height=800')
      
      if (!previewWindow) {
        toast({
          title: 'Preview Blocked',
          description: 'Please allow popups for this site to open the preview.',
          variant: 'destructive'
        })
      } else {
        toast({
          title: 'Preview Opened',
          description: 'Your website preview has opened in a new window.'
        })
      }
    } catch (error) {
      console.error('Preview error:', error)
      toast({
        title: 'Preview Error',
        description: 'Failed to open preview. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handlePublish = async () => {
    try {
      setIsPublishing(true)
      const result = await websiteService.publishSite(site.id)
      setPublishResult(result)
      
      if (result.success) {
        toast({
          title: 'Published Successfully',
          description: 'Your website is now live!'
        })
      }
    } catch (error) {
      handleError(error, 'publishing site')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleDomainSave = async () => {
    try {
      setIsDomainSaving(true)
      const result = await websiteService.setDomain(site.id, domainConfig)
      setDomainResult(result)
      
      if (result.success) {
        toast({
          title: 'Domain Saved',
          description: result.message
        })
      } else {
        toast({
          title: 'Domain Error',
          description: result.message,
          variant: 'destructive'
        })
      }
    } catch (error) {
      handleError(error, 'saving domain')
    } finally {
      setIsDomainSaving(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedUrl(text)
      setTimeout(() => setCopiedUrl(null), 2000)
      toast({
        title: 'Copied',
        description: 'URL copied to clipboard'
      })
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy URL to clipboard',
        variant: 'destructive'
      })
    }
  }

  const getPreviewUrl = () => {
    return `${window.location.origin}/s/${site.slug}/`
  }

  const getDomainUrl = () => {
    switch (domainConfig.type) {
      case 'subdomain':
        return `${domainConfig.subdomain}.renterinsight.com`
      case 'custom':
        return domainConfig.customDomain
      case 'subdomain_custom':
        return `${domainConfig.subdomain}.${domainConfig.baseDomain}`
      case 'multi_dealer':
        return `${domainConfig.dealerCode}.${domainConfig.groupDomain}`
      default:
        return ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Preview
          </CardTitle>
          <CardDescription>
            Preview your website before publishing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-mono text-muted-foreground">
              {getPreviewUrl()}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(getPreviewUrl())}
              className="ml-auto"
            >
              {copiedUrl === getPreviewUrl() ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <Button onClick={handlePreview} className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            Open Preview
          </Button>
        </CardContent>
      </Card>

      {/* Publish Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Publish Website
          </CardTitle>
          <CardDescription>
            Make your website live and accessible to visitors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {publishResult?.success ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Published Successfully</span>
              </div>
              
              {publishResult.previewUrl && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-md">
                  <Globe className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-mono text-green-700">
                    {publishResult.previewUrl}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(publishResult.previewUrl!)}
                    className="ml-auto"
                  >
                    {copiedUrl === publishResult.previewUrl ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(publishResult.previewUrl, '_blank')}
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Live Site
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPublishResult(null)}
                >
                  Publish Again
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              onClick={handlePublish} 
              disabled={isPublishing}
              className="w-full"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4 mr-2" />
                  Publish Website
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Domain Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Website Address
          </CardTitle>
          <CardDescription>
            Configure your website's domain and URL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label htmlFor="domain-type">Domain Type</Label>
              <Select
                value={domainConfig.type}
                onValueChange={(value: any) => setDomainConfig({ ...domainConfig, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subdomain">Subdomain (free)</SelectItem>
                  <SelectItem value="custom">Custom Domain</SelectItem>
                  {mode === 'platform' && (
                    <>
                      <SelectItem value="subdomain_custom">Custom Subdomain</SelectItem>
                      <SelectItem value="multi_dealer">Multi-Dealer</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {domainConfig.type === 'subdomain' && (
              <div>
                <Label htmlFor="subdomain">Subdomain</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="subdomain"
                    value={domainConfig.subdomain}
                    onChange={(e) => setDomainConfig({ ...domainConfig, subdomain: e.target.value })}
                    placeholder="your-site"
                  />
                  <span className="text-sm text-muted-foreground">.renterinsight.com</span>
                </div>
              </div>
            )}

            {domainConfig.type === 'custom' && (
              <div>
                <Label htmlFor="custom-domain">Custom Domain</Label>
                <Input
                  id="custom-domain"
                  value={domainConfig.customDomain || ''}
                  onChange={(e) => setDomainConfig({ ...domainConfig, customDomain: e.target.value })}
                  placeholder="www.yourdomain.com"
                />
              </div>
            )}

            {domainConfig.type === 'subdomain_custom' && (
              <>
                <div>
                  <Label htmlFor="custom-subdomain">Subdomain</Label>
                  <Input
                    id="custom-subdomain"
                    value={domainConfig.subdomain}
                    onChange={(e) => setDomainConfig({ ...domainConfig, subdomain: e.target.value })}
                    placeholder="your-site"
                  />
                </div>
                <div>
                  <Label htmlFor="base-domain">Base Domain</Label>
                  <Input
                    id="base-domain"
                    value={domainConfig.baseDomain || ''}
                    onChange={(e) => setDomainConfig({ ...domainConfig, baseDomain: e.target.value })}
                    placeholder="yourdomain.com"
                  />
                </div>
              </>
            )}

            {domainConfig.type === 'multi_dealer' && (
              <>
                <div>
                  <Label htmlFor="dealer-code">Dealer Code</Label>
                  <Input
                    id="dealer-code"
                    value={domainConfig.dealerCode || ''}
                    onChange={(e) => setDomainConfig({ ...domainConfig, dealerCode: e.target.value })}
                    placeholder="dealer123"
                  />
                </div>
                <div>
                  <Label htmlFor="group-domain">Group Domain</Label>
                  <Input
                    id="group-domain"
                    value={domainConfig.groupDomain || ''}
                    onChange={(e) => setDomainConfig({ ...domainConfig, groupDomain: e.target.value })}
                    placeholder="dealergroup.com"
                  />
                </div>
              </>
            )}
          </div>

          {domainResult && (
            <div className={`flex items-center gap-2 p-3 rounded-md ${
              domainResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {domainResult.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span className="text-sm">{domainResult.message}</span>
            </div>
          )}

          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-mono text-muted-foreground">
              {getDomainUrl()}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(`https://${getDomainUrl()}`)}
              className="ml-auto"
            >
              {copiedUrl === `https://${getDomainUrl()}` ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <Button 
            onClick={handleDomainSave} 
            disabled={isDomainSaving || !getDomainUrl()}
            variant="outline"
            className="w-full"
          >
            {isDomainSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Settings className="h-4 w-4 mr-2" />
                Save Website Address
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Site Info */}
      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Pages</span>
            <Badge variant="secondary">{site.pages?.length || 0}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Blocks</span>
            <Badge variant="secondary">
              {site.pages?.reduce((total, page) => total + (page.blocks?.length || 0), 0) || 0}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Last Updated</span>
            <span className="text-sm text-muted-foreground">
              {site.updatedAt ? new Date(site.updatedAt).toLocaleDateString() : 'Never'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}