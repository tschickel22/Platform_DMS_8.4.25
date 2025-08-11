import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Upload, HelpCircle } from 'lucide-react'
import { RVVehicle } from '../state/types'
import { validateRVForRequiredFields } from '../utils/validators'

interface RVInventoryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem?: RVVehicle | null
  onSave: (vehicle: RVVehicle) => void
}

const initialFormData: Partial<RVVehicle> = {
  type: 'RV',
  vin: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  mileage: 0,
  bodyStyle: '',
  fuelType: 'Gasoline',
  transmission: 'Automatic',
  exteriorColor: '',
  interiorColor: '',
  price: 0,
  currency: 'USD',
  availability: 'InStock',
  condition: 'Used',
  description: '',
  images: [],
  url: '',
  seller: {
    name: '',
    telephone: '',
    address: {
      streetAddress: '',
      addressLocality: '',
      addressRegion: '',
      postalCode: '',
      addressCountry: 'US'
    }
  },
  features: [],
  specifications: {}
}

const bodyStyleOptions = [
  'Class A',
  'Class B',
  'Class C',
  'Travel Trailer',
  'Fifth Wheel',
  'Toy Hauler',
  'Pop-up Camper',
  'Truck Camper',
  'Motorhome',
  'Park Model'
]

const fuelTypeOptions = [
  'Gasoline',
  'Diesel',
  'Electric',
  'Hybrid',
  'Propane'
]

const transmissionOptions = [
  'Automatic',
  'Manual',
  'CVT'
]

const availabilityOptions = [
  { value: 'InStock', label: 'In Stock' },
  { value: 'OutOfStock', label: 'Out of Stock' },
  { value: 'PreOrder', label: 'Pre-Order' },
  { value: 'BackOrder', label: 'Back Order' },
  { value: 'Discontinued', label: 'Discontinued' },
  { value: 'SoldOut', label: 'Sold Out' }
]

const conditionOptions = [
  'New',
  'Used',
  'Certified Pre-Owned',
  'Refurbished'
]

export function RVInventoryForm({ open, onOpenChange, editingItem, onSave }: RVInventoryFormProps) {
  const [formData, setFormData] = useState<Partial<RVVehicle>>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newFeature, setNewFeature] = useState('')

  const mode = editingItem ? 'edit' : 'add'
  const title = mode === 'edit' ? 'Edit RV' : 'Add RV'

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem)
      setImageUrls(editingItem.images || [])
    } else {
      setFormData(initialFormData)
      setImageUrls([])
    }
    setErrors({})
  }, [editingItem, open])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleNestedInputChange = (parentField: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField] as any,
        [field]: value
      }
    }))
  }

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      seller: {
        ...prev.seller!,
        address: {
          ...prev.seller!.address,
          [field]: value
        }
      }
    }))
  }

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImageUrls(prev => [...prev, newImageUrl.trim()])
      setNewImageUrl('')
    }
  }

  const handleRemoveImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }))
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleSave = () => {
    const vehicleData = {
      ...formData,
      images: imageUrls
    } as RVVehicle

    const validationErrors = validateRVForRequiredFields(vehicleData)
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Generate ID if adding new vehicle
    if (!editingItem) {
      vehicleData.id = `rv-${Date.now()}`
    }

    onSave(vehicleData)
    onOpenChange(false)
  }

  const canGenerate = formData.vin && formData.make && formData.model && formData.year

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-background border-b pb-4 mb-6 z-10">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>
                {mode === 'add' ? 'Add' : 'Edit'} RV
              </DialogTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {mode === 'add' ? 'Add RV' : 'Save'}
                </Button>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="vin">VIN *</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Vehicle Identification Number - unique 17-character identifier</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="vin"
                  value={formData.vin || ''}
                  onChange={(e) => handleInputChange('vin', e.target.value.toUpperCase())}
                  placeholder="1HGBH41JXMN109186"
                  maxLength={17}
                  className={errors.vin ? 'border-red-500' : ''}
                />
                {errors.vin && <p className="text-sm text-red-500">{errors.vin}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="make">Make *</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Vehicle manufacturer (e.g., Ford, Winnebago, Airstream)</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="make"
                  value={formData.make || ''}
                  onChange={(e) => handleInputChange('make', e.target.value)}
                  placeholder="Winnebago"
                  className={errors.make ? 'border-red-500' : ''}
                />
                {errors.make && <p className="text-sm text-red-500">{errors.make}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="model">Model *</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Specific model name or number</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="model"
                  value={formData.model || ''}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  placeholder="Vista 32KE"
                  className={errors.model ? 'border-red-500' : ''}
                />
                {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="year">Year *</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Model year of the vehicle</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="year"
                  type="number"
                  value={formData.year || ''}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                  placeholder="2023"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className={errors.year ? 'border-red-500' : ''}
                />
                {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="mileage">Mileage</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Current odometer reading in miles</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="mileage"
                  type="number"
                  value={formData.mileage || ''}
                  onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || 0)}
                  placeholder="25000"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="bodyStyle">Body Style *</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Type of RV (Class A, Class B, Travel Trailer, etc.)</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select value={formData.bodyStyle || ''} onValueChange={(value) => handleInputChange('bodyStyle', value)}>
                  <SelectTrigger className={errors.bodyStyle ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select body style" />
                  </SelectTrigger>
                  <SelectContent>
                    {bodyStyleOptions.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.bodyStyle && <p className="text-sm text-red-500">{errors.bodyStyle}</p>}
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vehicle Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select value={formData.fuelType || ''} onValueChange={(value) => handleInputChange('fuelType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypeOptions.map((fuel) => (
                      <SelectItem key={fuel} value={fuel}>
                        {fuel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <Select value={formData.transmission || ''} onValueChange={(value) => handleInputChange('transmission', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    {transmissionOptions.map((trans) => (
                      <SelectItem key={trans} value={trans}>
                        {trans}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exteriorColor">Exterior Color</Label>
                <Input
                  id="exteriorColor"
                  value={formData.exteriorColor || ''}
                  onChange={(e) => handleInputChange('exteriorColor', e.target.value)}
                  placeholder="White"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interiorColor">Interior Color</Label>
                <Input
                  id="interiorColor"
                  value={formData.interiorColor || ''}
                  onChange={(e) => handleInputChange('interiorColor', e.target.value)}
                  placeholder="Tan"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select value={formData.condition || ''} onValueChange={(value) => handleInputChange('condition', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionOptions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Select value={formData.availability || ''} onValueChange={(value) => handleInputChange('availability', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    {availabilityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="price">Price *</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Asking price in the specified currency</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="price"
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  placeholder="125000"
                  min="0"
                  step="0.01"
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency || 'USD'} onValueChange={(value) => handleInputChange('currency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Images</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddImage} disabled={!newImageUrl.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {imageUrls.length > 0 && (
                <div className="space-y-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <span className="flex-1 text-sm truncate">{url}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Features</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Air conditioning, Generator, Solar panels..."
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddFeature} disabled={!newFeature.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.features && formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {feature}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => handleRemoveFeature(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Seller Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Seller Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sellerName">Seller Name</Label>
                <Input
                  id="sellerName"
                  value={formData.seller?.name || ''}
                  onChange={(e) => handleNestedInputChange('seller', 'name', e.target.value)}
                  placeholder="ABC RV Sales"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellerPhone">Phone</Label>
                <Input
                  id="sellerPhone"
                  value={formData.seller?.telephone || ''}
                  onChange={(e) => handleNestedInputChange('seller', 'telephone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input
                  id="streetAddress"
                  value={formData.seller?.address?.streetAddress || ''}
                  onChange={(e) => handleAddressChange('streetAddress', e.target.value)}
                  placeholder="123 Main St"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.seller?.address?.addressLocality || ''}
                  onChange={(e) => handleAddressChange('addressLocality', e.target.value)}
                  placeholder="Anytown"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.seller?.address?.addressRegion || ''}
                  onChange={(e) => handleAddressChange('addressRegion', e.target.value)}
                  placeholder="CA"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.seller?.address?.postalCode || ''}
                  onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                  placeholder="12345"
                />
              </div>
            </div>
          </div>

          {/* Description and URL */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of the RV..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">Listing URL</Label>
                <Input
                  id="url"
                  value={formData.url || ''}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  placeholder="https://example.com/rv/12345"
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}