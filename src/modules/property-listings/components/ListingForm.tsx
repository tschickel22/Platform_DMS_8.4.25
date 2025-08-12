import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Home, Car, DollarSign, MapPin, Camera, User, AlertCircle } from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { mockInventory } from '@/mocks/inventoryMock'

interface ListingFormProps {
  listing?: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (listing: any) => void
}

export default function ListingForm({ listing, open, onOpenChange, onSave }: ListingFormProps) {
  const { tenant } = useTenant()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    id: '',
    companyId: tenant?.id || '',
    listingType: '',
    inventoryId: '',
    offerType: '',
    salePrice: '',
    rentPrice: '',
    title: '',
    description: '',
    searchResultsText: '',
    make: '',
    model: '',
    year: '',
    location: {
      address1: '',
      city: '',
      state: '',
      postalCode: '',
      latitude: '',
      longitude: ''
    },
    seller: {
      companyName: '',
      phone: '',
      emails: ['']
    },
    media: {
      photos: [],
      primaryPhoto: ''
    },
    features: {},
    status: 'draft'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (listing) {
      setFormData({
        ...listing,
        salePrice: listing.salePrice?.toString() || '',
        rentPrice: listing.rentPrice?.toString() || '',
        year: listing.year?.toString() || '',
        location: {
          ...listing.location,
          latitude: listing.location?.latitude?.toString() || '',
          longitude: listing.location?.longitude?.toString() || ''
        },
        seller: {
          companyName: listing.seller?.companyName || '',
          phone: listing.seller?.phone || '',
          emails: listing.seller?.emails || ['']
        }
      })
    } else {
      setFormData(prev => ({
        ...prev,
        id: `listing_${Date.now()}`,
        companyId: tenant?.id || ''
      }))
    }
  }, [listing, tenant])

  const validateStep = (stepNumber: number) => {
    const newErrors: Record<string, string> = {}

    if (stepNumber === 1) {
      if (!formData.listingType) newErrors.listingType = 'Listing type is required'
    }

    if (stepNumber === 2) {
      if (!formData.inventoryId) newErrors.inventoryId = 'Inventory selection is required'
    }

    if (stepNumber === 3) {
      if (!formData.offerType) newErrors.offerType = 'Offer type is required'
      if (formData.offerType === 'for_sale' && !formData.salePrice) {
        newErrors.salePrice = 'Sale price is required'
      }
      if (formData.offerType === 'for_rent' && !formData.rentPrice) {
        newErrors.rentPrice = 'Rent price is required'
      }
      if (formData.offerType === 'both' && (!formData.salePrice || !formData.rentPrice)) {
        if (!formData.salePrice) newErrors.salePrice = 'Sale price is required'
        if (!formData.rentPrice) newErrors.rentPrice = 'Rent price is required'
      }
      if (!formData.title) newErrors.title = 'Title is required'
      if (!formData.description || formData.description.length < 50) {
        newErrors.description = 'Description must be at least 50 characters'
      }
      if (!formData.searchResultsText || formData.searchResultsText.length > 80) {
        newErrors.searchResultsText = 'Search results text is required and must be 80 characters or less'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSave = () => {
    if (validateStep(3)) {
      const processedData = {
        ...formData,
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
        rentPrice: formData.rentPrice ? parseFloat(formData.rentPrice) : undefined,
        year: formData.year ? parseInt(formData.year) : undefined,
        location: {
          ...formData.location,
          latitude: formData.location.latitude ? parseFloat(formData.location.latitude) : undefined,
          longitude: formData.location.longitude ? parseFloat(formData.location.longitude) : undefined
        },
        updatedAt: new Date().toISOString(),
        ...(listing ? {} : { createdAt: new Date().toISOString() })
      }

      onSave(processedData)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const updateNestedFormData = (path: string[], value: any) => {
    setFormData(prev => {
      const newData = { ...prev }
      let current = newData
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]]
      }
      current[path[path.length - 1]] = value
      return newData
    })
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Choose Listing Type</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className={`cursor-pointer transition-all ${formData.listingType === 'manufactured_home' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => updateFormData('listingType', 'manufactured_home')}
          >
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Home className="h-12 w-12 mb-4 text-blue-600" />
              <h4 className="font-medium mb-2">Manufactured Home</h4>
              <p className="text-sm text-gray-600 text-center">
                Mobile homes, modular homes, and other manufactured housing
              </p>
            </CardContent>
          </Card>
          <Card 
            className={`cursor-pointer transition-all ${formData.listingType === 'rv' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => updateFormData('listingType', 'rv')}
          >
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Car className="h-12 w-12 mb-4 text-green-600" />
              <h4 className="font-medium mb-2">RV / Travel Trailer</h4>
              <p className="text-sm text-gray-600 text-center">
                Motorhomes, travel trailers, fifth wheels, and other RVs
              </p>
            </CardContent>
          </Card>
        </div>
        {errors.listingType && (
          <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.listingType}
          </p>
        )}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Link to Inventory</h3>
        <p className="text-gray-600 mb-4">
          Select an existing inventory item to link to this listing
        </p>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="inventorySearch">Search Inventory</Label>
            <Input
              id="inventorySearch"
              placeholder="Search by make, model, VIN, or serial number..."
            />
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Available Inventory</h4>
            <div className="space-y-2">
              {mockInventory.sampleInventory
                ?.filter(item => item.status === 'available')
                ?.map((item) => (
                <div 
                  key={item.id}
                  className={`p-3 border rounded cursor-pointer transition-all ${formData.inventoryId === item.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => updateFormData('inventoryId', item.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{item.year} {item.make} {item.model}</p>
                      <p className="text-sm text-gray-600">
                        {item.vin ? `VIN: ${item.vin}` : `Serial: ${item.serialNumber || 'N/A'}`} | 
                        {item.location?.lot ? ` Lot ${item.location.lot}` : ' Location TBD'}
                      </p>
                      <Badge variant="secondary" className="mt-1">{item.status}</Badge>
                    </div>
                    <p className="text-lg font-semibold">
                      ${(item.salePrice || item.cost || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {(!mockInventory.sampleInventory || mockInventory.sampleInventory.filter(item => item.status === 'available').length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <p>No available inventory items found</p>
                  <p className="text-sm">Please add inventory items first</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {errors.inventoryId && (
          <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.inventoryId}
          </p>
        )}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="make">Make *</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => updateFormData('make', e.target.value)}
                placeholder="Clayton Homes"
              />
            </div>
            <div>
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => updateFormData('model', e.target.value)}
                placeholder="Patriot"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="year">Year *</Label>
            <Input
              id="year"
              type="number"
              value={formData.year}
              onChange={(e) => updateFormData('year', e.target.value)}
              placeholder="2020"
            />
          </div>
          
          <div>
            <Label htmlFor="title">Listing Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateFormData('title', e.target.value)}
              placeholder="2020 Clayton Homes Patriot"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="searchResultsText">Search Results Text * (80 chars max)</Label>
            <Input
              id="searchResultsText"
              value={formData.searchResultsText}
              onChange={(e) => updateFormData('searchResultsText', e.target.value)}
              placeholder="Beautiful 2020 Clayton home in great condition"
              maxLength={80}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.searchResultsText.length}/80 characters
            </p>
            {errors.searchResultsText && (
              <p className="text-red-600 text-sm mt-1">{errors.searchResultsText}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="description">Description * (50 chars min)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              placeholder="Detailed description of the property..."
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length} characters
            </p>
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="pricing" className="space-y-4">
          <div>
            <Label htmlFor="offerType">Offer Type *</Label>
            <Select value={formData.offerType} onValueChange={(value) => updateFormData('offerType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select offer type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="for_sale">For Sale</SelectItem>
                <SelectItem value="for_rent">For Rent</SelectItem>
                <SelectItem value="both">Both Sale & Rent</SelectItem>
              </SelectContent>
            </Select>
            {errors.offerType && (
              <p className="text-red-600 text-sm mt-1">{errors.offerType}</p>
            )}
          </div>
          
          {(formData.offerType === 'for_sale' || formData.offerType === 'both') && (
            <div>
              <Label htmlFor="salePrice">Sale Price *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="salePrice"
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) => updateFormData('salePrice', e.target.value)}
                  placeholder="89900"
                  className="pl-10"
                />
              </div>
              {errors.salePrice && (
                <p className="text-red-600 text-sm mt-1">{errors.salePrice}</p>
              )}
            </div>
          )}
          
          {(formData.offerType === 'for_rent' || formData.offerType === 'both') && (
            <div>
              <Label htmlFor="rentPrice">Monthly Rent *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="rentPrice"
                  type="number"
                  value={formData.rentPrice}
                  onChange={(e) => updateFormData('rentPrice', e.target.value)}
                  placeholder="1200"
                  className="pl-10"
                />
              </div>
              {errors.rentPrice && (
                <p className="text-red-600 text-sm mt-1">{errors.rentPrice}</p>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="location" className="space-y-4">
          <div>
            <Label htmlFor="address1">Address</Label>
            <Input
              id="address1"
              value={formData.location.address1}
              onChange={(e) => updateNestedFormData(['location', 'address1'], e.target.value)}
              placeholder="123 Main Street"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.location.city}
                onChange={(e) => updateNestedFormData(['location', 'city'], e.target.value)}
                placeholder="Austin"
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.location.state}
                onChange={(e) => updateNestedFormData(['location', 'state'], e.target.value)}
                placeholder="TX"
                maxLength={2}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="postalCode">Postal Code *</Label>
            <Input
              id="postalCode"
              value={formData.location.postalCode}
              onChange={(e) => updateNestedFormData(['location', 'postalCode'], e.target.value)}
              placeholder="78701"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.location.latitude}
                onChange={(e) => updateNestedFormData(['location', 'latitude'], e.target.value)}
                placeholder="30.2672"
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.location.longitude}
                onChange={(e) => updateNestedFormData(['location', 'longitude'], e.target.value)}
                placeholder="-97.7431"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-4">
          <div>
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              value={formData.seller.companyName}
              onChange={(e) => updateNestedFormData(['seller', 'companyName'], e.target.value)}
              placeholder="ABC RV Sales"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.seller.phone}
              onChange={(e) => updateNestedFormData(['seller', 'phone'], e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.seller.emails[0]}
              onChange={(e) => updateNestedFormData(['seller', 'emails', 0], e.target.value)}
              placeholder="contact@abcrvsales.com"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {listing ? 'Edit Listing' : 'Add New Listing'}
          </DialogTitle>
          <DialogDescription>
            Step {step} of 3: {step === 1 ? 'Type Selection' : step === 2 ? 'Inventory Linking' : 'Listing Details'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 1 ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                  1
                </div>
                <span className="ml-2 font-medium">Type</span>
              </div>
              <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 2 ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                  2
                </div>
                <span className="ml-2 font-medium">Inventory</span>
              </div>
              <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-primary' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 3 ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                  3
                </div>
                <span className="ml-2 font-medium">Details</span>
              </div>
            </div>
          </div>

          {/* Step Content */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        <DialogFooter>
          {step > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSave}>
              {listing ? 'Update Listing' : 'Create Listing'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}