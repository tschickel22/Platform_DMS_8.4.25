import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { X, Plus, Upload, Camera } from 'lucide-react'

interface MHInventoryFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  initialData?: any
}

export default function MHInventoryForm({ onSubmit, onCancel, initialData }: MHInventoryFormProps) {
  const [formData, setFormData] = useState({
    // Basic Information
    vin: initialData?.vin || '',
    make: initialData?.make || '',
    model: initialData?.model || '',
    year: initialData?.year || new Date().getFullYear(),
    serialNumber: initialData?.serialNumber || '',
    
    // Mobile Home Specific
    homeType: initialData?.homeType || '',
    width: initialData?.width || '',
    length: initialData?.length || '',
    squareFootage: initialData?.squareFootage || '',
    bedrooms: initialData?.bedrooms || '',
    bathrooms: initialData?.bathrooms || '',
    
    // Construction Details
    exteriorMaterial: initialData?.exteriorMaterial || '',
    roofMaterial: initialData?.roofMaterial || '',
    flooringType: initialData?.flooringType || '',
    insulationType: initialData?.insulationType || '',
    
    // Condition & Status
    condition: initialData?.condition || '',
    availability: initialData?.availability || '',
    location: initialData?.location || '',
    
    // Features & Amenities
    hasFireplace: initialData?.hasFireplace || false,
    hasDeck: initialData?.hasDeck || false,
    hasStorage: initialData?.hasStorage || false,
    hasCarport: initialData?.hasCarport || false,
    centralAir: initialData?.centralAir || false,
    
    // Pricing
    msrp: initialData?.msrp || '',
    salePrice: initialData?.salePrice || '',
    cost: initialData?.cost || '',
    
    // Features
    features: initialData?.features || [],
    
    // Description
    description: initialData?.description || '',
    
    // Images
    images: initialData?.images || []
  })

  const [newFeature, setNewFeature] = useState('')

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_: any, i: number) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  // Dropdown options
  const makeOptions = [
    'Clayton', 'Champion', 'Fleetwood', 'Skyline', 'Palm Harbor', 'Cavco', 'Deer Valley',
    'Redman', 'Schult', 'Marlette', 'Liberty', 'Oakwood', 'Southern Energy', 'TRU',
    'Fairmont', 'Friendship', 'Homes of Merit', 'Kit', 'Legacy', 'Nobility'
  ]

  const homeTypeOptions = [
    'Single Wide', 'Double Wide', 'Triple Wide', 'Modular Home', 'Park Model', 
    'Tiny Home', 'Manufactured Home', 'Mobile Home'
  ]

  const widthOptions = [
    '12 ft', '14 ft', '16 ft', '18 ft', '20 ft', '24 ft', '28 ft', '32 ft'
  ]

  const bedroomOptions = [
    '1', '2', '3', '4', '5', '6+'
  ]

  const bathroomOptions = [
    '1', '1.5', '2', '2.5', '3', '3.5', '4+'
  ]

  const exteriorMaterialOptions = [
    'Vinyl Siding', 'Fiber Cement', 'Wood Siding', 'Metal Siding', 'Brick', 
    'Stone', 'Stucco', 'Composite'
  ]

  const roofMaterialOptions = [
    'Asphalt Shingles', 'Metal Roofing', 'TPO', 'EPDM', 'Built-up Roofing', 'Tile'
  ]

  const flooringOptions = [
    'Carpet', 'Vinyl Plank', 'Laminate', 'Hardwood', 'Tile', 'Linoleum', 'Concrete'
  ]

  const insulationOptions = [
    'Fiberglass', 'Foam Board', 'Spray Foam', 'Cellulose', 'Mineral Wool', 'Reflective'
  ]

  const conditionOptions = [
    'New', 'Like New', 'Excellent', 'Good', 'Fair', 'Needs Work', 'Fixer Upper'
  ]

  const availabilityOptions = [
    'Available', 'Sold', 'Pending', 'On Hold', 'In Transit', 'Setup Required'
  ]

  const locationOptions = [
    'On Lot', 'In Transit', 'Factory', 'Customer Site', 'Storage', 'Display Model'
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {initialData ? 'Edit Mobile Home' : 'Add Mobile Home'}
          </h1>
          <p className="text-muted-foreground">
            {initialData ? 'Update mobile home information' : 'Add a new mobile home to inventory'}
          </p>
        </div>
        <div className="flex gap-2">
            onClick={onCancel}
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {initialData ? 'Update Home' : 'Add Home'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details about the mobile home
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vin">VIN/HUD Label *</Label>
                <Input
                  id="vin"
                  value={formData.vin}
                  onChange={(e) => handleInputChange('vin', e.target.value)}
                  placeholder="Enter VIN or HUD label number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                  placeholder="Enter serial number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="make">Make *</Label>
                <Select value={formData.make || ''} onValueChange={(value) => handleInputChange('make', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select make" />
                  </SelectTrigger>
                  <SelectContent>
                    {makeOptions.map((make) => (
                      <SelectItem key={make} value={make}>
                        {make}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  placeholder="Enter model"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                  placeholder="Enter year"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homeType">Home Type *</Label>
                <Select value={formData.homeType || ''} onValueChange={(value) => handleInputChange('homeType', value)}>
                  <SelectTrigger>
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dimensions & Layout */}
        <Card>
          <CardHeader>
            <CardTitle>Dimensions & Layout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width</Label>
                <Select value={formData.width} onValueChange={(value) => handleInputChange('width', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select width" />
                  </SelectTrigger>
                  <SelectContent>
                    {widthOptions.map((width) => (
                      <SelectItem key={width} value={width}>
                        {width}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">Length (ft)</Label>
                <Input
                  id="length"
                  type="number"
                  value={formData.length}
                  onChange={(e) => handleInputChange('length', e.target.value)}
                  placeholder="Enter length in feet"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="squareFootage">Square Footage</Label>
                <Input
                  id="squareFootage"
                  type="number"
                  value={formData.squareFootage}
                  onChange={(e) => handleInputChange('squareFootage', e.target.value)}
                  placeholder="Enter square footage"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Select value={formData.bedrooms} onValueChange={(value) => handleInputChange('bedrooms', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    {bedroomOptions.map((count) => (
                      <SelectItem key={count} value={count}>
                        {count}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Select value={formData.bathrooms} onValueChange={(value) => handleInputChange('bathrooms', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bathrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    {bathroomOptions.map((count) => (
                      <SelectItem key={count} value={count}>
                        {count}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Construction Details */}
        <Card>
          <CardHeader>
            <CardTitle>Construction Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exteriorMaterial">Exterior Material</Label>
                <Select value={formData.exteriorMaterial} onValueChange={(value) => handleInputChange('exteriorMaterial', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exterior material" />
                  </SelectTrigger>
                  <SelectContent>
                    {exteriorMaterialOptions.map((material) => (
                      <SelectItem key={material} value={material}>
                        {material}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roofMaterial">Roof Material</Label>
                <Select value={formData.roofMaterial || ''} onValueChange={(value) => handleInputChange('roofMaterial', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select roof material" />
                  </SelectTrigger>
                  <SelectContent>
                    {roofMaterialOptions.map((material) => (
                      <SelectItem key={material} value={material}>
                        {material}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="flooringType">Flooring Type</Label>
                <Select value={formData.flooringType || ''} onValueChange={(value) => handleInputChange('flooringType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select flooring type" />
                  </SelectTrigger>
                  <SelectContent>
                    {flooringOptions.map((flooring) => (
                      <SelectItem key={flooring} value={flooring}>
                        {flooring}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="insulationType">Insulation Type</Label>
                <Select value={formData.insulationType} onValueChange={(value) => handleInputChange('insulationType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select insulation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {insulationOptions.map((insulation) => (
                      <SelectItem key={insulation} value={insulation}>
                        {insulation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Condition & Status */}
        <Card>
          <CardHeader>
            <CardTitle>Condition & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    {availabilityOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationOptions.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features & Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Features & Amenities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasFireplace"
                  checked={formData.hasFireplace}
                  onCheckedChange={(checked) => handleInputChange('hasFireplace', checked)}
                />
                <Label htmlFor="hasFireplace">Fireplace</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasDeck"
                  checked={formData.hasDeck}
                  onCheckedChange={(checked) => handleInputChange('hasDeck', checked)}
                />
                <Label htmlFor="hasDeck">Deck/Porch</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasStorage"
                  checked={formData.hasStorage}
                  onCheckedChange={(checked) => handleInputChange('hasStorage', checked)}
                />
                <Label htmlFor="hasStorage">Storage Shed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasCarport"
                  checked={formData.hasCarport}
                  onCheckedChange={(checked) => handleInputChange('hasCarport', checked)}
                />
                <Label htmlFor="hasCarport">Carport</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="centralAir"
                  checked={formData.centralAir}
                  onCheckedChange={(checked) => handleInputChange('centralAir', checked)}
                />
                <Label htmlFor="centralAir">Central Air</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="msrp">MSRP</Label>
                <Input
                  id="msrp"
                  type="number"
                  value={formData.msrp}
                  onChange={(e) => handleInputChange('msrp', e.target.value)}
                  placeholder="Enter MSRP"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salePrice">Sale Price</Label>
                <Input
                  id="salePrice"
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) => handleInputChange('salePrice', e.target.value)}
                  placeholder="Enter sale price"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost</Label>
                <Input
                  id="cost"
                  type="number"
                  value={formData.cost}
                  onChange={(e) => handleInputChange('cost', e.target.value)}
                  placeholder="Enter cost"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Features */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Features</CardTitle>
            <CardDescription>
              Add any additional features or amenities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Enter a feature"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature: string, index: number) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeFeature(index)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter detailed description..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
            <CardDescription>
              Upload photos of the mobile home
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop images here, or click to select files
                </p>
                <Button type="button" variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Select Images
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}