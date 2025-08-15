import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ExternalLink, Settings } from 'lucide-react'
import { SyndicationPartnerConfiguration } from '@/types'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'
import { mockPlatformAdmin } from '@/mocks/platformAdminMock'

interface CompanySyndicationPartner {
  platformPartnerId: string
  name: string
  accountId?: string
  isEnabled: boolean
  supportedListingTypes: string[]
  exportFormat: 'XML' | 'JSON'
}

export default function ListingPartnersSettings() {
  const { tenant, updateTenant } = useTenant()
  const [companyPartners, setCompanyPartners] = useState<CompanySyndicationPartner[]>([])
  const [editingPartner, setEditingPartner] = useState<CompanySyndicationPartner | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Get platform partners
  const platformPartners = mockPlatformAdmin.platformSyndicationPartners

  // Initialize company partners from platform partners
  useEffect(() => {
    setIsLoading(true)
    try {
      // Load existing company partner configurations or initialize from platform partners
      const savedPartners = tenant?.settings?.syndicationPartners || []
      
      // Create company partners based on platform partners
      const initialPartners: CompanySyndicationPartner[] = platformPartners
        .filter(p => p.isActive)
        .map(platformPartner => {
          const existing = savedPartners.find((sp: any) => sp.platformPartnerId === platformPartner.platformId)
          return {
            platformPartnerId: platformPartner.platformId,
            name: platformPartner.name,
            accountId: existing?.accountId || '',
            isEnabled: existing?.isEnabled || false,
            supportedListingTypes: platformPartner.supportedListingTypes,
            exportFormat: platformPartner.defaultExportFormat
          }
        })
      
      setCompanyPartners(initialPartners)
    } catch (error) {
      console.error('Failed to initialize syndication partners:', error)
      toast({
        title: 'Error',
        description: 'Failed to load syndication partners',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }, [tenant, platformPartners, toast])

  const handleTogglePartner = async (platformPartnerId: string, isEnabled: boolean) => {
    try {
      const updatedPartners = companyPartners.map(p =>
        p.platformPartnerId === platformPartnerId ? { ...p, isEnabled } : p
      )
      
      setCompanyPartners(updatedPartners)
      
      // Save to tenant settings
      await updateTenant({
        settings: {
          ...tenant?.settings,
          syndicationPartners: updatedPartners
        }
      })
      
      toast({
        title: 'Success',
        description: `${updatedPartners.find(p => p.platformPartnerId === platformPartnerId)?.name} ${isEnabled ? 'enabled' : 'disabled'}`
      })
    } catch (error) {
      console.error('Failed to toggle partner:', error)
      toast({
        title: 'Error',
        description: 'Failed to update partner status',
        variant: 'destructive'
      })
    }
  }

  const handleUpdateAccountId = async (platformPartnerId: string, accountId: string) => {
    try {
      const updatedPartners = companyPartners.map(p =>
        p.platformPartnerId === platformPartnerId ? { ...p, accountId: accountId.trim() } : p
      )
      
      setCompanyPartners(updatedPartners)
      
      // Save to tenant settings
      await updateTenant({
        settings: {
          ...tenant?.settings,
          syndicationPartners: updatedPartners
        }
      })
      
      setEditingPartner(null)
      setIsEditDialogOpen(false)
      
      toast({
        title: 'Success',
        description: 'Account ID updated successfully'
      })
    } catch (error) {
      console.error('Failed to update account ID:', error)
      toast({
        title: 'Error',
        description: 'Failed to update account ID',
        variant: 'destructive'
      })
    }
  }

  const openEditDialog = (partner: CompanySyndicationPartner) => {
    setEditingPartner(partner)
    setIsEditDialogOpen(true)
  }

  const generateExportUrl = (partner: CompanySyndicationPartner): string => {
    const baseUrl = 'https://your-app.netlify.app/.netlify/functions/syndication-feed'
    const companyId = tenant?.id || 'demo-company'
    const leadReplyEmail = tenant?.settings?.leadReplyEmail || mockPlatformAdmin.leadReplyEmail
    
    const params = new URLSearchParams({
      partnerId: partner.platformPartnerId,
      companyId: companyId,
      format: partner.exportFormat,
      listingTypes: partner.supportedListingTypes.join(','),
      leadEmail: leadReplyEmail
    })

    if (partner.accountId) {
      params.set('accountId', partner.accountId)
    }

    return `${baseUrl}?${params.toString()}`
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Listing Partners</h3>
          <p className="text-sm text-muted-foreground">
            Configure syndication partners for your listings
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-muted-foreground">
              Loading syndication partners...
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Listing Partners</h3>
        <p className="text-sm text-muted-foreground">
          Enable syndication partners and configure account settings
        </p>
      </div>

      {/* Syndication Partners List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Syndication Partners</CardTitle>
          <CardDescription>
            Toggle partners on/off and configure account IDs for premium features
          </CardDescription>
        </CardHeader>
        <CardContent>
          {companyPartners.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="mb-4">
                <ExternalLink className="h-12 w-12 mx-auto text-muted-foreground/50" />
              </div>
              <p className="text-sm mb-4">
                No syndication partners available
              </p>
              <p className="text-xs">
                Contact platform administrator to enable syndication partners
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {companyPartners.map((partner) => (
                <div key={partner.platformPartnerId} className="border rounded-lg p-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{partner.name}</h3>
                          <Badge variant={partner.isEnabled ? "default" : "secondary"}>
                            {partner.isEnabled ? "Enabled" : "Disabled"}
                          </Badge>
                          <Badge variant="outline">{partner.exportFormat}</Badge>
                          {partner.accountId && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              ID: {partner.accountId}
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Listing Types:</span>{" "}
                            {partner.supportedListingTypes.join(", ")}
                          </div>
                          {partner.accountId && (
                            <div>
                              <span className="font-medium">Account ID:</span> {partner.accountId}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={partner.isEnabled}
                            onCheckedChange={(checked) => handleTogglePartner(partner.platformPartnerId, checked)}
                          />
                          <Label className="text-sm">Enabled</Label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(partner)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Export URL (only shown if enabled) */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Account ID Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure {editingPartner?.name}</DialogTitle>
            <DialogDescription>
              Set your account ID for premium features with this partner
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account-id">Account ID</Label>
              <Input
                id="account-id"
                value={editingPartner?.accountId || ''}
                onChange={(e) => setEditingPartner(prev => 
                  prev ? { ...prev, accountId: e.target.value } : null
                )}
                placeholder="Enter your partner account ID"
              />
              <p className="text-sm text-muted-foreground">
                Optional: Provide your account ID with {editingPartner?.name} for premium listing features
              </p>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditDialogOpen(false)
                  setEditingPartner(null)
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (editingPartner) {
                    handleUpdateAccountId(editingPartner.platformPartnerId, editingPartner.accountId || '')
                  }
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}