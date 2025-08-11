import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Settings, 
  Globe, 
  Mail, 
  Phone, 
  ExternalLink,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useTenant } from '@/contexts/TenantContext'

interface PartnerOverride {
  partnerId: string
  partnerName: string
  enabled: boolean
  leadEmail?: string
  alternatePhone?: string
  customAccountId?: string
  specialInstructions?: string
  priorityLevel: 'normal' | 'high' | 'premium'
  autoSync: boolean
  includeListingTypes: ('manufactured_home' | 'rv')[]
  priceOverrides: {
    minimumPrice?: number
    maximumPrice?: number
    hidePrice?: boolean
  }
  customFields: Record<string, any>
}

interface PartnerTemplate {
  id: string
  name: string
  description: string
  logoUrl?: string
  supportedTypes: ('manufactured_home' | 'rv')[]
  requiresAccount: boolean
  defaultFields: string[]
}

export default function ListingPartnersSettings() {
  const { toast } = useToast()
  const { tenant } = useTenant()
  const [overrides, setOverrides] = useState<PartnerOverride[]>([])
  const [availablePartners, setAvailablePartners] = useState<PartnerTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [addingPartner, setAddingPartner] = useState(false)

  const defaultPartnerTemplates: PartnerTemplate[] = [
    {
      id: 'mhvillage',
      name: 'MH Village',
      description: 'Leading manufactured home marketplace',
      logoUrl: '/partners/mhvillage-logo.png',
      supportedTypes: ['manufactured_home'],
      requiresAccount: true,
      defaultFields: ['accountKey', 'companyName', 'phone', 'email']
    },
    {
      id: 'rvtrader',
      name: 'RV Trader',
      description: 'Premier RV marketplace',
      logoUrl: '/partners/rvtrader-logo.png', 
      supportedTypes: ['rv'],
      requiresAccount: true,
      defaultFields: ['dealerCode', 'companyName', 'phone', 'email']
    },
    {
      id: 'zillow',
      name: 'Zillow',
      description: 'Real estate platform',
      logoUrl: '/partners/zillow-logo.png',
      supportedTypes: ['manufactured_home'],
      requiresAccount: true,
      defaultFields: ['mlsId', 'agentId', 'phone', 'email']
    }
  ]

  useEffect(() => {
    loadPartnerSettings()
  }, [])

  const loadPartnerSettings = async () => {
    try {
      setLoading(true)
      setAvailablePartners(defaultPartnerTemplates)
      
      // Mock existing overrides - in production, fetch from backend
      const mockOverrides: PartnerOverride[] = [
        {
          partnerId: 'mhvillage',
          partnerName: 'MH Village',
          enabled: true,
          leadEmail: 'mh-leads@company.com',
          customAccountId: 'MHV123456',
          priorityLevel: 'premium',
          autoSync: true,
          includeListingTypes: ['manufactured_home'],
          priceOverrides: {
            minimumPrice: 5000,
            hidePrice: false
          },
          customFields: {}
        }
      ]
      
      setOverrides(mockOverrides)
      
    } catch (error) {
      console.error('Error loading partner settings:', error)
      toast({
        title: "Error",
        description: "Failed to load partner settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      
      // Mock save - in production, save to backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Settings Saved",
        description: "Partner listing settings have been updated",
      })
      
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Error",
        description: "Failed to save partner settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const addPartnerOverride = (partnerId: string) => {
    const partner = availablePartners.find(p => p.id === partnerId)
    if (!partner) return

    const newOverride: PartnerOverride = {
      partnerId,
      partnerName: partner.name,
      enabled: false,
      priorityLevel: 'normal',
      autoSync: false,
      includeListingTypes: partner.supportedTypes,
      priceOverrides: {},
      customFields: {}
    }

    setOverrides(prev => [...prev, newOverride])
    setAddingPartner(false)
  }

  const removePartnerOverride = (partnerId: string) => {
    setOverrides(prev => prev.filter(o => o.partnerId !== partnerId))
  }

  const updateOverride = (partnerId: string, updates: Partial<PartnerOverride>) => {
    setOverrides(prev => prev.map(o => 
      o.partnerId === partnerId ? { ...o, ...updates } : o
    ))
  }

  const availableToAdd = availablePartners.filter(
    partner => !overrides.find(override => override.partnerId === partner.id)
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Listing Partner Settings</h2>
          <p className="text-muted-foreground">
            Configure partner-specific settings and overrides for listing syndication
          </p>
        </div>
        <div className="flex space-x-2">
          {availableToAdd.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setAddingPartner(!addingPartner)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Partner
            </Button>
          )}
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Settings className="h-4 w-4 mr-2" />}
            Save Settings
          </Button>
        </div>
      </div>

      {addingPartner && availableToAdd.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Add Partner Integration</CardTitle>
            <CardDescription>
              Select a partner to configure custom settings for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableToAdd.map(partner => (
                <div
                  key={partner.id}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => addPartnerOverride(partner.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Globe className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium">{partner.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {partner.description}
                      </p>
                      <div className="flex space-x-1">
                        {partner.supportedTypes.map(type => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            {type === 'manufactured_home' ? 'MH' : 'RV'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {overrides.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Partners Configured</h3>
            <p className="text-muted-foreground mb-4">
              Add partner integrations to customize how your listings are syndicated
            </p>
            <Button onClick={() => setAddingPartner(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Partner
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {overrides.map(override => {
            const partner = availablePartners.find(p => p.id === override.partnerId)
            
            return (
              <Card key={override.partnerId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle>{override.partnerName}</CardTitle>
                        <CardDescription>
                          {partner?.description || 'Custom partner integration'}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        {override.enabled ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                        <Switch
                          checked={override.enabled}
                          onCheckedChange={(checked) => updateOverride(override.partnerId, { enabled: checked })}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePartnerOverride(override.partnerId)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Overrides */}
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact Overrides
                      </h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`lead-email-${override.partnerId}`}>Lead Email</Label>
                        <Input
                          id={`lead-email-${override.partnerId}`}
                          type="email"
                          placeholder="leads@company.com"
                          value={override.leadEmail || ''}
                          onChange={(e) => updateOverride(override.partnerId, { leadEmail: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Override default email for leads from this partner
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`alt-phone-${override.partnerId}`}>Alternate Phone</Label>
                        <Input
                          id={`alt-phone-${override.partnerId}`}
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={override.alternatePhone || ''}
                          onChange={(e) => updateOverride(override.partnerId, { alternatePhone: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Account Settings */}
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Account Settings
                      </h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`account-id-${override.partnerId}`}>Account ID</Label>
                        <Input
                          id={`account-id-${override.partnerId}`}
                          placeholder="Partner account identifier"
                          value={override.customAccountId || ''}
                          onChange={(e) => updateOverride(override.partnerId, { customAccountId: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`priority-${override.partnerId}`}>Priority Level</Label>
                        <select
                          id={`priority-${override.partnerId}`}
                          className="w-full p-2 border rounded-md"
                          value={override.priorityLevel}
                          onChange={(e) => updateOverride(override.partnerId, { 
                            priorityLevel: e.target.value as 'normal' | 'high' | 'premium' 
                          })}
                        >
                          <option value="normal">Normal</option>
                          <option value="high">High Priority</option>
                          <option value="premium">Premium</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sync Settings */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Sync Settings</h4>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor={`auto-sync-${override.partnerId}`}>Auto Sync</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically sync new/updated listings
                          </p>
                        </div>
                        <Switch
                          id={`auto-sync-${override.partnerId}`}
                          checked={override.autoSync}
                          onCheckedChange={(checked) => updateOverride(override.partnerId, { autoSync: checked })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Include Listing Types</Label>
                        <div className="space-y-2">
                          {partner?.supportedTypes.includes('manufactured_home') && (
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`mh-${override.partnerId}`}
                                checked={override.includeListingTypes.includes('manufactured_home')}
                                onChange={(e) => {
                                  const types = e.target.checked
                                    ? [...override.includeListingTypes, 'manufactured_home' as const]
                                    : override.includeListingTypes.filter(t => t !== 'manufactured_home')
                                  updateOverride(override.partnerId, { includeListingTypes: types })
                                }}
                              />
                              <Label htmlFor={`mh-${override.partnerId}`}>Manufactured Homes</Label>
                            </div>
                          )}
                          
                          {partner?.supportedTypes.includes('rv') && (
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`rv-${override.partnerId}`}
                                checked={override.includeListingTypes.includes('rv')}
                                onChange={(e) => {
                                  const types = e.target.checked
                                    ? [...override.includeListingTypes, 'rv' as const]
                                    : override.includeListingTypes.filter(t => t !== 'rv')
                                  updateOverride(override.partnerId, { includeListingTypes: types })
                                }}
                              />
                              <Label htmlFor={`rv-${override.partnerId}`}>RVs</Label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price Overrides */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Price Settings</h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`min-price-${override.partnerId}`}>Minimum Price</Label>
                        <Input
                          id={`min-price-${override.partnerId}`}
                          type="number"
                          placeholder="0"
                          value={override.priceOverrides.minimumPrice || ''}
                          onChange={(e) => updateOverride(override.partnerId, { 
                            priceOverrides: { 
                              ...override.priceOverrides, 
                              minimumPrice: parseInt(e.target.value) || undefined 
                            } 
                          })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`max-price-${override.partnerId}`}>Maximum Price</Label>
                        <Input
                          id={`max-price-${override.partnerId}`}
                          type="number"
                          placeholder="No limit"
                          value={override.priceOverrides.maximumPrice || ''}
                          onChange={(e) => updateOverride(override.partnerId, { 
                            priceOverrides: { 
                              ...override.priceOverrides, 
                              maximumPrice: parseInt(e.target.value) || undefined 
                            } 
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor={`hide-price-${override.partnerId}`}>Hide Prices</Label>
                          <p className="text-sm text-muted-foreground">
                            Don't include pricing in feeds
                          </p>
                        </div>
                        <Switch
                          id={`hide-price-${override.partnerId}`}
                          checked={override.priceOverrides.hidePrice || false}
                          onCheckedChange={(checked) => updateOverride(override.partnerId, { 
                            priceOverrides: { 
                              ...override.priceOverrides, 
                              hidePrice: checked 
                            } 
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  {override.specialInstructions && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <Label htmlFor={`instructions-${override.partnerId}`}>Special Instructions</Label>
                        <textarea
                          id={`instructions-${override.partnerId}`}
                          className="w-full p-2 border rounded-md"
                          rows={3}
                          placeholder="Special handling instructions for this partner..."
                          value={override.specialInstructions || ''}
                          onChange={(e) => updateOverride(override.partnerId, { specialInstructions: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}