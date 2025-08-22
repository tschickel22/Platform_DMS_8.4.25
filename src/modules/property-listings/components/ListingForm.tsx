import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertTriangle, Upload, X, Plus, MapPin, DollarSign, Home, Car, Image, Settings, FileText } from 'lucide-react'
import { useCatalog, useEffectiveListings } from '@/data/catalog'
import type { Listing, InventoryItem } from '@/data/catalog'
import { cn } from '@/lib/utils'

interface ListingFormProps {
  listing?: Listing
  onSave: (listing: Partial<Listing>) => void
  onCancel: () => void
  isOpen: boolean
}

export function ListingForm({ listing, onSave, onCancel, isOpen }: ListingFormProps) {
  const { inventory } = useCatalog()
  const [formData, setFormData] = useState<Partial<Listing>>({
    inventoryId: '',
    listingType: 'manufactured_home',
    status: 'draft',
    salePrice: undefined,
    rentPrice: undefined,
    description: '',
    features: [],
    overrides: {},
    exportMeta: {}
  })
  
  const [selectedInventory, setSelectedInventory] = useState<InventoryItem | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState('basic')

  // Initialize form data when listing prop changes
  useEffect(() => {
    if (listing) {
      setFormData(listing)
      const inv = inventory.find(i => i.id === listing.inventoryId)
      setSelectedInventory(inv || null)
    } else {
      setFormData({
        inventoryId: '',
        listingType: 'manufactured_home',
        status: 'draft',
        salePrice: undefined,
        rentPrice: undefined,
        description: '',
        features: [],
        overrides: {},
        exportMeta: {}
      })
      setSelectedInventory(null)
    }
  }, [listing, inventory])

  const handleInventorySelect = (inventoryId: string) => {
    const inv = inventory.find(i => i.id === inventoryId)
    if (inv) {
      setSelectedInventory(inv)
      setFormData(prev => ({
        ...prev,
        inventoryId,
        listingType: inv.type,
        // Pre-populate some fields from inventory
        overrides: {
          year: inv.year,
          make: inv.make,
          model: inv.model,
          location: inv.location,
          media: inv.media,
          ...(inv.type === 'manufactured_home' && {
            bedrooms: (inv as any).bedrooms,
            bathrooms: (inv as any).bathrooms,
            dimensions: (inv as any).dimensions
          }),
          ...(inv.type === 'rv' && {
            sleeps: (inv as any).sleeps,
            slides: (inv as any).slides,
            dimensions: (inv as any).dimensions
          })
        }
      }))
    }
  }

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleOverrideChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      overrides: {
        ...prev.overrides,
        [field]: value
      }
    }))
  }

  const handleLocationChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      overrides: {
        ...prev.overrides,
        location: {
          ...prev.overrides?.location,
          [field]: value
        }
      }
    }))
  }

  const handleMediaChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      overrides: {
        ...prev.overrides,
        media: {
          ...prev.overrides?.media,
          [field]: value
        }
      }
    }))
  }

  const handleDimensionsChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      overrides: {
        ...prev.overrides,
        dimensions: {
          ...prev.overrides?.dimensions,
          [field]: value
        }
      }
    }))
  }

  const handleExportMetaChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      exportMeta: {
        ...prev.exportMeta,
        [field]: value
      }
    }))
  }

  const addFeature = () => {
    const newFeature = prompt('Enter feature name:')
    if (newFeature && newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }))
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.inventoryId) {
      newErrors.inventoryId = 'Please select an inventory item'
    }

    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }

    if (formData.status === 'active') {
      if (!formData.salePrice && !formData.rentPrice) {
        newErrors.pricing = 'At least one price (sale or rent) is required for active listings'
      }
      
      if (!formData.overrides?.media?.primaryPhoto) {
        newErrors.primaryPhoto = 'Primary photo is required for active listings'
      }
      
      if (!formData.overrides?.location?.city) {
        newErrors.city = 'City is required for active listings'
      }
      
      if (!formData.overrides?.location?.state) {
        newErrors.state = 'State is required for active listings'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSave(formData)
    }
  }

  const getInventoryDisplayText = (inv: InventoryItem) => {
    return `${inv.year || ''} ${inv.make || ''} ${inv.model || ''} - ${inv.location?.city || 'Unknown'}, ${inv.location?.state || ''}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {listing ? 'Edit Listing' : 'Create New Listing'}
          </DialogTitle>
          <DialogDescription>
            {listing ? 'Update listing details and settings' : 'Create a new property listing from inventory'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Basic
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Details
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Media
              </TabsTrigger>
              <TabsTrigger value="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Export
              </TabsTrigger>
            </TabsList>

            {/* Basic Details Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Select inventory item and set basic listing details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Inventory Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="inventory">Inventory Item *</Label>
                    <Select
                      value={formData.inventoryId}
                      onValueChange={handleInventorySelect}
                    >
                      <SelectTrigger className={errors.inventoryId ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select inventory item" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventory.map((inv) => (
                          <SelectItem key={inv.id} value={inv.id}>
                            {getInventoryDisplayText(inv)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.inventoryId && (
                      <p className="text-sm text-red-500">{errors.inventoryId}</p>
                    )}
                  </div>

                  {selectedInventory && (
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Selected Inventory</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Type:</span> {selectedInventory.type}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Year:</span> {selectedInventory.year}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Make:</span> {selectedInventory.make}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Model:</span> {selectedInventory.model}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleFieldChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salePrice">Sale Price</Label>
                      <Input
                        id="salePrice"
                        type="number"
                        placeholder="0"
                        value={formData.salePrice || ''}
                        onChange={(e) => handleFieldChange('salePrice', e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rentPrice">Rent Price</Label>
                      <Input
                        id="rentPrice"
                        type="number"
                        placeholder="0"
                        value={formData.rentPrice || ''}
                        onChange={(e) => handleFieldChange('rentPrice', e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </div>
                  </div>
                  {errors.pricing && (
                    <p className="text-sm text-red-500">{errors.pricing}</p>
                  )}

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter detailed description of the property..."
                      value={formData.description || ''}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      className={cn(
                        "min-h-[100px]",
                        errors.description ? 'border-red-500' : ''
                      )}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">{errors.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Property Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Property Details
                  </CardTitle>
                  <CardDescription>
                    Override inventory details for this listing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Basic Property Info */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        type="number"
                        placeholder="2024"
                        value={formData.overrides?.year || selectedInventory?.year || ''}
                        onChange={(e) => handleOverrideChange('year', e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="make">Make</Label>
                      <Input
                        id="make"
                        placeholder="Clayton"
                        value={formData.overrides?.make || selectedInventory?.make || ''}
                        onChange={(e) => handleOverrideChange('make', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        placeholder="The Edge"
                        value={formData.overrides?.model || selectedInventory?.model || ''}
                        onChange={(e) => handleOverrideChange('model', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Type-specific fields */}
                  {(formData.listingType === 'manufactured_home' || selectedInventory?.type === 'manufactured_home') && (
                    <>
                      <Separator />
                      <h4 className="font-medium">Manufactured Home Details</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bedrooms">Bedrooms</Label>
                          <Input
                            id="bedrooms"
                            type="number"
                            placeholder="3"
                            value={formData.overrides?.bedrooms || (selectedInventory as any)?.bedrooms || ''}
                            onChange={(e) => handleOverrideChange('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bathrooms">Bathrooms</Label>
                          <Input
                            id="bathrooms"
                            type="number"
                            step="0.5"
                            placeholder="2"
                            value={formData.overrides?.bathrooms || (selectedInventory as any)?.bathrooms || ''}
                            onChange={(e) => handleOverrideChange('bathrooms', e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="squareFeet">Square Feet</Label>
                          <Input
                            id="squareFeet"
                            type="number"
                            placeholder="1450"
                            value={formData.overrides?.dimensions?.squareFeet || (selectedInventory as any)?.dimensions?.squareFeet || ''}
                            onChange={(e) => handleDimensionsChange('squareFeet', e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {(formData.listingType === 'rv' || selectedInventory?.type === 'rv') && (
                    <>
                      <Separator />
                      <h4 className="font-medium">RV Details</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="sleeps">Sleeps</Label>
                          <Input
                            id="sleeps"
                            type="number"
                            placeholder="6"
                            value={formData.overrides?.sleeps || (selectedInventory as any)?.sleeps || ''}
                            onChange={(e) => handleOverrideChange('sleeps', e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="slides">Slides</Label>
                          <Input
                            id="slides"
                            type="number"
                            placeholder="1"
                            value={formData.overrides?.slides || (selectedInventory as any)?.slides || ''}
                            onChange={(e) => handleOverrideChange('slides', e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="length">Length (ft)</Label>
                          <Input
                            id="length"
                            type="number"
                            placeholder="28"
                            value={formData.overrides?.dimensions?.length || (selectedInventory as any)?.dimensions?.length || ''}
                            onChange={(e) => handleDimensionsChange('length', e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Features */}
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Features</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Feature
                      </Button>
                    </div>
                    {formData.features && formData.features.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {feature}
                            <button
                              type="button"
                              onClick={() => removeFeature(index)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Media & Photos
                  </CardTitle>
                  <CardDescription>
                    Manage photos and media for this listing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryPhoto">Primary Photo URL *</Label>
                    <Input
                      id="primaryPhoto"
                      placeholder="https://example.com/photo.jpg"
                      value={formData.overrides?.media?.primaryPhoto || selectedInventory?.media?.primaryPhoto || ''}
                      onChange={(e) => handleMediaChange('primaryPhoto', e.target.value)}
                      className={errors.primaryPhoto ? 'border-red-500' : ''}
                    />
                    {errors.primaryPhoto && (
                      <p className="text-sm text-red-500">{errors.primaryPhoto}</p>
                    )}
                  </div>

                  {/* Photo Preview */}
                  {(formData.overrides?.media?.primaryPhoto || selectedInventory?.media?.primaryPhoto) && (
                    <div className="space-y-2">
                      <Label>Photo Preview</Label>
                      <div className="border rounded-lg overflow-hidden max-w-md">
                        <img
                          src={formData.overrides?.media?.primaryPhoto || selectedInventory?.media?.primaryPhoto}
                          alt="Primary photo preview"
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Additional Photos */}
                  <div className="space-y-2">
                    <Label>Additional Photos</Label>
                    <div className="text-sm text-muted-foreground mb-2">
                      Add additional photo URLs (one per line)
                    </div>
                    <Textarea
                      placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
                      value={(formData.overrides?.media?.photos || []).join('\n')}
                      onChange={(e) => {
                        const photos = e.target.value.split('\n').filter(url => url.trim())
                        handleMediaChange('photos', photos)
                      }}
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Location Tab */}
            <TabsContent value="location" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location Details
                  </CardTitle>
                  <CardDescription>
                    Set the location information for this listing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        placeholder="Austin"
                        value={formData.overrides?.location?.city || selectedInventory?.location?.city || ''}
                        onChange={(e) => handleLocationChange('city', e.target.value)}
                        className={errors.city ? 'border-red-500' : ''}
                      />
                      {errors.city && (
                        <p className="text-sm text-red-500">{errors.city}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        placeholder="TX"
                        maxLength={2}
                        value={formData.overrides?.location?.state || selectedInventory?.location?.state || ''}
                        onChange={(e) => handleLocationChange('state', e.target.value.toUpperCase())}
                        className={errors.state ? 'border-red-500' : ''}
                      />
                      {errors.state && (
                        <p className="text-sm text-red-500">{errors.state}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        placeholder="78701"
                        value={formData.overrides?.location?.postalCode || selectedInventory?.location?.postalCode || ''}
                        onChange={(e) => handleLocationChange('postalCode', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="township">Township</Label>
                      <Input
                        id="township"
                        placeholder="Travis County"
                        value={formData.overrides?.location?.township || selectedInventory?.location?.township || ''}
                        onChange={(e) => handleLocationChange('township', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schoolDistrict">School District</Label>
                    <Input
                      id="schoolDistrict"
                      placeholder="Austin ISD"
                      value={formData.overrides?.location?.schoolDistrict || selectedInventory?.location?.schoolDistrict || ''}
                      onChange={(e) => handleLocationChange('schoolDistrict', e.target.value)}
                    />
                  </div>

                  {/* Coordinates */}
                  <Separator />
                  <h4 className="font-medium">Coordinates (Optional)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        placeholder="30.2672"
                        value={formData.overrides?.location?.lat || selectedInventory?.location?.lat || ''}
                        onChange={(e) => handleLocationChange('lat', e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        placeholder="-97.7431"
                        value={formData.overrides?.location?.lng || selectedInventory?.location?.lng || ''}
                        onChange={(e) => handleLocationChange('lng', e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Export Settings Tab */}
            <TabsContent value="export" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Export & Syndication
                  </CardTitle>
                  <CardDescription>
                    Configure how this listing appears on external platforms
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="searchResultsText">Search Results Text</Label>
                    <Input
                      id="searchResultsText"
                      placeholder="2024 Clayton The Edge - 3BR/2BA"
                      maxLength={80}
                      value={formData.exportMeta?.SearchResultsText || ''}
                      onChange={(e) => handleExportMetaChange('SearchResultsText', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      How this listing appears in search results (max 80 characters)
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lotRent">Lot Rent</Label>
                      <Input
                        id="lotRent"
                        placeholder="450"
                        value={formData.exportMeta?.LotRent || ''}
                        onChange={(e) => handleExportMetaChange('LotRent', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxes">Annual Taxes</Label>
                      <Input
                        id="taxes"
                        placeholder="1200"
                        value={formData.exportMeta?.Taxes || ''}
                        onChange={(e) => handleExportMetaChange('Taxes', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Seller Information */}
                  <Separator />
                  <h4 className="font-medium">Seller Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sellerFirstName">Seller First Name</Label>
                      <Input
                        id="sellerFirstName"
                        placeholder="John"
                        value={formData.exportMeta?.SellerFirstName || ''}
                        onChange={(e) => handleExportMetaChange('SellerFirstName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sellerLastName">Seller Last Name</Label>
                      <Input
                        id="sellerLastName"
                        placeholder="Smith"
                        value={formData.exportMeta?.SellerLastName || ''}
                        onChange={(e) => handleExportMetaChange('SellerLastName', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sellerPhone">Seller Phone</Label>
                      <Input
                        id="sellerPhone"
                        placeholder="(555) 123-4567"
                        value={formData.exportMeta?.SellerPhone || ''}
                        onChange={(e) => handleExportMetaChange('SellerPhone', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sellerEmail">Seller Email</Label>
                      <Input
                        id="sellerEmail"
                        type="email"
                        placeholder="seller@company.com"
                        value={formData.exportMeta?.SellerEmail || ''}
                        onChange={(e) => handleExportMetaChange('SellerEmail', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sellerCompanyName">Company Name</Label>
                    <Input
                      id="sellerCompanyName"
                      placeholder="Demo RV Dealership"
                      value={formData.exportMeta?.SellerCompanyName || ''}
                      onChange={(e) => handleExportMetaChange('SellerCompanyName', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sellerWebsite">Website</Label>
                    <Input
                      id="sellerWebsite"
                      placeholder="https://company.com"
                      value={formData.exportMeta?.SellerWebsite || ''}
                      onChange={(e) => handleExportMetaChange('SellerWebsite', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Form Actions */}
          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.inventoryId}>
              {listing ? 'Update Listing' : 'Create Listing'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ListingForm