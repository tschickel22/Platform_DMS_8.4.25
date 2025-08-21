import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Globe, ExternalLink, CheckCircle, AlertCircle, Info, Copy } from 'lucide-react'
import { Globe, ExternalLink, Copy, CheckCircle, AlertCircle, Eye } from 'lucide-react'
import { Loader2, Settings } from 'lucide-react'
import { Site, DomainConfig } from '../types'
import { websiteService } from '@/services/website/service'
import { useToast } from '@/hooks/use-toast'
import { useErrorHandler } from '@/hooks/useErrorHandler'

interface PublishPanelProps {
  site: Site
  onSiteUpdate: (updates: Partial<Site>) => void
  mode: 'platform' | 'company'
}

function hostFromUrl(url?: string | null): string {
  if (!url) return ''
  try {
    return new URL(url).host
  } catch {
    return url.replace(/^https?:\/\//, '')
  }
}

export default function PublishPanel({ site, onSiteUpdate, mode }: PublishPanelProps) {
  const [publishing, setPublishing] = useState(false)
  const [settingDomain, setSettingDomain] = useState(false)
  const [showDomainSettings, setShowDomainSettings] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  const [domainConfig, setDomainConfig] = useState<DomainConfig>({
    type: 'subdomain',
    subdomain: site.slug || ''
  })

  // Track a saved domain string (set after saving domain settings)
  const [savedDomain, setSavedDomain] = useState<string | null>(null)

  const { toast } = useToast()
  const { handleError } = useErrorHandler()

  // Generate Bolt preview URL
  const generatePreviewUrl = () => {
    const baseUrl = window.location.origin
    return `${baseUrl}/s/${site.slug}`
  }

  // Compute the current domain to display
  const currentDomain = useMemo(() => {
    if (savedDomain) return savedDomain
    // Prefer a host from previewUrl if available, otherwise fall back to the subdomain default
    return hostFromUrl(site.previewUrl) || (site.slug ? `${site.slug}.renterinsight.com` : '')
  }, [savedDomain, site.previewUrl, site.slug])

  // Compute a preview URL to open
  const computedPreviewUrl = useMemo(() => {
    return site.previewUrl || (currentDomain ? `https://${currentDomain}` : undefined)
  }, [site.previewUrl, currentDomain])

  const handlePublish = async () => {
    try {
      setPublishing(true)
      const result = await websiteService.publishSite(site.id)
      
      if (result.success) {
        // Store site data for preview access
        const previewKey = `wb2:preview:${site.slug}`
        sessionStorage.setItem(previewKey, JSON.stringify(site))
        
        // Also store in localStorage for persistence
        const publishedSites = JSON.parse(localStorage.getItem('wb2:published-sites') || '{}')
        publishedSites[site.slug] = {
          ...site,
          publishedAt: new Date().toISOString(),
          version: Date.now()
        }
        localStorage.setItem('wb2:published-sites', JSON.stringify(publishedSites))
        
        const url = generatePreviewUrl()
        setPreviewUrl(url)
        setIsPublished(true)
        onSiteUpdate({
          publishedAt: result.publishedAt,
          previewUrl: result.previewUrl
        })

        toast({
          title: 'Site published!',
          description: 'Your website is now live and accessible.'
        })
      } else {
        throw new Error(result.error || 'Publishing failed')
      }
    } catch (error) {
      handleError(error, 'publishing site')
    } finally {
      setPublishing(false)
    }
  }

  const handleSetDomain = async () => {
    try {
      setSettingDomain(true)
      const result = await websiteService.setDomain(site.id, domainConfig)

      if (result.success) {
        // Generate the domain string for display based on chosen type
        let domainString = ''
        switch (domainConfig.type) {
          case 'subdomain':
            domainString = `${domainConfig.subdomain}.renterinsight.com`
            break
          case 'custom':
            domainString = domainConfig.customDomain || ''
            break
          case 'subdomain_custom':
            domainString = `${domainConfig.subdomain}.${domainConfig.baseDomain || ''}`
            break
          case 'multi_dealer':
            domainString = `${domainConfig.dealerCode || ''}.${domainConfig.groupDomain || ''}`
            break
        }
        setSavedDomain(domainString)

        toast({
          title: 'Domain configured',
          description: result.message
        })
        setShowDomainSettings(false)
      } else {
        throw new Error(result.message || 'Domain configuration failed')
      }
    } catch (error) {
      handleError(error, 'setting domain')
    } finally {
      setSettingDomain(false)
    }
  }

  const handlePreview = () => {
    // Use the published site URL if available, otherwise fallback to local preview
    // Store current site data in sessionStorage for live preview
    const sessionKey = `wb2:preview-site:${site.slug}`
    sessionStorage.setItem(sessionKey, JSON.stringify(site))
    
    try {
      // Store current site data in sessionStorage for preview
      const previewKey = `wb2:preview:${site.slug}`
      sessionStorage.setItem(previewKey, JSON.stringify(site))
      
      // Also store in localStorage as backup
      const localSites = JSON.parse(localStorage.getItem('wb2:sites') || '[]')
      const existingIndex = localSites.findIndex((s: any) => s.id === site.id)
      if (existingIndex >= 0) {
        localSites[existingIndex] = site
      } else {
        localSites.push(site)
      }
      localStorage.setItem('wb2:sites', JSON.stringify(localSites))
      
      // Open preview in new window
      const previewUrl = `${window.location.origin}/s/${site.slug}/`
      window.open(previewUrl, '_blank')
      
      toast({
        title: 'Preview opened',
        description: 'Your website preview is ready to view.',
      })
    } catch (error) {
      console.error('Failed to open preview:', error)
      toast({
        title: 'Preview failed',
        description: 'Unable to open preview. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const openPreview = () => {
    const url = computedPreviewUrl || generatePreviewUrl()
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const copyPreviewUrl = async () => {
    const url = computedPreviewUrl || generatePreviewUrl()
    await copyToClipboard(url)
  }

  // Single, non-duplicated helper
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: 'URL Copied!',
        description: 'Preview URL copied to clipboard',
      })
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Publish & Share
        </CardTitle>
        <CardDescription>
          Preview and share your website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Publish Status */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              {site.publishedAt ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Published</span>
                  <Badge variant="secondary" className="text-xs">
                    Live
                  </Badge>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium">Draft</span>
                  <Badge variant="outline" className="text-xs">
                    Not Published
                  </Badge>
                </>
              )}
            </div>

            {site.publishedAt && (
              <p className="text-xs text-muted-foreground">
                Last published: {new Date(site.publishedAt).toLocaleString()}
              </p>
            )}
          </div>

          {/* Current URL */}
          <div>
            <Label className="text-sm font-medium">Website Address</Label>
            <div className="flex items-center gap-2 mt-2">
              <Input value={currentDomain} readOnly className="text-sm" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(`https://${currentDomain}`)}
                disabled={!currentDomain}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => computedPreviewUrl && window.open(computedPreviewUrl, '_blank')}
                disabled={!site.publishedAt || !computedPreviewUrl}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Domain Settings */}
          {mode === 'platform' && (
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDomainSettings(!showDomainSettings)}
                className="w-full"
              >
                <Settings className="h-4 w-4 mr-2" />
                Domain Settings
              </Button>

              {showDomainSettings && (
                <div className="mt-4 space-y-4 p-4 border rounded-lg bg-muted/50">
                  <div>
                    <Label>Domain Type</Label>
                    <select
                      value={domainConfig.type}
                      onChange={(e) =>
                        setDomainConfig({
                          ...domainConfig,
                          type: e.target.value as DomainConfig['type']
                        })
                      }
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      <option value="subdomain">Subdomain (free)</option>
                      <option value="custom">Custom Domain</option>
                    </select>
                  </div>

                  {domainConfig.type === 'subdomain' && (
                    <div>
                      <Label>Subdomain</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          value={domainConfig.subdomain || ''}
                          onChange={(e) =>
                            setDomainConfig({
                              ...domainConfig,
                              subdomain: e.target.value
                            })
                          }
                          placeholder="your-site"
                        />
                        <span className="text-sm text-muted-foreground">
                          .renterinsight.com
                        </span>
                      </div>
                    </div>
                  )}

                  {domainConfig.type === 'custom' && (
                    <div>
                      <Label>Custom Domain</Label>
                      <Input
                        value={domainConfig.customDomain || ''}
                        onChange={(e) =>
                          setDomainConfig({
                            ...domainConfig,
                            customDomain: e.target.value
                          })
                        }
                        placeholder="www.yourdomain.com"
                      />
                    </div>
                  )}

                  <Button
                    onClick={handleSetDomain}
                    disabled={settingDomain}
                    className="w-full"
                  >
                    {settingDomain ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Setting Domain...
                      </>
                    ) : (
                      'Save Domain Settings'
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Preview Section */}
          {isPublished ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Preview Ready</span>
              </div>
              <div className="space-y-2">
                <Button 
                  onClick={openPreview}
                  className="w-full"
                  variant="outline"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Open Preview
                </Button>
                
                <Button 
                  onClick={copyPreviewUrl}
                  className="w-full"
                  variant="outline"
                  size="sm"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Preview URL
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Preview URL: {computedPreviewUrl || generatePreviewUrl()}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
              <span className="text-sm">Preview not generated</span>
            </div>
          )}

          {/* Publish Button */}
          <Button onClick={handlePublish} disabled={publishing} className="w-full" size="lg">
            {publishing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Globe className="h-4 w-4 mr-2" />
                {site.publishedAt ? 'Update Website' : 'Publish Website'}
              </>
            )}
          </Button>

          {site.publishedAt && (
            <div className="text-center">
              <Button
                onClick={openPreview}
                variant="outline"
                className="w-full"
                disabled={!computedPreviewUrl}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Live Site
              </Button>
            </div>
          )}

          {/* Publishing Info */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Changes will be live immediately after publishing</p>
            <p>• You can update anytime after publishing</p>
            <div className="text-green-600 text-xs">Preview: /s/{site.slug}</div>
          </div>

          {/* Preview Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Preview Settings</CardTitle>
              <CardDescription>
                Configure how your website preview appears
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="slug">Preview Slug</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">/s/</span>
                    <Input
                      id="slug"
                      value={site.slug}
                      readOnly
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DNS Instructions - Show after custom domain is saved */}
          {savedDomain &&
            (domainConfig.type === 'custom' || domainConfig.type === 'subdomain_custom') && (
              <Card className="mt-4 border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg text-blue-900">
                      DNS Configuration Required
                    </CardTitle>
                  </div>
                  <CardDescription className="text-blue-700">
                    To use your custom domain, you'll need to update your DNS records with your
                    domain provider.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Required DNS Records:</h4>
                    <div className="space-y-3">
                      {/* CNAME Record */}
                      <div className="bg-white p-3 rounded border">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">CNAME Record</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(`${savedDomain} CNAME renter-insight.netlify.app`)
                            }
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>
                            <strong>Name:</strong>{' '}
                            {domainConfig.type === 'custom' ? 'www' : domainConfig.subdomain}
                          </div>
                          <div>
                            <strong>Type:</strong> CNAME
                          </div>
                          <div>
                            <strong>Value:</strong> renter-insight.netlify.app
                          </div>
                        </div>
                      </div>

                      {/* A Record (for apex domain) */}
                      {domainConfig.type === 'custom' && (
                        <div className="bg-white p-3 rounded border">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">A Record (Apex Domain)</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  `${(domainConfig.customDomain || '')
                                    .replace('www.', '')} A 75.2.60.5`
                                )
                              }
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div>
                              <strong>Name:</strong> @ (or leave blank)
                            </div>
                            <div>
                              <strong>Type:</strong> A
                            </div>
                            <div>
                              <strong>Value:</strong> 75.2.60.5
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded border-l-4 border-l-amber-400">
                    <h5 className="font-medium text-amber-800 mb-1">Important Notes:</h5>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• DNS changes can take up to 24-48 hours to propagate globally</li>
                      <li>• Make sure to remove any existing A or CNAME records for this domain</li>
                      <li>• Contact your domain registrar if you need help accessing DNS settings</li>
                      <li>• Your website will show an SSL error until DNS propagation is complete</li>
                    </ul>
                  </div>

                  <div className="bg-white p-3 rounded">
                    <h5 className="font-medium text-gray-800 mb-2">Common Domain Providers:</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <strong>GoDaddy:</strong> DNS Management
                      </div>
                      <div>
                        <strong>Namecheap:</strong> Advanced DNS
                      </div>
                      <div>
                        <strong>Cloudflare:</strong> DNS Records
                      </div>
                      <div>
                        <strong>Google Domains:</strong> DNS Settings
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          <div className="text-xs text-muted-foreground p-2 bg-blue-50 rounded">
            💡 <strong>Bolt Preview:</strong> Your website preview will be available at /s/{site.slug}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}