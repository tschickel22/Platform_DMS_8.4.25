import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { 
  Save, 
  X, 
  Upload, 
  MapPin, 
  DollarSign, 
  Home as HomeIcon,
  Truck,
  Wrench,
  Image as ImageIcon,
  Plus,
  Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface HomeFormData {
  // Basic Info
  homeType: 'rv' | 'manufactured_home' | ''
  inventoryId: string
  
  // Common Fields
  year: number | ''
  make: string
  model: string
  condition: 'new' | 'used' | 'certified'
  status: 'available' | 'reserved' | 'sold' | 'service' | 'delivered'
  
  // Pricing
  salePrice: number | ''
  rentPrice: number | ''
  cost: number | ''
  offerType: 'for_sale' | 'for_rent' | 'both'
  
  // Location
  location: {
    city: string
    state: string
    postalCode: string
    address?: string
    communityName?: string
    lotNumber?: string
  }
  
  // Media
  media: {
    primaryPhoto: string
    photos: string[]
  }
  
  // Description & Marketing
  description: string
  searchResultsText: string
  features: string[]
  
  // RV Specific Fields
  vin?: string
  sleeps?: number | ''
  slides?: number | ''
  length?: number | ''
  fuelType?: 'gasoline' | 'diesel' | 'electric' | 'hybrid'
  engine?: string
  transmission?: 'manual' | 'automatic'
  odometerMiles?: number | ''
  
  // Manufactured Home Specific Fields
  serialNumber?: string
  bedrooms?: number | ''
  bathrooms?: number | ''
  dimensions?: {
    width_ft?: number | ''
    length_ft?: number | ''
    sections?: number | ''
    sqft?: number | ''
  }
  
  // Features (different for each type)
  rvFeatures?: {
    generator?: boolean
    solar?: boolean
    awning?: boolean
    slideOut?: boolean
    garage?: boolean
  }
  
  mhFeatures?: {
    centralAir?: boolean
    fireplace?: boolean
    dishwasher?: boolean
    washerDryer?: boolean
    vaultedCeilings?: boolean
    deck?: boolean
    shed?: boolean
    energyStar?: boolean
  }
  
  // Timestamps
  createdAt?: string
  updatedAt?: string
}

interface AddEditHomeModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: HomeFormData) => void
  editingHome?: any
  mode: 'add' | 'edit'
}

const defaultFormData: HomeFormData = {
  homeType: '',
  inventoryId: '',
  year: '',
  make: '',
  model: '',
  condition: 'new',
  status: 'available',
  salePrice: '',
  rentPrice: '',
  cost: '',
  offerType: 'for_sale',
  location: {
    city: '',
    state: '',
    postalCode: '',
    address: '',
    communityName: '',
    lotNumber: ''
  },
  media: {
    primaryPhoto: '',
    photos: []
  },
  description: '',
  searchResultsText: '',
  features: [],
  dimensions: {
    width_ft: '',
    length_ft: '',
    sections: '',
    sqft: ''
  },
  rvFeatures: {
    generator: false,
    solar: false,
    awning: false,
    slideOut: false,
    garage: false
  },
  mhFeatures: {
    centralAir: false,
    fireplace: false,
    dishwasher: false,
    washerDryer: false,
    vaultedCeilings: false,
    deck: false,
    shed: false,
    energyStar: false
  }
}

const stateOptions = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

const rvMakes = [
  'Airstream', 'Coachmen', 'Forest River', 'Jayco', 'Keystone', 
  'Thor', 'Winnebago', 'Grand Design', 'Heartland', 'Dutchmen',
  'Palomino', 'Gulf Stream', 'Northwood', 'Prime Time', 'KZ'
]

const mhMakes = [
  'Clayton', 'Champion', 'Fleetwood', 'Skyline', 'Cavco',
  'Nobility', 'Redman', 'Schult', 'Southern Energy', 'TRU'
]

const commonFeatures = [
  'Air Conditioning', 'Heating', 'Kitchen', 'Bathroom', 'Storage',
  'Entertainment System', 'WiFi Ready', 'Pet Friendly', 'Smoke Free'
]

export default function AddEditHomeModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingHome, 
  mode 
}: AddEditHomeModalProps) {
  const [formData, setFormData] = useState<HomeFormData>(defaultFormData)
  const [activeTab, setActiveTab] = useState('basic')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Load editing data
  useEffect(() => {
    if (mode === 'edit' && editingHome) {
      setFormData({
        ...defaultFormData,
        ...editingHome,
        homeType: editingHome.listingType || '',
        dimensions: {
          ...defaultFormData.dimensions,
          ...editingHome.dimensions
        },
        rvFeatures: {
          ...defaultFormData.rvFeatures,
          ...editingHome.features
        },
        mhFeatures: {
          ...defaultFormData.mhFeatures,
          ...editingHome.features
        }
      })
    } else {
      setFormData(defaultFormData)
    }
  }, [mode, editingHome, isOpen])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData(defaultFormData)
      setActiveTab('basic')
      setErrors({})
    }
  }, [isOpen])

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => {
      const keys = field.split('.')
      if (keys.length === 1) {
        return { ...prev, [field]: value }
      } else if (keys.length === 2) {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0] as keyof HomeFormData],
            [keys[1]]: value
          }
        }
      }
      return prev
    })
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.homeType) newErrors.homeType = 'Home type is required'
    if (!formData.year) newErrors.year = 'Year is required'
    if (!formData.make) newErrors.make = 'Make is required'
    if (!formData.model) newErrors.model = 'Model is required'
    if (!formData.inventoryId) newErrors.inventoryId = 'Inventory ID is required'
    
    if (formData.offerType === 'for_sale' || formData.offerType === 'both') {
      if (!formData.salePrice) newErrors.salePrice = 'Sale price is required'
    }
    if (formData.offerType === 'for_rent' || formData.offerType === 'both') {
      if (!formData.rentPrice) newErrors.rentPrice = 'Rent price is required'
    }
    
    if (!formData.location.city) newErrors['location.city'] = 'City is required'
    if (!formData.location.state) newErrors['location.state'] = 'State is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Generate inventory ID if not provided
      if (!formData.inventoryId) {
        const prefix = formData.homeType === 'rv' ? 'INV-RV' : 'INV-MH'
        const timestamp = Date.now().toString().slice(-6)
        formData.inventoryId = `${prefix}-${timestamp}`
      }

      // Set timestamps
      const now = new Date().toISOString()
      if (mode === 'add') {
        formData.createdAt = now
      }
      formData.updatedAt = now

      await onSave(formData)
      
      toast({
        title: mode === 'add' ? 'Home Added' : 'Home Updated',
        description: `${formData.year} ${formData.make} ${formData.model} has been ${mode === 'add' ? 'added' : 'updated'} successfully.`
      })
      
      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${mode} home. Please try again.`,
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addFeature = (feature: string) => {
    if (!formData.features.includes(feature)) {
      updateFormData('features', [...formData.features, feature])
    }
  }

  const removeFeature = (feature: string) => {
    updateFormData('features', formData.features.filter(f => f !== feature))
  }

  const addPhoto = (url: string) => {
    updateFormData('media.photos', [...formData.media.photos, url])
  }

  const removePhoto = (index: number) => {
    const newPhotos = formData.media.photos.filter((_, i) => i !== index)
    updateFormData('media.photos', newPhotos)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <HomeIcon className="h-5 w-5" />
            {mode === 'add' ? 'Add New Home' : 'Edit Home'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Home Type Selection - Always First */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Home Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => updateFormData('homeType', 'rv')}
                    className={cn(
                      'p-4 border-2 rounded-lg text-left transition-all',
                      formData.homeType === 'rv'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="h-6 w-6 text-primary" />
                      <div>
                        <div className="font-medium">RV</div>
                        <div className="text-sm text-muted-foreground">
                          Recreational Vehicles, Motorhomes, Travel Trailers
                        </div>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => updateFormData('homeType', 'manufactured_home')}
                    className={cn(
                      'p-4 border-2 rounded-lg text-left transition-all',
                      formData.homeType === 'manufactured_home'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <HomeIcon className="h-6 w-6 text-primary" />
                      <div>
                        <div className="font-medium">Manufactured Home</div>
                        <div className="text-sm text-muted-foreground">
                          Mobile Homes, Modular Homes, Park Models
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
                {errors.homeType && (
                  <p className="text-sm text-destructive mt-2">{errors.homeType}</p>
                )}
              </CardContent>
            </Card>

            {/* Form Tabs - Only show after home type is selected */}
            {formData.homeType && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
                  <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
                  <TabsTrigger value="specs" className="text-xs">Specs</TabsTrigger>
                  <TabsTrigger value="pricing" className="text-xs">Pricing</TabsTrigger>
                  <TabsTrigger value="location" className="text-xs">Location</TabsTrigger>
                  <TabsTrigger value="features" className="text-xs">Features</TabsTrigger>
                  <TabsTrigger value="media" className="text-xs">Media</TabsTrigger>
                </TabsList>

                {/* Basic Information Tab */}
                <TabsContent value="basic" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <HomeIcon className="h-5 w-5" />
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="inventoryId">Inventory ID *</Label>
                          <Input
                            id="inventoryId"
                            value={formData.inventoryId}
                            onChange={(e) => updateFormData('inventoryId', e.target.value)}
                            placeholder="INV-001"
                            className={errors.inventoryId ? 'border-destructive' : ''}
                          />
                          {errors.inventoryId && (
                            <p className="text-sm text-destructive mt-1">{errors.inventoryId}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="year">Year *</Label>
                          <Input
                            id="year"
                            type="number"
                            value={formData.year}
                            onChange={(e) => updateFormData('year', parseInt(e.target.value) || '')}
                            placeholder="2024"
                            min="1900"
                            max={new Date().getFullYear() + 1}
                            className={errors.year ? 'border-destructive' : ''}
                          />
                          {errors.year && (
                            <p className="text-sm text-destructive mt-1">{errors.year}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="make">Make *</Label>
                          <Select 
                            value={formData.make} 
                            onValueChange={(value) => updateFormData('make', value)}
                          >
                            <SelectTrigger className={errors.make ? 'border-destructive' : ''}>
                              <SelectValue placeholder="Select make" />
                            </SelectTrigger>
                            <SelectContent>
                              {(formData.homeType === 'rv' ? rvMakes : mhMakes).map((make) => (
                                <SelectItem key={make} value={make}>{make}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.make && (
                            <p className="text-sm text-destructive mt-1">{errors.make}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="model">Model *</Label>
                          <Input
                            id="model"
                            value={formData.model}
                            onChange={(e) => updateFormData('model', e.target.value)}
                            placeholder="Model name"
                            className={errors.model ? 'border-destructive' : ''}
                          />
                          {errors.model && (
                            <p className="text-sm text-destructive mt-1">{errors.model}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="condition">Condition</Label>
                          <Select 
                            value={formData.condition} 
                            onValueChange={(value) => updateFormData('condition', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="used">Used</SelectItem>
                              <SelectItem value="certified">Certified Pre-Owned</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Select 
                            value={formData.status} 
                            onValueChange={(value) => updateFormData('status', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="reserved">Reserved</SelectItem>
                              <SelectItem value="sold">Sold</SelectItem>
                              <SelectItem value="service">In Service</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Type-specific ID field */}
                      <div>
                        <Label htmlFor="typeId">
                          {formData.homeType === 'rv' ? 'VIN' : 'Serial Number'}
                        </Label>
                        <Input
                          id="typeId"
                          value={formData.homeType === 'rv' ? formData.vin || '' : formData.serialNumber || ''}
                          onChange={(e) => updateFormData(
                            formData.homeType === 'rv' ? 'vin' : 'serialNumber', 
                            e.target.value
                          )}
                          placeholder={formData.homeType === 'rv' ? 'Vehicle Identification Number' : 'Serial Number'}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Specifications Tab */}
                <TabsContent value="specs" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wrench className="h-5 w-5" />
                        Specifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {formData.homeType === 'rv' && (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="sleeps">Sleeps</Label>
                              <Input
                                id="sleeps"
                                type="number"
                                value={formData.sleeps || ''}
                                onChange={(e) => updateFormData('sleeps', parseInt(e.target.value) || '')}
                                placeholder="4"
                                min="1"
                                max="20"
                              />
                            </div>

                            <div>
                              <Label htmlFor="slides">Slide Outs</Label>
                              <Input
                                id="slides"
                                type="number"
                                value={formData.slides || ''}
                                onChange={(e) => updateFormData('slides', parseInt(e.target.value) || '')}
                                placeholder="1"
                                min="0"
                                max="10"
                              />
                            </div>

                            <div>
                              <Label htmlFor="length">Length (ft)</Label>
                              <Input
                                id="length"
                                type="number"
                                value={formData.length || ''}
                                onChange={(e) => updateFormData('length', parseFloat(e.target.value) || '')}
                                placeholder="28.5"
                                step="0.1"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="fuelType">Fuel Type</Label>
                              <Select 
                                value={formData.fuelType || ''} 
                                onValueChange={(value) => updateFormData('fuelType', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select fuel type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="gasoline">Gasoline</SelectItem>
                                  <SelectItem value="diesel">Diesel</SelectItem>
                                  <SelectItem value="electric">Electric</SelectItem>
                                  <SelectItem value="hybrid">Hybrid</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="transmission">Transmission</Label>
                              <Select 
                                value={formData.transmission || ''} 
                                onValueChange={(value) => updateFormData('transmission', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select transmission" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="automatic">Automatic</SelectItem>
                                  <SelectItem value="manual">Manual</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="engine">Engine</Label>
                              <Input
                                id="engine"
                                value={formData.engine || ''}
                                onChange={(e) => updateFormData('engine', e.target.value)}
                                placeholder="Ford V10"
                              />
                            </div>

                            <div>
                              <Label htmlFor="odometerMiles">Odometer (miles)</Label>
                              <Input
                                id="odometerMiles"
                                type="number"
                                value={formData.odometerMiles || ''}
                                onChange={(e) => updateFormData('odometerMiles', parseInt(e.target.value) || '')}
                                placeholder="15000"
                                min="0"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {formData.homeType === 'manufactured_home' && (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="bedrooms">Bedrooms</Label>
                              <Input
                                id="bedrooms"
                                type="number"
                                value={formData.bedrooms || ''}
                                onChange={(e) => updateFormData('bedrooms', parseInt(e.target.value) || '')}
                                placeholder="3"
                                min="1"
                                max="10"
                              />
                            </div>

                            <div>
                              <Label htmlFor="bathrooms">Bathrooms</Label>
                              <Input
                                id="bathrooms"
                                type="number"
                                value={formData.bathrooms || ''}
                                onChange={(e) => updateFormData('bathrooms', parseFloat(e.target.value) || '')}
                                placeholder="2"
                                step="0.5"
                                min="1"
                                max="10"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <Label htmlFor="width_ft">Width (ft)</Label>
                              <Input
                                id="width_ft"
                                type="number"
                                value={formData.dimensions?.width_ft || ''}
                                onChange={(e) => updateFormData('dimensions.width_ft', parseInt(e.target.value) || '')}
                                placeholder="28"
                              />
                            </div>

                            <div>
                              <Label htmlFor="length_ft">Length (ft)</Label>
                              <Input
                                id="length_ft"
                                type="number"
                                value={formData.dimensions?.length_ft || ''}
                                onChange={(e) => updateFormData('dimensions.length_ft', parseInt(e.target.value) || '')}
                                placeholder="66"
                              />
                            </div>

                            <div>
                              <Label htmlFor="sections">Sections</Label>
                              <Input
                                id="sections"
                                type="number"
                                value={formData.dimensions?.sections || ''}
                                onChange={(e) => updateFormData('dimensions.sections', parseInt(e.target.value) || '')}
                                placeholder="2"
                                min="1"
                                max="3"
                              />
                            </div>

                            <div>
                              <Label htmlFor="sqft">Square Feet</Label>
                              <Input
                                id="sqft"
                                type="number"
                                value={formData.dimensions?.sqft || ''}
                                onChange={(e) => updateFormData('dimensions.sqft', parseInt(e.target.value) || '')}
                                placeholder="1450"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Pricing Tab */}
                <TabsContent value="pricing" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Pricing Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="offerType">Offer Type</Label>
                        <Select 
                          value={formData.offerType} 
                          onValueChange={(value) => updateFormData('offerType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="for_sale">For Sale Only</SelectItem>
                            <SelectItem value="for_rent">For Rent Only</SelectItem>
                            <SelectItem value="both">Both Sale & Rent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(formData.offerType === 'for_sale' || formData.offerType === 'both') && (
                          <div>
                            <Label htmlFor="salePrice">Sale Price *</Label>
                            <Input
                              id="salePrice"
                              type="number"
                              value={formData.salePrice || ''}
                              onChange={(e) => updateFormData('salePrice', parseFloat(e.target.value) || '')}
                              placeholder="45000"
                              min="0"
                              className={errors.salePrice ? 'border-destructive' : ''}
                            />
                            {errors.salePrice && (
                              <p className="text-sm text-destructive mt-1">{errors.salePrice}</p>
                            )}
                          </div>
                        )}

                        {(formData.offerType === 'for_rent' || formData.offerType === 'both') && (
                          <div>
                            <Label htmlFor="rentPrice">Rent Price *</Label>
                            <Input
                              id="rentPrice"
                              type="number"
                              value={formData.rentPrice || ''}
                              onChange={(e) => updateFormData('rentPrice', parseFloat(e.target.value) || '')}
                              placeholder="350"
                              min="0"
                              className={errors.rentPrice ? 'border-destructive' : ''}
                            />
                            {errors.rentPrice && (
                              <p className="text-sm text-destructive mt-1">{errors.rentPrice}</p>
                            )}
                          </div>
                        )}

                        <div>
                          <Label htmlFor="cost">Cost (Internal)</Label>
                          <Input
                            id="cost"
                            type="number"
                            value={formData.cost || ''}
                            onChange={(e) => updateFormData('cost', parseFloat(e.target.value) || '')}
                            placeholder="35000"
                            min="0"
                          />
                        </div>
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
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={formData.location.city}
                            onChange={(e) => updateFormData('location.city', e.target.value)}
                            placeholder="Phoenix"
                            className={errors['location.city'] ? 'border-destructive' : ''}
                          />
                          {errors['location.city'] && (
                            <p className="text-sm text-destructive mt-1">{errors['location.city']}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="state">State *</Label>
                          <Select 
                            value={formData.location.state} 
                            onValueChange={(value) => updateFormData('location.state', value)}
                          >
                            <SelectTrigger className={errors['location.state'] ? 'border-destructive' : ''}>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {stateOptions.map((state) => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors['location.state'] && (
                            <p className="text-sm text-destructive mt-1">{errors['location.state']}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input
                            id="postalCode"
                            value={formData.location.postalCode}
                            onChange={(e) => updateFormData('location.postalCode', e.target.value)}
                            placeholder="85001"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address">Street Address</Label>
                        <Input
                          id="address"
                          value={formData.location.address || ''}
                          onChange={(e) => updateFormData('location.address', e.target.value)}
                          placeholder="123 Main Street"
                        />
                      </div>

                      {formData.homeType === 'manufactured_home' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="communityName">Community Name</Label>
                            <Input
                              id="communityName"
                              value={formData.location.communityName || ''}
                              onChange={(e) => updateFormData('location.communityName', e.target.value)}
                              placeholder="Sunset Palms Mobile Home Community"
                            />
                          </div>

                          <div>
                            <Label htmlFor="lotNumber">Lot Number</Label>
                            <Input
                              id="lotNumber"
                              value={formData.location.lotNumber || ''}
                              onChange={(e) => updateFormData('location.lotNumber', e.target.value)}
                              placeholder="42"
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Features Tab */}
                <TabsContent value="features" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Features & Amenities</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Type-specific features */}
                      {formData.homeType === 'rv' && (
                        <div>
                          <Label className="text-base font-medium">RV Features</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                            {Object.entries(formData.rvFeatures || {}).map(([key, value]) => (
                              <div key={key} className="flex items-center space-x-2">
                                <Checkbox
                                  id={key}
                                  checked={value}
                                  onCheckedChange={(checked) => 
                                    updateFormData(`rvFeatures.${key}`, checked)
                                  }
                                />
                                <Label htmlFor={key} className="capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {formData.homeType === 'manufactured_home' && (
                        <div>
                          <Label className="text-base font-medium">Home Features</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                            {Object.entries(formData.mhFeatures || {}).map(([key, value]) => (
                              <div key={key} className="flex items-center space-x-2">
                                <Checkbox
                                  id={key}
                                  checked={value}
                                  onCheckedChange={(checked) => 
                                    updateFormData(`mhFeatures.${key}`, checked)
                                  }
                                />
                                <Label htmlFor={key} className="capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <Separator />

                      {/* Custom Features */}
                      <div>
                        <Label className="text-base font-medium">Additional Features</Label>
                        <div className="mt-3 space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {formData.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                {feature}
                                <button
                                  type="button"
                                  onClick={() => removeFeature(feature)}
                                  className="ml-1 hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {commonFeatures
                              .filter(f => !formData.features.includes(f))
                              .map((feature) => (
                                <Button
                                  key={feature}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addFeature(feature)}
                                  className="text-xs"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  {feature}
                                </Button>
                              ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Media Tab */}
                <TabsContent value="media" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Photos & Media
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="primaryPhoto">Primary Photo URL</Label>
                        <Input
                          id="primaryPhoto"
                          value={formData.media.primaryPhoto}
                          onChange={(e) => updateFormData('media.primaryPhoto', e.target.value)}
                          placeholder="https://example.com/photo.jpg"
                        />
                      </div>

                      <div>
                        <Label className="text-base font-medium">Additional Photos</Label>
                        <div className="space-y-3 mt-3">
                          {formData.media.photos.map((photo, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={photo}
                                onChange={(e) => {
                                  const newPhotos = [...formData.media.photos]
                                  newPhotos[index] = e.target.value
                                  updateFormData('media.photos', newPhotos)
                                }}
                                placeholder="Photo URL"
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removePhoto(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addPhoto('')}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Photo URL
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Marketing Content</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => updateFormData('description', e.target.value)}
                          placeholder="Detailed description of the home..."
                          rows={4}
                        />
                      </div>

                      <div>
                        <Label htmlFor="searchResultsText">Search Results Text</Label>
                        <Input
                          id="searchResultsText"
                          value={formData.searchResultsText}
                          onChange={(e) => updateFormData('searchResultsText', e.target.value)}
                          placeholder="2023 Forest River Cherokee - 28ft Travel Trailer"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          This text appears in search results and listings
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-card px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || !formData.homeType}
              className="sm:min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {mode === 'add' ? 'Add Home' : 'Save Changes'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}