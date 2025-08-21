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
  Zap
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
  const [publishResult, setPublishResult] = useState<any>(null)
  const [domainConfig, setDomainConfig] = useState<DomainConfig>({
    type: 'subdomain',
    subdomain: site.slug || ''
  })
  const [isDomainSaving, setIsDomainSaving] = useState(false)
  const { toast } = useToast()
  const { handleError } = useErrorHandler()

  const handlePreview = () => {
    try {
      // Store site data in sessionStorage for preview
      const previewKey = `wb2:preview:${site.slug}`
      sessionStorage.setItem(previewKey, JSON.stringify(site))
      
      // Open preview in new tab using the internal preview route
      const previewUrl = `/s/${site.slug}/`
      window.open(previewUrl, '_blank', 'width=1200,height=800')
      
      toast({
        title: 'Preview Opened',
        description: 'Your website preview has opened in a new tab.'
      })
    } catch (error) {
      console.error('Preview error:', error)
      handleError(error, 'opening preview')
    }
  }

  const handlePublish = async () => {
    try {
      setIsPublishing(true)
      
      // Store the site data for preview access
      const previewKey = `wb2:preview:${site.slug}`
      sessionStorage.setItem(previewKey, JSON.stringify(site))
      
      const result = await websiteService.publishSite(site.id)
      setPublishResult(result)
      
      toast({
        title: 'Published Successfully',
        description: 'Your website has been published and is now live.'
      })
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
      
      if (result.success) {
        toast({
          title: 'Domain Saved',
          description: result.message
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      handleError(error, 'saving domain')
    } finally {
      setIsDomainSaving(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied',
        description: 'URL copied to clipboard'
      })
    })
  }

  const getPreviewUrl = () => {
    return `${window.location.origin}/s/${site.slug}/`
  }

  const getPublishedUrl = () => {
    if (site.domain) {
      return `https://${site.domain}`
    }
    return `${window.location.origin}/s/${site.slug}/`
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
            Test your website before publishing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {getPreviewUrl()}
              </p>
              <p className="text-xs text-muted-foreground">
                Preview URL
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(getPreviewUrl())}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={handlePreview} 
            className="w-full"
            variant="outline"
          >
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
          {publishResult ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Published Successfully</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-800 truncate">
                    {getPublishedUrl()}
                  </p>
                  <p className="text-xs text-green-600">
                    Published at {new Date(publishResult.publishedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(getPublishedUrl())}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(getPublishedUrl(), '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Button 
              onClick={handlePublish} 
              disabled={isPublishing}
              className="w-full"
            >
              <Globe className="h-4 w-4 mr-2" />
              {isPublishing ? 'Publishing...' : 'Publish Website'}
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
            <Label>Domain Type</Label>
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
              </SelectContent>
            </Select>
          </div>

          {domainConfig.type === 'subdomain' && (
            <div className="space-y-2">
              <Label>Subdomain</Label>
              <div className="flex items-center">
                <Input
                  value={domainConfig.subdomain || ''}
                  onChange={(e) => setDomainConfig({ ...domainConfig, subdomain: e.target.value })}
                  placeholder="your-site"
                  className="rounded-r-none"
                />
                <div className="px-3 py-2 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">
                  .renterinsight.com
                </div>
              </div>
            </div>
          )}

          {domainConfig.type === 'custom' && (
            <div className="space-y-2">
              <Label>Custom Domain</Label>
              <Input
                value={domainConfig.customDomain || ''}
                onChange={(e) => setDomainConfig({ ...domainConfig, customDomain: e.target.value })}
                placeholder="www.yoursite.com"
              />
              <p className="text-xs text-muted-foreground">
                You'll need to configure DNS settings after saving
              </p>
            </div>
          )}

          <Button 
            onClick={handleDomainSave}
            disabled={isDomainSaving}
            variant="outline"
            className="w-full"
          >
            {isDomainSaving ? 'Saving...' : 'Save Website Address'}
          </Button>
        </CardContent>
      </Card>

      {/* Site Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Site Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Pages</span>
            <Badge variant="outline">{site.pages?.length || 0}</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Total Blocks</span>
            <Badge variant="outline">
              {site.pages?.reduce((total, page) => total + (page.blocks?.length || 0), 0) || 0}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Theme</span>
            <Badge variant="outline">
              {site.theme?.primaryColor ? 'Custom' : 'Default'}
            </Badge>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Status</span>
            <Badge variant={publishResult ? 'default' : 'secondary'}>
              {publishResult ? 'Published' : 'Draft'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}