import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { useTenant } from '@/contexts/TenantContext'
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Car,
  MapPin,
  DollarSign,
  Camera,
  User,
  AlertCircle
} from 'lucide-react'

interface Listing {
  id?: string
  companyId?: string
  inventoryId: string
  listingType: 'manufactured_home' | 'rv'
  offerType: 'for_sale' | 'for_rent' | 'both'
  status: 'active' | 'paused' | 'removed' | 'draft'
  title?: string
  salePrice?: number
  rentPrice?: number
  description?: string
  searchResultsText?: string
  media?: {
    photos: string[]
    primaryPhoto?: string
  }
  location?: {
    city?: string
    state?: string
    postalCode?: string
    latitude?: number
    longitude?: number
  }
  seller?: {
    companyName?: string
    phone?: string
    emails?: string[]
    website?: string
  }
  make?: string
  model?: string
  year?: number
  bedrooms?: number
  bathrooms?: number
  dimensions?: {
    width_ft?: number
    length_ft?: number
    sections?: number
  }
  features?: Record<string, boolean>
  createdAt?: string
  updatedAt?: string
}

interface ListingFormProps {
  listing?: Listing | null
  onClose: () => void
  onSave: () => void
}

export function ListingForm({ listing, onClose, onSave }: ListingFormProps) {
  const { tenant } = useTenant()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setSaving] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  
  const [formData, setFormData] = useState<Listing>({
    inventoryId: '',
    listingType: 'manufactured_home',
    offerType: 'for_sale',
    status: 'draft',
    title: '',
    description: '',
    searchResultsText: '',
    salePrice: 0,
    rentPrice: 0,
    media: {
      photos: [],
      primaryPhoto: ''
    },
    location: {
      city: '',
      state: '',
      postalCode: '',
      latitude: undefined,
      longitude: undefined
    },
    seller: {
      companyName: '',
      phone: '',
      emails: [],
      website: ''
    },
    make: '',
    model: '',
    year: new Date().getFullYear(),
    bedrooms: 0,
    bathrooms: 0,
    dimensions: {
      width_ft: 0,
      length_ft: 0,
      sections: 1
    },
    features: {}
  })

  useEffect(() => {
    if (listing) {
      setFormData({
        ...listing,
        // Ensure required nested objects exist
        media: listing.media || { photos: [], primaryPhoto: '' },
        location: listing.location || { city: '', state: '', postalCode: '' },
        seller: listing.seller || { companyName: '', phone: '', emails: [], website: '' },
        dimensions: listing.dimensions || { width_ft: 0, length_ft: 0, sections: 1 },
        features: listing.features || {}
      })
      // Skip to details step if editing
      setCurrentStep(3)
    }
  }, [listing])

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateNestedFormData = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof Listing] as any,
        [field]: value
      }
    }))
  }

  const validateCurrentStep = (): boolean => {
    const errors: string[] = []

    switch (currentStep) {
      case 1: // Type Selection
        if (!formData.listingType) {
          errors.push('Please select a listing type')
        }
        break
      
      case 2: // Inventory Linking
        if (!formData.inventoryId) {
          errors.push('Please select an inventory item')
        }
        break
      
      case 3: // Details
        if (!formData.offerType) {
          errors.push('Please select an offer type')
        }
        
        if ((formData.offerType === 'for_sale' || formData.offerType === 'both') && !formData.salePrice) {
          errors.push('Sale price is required for sale listings')
        }
        
        if ((formData.offerType === 'for_rent' || formData.offerType === 'both') && !formData.rentPrice) {
          errors.push('Rent price is required for rental listings')
        }

        if (!formData.make) {
          errors.push('Make is required')
        }

        if (!formData.model) {
          errors.push('Model is required')
        }

        if (!formData.year || formData.year < 1900) {
          errors.push('Valid year is required')
        }

        if (formData.listingType === 'manufactured_home') {
          if (formData.bedrooms === undefined || formData.bedrooms < 0) {
            errors.push('Number of bedrooms is required for manufactured homes')
          }
          if (formData.bathrooms === undefined || formData.bathrooms < 0) {
            errors.push('Number of bathrooms is required for manufactured homes')
          }
        }
        break
    }

    setValidationErrors(errors)
    return errors.length === 0
  }

  const canProceed = (): boolean => {
    return validateCurrentStep()
  }

  const canActivate = (): boolean => {
    // Check all publish gates
    return !!(
      formData.inventoryId &&
      formData.offerType &&
      ((formData.offerType === 'for_sale' || formData.offerType === 'both') ? formData.salePrice : true) &&
      ((formData.offerType === 'for_rent' || formData.offerType === 'both') ? formData.rentPrice : true) &&
      formData.description && formData.description.length >= 50 &&
      formData.searchResultsText && formData.searchResultsText.length <= 80 &&
      formData.media?.photos && formData.media.photos.length > 0 &&
      formData.media?.primaryPhoto &&
      formData.location?.city &&
      formData.location?.state &&
      formData.location?.postalCode &&
      (formData.seller?.phone || (formData.seller?.emails && formData.seller.emails.length > 0)) &&
      formData.make &&
      formData.model &&
      formData.year &&
      (formData.listingType === 'manufactured_home' ? 
        (formData.bedrooms !== undefined && formData.bathrooms !== undefined) : true)
    )
  }

  const handleNext = () => {
    if (canProceed() && currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = async (activateAfterSave: boolean = false) => {
    if (!tenant?.id) return

    try {
      setSaving(true)
      
      const dataToSave = {
        ...formData,
        companyId: tenant.id,
        status: activateAfterSave ? 'active' : formData.status
      }

      const url = listing?.id 
        ? `/.netlify/functions/listings-crud?companyId=${tenant.id}&listingId=${listing.id}`
        : '/.netlify/functions/listings-crud'
      
      const method = listing?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.publishGateErrors) {
          toast({
            title: "Cannot Activate Listing",
            description: "Please fix the following issues: " + errorData.errors.join(', '),
            variant: "destructive",
          })
          return
        }
        throw new Error(errorData.error || 'Failed to save listing')
      }

      toast({
        title: "Success",
        description: listing?.id ? "Listing updated successfully" : "Listing created successfully",
      })

      onSave()
    } catch (error) {
      console.error('Error saving listing:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save listing",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">What type of listing are you creating?</h3>
              <p className="text-muted-foreground">Choose the category that best describes your property</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card 
                className={`cursor-pointer transition-colors ${
                  formData.listingType === 'manufactured_home' ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground'
                }`}
                onClick={() => updateFormData('listingType', 'manufactured_home')}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Home className="h-12 w-12 mb-4 text-primary" />
                  <h4 className="font-medium mb-2">Manufactured Home</h4>
                  <p className="text-sm text-muted-foreground text-center">
                    Mobile homes, modular homes, and factory-built housing
                  </p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-colors ${
                  formData.listingType === 'rv' ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground'
                }`}
                onClick={() => updateFormData('listingType', 'rv')}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Car className="h-12 w-12 mb-4 text-primary" />
                  <h4 className="font-medium mb-2">RV</h4>
                  <p className="text-sm text-muted-foreground text-center">
                    Travel trailers, motorhomes, and recreational vehicles
                  </p>
                </CardContent>
              </Card>
            </div>

            {validationErrors.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <div className="flex">
                  <AlertCircle className="h-4 w-4 text-destructive mr-2 mt-0.5" />
                  <div className="text-sm text-destructive">
                    {validationErrors.map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Link to Inventory</h3>
              <p className="text-muted-foreground">
                Select which inventory item this listing represents
              </p>
            </div>
            
            <div className="space-y-4">
              <Label htmlFor="inventoryId">Inventory ID</Label>
              <Input
                id="inventoryId"
                placeholder="Enter inventory ID or search for an item"
                value={formData.inventoryId}
                onChange={(e) => updateFormData('inventoryId', e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                This listing will be linked to your inventory management system
              </p>
            </div>

            {validationErrors.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <div className="flex">
                  <AlertCircle className="h-4 w-4 text-destructive mr-2 mt-0.5" />
                  <div className="text-sm text-destructive">
                    {validationErrors.map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Listing Title (Optional)</Label>
                    <Input
                      id="title"
                      placeholder="Enter a custom title"
                      value={formData.title || ''}
                      onChange={(e) => updateFormData('title', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="offerType">Offer Type</Label>
                    <Select value={formData.offerType} onValueChange={(value) => updateFormData('offerType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="for_sale">For Sale</SelectItem>
                        <SelectItem value="for_rent">For Rent</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      value={formData.year || ''}
                      onChange={(e) => updateFormData('year', parseInt(e.target.value) || undefined)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="make">Make</Label>
                    <Input
                      id="make"
                      placeholder="Enter make"
                      value={formData.make || ''}
                      onChange={(e) => updateFormData('make', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      placeholder="Enter model"
                      value={formData.model || ''}
                      onChange={(e) => updateFormData('model', e.target.value)}
                    />
                  </div>
                </div>

                {formData.listingType === 'manufactured_home' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        min="0"
                        value={formData.bedrooms || ''}
                        onChange={(e) => updateFormData('bedrooms', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        min="0"
                        step="0.5"
                        value={formData.bathrooms || ''}
                        onChange={(e) => updateFormData('bathrooms', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the property in detail (minimum 50 characters)"
                    value={formData.description || ''}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {(formData.description || '').length}/50 minimum
                  </p>
                </div>

                <div>
                  <Label htmlFor="searchResultsText">Search Results Preview</Label>
                  <Input
                    id="searchResultsText"
                    placeholder="Brief description for search results (max 80 characters)"
                    value={formData.searchResultsText || ''}
                    onChange={(e) => updateFormData('searchResultsText', e.target.value)}
                    maxLength={80}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {(formData.searchResultsText || '').length}/80 characters
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  {(formData.offerType === 'for_sale' || formData.offerType === 'both') && (
                    <div>
                      <Label htmlFor="salePrice">Sale Price</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="salePrice"
                          type="number"
                          min="0"
                          className="pl-10"
                          placeholder="0"
                          value={formData.salePrice || ''}
                          onChange={(e) => updateFormData('salePrice', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  )}
                  
                  {(formData.offerType === 'for_rent' || formData.offerType === 'both') && (
                    <div>
                      <Label htmlFor="rentPrice">Monthly Rent</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="rentPrice"
                          type="number"
                          min="0"
                          className="pl-10"
                          placeholder="0"
                          value={formData.rentPrice || ''}
                          onChange={(e) => updateFormData('rentPrice', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="location" className="space-y-4 mt-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Enter city"
                      value={formData.location?.city || ''}
                      onChange={(e) => updateNestedFormData('location', 'city', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="TX"
                      maxLength={2}
                      value={formData.location?.state || ''}
                      onChange={(e) => updateNestedFormData('location', 'state', e.target.value.toUpperCase())}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      placeholder="12345"
                      value={formData.location?.postalCode || ''}
                      onChange={(e) => updateNestedFormData('location', 'postalCode', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Seller Contact Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sellerCompany">Company Name</Label>
                      <Input
                        id="sellerCompany"
                        placeholder="Company name"
                        value={formData.seller?.companyName || ''}
                        onChange={(e) => updateNestedFormData('seller', 'companyName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sellerPhone">Phone Number</Label>
                      <Input
                        id="sellerPhone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.seller?.phone || ''}
                        onChange={(e) => updateNestedFormData('seller', 'phone', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4 mt-6">
                <div>
                  <Label>Photos</Label>
                  <div className="mt-2 p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
                    <Camera className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Photo upload functionality will be implemented in Phase 2
                    </p>
                    <p className="text-xs text-muted-foreground">
                      For now, you can save as draft and add photos later
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {validationErrors.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <div className="flex">
                  <AlertCircle className="h-4 w-4 text-destructive mr-2 mt-0.5" />
                  <div className="text-sm text-destructive">
                    {validationErrors.map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {listing ? 'Edit Listing' : 'Add New Listing'}
          </DialogTitle>
          <DialogDescription>
            {currentStep === 1 && 'Select the type of property you want to list'}
            {currentStep === 2 && 'Link this listing to an existing inventory item'}
            {currentStep === 3 && 'Enter the details for your property listing'}
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center space-x-2 mb-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`h-0.5 w-16 ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {renderStepContent()}

        <div className="flex justify-between pt-6 border-t">
          <div>
            {currentStep > 1 && !listing && (
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            
            {currentStep < 3 && !listing ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => handleSave(false)} disabled={loading}>
                  Save as Draft
                </Button>
                <Button
                  onClick={() => handleSave(true)}
                  disabled={loading || !canActivate()}
                  title={!canActivate() ? 'Please complete all required fields to activate' : ''}
                >
                  {loading ? 'Saving...' : 'Save & Activate'}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}