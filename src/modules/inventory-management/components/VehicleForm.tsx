import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Upload, Plus } from 'lucide-react'

interface VehicleFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (vehicleData: any) => void
  vehicle?: any
  mode?: 'add' | 'edit'
}

// Vehicle type definitions
const VEHICLE_TYPES = {
  'RV': [
    'Class A Motorhome',
    'Class B Motorhome', 
    'Class C Motorhome',
    'Travel Trailer',
    'Fifth Wheel',
    'Toy Hauler',
    'Pop-up Camper',
    'Truck Camper'
  ],
  'Manufactured Home': [
    'Single Wide',
    'Double Wide', 
    'Triple Wide',
    'Modular Home',
    'Park Model',
    'Tiny Home'
  ]
}

const CONDITION_OPTIONS = [
  'New',
  'Used - Excellent',
  'Used - Good', 
  'Used - Fair',
  'Used - Poor',
  'Certified Pre-Owned',
  'Refurbished'
]

const STATUS_OPTIONS = [
  'Available',
  'Sold',
  'Pending',
  'On Hold',
  'In Service',
  'Damaged'
]

export default function VehicleForm({ isOpen, onClose, onSubmit, vehicle, mode = 'add' }: VehicleFormProps) {
  const [formData, setFormData] = useState({
    type: '',
    subType: '',
    make: '',
    model: '',
    year: '',
    vin: '',
    stockNumber: '',
    condition: '',
    status: 'Available',
    purchasePrice: '',
    retailPrice: '',
    wholesalePrice: '',
    mileage: '',
    length: '',
    width: '',
    height: '',
    weight: '',
    sleeps: '',
    slideOuts: '',
    fuelType: '',
    engineSize: '',
    transmission: '',
    exteriorColor: '',
    interiorColor: '',
    features: [] as string[],
    description: '',
    location: '',
    images: [] as string[],
    documents: [] as string[]
  })

  const [newFeature, setNewFeature] = useState('')
  const [availableSubTypes, setAvailableSubTypes] = useState<string[]>([])

  // Reset sub-type when main type changes
  useEffect(() => {
    if (formData.type && VEHICLE_TYPES[formData.type as keyof typeof VEHICLE_TYPES]) {
      setAvailableSubTypes(VEHICLE_TYPES[formData.type as keyof typeof VEHICLE_TYPES])
      // Clear sub-type if it's not valid for the new type
      if (formData.subType && !VEHICLE_TYPES[formData.type as keyof typeof VEHICLE_TYPES].includes(formData.subType)) {
        setFormData(prev => ({ ...prev, subType: '' }))
      }
    } else {
      setAvailableSubTypes([])
      setFormData(prev => ({ ...prev, subType: '' }))
    }
  }, [formData.type])

  // Initialize form data when vehicle prop changes
  useEffect(() => {
    if (vehicle && mode === 'edit') {
      setFormData({
        type: vehicle.type || '',
        subType: vehicle.subType || '',
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year?.toString() || '',
        vin: vehicle.vin || '',
        stockNumber: vehicle.stockNumber || '',
        condition: vehicle.condition || '',
        status: vehicle.status || 'Available',
        purchasePrice: vehicle.purchasePrice?.toString() || '',
        retailPrice: vehicle.retailPrice?.toString() || '',
        wholesalePrice: vehicle.wholesalePrice?.toString() || '',
        mileage: vehicle.mileage?.toString() || '',
        length: vehicle.length?.toString() || '',
        width: vehicle.width?.toString() || '',
        height: vehicle.height?.toString() || '',
        weight: vehicle.weight?.toString() || '',
        sleeps: vehicle.sleeps?.toString() || '',
        slideOuts: vehicle.slideOuts?.toString() || '',
        fuelType: vehicle.fuelType || '',
        engineSize: vehicle.engineSize || '',
        transmission: vehicle.transmission || '',
        exteriorColor: vehicle.exteriorColor || '',
        interiorColor: vehicle.interiorColor || '',
        features: vehicle.features || [],
        description: vehicle.description || '',
        location: vehicle.location || '',
        images: vehicle.images || [],
        documents: vehicle.documents || []
      })
    } else if (mode === 'add') {
      // Reset form for new vehicle
      setFormData({
        type: '',
        subType: '',
        make: '',
        model: '',
        year: '',
        vin: '',
        stockNumber: '',
        condition: '',
        status: 'Available',
        purchasePrice: '',
        retailPrice: '',
        wholesalePrice: '',
        mileage: '',
        length: '',
        width: '',
        height: '',
        weight: '',
        sleeps: '',
        slideOuts: '',
        fuelType: '',
        engineSize: '',
        transmission: '',
        exteriorColor: '',
        interiorColor: '',
        features: [],
        description: '',
        location: '',
        images: [],
        documents: []
      })
    }
  }, [vehicle, mode, isOpen])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Convert string numbers back to numbers for submission
    const processedData = {
      ...formData,
      year: formData.year ? parseInt(formData.year) : undefined,
      purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined,
      retailPrice: formData.retailPrice ? parseFloat(formData.retailPrice) : undefined,
      wholesalePrice: formData.wholesalePrice ? parseFloat(formData.wholesalePrice) : undefined,
      mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
      length: formData.length ? parseFloat(formData.length) : undefined,
      width: formData.width ? parseFloat(formData.width) : undefined,
      height: formData.height ? parseFloat(formData.height) : undefined,
      weight: formData.weight ? parseInt(formData.weight) : undefined,
      sleeps: formData.sleeps ? parseInt(formData.sleeps) : undefined,
      slideOuts: formData.slideOuts ? parseInt(formData.slideOuts) : undefined,
    }

    onSubmit(processedData)
    onClose()
  }

  const isRV = formData.type === 'RV'
  const isMH = formData.type === 'Manufactured Home'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Vehicle' : 'Add New Vehicle'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Type Selection - Primary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vehicle Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => handleInputChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RV">RV</SelectItem>
                      <SelectItem value="Manufactured Home">Manufactured Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sub-Type Selection - Dynamic based on Type */}
                {formData.type && availableSubTypes.length > 0 && (
                  <div>
                    <Label htmlFor="subType">
                      {isRV ? 'RV Type' : 'Home Type'} *
                    </Label>
                    <Select 
                      value={formData.subType} 
                      onValueChange={(value) => handleInputChange('subType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${isRV ? 'RV' : 'home'} type`} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubTypes.map((subType) => (
                          <SelectItem key={subType} value={subType}>
                            {subType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="make">Make *</Label>
                  <Input
                    id="make"
                    value={formData.make}
                    onChange={(e) => handleInputChange('make', e.target.value)}
                    placeholder="e.g., Forest River, Clayton"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="e.g., Cherokee, Inspiration"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    placeholder="2024"
                    min="1900"
                    max="2030"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vin">VIN *</Label>
                  <Input
                    id="vin"
                    value={formData.vin}
                    onChange={(e) => handleInputChange('vin', e.target.value)}
                    placeholder="17-character VIN"
                    maxLength={17}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stockNumber">Stock Number</Label>
                  <Input
                    id="stockNumber"
                    value={formData.stockNumber}
                    onChange={(e) => handleInputChange('stockNumber', e.target.value)}
                    placeholder="Internal stock number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="condition">Condition *</Label>
                  <Select 
                    value={formData.condition} 
                    onValueChange={(value) => handleInputChange('condition', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITION_OPTIONS.map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
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

          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="purchasePrice">Purchase Price</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    step="0.01"
                    value={formData.purchasePrice}
                    onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="retailPrice">Retail Price</Label>
                  <Input
                    id="retailPrice"
                    type="number"
                    step="0.01"
                    value={formData.retailPrice}
                    onChange={(e) => handleInputChange('retailPrice', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="wholesalePrice">Wholesale Price</Label>
                  <Input
                    id="wholesalePrice"
                    type="number"
                    step="0.01"
                    value={formData.wholesalePrice}
                    onChange={(e) => handleInputChange('wholesalePrice', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {isRV && (
                  <div>
                    <Label htmlFor="mileage">Mileage</Label>
                    <Input
                      id="mileage"
                      type="number"
                      value={formData.mileage}
                      onChange={(e) => handleInputChange('mileage', e.target.value)}
                      placeholder="Miles"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="length">Length (ft)</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.1"
                    value={formData.length}
                    onChange={(e) => handleInputChange('length', e.target.value)}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <Label htmlFor="width">Width (ft)</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.1"
                    value={formData.width}
                    onChange={(e) => handleInputChange('width', e.target.value)}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (ft)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="sleeps">Sleeps</Label>
                  <Input
                    id="sleeps"
                    type="number"
                    value={formData.sleeps}
                    onChange={(e) => handleInputChange('sleeps', e.target.value)}
                    placeholder="0"
                  />
                </div>
                {isRV && (
                  <div>
                    <Label htmlFor="slideOuts">Slide Outs</Label>
                    <Input
                      id="slideOuts"
                      type="number"
                      value={formData.slideOuts}
                      onChange={(e) => handleInputChange('slideOuts', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                )}
              </div>

              {isRV && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select 
                      value={formData.fuelType} 
                      onValueChange={(value) => handleInputChange('fuelType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gas">Gas</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="engineSize">Engine Size</Label>
                    <Input
                      id="engineSize"
                      value={formData.engineSize}
                      onChange={(e) => handleInputChange('engineSize', e.target.value)}
                      placeholder="e.g., 6.8L V10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select 
                      value={formData.transmission} 
                      onValueChange={(value) => handleInputChange('transmission', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="exteriorColor">Exterior Color</Label>
                  <Input
                    id="exteriorColor"
                    value={formData.exteriorColor}
                    onChange={(e) => handleInputChange('exteriorColor', e.target.value)}
                    placeholder="e.g., Arctic White"
                  />
                </div>
                <div>
                  <Label htmlFor="interiorColor">Interior Color</Label>
                  <Input
                    id="interiorColor"
                    value={formData.interiorColor}
                    onChange={(e) => handleInputChange('interiorColor', e.target.value)}
                    placeholder="e.g., Cognac"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                />
                <Button type="button" onClick={handleAddFeature} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {feature}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleRemoveFeature(feature)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description and Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of the vehicle..."
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Lot location or storage area"
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'edit' ? 'Update Vehicle' : 'Add Vehicle'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}