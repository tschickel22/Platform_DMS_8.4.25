import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Globe, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Settings
} from 'lucide-react'
import { Site, DomainConfig } from '../types'
import { websiteService } from '@/services/website/service'
import { useToast } from '@/hooks/use-toast'
import { useErrorHandler } from '@/hooks/useErrorHandler'

interface PublishPanelProps {
  site: Site
  onSiteUpdate: (updates: Partial<Site>) => void
  mode: 'platform' | 'company'
}

export default function PublishPanel({ site, onSiteUpdate, mode }: PublishPanelProps) {
  const [publishing, setPublishing] = useState(false)
  const [settingDomain, setSettingDomain] = useState(false)
  const [showDomainSettings, setShowDomainSettings] = useState(false)
  const [domainConfig, setDomainConfig] = useState<DomainConfig>({
    type: 'subdomain',
    subdomain: site.slug || ''
  })
  
  const { toast } = useToast()
  const { handleError } = useErrorHandler()

  const handlePublish = async () => {
    try {
      setPublishing(true)
      const result = await websiteService.publishSite(site.id)
      
      if (result.success) {
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied!',
      description: 'URL has been copied to clipboard'
    })
  }

  const getDefaultDomain = () => {
    const baseDomain = mode === 'platform' ? 'platform.renterinsight.com' : 'renterinsight.com'
    return `${site.slug}.${baseDomain}`
  }

  const currentDomain = site.domain || getDefaultDomain()
  const previewUrl = site.previewUrl || `https://${currentDomain}`

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Publish & Share
        </CardTitle>
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
              <Input
                value={currentDomain}
                readOnly
                className="text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(`https://${currentDomain}`)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://${currentDomain}`, '_blank')}
                disabled={!site.publishedAt}
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
                      onChange={(e) => setDomainConfig({ 
                        ...domainConfig, 
                        type: e.target.value as any 
                      })}
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
                          onChange={(e) => setDomainConfig({ 
                            ...domainConfig, 
                            subdomain: e.target.value 
                          })}
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
                        onChange={(e) => setDomainConfig({ 
                          ...domainConfig, 
                          customDomain: e.target.value 
                        })}
                        placeholder="www.yourdomain.com"
                        className="mt-1"
                      />
                    </div>
                  )}

                  <Button
                    onClick={handleSetDomain}
                    disabled={settingDomain}
                    size="sm"
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

          {/* Publish Button */}
          <Button
            onClick={handlePublish}
            disabled={publishing}
            className="w-full"
            size="lg"
          >
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

          {/* Preview Link */}
          {site.publishedAt && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => window.open(previewUrl, '_blank')}
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Live Website
              </Button>
            </div>
          )}

          {/* Publishing Info */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Changes are saved automatically</p>
            <p>• Publishing makes your site live on the internet</p>
            <p>• You can update anytime after publishing</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}