import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Globe, ExternalLink } from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'
import { mockPlatformAdmin } from '@/mocks/platformAdminMock'

interface CompanyPartnerConfig {
  platformPartnerId: string
  isEnabled: boolean
  accountId: string
  customLeadEmail?: string
}

export default function ListingPartnersSettings() {
  const { tenant, updateTenant } = useTenant()
  const [partnerConfigs, setPartnerConfigs] = useState<CompanyPartnerConfig[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Get platform partners
  const platformPartners = mockPlatformAdmin.platformSyndicationPartners

  // Initialize partner configs from tenant settings
  useEffect(() => {
    const savedConfigs = tenant?.settings?.syndicationPartners || []
    
    // Ensure all platform partners have a config entry
    const configs = platformPartners.map(partner => {
      const existing = savedConfigs.find((c: any) => c.platformPartnerId === partner.platformId)
      return existing || {
        platformPartnerId: partner.platformId,
        isEnabled: false,
        accountId: '',
        customLeadEmail: ''
      }
    })
    
    setPartnerConfigs(configs)
  }, [tenant, platformPartners])

  const handleTogglePartner = (platformPartnerId: string, isEnabled: boolean) => {
    setPartnerConfigs(prev => 
      prev.map(config => 
        config.platformPartnerId === platformPartnerId 
          ? { ...config, isEnabled }
          : config
      )
    )
  }

  const handleUpdateAccountId = (platformPartnerId: string, accountId: string) => {
    setPartnerConfigs(prev => 
      prev.map(config => 
        config.platformPartnerId === platformPartnerId 
          ? { ...config, accountId }
          : config
      )
    )
  }

  const handleUpdateLeadEmail = (platformPartnerId: string, customLeadEmail: string) => {
    setPartnerConfigs(prev => 
      prev.map(config => 
        config.platformPartnerId === platformPartnerId 
          ? { ...config, customLeadEmail }
          : config
      )
    )
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      await updateTenant({
        settings: {
          ...tenant?.settings,
          syndicationPartners: partnerConfigs
        }
      })
      
      toast({
        title: 'Success',
        description: 'Syndication partner settings saved successfully'
      })
    } catch (error) {
      console.error('Failed to save syndication settings:', error)
      toast({
        title: 'Error',
        description: 'Failed to save syndication settings',
        variant: 'destructive'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const openPlatformAdmin = () => {
    window.location.href = '/admin/settings'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Listing Partners</h3>
          <p className="text-sm text-muted-foreground">
            Enable syndication partners and configure account settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={openPlatformAdmin}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Platform Admin
          </Button>
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Partners</CardTitle>
          <CardDescription>
            Enable syndication partners and configure your account details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {platformPartners.map((platformPartner) => {
              const config = partnerConfigs.find(c => c.platformPartnerId === platformPartner.platformId)
              const isEnabled = config?.isEnabled || false
              const accountId = config?.accountId || ''
              const customLeadEmail = config?.customLeadEmail || ''
              
              return (
                <div key={platformPartner.platformId} className="border rounded-lg p-4">
                  <div className="space-y-4">
                    {/* Partner Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-medium">{platformPartner.name}</h4>
                          <p className="text-sm text-muted-foreground">{platformPartner.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{platformPartner.defaultExportFormat}</Badge>
                        <Badge variant={platformPartner.isActive ? "default" : "secondary"}>
                          {platformPartner.isActive ? "Available" : "Unavailable"}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={(checked) => handleTogglePartner(platformPartner.platformId, checked)}
                            disabled={!platformPartner.isActive}
                          />
                          <Label className="text-sm">Enable</Label>
                        </div>
                      </div>
                    </div>

                    {/* Configuration Fields - Only show when enabled */}
                    {isEnabled && (
                      <div className="pt-4 border-t space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`account-${platformPartner.platformId}`}>
                              Account ID {platformPartner.name === 'MH Village' ? '(Premium Feature)' : '(Optional)'}
                            </Label>
                            <Input
                              id={`account-${platformPartner.platformId}`}
                              value={accountId}
                              onChange={(e) => handleUpdateAccountId(platformPartner.platformId, e.target.value)}
                              placeholder={`Your ${platformPartner.name} account ID`}
                            />
                            <p className="text-xs text-muted-foreground">
                              {platformPartner.name === 'MH Village' 
                                ? 'Required for premium listing features and enhanced visibility'
                                : 'Optional - used for tracking and enhanced features'
                              }
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`email-${platformPartner.platformId}`}>
                              Custom Lead Email (Optional)
                            </Label>
                            <Input
                              id={`email-${platformPartner.platformId}`}
                              type="email"
                              value={customLeadEmail}
                              onChange={(e) => handleUpdateLeadEmail(platformPartner.platformId, e.target.value)}
                              placeholder={platformPartner.baseLeadEmail}
                            />
                            <p className="text-xs text-muted-foreground">
                              Override the default lead email for this partner
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="font-medium">Supported Types:</span>
                          <span>{platformPartner.supportedListingTypes.join(', ')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Need More Partners?</CardTitle>
          <CardDescription>
            Additional syndication partners can be configured in Platform Admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Platform Administration</p>
              <p className="text-sm text-muted-foreground">
                Configure additional syndication partners, export URLs, and advanced settings
              </p>
            </div>
            <Button variant="outline" onClick={openPlatformAdmin}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Platform Admin
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}