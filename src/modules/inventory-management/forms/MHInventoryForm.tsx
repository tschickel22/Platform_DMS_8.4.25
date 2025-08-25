import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'

interface MHInventoryFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function MHInventoryForm({ initialData, onSubmit, onCancel }: MHInventoryFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    listingType: 'manufactured_home',
    inventoryId: '',
    year: new Date().getFullYear(),
    make: '',
    model: '',
    serialNumber: '',
    condition: 'new',
    salePrice: 0,
    rentPrice: 0,
    offerType: 'for_sale',
    status: 'available',
    bedrooms: 2,
    bathrooms: 1,
    dimensions: {
      width_ft: 14,
      length_ft: 60,
      sections: 1
    },
    description: '',
    searchResultsText: '',
    location: {
      city: '',
      state: '',
      postalCode: '',
      communityName: ''
    },
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
    media: {
      primaryPhoto: '',
      photos: []
    }
  })

  // Initialize form with existing data
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        // Ensure nested objects are properly merged
        dimensions: {
          ...formData.dimensions,
          ...(initialData.dimensions || {})
        },
        location: {
          ...formData.location,
          ...(initialData.location || {})
        },
        features: {
          ...formData.features,
          ...(initialData.features || {})
        },
        media: {
          ...formData.media,
          ...(initialData.media || {})
        }
      })
    }
  }, [initialData])

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
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.make || !formData.model || !formData.inventoryId) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields',
          variant: 'destructive'
        })
        return
      }

      // Generate search results text if not provided
      if (!formData.searchResultsText) {
        formData.searchResultsText = `${formData.year} ${formData.make} ${formData.model} - ${formData.bedrooms}BR/${formData.bathrooms}BA`
      }

      await onSubmit(formData)
      
      toast({
        title: 'Success',
        description: initialData ? 'Home updated successfully' : 'Home added successfully'
      })
    } catch (error) {
      console.error('Form submission error:', error)
      toast({
        title: 'Error',
        description: 'Failed to save home. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const conditionOptions = [
    { value: 'new', label: 'New' },
    { value: 'used', label: 'Used' },
    { value: 'refurbished', label: 'Refurbished' }
  ]

  const offerTypeOptions = [
    { value: 'for_sale', label: 'For Sale' },
    { value: 'for_rent', label: 'For Rent' },
    { value: 'both', label: 'Both' }
  ]

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'reserved', label: 'Reserved' },
    { value: 'sold', label: 'Sold' },
    { value: 'service', label: 'In Service' }
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="inventoryId">Inventory ID *</Label>
                  <Input
                    id="inventoryId"
                    value={formData.inventoryId}
                    onChange={(e) => handleInputChange('inventoryId', e.target.value)}
                    placeholder="INV-MH-001"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', parseInt(e.target.value) || new Date().getFullYear())}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="make">Make *</Label>
                  <Input
                    id="make"
                    value={formData.make}
                    onChange={(e) => handleInputChange('make', e.target.value)}
                    placeholder="Clayton"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="The Edge"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    value={formData.serialNumber}
                    onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                    placeholder="CL123456789"
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <div>
                  <Label htmlFor="sections">Sections</Label>
                  <Select
                    value={formData.dimensions.sections.toString()}
                    onValueChange={(value) => handleNestedChange('dimensions', 'sections', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sections" />
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
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salePrice">Sale Price</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => handleInputChange('salePrice', parseFloat(e.target.value) || 0)}
                    placeholder="95000"
                    min="0"
                    step="100"
                  />
                </div>
                <div>
                  <Label htmlFor="rentPrice">Rent Price (Monthly)</Label>
                  <Input
                    id="rentPrice"
                    type="number"
                    value={formData.rentPrice}
                    onChange={(e) => handleInputChange('rentPrice', parseFloat(e.target.value) || 0)}
                    placeholder="1200"
                    min="0"
                    step="50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Select
                    value={formData.bedrooms.toString()}
                    onValueChange={(value) => handleInputChange('bedrooms', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bedrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Bedroom</SelectItem>
                      <SelectItem value="2">2 Bedrooms</SelectItem>
                      <SelectItem value="3">3 Bedrooms</SelectItem>
                      <SelectItem value="4">4 Bedrooms</SelectItem>
                      <SelectItem value="5">5+ Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Select
                    value={formData.bathrooms.toString()}
                    onValueChange={(value) => handleInputChange('bathrooms', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bathrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Bathroom</SelectItem>
                      <SelectItem value="1.5">1.5 Bathrooms</SelectItem>
                      <SelectItem value="2">2 Bathrooms</SelectItem>
                      <SelectItem value="2.5">2.5 Bathrooms</SelectItem>
                      <SelectItem value="3">3+ Bathrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width">Width (ft)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={formData.dimensions.width_ft}
                    onChange={(e) => handleNestedChange('dimensions', 'width_ft', parseFloat(e.target.value) || 0)}
                    placeholder="28"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <Label htmlFor="length">Length (ft)</Label>
                  <Input
                    id="length"
                    type="number"
                    value={formData.dimensions.length_ft}
                    onChange={(e) => handleNestedChange('dimensions', 'length_ft', parseFloat(e.target.value) || 0)}
                    placeholder="66"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the manufactured home..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="searchResultsText">Search Results Text</Label>
                <Input
                  id="searchResultsText"
                  value={formData.searchResultsText}
                  onChange={(e) => handleInputChange('searchResultsText', e.target.value)}
                  placeholder="Auto-generated from year, make, model, and specs"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(formData.features).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={enabled}
                      onCheckedChange={(checked) => handleFeatureChange(feature, !!checked)}
                    />
                    <Label htmlFor={feature} className="text-sm">
                      {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                  </div>
                ))}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.location.city}
                    onChange={(e) => handleNestedChange('location', 'city', e.target.value)}
                    placeholder="Tampa"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Photos & Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="primaryPhoto">Primary Photo URL</Label>
                <Input
                  id="primaryPhoto"
                  value={formData.media.primaryPhoto}
                  onChange={(e) => handleNestedChange('media', 'primaryPhoto', e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              
              {formData.media.primaryPhoto && (
                <div className="mt-2">
                  <img 
                    src={formData.media.primaryPhoto} 
                    alt="Primary photo preview" 
                    className="w-32 h-24 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (initialData ? 'Update Home' : 'Add Home')}
        </Button>
      </div>
    </form>
  )
}