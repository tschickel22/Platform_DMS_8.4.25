import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Plus, ExternalLink, Edit, Trash2, Copy, CheckCircle, Globe, Settings, Zap } from 'lucide-react'
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
    const companyId = tenant?.id || 'demo-company'
    
    const params = new URLSearchParams({
      partnerId: partner.platformPartnerId || partner.platformId || partner.id,
      companyId: companyId,
      format: partner.exportFormat || partner.defaultExportFormat,
      listingTypes: partner.listingTypes?.join(',') || partner.supportedListingTypes?.join(',') || '',
      leadEmail: partner.leadEmail || partner.baseLeadEmail || leadReplyEmail
    })

    if (partner.accountId) {
      params.set('accountId', partner.accountId)
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

  const openTestFeed = (url: string) => {
    window.open(url, '_blank')
  }

  const openEditForm = (partner: SyndicationPartnerConfiguration) => {
    setEditingPartner(partner)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingPartner(null)
  }

  const openAddPartnerForm = () => {
    setEditingPartner(null)
    setIsFormOpen(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Syndication Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure listing syndication to partner marketplaces
            </p>
          </div>
          <Button disabled>
            <Settings className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Syndication Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure listing syndication to partner marketplaces
          </p>
        </div>
        <Button onClick={handleSaveLeadEmail} disabled={isSaving}>
          <Settings className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <Tabs defaultValue="partners" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="global">Global Settings</TabsTrigger>
          <TabsTrigger value="feeds">Feed Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="partners" className="space-y-6">
          {/* Available Platform Partners */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Available Syndication Partners
                  </CardTitle>
                  <CardDescription>
                    Platform-level syndication partners with export URLs
                  </CardDescription>
                </div>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={openAddPartnerForm}>
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
              <div className="grid gap-4 md:grid-cols-2">
                {platformPartners.map((platformPartner) => {
                  const isConfigured = syndicationPartners.some(p => p.platformPartnerId === platformPartner.platformId)
                  const exportUrl = generateExportUrl(platformPartner)
                  
                  return (
                    <div key={platformPartner.platformId} className="border rounded-lg p-4 space-y-4">
                      {/* Partner Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-blue-600" />
                          <div>
                            <h4 className="font-medium">{platformPartner.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {platformPartner.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline">{platformPartner.defaultExportFormat}</Badge>
                          <Badge variant={platformPartner.isActive ? "default" : "secondary"}>
                            {platformPartner.isActive ? "Available" : "Unavailable"}
                          </Badge>
                          {isConfigured && (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              Configured
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Partner Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status</span>
                          <span className={platformPartner.isActive ? "text-green-600" : "text-gray-500"}>
                            {platformPartner.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Format</span>
                          <span className="font-medium">{platformPartner.defaultExportFormat}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Types</span>
                          <span className="font-medium">
                            {platformPartner.supportedListingTypes.slice(0, 2).join(', ')}
                            {platformPartner.supportedListingTypes.length > 2 && ' +more'}
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Features</h5>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">Photos</Badge>
                          <Badge variant="outline" className="text-xs">Lead Routing</Badge>
                          <Badge variant="outline" className="text-xs">+1 more</Badge>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openTestFeed(exportUrl)}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Test Feed
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(exportUrl, platformPartner.platformId)}
                        >
                          {copiedUrl === platformPartner.platformId ? (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Configured Partners Section */}
          {syndicationPartners.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Configured Partners</CardTitle>
                <CardDescription>
                  Company-specific syndication partner configurations
                </CardDescription>
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
                        
                        {/* Export URL for configured partners */}
                        <div className="pt-4 border-t">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <Label className="text-sm font-medium">Export URL:</Label>
                              <div className="mt-1 p-3 bg-muted rounded text-xs font-mono break-all border">
                                {partner.exportUrl}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Share this URL with {partner.name} to enable listing syndication
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openTestFeed(partner.exportUrl)}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Test Feed
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(partner.exportUrl, partner.id)}
                              >
                                {copiedUrl === partner.id ? (
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                ) : (
                                  <Copy className="h-4 w-4 mr-2" />
                                )}
                                {copiedUrl === partner.id ? 'Copied' : 'Copy'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="global" className="space-y-6">
          {/* Lead Reply Email Setting */}
          <Card>
            <CardHeader>
              <CardTitle>Global Settings</CardTitle>
              <CardDescription>
                Platform-wide settings for syndication feeds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lead-reply-email">Lead Reply Email</Label>
                <div className="flex space-x-2 max-w-md">
                  <Input
                    id="lead-reply-email"
                    type="email"
                    value={leadReplyEmail}
                    onChange={(e) => setLeadReplyEmail(e.target.value)}
                    placeholder="support@notifications.renterinsight.com"
                    className="flex-1"
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
        </TabsContent>

        <TabsContent value="feeds" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feed Configuration</CardTitle>
              <CardDescription>
                Advanced settings for syndication feeds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>Feed configuration options coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}