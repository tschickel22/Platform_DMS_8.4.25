import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'

interface VehicleFormProps {
  vehicle?: any
  onSubmit: (data: any) => void
  onCancel: () => void
  defaultType?: 'RV' | 'Manufactured Home'
}

function VehicleForm({ vehicle, onSubmit, onCancel, defaultType }: VehicleFormProps) {
  // Primary vehicle type state
  const [vehicleType, setVehicleType] = useState<string>(vehicle?.type || defaultType || '')
  const [vehicleSubType, setVehicleSubType] = useState<string>(vehicle?.subType || '')
  
  // Define sub-type options for each primary type
  const subTypeOptions = {
    'RV': [
      'Travel Trailer',
      'Fifth Wheel',
      'Class A Motorhome',
      'Class B Motorhome',
      'Class C Motorhome',
      'Pop-up Camper',
      'Truck Camper',
      'Toy Hauler'
    ],
    'Manufactured Home': [
      'Single Wide',
      'Double Wide',
      'Triple Wide',
      'Modular Home',
      'Park Model'
    ]
  }

  // Form state
  const [formData, setFormData] = useState({
    vin: vehicle?.vin || '',
    year: vehicle?.year || '',
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    trim: vehicle?.trim || '',
    color: vehicle?.color || '',
    mileage: vehicle?.mileage || '',
    condition: vehicle?.condition || 'New',
    status: vehicle?.status || 'Available',
    purchasePrice: vehicle?.purchasePrice || '',
    retailPrice: vehicle?.retailPrice || '',
    location: vehicle?.location || '',
    description: vehicle?.description || '',
    features: vehicle?.features || [],
    images: vehicle?.images || []
  })

  const [newFeature, setNewFeature] = useState('')

  // Handle primary type change and reset sub-type
  const handleVehicleTypeChange = (value: string) => {
    setVehicleType(value)
    setVehicleSubType('') // Reset sub-type when primary type changes
  }

  const handleInputChange = (field: string, value: string) => {
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
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Include vehicle type and sub-type in the submission
    const submitData = {
      ...formData,
      type: vehicleType,
      subType: vehicleSubType,
      id: vehicle?.id || Date.now().toString()
    }
    
    onSubmit(submitData)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</CardTitle>
        <CardDescription>
          {vehicle ? 'Update vehicle information' : 'Enter details for the new vehicle'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type *</Label>
              <Select value={vehicleType} onValueChange={handleVehicleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RV">RV</SelectItem>
                  <SelectItem value="Manufactured Home">Manufactured Home</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic Sub-Type Selection */}
            {vehicleType && (
              <div className="space-y-2">
                <Label htmlFor="vehicleSubType">
                  {vehicleType === 'RV' ? 'RV Type' : 'Home Type'} *
                </Label>
                <Select value={vehicleSubType} onValueChange={setVehicleSubType}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${vehicleType.toLowerCase()} type`} />
                  </SelectTrigger>
                  <SelectContent>
                    {subTypeOptions[vehicleType as keyof typeof subTypeOptions]?.map((subType) => (
                      <SelectItem key={subType} value={subType}>
                        {subType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vin">VIN/Serial Number *</Label>
              <Input
                id="vin"
                value={formData.vin}
                onChange={(e) => handleInputChange('vin', e.target.value)}
                placeholder="Enter VIN or serial number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                placeholder="Enter year"
                min="1900"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make *</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => handleInputChange('make', e.target.value)}
                placeholder="Enter make"
                required
              />
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trim">Trim/Floor Plan</Label>
              <Input
                id="trim"
                value={formData.trim}
                onChange={(e) => handleInputChange('trim', e.target.value)}
                placeholder="Enter trim or floor plan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                placeholder="Enter color"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage/Hours</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => handleInputChange('mileage', e.target.value)}
                placeholder="Enter mileage or hours"
                min="0"
              />
            </div>
          </div>

          {/* Condition and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Used">Used</SelectItem>
                  <SelectItem value="Certified Pre-Owned">Certified Pre-Owned</SelectItem>
                  <SelectItem value="Refurbished">Refurbished</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Sold">Sold</SelectItem>
                  <SelectItem value="Reserved">Reserved</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Service">In Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price</Label>
              <Input
                id="purchasePrice"
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                placeholder="Enter purchase price"
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retailPrice">Retail Price *</Label>
              <Input
                id="retailPrice"
                type="number"
                value={formData.retailPrice}
                onChange={(e) => handleInputChange('retailPrice', e.target.value)}
                placeholder="Enter retail price"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Enter current location"
            />
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label>Features</Label>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter vehicle description"
              rows={4}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!vehicleType || !vehicleSubType || !formData.vin || !formData.year || !formData.make || !formData.model || !formData.retailPrice}
            >
              {vehicle ? 'Update' : 'Add'} {vehicleType || 'Vehicle'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export { VehicleForm }
export default VehicleForm