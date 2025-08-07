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
import { SyndicationPartnerConfiguration } from '@/types/listings'
import { SyndicationPartnerForm } from '@/modules/property-listings/components/SyndicationPartnerForm'
import { useToast } from '@/hooks/use-toast'

export default function PropertyListingsSettings() {
  const [syndicationPartners, setSyndicationPartners] = useState<SyndicationPartnerConfiguration[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<SyndicationPartnerConfiguration | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const { toast } = useToast()

  // Mock data for development - replace with Rails API calls
  useEffect(() => {
    // Simulate API call to Rails backend
    const fetchSyndicationPartners = async () => {
      setIsLoading(true)
      try {
        // TODO: Replace with actual Rails API call
        // const response = await fetch('/api/syndication_partners')
        // const partners = await response.json()
        
        // Mock data for now
        const mockPartners: SyndicationPartnerConfiguration[] = [
          {
            id: '1',
            name: 'Zillow',
            listingTypes: ['for_rent', 'for_sale', 'apartment', 'house', 'condo'],
            leadEmail: 'support+zillow@notifications.renterinsight.com',
            exportFormat: 'XML',
            exportUrl: 'https://your-app.netlify.app/.netlify/functions/syndication-feed?partnerId=1&format=XML&listingTypes=for_rent,for_sale,apartment,house,condo',
            isActive: true,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z'
          },
          {
            id: '2',
            name: 'MH Village',
            listingTypes: ['manufactured_home', 'for_sale'],
            leadEmail: 'support+mhvillage@notifications.renterinsight.com',
            exportFormat: 'JSON',
            exportUrl: 'https://your-app.netlify.app/.netlify/functions/syndication-feed?partnerId=2&format=JSON&listingTypes=manufactured_home,for_sale',
            isActive: true,
            createdAt: '2024-01-20T14:30:00Z',
            updatedAt: '2024-01-20T14:30:00Z'
          }
        ]
        
        setSyndicationPartners(mockPartners)
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
  }, [toast])

  const handleCreatePartner = async (partnerData: SyndicationPartnerConfiguration) => {
    try {
      // TODO: Replace with actual Rails API call
      // const response = await fetch('/api/syndication_partners', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(partnerData)
      // })
      // const newPartner = await response.json()
      
      // Mock implementation
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
      // TODO: Replace with actual Rails API call
      // const response = await fetch(`/api/syndication_partners/${partnerData.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(partnerData)
      // })
      // const updatedPartner = await response.json()
      
      // Mock implementation
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
      // TODO: Replace with actual Rails API call
      // await fetch(`/api/syndication_partners/${partnerId}`, {
      //   method: 'DELETE'
      // })
      
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
      // TODO: Replace with actual Rails API call
      // await fetch(`/api/syndication_partners/${partnerId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ isActive })
      // })
      
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

  const generateExportUrl = (partner: Partial<SyndicationPartnerConfiguration>): string => {
    const baseUrl = 'https://your-app.netlify.app/.netlify/functions/syndication-feed'
    const params = new URLSearchParams({
      partnerId: partner.id || 'new',
      format: partner.exportFormat || 'XML',
      listingTypes: partner.listingTypes?.join(',') || '',
      leadEmail: partner.leadEmail || ''
    })
    return `${baseUrl}?${params.toString()}`
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

  const formatListingTypes = (types: string[]) => {
    return types.map(type => type.replace('_', ' ')).join(', ')
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Property Listings Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure syndication partners and export settings
        </p>
      </div>

      {/* Syndication Partners Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Syndication Partners</CardTitle>
              <CardDescription>
                Manage listing syndication to external platforms
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
                    {editingPartner ? 'Edit Syndication Partner' : 'Add New Syndication Partner'}
                  </DialogTitle>
                  <DialogDescription>
                    Configure a new syndication partner to export your listings
                  </DialogDescription>
                </DialogHeader>
                <SyndicationPartnerForm
                  partner={editingPartner}
                  onSubmit={editingPartner ? handleUpdatePartner : handleCreatePartner}
                  onCancel={closeForm}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {syndicationPartners.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="mb-4">
                <ExternalLink className="h-12 w-12 mx-auto text-muted-foreground/50" />
              </div>
              <p className="text-lg font-medium mb-2">No syndication partners configured</p>
              <p className="text-sm mb-4">
                Add your first syndication partner to start exporting listings
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {syndicationPartners.map((partner) => (
                <div key={partner.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{partner.name}</h4>
                        <Badge variant={partner.isActive ? 'default' : 'secondary'}>
                          {partner.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">{partner.exportFormat}</Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Lead Email:</span> {partner.leadEmail}
                        </div>
                        <div>
                          <span className="font-medium">Listing Types:</span> {formatListingTypes(partner.listingTypes)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Export URL:</span>
                          <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                            {partner.exportUrl}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(partner.exportUrl!, partner.id)}
                            className="h-6 w-6 p-0"
                          >
                            {copiedUrl === partner.id ? (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
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
                          <Button variant="ghost" size="sm">
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
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* General Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Configure general property listing settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Auto-sync listings</Label>
              <div className="text-sm text-muted-foreground">
                Automatically sync listings with syndication partners
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="sync-interval">Sync Interval (hours)</Label>
            <Input
              id="sync-interval"
              type="number"
              defaultValue="24"
              className="w-32"
              min="1"
              max="168"
            />
            <div className="text-sm text-muted-foreground">
              How often to sync listings with partners (1-168 hours)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}