import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Upload, MapPin, Home, DollarSign, User, Settings } from 'lucide-react'
import { Listing, PropertyType, ListingStatus } from '@/types/listings'

interface ListingFormProps {
  listing?: Listing
  onSubmit: (listing: Partial<Listing>) => void
  onCancel: () => void
}

export default function ListingForm({ listing, onSubmit, onCancel }: ListingFormProps) {
  const [formData, setFormData] = useState<Partial<Listing>>({
    title: '',
    description: '',
    address: '',
    rent: undefined,
    purchasePrice: undefined,
    bedrooms: 1,
    bathrooms: 1,
    squareFootage: 0,
    propertyType: 'apartment' as PropertyType,
    status: 'active' as ListingStatus,
    amenities: [],
    petPolicy: '',
    images: [],
    contactInfo: {
      phone: '',
      email: ''
    },
    mhDetails: {},
    ...listing
  })

  const [newAmenity, setNewAmenity] = useState('')
  const [newImage, setNewImage] = useState('')

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

  const handleMHDetailChange = (field: string, value: any) => {
    handleNestedChange('mhDetails', field, value)
  }

  const handleContactChange = (field: string, value: any) => {
    handleNestedChange('contactInfo', field, value)
  }

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...(prev.amenities || []), newAmenity.trim()]
      }))
      setNewAmenity('')
    }
  }

  const removeAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities?.filter((_, i) => i !== index) || []
    }))
  }

  const addImage = () => {
    if (newImage.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), newImage.trim()]
      }))
      setNewImage('')
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const isManufacturedHome = formData.propertyType === 'manufactured_home'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {listing ? 'Edit Listing' : 'Create New Listing'}
          </h2>
          <p className="text-muted-foreground">
            {listing ? 'Update listing details' : 'Add a new property listing'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {listing ? 'Update Listing' : 'Create Listing'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Basic
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Pricing
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Media
          </TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential property details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sellerId">Seller ID</Label>
                  <Input
                    id="sellerId"
                    value={formData.sellerId || ''}
                    onChange={(e) => handleInputChange('sellerId', e.target.value)}
                    placeholder="Unique seller identifier"
                  />
                </div>
                <div>
                  <Label htmlFor="companyId">Company ID</Label>
                  <Input
                    id="companyId"
                    value={formData.companyId || ''}
                    onChange={(e) => handleInputChange('companyId', e.target.value)}
                    placeholder="Company identifier"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Property title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed property description"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="termsOfSale">Terms of Sale</Label>
                <Textarea
                  id="termsOfSale"
                  value={formData.termsOfSale || ''}
                  onChange={(e) => handleInputChange('termsOfSale', e.target.value)}
                  placeholder="Terms and conditions for sale"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => handleInputChange('propertyType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="manufactured_home">Manufactured Home</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="duplex">Duplex</SelectItem>
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                      <SelectItem value="withdrawn">Withdrawn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms *</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms *</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="squareFootage">Square Footage *</Label>
                  <Input
                    id="squareFootage"
                    type="number"
                    min="0"
                    value={formData.squareFootage}
                    onChange={(e) => handleInputChange('squareFootage', parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="yearBuilt">Year Built</Label>
                  <Input
                    id="yearBuilt"
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    value={formData.yearBuilt || ''}
                    onChange={(e) => handleInputChange('yearBuilt', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="preferredTerm">Preferred Term</Label>
                  <Input
                    id="preferredTerm"
                    value={formData.preferredTerm || ''}
                    onChange={(e) => handleInputChange('preferredTerm', e.target.value)}
                    placeholder="How to describe this property"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="petPolicy">Pet Policy</Label>
                <Input
                  id="petPolicy"
                  value={formData.petPolicy}
                  onChange={(e) => handleInputChange('petPolicy', e.target.value)}
                  placeholder="Pet policy details"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Tab */}
        <TabsContent value="location" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
              <CardDescription>Complete address and location information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div>
                <Label htmlFor="address2">Address Line 2</Label>
                <Input
                  id="address2"
                  value={formData.address2 || ''}
                  onChange={(e) => handleInputChange('address2', e.target.value)}
                  placeholder="Apt, Suite, Unit, etc."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="City name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state || ''}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="State"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode || ''}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="12345"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="county">County</Label>
                  <Input
                    id="county"
                    value={formData.county || ''}
                    onChange={(e) => handleInputChange('county', e.target.value)}
                    placeholder="County name"
                  />
                </div>
                <div>
                  <Label htmlFor="township">Township</Label>
                  <Input
                    id="township"
                    value={formData.township || ''}
                    onChange={(e) => handleInputChange('township', e.target.value)}
                    placeholder="Township name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="schoolDistrict">School District</Label>
                <Input
                  id="schoolDistrict"
                  value={formData.schoolDistrict || ''}
                  onChange={(e) => handleInputChange('schoolDistrict', e.target.value)}
                  placeholder="School district name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude || ''}
                    onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value))}
                    placeholder="40.7128"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude || ''}
                    onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value))}
                    placeholder="-74.0060"
                  />
                </div>
              </div>

              {isManufacturedHome && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="font-medium">Community Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="communityName">Community Name</Label>
                        <Input
                          id="communityName"
                          value={formData.mhDetails?.communityName || ''}
                          onChange={(e) => handleMHDetailChange('communityName', e.target.value)}
                          placeholder="Mobile home community name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="propertyId">Property ID</Label>
                        <Input
                          id="propertyId"
                          value={formData.mhDetails?.propertyId || ''}
                          onChange={(e) => handleMHDetailChange('propertyId', e.target.value)}
                          placeholder="Community property identifier"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Information</CardTitle>
              <CardDescription>All pricing and financial details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rent">Monthly Rent</Label>
                  <Input
                    id="rent"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.rent || ''}
                    onChange={(e) => handleInputChange('rent', parseFloat(e.target.value))}
                    placeholder="2500.00"
                  />
                </div>
                <div>
                  <Label htmlFor="purchasePrice">Purchase Price</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.purchasePrice || ''}
                    onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value))}
                    placeholder="250000.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lotRent">Monthly Lot Rent</Label>
                  <Input
                    id="lotRent"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.lotRent || ''}
                    onChange={(e) => handleInputChange('lotRent', parseFloat(e.target.value))}
                    placeholder="450.00"
                  />
                </div>
                <div>
                  <Label htmlFor="hoaFees">HOA Fees</Label>
                  <Input
                    id="hoaFees"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.hoaFees || ''}
                    onChange={(e) => handleInputChange('hoaFees', parseFloat(e.target.value))}
                    placeholder="150.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthlyTax">Monthly Tax</Label>
                  <Input
                    id="monthlyTax"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.monthlyTax || ''}
                    onChange={(e) => handleInputChange('monthlyTax', parseFloat(e.target.value))}
                    placeholder="200.00"
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyUtilities">Monthly Utilities</Label>
                  <Input
                    id="monthlyUtilities"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.monthlyUtilities || ''}
                    onChange={(e) => handleInputChange('monthlyUtilities', parseFloat(e.target.value))}
                    placeholder="120.00"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="soldPrice">Sold Price</Label>
                <Input
                  id="soldPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.soldPrice || ''}
                  onChange={(e) => handleInputChange('soldPrice', parseFloat(e.target.value))}
                  placeholder="245000.00"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Listing Status</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isRepossessed"
                      checked={formData.isRepossessed || false}
                      onCheckedChange={(checked) => handleInputChange('isRepossessed', checked)}
                    />
                    <Label htmlFor="isRepossessed">Repossessed Home</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pendingSale"
                      checked={formData.pendingSale || false}
                      onCheckedChange={(checked) => handleInputChange('pendingSale', checked)}
                    />
                    <Label htmlFor="pendingSale">Pending Sale</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="packageType">Package Type</Label>
                  <Select
                    value={formData.packageType || ''}
                    onValueChange={(value) => handleInputChange('packageType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select package type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="spotlight">Spotlight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Features</CardTitle>
              <CardDescription>Amenities and special features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Amenities</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="Add amenity"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                  />
                  <Button type="button" onClick={addAmenity} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.amenities?.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {amenity}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeAmenity(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {isManufacturedHome && (
                <>
                  <Separator />
                  <div className="space-y-6">
                    <h4 className="font-medium">Manufactured Home Details</h4>
                    
                    {/* Basic MH Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="manufacturer">Manufacturer</Label>
                        <Input
                          id="manufacturer"
                          value={formData.mhDetails?.manufacturer || ''}
                          onChange={(e) => handleMHDetailChange('manufacturer', e.target.value)}
                          placeholder="Clayton Homes"
                        />
                      </div>
                      <div>
                        <Label htmlFor="model">Model</Label>
                        <Input
                          id="model"
                          value={formData.mhDetails?.model || ''}
                          onChange={(e) => handleMHDetailChange('model', e.target.value)}
                          placeholder="The Breeze II"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="modelYear">Model Year</Label>
                        <Input
                          id="modelYear"
                          type="number"
                          min="1950"
                          max={new Date().getFullYear()}
                          value={formData.mhDetails?.modelYear || ''}
                          onChange={(e) => handleMHDetailChange('modelYear', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="color">Color</Label>
                        <Input
                          id="color"
                          value={formData.mhDetails?.color || ''}
                          onChange={(e) => handleMHDetailChange('color', e.target.value)}
                          placeholder="Beige"
                        />
                      </div>
                      <div>
                        <Label htmlFor="serialNumber">Serial Number</Label>
                        <Input
                          id="serialNumber"
                          value={formData.mhDetails?.serialNumber || ''}
                          onChange={(e) => handleMHDetailChange('serialNumber', e.target.value)}
                          placeholder="CLT123456789"
                        />
                      </div>
                    </div>

                    {/* Dimensions */}
                    <div className="space-y-4">
                      <h5 className="font-medium">Dimensions (feet)</h5>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="width1">Primary Width</Label>
                          <Input
                            id="width1"
                            type="number"
                            step="0.1"
                            value={formData.mhDetails?.width1 || ''}
                            onChange={(e) => handleMHDetailChange('width1', parseFloat(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="length1">Primary Length</Label>
                          <Input
                            id="length1"
                            type="number"
                            step="0.1"
                            value={formData.mhDetails?.length1 || ''}
                            onChange={(e) => handleMHDetailChange('length1', parseFloat(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lotSize">Lot Size</Label>
                          <Input
                            id="lotSize"
                            value={formData.mhDetails?.lotSize || ''}
                            onChange={(e) => handleMHDetailChange('lotSize', e.target.value)}
                            placeholder="60x120"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="width2">Secondary Width</Label>
                          <Input
                            id="width2"
                            type="number"
                            step="0.1"
                            value={formData.mhDetails?.width2 || ''}
                            onChange={(e) => handleMHDetailChange('width2', parseFloat(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="length2">Secondary Length</Label>
                          <Input
                            id="length2"
                            type="number"
                            step="0.1"
                            value={formData.mhDetails?.length2 || ''}
                            onChange={(e) => handleMHDetailChange('length2', parseFloat(e.target.value))}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="width3">Tertiary Width</Label>
                          <Input
                            id="width3"
                            type="number"
                            step="0.1"
                            value={formData.mhDetails?.width3 || ''}
                            onChange={(e) => handleMHDetailChange('width3', parseFloat(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="length3">Tertiary Length</Label>
                          <Input
                            id="length3"
                            type="number"
                            step="0.1"
                            value={formData.mhDetails?.length3 || ''}
                            onChange={(e) => handleMHDetailChange('length3', parseFloat(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Construction Materials */}
                    <div className="space-y-4">
                      <h5 className="font-medium">Construction Materials</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="foundation">Foundation</Label>
                          <Input
                            id="foundation"
                            value={formData.mhDetails?.foundation || ''}
                            onChange={(e) => handleMHDetailChange('foundation', e.target.value)}
                            placeholder="Permanent Foundation"
                          />
                        </div>
                        <div>
                          <Label htmlFor="roofType">Roof Type</Label>
                          <Input
                            id="roofType"
                            value={formData.mhDetails?.roofType || ''}
                            onChange={(e) => handleMHDetailChange('roofType', e.target.value)}
                            placeholder="Architectural Shingles"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="roofMaterial">Roof Material</Label>
                          <Input
                            id="roofMaterial"
                            value={formData.mhDetails?.roofMaterial || ''}
                            onChange={(e) => handleMHDetailChange('roofMaterial', e.target.value)}
                            placeholder="Asphalt Shingles"
                          />
                        </div>
                        <div>
                          <Label htmlFor="exteriorMaterial">Exterior Material</Label>
                          <Input
                            id="exteriorMaterial"
                            value={formData.mhDetails?.exteriorMaterial || ''}
                            onChange={(e) => handleMHDetailChange('exteriorMaterial', e.target.value)}
                            placeholder="Vinyl Siding"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="ceilingMaterial">Ceiling Material</Label>
                          <Input
                            id="ceilingMaterial"
                            value={formData.mhDetails?.ceilingMaterial || ''}
                            onChange={(e) => handleMHDetailChange('ceilingMaterial', e.target.value)}
                            placeholder="Drywall"
                          />
                        </div>
                        <div>
                          <Label htmlFor="wallMaterial">Wall Material</Label>
                          <Input
                            id="wallMaterial"
                            value={formData.mhDetails?.wallMaterial || ''}
                            onChange={(e) => handleMHDetailChange('wallMaterial', e.target.value)}
                            placeholder="Drywall"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Systems */}
                    <div className="space-y-4">
                      <h5 className="font-medium">Systems</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="hvacType">HVAC Type</Label>
                          <Input
                            id="hvacType"
                            value={formData.mhDetails?.hvacType || ''}
                            onChange={(e) => handleMHDetailChange('hvacType', e.target.value)}
                            placeholder="Central Air & Heat"
                          />
                        </div>
                        <div>
                          <Label htmlFor="waterHeaterType">Water Heater Type</Label>
                          <Input
                            id="waterHeaterType"
                            value={formData.mhDetails?.waterHeaterType || ''}
                            onChange={(e) => handleMHDetailChange('waterHeaterType', e.target.value)}
                            placeholder="Electric Tank"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="electricalSystem">Electrical System</Label>
                          <Input
                            id="electricalSystem"
                            value={formData.mhDetails?.electricalSystem || ''}
                            onChange={(e) => handleMHDetailChange('electricalSystem', e.target.value)}
                            placeholder="200 Amp Service"
                          />
                        </div>
                        <div>
                          <Label htmlFor="plumbingType">Plumbing Type</Label>
                          <Input
                            id="plumbingType"
                            value={formData.mhDetails?.plumbingType || ''}
                            onChange={(e) => handleMHDetailChange('plumbingType', e.target.value)}
                            placeholder="PEX"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="insulationType">Insulation Type</Label>
                          <Input
                            id="insulationType"
                            value={formData.mhDetails?.insulationType || ''}
                            onChange={(e) => handleMHDetailChange('insulationType', e.target.value)}
                            placeholder="Fiberglass Batt"
                          />
                        </div>
                        <div>
                          <Label htmlFor="windowType">Window Type</Label>
                          <Input
                            id="windowType"
                            value={formData.mhDetails?.windowType || ''}
                            onChange={(e) => handleMHDetailChange('windowType', e.target.value)}
                            placeholder="Double Pane Vinyl"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="flooringType">Flooring Type</Label>
                        <Input
                          id="flooringType"
                          value={formData.mhDetails?.flooringType || ''}
                          onChange={(e) => handleMHDetailChange('flooringType', e.target.value)}
                          placeholder="Laminate & Carpet"
                        />
                      </div>
                    </div>

                    {/* Boolean Features */}
                    <div className="space-y-4">
                      <h5 className="font-medium">Features & Amenities</h5>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { key: 'garage', label: 'Garage' },
                          { key: 'carport', label: 'Carport' },
                          { key: 'centralAir', label: 'Central Air' },
                          { key: 'fireplace', label: 'Fireplace' },
                          { key: 'storageShed', label: 'Storage Shed' },
                          { key: 'gutters', label: 'Gutters' },
                          { key: 'shutters', label: 'Shutters' },
                          { key: 'deck', label: 'Deck' },
                          { key: 'patio', label: 'Patio' },
                          { key: 'cathedralCeilings', label: 'Cathedral Ceilings' },
                          { key: 'ceilingFans', label: 'Ceiling Fans' },
                          { key: 'skylights', label: 'Skylights' },
                          { key: 'walkinClosets', label: 'Walk-in Closets' },
                          { key: 'laundryRoom', label: 'Laundry Room' },
                          { key: 'pantry', label: 'Pantry' },
                          { key: 'sunRoom', label: 'Sun Room' },
                          { key: 'basement', label: 'Basement' },
                          { key: 'gardenTub', label: 'Garden Tub' },
                          { key: 'garbageDisposal', label: 'Garbage Disposal' },
                          { key: 'thermopaneWindows', label: 'Thermopane Windows' },
                          { key: 'laundryHookups', label: 'Laundry Hookups' },
                          { key: 'internetReady', label: 'Internet Ready' },
                          { key: 'cableReady', label: 'Cable Ready' },
                          { key: 'phoneReady', label: 'Phone Ready' }
                        ].map(({ key, label }) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Checkbox
                              id={key}
                              checked={formData.mhDetails?.[key as keyof typeof formData.mhDetails] || false}
                              onCheckedChange={(checked) => handleMHDetailChange(key, checked)}
                            />
                            <Label htmlFor={key}>{label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Included Appliances */}
                    <div className="space-y-4">
                      <h5 className="font-medium">Included Appliances</h5>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { key: 'refrigeratorIncluded', label: 'Refrigerator' },
                          { key: 'microwaveIncluded', label: 'Microwave' },
                          { key: 'ovenIncluded', label: 'Oven' },
                          { key: 'dishwasherIncluded', label: 'Dishwasher' },
                          { key: 'washerIncluded', label: 'Washer' },
                          { key: 'dryerIncluded', label: 'Dryer' }
                        ].map(({ key, label }) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Checkbox
                              id={key}
                              checked={formData.mhDetails?.[key as keyof typeof formData.mhDetails] || false}
                              onCheckedChange={(checked) => handleMHDetailChange(key, checked)}
                            />
                            <Label htmlFor={key}>{label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Seller and agent contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.contactInfo?.firstName || ''}
                    onChange={(e) => handleContactChange('firstName', e.target.value)}
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.contactInfo?.lastName || ''}
                    onChange={(e) => handleContactChange('lastName', e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.contactInfo?.companyName || ''}
                  onChange={(e) => handleContactChange('companyName', e.target.value)}
                  placeholder="ABC Realty"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.contactInfo?.phone || ''}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="alternatePhone">Alternate Phone</Label>
                  <Input
                    id="alternatePhone"
                    value={formData.contactInfo?.alternatePhone || ''}
                    onChange={(e) => handleContactChange('alternatePhone', e.target.value)}
                    placeholder="(555) 987-6543"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.contactInfo?.email || ''}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  placeholder="contact@example.com"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="additionalEmail1">Additional Email 1</Label>
                  <Input
                    id="additionalEmail1"
                    type="email"
                    value={formData.contactInfo?.additionalEmail1 || ''}
                    onChange={(e) => handleContactChange('additionalEmail1', e.target.value)}
                    placeholder="email1@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="additionalEmail2">Additional Email 2</Label>
                  <Input
                    id="additionalEmail2"
                    type="email"
                    value={formData.contactInfo?.additionalEmail2 || ''}
                    onChange={(e) => handleContactChange('additionalEmail2', e.target.value)}
                    placeholder="email2@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="additionalEmail3">Additional Email 3</Label>
                  <Input
                    id="additionalEmail3"
                    type="email"
                    value={formData.contactInfo?.additionalEmail3 || ''}
                    onChange={(e) => handleContactChange('additionalEmail3', e.target.value)}
                    placeholder="email3@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fax">Fax</Label>
                  <Input
                    id="fax"
                    value={formData.contactInfo?.fax || ''}
                    onChange={(e) => handleContactChange('fax', e.target.value)}
                    placeholder="(555) 123-4568"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.contactInfo?.website || ''}
                    onChange={(e) => handleContactChange('website', e.target.value)}
                    placeholder="https://www.example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="mhVillageAccountKey">MHVillage Account Key</Label>
                <Input
                  id="mhVillageAccountKey"
                  value={formData.contactInfo?.mhVillageAccountKey || ''}
                  onChange={(e) => handleContactChange('mhVillageAccountKey', e.target.value)}
                  placeholder="MHV123456"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Display Options</h4>
                <div>
                  <Label htmlFor="searchResultsText">Search Results Text</Label>
                  <Input
                    id="searchResultsText"
                    value={formData.searchResultsText || ''}
                    onChange={(e) => handleInputChange('searchResultsText', e.target.value)}
                    placeholder="Text to appear in search results"
                  />
                </div>

                <div>
                  <Label htmlFor="agentPhotoUrl">Agent Photo URL</Label>
                  <Input
                    id="agentPhotoUrl"
                    type="url"
                    value={formData.agentPhotoUrl || ''}
                    onChange={(e) => handleInputChange('agentPhotoUrl', e.target.value)}
                    placeholder="https://example.com/agent-photo.jpg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Media & Images</CardTitle>
              <CardDescription>Photos, videos, and virtual tours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Property Images</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="Image URL"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                  />
                  <Button type="button" onClick={addImage} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {formData.images?.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Property ${index + 1}`}
                        className="w-full h-32 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}