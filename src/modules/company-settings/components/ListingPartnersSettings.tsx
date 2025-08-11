import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useTenant } from '@/contexts/TenantContext'

interface Partner {
  id: string
  name: string
  types: string[]
  format: 'json' | 'xml'
  leadEmail: string
  listingTypes: string[]
  exportUrl?: string
  active: boolean
}

interface CompanyPartnerConfig {
  partnerId: string
  companyId: string
  active: boolean
  leadEmail?: string
}

export default function ListingPartnersSettings() {
  const { tenant } = useTenant()
  const { toast } = useToast()
  
  const [partners, setPartners] = useState<Partner[]>([])
  const [companyConfigs, setCompanyConfigs] = useState<CompanyPartnerConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Mock data for development - replace with actual API calls
  useEffect(() => {
    const mockPartners: Partner[] = [
      {
        id: 'mhvillage',
        name: 'MH Village',
        types: ['MH'],
        format: 'json',
        leadEmail: 'leads@mhvillage.com',
        listingTypes: ['manufactured_home'],
        exportUrl: `${window.location.origin}/.netlify/functions/syndication-feed?partnerId=mhvillage&companyId=${tenant?.id}`,
        active: true
      },
      {
        id: 'rvtrader',
        name: 'RV Trader',
        types: ['RV'],
        format: 'json',
        leadEmail: 'leads@rvtrader.com',
        listingTypes: ['rv'],
        exportUrl: `${window.location.origin}/.netlify/functions/syndication-feed?partnerId=rvtrader&companyId=${tenant?.id}`,
        active: true
      },
      {
        id: 'zillow',
        name: 'Zillow',
        types: ['MH', 'RV'],
        format: 'xml',
        leadEmail: 'partners@zillow.com',
        listingTypes: ['manufactured_home', 'rv'],
        exportUrl: `${window.location.origin}/.netlify/functions/syndication-feed?partnerId=zillow&companyId=${tenant?.id}&format=xml`,
        active: true
      }
    ]
    
    const mockConfigs: CompanyPartnerConfig[] = [
      {
        partnerId: 'mhvillage',
        companyId: tenant?.id || 'demo-company',
        active: false,
        leadEmail: 'sales@mycompany.com'
      }
    ]
    
    setPartners(mockPartners)
    setCompanyConfigs(mockConfigs)
    setLoading(false)
  }, [tenant?.id])

  const getCompanyConfig = (partnerId: string): CompanyPartnerConfig => {
    return companyConfigs.find(c => c.partnerId === partnerId) || {
      partnerId,
      companyId: tenant?.id || '',
      active: false
    }
  }

  const updateCompanyConfig = async (partnerId: string, updates: Partial<CompanyPartnerConfig>) => {
    setSaving(true)
    try {
      const existingIndex = companyConfigs.findIndex(c => c.partnerId === partnerId)
      const updatedConfig = {
        ...getCompanyConfig(partnerId),
        ...updates
      }
      
      if (existingIndex >= 0) {
        const newConfigs = [...companyConfigs]
        newConfigs[existingIndex] = updatedConfig
        setCompanyConfigs(newConfigs)
      } else {
        setCompanyConfigs([...companyConfigs, updatedConfig])
      }
      
      // TODO: Save to backend
      // await fetch(`/.netlify/functions/company-partners-crud`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedConfig)
      // })
      
      toast({
        title: 'Settings Saved',
        description: 'Partner settings have been updated successfully.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save partner settings.',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: 'Copied',
        description: 'Export URL copied to clipboard.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard.',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            Loading partner settings...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Syndication Partners</CardTitle>
        <CardDescription>
          Configure your company settings for each available syndication partner. 
          You'll need to provide your Company ID to each partner and configure lead routing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {partners.map((partner) => {
          const config = getCompanyConfig(partner.id)
          
          return (
            <div key={partner.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{partner.name}</h4>
                    <div className="flex space-x-1">
                      {partner.types.map(type => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {partner.format.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Default lead email: {partner.leadEmail}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`${partner.id}-active`}>Active</Label>
                  <Switch
                    id={`${partner.id}-active`}
                    checked={config.active}
                    onCheckedChange={(checked) => 
                      updateCompanyConfig(partner.id, { active: checked })
                    }
                    disabled={saving}
                  />
                </div>
              </div>
              
              {config.active && (
                <div className="grid gap-4 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`${partner.id}-company-id`}>
                        Your Company ID at {partner.name}
                      </Label>
                      <Input
                        id={`${partner.id}-company-id`}
                        placeholder="Enter your company ID"
                        value={config.companyId || ''}
                        onChange={(e) => 
                          updateCompanyConfig(partner.id, { companyId: e.target.value })
                        }
                        disabled={saving}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        This is the ID {partner.name} assigned to your company
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor={`${partner.id}-lead-email`}>
                        Lead Email Override (Optional)
                      </Label>
                      <Input
                        id={`${partner.id}-lead-email`}
                        type="email"
                        placeholder="leads@yourcompany.com"
                        value={config.leadEmail || ''}
                        onChange={(e) => 
                          updateCompanyConfig(partner.id, { leadEmail: e.target.value })
                        }
                        disabled={saving}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Override default lead routing for this partner
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Export URL for {partner.name}</Label>
                    <div className="flex mt-1">
                      <Input
                        value={partner.exportUrl || ''}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="ml-2"
                        onClick={() => copyToClipboard(partner.exportUrl || '')}
                      >
                        Copy
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Provide this URL to {partner.name} for automated listing imports
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}