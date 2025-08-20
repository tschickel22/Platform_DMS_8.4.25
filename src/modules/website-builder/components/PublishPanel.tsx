import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Globe,
  Upload,
  Link as LinkIcon,
  ExternalLink,
  CheckCircle,
  Clock,
  Eye,
  Share2,
  Copy,
  Search,
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Site, DomainConfig } from '../types'
import { useToast } from '@/hooks/use-toast'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { websiteService } from '@/services/website/service'

interface PublishPanelProps {
  site: Site
  onSiteUpdate: (site: Site) => void
}

export default function PublishPanel({ site, onSiteUpdate }: PublishPanelProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [isDomainSaving, setIsDomainSaving] = useState(false)
  const [domainConfig, setDomainConfig] = useState<DomainConfig>({
    type: 'subdomain',
    subdomain: site.slug,
  })
  const [seoOpen, setSeoOpen] = useState(false)
  const [seoData, setSeoData] = useState({
    title: site.seo?.siteDefaults?.title || site.name,
    description: site.seo?.siteDefaults?.description || '',
    socialImageUrl: site?.seo?.siteDefaults?.ogImageUrl || '',
    ogImageUrl: site.seo?.siteDefaults?.ogImageUrl || '',
    robots: site.seo?.siteDefaults?.robots || 'index, follow',
  })
  const [imageUploadMode, setImageUploadMode] = useState<'url' | 'upload'>('url')
  const [uploading, setUploading] = useState(false)

  const { toast } = useToast()
  const { handleError } = useErrorHandler()

  const handlePublish = async () => {
    try {
      setIsPublishing(true)
      const result = await websiteService.publishSite(site.id)

      if (!result?.success) throw new Error(result?.error || 'Failed to publish website')

      toast({ title: 'Website Published', description: 'Your website is now live and accessible to visitors' })

      const updatedSite = { ...site, isPublished: true, publishedAt: result.publishedAt }
      onSiteUpdate(updatedSite)
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
      if (!result?.success) throw new Error(result?.message || 'Failed to update domain')

      toast({ title: 'Domain Updated', description: result.message })

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
      onSiteUpdate({ ...site, domain: domainString })
    } catch (error) {
      handleError(error, 'updating domain')
    } finally {
      setIsDomainSaving(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: 'Copied', description: 'URL copied to clipboard' })
    })
  }

  const getPreviewUrl = () => (site.domain ? `https://${site.domain}` : `${window.location.origin}/s/${site.slug}/`)

  const getPublishStatus = () =>
    site.isPublished
      ? { icon: CheckCircle, text: 'Published', color: 'text-green-600', bgColor: 'bg-green-50' }
      : { icon: Clock, text: 'Draft', color: 'text-yellow-600', bgColor: 'bg-yellow-50' }

  // Save SEO using updateSite (no updateSeoSettings method required)
  const handleSeoSave = async () => {
    try {
      const updatedSite: Site = {
        ...site,
        seo: {
          ...(site.seo || {}),
          siteDefaults: {
            ...(site.seo?.siteDefaults || {}),
            title: seoData.title,
            description: seoData.description,
            ogImageUrl: seoData.ogImageUrl,
            robots: seoData.robots,
          },
        },
      }

      // optimistic UI update
      onSiteUpdate(updatedSite)

      await websiteService.updateSite(site.id, updatedSite)

      toast({ title: 'SEO Settings Updated', description: 'Your SEO settings have been saved successfully' })
      setSeoOpen(false)
    } catch (error) {
      handleError(error, 'updating SEO settings')
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      // TODO: replace with real upload
      const uploadedUrl = 'uploaded-image-url'
      setSeoData((prev) => ({ ...prev, socialImageUrl: uploadedUrl, ogImageUrl: uploadedUrl }))
    } catch (error) {
      handleError(error, 'uploading image')
    } finally {
      setUploading(false)
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
          <CardDescription>Current status of your website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center gap-3 p-3 rounded-lg ${status.bgColor}`}>
            <StatusIcon className={`h-4 w-4 ${status.color}`} />
            <div className="flex-1">
              <p className={`font-medium ${status.color}`}>{status.text}</p>
              <p className="text-sm text-muted-foreground">
                {site.isPublished
                  ? `Published ${site.publishedAt ? new Date(site.publishedAt).toLocaleDateString() : 'recently'}`
                  : 'Your website is not yet published'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handlePublish} disabled={isPublishing} className="flex-1">
              <Globe className="h-4 w-4 mr-2" />
              {isPublishing ? 'Publishing...' : site.isPublished ? 'Republish' : 'Publish Website'}
            </Button>

            <Button variant="outline" onClick={() => window.open(getPreviewUrl(), '_blank')}>
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
          <CardDescription>Access your published website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Preview URL */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Preview URL</Label>
            <div className="flex items-center gap-2">
              <Input value={getPreviewUrl()} readOnly className="flex-1 bg-muted" />
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(getPreviewUrl())}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Custom Domain */}
          {site.domain && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Custom Domain</Label>
              <div className="flex items-center gap-2">
                <Input value={`https://${site.domain}`} readOnly className="flex-1 bg-muted" />
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(`https://${site.domain}`)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
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

          <Button onClick={handleDomainSave} disabled={isDomainSaving} className="w-full">
            {isDomainSaving ? 'Saving...' : 'Save Domain Settings'}
          </Button>
        </CardContent>
      </Card>

      {/* SEO & Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>SEO & Analytics</CardTitle>
          <CardDescription>Search engine optimization and tracking</CardDescription>
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
            <Dialog open={seoOpen} onOpenChange={setSeoOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Configure SEO
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>SEO Settings</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="seo-title">Site Title</Label>
                      <Input
                        id="seo-title"
                        value={seoData.title}
                        onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
                        placeholder="Enter your site title"
                        maxLength={60}
                      />
                      <p className="text-xs text-muted-foreground mt-1">{seoData.title.length}/60 characters</p>
                    </div>

                    <div>
                      <Label htmlFor="seo-description">Meta Description</Label>
                      <Textarea
                        id="seo-description"
                        value={seoData.description}
                        onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
                        placeholder="Enter a brief description of your website"
                        maxLength={160}
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {seoData.description.length}/160 characters
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label>Social Media Preview Image</Label>
                      <Tabs value={imageUploadMode} onValueChange={(v: 'url' | 'upload') => setImageUploadMode(v)}>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="url">
                            <LinkIcon className="h-4 w-4 mr-2" />
                            Image URL
                          </TabsTrigger>
                          <TabsTrigger value="upload">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload File
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="url" className="space-y-2">
                          <Input
                            placeholder="https://example.com/image.jpg"
                            value={seoData.ogImageUrl}
                            onChange={(e) => setSeoData((prev) => ({ ...prev, ogImageUrl: e.target.value }))}
                          />
                          <p className="text-xs text-muted-foreground">
                            Image shown when sharing on social media (1200x630px recommended)
                          </p>
                        </TabsContent>

                        <TabsContent value="upload" className="space-y-2">
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Upload Social Media Image</p>
                              <p className="text-xs text-muted-foreground">JPG, PNG, or GIF up to 2MB</p>

                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                                className="hidden"
                                id="seo-image-upload"
                              />
                              <label
                                htmlFor="seo-image-upload"
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                              >
                                {uploading ? 'Uploading...' : 'Choose File'}
                              </label>
                            </div>
                          </div>

                          {seoData.ogImageUrl && (
                            <div className="mt-2">
                              <img src={seoData.ogImageUrl} alt="Preview" className="w-full h-32 object-cover rounded border" />
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>

                    <div>
                      <Label htmlFor="seo-robots">Robots Meta Tag</Label>
                      <select
                        id="seo-robots"
                        value={seoData.robots}
                        onChange={(e) => setSeoData({ ...seoData, robots: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="index, follow">Index, Follow (Default)</option>
                        <option value="noindex, nofollow">No Index, No Follow</option>
                        <option value="index, nofollow">Index, No Follow</option>
                        <option value="noindex, follow">No Index, Follow</option>
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">Controls how search engines crawl and index your site</p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setSeoOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSeoSave}>Save SEO Settings</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
          <CardDescription>Share your website or export for external hosting</CardDescription>
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
