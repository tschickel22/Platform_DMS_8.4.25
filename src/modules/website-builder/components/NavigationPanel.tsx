import React, { useState } from 'react'
import { NavConfig, Manufacturer } from '../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, GripVertical, ExternalLink, Package } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useExternalData } from '../hooks/useSite'
import { useToast } from '@/hooks/use-toast'

interface NavigationPanelProps {
  navConfig: NavConfig
  onUpdateNav: (nav: NavConfig) => void
}

export function NavigationPanel({ navConfig, onUpdateNav }: NavigationPanelProps) {
  const { manufacturers: defaultManufacturers, loadDefaultManufacturers } = useExternalData()
  const { toast } = useToast()
  const [showAddManufacturer, setShowAddManufacturer] = useState(false)
  const [editingManufacturer, setEditingManufacturer] = useState<Manufacturer | null>(null)
  const [manufacturerForm, setManufacturerForm] = useState({
    name: '',
    slug: '',
    logoUrl: '',
    externalUrl: '',
    linkType: 'external' as 'inventory' | 'external'
  })

  const updateManufacturersMenu = (updates: Partial<NavConfig['manufacturersMenu']>) => {
    onUpdateNav({
      ...navConfig,
      manufacturersMenu: {
        ...navConfig.manufacturersMenu,
        ...updates
      }
    })
  }

  const handleLoadDefaults = async () => {
    await loadDefaultManufacturers()
    
    if (defaultManufacturers.length > 0) {
      updateManufacturersMenu({
        items: [...navConfig.manufacturersMenu.items, ...defaultManufacturers]
      })
      toast({
        title: 'Manufacturers loaded',
        description: `Added ${defaultManufacturers.length} default manufacturers`
      })
    }
  }

  const handleAddManufacturer = () => {
    if (!manufacturerForm.name.trim()) return

    const newManufacturer: Manufacturer = {
      id: `custom-${Date.now()}`,
      name: manufacturerForm.name,
      slug: manufacturerForm.slug || manufacturerForm.name.toLowerCase().replace(/\s+/g, '-'),
      logoUrl: manufacturerForm.logoUrl,
      externalUrl: manufacturerForm.externalUrl,
      enabled: true,
      linkType: manufacturerForm.linkType
    }

    updateManufacturersMenu({
      items: [...navConfig.manufacturersMenu.items, newManufacturer]
    })

    setShowAddManufacturer(false)
    setManufacturerForm({
      name: '',
      slug: '',
      logoUrl: '',
      externalUrl: '',
      linkType: 'external'
    })

    toast({
      title: 'Manufacturer added',
      description: `${newManufacturer.name} has been added to the menu`
    })
  }

  const handleUpdateManufacturer = () => {
    if (!editingManufacturer || !manufacturerForm.name.trim()) return

    const updatedItems = navConfig.manufacturersMenu.items.map(item =>
      item.id === editingManufacturer.id
        ? {
            ...item,
            name: manufacturerForm.name,
            slug: manufacturerForm.slug || manufacturerForm.name.toLowerCase().replace(/\s+/g, '-'),
            logoUrl: manufacturerForm.logoUrl,
            externalUrl: manufacturerForm.externalUrl,
            linkType: manufacturerForm.linkType
          }
        : item
    )

    updateManufacturersMenu({ items: updatedItems })
    setEditingManufacturer(null)
    setManufacturerForm({
      name: '',
      slug: '',
      logoUrl: '',
      externalUrl: '',
      linkType: 'external'
    })
  }

  const handleDeleteManufacturer = (id: string) => {
    if (confirm('Are you sure you want to remove this manufacturer?')) {
      const updatedItems = navConfig.manufacturersMenu.items.filter(item => item.id !== id)
      updateManufacturersMenu({ items: updatedItems })
    }
  }

  const toggleManufacturerEnabled = (id: string) => {
    const updatedItems = navConfig.manufacturersMenu.items.map(item =>
      item.id === id ? { ...item, enabled: !item.enabled } : item
    )
    updateManufacturersMenu({ items: updatedItems })
  }

  const openEditDialog = (manufacturer: Manufacturer) => {
    setEditingManufacturer(manufacturer)
    setManufacturerForm({
      name: manufacturer.name,
      slug: manufacturer.slug,
      logoUrl: manufacturer.logoUrl || '',
      externalUrl: manufacturer.externalUrl || '',
      linkType: manufacturer.linkType
    })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Navigation Settings</h3>

      {/* Manufacturers Menu */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Manufacturers Menu</CardTitle>
            <Switch
              checked={navConfig.manufacturersMenu.enabled}
              onCheckedChange={(enabled) => updateManufacturersMenu({ enabled })}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="manufacturers-label">Menu Label</Label>
            <Input
              id="manufacturers-label"
              value={navConfig.manufacturersMenu.label}
              onChange={(e) => updateManufacturersMenu({ label: e.target.value })}
              placeholder="Manufacturers"
            />
          </div>

          <div className="flex items-center justify-between">
            <h4 className="font-medium">Manufacturers</h4>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleLoadDefaults}>
                Load Defaults
              </Button>
              <Dialog open={showAddManufacturer} onOpenChange={setShowAddManufacturer}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Manufacturer</DialogTitle>
                  </DialogHeader>
                  <ManufacturerForm
                    formData={manufacturerForm}
                    onFormChange={setManufacturerForm}
                    onSubmit={handleAddManufacturer}
                    onCancel={() => setShowAddManufacturer(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {navConfig.manufacturersMenu.items.map((manufacturer) => (
              <Card key={manufacturer.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    {manufacturer.logoUrl && (
                      <img 
                        src={manufacturer.logoUrl} 
                        alt={manufacturer.name}
                        className="w-8 h-8 object-contain rounded"
                      />
                    )}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{manufacturer.name}</span>
                        <Badge variant={manufacturer.linkType === 'inventory' ? 'default' : 'secondary'}>
                          {manufacturer.linkType === 'inventory' ? (
                            <Package className="h-3 w-3 mr-1" />
                          ) : (
                            <ExternalLink className="h-3 w-3 mr-1" />
                          )}
                          {manufacturer.linkType}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{manufacturer.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={manufacturer.enabled}
                      onCheckedChange={() => toggleManufacturerEnabled(manufacturer.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(manufacturer)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteManufacturer(manufacturer.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Land & Home Menu */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Land & Home Menu</CardTitle>
            <Switch
              checked={navConfig.showLandHomeMenu || false}
              onCheckedChange={(enabled) => onUpdateNav({ ...navConfig, showLandHomeMenu: enabled })}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="landhome-label">Menu Label</Label>
            <Input
              id="landhome-label"
              value={navConfig.landHomeLabel || ''}
              onChange={(e) => onUpdateNav({ ...navConfig, landHomeLabel: e.target.value })}
              placeholder="Land & Homes"
            />
          </div>
        </CardContent>
      </Card>

      {/* Edit Manufacturer Dialog */}
      <Dialog open={!!editingManufacturer} onOpenChange={(open) => !open && setEditingManufacturer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Manufacturer</DialogTitle>
          </DialogHeader>
          <ManufacturerForm
            formData={manufacturerForm}
            onFormChange={setManufacturerForm}
            onSubmit={handleUpdateManufacturer}
            onCancel={() => setEditingManufacturer(null)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface ManufacturerFormProps {
  formData: {
    name: string
    slug: string
    logoUrl: string
    externalUrl: string
    linkType: 'inventory' | 'external'
  }
  onFormChange: (data: any) => void
  onSubmit: () => void
  onCancel: () => void
}

function ManufacturerForm({ formData, onFormChange, onSubmit, onCancel }: ManufacturerFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="mfg-name">Name</Label>
        <Input
          id="mfg-name"
          value={formData.name}
          onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
          placeholder="Forest River"
        />
      </div>
      <div>
        <Label htmlFor="mfg-slug">Slug</Label>
        <Input
          id="mfg-slug"
          value={formData.slug}
          onChange={(e) => onFormChange({ ...formData, slug: e.target.value })}
          placeholder="forest-river"
        />
      </div>
      <div>
        <Label htmlFor="mfg-logo">Logo URL</Label>
        <Input
          id="mfg-logo"
          value={formData.logoUrl}
          onChange={(e) => onFormChange({ ...formData, logoUrl: e.target.value })}
          placeholder="https://example.com/logo.png"
        />
      </div>
      <div>
        <Label htmlFor="mfg-link-type">Link Type</Label>
        <select
          id="mfg-link-type"
          value={formData.linkType}
          onChange={(e) => onFormChange({ ...formData, linkType: e.target.value })}
          className="w-full p-2 border rounded-md"
        >
          <option value="inventory">Filter Inventory</option>
          <option value="external">External Website</option>
        </select>
      </div>
      {formData.linkType === 'external' && (
        <div>
          <Label htmlFor="mfg-url">External URL</Label>
          <Input
            id="mfg-url"
            value={formData.externalUrl}
            onChange={(e) => onFormChange({ ...formData, externalUrl: e.target.value })}
            placeholder="https://forestriver.com"
          />
        </div>
      )}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          Save
        </Button>
      </div>
    </div>
  )
}