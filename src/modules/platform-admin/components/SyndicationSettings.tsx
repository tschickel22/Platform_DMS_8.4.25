import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Plus, Copy, Edit, Trash2, CheckCircle, ExternalLink, Globe } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useTenant } from '@/contexts/TenantContext'

interface SyndicationPartner {
  id: string
  name: string
  status: 'active' | 'inactive'
  format: 'XML' | 'JSON'
  types: string[]
  leadEmail: string
  exportUrl: string
  accountId?: string
  features: string[]
  isConfigured: boolean
  createdAt: string
  updatedAt: string
}

interface AddPartnerFormData {
  name: string
  listingTypes: string[]
  leadEmail: string
  exportFormat: 'XML' | 'JSON'
  accountId?: string
}

const LISTING_TYPE_OPTIONS = [
  { id: 'for_rent', label: 'For Rent', description: 'Rental properties' },
  { id: 'for_sale', label: 'For Sale', description: 'Properties for sale' },
  { id: 'manufactured_home', label: 'Manufactured Home', description: 'Mobile/manufactured homes' },
  { id: 'apartment', label: 'Apartment', description: 'Apartment units' },
  { id: 'house', label: 'House', description: 'Single-family houses' },
  { id: 'condo', label: 'Condo', description: 'Condominium units' },
  { id: 'rv', label: 'RV', description: 'RV/recreational vehicles' },
  { id: 'storage', label: 'Storage', description: 'Storage units' }
]

function AddPartnerModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingPartner 
}: { 
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: AddPartnerFormData) => void
  editingPartner?: SyndicationPartner | null
}) {
  const [formData, setFormData] = useState<AddPartnerFormData>({
    name: '',
    listingTypes: [],
    leadEmail: '',
    exportFormat: 'XML',
    accountId: ''
  })

  useEffect(() => {
    if (editingPartner) {
      setFormData({
        name: editingPartner.name,
        listingTypes: editingPartner.types,
        leadEmail: editingPartner.leadEmail,
        exportFormat: editingPartner.format,
        accountId: editingPartner.accountId || ''
      })
    } else {
      setFormData({
        name: '',
        listingTypes: [],
        leadEmail: 'support+partner@notifications.renterinsight.com',
        exportFormat: 'XML',
        accountId: ''
      })
    }
  }, [editingPartner, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.listingTypes.length > 0 && formData.leadEmail) {
      onSubmit(formData)
    }
  }

  const handleListingTypeChange = (typeId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      listingTypes: checked 
        ? [...prev.listingTypes, typeId]
        : prev.listingTypes.filter(t => t !== typeId)
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingPartner ? 'Edit Syndication Partner' : 'Add Syndication Partner'}
          </DialogTitle>
          <DialogDescription>
            Configure a new syndication partner to export your listings
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Partner Name */}
          <div className="space-y-2">
            <Label htmlFor="partner-name">
              Partner Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="partner-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Zillow, MH Village, Apartments.com"
              required
            />
          </div>

          {/* Listing Types */}
          <div className="space-y-3">
            <Label>
              Listing Types <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-muted-foreground">
              Select which types of listings to include in the syndication feed
            </p>
            <div className="grid grid-cols-2 gap-4">
              {LISTING_TYPE_OPTIONS.map((option) => (
                <div key={option.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={option.id}
                    checked={formData.listingTypes.includes(option.id)}
                    onCheckedChange={(checked) => handleListingTypeChange(option.id, !!checked)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor={option.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Email */}
          <div className="space-y-2">
            <Label htmlFor="lead-email">
              Lead Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lead-email"
              type="email"
              value={formData.leadEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, leadEmail: e.target.value }))}
              placeholder="support+partner@notifications.renterinsight.com"
              required
            />
            <p className="text-sm text-muted-foreground">
              This email will be included in the XML/JSON feed for lead notifications
            </p>
          </div>

          {/* Export Format */}
          <div className="space-y-3">
            <Label>Export Format</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="format-xml"
                  name="exportFormat"
                  value="XML"
                  checked={formData.exportFormat === 'XML'}
                  onChange={(e) => setFormData(prev => ({ ...prev, exportFormat: 'XML' }))}
                  className="h-4 w-4 text-primary"
                />
                <Label htmlFor="format-xml" className="flex items-center space-x-2">
                  <span>XML</span>
                  <span className="text-sm text-muted-foreground">Zillow Format</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="format-json"
                  name="exportFormat"
                  value="JSON"
                  checked={formData.exportFormat === 'JSON'}
                  onChange={(e) => setFormData(prev => ({ ...prev, exportFormat: 'JSON' }))}
                  className="h-4 w-4 text-primary"
                />
                <Label htmlFor="format-json" className="flex items-center space-x-2">
                  <span>JSON</span>
                  <span className="text-sm text-muted-foreground">MH Village Format</span>
                </Label>
              </div>
            </div>
          </div>

          {/* Account ID (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="account-id">Account ID (Optional)</Label>
            <Input
              id="account-id"
              value={formData.accountId}
              onChange={(e) => setFormData(prev => ({ ...prev, accountId: e.target.value }))}
              placeholder="Partner-specific account identifier"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!formData.name || formData.listingTypes.length === 0 || !formData.leadEmail}
            >
              {editingPartner ? 'Update Partner' : 'Create Partner'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function PartnerCard({ 
  partner, 
  onToggleActive, 
  onEdit, 
  onDelete, 
  onCopyUrl 
}: {
  partner: SyndicationPartner
  onToggleActive: (id: string, active: boolean) => void
  onEdit: (partner: SyndicationPartner) => void
  onDelete: (id: string) => void
  onCopyUrl: (url: string, partnerId: string) => void
}) {
  const [copiedUrl, setCopiedUrl] = useState(false)

  const handleCopy = async () => {
    await onCopyUrl(partner.exportUrl, partner.id)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  const openTestFeed = () => {
    window.open(partner.exportUrl, '_blank')
  }

  return (
    <Card className="relative">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{partner.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={partner.status === 'active' ? 'default' : 'secondary'}>
                  {partner.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
                <Badge variant="outline">{partner.format}</Badge>
                {partner.accountId && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    ID: {partner.accountId}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch
                checked={partner.status === 'active'}
                onCheckedChange={(checked) => onToggleActive(partner.id, checked)}
              />
              <Label className="text-sm">Active</Label>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onEdit(partner)}>
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
                    onClick={() => onDelete(partner.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Partner Details */}
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium text-foreground">Lead Email:</span>{' '}
            <span className="text-muted-foreground">{partner.leadEmail}</span>
          </div>
          <div>
            <span className="font-medium text-foreground">Listing Types:</span>{' '}
            <span className="text-muted-foreground">{partner.types.join(', ')}</span>
          </div>
        </div>

        {/* Features */}
        {partner.features.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Features</Label>
            <div className="flex flex-wrap gap-2">
              {partner.features.map((feature) => (
                <Badge key={feature} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Export URL */}
        <div className="space-y-2 pt-3 border-t">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Export URL:</Label>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={openTestFeed}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Test Feed
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copiedUrl ? (
                  <CheckCircle className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copiedUrl ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
          <div className="p-3 bg-muted rounded text-xs font-mono break-all border">
            {partner.exportUrl}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function SyndicationSettings() {
  const { tenant, updateTenant } = useTenant()
  const { toast } = useToast()
  const [partners, setPartners] = useState<SyndicationPartner[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<SyndicationPartner | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize with mock data
  useEffect(() => {
    const initializePartners = async () => {
      setIsLoading(true)
      try {
        // Mock existing partners - in production this would come from API
        const mockPartners: SyndicationPartner[] = [
          {
            id: 'partner-1',
            name: 'Zillow',
            status: 'active',
            format: 'XML',
            types: ['for_rent', 'for_sale', 'apartment', 'house', 'condo'],
            leadEmail: 'support+zillow@notifications.renterinsight.com',
            exportUrl: generateExportUrl('zillow', 'XML', ['for_rent', 'for_sale', 'apartment', 'house', 'condo'], 'support+zillow@notifications.renterinsight.com'),
            accountId: 'ZILL123456',
            features: ['Photos', 'Community Integration', 'Lead Routing', '+1 more'],
            isConfigured: true,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z'
          },
          {
            id: 'partner-2',
            name: 'MH Village',
            status: 'active',
            format: 'JSON',
            types: ['manufactured_home', 'for_sale'],
            leadEmail: 'support+mhvillage@notifications.renterinsight.com',
            exportUrl: generateExportUrl('mhvillage', 'JSON', ['manufactured_home', 'for_sale'], 'support+mhvillage@notifications.renterinsight.com'),
            features: ['Photos', 'Community Integration', 'Lead Routing', '+1 more'],
            isConfigured: true,
            createdAt: '2024-01-20T14:30:00Z',
            updatedAt: '2024-01-20T14:30:00Z'
          }
        ]
        
        setPartners(mockPartners)
      } catch (error) {
        console.error('Failed to load syndication partners:', error)
        toast({
          title: 'Error',
          description: 'Failed to load syndication partners',
          variant: 'destructive'
        })
      } finally {
        setIsLoading(false)
      }
    }

    initializePartners()
  }, [toast])

  const generateExportUrl = (
    partnerId: string, 
    format: string, 
    listingTypes: string[], 
    leadEmail: string,
    accountId?: string
  ): string => {
    const baseUrl = 'https://your-app.netlify.app/.netlify/functions/syndication-feed'
    const companyId = tenant?.id || 'demo-company'
    
    const params = new URLSearchParams({
      partnerId: partnerId.toLowerCase().replace(/\s+/g, ''),
      companyId: companyId,
      format: format.toLowerCase(),
      listingTypes: listingTypes.join(','),
      leadEmail: leadEmail
    })

    if (accountId) {
      params.set('accountId', accountId)
    }

    return `${baseUrl}?${params.toString()}`
  }

  const handleAddPartner = async (formData: AddPartnerFormData) => {
    try {
      const newPartner: SyndicationPartner = {
        id: `partner-${Date.now()}`,
        name: formData.name,
        status: 'active',
        format: formData.exportFormat,
        types: formData.listingTypes,
        leadEmail: formData.leadEmail,
        exportUrl: generateExportUrl(
          formData.name,
          formData.exportFormat,
          formData.listingTypes,
          formData.leadEmail,
          formData.accountId
        ),
        accountId: formData.accountId,
        features: ['Photos', 'Lead Routing'],
        isConfigured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setPartners(prev => [...prev, newPartner])
      setIsAddModalOpen(false)
      
      toast({
        title: 'Success',
        description: 'Syndication partner added successfully'
      })
    } catch (error) {
      console.error('Failed to add partner:', error)
      toast({
        title: 'Error',
        description: 'Failed to add syndication partner',
        variant: 'destructive'
      })
    }
  }

  const handleUpdatePartner = async (formData: AddPartnerFormData) => {
    if (!editingPartner) return

    try {
      const updatedPartner: SyndicationPartner = {
        ...editingPartner,
        name: formData.name,
        format: formData.exportFormat,
        types: formData.listingTypes,
        leadEmail: formData.leadEmail,
        exportUrl: generateExportUrl(
          formData.name,
          formData.exportFormat,
          formData.listingTypes,
          formData.leadEmail,
          formData.accountId
        ),
        accountId: formData.accountId,
        updatedAt: new Date().toISOString()
      }

      setPartners(prev => prev.map(p => p.id === editingPartner.id ? updatedPartner : p))
      setEditingPartner(null)
      setIsAddModalOpen(false)
      
      toast({
        title: 'Success',
        description: 'Syndication partner updated successfully'
      })
    } catch (error) {
      console.error('Failed to update partner:', error)
      toast({
        title: 'Error',
        description: 'Failed to update syndication partner',
        variant: 'destructive'
      })
    }
  }

  const handleToggleActive = async (partnerId: string, isActive: boolean) => {
    try {
      setPartners(prev =>
        prev.map(p => p.id === partnerId ? { ...p, status: isActive ? 'active' : 'inactive' } : p)
      )
      
      toast({
        title: 'Success',
        description: `Partner ${isActive ? 'activated' : 'deactivated'} successfully`
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

  const handleEditPartner = (partner: SyndicationPartner) => {
    setEditingPartner(partner)
    setIsAddModalOpen(true)
  }

  const handleDeletePartner = async (partnerId: string) => {
    try {
      setPartners(prev => prev.filter(p => p.id !== partnerId))
      
      toast({
        title: 'Success',
        description: 'Syndication partner deleted successfully'
      })
    } catch (error) {
      console.error('Failed to delete partner:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete syndication partner',
        variant: 'destructive'
      })
    }
  }

  const handleCopyUrl = async (url: string, partnerId: string) => {
    try {
      await navigator.clipboard.writeText(url)
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

  const closeModal = () => {
    setIsAddModalOpen(false)
    setEditingPartner(null)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Syndication Partners</h3>
            <p className="text-sm text-muted-foreground">
              Manage listing syndication to external platforms
            </p>
          </div>
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Syndication Partners</h3>
          <p className="text-sm text-muted-foreground">
            Manage listing syndication to external platforms
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Partner
        </Button>
      </div>

      {/* Partners Grid */}
      {partners.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {partners.map((partner) => (
            <PartnerCard
              key={partner.id}
              partner={partner}
              onToggleActive={handleToggleActive}
              onEdit={handleEditPartner}
              onDelete={handleDeletePartner}
              onCopyUrl={handleCopyUrl}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Globe className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Syndication Partners</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Add syndication partners to automatically export your listings to external marketplaces like Zillow, MH Village, and more.
              </p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Partner
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Partner Modal */}
      <AddPartnerModal
        isOpen={isAddModalOpen}
        onClose={closeModal}
        onSubmit={editingPartner ? handleUpdatePartner : handleAddPartner}
        editingPartner={editingPartner}
      />
    </div>
  )
}