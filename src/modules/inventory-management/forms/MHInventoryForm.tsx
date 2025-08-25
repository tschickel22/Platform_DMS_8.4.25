import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Upload } from 'lucide-react'

interface MHInventoryFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function MHInventoryForm({ initialData, onSubmit, onCancel }: MHInventoryFormProps) {
  const [formData, setFormData] = useState({
    // Basic Information
    inventoryId: '',
    year: '',
    make: '',
    model: '',
    serialNumber: '',
    condition: 'new',
    
    // Pricing
    salePrice: '',
    rentPrice: '',
    cost: '',
    offerType: 'for_sale',
    
    // Specifications
    bedrooms: '',
    bathrooms: '',
    dimensions: {
      width_ft: '',
      length_ft: '',
      sections: '1'
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
      centralAir: false,
      fireplace: false,
      dishwasher: false,
      washerDryer: false,
      vaultedCeilings: false,
      deck: false,
      shed: false,
      energyStar: false
    },
    
    // Media
    media: {
      primaryPhoto: '',
      photos: []
    },
    
    // Marketing
    description: '',
    searchResultsText: '',
    
    // Status
    status: 'available',
    
    // Custom fields
    customFields: {}
  })

  // Initialize form with existing data
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        // Ensure nested objects are properly merged
        dimensions: {
          ...prev.dimensions,
          ...(initialData.dimensions || {})
        },
        location: {
          ...prev.location,
          ...(initialData.location || {})
        },
        features: {
          ...prev.features,
          ...(initialData.features || {})
        },
        media: {
          ...prev.media,
          ...(initialData.media || {})
        }
      }))
    }
  }, [initialData])

  // Handle input changes for text fields
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle nested object changes
  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value
      }
    }))
  }

  // Handle feature toggle changes
  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: checked
      }
    }))
  }

  // Handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (formData.media.primaryPhoto === '') {
          setFormData(prev => ({
            ...prev,
            media: {
              ...prev.media,
              primaryPhoto: result
            }
          }))
        } else {
          setFormData(prev => ({
            ...prev,
            media: {
              ...prev.media,
              photos: [...prev.media.photos, result]
            }
          }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove photo
  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      media: {
        ...prev.media,
        photos: prev.media.photos.filter((_, i) => i !== index)
      }
    }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Convert string numbers to actual numbers for submission
    const processedData = {
      ...formData,
      year: formData.year ? parseInt(formData.year) : undefined,
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
      rentPrice: formData.rentPrice ? parseFloat(formData.rentPrice) : undefined,
      cost: formData.cost ? parseFloat(formData.cost) : undefined,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
      dimensions: {
        width_ft: formData.dimensions.width_ft ? parseInt(formData.dimensions.width_ft) : undefined,
        length_ft: formData.dimensions.length_ft ? parseInt(formData.dimensions.length_ft) : undefined,
        sections: formData.dimensions.sections ? parseInt(formData.dimensions.sections) : 1
      },
      listingType: 'manufactured_home',
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    onSubmit(processedData)
  }

  const conditionOptions = [
    { value: 'new', label: 'New' },
    { value: 'used', label: 'Used' },
    { value: 'refurbished', label: 'Refurbished' }
  ]

  const offerTypeOptions = [
    { value: 'for_sale', label: 'For Sale' },
    { value: 'for_rent', label: 'For Rent' },
    { value: 'both', label: 'Both Sale & Rent' }
  ]

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'reserved', label: 'Reserved' },
    { value: 'sold', label: 'Sold' },
    { value: 'service', label: 'In Service' },
    { value: 'delivered', label: 'Delivered' }
  ]

  const sectionOptions = [
    { value: '1', label: 'Single Wide' },
    { value: '2', label: 'Double Wide' },
    { value: '3', label: 'Triple Wide' }
  ]

  const stateOptions = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' }
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="media">Photos</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="inventoryId">Inventory ID</Label>
                  <Input
                    id="inventoryId"
                    value={formData.inventoryId}
                    onChange={(e) => handleInputChange('inventoryId', e.target.value)}
                    placeholder="INV-MH-001"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    value={formData.make}
                    onChange={(e) => handleInputChange('make', e.target.value)}
                    placeholder="Clayton"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="The Edge"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    value={formData.serialNumber}
                    onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                    placeholder="CL123456789"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Select 
                    value={formData.condition} 
                    onValueChange={(value) => handleInputChange('condition', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="offerType">Offer Type</Label>
                <Select 
                  value={formData.offerType} 
                  onValueChange={(value) => handleInputChange('offerType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select offer type" />
                  </SelectTrigger>
                  <SelectContent>
                    {offerTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {(formData.offerType === 'for_sale' || formData.offerType === 'both') && (
                  <div>
                    <Label htmlFor="salePrice">Sale Price</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      value={formData.salePrice}
                      onChange={(e) => handleInputChange('salePrice', e.target.value)}
                      placeholder="95000"
                      min="0"
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
                      onChange={(e) => handleInputChange('rentPrice', e.target.value)}
                      placeholder="1200"
                      min="0"
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="cost">Cost</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => handleInputChange('cost', e.target.value)}
                    placeholder="75000"
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
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
                    step="0.5"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                    placeholder="2"
                    min="1"
                    max="10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="width">Width (ft)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={formData.dimensions.width_ft}
                    onChange={(e) => handleNestedChange('dimensions', 'width_ft', e.target.value)}
                    placeholder="28"
                    min="10"
                    max="50"
                  />
                </div>
                <div>
                  <Label htmlFor="length">Length (ft)</Label>
                  <Input
                    id="length"
                    type="number"
                    value={formData.dimensions.length_ft}
                    onChange={(e) => handleNestedChange('dimensions', 'length_ft', e.target.value)}
                    placeholder="66"
                    min="20"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="sections">Sections</Label>
                  <Select 
                    value={formData.dimensions.sections} 
                    onValueChange={(value) => handleNestedChange('dimensions', 'sections', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sections" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.location.city}
                    onChange={(e) => handleNestedChange('location', 'city', e.target.value)}
                    placeholder="Tampa"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select 
                    value={formData.location.state} 
                    onValueChange={(value) => handleNestedChange('location', 'state', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {stateOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.location.postalCode}
                    onChange={(e) => handleNestedChange('location', 'postalCode', e.target.value)}
                    placeholder="33601"
                  />
                </div>
                <div>
                  <Label htmlFor="communityName">Community Name</Label>
                  <Input
                    id="communityName"
                    value={formData.location.communityName}
                    onChange={(e) => handleNestedChange('location', 'communityName', e.target.value)}
                    placeholder="Sunset Palms Mobile Home Community"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Features & Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(formData.features).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={feature}
                      checked={enabled}
                      onChange={(e) => handleFeatureChange(feature, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={feature} className="text-sm">
                      {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                  </div>
                ))}
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
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brand new 2023 Clayton double-wide manufactured home. Modern finishes and energy-efficient features."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="searchResultsText">Search Results Text</Label>
                <Input
                  id="searchResultsText"
                  value={formData.searchResultsText}
                  onChange={(e) => handleInputChange('searchResultsText', e.target.value)}
                  placeholder="2023 Clayton The Edge - 3BR/2BA Double-wide"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="primaryPhoto">Primary Photo URL</Label>
                <Input
                  id="primaryPhoto"
                  value={formData.media.primaryPhoto}
                  onChange={(e) => handleNestedChange('media', 'primaryPhoto', e.target.value)}
                  placeholder="https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg"
                />
              </div>

              <div>
                <Label>Upload Photos</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload photos</p>
                  </label>
                </div>
              </div>

              {formData.media.photos.length > 0 && (
                <div>
                  <Label>Additional Photos</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {formData.media.photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Home' : 'Add Home'}
        </Button>
      </div>
    </form>
  )
}