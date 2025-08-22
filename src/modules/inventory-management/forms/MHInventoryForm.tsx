import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Save, 
  X, 
  Upload, 
  MapPin, 
  DollarSign, 
  Home, 
  Settings,
  Image as ImageIcon,
  FileText,
  Tag,
  Calendar
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { ManufacturedHomeInventory } from '../types'
import { formatCurrency } from '@/lib/utils'

interface MHInventoryFormProps {
  initialData?: Partial<ManufacturedHomeInventory>
  onSave: (data: ManufacturedHomeInventory) => Promise<void>
  onCancel: () => void
  mode: 'create' | 'edit'
}

const defaultMHData: Partial<ManufacturedHomeInventory> = {
  listingType: 'manufactured_home',
  condition: 'new',
  status: 'available',
  offerType: 'for_sale',
  bedrooms: 3,
  bathrooms: 2,
  dimensions: {
    width_ft: 28,
    length_ft: 66,
    sections: 2,
    squareFootage: 1848
  },
  features: {
    centralAir: true,
    fireplace: false,
    dishwasher: true,
    washerDryer: false,
    vaultedCeilings: false,
    deck: false,
    shed: false,
    energyStar: false
  },
  location: {
    city: '',
    state: '',
    postalCode: '',
    communityName: '',
    lotNumber: '',
    coordinates: { lat: 0, lng: 0 }
  },
  media: {
    primaryPhoto: '',
    photos: [],
    virtualTour: '',
    videoUrl: ''
  },
  seo: {
    keywords: [],
    metaDescription: '',
    searchResultsText: ''
  },
  analytics: {
    views: 0,
    leads: 0,
    lastViewed: null,
    conversionRate: 0
  }
}

const conditionOptions = [
  { value: 'new', label: 'New' },
  { value: 'used', label: 'Used' },
  { value: 'refurbished', label: 'Refurbished' }
]

const statusOptions = [
  { value: 'available', label: 'Available' },
  { value: 'pending', label: 'Pending' },
  { value: 'sold', label: 'Sold' },
  { value: 'reserved', label: 'Reserved' }
]

const offerTypeOptions = [
  { value: 'for_sale', label: 'For Sale' },
  { value: 'for_rent', label: 'For Rent' },
  { value: 'both', label: 'Both Sale & Rent' }
]

const stateOptions = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

export default function MHInventoryForm({ initialData, onSave, onCancel, mode }: MHInventoryFormProps) {
  const [formData, setFormData] = useState<ManufacturedHomeInventory>({
    ...defaultMHData,
    ...initialData,
    id: initialData?.id || `mh-${Date.now()}`,
    createdAt: initialData?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  } as ManufacturedHomeInventory)

  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState('basic')

  // Photo upload handling
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach(file => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64 = reader.result as string
          setFormData(prev => ({
            ...prev,
            media: {
              ...prev.media,
              photos: [...prev.media.photos, base64],
              primaryPhoto: prev.media.primaryPhoto || base64
            }
          }))
        }
        reader.readAsDataURL(file)
      })
    }
  })

  const updateField = (path: string, value: any) => {
    setFormData(prev => {
      const keys = path.split('.')
      const updated = { ...prev }
      let current: any = updated
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return updated
    })
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title?.trim()) newErrors.title = 'Title is required'
    if (!formData.make?.trim()) newErrors.make = 'Make is required'
    if (!formData.model?.trim()) newErrors.model = 'Model is required'
    if (!formData.year || formData.year < 1900) newErrors.year = 'Valid year is required'
    if (!formData.serialNumber?.trim()) newErrors.serialNumber = 'Serial number is required'
    if (!formData.location.city?.trim()) newErrors['location.city'] = 'City is required'
    if (!formData.location.state?.trim()) newErrors['location.state'] = 'State is required'

    if (formData.offerType === 'for_sale' || formData.offerType === 'both') {
      if (!formData.salePrice || formData.salePrice <= 0) {
        newErrors.salePrice = 'Sale price is required'
      }
    }

    if (formData.offerType === 'for_rent' || formData.offerType === 'both') {
      if (!formData.rentPrice || formData.rentPrice <= 0) {
        newErrors.rentPrice = 'Rent price is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSaving(true)
    try {
      // Calculate search results text
      const searchText = `${formData.year} ${formData.make} ${formData.model} - ${formData.bedrooms}BR/${formData.bathrooms}BA ${formData.dimensions.sections === 1 ? 'Single' : formData.dimensions.sections === 2 ? 'Double' : 'Triple'}-wide`
      
      const finalData = {
        ...formData,
        seo: {
          ...formData.seo,
          searchResultsText: searchText
        },
        updatedAt: new Date().toISOString()
      }

      await onSave(finalData)
    } catch (error) {
      console.error('Error saving manufactured home:', error)
    } finally {
      setSaving(false)
    }
  }

  const removePrimaryPhoto = () => {
    setFormData(prev => ({
      ...prev,
      media: {
        ...prev.media,
        primaryPhoto: '',
        photos: prev.media.photos.filter(p => p !== prev.media.primaryPhoto)
      }
    }))
  }

  const removePhoto = (photoToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      media: {
        ...prev.media,
        photos: prev.media.photos.filter(p => p !== photoToRemove),
        primaryPhoto: prev.media.primaryPhoto === photoToRemove ? 
          (prev.media.photos.find(p => p !== photoToRemove) || '') : 
          prev.media.primaryPhoto
      }
    }))
  }

  const setPrimaryPhoto = (photo: string) => {
    setFormData(prev => ({
      ...prev,
      media: {
        ...prev.media,
        primaryPhoto: photo
      }
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inventory
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {mode === 'create' ? 'Add New' : 'Edit'} Manufactured Home
              </h1>
              <p className="text-muted-foreground">
                {mode === 'create' ? 'Create a new manufactured home listing' : 'Update manufactured home details'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="media">Media & SEO</TabsTrigger>
            </TabsList>

            {/* Basic Information */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Essential details about the manufactured home
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Listing Title *</Label>
                      <Input
                        id="title"
                        value={formData.title || ''}
                        onChange={(e) => updateField('title', e.target.value)}
                        placeholder="e.g., Beautiful 3BR/2BA Double-wide"
                        className={errors.title ? 'border-red-500' : ''}
                      />
                      {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                    </div>

                    <div>
                      <Label htmlFor="inventoryId">Inventory ID</Label>
                      <Input
                        id="inventoryId"
                        value={formData.inventoryId || ''}
                        onChange={(e) => updateField('inventoryId', e.target.value)}
                        placeholder="e.g., INV-MH-001"
                      />
                    </div>

                    <div>
                      <Label htmlFor="year">Year *</Label>
                      <Input
                        id="year"
                        type="number"
                        value={formData.year || ''}
                        onChange={(e) => updateField('year', parseInt(e.target.value) || 0)}
                        placeholder="e.g., 2023"
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        className={errors.year ? 'border-red-500' : ''}
                      />
                      {errors.year && <p className="text-sm text-red-500 mt-1">{errors.year}</p>}
                    </div>

                    <div>
                      <Label htmlFor="make">Make *</Label>
                      <Input
                        id="make"
                        value={formData.make || ''}
                        onChange={(e) => updateField('make', e.target.value)}
                        placeholder="e.g., Clayton"
                        className={errors.make ? 'border-red-500' : ''}
                      />
                      {errors.make && <p className="text-sm text-red-500 mt-1">{errors.make}</p>}
                    </div>

                    <div>
                      <Label htmlFor="model">Model *</Label>
                      <Input
                        id="model"
                        value={formData.model || ''}
                        onChange={(e) => updateField('model', e.target.value)}
                        placeholder="e.g., The Edge"
                        className={errors.model ? 'border-red-500' : ''}
                      />
                      {errors.model && <p className="text-sm text-red-500 mt-1">{errors.model}</p>}
                    </div>

                    <div>
                      <Label htmlFor="serialNumber">Serial Number *</Label>
                      <Input
                        id="serialNumber"
                        value={formData.serialNumber || ''}
                        onChange={(e) => updateField('serialNumber', e.target.value)}
                        placeholder="e.g., CL123456789"
                        className={errors.serialNumber ? 'border-red-500' : ''}
                      />
                      {errors.serialNumber && <p className="text-sm text-red-500 mt-1">{errors.serialNumber}</p>}
                    </div>

                    <div>
                      <Label htmlFor="condition">Condition</Label>
                      <Select value={formData.condition} onValueChange={(value) => updateField('condition', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {conditionOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => updateField('status', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="offerType">Offer Type</Label>
                      <Select value={formData.offerType} onValueChange={(value) => updateField('offerType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select offer type" />
                        </SelectTrigger>
                        <SelectContent>
                          {offerTypeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ''}
                      onChange={(e) => updateField('description', e.target.value)}
                      placeholder="Detailed description of the manufactured home..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Specifications */}
            <TabsContent value="specifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Home Specifications
                  </CardTitle>
                  <CardDescription>
                    Detailed specifications and dimensions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Layout */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Layout</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input
                          id="bedrooms"
                          type="number"
                          value={formData.bedrooms || ''}
                          onChange={(e) => updateField('bedrooms', parseInt(e.target.value) || 0)}
                          min="1"
                          max="6"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Input
                          id="bathrooms"
                          type="number"
                          step="0.5"
                          value={formData.bathrooms || ''}
                          onChange={(e) => updateField('bathrooms', parseFloat(e.target.value) || 0)}
                          min="1"
                          max="4"
                        />
                      </div>
                      <div>
                        <Label htmlFor="sections">Sections</Label>
                        <Select 
                          value={formData.dimensions.sections?.toString()} 
                          onValueChange={(value) => updateField('dimensions.sections', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select sections" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Single-wide</SelectItem>
                            <SelectItem value="2">Double-wide</SelectItem>
                            <SelectItem value="3">Triple-wide</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Dimensions */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Dimensions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="width">Width (ft)</Label>
                        <Input
                          id="width"
                          type="number"
                          value={formData.dimensions.width_ft || ''}
                          onChange={(e) => updateField('dimensions.width_ft', parseInt(e.target.value) || 0)}
                          min="12"
                          max="32"
                        />
                      </div>
                      <div>
                        <Label htmlFor="length">Length (ft)</Label>
                        <Input
                          id="length"
                          type="number"
                          value={formData.dimensions.length_ft || ''}
                          onChange={(e) => updateField('dimensions.length_ft', parseInt(e.target.value) || 0)}
                          min="40"
                          max="100"
                        />
                      </div>
                      <div>
                        <Label htmlFor="squareFootage">Square Footage</Label>
                        <Input
                          id="squareFootage"
                          type="number"
                          value={formData.dimensions.squareFootage || ''}
                          onChange={(e) => updateField('dimensions.squareFootage', parseInt(e.target.value) || 0)}
                          min="400"
                          max="3000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ceilingHeight">Ceiling Height (ft)</Label>
                        <Input
                          id="ceilingHeight"
                          type="number"
                          step="0.5"
                          value={formData.dimensions.ceilingHeight || ''}
                          onChange={(e) => updateField('dimensions.ceilingHeight', parseFloat(e.target.value) || 0)}
                          min="7"
                          max="12"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Construction Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Construction</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="roofType">Roof Type</Label>
                        <Select 
                          value={formData.construction?.roofType || ''} 
                          onValueChange={(value) => updateField('construction.roofType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select roof type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="shingle">Shingle</SelectItem>
                            <SelectItem value="metal">Metal</SelectItem>
                            <SelectItem value="rubber">Rubber</SelectItem>
                            <SelectItem value="tile">Tile</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="sidingType">Siding Type</Label>
                        <Select 
                          value={formData.construction?.sidingType || ''} 
                          onValueChange={(value) => updateField('construction.sidingType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select siding type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vinyl">Vinyl</SelectItem>
                            <SelectItem value="fiber_cement">Fiber Cement</SelectItem>
                            <SelectItem value="wood">Wood</SelectItem>
                            <SelectItem value="metal">Metal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="flooringType">Primary Flooring</Label>
                        <Select 
                          value={formData.construction?.flooringType || ''} 
                          onValueChange={(value) => updateField('construction.flooringType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select flooring" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="carpet">Carpet</SelectItem>
                            <SelectItem value="laminate">Laminate</SelectItem>
                            <SelectItem value="vinyl">Vinyl</SelectItem>
                            <SelectItem value="hardwood">Hardwood</SelectItem>
                            <SelectItem value="tile">Tile</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="foundationType">Foundation</Label>
                        <Select 
                          value={formData.construction?.foundationType || ''} 
                          onValueChange={(value) => updateField('construction.foundationType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select foundation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pier_beam">Pier & Beam</SelectItem>
                            <SelectItem value="concrete_slab">Concrete Slab</SelectItem>
                            <SelectItem value="crawl_space">Crawl Space</SelectItem>
                            <SelectItem value="basement">Basement</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pricing */}
            <TabsContent value="pricing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Pricing Information
                  </CardTitle>
                  <CardDescription>
                    Set pricing for sale and/or rental
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Sale Pricing */}
                  {(formData.offerType === 'for_sale' || formData.offerType === 'both') && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Sale Pricing</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="salePrice">Sale Price *</Label>
                          <Input
                            id="salePrice"
                            type="number"
                            value={formData.salePrice || ''}
                            onChange={(e) => updateField('salePrice', parseInt(e.target.value) || 0)}
                            placeholder="e.g., 95000"
                            className={errors.salePrice ? 'border-red-500' : ''}
                          />
                          {errors.salePrice && <p className="text-sm text-red-500 mt-1">{errors.salePrice}</p>}
                        </div>
                        <div>
                          <Label htmlFor="cost">Cost Basis</Label>
                          <Input
                            id="cost"
                            type="number"
                            value={formData.cost || ''}
                            onChange={(e) => updateField('cost', parseInt(e.target.value) || 0)}
                            placeholder="e.g., 75000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="downPayment">Min Down Payment</Label>
                          <Input
                            id="downPayment"
                            type="number"
                            value={formData.pricing?.downPayment || ''}
                            onChange={(e) => updateField('pricing.downPayment', parseInt(e.target.value) || 0)}
                            placeholder="e.g., 5000"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rental Pricing */}
                  {(formData.offerType === 'for_rent' || formData.offerType === 'both') && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Rental Pricing</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <Label htmlFor="rentPrice">Monthly Rent *</Label>
                            <Input
                              id="rentPrice"
                              type="number"
                              value={formData.rentPrice || ''}
                              onChange={(e) => updateField('rentPrice', parseInt(e.target.value) || 0)}
                              placeholder="e.g., 1200"
                              className={errors.rentPrice ? 'border-red-500' : ''}
                            />
                            {errors.rentPrice && <p className="text-sm text-red-500 mt-1">{errors.rentPrice}</p>}
                          </div>
                          <div>
                            <Label htmlFor="lotRent">Lot Rent</Label>
                            <Input
                              id="lotRent"
                              type="number"
                              value={formData.lotRent || ''}
                              onChange={(e) => updateField('lotRent', parseInt(e.target.value) || 0)}
                              placeholder="e.g., 300"
                            />
                          </div>
                          <div>
                            <Label htmlFor="securityDeposit">Security Deposit</Label>
                            <Input
                              id="securityDeposit"
                              type="number"
                              value={formData.pricing?.securityDeposit || ''}
                              onChange={(e) => updateField('pricing.securityDeposit', parseInt(e.target.value) || 0)}
                              placeholder="e.g., 1200"
                            />
                          </div>
                          <div>
                            <Label htmlFor="petDeposit">Pet Deposit</Label>
                            <Input
                              id="petDeposit"
                              type="number"
                              value={formData.pricing?.petDeposit || ''}
                              onChange={(e) => updateField('pricing.petDeposit', parseInt(e.target.value) || 0)}
                              placeholder="e.g., 300"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <Separator />

                  {/* Additional Costs */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Additional Costs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="taxes">Annual Taxes</Label>
                        <Input
                          id="taxes"
                          type="number"
                          value={formData.taxes || ''}
                          onChange={(e) => updateField('taxes', parseInt(e.target.value) || 0)}
                          placeholder="e.g., 1200"
                        />
                      </div>
                      <div>
                        <Label htmlFor="hoaFees">HOA Fees (monthly)</Label>
                        <Input
                          id="hoaFees"
                          type="number"
                          value={formData.hoaFees || ''}
                          onChange={(e) => updateField('hoaFees', parseInt(e.target.value) || 0)}
                          placeholder="e.g., 50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="insurance">Insurance (monthly)</Label>
                        <Input
                          id="insurance"
                          type="number"
                          value={formData.pricing?.insurance || ''}
                          onChange={(e) => updateField('pricing.insurance', parseInt(e.target.value) || 0)}
                          placeholder="e.g., 85"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Location */}
            <TabsContent value="location" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location Details
                  </CardTitle>
                  <CardDescription>
                    Address and community information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Address */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.location.city || ''}
                          onChange={(e) => updateField('location.city', e.target.value)}
                          placeholder="e.g., Tampa"
                          className={errors['location.city'] ? 'border-red-500' : ''}
                        />
                        {errors['location.city'] && <p className="text-sm text-red-500 mt-1">{errors['location.city']}</p>}
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Select 
                          value={formData.location.state} 
                          onValueChange={(value) => updateField('location.state', value)}
                        >
                          <SelectTrigger className={errors['location.state'] ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {stateOptions.map(state => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors['location.state'] && <p className="text-sm text-red-500 mt-1">{errors['location.state']}</p>}
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          value={formData.location.postalCode || ''}
                          onChange={(e) => updateField('location.postalCode', e.target.value)}
                          placeholder="e.g., 33601"
                        />
                      </div>
                      <div>
                        <Label htmlFor="county">County</Label>
                        <Input
                          id="county"
                          value={formData.location.county || ''}
                          onChange={(e) => updateField('location.county', e.target.value)}
                          placeholder="e.g., Hillsborough"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Community Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Community</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="communityName">Community Name</Label>
                        <Input
                          id="communityName"
                          value={formData.location.communityName || ''}
                          onChange={(e) => updateField('location.communityName', e.target.value)}
                          placeholder="e.g., Sunset Palms Mobile Home Community"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lotNumber">Lot Number</Label>
                        <Input
                          id="lotNumber"
                          value={formData.location.lotNumber || ''}
                          onChange={(e) => updateField('location.lotNumber', e.target.value)}
                          placeholder="e.g., 42"
                        />
                      </div>
                      <div>
                        <Label htmlFor="township">Township</Label>
                        <Input
                          id="township"
                          value={formData.location.township || ''}
                          onChange={(e) => updateField('location.township', e.target.value)}
                          placeholder="e.g., West Tampa"
                        />
                      </div>
                      <div>
                        <Label htmlFor="schoolDistrict">School District</Label>
                        <Input
                          id="schoolDistrict"
                          value={formData.location.schoolDistrict || ''}
                          onChange={(e) => updateField('location.schoolDistrict', e.target.value)}
                          placeholder="e.g., Hillsborough County Schools"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Coordinates */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Coordinates (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                          id="latitude"
                          type="number"
                          step="any"
                          value={formData.location.coordinates?.lat || ''}
                          onChange={(e) => updateField('location.coordinates.lat', parseFloat(e.target.value) || 0)}
                          placeholder="e.g., 27.9506"
                        />
                      </div>
                      <div>
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                          id="longitude"
                          type="number"
                          step="any"
                          value={formData.location.coordinates?.lng || ''}
                          onChange={(e) => updateField('location.coordinates.lng', parseFloat(e.target.value) || 0)}
                          placeholder="e.g., -82.4572"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Features */}
            <TabsContent value="features" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Features & Amenities
                  </CardTitle>
                  <CardDescription>
                    Select all applicable features and amenities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Interior Features */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Interior Features</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="centralAir"
                          checked={formData.features.centralAir || false}
                          onCheckedChange={(checked) => updateField('features.centralAir', checked)}
                        />
                        <Label htmlFor="centralAir">Central Air</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="fireplace"
                          checked={formData.features.fireplace || false}
                          onCheckedChange={(checked) => updateField('features.fireplace', checked)}
                        />
                        <Label htmlFor="fireplace">Fireplace</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="dishwasher"
                          checked={formData.features.dishwasher || false}
                          onCheckedChange={(checked) => updateField('features.dishwasher', checked)}
                        />
                        <Label htmlFor="dishwasher">Dishwasher</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="washerDryer"
                          checked={formData.features.washerDryer || false}
                          onCheckedChange={(checked) => updateField('features.washerDryer', checked)}
                        />
                        <Label htmlFor="washerDryer">Washer/Dryer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="vaultedCeilings"
                          checked={formData.features.vaultedCeilings || false}
                          onCheckedChange={(checked) => updateField('features.vaultedCeilings', checked)}
                        />
                        <Label htmlFor="vaultedCeilings">Vaulted Ceilings</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="walkInCloset"
                          checked={formData.features.walkInCloset || false}
                          onCheckedChange={(checked) => updateField('features.walkInCloset', checked)}
                        />
                        <Label htmlFor="walkInCloset">Walk-in Closet</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="masterBath"
                          checked={formData.features.masterBath || false}
                          onCheckedChange={(checked) => updateField('features.masterBath', checked)}
                        />
                        <Label htmlFor="masterBath">Master Bath</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="gardenTub"
                          checked={formData.features.gardenTub || false}
                          onCheckedChange={(checked) => updateField('features.gardenTub', checked)}
                        />
                        <Label htmlFor="gardenTub">Garden Tub</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="islandKitchen"
                          checked={formData.features.islandKitchen || false}
                          onCheckedChange={(checked) => updateField('features.islandKitchen', checked)}
                        />
                        <Label htmlFor="islandKitchen">Kitchen Island</Label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Exterior Features */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Exterior Features</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="deck"
                          checked={formData.features.deck || false}
                          onCheckedChange={(checked) => updateField('features.deck', checked)}
                        />
                        <Label htmlFor="deck">Deck/Porch</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="shed"
                          checked={formData.features.shed || false}
                          onCheckedChange={(checked) => updateField('features.shed', checked)}
                        />
                        <Label htmlFor="shed">Storage Shed</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="carport"
                          checked={formData.features.carport || false}
                          onCheckedChange={(checked) => updateField('features.carport', checked)}
                        />
                        <Label htmlFor="carport">Carport</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="fencedYard"
                          checked={formData.features.fencedYard || false}
                          onCheckedChange={(checked) => updateField('features.fencedYard', checked)}
                        />
                        <Label htmlFor="fencedYard">Fenced Yard</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="landscaping"
                          checked={formData.features.landscaping || false}
                          onCheckedChange={(checked) => updateField('features.landscaping', checked)}
                        />
                        <Label htmlFor="landscaping">Landscaping</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sprinklerSystem"
                          checked={formData.features.sprinklerSystem || false}
                          onCheckedChange={(checked) => updateField('features.sprinklerSystem', checked)}
                        />
                        <Label htmlFor="sprinklerSystem">Sprinkler System</Label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Energy & Efficiency */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Energy & Efficiency</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="energyStar"
                          checked={formData.features.energyStar || false}
                          onCheckedChange={(checked) => updateField('features.energyStar', checked)}
                        />
                        <Label htmlFor="energyStar">Energy Star Certified</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="solarPanels"
                          checked={formData.features.solarPanels || false}
                          onCheckedChange={(checked) => updateField('features.solarPanels', checked)}
                        />
                        <Label htmlFor="solarPanels">Solar Panels</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="doublePane"
                          checked={formData.features.doublePane || false}
                          onCheckedChange={(checked) => updateField('features.doublePane', checked)}
                        />
                        <Label htmlFor="doublePane">Double Pane Windows</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Media & SEO */}
            <TabsContent value="media" className="space-y-6">
              {/* Photo Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Photos
                  </CardTitle>
                  <CardDescription>
                    Upload photos of the manufactured home
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Upload Area */}
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {isDragActive ? 'Drop photos here...' : 'Drag & drop photos here, or click to select'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports: JPEG, PNG, WebP (max 5MB each)
                    </p>
                  </div>

                  {/* Photo Gallery */}
                  {formData.media.photos.length > 0 && (
                    <div className="space-y-3">
                      <Label>Uploaded Photos</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {formData.media.photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={photo}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-24 object-cover rounded border"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-1">
                              {formData.media.primaryPhoto !== photo && (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => setPrimaryPhoto(photo)}
                                >
                                  Primary
                                </Button>
                              )}
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => removePhoto(photo)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            {formData.media.primaryPhoto === photo && (
                              <Badge className="absolute top-1 left-1 text-xs">Primary</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Virtual Tour & Video */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="virtualTour">Virtual Tour URL</Label>
                      <Input
                        id="virtualTour"
                        value={formData.media.virtualTour || ''}
                        onChange={(e) => updateField('media.virtualTour', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="videoUrl">Video URL</Label>
                      <Input
                        id="videoUrl"
                        value={formData.media.videoUrl || ''}
                        onChange={(e) => updateField('media.videoUrl', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SEO */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    SEO & Marketing
                  </CardTitle>
                  <CardDescription>
                    Optimize for search engines and marketing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.seo.metaDescription || ''}
                      onChange={(e) => updateField('seo.metaDescription', e.target.value)}
                      placeholder="Brief description for search engines..."
                      rows={3}
                      maxLength={160}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {(formData.seo.metaDescription || '').length}/160 characters
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                    <Input
                      id="keywords"
                      value={formData.seo.keywords?.join(', ') || ''}
                      onChange={(e) => updateField('seo.keywords', e.target.value.split(',').map(k => k.trim()).filter(Boolean))}
                      placeholder="manufactured home, mobile home, double wide..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="searchResultsText">Search Results Text</Label>
                    <Input
                      id="searchResultsText"
                      value={formData.seo.searchResultsText || ''}
                      onChange={(e) => updateField('seo.searchResultsText', e.target.value)}
                      placeholder="Text shown in search results"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  )
}