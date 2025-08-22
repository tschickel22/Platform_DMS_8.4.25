import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { Save, ArrowLeft } from 'lucide-react'
import { mockInventory } from '@/mocks/inventoryMock'
import { generateId } from '@/lib/utils'

interface VehicleFormProps {
  mode: 'create' | 'edit'
  vehicleId?: string
  onSave?: (vehicle: any) => void
  onCancel?: () => void
}

export function VehicleForm({ mode, vehicleId, onSave, onCancel }: VehicleFormProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { handleError } = useErrorHandler()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    listingType: 'rv',
    inventoryId: '',
    year: new Date().getFullYear(),
    make: '',
    model: '',
    vin: '',
    condition: 'new',
    salePrice: 0,
    rentPrice: 0,
    offerType: 'for_sale',
    status: 'available',
    description: '',
    searchResultsText: '',
    
    // RV specific
    sleeps: 4,
    slides: 1,
    length: 0,
    fuelType: 'gasoline',
    engine: '',
    transmission: 'Automatic',
    odometerMiles: 0,
    
    // MH specific
    bedrooms: 3,
    bathrooms: 2,
    serialNumber: '',
    dimensions: {
      width_ft: 28,
      length_ft: 66,
      sections: 2
    },
    
    // Location
    location: {
      city: '',
      state: '',
      postalCode: '',
      communityName: ''
    },
    
    // Features
    features: {
      generator: false,
      solar: false,
      awning: false,
      slideOut: false,
      centralAir: false,
      fireplace: false,
      dishwasher: false,
      washerDryer: false,
      vaultedCeilings: false,
      deck: false,
      shed: false,
      energyStar: false,
      garage: false
    },
    
    // Media
    media: {
      primaryPhoto: '',
      photos: []
    }
  })

  // Load existing vehicle data for edit mode
  useEffect(() => {
    if (mode === 'edit' && vehicleId) {
      const existingVehicle = mockInventory.sampleVehicles.find(v => v.id === vehicleId)
      if (existingVehicle) {
        setFormData({
          ...formData,
          ...existingVehicle,
          features: { ...formData.features, ...existingVehicle.features },
          location: { ...formData.location, ...existingVehicle.location },
          media: { ...formData.media, ...existingVehicle.media },
          dimensions: existingVehicle.dimensions || formData.dimensions
        })
      }
    }
  }, [mode, vehicleId])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: checked
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      // Validate required fields
      if (!formData.make || !formData.model || !formData.year) {
        throw new Error('Please fill in all required fields')
      }
      
      const vehicleData = {
        ...formData,
        id: mode === 'create' ? generateId() : vehicleId,
        inventoryId: formData.inventoryId || `INV-${formData.listingType.toUpperCase()}-${generateId().slice(0, 6)}`,
        searchResultsText: formData.searchResultsText || `${formData.year} ${formData.make} ${formData.model}`,
        createdAt: mode === 'create' ? new Date().toISOString() : formData.createdAt,
        updatedAt: new Date().toISOString()
      }
      
      if (mode === 'create') {
        // Add to mock data
        mockInventory.sampleVehicles.push(vehicleData)
        
        toast({
          title: 'Vehicle Added',
          description: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model} has been added to inventory.`
        })
        
        // Navigate to detail view
        navigate(`/inventory/${vehicleData.id}`)
      } else {
        // Update existing vehicle
        const index = mockInventory.sampleVehicles.findIndex(v => v.id === vehicleId)
        if (index !== -1) {
          mockInventory.sampleVehicles[index] = vehicleData
        }
        
        toast({
          title: 'Vehicle Updated',
          description: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model} has been updated.`
        })
        
        // Navigate to detail view
        navigate(`/inventory/${vehicleData.id}`)
      }
      
      if (onSave) {
        onSave(vehicleData)
      }
      
    } catch (error) {
      handleError(error, 'saving vehicle')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      navigate('/inventory')
    }
  }

  const isRV = formData.listingType === 'rv'
  const isMH = formData.listingType === 'manufactured_home'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {mode === 'create' ? 'Add New Vehicle' : 'Edit Vehicle'}
          </h1>
          <p className="text-muted-foreground">
            {mode === 'create' 
              ? 'Add a new vehicle to your inventory' 
              : 'Update vehicle information'
            }
          </p>
        </div>
        <Button variant="outline" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inventory
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details for this vehicle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="listingType">Vehicle Type *</Label>
                <Select 
                  value={formData.listingType} 
                  onValueChange={(value) => handleInputChange('listingType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rv">RV</SelectItem>
                    <SelectItem value="manufactured_home">Manufactured Home</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="inventoryId">Inventory ID</Label>
                <Input
                  id="inventoryId"
                  value={formData.inventoryId}
                  onChange={(e) => handleInputChange('inventoryId', e.target.value)}
                  placeholder="Auto-generated if empty"
                />
              </div>
              
              <div>
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value) || 0)}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>
              
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
                  placeholder="e.g., Cherokee, The Edge"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="vin">VIN/Serial Number</Label>
                <Input
                  id="vin"
                  value={isRV ? formData.vin : formData.serialNumber}
                  onChange={(e) => handleInputChange(isRV ? 'vin' : 'serialNumber', e.target.value)}
                  placeholder={isRV ? "Vehicle VIN" : "Serial Number"}
                />
              </div>
              
              <div>
                <Label htmlFor="condition">Condition</Label>
                <Select 
                  value={formData.condition} 
                  onValueChange={(value) => handleInputChange('condition', value)}
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
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="service">In Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & Offer Type</CardTitle>
            <CardDescription>
              Set pricing and availability options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="offerType">Offer Type</Label>
              <Select 
                value={formData.offerType} 
                onValueChange={(value) => handleInputChange('offerType', value)}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(formData.offerType === 'for_sale' || formData.offerType === 'both') && (
                <div>
                  <Label htmlFor="salePrice">Sale Price</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => handleInputChange('salePrice', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              )}
              
              {(formData.offerType === 'for_rent' || formData.offerType === 'both') && (
                <div>
                  <Label htmlFor="rentPrice">Rent Price (Monthly)</Label>
                  <Input
                    id="rentPrice"
                    type="number"
                    value={formData.rentPrice}
                    onChange={(e) => handleInputChange('rentPrice', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* RV Specific Fields */}
        {isRV && (
          <Card>
            <CardHeader>
              <CardTitle>RV Specifications</CardTitle>
              <CardDescription>
                RV-specific details and specifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="sleeps">Sleeps</Label>
                  <Input
                    id="sleeps"
                    type="number"
                    value={formData.sleeps}
                    onChange={(e) => handleInputChange('sleeps', parseInt(e.target.value) || 0)}
                    min="1"
                    max="20"
                  />
                </div>
                
                <div>
                  <Label htmlFor="slides">Slide Outs</Label>
                  <Input
                    id="slides"
                    type="number"
                    value={formData.slides}
                    onChange={(e) => handleInputChange('slides', parseInt(e.target.value) || 0)}
                    min="0"
                    max="10"
                  />
                </div>
                
                <div>
                  <Label htmlFor="length">Length (ft)</Label>
                  <Input
                    id="length"
                    type="number"
                    value={formData.length}
                    onChange={(e) => handleInputChange('length', parseFloat(e.target.value) || 0)}
                    step="0.1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Select 
                    value={formData.fuelType} 
                    onValueChange={(value) => handleInputChange('fuelType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                    value={formData.transmission} 
                    onValueChange={(value) => handleInputChange('transmission', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="engine">Engine</Label>
                  <Input
                    id="engine"
                    value={formData.engine}
                    onChange={(e) => handleInputChange('engine', e.target.value)}
                    placeholder="e.g., Ford V10, Cummins ISL"
                  />
                </div>
                
                <div>
                  <Label htmlFor="odometerMiles">Odometer (Miles)</Label>
                  <Input
                    id="odometerMiles"
                    type="number"
                    value={formData.odometerMiles}
                    onChange={(e) => handleInputChange('odometerMiles', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Manufactured Home Specific Fields */}
        {isMH && (
          <Card>
            <CardHeader>
              <CardTitle>Manufactured Home Specifications</CardTitle>
              <CardDescription>
                Manufactured home specific details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
                    min="1"
                    max="10"
                  />
                </div>
                
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', parseFloat(e.target.value) || 0)}
                    step="0.5"
                    min="1"
                    max="10"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="width">Width (ft)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={formData.dimensions.width_ft}
                    onChange={(e) => handleNestedChange('dimensions', 'width_ft', parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="length_ft">Length (ft)</Label>
                  <Input
                    id="length_ft"
                    type="number"
                    value={formData.dimensions.length_ft}
                    onChange={(e) => handleNestedChange('dimensions', 'length_ft', parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="sections">Sections</Label>
                  <Select 
                    value={formData.dimensions.sections.toString()} 
                    onValueChange={(value) => handleNestedChange('dimensions', 'sections', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Single Wide</SelectItem>
                      <SelectItem value="2">Double Wide</SelectItem>
                      <SelectItem value="3">Triple Wide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
            <CardDescription>
              Where is this vehicle located?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.location.city}
                  onChange={(e) => handleNestedChange('location', 'city', e.target.value)}
                  placeholder="City"
                />
              </div>
              
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.location.state}
                  onChange={(e) => handleNestedChange('location', 'state', e.target.value)}
                  placeholder="State"
                />
              </div>
              
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={formData.location.postalCode}
                  onChange={(e) => handleNestedChange('location', 'postalCode', e.target.value)}
                  placeholder="Postal Code"
                />
              </div>
            </div>
            
            {isMH && (
              <div>
                <Label htmlFor="communityName">Community Name</Label>
                <Input
                  id="communityName"
                  value={formData.location.communityName}
                  onChange={(e) => handleNestedChange('location', 'communityName', e.target.value)}
                  placeholder="Mobile home community name"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Features & Amenities</CardTitle>
            <CardDescription>
              Select the features and amenities included
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {isRV && (
                <>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="generator"
                      checked={formData.features.generator}
                      onCheckedChange={(checked) => handleFeatureChange('generator', !!checked)}
                    />
                    <Label htmlFor="generator">Generator</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="solar"
                      checked={formData.features.solar}
                      onCheckedChange={(checked) => handleFeatureChange('solar', !!checked)}
                    />
                    <Label htmlFor="solar">Solar Panels</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="awning"
                      checked={formData.features.awning}
                      onCheckedChange={(checked) => handleFeatureChange('awning', !!checked)}
                    />
                    <Label htmlFor="awning">Awning</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="slideOut"
                      checked={formData.features.slideOut}
                      onCheckedChange={(checked) => handleFeatureChange('slideOut', !!checked)}
                    />
                    <Label htmlFor="slideOut">Slide Outs</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="garage"
                      checked={formData.features.garage}
                      onCheckedChange={(checked) => handleFeatureChange('garage', !!checked)}
                    />
                    <Label htmlFor="garage">Garage Space</Label>
                  </div>
                </>
              )}
              
              {isMH && (
                <>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="centralAir"
                      checked={formData.features.centralAir}
                      onCheckedChange={(checked) => handleFeatureChange('centralAir', !!checked)}
                    />
                    <Label htmlFor="centralAir">Central Air</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fireplace"
                      checked={formData.features.fireplace}
                      onCheckedChange={(checked) => handleFeatureChange('fireplace', !!checked)}
                    />
                    <Label htmlFor="fireplace">Fireplace</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dishwasher"
                      checked={formData.features.dishwasher}
                      onCheckedChange={(checked) => handleFeatureChange('dishwasher', !!checked)}
                    />
                    <Label htmlFor="dishwasher">Dishwasher</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="washerDryer"
                      checked={formData.features.washerDryer}
                      onCheckedChange={(checked) => handleFeatureChange('washerDryer', !!checked)}
                    />
                    <Label htmlFor="washerDryer">Washer/Dryer</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vaultedCeilings"
                      checked={formData.features.vaultedCeilings}
                      onCheckedChange={(checked) => handleFeatureChange('vaultedCeilings', !!checked)}
                    />
                    <Label htmlFor="vaultedCeilings">Vaulted Ceilings</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="deck"
                      checked={formData.features.deck}
                      onCheckedChange={(checked) => handleFeatureChange('deck', !!checked)}
                    />
                    <Label htmlFor="deck">Deck</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="shed"
                      checked={formData.features.shed}
                      onCheckedChange={(checked) => handleFeatureChange('shed', !!checked)}
                    />
                    <Label htmlFor="shed">Storage Shed</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="energyStar"
                      checked={formData.features.energyStar}
                      onCheckedChange={(checked) => handleFeatureChange('energyStar', !!checked)}
                    />
                    <Label htmlFor="energyStar">Energy Star</Label>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description & Marketing</CardTitle>
            <CardDescription>
              Add description and marketing details
            </CardDescription>
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
              <Label htmlFor="searchResultsText">Search Results Text</Label>
              <Input
                id="searchResultsText"
                value={formData.searchResultsText}
                onChange={(e) => handleInputChange('searchResultsText', e.target.value)}
                placeholder="Text shown in search results"
              />
            </div>
            
            <div>
              <Label htmlFor="primaryPhoto">Primary Photo URL</Label>
              <Input
                id="primaryPhoto"
                value={formData.media.primaryPhoto}
                onChange={(e) => handleNestedChange('media', 'primaryPhoto', e.target.value)}
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : mode === 'create' ? 'Add Vehicle' : 'Update Vehicle'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default VehicleForm