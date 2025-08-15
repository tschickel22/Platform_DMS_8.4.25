import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Plus, ExternalLink, Edit, Trash2, Copy, CheckCircle } from 'lucide-react'
import { SyndicationPartnerConfiguration } from '@/types'
import { SyndicationPartnerForm } from '@/modules/property-listings/components/SyndicationPartnerForm'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'
import { mockPlatformAdmin } from '@/mocks/platformAdminMock'

export default function PropertyListingsSettings() {
  const { tenant, updateTenant } = useTenant()
  const [syndicationPartners, setSyndicationPartners] = useState<SyndicationPartnerConfiguration[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<SyndicationPartnerConfiguration | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [leadReplyEmail, setLeadReplyEmail] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Get platform partners and lead reply email
  const platformPartners = mockPlatformAdmin.platformSyndicationPartners
  const defaultLeadReplyEmail = mockPlatformAdmin.leadReplyEmail

  // Initialize lead reply email
  useEffect(() => {
    setLeadReplyEmail(tenant?.settings?.leadReplyEmail || defaultLeadReplyEmail)
  }, [tenant, defaultLeadReplyEmail])

  // Mock data for development - replace with Rails API calls
  useEffect(() => {
    const fetchSyndicationPartners = async () => {
      setIsLoading(true)
      try {
        // Mock data for now - replace with actual API call
        const mockPartners: SyndicationPartnerConfiguration[] = [
          {
            id: '1',
            platformPartnerId: 'zillow',
            name: 'Zillow',
            listingTypes: ['for_rent', 'for_sale', 'apartment', 'house', 'condo'],
            leadEmail: 'support+zillow@notifications.renterinsight.com',
            exportFormat: 'XML',
            exportUrl: '',
            accountId: 'ZILL123456',
            isActive: true,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z'
          },
          {
            id: '2',
            platformPartnerId: 'mhvillage',
            name: 'MH Village',
            listingTypes: ['manufactured_home', 'for_sale'],
            leadEmail: 'support+mhvillage@notifications.renterinsight.com',
            exportFormat: 'JSON',
            exportUrl: '',
            accountId: '',
            isActive: false,
            createdAt: '2024-01-20T14:30:00Z',
            updatedAt: '2024-01-20T14:30:00Z'
          }
        ]
        
        // Generate export URLs for existing partners
        const partnersWithUrls = mockPartners.map(p => ({
          ...p,
          exportUrl: generateExportUrl(p)
        }))
        
        setSyndicationPartners(partnersWithUrls)
      } catch (error) {
        console.error('Failed to fetch syndication partners:', error)
        toast({
          title: 'Error',
          description: 'Failed to load syndication partners',
          variant: 'destructive'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSyndicationPartners()
  }, [toast, tenant])

  const generateExportUrl = (partner: SyndicationPartnerConfiguration | any): string => {
    const baseUrl = 'https://your-app.netlify.app/.netlify/functions/syndication-feed'
    
    const params = new URLSearchParams({
      partnerId: partner.platformPartnerId || partner.platformId || partner.id,
      format: partner.exportFormat || partner.defaultExportFormat,
      leadEmail: leadReplyEmail
    })

    if (partner.accountId) {
      params.set('accountId', partner.accountId)
    }

    // Add listing types
    const listingTypes = partner.listingTypes || partner.supportedListingTypes || []
    if (listingTypes.length > 0) {
      params.set('listingTypes', listingTypes.join(','))
    }

    return `${baseUrl}?${params.toString()}`
  }

  const handleCreatePartner = async (partnerData: SyndicationPartnerConfiguration) => {
    try {
      const newPartner: SyndicationPartnerConfiguration = {
        ...partnerData,
        id: Date.now().toString(),
        exportUrl: generateExportUrl(partnerData),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setSyndicationPartners(prev => [...prev, newPartner])
      setIsFormOpen(false)
      
      toast({
        title: 'Success',
        description: 'Syndication partner created successfully'
      })
    } catch (error) {
      console.error('Failed to create syndication partner:', error)
      toast({
        title: 'Error',
        description: 'Failed to create syndication partner',
        variant: 'destructive'
      })
    }
  }

  const handleUpdatePartner = async (partnerData: SyndicationPartnerConfiguration) => {
    try {
      const updatedPartner: SyndicationPartnerConfiguration = {
        ...partnerData,
        exportUrl: generateExportUrl(partnerData),
        updatedAt: new Date().toISOString()
      }
      
      setSyndicationPartners(prev => 
        prev.map(p => p.id === partnerData.id ? updatedPartner : p)
      )
      setEditingPartner(null)
      setIsFormOpen(false)
      
      toast({
        title: 'Success',
        description: 'Syndication partner updated successfully'
      })
    } catch (error) {
      console.error('Failed to update syndication partner:', error)
      toast({
        title: 'Error',
        description: 'Failed to update syndication partner',
        variant: 'destructive'
      })
    }
  }

  const handleDeletePartner = async (partnerId: string) => {
    try {
      setSyndicationPartners(prev => prev.filter(p => p.id !== partnerId))
      
      toast({
        title: 'Success',
        description: 'Syndication partner deleted successfully'
      })
    } catch (error) {
      console.error('Failed to delete syndication partner:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete syndication partner',
        variant: 'destructive'
      })
    }
  }

  const handleToggleActive = async (partnerId: string, isActive: boolean) => {
    try {
      setSyndicationPartners(prev =>
        prev.map(p => p.id === partnerId ? { ...p, isActive } : p)
      )
      
      toast({
        title: 'Success',
        description: `Syndication partner ${isActive ? 'activated' : 'deactivated'}`
      })
    } catch (error) {
      console.error('Failed to toggle partner status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update partner status',
        variant: 'destructive'
      })
    }
  }

  const handleSaveLeadEmail = async () => {
    setIsSaving(true)
    try {
      await updateTenant({
        settings: {
          ...tenant?.settings,
          leadReplyEmail: leadReplyEmail
        }
      })
      
      toast({
        title: 'Success',
        description: 'Lead reply email updated successfully'
      })
    } catch (error) {
      console.error('Failed to update lead reply email:', error)
      toast({
        title: 'Error',
        description: 'Failed to update lead reply email',
        variant: 'destructive'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const copyToClipboard = async (url: string, partnerId: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(partnerId)
      setTimeout(() => setCopiedUrl(null), 2000)
      toast({
        title: 'Copied',
        description: 'Export URL copied to clipboard'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy URL',
        variant: 'destructive'
      })
    }
  }

  const openEditForm = (partner: SyndicationPartnerConfiguration) => {
    setEditingPartner(partner)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingPartner(null)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Property Listings Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure syndication partners and export settings
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
    <div className="space-y-6 max-w-full">
      <div>
        <h3 className="text-lg font-medium">Property Listings Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure syndication partners and export settings
        </p>
      </div>

      {/* Lead Reply Email Setting */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Reply Email</CardTitle>
          <CardDescription>
            Global email address for lead notifications from syndication partners
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lead-reply-email">Lead Reply Email</Label>
            <div className="flex space-x-2">
              <Input
                id="lead-reply-email"
                type="email"
                value={leadReplyEmail}
                onChange={(e) => setLeadReplyEmail(e.target.value)}
                placeholder="support@notifications.renterinsight.com"
                className="flex-1 max-w-md"
              />
              <Button 
                onClick={handleSaveLeadEmail}
                variant="outline"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              This email will be used as the default contact email in syndication feeds
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Available Platform Partners */}
      <Card>
        <CardHeader>
          <CardTitle>Syndication Partners</CardTitle>
          <CardDescription>
            Platform-level syndication partners and their export URLs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {platformPartners.map((platformPartner) => {
              const exportUrl = generateExportUrl(platformPartner)
              
              return (
                <div key={platformPartner.platformId} className="border rounded-lg p-4">
                  <div className="space-y-4">
                    {/* Partner Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-semibold">{platformPartner.name}</h4>
                          <Badge variant="outline">{platformPartner.defaultExportFormat}</Badge>
                          <Badge variant={platformPartner.isActive ? "default" : "secondary"}>
                            {platformPartner.isActive ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {platformPartner.description}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-muted-foreground">Supported Types:</span>
                            <div className="mt-1">
                              {platformPartner.supportedListingTypes.join(', ')}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">Base Lead Email:</span>
                            <div className="mt-1 font-mono text-xs">
                              {platformPartner.baseLeadEmail}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Export URL Section */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">Export URL:</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(exportUrl, platformPartner.platformId)}
                          className="shrink-0"
                        >
                          {copiedUrl === platformPartner.platformId ? (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          {copiedUrl === platformPartner.platformId ? 'Copied' : 'Copy'}
                        </Button>
                      </div>
                      <div className="p-3 bg-muted rounded-md">
                        <code className="text-xs break-all">
                          {exportUrl}
                        </code>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Share this URL with {platformPartner.name} to enable listing syndication across all companies
                      </p>
                    </div>

                    {/* Test Feed Button */}
                    <div className="flex justify-start">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(exportUrl, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Test Feed
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Configured Partners (if any exist) */}
      {syndicationPartners.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Configured Partners</CardTitle>
                <CardDescription>
                  Company-specific syndication partner configurations
                </CardDescription>
              </div>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingPartner(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Partner
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPartner ? 'Edit Syndication Partner' : 'Add Syndication Partner'}
                    </DialogTitle>
                    <DialogDescription>
                      Configure a syndication partner to export your listings
                    </DialogDescription>
                  </DialogHeader>
                  <SyndicationPartnerForm
                    partner={editingPartner}
                    availablePlatformPartners={platformPartners}
                    globalLeadReplyEmail={leadReplyEmail}
                    onSubmit={editingPartner ? handleUpdatePartner : handleCreatePartner}
                    onCancel={closeForm}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {syndicationPartners.map((partner) => (
                <div key={partner.id} className="border rounded-lg p-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{partner.name}</h3>
                          <Badge variant={partner.isActive ? "default" : "secondary"}>
                            {partner.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline">{partner.exportFormat}</Badge>
                          {partner.accountId && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              ID: {partner.accountId}
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Lead Email:</span> {partner.leadEmail}
                          </div>
                          <div>
                            <span className="font-medium">Listing Types:</span>{" "}
                            {partner.listingTypes.join(", ")}
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
                            checked={partner.isActive}
                            onCheckedChange={(checked) => handleToggleActive(partner.id, checked)}
                          />
                          <Label className="text-sm">Active</Label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditForm(partner)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Syndication Partner</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{partner.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePartner(partner.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    {/* Export URL Section */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">Export URL:</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generateExportUrl(partner), partner.id)}
                          className="shrink-0"
                        >
                          {copiedUrl === partner.id ? (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          {copiedUrl === partner.id ? 'Copied' : 'Copy'}
                        </Button>
                      </div>
                      <div className="p-3 bg-muted rounded-md">
                        <code className="text-xs break-all">
                          {generateExportUrl(partner)}
                        </code>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Share this URL with {partner.name} to enable listing syndication
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}