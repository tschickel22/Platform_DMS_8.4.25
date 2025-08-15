import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ExternalLink, Info } from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'
import { mockPlatformAdmin } from '@/mocks/platformAdminMock'

interface PartnerConfiguration {
  platformId: string
  isEnabled: boolean
  accountId: string
  customLeadEmail?: string
}

export default function ListingPartnersSettings() {
  const { tenant, updateTenant } = useTenant()
  const [partnerConfigs, setPartnerConfigs] = useState<PartnerConfiguration[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Get available platform partners
  const platformPartners = mockPlatformAdmin.platformSyndicationPartners

  // Initialize partner configurations
  useEffect(() => {
    const configs = platformPartners.map(partner => ({
      platformId: partner.platformId,
      isEnabled: tenant?.settings?.syndicationPartners?.[partner.platformId]?.isEnabled || false,
      accountId: tenant?.settings?.syndicationPartners?.[partner.platformId]?.accountId || '',
      customLeadEmail: tenant?.settings?.syndicationPartners?.[partner.platformId]?.customLeadEmail || ''
    }))
    setPartnerConfigs(configs)
  }, [tenant, platformPartners])

  const handleTogglePartner = (platformId: string, isEnabled: boolean) => {
    setPartnerConfigs(prev => 
      prev.map(config => 
        config.platformId === platformId 
          ? { ...config, isEnabled }
          : config
      )
    )
  }

  const handleAccountIdChange = (platformId: string, accountId: string) => {
    setPartnerConfigs(prev => 
      prev.map(config => 
        config.platformId === platformId 
          ? { ...config, accountId }
          : config
      )
    )
  }

  const handleCustomEmailChange = (platformId: string, customLeadEmail: string) => {
    setPartnerConfigs(prev => 
      prev.map(config => 
        config.platformId === platformId 
          ? { ...config, customLeadEmail }
          : config
      )
    )
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      // Convert array to object for storage
      const syndicationPartners = partnerConfigs.reduce((acc, config) => {
        acc[config.platformId] = {
          isEnabled: config.isEnabled,
          accountId: config.accountId,
          customLeadEmail: config.customLeadEmail || undefined
        }
        return acc
      }, {} as Record<string, any>)

      await updateTenant({
        settings: {
          ...tenant?.settings,
          syndicationPartners
        }
      })
      
      toast({
        title: 'Success',
        description: 'Listing partner settings saved successfully'
      })
    } catch (error) {
      console.error('Failed to save partner settings:', error)
      toast({
        title: 'Error',
        description: 'Failed to save partner settings',
        variant: 'destructive'
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Listing Partners</h3>
          <p className="text-sm text-muted-foreground">
            Configure your company's syndication partner settings
          </p>
        </div>
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm text-blue-800 font-medium">
                Partner Configuration
              </p>
              <p className="text-sm text-blue-700">
                Enable syndication partners and configure your account details. 
                For advanced partner management and export URLs, visit{' '}
                <Button variant="link" className="p-0 h-auto text-blue-700 underline" asChild>
                  <a href="/admin/settings">Platform Admin Settings</a>
                </Button>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partner Configuration Cards */}
      <div className="space-y-4">
        {platformPartners.map((partner) => {
          const config = partnerConfigs.find(c => c.platformId === partner.platformId)
          if (!config) return null

          return (
            <Card key={partner.platformId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ExternalLink className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{partner.name}</CardTitle>
                      <CardDescription>{partner.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{partner.defaultExportFormat}</Badge>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={config.isEnabled}
                        onCheckedChange={(checked) => handleTogglePartner(partner.platformId, checked)}
                      />
                      <Label className="text-sm">
                        {config.isEnabled ? 'Enabled' : 'Disabled'}
                      </Label>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              {config.isEnabled && (
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`account-${partner.platformId}`}>
                        Account ID
                        {partner.platformId === 'mhvillage' && (
                          <span className="text-xs text-muted-foreground ml-1">
                            (Required for premium features)
                          </span>
                        )}
                      </Label>
                      <Input
                        id={`account-${partner.platformId}`}
                        value={config.accountId}
                        onChange={(e) => handleAccountIdChange(partner.platformId, e.target.value)}
                        placeholder={`Your ${partner.name} account ID`}
                      />
                      {partner.platformId === 'mhvillage' && (
                        <p className="text-xs text-muted-foreground">
                          Account ID enables premium listing features and enhanced visibility
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`email-${partner.platformId}`}>
                        Custom Lead Email (Optional)
                      </Label>
                      <Input
                        id={`email-${partner.platformId}`}
                        type="email"
                        value={config.customLeadEmail}
                        onChange={(e) => handleCustomEmailChange(partner.platformId, e.target.value)}
                        placeholder={partner.baseLeadEmail}
                      />
                      <p className="text-xs text-muted-foreground">
                        Override the default lead email for this partner
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium">Supported Types:</span>
                      <div className="flex flex-wrap gap-1">
                        {partner.supportedListingTypes.map(type => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}