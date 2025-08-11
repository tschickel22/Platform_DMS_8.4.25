import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { X, Plus, Upload, Camera } from 'lucide-react'

interface RVInventoryFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  initialData?: any
}

function RVInventoryForm({ onSubmit, onCancel, initialData }: RVInventoryFormProps) {
  const [formData, setFormData] = useState({
    // Basic Information
    vin: initialData?.vin || '',
    make: initialData?.make || '',
    model: initialData?.model || '',
    year: initialData?.year || new Date().getFullYear(),
    mileage: initialData?.mileage || '',
    bodyStyle: initialData?.bodyStyle || '',
    
    // Vehicle Details
    fuelType: initialData?.fuelType || '',
    transmission: initialData?.transmission || '',
    exteriorColor: initialData?.exteriorColor || '',
    interiorColor: initialData?.interiorColor || '',
    condition: initialData?.condition || '',
    availability: initialData?.availability || '',
    
    // RV Specific
    rvType: initialData?.rvType || '',
    length: initialData?.length || '',
    slideOuts: initialData?.slideOuts || '',
    sleeps: initialData?.sleeps || '',
    awning: initialData?.awning || false,
    generator: initialData?.generator || false,
    
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
    'Winnebago', 'Thor', 'Forest River', 'Jayco', 'Coachmen', 'Keystone', 'Heartland', 
    'Grand Design', 'Newmar', 'Tiffin', 'Holiday Rambler', 'Fleetwood', 'Dutchmen', 
    'Prime Time', 'Palomino', 'Gulf Stream', 'Cruiser RV', 'KZ', 'Northwood', 'Lance'
  ]

  const bodyStyleOptions = [
    'Class A Motorhome', 'Class B Motorhome', 'Class C Motorhome', 'Travel Trailer', 
    'Fifth Wheel', 'Toy Hauler', 'Pop-up Camper', 'Truck Camper', 'Park Model', 
    'Destination Trailer', 'Hybrid Trailer', 'Teardrop Trailer'
  ]

  const rvTypeOptions = [
    'Motorhome', 'Travel Trailer', 'Fifth Wheel', 'Toy Hauler', 'Pop-up', 'Truck Camper'
  ]

  const fuelTypeOptions = [
    'Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Propane'
  ]

  const transmissionOptions = [
    'Automatic', 'Manual', 'CVT', '6-Speed Automatic', '8-Speed Automatic', '10-Speed Automatic'
  ]

  const conditionOptions = [
    'New', 'Used - Excellent', 'Used - Good', 'Used - Fair', 'Certified Pre-Owned', 'Damaged'
  ]

  const availabilityOptions = [
    'Available', 'Sold', 'Pending', 'On Hold', 'In Transit', 'Service Required'
  ]

  const slideOutOptions = [
    '0', '1', '2', '3', '4', '5+'
  ]

  const sleepsOptions = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {initialData ? 'Edit RV' : 'Add RV'}
          </h1>
          <p className="text-muted-foreground">
            {initialData ? 'Update RV information' : 'Add a new RV to inventory'}
          </p>
        </div>
        <div className="flex gap-2">
            onClick={onCancel}
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {initialData ? 'Update RV' : 'Add RV'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details about the RV
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vin">VIN *</Label>
                <Input
                  id="vin"
                  value={formData.vin}
                  onChange={(e) => handleInputChange('vin', e.target.value)}
                  placeholder="Enter VIN number"
                  required
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
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', e.target.value)}
                  placeholder="Enter mileage"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bodyStyle">Body Style *</Label>
                <Select value={formData.bodyStyle || ''} onValueChange={(value) => handleInputChange('bodyStyle', value)}>
                  <SelectTrigger>
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Details */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                  value={formData.exteriorColor}
                  onChange={(e) => handleInputChange('exteriorColor', e.target.value)}
                  placeholder="Enter exterior color"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interiorColor">Interior Color</Label>
                <Input
                  id="interiorColor"
                  value={formData.interiorColor}
                  onChange={(e) => handleInputChange('interiorColor', e.target.value)}
                  placeholder="Enter interior color"
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
                    {availabilityOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RV Specific Details */}
        <Card>
          <CardHeader>
            <CardTitle>RV Specific Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rvType">RV Type</Label>
                <Select value={formData.rvType || ''} onValueChange={(value) => handleInputChange('rvType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select RV type" />
                  </SelectTrigger>
                  <SelectContent>
                    {rvTypeOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
                <Label htmlFor="slideOuts">Slide Outs</Label>
                <Select value={formData.slideOuts || ''} onValueChange={(value) => handleInputChange('slideOuts', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of slide outs" />
                  </SelectTrigger>
                  <SelectContent>
                    {slideOutOptions.map((count) => (
                      <SelectItem key={count} value={count}>
                        {count}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sleeps">Sleeps</Label>
                <Select value={formData.sleeps || ''} onValueChange={(value) => handleInputChange('sleeps', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sleeping capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    {sleepsOptions.map((count) => (
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

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>
              Add key features and amenities
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
              Upload photos of the RV
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

export default RVInventoryForm
export { RVInventoryForm }