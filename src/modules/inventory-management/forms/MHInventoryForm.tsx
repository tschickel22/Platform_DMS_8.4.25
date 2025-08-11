import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { X, Plus, HelpCircle } from 'lucide-react'
import { MHVehicle, CustomField } from '../state/types'
import { validateMHForRequiredFields } from '../utils/validators'

interface MHInventoryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem?: MHVehicle | null
  onSave: (vehicle: MHVehicle) => void
}

const initialFormData: Partial<MHVehicle> = {
  type: 'MH',
  sellerId: '',
  askingPrice: 0,
  homeType: '',
  make: '',
  year: new Date().getFullYear(),
  bedrooms: 1,
  bathrooms: 1,
  address1: '',
  city: '',
  state: '',
  zip9: '',
  serialNumber: '',
  model: '',
  length: 0,
  width: 0,
  squareFootage: 0,
  lotRent: 0,
  hoaFees: 0,
  propertyTaxes: 0,
  utilities: '',
  appliances: '',
  flooring: '',
  heating: '',
  cooling: '',
  exterior: '',
  roofing: '',
  windows: '',
  insulation: '',
  electrical: '',
  plumbing: '',
  foundation: '',
  skirting: '',
  deck: '',
  shed: '',
  carport: '',
  images: [],
  description: '',
  notes: '',
  customFields: []
}

const homeTypeOptions = [
  'Single Wide',
  'Double Wide',
  'Triple Wide',
  'Modular',
  'Park Model',
  'Tiny Home'
]

const utilitiesOptions = [
  'Electric',
  'Gas',
  'Water',
  'Sewer',
  'Trash',
  'Internet',
  'Cable'
]

const applianceOptions = [
  'Refrigerator',
  'Stove',
  'Oven',
  'Microwave',
  'Dishwasher',
  'Washer',
  'Dryer',
  'Water Heater'
]

const flooringOptions = [
  'Carpet',
  'Hardwood',
  'Laminate',
  'Vinyl',
  'Tile',
  'Linoleum'
]

const heatingOptions = [
  'Central Heat',
  'Heat Pump',
  'Electric Baseboard',
  'Gas Furnace',
  'Wood Stove',
  'Propane'
]

const coolingOptions = [
  'Central Air',
  'Heat Pump',
  'Window Units',
  'Evaporative Cooler',
  'Ceiling Fans'
]

const customFieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Yes/No' },
  { value: 'date', label: 'Date' }
]

export function MHInventoryForm({ open, onOpenChange, editingItem, onSave }: MHInventoryFormProps) {
  const [formData, setFormData] = useState<Partial<MHVehicle>>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newCustomField, setNewCustomField] = useState<Partial<CustomField>>({
    name: '',
    type: 'text',
    value: ''
  })

  const mode = editingItem ? 'edit' : 'add'
  const title = mode === 'edit' ? 'Edit Manufactured Home' : 'Add Manufactured Home'

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

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImageUrls(prev => [...prev, newImageUrl.trim()])
      setNewImageUrl('')
    }
  }

  const handleRemoveImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddCustomField = () => {
    if (newCustomField.name?.trim()) {
      const customField: CustomField = {
        id: `custom-${Date.now()}`,
        name: newCustomField.name.trim(),
        type: newCustomField.type || 'text',
        value: newCustomField.value || ''
      }
      
      setFormData(prev => ({
        ...prev,
        customFields: [...(prev.customFields || []), customField]
      }))
      
      setNewCustomField({ name: '', type: 'text', value: '' })
    }
  }

  const handleRemoveCustomField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields?.filter((_, i) => i !== index) || []
    }))
  }

  const handleUpdateCustomField = (index: number, field: keyof CustomField, value: any) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields?.map((cf, i) => 
        i === index ? { ...cf, [field]: value } : cf
      ) || []
    }))
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleSave = () => {
    const vehicleData = {
      ...formData,
      images: imageUrls
    } as MHVehicle

    const validationErrors = validateMHForRequiredFields(vehicleData)
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Generate ID if adding new vehicle
    if (!editingItem) {
      vehicleData.id = `mh-${Date.now()}`
    }

    onSave(vehicleData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-background border-b pb-4 mb-6 z-10">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>{title}</DialogTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {mode === 'add' ? 'Add Home' : 'Save'}
                </Button>
              </div>
            </div>
          </DialogHeader>
        </div>

        <Tabs defaultValue="seller" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="seller">Seller</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="seller" className="space-y-4">
            <h3 className="text-lg font-semibold">Seller Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="sellerId">Seller ID *</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Unique identifier for the seller or listing agent</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="sellerId"
                  value={formData.sellerId || ''}
                  onChange={(e) => handleInputChange('sellerId', e.target.value)}
                  placeholder="SELLER001"
                  className={errors.sellerId ? 'border-red-500' : ''}
                />
                {errors.sellerId && <p className="text-sm text-red-500">{errors.sellerId}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Manufacturer's serial number for the home</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber || ''}
                  onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                  placeholder="MH123456789"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <h3 className="text-lg font-semibold">Pricing Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="askingPrice">Asking Price *</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Listed price for the manufactured home</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="askingPrice"
                  type="number"
                  value={formData.askingPrice || ''}
                  onChange={(e) => handleInputChange('askingPrice', parseFloat(e.target.value) || 0)}
                  placeholder="75000"
                  min="0"
                  step="0.01"
                  className={errors.askingPrice ? 'border-red-500' : ''}
                />
                {errors.askingPrice && <p className="text-sm text-red-500">{errors.askingPrice}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lotRent">Lot Rent</Label>
                <Input
                  id="lotRent"
                  type="number"
                  value={formData.lotRent || ''}
                  onChange={(e) => handleInputChange('lotRent', parseFloat(e.target.value) || 0)}
                  placeholder="450"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hoaFees">HOA Fees</Label>
                <Input
                  id="hoaFees"
                  type="number"
                  value={formData.hoaFees || ''}
                  onChange={(e) => handleInputChange('hoaFees', parseFloat(e.target.value) || 0)}
                  placeholder="125"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyTaxes">Property Taxes</Label>
                <Input
                  id="propertyTaxes"
                  type="number"
                  value={formData.propertyTaxes || ''}
                  onChange={(e) => handleInputChange('propertyTaxes', parseFloat(e.target.value) || 0)}
                  placeholder="1200"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="location" className="space-y-4">
            <h3 className="text-lg font-semibold">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="address1">Address *</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Street address of the manufactured home</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="address1"
                  value={formData.address1 || ''}
                  onChange={(e) => handleInputChange('address1', e.target.value)}
                  placeholder="123 Mobile Home Park Dr"
                  className={errors.address1 ? 'border-red-500' : ''}
                />
                {errors.address1 && <p className="text-sm text-red-500">{errors.address1}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="city">City *</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>City where the home is located</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="city"
                  value={formData.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Phoenix"
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="state">State *</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>State abbreviation (e.g., AZ, CA, TX)</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="state"
                  value={formData.state || ''}
                  onChange={(e) => handleInputChange('state', e.target.value.toUpperCase())}
                  placeholder="AZ"
                  maxLength={2}
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="zip9">ZIP Code *</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>5 or 9 digit ZIP code</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="zip9"
                  value={formData.zip9 || ''}
                  onChange={(e) => handleInputChange('zip9', e.target.value)}
                  placeholder="85001"
                  className={errors.zip9 ? 'border-red-500' : ''}
                />
                {errors.zip9 && <p className="text-sm text-red-500">{errors.zip9}</p>}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="home" className="space-y-4">
            <h3 className="text-lg font-semibold">Home Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="homeType">Home Type *</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Type of manufactured home</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select value={formData.homeType || ''} onValueChange={(value) => handleInputChange('homeType', value)}>
                  <SelectTrigger className={errors.homeType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select home type" />
                  </SelectTrigger>
                  <SelectContent>
                    {homeTypeOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.homeType && <p className="text-sm text-red-500">{errors.homeType}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="make">Make *</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Manufacturer of the home</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="make"
                  value={formData.make || ''}
                  onChange={(e) => handleInputChange('make', e.target.value)}
                  placeholder="Clayton"
                  className={errors.make ? 'border-red-500' : ''}
                />
                {errors.make && <p className="text-sm text-red-500">{errors.make}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model || ''}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  placeholder="Inspiration"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="year">Year *</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Year the home was manufactured</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="year"
                  type="number"
                  value={formData.year || ''}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                  placeholder="2020"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className={errors.year ? 'border-red-500' : ''}
                />
                {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="bedrooms">Bedrooms *</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Number of bedrooms</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms || ''}
                  onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                  placeholder="3"
                  min="0"
                  max="10"
                  className={errors.bedrooms ? 'border-red-500' : ''}
                />
                {errors.bedrooms && <p className="text-sm text-red-500">{errors.bedrooms}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="bathrooms">Bathrooms *</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Number of bathrooms</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms || ''}
                  onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value))}
                  placeholder="2"
                  min="0"
                  max="10"
                  step="0.5"
                  className={errors.bathrooms ? 'border-red-500' : ''}
                />
                {errors.bathrooms && <p className="text-sm text-red-500">{errors.bathrooms}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="length">Length (ft)</Label>
                <Input
                  id="length"
                  type="number"
                  value={formData.length || ''}
                  onChange={(e) => handleInputChange('length', parseFloat(e.target.value) || 0)}
                  placeholder="60"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="width">Width (ft)</Label>
                <Input
                  id="width"
                  type="number"
                  value={formData.width || ''}
                  onChange={(e) => handleInputChange('width', parseFloat(e.target.value) || 0)}
                  placeholder="28"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="squareFootage">Square Footage</Label>
                <Input
                  id="squareFootage"
                  type="number"
                  value={formData.squareFootage || ''}
                  onChange={(e) => handleInputChange('squareFootage', parseInt(e.target.value) || 0)}
                  placeholder="1680"
                  min="0"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <h3 className="text-lg font-semibold">Features & Amenities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="utilities">Utilities</Label>
                <Input
                  id="utilities"
                  value={formData.utilities || ''}
                  onChange={(e) => handleInputChange('utilities', e.target.value)}
                  placeholder="Electric, Gas, Water, Sewer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appliances">Appliances</Label>
                <Input
                  id="appliances"
                  value={formData.appliances || ''}
                  onChange={(e) => handleInputChange('appliances', e.target.value)}
                  placeholder="Refrigerator, Stove, Washer, Dryer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="flooring">Flooring</Label>
                <Input
                  id="flooring"
                  value={formData.flooring || ''}
                  onChange={(e) => handleInputChange('flooring', e.target.value)}
                  placeholder="Laminate, Carpet, Tile"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heating">Heating</Label>
                <Input
                  id="heating"
                  value={formData.heating || ''}
                  onChange={(e) => handleInputChange('heating', e.target.value)}
                  placeholder="Central Heat, Heat Pump"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cooling">Cooling</Label>
                <Input
                  id="cooling"
                  value={formData.cooling || ''}
                  onChange={(e) => handleInputChange('cooling', e.target.value)}
                  placeholder="Central Air, Heat Pump"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exterior">Exterior</Label>
                <Input
                  id="exterior"
                  value={formData.exterior || ''}
                  onChange={(e) => handleInputChange('exterior', e.target.value)}
                  placeholder="Vinyl Siding, Brick Skirting"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roofing">Roofing</Label>
                <Input
                  id="roofing"
                  value={formData.roofing || ''}
                  onChange={(e) => handleInputChange('roofing', e.target.value)}
                  placeholder="Metal, Shingle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="windows">Windows</Label>
                <Input
                  id="windows"
                  value={formData.windows || ''}
                  onChange={(e) => handleInputChange('windows', e.target.value)}
                  placeholder="Double Pane, Vinyl Frame"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deck">Deck/Patio</Label>
                <Input
                  id="deck"
                  value={formData.deck || ''}
                  onChange={(e) => handleInputChange('deck', e.target.value)}
                  placeholder="10x12 Wood Deck"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shed">Shed/Storage</Label>
                <Input
                  id="shed"
                  value={formData.shed || ''}
                  onChange={(e) => handleInputChange('shed', e.target.value)}
                  placeholder="8x10 Storage Shed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="carport">Carport/Garage</Label>
                <Input
                  id="carport"
                  value={formData.carport || ''}
                  onChange={(e) => handleInputChange('carport', e.target.value)}
                  placeholder="2-Car Carport"
                />
              </div>
            </div>

            {/* Custom Fields */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="text-md font-semibold">Custom Fields</h4>
              
              {/* Add new custom field */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Input
                  value={newCustomField.name || ''}
                  onChange={(e) => setNewCustomField(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Field name"
                />
                <Select 
                  value={newCustomField.type || 'text'} 
                  onValueChange={(value) => setNewCustomField(prev => ({ ...prev, type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {customFieldTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={newCustomField.value || ''}
                  onChange={(e) => setNewCustomField(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="Value"
                  type={newCustomField.type === 'number' ? 'number' : newCustomField.type === 'date' ? 'date' : 'text'}
                />
                <Button type="button" onClick={handleAddCustomField} disabled={!newCustomField.name?.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Display existing custom fields */}
              {formData.customFields && formData.customFields.length > 0 && (
                <div className="space-y-2">
                  {formData.customFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2 p-2 border rounded">
                      <Input
                        value={field.name}
                        onChange={(e) => handleUpdateCustomField(index, 'name', e.target.value)}
                        className="flex-1"
                      />
                      <Select 
                        value={field.type} 
                        onValueChange={(value) => handleUpdateCustomField(index, 'type', value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {customFieldTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={field.value}
                        onChange={(e) => handleUpdateCustomField(index, 'value', e.target.value)}
                        className="flex-1"
                        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCustomField(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <h3 className="text-lg font-semibold">Description & Notes</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of the manufactured home..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Internal notes for staff use..."
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}