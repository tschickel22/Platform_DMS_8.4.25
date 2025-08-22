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
  Car, 
  Settings,
  Image as ImageIcon,
  FileText,
  Tag,
  Fuel,
  ArrowLeft
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { RVInventory } from '../types'
import { formatCurrency } from '@/lib/utils'

interface RVInventoryFormProps {
  initialData?: Partial<RVInventory>
  onSave: (data: RVInventory) => Promise<void>
  onCancel: () => void
  mode: 'create' | 'edit'
}

const defaultRVData: Partial<RVInventory> = {
  listingType: 'rv',
  condition: 'new',
  status: 'available',
  offerType: 'for_sale',
  sleeps: 4,
  slides: 1,
  length: 28,
  fuelType: 'gasoline',
  transmission: 'automatic',
  features: {
    generator: false,
    solar: false,
    awning: false,
    slideOut: false,
    airConditioning: false,
    heating: false,
    microwave: false,
    refrigerator: false,
    stove: false,
    oven: false,
    bathroom: false,
    shower: false,
    toilet: false,
    waterHeater: false,
    waterPump: false,
    blackTank: false,
    grayTank: false,
    freshTank: false
  },
  location: {
    city: '',
    state: '',
    postalCode: '',
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
  { value: 'certified', label: 'Certified Pre-Owned' }
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

const rvTypeOptions = [
  { value: 'travel_trailer', label: 'Travel Trailer' },
  { value: 'fifth_wheel', label: 'Fifth Wheel' },
  { value: 'motorhome_a', label: 'Class A Motorhome' },
  { value: 'motorhome_b', label: 'Class B Motorhome' },
  { value: 'motorhome_c', label: 'Class C Motorhome' },
  { value: 'toy_hauler', label: 'Toy Hauler' },
  { value: 'popup', label: 'Pop-up Camper' },
  { value: 'truck_camper', label: 'Truck Camper' }
]

const fuelTypeOptions = [
  { value: 'gasoline', label: 'Gasoline' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'na', label: 'N/A (Towable)' }
]

const transmissionOptions = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
  { value: 'na', label: 'N/A (Towable)' }
]

const stateOptions = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

export default function RVInventoryForm({ initialData, onSave, onCancel, mode }: RVInventoryFormProps) {
  const [formData, setFormData] = useState<RVInventory>({
    ...defaultRVData,
    ...initialData,
    id: initialData?.id || `rv-${Date.now()}`,
    createdAt: initialData?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  } as RVInventory)

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
    if (!formData.vin?.trim()) newErrors.vin = 'VIN is required'
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
      const searchText = `${formData.year} ${formData.make} ${formData.model} - ${formData.length}ft ${formData.rvType?.replace('_', ' ') || 'RV'}`
      
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
      console.error('Error saving RV:', error)
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
                {mode === 'create' ? 'Add New' : 'Edit'} RV
              </h1>
              <p className="text-muted-foreground">
                {mode === 'create' ? 'Create a new RV listing' : 'Update RV details'}
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
                    <Car className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Essential details about the RV
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
                        placeholder="e.g., 2023 Forest River Cherokee 274RK"
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
                        placeholder="e.g., INV-RV-001"
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
                        placeholder="e.g., Forest River"
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
                        placeholder="e.g., Cherokee 274RK"
                        className={errors.model ? 'border-red-500' : ''}
                      />
                      {errors.model && <p className="text-sm text-red-500 mt-1">{errors.model}</p>}
                    </div>

                    <div>
                      <Label htmlFor="vin">VIN *</Label>
                      <Input
                        id="vin"
                        value={formData.vin || ''}
                        onChange={(e) => updateField('vin', e.target.value)}
                        placeholder="e.g., 1FUJBBCK5NLBXXXXX"
                        className={errors.vin ? 'border-red-500' : ''}
                      />
                      {errors.vin && <p className="text-sm text-red-500 mt-1">{errors.vin}</p>}
                    </div>

                    <div>
                      <Label htmlFor="rvType">RV Type</Label>
                      <Select value={formData.rvType} onValueChange={(value) => updateField('rvType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select RV type" />
                        </SelectTrigger>
                        <SelectContent>
                          {rvTypeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      placeholder="Detailed description of the RV..."
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
                    RV Specifications
                  </CardTitle>
                  <CardDescription>
                    Detailed specifications and capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Layout & Capacity */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Layout & Capacity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="sleeps">Sleeps</Label>
                        <Input
                          id="sleeps"
                          type="number"
                          value={formData.sleeps || ''}
                          onChange={(e) => updateField('sleeps', parseInt(e.target.value) || 0)}
                          min="1"
                          max="12"
                        />
                      </div>
                      <div>
                        <Label htmlFor="length">Length (ft)</Label>
                        <Input
                          id="length"
                          type="number"
                          step="0.5"
                          value={formData.length || ''}
                          onChange={(e) => updateField('length', parseFloat(e.target.value) || 0)}
                          min="15"
                          max="45"
                        />
                      </div>
                      <div>
                        <Label htmlFor="slides">Slide Outs</Label>
                        <Input
                          id="slides"
                          type="number"
                          value={formData.slides || ''}
                          onChange={(e) => updateField('slides', parseInt(e.target.value) || 0)}
                          min="0"
                          max="5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="weight">Dry Weight (lbs)</Label>
                        <Input
                          id="weight"
                          type="number"
                          value={formData.weight || ''}
                          onChange={(e) => updateField('weight', parseInt(e.target.value) || 0)}
                          placeholder="e.g., 6500"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Engine & Drivetrain (for motorhomes) */}
                  {(formData.rvType?.includes('motorhome') || formData.rvType === 'truck_camper') && (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Engine & Drivetrain</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="engine">Engine</Label>
                            <Input
                              id="engine"
                              value={formData.engine || ''}
                              onChange={(e) => updateField('engine', e.target.value)}
                              placeholder="e.g., Ford V10 Triton"
                            />
                          </div>
                          <div>
                            <Label htmlFor="fuelType">Fuel Type</Label>
                            <Select value={formData.fuelType} onValueChange={(value) => updateField('fuelType', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select fuel type" />
                              </SelectTrigger>
                              <SelectContent>
                                {fuelTypeOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="transmission">Transmission</Label>
                            <Select value={formData.transmission} onValueChange={(value) => updateField('transmission', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select transmission" />
                              </SelectTrigger>
                              <SelectContent>
                                {transmissionOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="odometerMiles">Odometer (miles)</Label>
                          <Input
                            id="odometerMiles"
                            type="number"
                            value={formData.odometerMiles || ''}
                            onChange={(e) => updateField('odometerMiles', parseInt(e.target.value) || 0)}
                            placeholder="e.g., 15000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="fuelCapacity">Fuel Tank (gallons)</Label>
                          <Input
                            id="fuelCapacity"
                            type="number"
                            value={formData.fuelCapacity || ''}
                            onChange={(e) => updateField('fuelCapacity', parseInt(e.target.value) || 0)}
                            placeholder="e.g., 55"
                          />
                        </div>
                        <div>
                          <Label htmlFor="mpg">MPG (estimated)</Label>
                          <Input
                            id="mpg"
                            type="number"
                            step="0.1"
                            value={formData.mpg || ''}
                            onChange={(e) => updateField('mpg', parseFloat(e.target.value) || 0)}
                            placeholder="e.g., 8.5"
                          />
                        </div>
                      </div>

                      <Separator />
                    </>
                  )}

                  {/* Tank Capacities */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Tank Capacities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="freshWaterCapacity">Fresh Water (gallons)</Label>
                        <Input
                          id="freshWaterCapacity"
                          type="number"
                          value={formData.freshWaterCapacity || ''}
                          onChange={(e) => updateField('freshWaterCapacity', parseInt(e.target.value) || 0)}
                          placeholder="e.g., 40"
                        />
                      </div>
                      <div>
                        <Label htmlFor="grayWaterCapacity">Gray Water (gallons)</Label>
                        <Input
                          id="grayWaterCapacity"
                          type="number"
                          value={formData.grayWaterCapacity || ''}
                          onChange={(e) => updateField('grayWaterCapacity', parseInt(e.target.value) || 0)}
                          placeholder="e.g., 30"
                        />
                      </div>
                      <div>
                        <Label htmlFor="blackWaterCapacity">Black Water (gallons)</Label>
                        <Input
                          id="blackWaterCapacity"
                          type="number"
                          value={formData.blackWaterCapacity || ''}
                          onChange={(e) => updateField('blackWaterCapacity', parseInt(e.target.value) || 0)}
                          placeholder="e.g., 30"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Electrical */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Electrical System</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="generatorWattage">Generator (watts)</Label>
                        <Input
                          id="generatorWattage"
                          type="number"
                          value={formData.generatorWattage || ''}
                          onChange={(e) => updateField('generatorWattage', parseInt(e.target.value) || 0)}
                          placeholder="e.g., 4000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="solarWattage">Solar (watts)</Label>
                        <Input
                          id="solarWattage"
                          type="number"
                          value={formData.solarWattage || ''}
                          onChange={(e) => updateField('solarWattage', parseInt(e.target.value) || 0)}
                          placeholder="e.g., 200"
                        />
                      </div>
                      <div>
                        <Label htmlFor="batteryCapacity">Battery (amp hours)</Label>
                        <Input
                          id="batteryCapacity"
                          type="number"
                          value={formData.batteryCapacity || ''}
                          onChange={(e) => updateField('batteryCapacity', parseInt(e.target.value) || 0)}
                          placeholder="e.g., 100"
                        />
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
                            placeholder="e.g., 45000"
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
                            placeholder="e.g., 35000"
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
                            <Label htmlFor="rentPrice">Daily Rate *</Label>
                            <Input
                              id="rentPrice"
                              type="number"
                              value={formData.rentPrice || ''}
                              onChange={(e) => updateField('rentPrice', parseInt(e.target.value) || 0)}
                              placeholder="e.g., 150"
                              className={errors.rentPrice ? 'border-red-500' : ''}
                            />
                            {errors.rentPrice && <p className="text-sm text-red-500 mt-1">{errors.rentPrice}</p>}
                          </div>
                          <div>
                            <Label htmlFor="weeklyRate">Weekly Rate</Label>
                            <Input
                              id="weeklyRate"
                              type="number"
                              value={formData.pricing?.weeklyRate || ''}
                              onChange={(e) => updateField('pricing.weeklyRate', parseInt(e.target.value) || 0)}
                              placeholder="e.g., 900"
                            />
                          </div>
                          <div>
                            <Label htmlFor="monthlyRate">Monthly Rate</Label>
                            <Input
                              id="monthlyRate"
                              type="number"
                              value={formData.pricing?.monthlyRate || ''}
                              onChange={(e) => updateField('pricing.monthlyRate', parseInt(e.target.value) || 0)}
                              placeholder="e.g., 3000"
                            />
                          </div>
                          <div>
                            <Label htmlFor="securityDeposit">Security Deposit</Label>
                            <Input
                              id="securityDeposit"
                              type="number"
                              value={formData.pricing?.securityDeposit || ''}
                              onChange={(e) => updateField('pricing.securityDeposit', parseInt(e.target.value) || 0)}
                              placeholder="e.g., 500"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <Separator />

                  {/* Additional Fees */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Additional Fees</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="cleaningFee">Cleaning Fee</Label>
                        <Input
                          id="cleaningFee"
                          type="number"
                          value={formData.pricing?.cleaningFee || ''}
                          onChange={(e) => updateField('pricing.cleaningFee', parseInt(e.target.value) || 0)}
                          placeholder="e.g., 75"
                        />
                      </div>
                      <div>
                        <Label htmlFor="petFee">Pet Fee</Label>
                        <Input
                          id="petFee"
                          type="number"
                          value={formData.pricing?.petFee || ''}
                          onChange={(e) => updateField('pricing.petFee', parseInt(e.target.value) || 0)}
                          placeholder="e.g., 25"
                        />
                      </div>
                      <div>
                        <Label htmlFor="deliveryFee">Delivery Fee</Label>
                        <Input
                          id="deliveryFee"
                          type="number"
                          value={formData.pricing?.deliveryFee || ''}
                          onChange={(e) => updateField('pricing.deliveryFee', parseInt(e.target.value) || 0)}
                          placeholder="e.g., 200"
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
                    Current location and availability
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.location.city || ''}
                        onChange={(e) => updateField('location.city', e.target.value)}
                        placeholder="e.g., Phoenix"
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
                        placeholder="e.g., 85001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dealershipLocation">Dealership Location</Label>
                      <Input
                        id="dealershipLocation"
                        value={formData.location.dealershipLocation || ''}
                        onChange={(e) => updateField('location.dealershipLocation', e.target.value)}
                        placeholder="e.g., Main Lot"
                      />
                    </div>
                  </div>

                  {/* Coordinates */}
                  <Separator />
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
                          placeholder="e.g., 33.4484"
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
                          placeholder="e.g., -112.0740"
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
                    Features & Equipment
                  </CardTitle>
                  <CardDescription>
                    Select all applicable features and equipment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Power & Utilities */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Power & Utilities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="generator"
                          checked={formData.features.generator || false}
                          onCheckedChange={(checked) => updateField('features.generator', checked)}
                        />
                        <Label htmlFor="generator">Generator</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="solar"
                          checked={formData.features.solar || false}
                          onCheckedChange={(checked) => updateField('features.solar', checked)}
                        />
                        <Label htmlFor="solar">Solar Panels</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="inverter"
                          checked={formData.features.inverter || false}
                          onCheckedChange={(checked) => updateField('features.inverter', checked)}
                        />
                        <Label htmlFor="inverter">Inverter</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="airConditioning"
                          checked={formData.features.airConditioning || false}
                          onCheckedChange={(checked) => updateField('features.airConditioning', checked)}
                        />
                        <Label htmlFor="airConditioning">Air Conditioning</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="heating"
                          checked={formData.features.heating || false}
                          onCheckedChange={(checked) => updateField('features.heating', checked)}
                        />
                        <Label htmlFor="heating">Heating System</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="waterHeater"
                          checked={formData.features.waterHeater || false}
                          onCheckedChange={(checked) => updateField('features.waterHeater', checked)}
                        />
                        <Label htmlFor="waterHeater">Water Heater</Label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Kitchen & Appliances */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Kitchen & Appliances</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="microwave"
                          checked={formData.features.microwave || false}
                          onCheckedChange={(checked) => updateField('features.microwave', checked)}
                        />
                        <Label htmlFor="microwave">Microwave</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="refrigerator"
                          checked={formData.features.refrigerator || false}
                          onCheckedChange={(checked) => updateField('features.refrigerator', checked)}
                        />
                        <Label htmlFor="refrigerator">Refrigerator</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="stove"
                          checked={formData.features.stove || false}
                          onCheckedChange={(checked) => updateField('features.stove', checked)}
                        />
                        <Label htmlFor="stove">Stove/Cooktop</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="oven"
                          checked={formData.features.oven || false}
                          onCheckedChange={(checked) => updateField('features.oven', checked)}
                        />
                        <Label htmlFor="oven">Oven</Label>
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
                    </div>
                  </div>

                  <Separator />

                  {/* Bathroom & Water */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Bathroom & Water</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="bathroom"
                          checked={formData.features.bathroom || false}
                          onCheckedChange={(checked) => updateField('features.bathroom', checked)}
                        />
                        <Label htmlFor="bathroom">Full Bathroom</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="shower"
                          checked={formData.features.shower || false}
                          onCheckedChange={(checked) => updateField('features.shower', checked)}
                        />
                        <Label htmlFor="shower">Shower</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="toilet"
                          checked={formData.features.toilet || false}
                          onCheckedChange={(checked) => updateField('features.toilet', checked)}
                        />
                        <Label htmlFor="toilet">Toilet</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="waterPump"
                          checked={formData.features.waterPump || false}
                          onCheckedChange={(checked) => updateField('features.waterPump', checked)}
                        />
                        <Label htmlFor="waterPump">Water Pump</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="freshTank"
                          checked={formData.features.freshTank || false}
                          onCheckedChange={(checked) => updateField('features.freshTank', checked)}
                        />
                        <Label htmlFor="freshTank">Fresh Water Tank</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="grayTank"
                          checked={formData.features.grayTank || false}
                          onCheckedChange={(checked) => updateField('features.grayTank', checked)}
                        />
                        <Label htmlFor="grayTank">Gray Water Tank</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="blackTank"
                          checked={formData.features.blackTank || false}
                          onCheckedChange={(checked) => updateField('features.blackTank', checked)}
                        />
                        <Label htmlFor="blackTank">Black Water Tank</Label>
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
                          id="awning"
                          checked={formData.features.awning || false}
                          onCheckedChange={(checked) => updateField('features.awning', checked)}
                        />
                        <Label htmlFor="awning">Awning</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="slideOut"
                          checked={formData.features.slideOut || false}
                          onCheckedChange={(checked) => updateField('features.slideOut', checked)}
                        />
                        <Label htmlFor="slideOut">Slide Outs</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="outdoorKitchen"
                          checked={formData.features.outdoorKitchen || false}
                          onCheckedChange={(checked) => updateField('features.outdoorKitchen', checked)}
                        />
                        <Label htmlFor="outdoorKitchen">Outdoor Kitchen</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="outdoorShower"
                          checked={formData.features.outdoorShower || false}
                          onCheckedChange={(checked) => updateField('features.outdoorShower', checked)}
                        />
                        <Label htmlFor="outdoorShower">Outdoor Shower</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="bikeRack"
                          checked={formData.features.bikeRack || false}
                          onCheckedChange={(checked) => updateField('features.bikeRack', checked)}
                        />
                        <Label htmlFor="bikeRack">Bike Rack</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="ladder"
                          checked={formData.features.ladder || false}
                          onCheckedChange={(checked) => updateField('features.ladder', checked)}
                        />
                        <Label htmlFor="ladder">Roof Ladder</Label>
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
                    Upload photos of the RV
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
                      placeholder="rv, motorhome, travel trailer..."
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