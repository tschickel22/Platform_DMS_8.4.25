import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { 
  Globe, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Settings,
  Eye,
  Share2
} from 'lucide-react'
import { Site, DomainConfig } from '../types'
import { websiteService } from '@/services/website/service'
import { useToast } from '@/hooks/use-toast'
import { useErrorHandler } from '@/hooks/useErrorHandler'

interface PublishPanelProps {
  site: Site
  onSiteUpdate: (site: Site) => void
}

export default function PublishPanel({ site, onSiteUpdate }: PublishPanelProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [isDomainSaving, setIsDomainSaving] = useState(false)
  const [domainConfig, setDomainConfig] = useState<DomainConfig>({
    type: 'subdomain',
    subdomain: site.slug
  })
  const { toast } = useToast()
  const { handleError } = useErrorHandler()

  const handlePublish = async () => {
    try {
      setIsPublishing(true)
      const result = await websiteService.publishSite(site.id)
      
      if (result.success) {
        toast({
          title: 'Website Published',
          description: 'Your website is now live and accessible to visitors'
        })
        
        // Update site with published status
        const updatedSite = { ...site, isPublished: true, publishedAt: result.publishedAt }
        onSiteUpdate(updatedSite)
      } else {
        throw new Error(result.error || 'Failed to publish website')
      }
    } catch (error) {
      handleError(error, 'publishing website')
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
          title: 'Domain Updated',
          description: result.message
        })
        
        // Update site with domain info
        let domainString = ''
        switch (domainConfig.type) {
          case 'subdomain':
            domainString = `${domainConfig.subdomain}.renterinsight.com`
            break
          case 'custom':
            domainString = domainConfig.customDomain || ''
            break
          case 'subdomain_custom':
            domainString = `${domainConfig.subdomain}.${domainConfig.baseDomain}`
            break
          case 'multi_dealer':
            domainString = `${domainConfig.dealerCode}.${domainConfig.groupDomain}`
            break
        }
        
        const updatedSite = { ...site, domain: domainString }
        onSiteUpdate(updatedSite)
      } else {
        throw new Error(result.message || 'Failed to update domain')
      }
    } catch (error) {
      handleError(error, 'updating domain')
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
    if (site.domain) {
      return `https://${site.domain}`
    }
    return `${window.location.origin}/s/${site.slug}/`
  }

  const getPublishStatus = () => {
    if (site.isPublished) {
      return {
        icon: CheckCircle,
        text: 'Published',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      }
    } else {
      return {
        icon: Clock,
        text: 'Draft',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50'
      }
    }
  }

  const status = getPublishStatus()
  const StatusIcon = status.icon

  return (
    <div className="space-y-6">
      {/* Publish Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StatusIcon className={`h-5 w-5 ${status.color}`} />
            Publication Status
          </CardTitle>
          <CardDescription>
            Current status of your website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center gap-3 p-3 rounded-lg ${status.bgColor}`}>
            <StatusIcon className={`h-4 w-4 ${status.color}`} />
            <div className="flex-1">
              <p className={`font-medium ${status.color}`}>{status.text}</p>
              <p className="text-sm text-muted-foreground">
                {site.isPublished 
                  ? `Published ${site.publishedAt ? new Date(site.publishedAt).toLocaleDateString() : 'recently'}`
                  : 'Your website is not yet published'
                }
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handlePublish} 
              disabled={isPublishing}
              className="flex-1"
            >
              <Globe className="h-4 w-4 mr-2" />
              {isPublishing ? 'Publishing...' : site.isPublished ? 'Republish' : 'Publish Website'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.open(getPreviewUrl(), '_blank')}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Website URLs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Website URLs
          </CardTitle>
          <CardDescription>
            Access your published website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Preview URL */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Preview URL</Label>
            <div className="flex items-center gap-2">
              <Input 
                value={getPreviewUrl()} 
                readOnly 
                className="flex-1 bg-muted"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => copyToClipboard(getPreviewUrl())}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Custom Domain */}
          {site.domain && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Custom Domain</Label>
              <div className="flex items-center gap-2">
                <Input 
                  value={`https://${site.domain}`} 
                  readOnly 
                  className="flex-1 bg-muted"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(`https://${site.domain}`)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Domain Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Domain Settings
          </CardTitle>
          <CardDescription>
            Configure your website address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
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
                <SelectItem value="subdomain_custom">Subdomain + Custom</SelectItem>
                <SelectItem value="multi_dealer">Multi-Dealer</SelectItem>
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
                Make sure to point your domain's DNS to our servers
              </p>
            </div>
          )}

          {domainConfig.type === 'subdomain_custom' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Subdomain</Label>
                <Input
                  value={domainConfig.subdomain || ''}
                  onChange={(e) => setDomainConfig({ ...domainConfig, subdomain: e.target.value })}
                  placeholder="dealer"
                />
              </div>
              <div className="space-y-2">
                <Label>Base Domain</Label>
                <Input
                  value={domainConfig.baseDomain || ''}
                  onChange={(e) => setDomainConfig({ ...domainConfig, baseDomain: e.target.value })}
                  placeholder="yourcompany.com"
                />
              </div>
            </div>
          )}

          {domainConfig.type === 'multi_dealer' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Dealer Code</Label>
                <Input
                  value={domainConfig.dealerCode || ''}
                  onChange={(e) => setDomainConfig({ ...domainConfig, dealerCode: e.target.value })}
                  placeholder="dealer1"
                />
              </div>
              <div className="space-y-2">
                <Label>Group Domain</Label>
                <Input
                  value={domainConfig.groupDomain || ''}
                  onChange={(e) => setDomainConfig({ ...domainConfig, groupDomain: e.target.value })}
                  placeholder="dealergroup.com"
                />
              </div>
            </div>
          )}

          <Button 
            onClick={handleDomainSave} 
            disabled={isDomainSaving}
            className="w-full"
          >
            {isDomainSaving ? 'Saving...' : 'Save Domain Settings'}
          </Button>
        </CardContent>
      </Card>

      {/* SEO & Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>SEO & Analytics</CardTitle>
          <CardDescription>
            Search engine optimization and tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Search Engine Indexing</p>
              <p className="text-sm text-muted-foreground">Allow search engines to index your site</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Analytics Tracking</p>
              <p className="text-sm text-muted-foreground">Track visitor behavior and performance</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="pt-2">
            <Button variant="outline" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Configure SEO Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Share & Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share & Export
          </CardTitle>
          <CardDescription>
            Share your website or export for external hosting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Share2 className="h-4 w-4 mr-2" />
            Generate Share Link
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            <ExternalLink className="h-4 w-4 mr-2" />
            Export Static Files
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}