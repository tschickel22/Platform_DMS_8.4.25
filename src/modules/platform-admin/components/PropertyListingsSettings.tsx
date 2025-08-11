import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Edit, 
  Trash, 
  Globe, 
  FileText, 
  Mail, 
  Home, 
  Car,
  ExternalLink,
  Settings,
  BarChart3,
  Clock,
  Shield
} from 'lucide-react'

interface SyndicationPartner {
  id: string
  name: string
  format: 'json' | 'xml'
  listingTypes: ('manufactured_home' | 'rv')[]
  leadEmail?: string
  isActive: boolean
  exportUrl: string
  description?: string
}

export default function PropertyListingsSettings() {
  const [partners, setPartners] = useState<SyndicationPartner[]>([
    {
      id: 'mhvillage',
      name: 'MHVillage',
      format: 'json',
      listingTypes: ['manufactured_home'],
      leadEmail: 'leads@mhvillage.com',
      isActive: true,
      exportUrl: '/api/syndication/mhvillage',
      description: 'Leading manufactured home marketplace'
    },
    {
      id: 'rvtrader',
      name: 'RV Trader',
      format: 'json',
      listingTypes: ['rv'],
      leadEmail: 'rvleads@trader.com',
      isActive: true,
      exportUrl: '/api/syndication/rvtrader',
      description: 'Premier RV marketplace platform'
    },
    {
      id: 'zillow',
      name: 'Zillow',
      format: 'xml',
      listingTypes: ['manufactured_home', 'rv'],
      isActive: false,
      exportUrl: '/api/syndication/zillow',
      description: 'Real estate marketplace integration'
    }
  ])

  const [globalSettings, setGlobalSettings] = useState({
    autoSyncNightly: true,
    rebuildCacheNightly: true,
    requireAuthForPreview: false,
    enableShareAnalytics: true,
    defaultTokenExpiry: 30, // days
    maxTokensPerCompany: 100
  })

  const [showPartnerModal, setShowPartnerModal] = useState(false)
  const [editingPartner, setEditingPartner] = useState<SyndicationPartner | null>(null)

  const handlePartnerToggle = (partnerId: string) => {
    setPartners(prev => prev.map(p => 
      p.id === partnerId ? { ...p, isActive: !p.isActive } : p
    ))
  }

  const handleDeletePartner = (partnerId: string) => {
    if (confirm('Are you sure you want to delete this partner?')) {
      setPartners(prev => prev.filter(p => p.id !== partnerId))
    }
  }

  const handleSavePartner = (partnerData: any) => {
    if (editingPartner) {
      setPartners(prev => prev.map(p => 
        p.id === editingPartner.id ? { ...p, ...partnerData } : p
      ))
    } else {
      const newPartner = {
        ...partnerData,
        id: partnerData.name.toLowerCase().replace(/\s+/g, ''),
        exportUrl: `/api/syndication/${partnerData.name.toLowerCase().replace(/\s+/g, '')}`
      }
      setPartners(prev => [...prev, newPartner])
    }
    setShowPartnerModal(false)
    setEditingPartner(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Property Listings Settings</h2>
        <p className="text-gray-600">Manage syndication partners and global listing settings</p>
      </div>

      <Tabs defaultValue="partners" className="space-y-6">
        <TabsList>
          <TabsTrigger value="partners">Syndication Partners</TabsTrigger>
          <TabsTrigger value="settings">Global Settings</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="partners" className="space-y-6">
          {/* Partners Header */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Syndication Partners</h3>
              <p className="text-sm text-gray-600">Manage external listing syndication partners</p>
            </div>
            <Button onClick={() => setShowPartnerModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Partner
            </Button>
          </div>

          {/* Partners Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner) => (
              <Card key={partner.id} className="relative">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{partner.name}</CardTitle>
                      {partner.description && (
                        <CardDescription>{partner.description}</CardDescription>
                      )}
                    </div>
                    <Switch
                      checked={partner.isActive}
                      onCheckedChange={() => handlePartnerToggle(partner.id)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-xs font-medium text-gray-500">FORMAT</Label>
                    <Badge variant="outline" className="ml-2">
                      {partner.format.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div>
                    <Label className="text-xs font-medium text-gray-500">LISTING TYPES</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {partner.listingTypes.map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type === 'manufactured_home' ? (
                            <>
                              <Home className="h-3 w-3 mr-1" />
                              MH
                            </>
                          ) : (
                            <>
                              <Car className="h-3 w-3 mr-1" />
                              RV
                            </>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {partner.leadEmail && (
                    <div>
                      <Label className="text-xs font-medium text-gray-500">LEAD EMAIL</Label>
                      <div className="flex items-center text-sm text-gray-700 mt-1">
                        <Mail className="h-3 w-3 mr-1" />
                        {partner.leadEmail}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-xs font-medium text-gray-500">EXPORT URL</Label>
                    <div className="flex items-center text-sm text-gray-700 mt-1">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      <code className="text-xs bg-gray-100 px-1 rounded">
                        {partner.exportUrl}
                      </code>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingPartner(partner)
                        setShowPartnerModal(true)
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePartner(partner.id)}
                    >
                      <Trash className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Global Settings
              </CardTitle>
              <CardDescription>
                Configure system-wide property listing behaviors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Automation Settings</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-sync listings nightly</Label>
                      <p className="text-sm text-gray-600">
                        Automatically sync listings with inventory status
                      </p>
                    </div>
                    <Switch
                      checked={globalSettings.autoSyncNightly}
                      onCheckedChange={(checked) => 
                        setGlobalSettings(prev => ({ ...prev, autoSyncNightly: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Rebuild feed cache nightly</Label>
                      <p className="text-sm text-gray-600">
                        Refresh syndication feeds automatically
                      </p>
                    </div>
                    <Switch
                      checked={globalSettings.rebuildCacheNightly}
                      onCheckedChange={(checked) => 
                        setGlobalSettings(prev => ({ ...prev, rebuildCacheNightly: checked }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Security Settings</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require auth for feed preview</Label>
                      <p className="text-sm text-gray-600">
                        Require authentication to preview feeds
                      </p>
                    </div>
                    <Switch
                      checked={globalSettings.requireAuthForPreview}
                      onCheckedChange={(checked) => 
                        setGlobalSettings(prev => ({ ...prev, requireAuthForPreview: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable share analytics</Label>
                      <p className="text-sm text-gray-600">
                        Track clicks and views on shared listings
                      </p>
                    </div>
                    <Switch
                      checked={globalSettings.enableShareAnalytics}
                      onCheckedChange={(checked) => 
                        setGlobalSettings(prev => ({ ...prev, enableShareAnalytics: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="defaultTokenExpiry">Default token expiry (days)</Label>
                  <Input
                    id="defaultTokenExpiry"
                    type="number"
                    value={globalSettings.defaultTokenExpiry}
                    onChange={(e) => 
                      setGlobalSettings(prev => ({ 
                        ...prev, 
                        defaultTokenExpiry: parseInt(e.target.value) || 30 
                      }))
                    }
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Default expiration for share tokens
                  </p>
                </div>

                <div>
                  <Label htmlFor="maxTokens">Max tokens per company</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    value={globalSettings.maxTokensPerCompany}
                    onChange={(e) => 
                      setGlobalSettings(prev => ({ 
                        ...prev, 
                        maxTokensPerCompany: parseInt(e.target.value) || 100 
                      }))
                    }
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum share tokens per company
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button>Save Global Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                System Health
              </CardTitle>
              <CardDescription>
                Monitor syndication feeds and system status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">MHVillage Feed</span>
                  </div>
                  <p className="text-sm text-gray-600">Last build: 2 hours ago</p>
                  <p className="text-sm text-gray-600">Records: 1,247</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">RV Trader Feed</span>
                  </div>
                  <p className="text-sm text-gray-600">Last build: 1 hour ago</p>
                  <p className="text-sm text-gray-600">Records: 892</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium">Zillow Feed</span>
                  </div>
                  <p className="text-sm text-gray-600">Last build: 6 hours ago</p>
                  <p className="text-sm text-gray-600">Status: Inactive</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Partner Modal */}
      <PartnerFormModal
        open={showPartnerModal}
        partner={editingPartner}
        onClose={() => {
          setShowPartnerModal(false)
          setEditingPartner(null)
        }}
        onSave={handleSavePartner}
      />
    </div>
  )
}

interface PartnerFormModalProps {
  open: boolean
  partner: SyndicationPartner | null
  onClose: () => void
  onSave: (data: any) => void
}

function PartnerFormModal({ open, partner, onClose, onSave }: PartnerFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    format: 'json',
    listingTypes: [] as string[],
    leadEmail: '',
    description: '',
    isActive: true
  })

  React.useEffect(() => {
    if (partner) {
      setFormData({
        name: partner.name,
        format: partner.format,
        listingTypes: partner.listingTypes,
        leadEmail: partner.leadEmail || '',
        description: partner.description || '',
        isActive: partner.isActive
      })
    } else {
      setFormData({
        name: '',
        format: 'json',
        listingTypes: [],
        leadEmail: '',
        description: '',
        isActive: true
      })
    }
  }, [partner])

  const handleSubmit = () => {
    if (!formData.name || formData.listingTypes.length === 0) return
    onSave(formData)
  }

  const handleListingTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      listingTypes: prev.listingTypes.includes(type)
        ? prev.listingTypes.filter(t => t !== type)
        : [...prev.listingTypes, type]
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {partner ? 'Edit Partner' : 'Add New Partner'}
          </DialogTitle>
          <DialogDescription>
            Configure syndication partner settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="partnerName">Partner Name *</Label>
            <Input
              id="partnerName"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="MHVillage"
            />
          </div>

          <div>
            <Label>Data Format *</Label>
            <Select 
              value={formData.format} 
              onValueChange={(value: 'json' | 'xml') => 
                setFormData(prev => ({ ...prev, format: value }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Listing Types *</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.listingTypes.includes('manufactured_home')}
                  onChange={() => handleListingTypeToggle('manufactured_home')}
                />
                <Home className="h-4 w-4" />
                <span>Manufactured Homes</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.listingTypes.includes('rv')}
                  onChange={() => handleListingTypeToggle('rv')}
                />
                <Car className="h-4 w-4" />
                <span>RVs</span>
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="leadEmail">Lead Email</Label>
            <Input
              id="leadEmail"
              type="email"
              value={formData.leadEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, leadEmail: e.target.value }))}
              placeholder="leads@partner.com"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the partner"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, isActive: checked }))
              }
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {partner ? 'Update' : 'Create'} Partner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}