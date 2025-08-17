import React, { useState } from 'react'
import { Site, Version, PublishResult, DomainConfig } from '../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Globe, 
  Upload, 
  ExternalLink, 
  Copy, 
  Download, 
  History,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'
import { useSite } from '../hooks/useSite'
import { useToast } from '@/hooks/use-toast'

interface PublishPanelProps {
  site: Site
  onUpdateSite: (updates: Partial<Site>) => void
}

export function PublishPanel({ site, onUpdateSite }: PublishPanelProps) {
  const { publishSite, setDomain } = useSite()
  const { toast } = useToast()
  const [publishing, setPublishing] = useState(false)
  const [publishResult, setPublishResult] = useState<PublishResult | null>(null)
  const [showDomainDialog, setShowDomainDialog] = useState(false)
  const [domainConfig, setDomainConfig] = useState<DomainConfig>({
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-4 top-4"
            onClick={onClose}
          >
    subdomain: site.slug
  })

  const handlePublish = async () => {
    setPublishing(true)
    try {
      const result = await publishSite(site.id)
      setPublishResult(result)
    } finally {
      setPublishing(false)
    }
  }

  const handleDomainMapping = async () => {
    const result = await setDomain(site.id, domainConfig)
    if (result.success) {
      setShowDomainDialog(false)
      // Update site with domain info
      const domainString = generateDomainString(domainConfig)
      onUpdateSite({ domain: domainString })
    }
  }

  const generateDomainString = (config: DomainConfig): string => {
    switch (config.type) {
      case 'subdomain':
        return `${config.subdomain}.renterinsight.com`
      case 'custom':
        return config.customDomain || ''
      case 'subdomain_custom':
        return `${config.subdomain}.${config.baseDomain}`
      case 'multi_dealer':
        return `${config.dealerCode}.${config.groupDomain}`
      default:
        return ''
    }
  }

  const getPreviewUrl = () => {
    return `${window.location.origin}/s/${site.slug}/`
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: 'Copied',
      description: 'URL copied to clipboard'
    })
  }

  const exportSite = () => {
    const dataStr = JSON.stringify(site, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${site.slug}-export.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Globe className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Publishing & Domains</h3>
      </div>

      <Tabs defaultValue="publish" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="publish">Publish</TabsTrigger>
          <TabsTrigger value="domains">Website Address</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
        </TabsList>

        <TabsContent value="publish" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Publish to Netlify</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Current Status</h4>
                  <p className="text-sm text-muted-foreground">
                    {publishResult?.success ? 'Published' : 'Not published'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {publishResult?.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              <Button 
                onClick={handlePublish} 
                disabled={publishing}
                className="w-full"
              >
                {publishing ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Publish Website
                  </>
                )}
              </Button>

              {publishResult && (
                <div className={`p-4 rounded-lg border ${
                  publishResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {publishResult.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      publishResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {publishResult.success ? 'Published Successfully' : 'Publish Failed'}
                    </span>
                  </div>
                  
                  {publishResult.success && publishResult.previewUrl && (
                    <div className="space-y-2">
                      <p className="text-sm text-green-700">
                        Your website is now live!
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(publishResult.previewUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Preview
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyUrl(publishResult.previewUrl!)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy URL
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {!publishResult.success && publishResult.error && (
                    <p className="text-sm text-red-700">
                      {publishResult.error}
                    </p>
                  )}
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Preview URL</h4>
                <div className="flex items-center space-x-2">
                  <Input
                    value={getPreviewUrl()}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(getPreviewUrl(), '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyUrl(getPreviewUrl())}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Preview URL (always available)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domains" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Website Address & Publishing</CardTitle>
                <Dialog open={showDomainDialog} onOpenChange={setShowDomainDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Website Address Configuration</DialogTitle>
                    </DialogHeader>
                    <DomainConfigForm
                      config={domainConfig}
                      onConfigChange={setDomainConfig}
                      onSave={handleDomainMapping}
                      onCancel={() => setShowDomainDialog(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {site.domain ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Domain Configured</span>
                  </div>
                  <p className="text-sm text-green-700 mb-2">
                    Your website is available at: <strong>{site.domain}</strong>
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://${site.domain}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyUrl(`https://${site.domain}`)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy URL
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">No Custom Domain</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Configure a custom domain to make your website accessible at your own URL.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Version History</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportSite}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <History className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Current Version</p>
                      <p className="text-sm text-muted-foreground">
                        Last updated: {new Date(site.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="default">Current</Badge>
                </div>
                
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-8 w-8 mx-auto mb-2" />
                  <p>Version history will appear here</p>
                  <p className="text-sm">Versions are created automatically when you publish</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface DomainConfigFormProps {
  config: DomainConfig
  onConfigChange: (config: DomainConfig) => void
  onSave: () => void
  onCancel: () => void
}

function DomainConfigForm({ config, onConfigChange, onSave, onCancel }: DomainConfigFormProps) {
  const updateConfig = (updates: Partial<DomainConfig>) => {
    onConfigChange({ ...config, ...updates })
  }

  const getExampleUrl = () => {
    switch (config.type) {
      case 'subdomain':
        return `https://${config.subdomain || 'your-site'}.renterinsight.com`
      case 'custom':
        return `https://${config.customDomain || 'www.yoursite.com'}`
      case 'subdomain_custom':
        return `https://${config.subdomain || 'sales'}.${config.baseDomain || 'yoursite.com'}`
      case 'multi_dealer':
        return `https://${config.dealerCode || 'denver'}.${config.groupDomain || 'dealers.yoursite.com'}`
      default:
        return ''
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Label>Website address type</Label>
        <div className="space-y-3 mt-2">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              checked={config.type === 'subdomain'}
              onChange={() => updateConfig({ type: 'subdomain' })}
              className="w-4 h-4"
            />
            <div>
              <span className="font-medium">Use a subdomain on renterinsight.com</span>
              <p className="text-sm text-muted-foreground">Easiest option, no DNS setup required</p>
            </div>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              checked={config.type === 'custom'}
              onChange={() => updateConfig({ type: 'custom' })}
              className="w-4 h-4"
            />
            <div>
              <span className="font-medium">Use your own domain</span>
              <p className="text-sm text-muted-foreground">Requires DNS configuration</p>
            </div>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              checked={config.type === 'subdomain_custom'}
              onChange={() => updateConfig({ type: 'subdomain_custom' })}
              className="w-4 h-4"
            />
            <div>
              <span className="font-medium">Use a subdomain on your domain</span>
              <p className="text-sm text-muted-foreground">Like sales.yoursite.com</p>
            </div>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              checked={config.type === 'multi_dealer'}
              onChange={() => updateConfig({ type: 'multi_dealer' })}
              className="w-4 h-4"
            />
            <div>
              <span className="font-medium">Multi-dealer (group) subdomain</span>
              <p className="text-sm text-muted-foreground">For dealer networks</p>
            </div>
          </label>
        </div>
      </div>

      {/* Configuration Fields */}
      <div className="space-y-4">
        {config.type === 'subdomain' && (
          <div>
            <Label htmlFor="subdomain">Subdomain name</Label>
            <Input
              id="subdomain"
              value={config.subdomain || ''}
              onChange={(e) => updateConfig({ subdomain: e.target.value })}
              placeholder="pinetop-homes"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Your website will be available at <strong>{getExampleUrl()}</strong>
            </p>
          </div>
        )}

        {config.type === 'custom' && (
          <div>
            <Label htmlFor="custom-domain">Custom domain</Label>
            <Input
              id="custom-domain"
              value={config.customDomain || ''}
              onChange={(e) => updateConfig({ customDomain: e.target.value })}
              placeholder="www.pinetophomes.com"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Point this domain's DNS (CNAME) to Netlify, then click Save & Map.
            </p>
          </div>
        )}

        {config.type === 'subdomain_custom' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="subdomain-custom">Subdomain</Label>
              <Input
                id="subdomain-custom"
                value={config.subdomain || ''}
                onChange={(e) => updateConfig({ subdomain: e.target.value })}
                placeholder="sales"
              />
            </div>
            <div>
              <Label htmlFor="base-domain">Base domain</Label>
              <Input
                id="base-domain"
                value={config.baseDomain || ''}
                onChange={(e) => updateConfig({ baseDomain: e.target.value })}
                placeholder="acme.com"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Result: <strong>{getExampleUrl()}</strong> (set a CNAME to Netlify, then Save & Map)
            </p>
          </div>
        )}

        {config.type === 'multi_dealer' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="dealer-code">Dealer code</Label>
              <Input
                id="dealer-code"
                value={config.dealerCode || ''}
                onChange={(e) => updateConfig({ dealerCode: e.target.value })}
                placeholder="denver"
              />
            </div>
            <div>
              <Label htmlFor="group-domain">Group domain</Label>
              <Input
                id="group-domain"
                value={config.groupDomain || ''}
                onChange={(e) => updateConfig({ groupDomain: e.target.value })}
                placeholder="dealers.acme.com"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Result: <strong>{getExampleUrl()}</strong>
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>
          Save & Map
        </Button>
      </div>
    </div>
  )
}