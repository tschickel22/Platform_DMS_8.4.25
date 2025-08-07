import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { X, Plus, Upload, MapPin, Home, DollarSign, User, Settings, Camera } from 'lucide-react'
import { Listing, MHDetails, ContactInfo } from '@/types/listings'
import { mockInventory } from '@/mocks/inventoryMock'
import { mockListings } from '@/mocks/listingsMock'

interface ListingFormProps {
  listing?: Listing
  onSubmit: (listing: Partial<Listing>) => void
  onCancel: () => void
}

export default function ListingForm({ listing, onSubmit, onCancel }: ListingFormProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<Partial<Listing>>({
    listingType: 'rent',
    title: '',
    description: '',
    termsOfSale: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    county: '',
    township: '',
    schoolDistrict: '',
    latitude: undefined,
    longitude: undefined,
    rent: undefined,
    purchasePrice: undefined,
    lotRent: undefined,
    hoaFees: undefined,
    monthlyTax: undefined,
    monthlyUtilities: undefined,
    bedrooms: 1,
    bathrooms: 1,
    squareFootage: 0,
    yearBuilt: undefined,
    preferredTerm: '',
    propertyType: 'apartment',
    selectedInventoryId: '',
    status: 'active',
    amenities: [],
    outdoorFeatures: [],
    storageOptions: [],
    technologyFeatures: [],
    communityAmenities: [],
    petPolicy: '',
    isRepossessed: false,
    packageType: '',
    pendingSale: false,
    soldPrice: undefined,
    searchResultsText: '',
    agentPhotoUrl: '',
    mhDetails: {
      manufacturer: '',
      model: '',
      serialNumber: '',
      modelYear: undefined,
      color: '',
      communityName: '',
      propertyId: '',
      lotSize: '',
      width1: undefined,
      length1: undefined,
      width2: undefined,
      length2: undefined,
      width3: undefined,
      length3: undefined,
      foundation: '',
      roofType: '',
      roofMaterial: '',
      exteriorMaterial: '',
      ceilingMaterial: '',
      wallMaterial: '',
      hvacType: '',
      waterHeaterType: '',
      electricalSystem: '',
      plumbingType: '',
      insulationType: '',
      windowType: '',
      thermopaneWindows: false,
      flooringType: '',
      kitchenAppliances: [],
      laundryHookups: false,
      laundryRoom: false,
      internetReady: false,
      cableReady: false,
      phoneReady: false,
      garage: false,
      carport: false,
      centralAir: false,
      fireplace: false,
      storageShed: false,
      gutters: false,
      shutters: false,
      deck: false,
      patio: false,
      cathedralCeilings: false,
      ceilingFans: false,
      skylights: false,
      walkinClosets: false,
      pantry: false,
      sunRoom: false,
      basement: false,
      gardenTub: false,
      garbageDisposal: false,
      refrigeratorIncluded: false,
      microwaveIncluded: false,
      ovenIncluded: false,
      dishwasherIncluded: false,
      washerIncluded: false,
      dryerIncluded: false
    },
    images: [],
    videos: [],
    floorPlans: [],
    virtualTours: [],
    contactInfo: {
      mhVillageAccountKey: '',
      firstName: '',
      lastName: '',
      companyName: '',
      phone: '',
      email: '',
      fax: '',
      website: '',
      additionalEmail1: '',
      additionalEmail2: '',
      additionalEmail3: '',
      alternatePhone: ''
    },
    ...listing
    // MH specific fields
    make: '',
    model: '',
    vin: '',
    stockNumber: '',
    condition: '',
    location: '',
    cost: '',
    features: [] as string[],
  })

  const [newAmenity, setNewAmenity] = useState('')
  const [newOutdoorFeature, setNewOutdoorFeature] = useState('')
  const [newStorageOption, setNewStorageOption] = useState('')
  const [newTechFeature, setNewTechFeature] = useState('')
  const [newCommunityAmenity, setNewCommunityAmenity] = useState('')
  const [newKitchenAppliance, setNewKitchenAppliance] = useState('')
  const [newImage, setNewImage] = useState('')
  const [newVideo, setNewVideo] = useState('')
  const [newFloorPlan, setNewFloorPlan] = useState('')
  const [newVirtualTour, setNewVirtualTour] = useState('')
  const [associatedLandId, setAssociatedLandId] = useState<string>(listing?.associatedLandId || '')
  const [associatedInventoryId, setAssociatedInventoryId] = useState<string>(listing?.associatedInventoryId || '')

  const handleInputChange = (field: keyof Listing, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleMHDetailsChange = (field: keyof MHDetails, value: any) => {
    setFormData(prev => ({
      ...prev,
      mhDetails: { ...prev.mhDetails, [field]: value }
    }))
  }

  const handleContactInfoChange = (field: keyof ContactInfo, value: any) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [field]: value }
    }))
  }

  const addToArray = (field: keyof Listing, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      const currentArray = (formData[field] as string[]) || []
      handleInputChange(field, [...currentArray, value.trim()])
      setter('')
    }
  }

  const removeFromArray = (field: keyof Listing, index: number) => {
    const currentArray = (formData[field] as string[]) || []
    handleInputChange(field, currentArray.filter((_, i) => i !== index))
  }

  const addKitchenAppliance = () => {
    if (newKitchenAppliance.trim()) {
      const currentAppliances = formData.mhDetails?.kitchenAppliances || []
      handleMHDetailsChange('kitchenAppliances', [...currentAppliances, newKitchenAppliance.trim()])
      setNewKitchenAppliance('')
    }
  }

  const removeKitchenAppliance = (index: number) => {
    const currentAppliances = formData.mhDetails?.kitchenAppliances || []
    handleMHDetailsChange('kitchenAppliances', currentAppliances.filter((_, i) => i !== index))
  }

  const handleInventorySelection = (inventoryId: string) => {
    const selectedItem = (mockInventory.exampleInventory ?? []).find(item => item.stockNumber === inventoryId)
    
    if (selectedItem) {
      setFormData(prev => ({
        ...prev,
        selectedInventoryId: inventoryId,
        // Populate form fields from inventory data
        title: selectedItem.make && selectedItem.model ? 
          `${selectedItem.year || ''} ${selectedItem.make} ${selectedItem.model}`.trim() : prev.title,
        yearBuilt: selectedItem.year?.toString() || prev.yearBuilt,
        make: selectedItem.make || prev.make,
        model: selectedItem.model || prev.model,
        stockNumber: selectedItem.stockNumber || prev.stockNumber,
        condition: selectedItem.condition || prev.condition,
        location: selectedItem.location || prev.location,
        // Set price based on listing type
        ...(prev.listingType === 'rent' ? 
          { rent: selectedItem.price?.toString() || prev.rent } : 
          { purchasePrice: selectedItem.price?.toString() || prev.purchasePrice }
        ),
        cost: selectedItem.cost?.toString() || prev.cost,
        features: selectedItem.features || prev.features,
        // Generate description if not already set
        description: prev.description || generateInventoryDescription(selectedItem),
      }))
    } else {
      // Clear inventory-related fields if no item selected
      setFormData(prev => ({
        ...prev,
        selectedInventoryId: inventoryId,
      }))
    }
  }

  const generateInventoryDescription = (item: any) => {
    const parts = []
    if (item.year && item.make && item.model) {
      parts.push(`${item.year} ${item.make} ${item.model}`)
    }
    if (item.condition) {
      parts.push(`in ${item.condition.toLowerCase()} condition`)
    }
    if (item.features && item.features.length > 0) {
      parts.push(`Features include: ${item.features.join(', ')}`)
    }
    if (item.location) {
      parts.push(`Currently located at ${item.location}`)
    }
    return parts.join('. ') + (parts.length > 0 ? '.' : '')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submissionData = {
      ...formData,
      associatedLandId: associatedLandId || null,
      associatedInventoryId: associatedInventoryId || null,
    }
    onSubmit(submissionData)
  }

  const handleCancel = () => {
    navigate('/inventory')
  }

  const isManufacturedHome = formData.propertyType === 'manufactured_home'

  // Get available land listings
  const availableLandListings = mockListings.filter(
    listing => listing.propertyType === 'land' && listing.status === 'active'
  )

  // Get available inventory items
  const availableInventoryItems = (mockInventory.sampleInventory ?? []).filter(
    item => item.status === 'available'
  )

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            {listing ? 'Edit Listing' : 'Create New Listing'}
          </CardTitle>
          <CardDescription>
            {listing ? 'Update the listing details below' : 'Fill in the details to create a new property listing'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="mh-details" disabled={!isManufacturedHome}>MH Details</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="listingType">Listing Type</Label>
                    <Select value={formData.listingType} onValueChange={(value: 'rent' | 'sale') => handleInputChange('listingType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rent">For Rent</SelectItem>
                        <SelectItem value="sale">For Sale</SelectItem>
          {/* Conditional Inventory Selection for Manufactured Homes */}
          {formData.propertyType === 'manufactured_home' && (
            <div>
              <Label htmlFor="inventory">Select from Inventory</Label>
              <Select value={formData.selectedInventoryId} onValueChange={handleInventorySelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an inventory item (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None - Enter details manually</SelectItem>
                  {availableInventory.map((item) => (
                    <SelectItem key={item.stockNumber} value={item.stockNumber}>
                      {item.stockNumber} - {item.year} {item.make} {item.model} ({item.condition})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.selectedInventoryId && (
                <p className="text-sm text-muted-foreground mt-1">
                  Form fields have been populated from inventory. You can still edit them below.
                </p>
              )}
            </div>
          )}

          {/* Conditional Land Selection */}
          {formData.propertyType === 'land' && (
            <div>
              <Label htmlFor="associatedLand">Associated Land</Label>
              <Select value={formData.selectedInventoryId} onValueChange={(value) => handleInputChange('selectedInventoryId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a land parcel (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None - Enter details manually</SelectItem>
                  {availableLand.map((land) => (
                    <SelectItem key={land.id} value={land.id}>
                      {land.title} - {land.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="condo">Condo</SelectItem>
                        <SelectItem value="manufactured_home">Manufactured Home</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter listing title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter detailed description"
                    rows={4}
                    required
                  />
                </div>

                {formData.listingType === 'sale' && (
                  <div>
                    <Label htmlFor="termsOfSale">Terms of Sale</Label>
                    <Textarea
                      id="termsOfSale"
                      value={formData.termsOfSale || ''}
                      onChange={(e) => handleInputChange('termsOfSale', e.target.value)}
                      placeholder="Enter terms of sale"
                      rows={2}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="preferredTerm">Preferred Term</Label>
                  <Input
                    id="preferredTerm"
                    value={formData.preferredTerm || ''}
                    onChange={(e) => handleInputChange('preferredTerm', e.target.value)}
                    placeholder="How to describe this property (e.g., Manufactured Home, Mobile Home)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      min="0"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      min="0"
                      step="0.5"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="squareFootage">Square Footage</Label>
                    <Input
                      id="squareFootage"
                      type="number"
                      min="0"
                      value={formData.squareFootage}
                      onChange={(e) => handleInputChange('squareFootage', parseInt(e.target.value) || 0)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="yearBuilt">Year Built</Label>
                  <Input
                    id="yearBuilt"
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    value={formData.yearBuilt || ''}
                    onChange={(e) => handleInputChange('yearBuilt', parseInt(e.target.value) || undefined)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="petPolicy">Pet Policy</Label>
                    <Input
                      id="petPolicy"
                      value={formData.petPolicy}
                      onChange={(e) => handleInputChange('petPolicy', e.target.value)}
                      placeholder="e.g., Pets allowed with deposit"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="packageType">Package Type</Label>
                    <Input
                      id="packageType"
                      value={formData.packageType || ''}
                      onChange={(e) => handleInputChange('packageType', e.target.value)}
                      placeholder="e.g., Premium, Standard, Basic"
                    />
                  </div>

                  <div>
                    <Label htmlFor="searchResultsText">Search Results Text</Label>
                    <Input
                      id="searchResultsText"
                      value={formData.searchResultsText || ''}
                      onChange={(e) => handleInputChange('searchResultsText', e.target.value)}
                      placeholder="Short text for search results"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isRepossessed"
                    checked={formData.isRepossessed || false}
                    onCheckedChange={(checked) => handleInputChange('isRepossessed', checked)}
                  />
                  <Label htmlFor="isRepossessed">This is a repossessed home</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pendingSale"
                    checked={formData.pendingSale || false}
                    onCheckedChange={(checked) => handleInputChange('pendingSale', checked)}
                  />
                  <Label htmlFor="pendingSale">Pending sale in progress</Label>
                </div>

                {/* Associations Section */}
                <Separator />
                <div className="space-y-4">
                  <h4 className="text-md font-semibold">Property Associations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Associated Land */}
                    <div className="space-y-2">
                      <Label htmlFor="associatedLand">Associated Land</Label>
                      <Select value={associatedLandId} onValueChange={setAssociatedLandId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select land parcel (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No land association</SelectItem>
                          {availableLandListings.map((land) => (
                            <SelectItem key={land.id} value={land.id}>
                              {land.title} - {land.address}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {associatedLandId && (
                        <div className="text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            Land: {availableLandListings.find(l => l.id === associatedLandId)?.title}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Associated Inventory */}
                    <div className="space-y-2">
                      <Label htmlFor="associatedInventory">Associated Inventory</Label>
                      <Select value={associatedInventoryId} onValueChange={setAssociatedInventoryId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select inventory item (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No inventory association</SelectItem>
                          {availableInventoryItems.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.year} {item.make} {item.model} ({item.stockNumber})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {associatedInventoryId && (
                        <div className="text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            Inventory: {availableInventoryItems.find(i => i.id === associatedInventoryId)?.stockNumber}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Association Info */}
                  {(associatedLandId || associatedInventoryId) && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-700">
                        <strong>Association Summary:</strong>
                        {associatedLandId && ` This property is associated with land parcel "${availableLandListings.find(l => l.id === associatedLandId)?.title}".`}
                        {associatedInventoryId && ` This property is linked to inventory item "${availableInventoryItems.find(i => i.id === associatedInventoryId)?.stockNumber}".`}
                        {associatedLandId && associatedInventoryId && ' Both associations will be maintained when the listing is saved.'}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="location" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Location Details</h3>
                </div>

                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter street address"
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city || ''}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state || ''}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="Enter state"
                    />
                  </div>

                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode || ''}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="Enter ZIP code"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="county">County</Label>
                    <Input
                      id="county"
                      value={formData.county || ''}
                      onChange={(e) => handleInputChange('county', e.target.value)}
                      placeholder="Enter county"
                    />
                  </div>

                  <div>
                    <Label htmlFor="township">Township</Label>
                    <Input
                      id="township"
                      value={formData.township || ''}
                      onChange={(e) => handleInputChange('township', e.target.value)}
                      placeholder="Enter township"
                    />
                  </div>

                  <div>
                    <Label htmlFor="schoolDistrict">School District</Label>
                    <Input
                      id="schoolDistrict"
                      value={formData.schoolDistrict || ''}
                      onChange={(e) => handleInputChange('schoolDistrict', e.target.value)}
                      placeholder="Enter school district"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude || ''}
                      onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value) || undefined)}
                      placeholder="Enter latitude"
                    />
                  </div>

                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude || ''}
                      onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value) || undefined)}
                      placeholder="Enter longitude"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Pricing Information</h3>
                </div>

                {formData.listingType === 'rent' ? (
                  <div>
                    <Label htmlFor="rent">Monthly Rent</Label>
                    <Input
                      id="rent"
                      type="number"
                      min="0"
                      value={formData.rent || ''}
                      onChange={(e) => handleInputChange('rent', parseInt(e.target.value) || undefined)}
                      placeholder="Enter monthly rent"
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="purchasePrice">Purchase Price</Label>
                    <Input
                      id="purchasePrice"
                      type="number"
                      min="0"
                      value={formData.purchasePrice || ''}
                      onChange={(e) => handleInputChange('purchasePrice', parseInt(e.target.value) || undefined)}
                      placeholder="Enter purchase price"
                      required
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lotRent">Monthly Lot Rent</Label>
                    <Input
                      id="lotRent"
                      type="number"
                      min="0"
                      value={formData.lotRent || ''}
                      onChange={(e) => handleInputChange('lotRent', parseInt(e.target.value) || undefined)}
                      placeholder="Enter lot rent"
                    />
                  </div>

                  <div>
                    <Label htmlFor="hoaFees">HOA Fees</Label>
                    <Input
                      id="hoaFees"
                      type="number"
                      min="0"
                      value={formData.hoaFees || ''}
                      onChange={(e) => handleInputChange('hoaFees', parseInt(e.target.value) || undefined)}
                      placeholder="Enter HOA fees"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="monthlyTax">Monthly Tax</Label>
                    <Input
                      id="monthlyTax"
                      type="number"
                      min="0"
                      value={formData.monthlyTax || ''}
                      onChange={(e) => handleInputChange('monthlyTax', parseInt(e.target.value) || undefined)}
                      placeholder="Enter monthly tax"
                    />
                  </div>

                  <div>
                    <Label htmlFor="monthlyUtilities">Monthly Utilities</Label>
                    <Input
                      id="monthlyUtilities"
                      type="number"
                      min="0"
                      value={formData.monthlyUtilities || ''}
                      onChange={(e) => handleInputChange('monthlyUtilities', parseInt(e.target.value) || undefined)}
                      placeholder="Approximate monthly utilities"
                    />
                  </div>
                </div>

                {formData.listingType === 'sale' && (
                  <div>
                    <Label htmlFor="soldPrice">Sold Price</Label>
                    <Input
                      id="soldPrice"
                      type="number"
                      min="0"
                      value={formData.soldPrice || ''}
                      onChange={(e) => handleInputChange('soldPrice', parseInt(e.target.value) || undefined)}
                      placeholder="Enter sold price (if applicable)"
                    />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Property Features</h3>
                </div>

                {/* Amenities */}
                <div>
                  <Label>Amenities</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      placeholder="Add amenity"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('amenities', newAmenity, setNewAmenity))}
                    />
                    <Button type="button" onClick={() => addToArray('amenities', newAmenity, setNewAmenity)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.amenities || []).map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {amenity}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('amenities', index)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Outdoor Features */}
                <div>
                  <Label>Outdoor Features</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newOutdoorFeature}
                      onChange={(e) => setNewOutdoorFeature(e.target.value)}
                      placeholder="Add outdoor feature"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('outdoorFeatures', newOutdoorFeature, setNewOutdoorFeature))}
                    />
                    <Button type="button" onClick={() => addToArray('outdoorFeatures', newOutdoorFeature, setNewOutdoorFeature)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.outdoorFeatures || []).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('outdoorFeatures', index)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Storage Options */}
                <div>
                  <Label>Storage Options</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newStorageOption}
                      onChange={(e) => setNewStorageOption(e.target.value)}
                      placeholder="Add storage option"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('storageOptions', newStorageOption, setNewStorageOption))}
                    />
                    <Button type="button" onClick={() => addToArray('storageOptions', newStorageOption, setNewStorageOption)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.storageOptions || []).map((option, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {option}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('storageOptions', index)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Technology Features */}
                <div>
                  <Label>Technology Features</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTechFeature}
                      onChange={(e) => setNewTechFeature(e.target.value)}
                      placeholder="Add technology feature"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('technologyFeatures', newTechFeature, setNewTechFeature))}
                    />
                    <Button type="button" onClick={() => addToArray('technologyFeatures', newTechFeature, setNewTechFeature)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.technologyFeatures || []).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('technologyFeatures', index)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Community Amenities */}
                <div>
                  <Label>Community Amenities</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newCommunityAmenity}
                      onChange={(e) => setNewCommunityAmenity(e.target.value)}
                      placeholder="Add community amenity"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('communityAmenities', newCommunityAmenity, setNewCommunityAmenity))}
                    />
                    <Button type="button" onClick={() => addToArray('communityAmenities', newCommunityAmenity, setNewCommunityAmenity)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.communityAmenities || []).map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {amenity}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('communityAmenities', index)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Media */}
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    <h4 className="text-md font-semibold">Media</h4>
                  </div>

                  {/* Images */}
                  <div>
                    <Label>Images</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        placeholder="Add image URL"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('images', newImage, setNewImage))}
                      />
                      <Button type="button" onClick={() => addToArray('images', newImage, setNewImage)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(formData.images || []).map((image, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          Image {index + 1}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('images', index)} />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Videos */}
                  <div>
                    <Label>Videos</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newVideo}
                        onChange={(e) => setNewVideo(e.target.value)}
                        placeholder="Add video URL"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('videos', newVideo, setNewVideo))}
                      />
                      <Button type="button" onClick={() => addToArray('videos', newVideo, setNewVideo)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(formData.videos || []).map((video, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          Video {index + 1}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('videos', index)} />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Floor Plans */}
                  <div>
                    <Label>Floor Plans</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newFloorPlan}
                        onChange={(e) => setNewFloorPlan(e.target.value)}
                        placeholder="Add floor plan URL"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('floorPlans', newFloorPlan, setNewFloorPlan))}
                      />
                      <Button type="button" onClick={() => addToArray('floorPlans', newFloorPlan, setNewFloorPlan)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(formData.floorPlans || []).map((plan, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          Floor Plan {index + 1}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('floorPlans', index)} />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Virtual Tours */}
                  <div>
                    <Label>Virtual Tours</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newVirtualTour}
                        onChange={(e) => setNewVirtualTour(e.target.value)}
                        placeholder="Add virtual tour URL"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('virtualTours', newVirtualTour, setNewVirtualTour))}
                      />
                      <Button type="button" onClick={() => addToArray('virtualTours', newVirtualTour, setNewVirtualTour)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(formData.virtualTours || []).map((tour, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          Virtual Tour {index + 1}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('virtualTours', index)} />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="agentPhotoUrl">Agent/Company Photo URL</Label>
                    <Input
                      id="agentPhotoUrl"
                      value={formData.agentPhotoUrl || ''}
                      onChange={(e) => handleInputChange('agentPhotoUrl', e.target.value)}
                      placeholder="URL for agent or company logo photo"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="mh-details" className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Home className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Manufactured Home Details</h3>
                </div>

                {/* Basic MH Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Input
                      id="manufacturer"
                      value={formData.mhDetails?.manufacturer || ''}
                      onChange={(e) => handleMHDetailsChange('manufacturer', e.target.value)}
                      placeholder="Enter manufacturer"
                    />
                  </div>

                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={formData.mhDetails?.model || ''}
                      onChange={(e) => handleMHDetailsChange('model', e.target.value)}
                      placeholder="Enter model"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="serialNumber">Serial Number</Label>
                    <Input
                      id="serialNumber"
                      value={formData.mhDetails?.serialNumber || ''}
                      onChange={(e) => handleMHDetailsChange('serialNumber', e.target.value)}
                      placeholder="Enter serial number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="modelYear">Model Year</Label>
                    <Input
                      id="modelYear"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={formData.mhDetails?.modelYear || ''}
                      onChange={(e) => handleMHDetailsChange('modelYear', parseInt(e.target.value) || undefined)}
                      placeholder="Enter model year"
                    />
                  </div>

                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={formData.mhDetails?.color || ''}
                      onChange={(e) => handleMHDetailsChange('color', e.target.value)}
                      placeholder="Enter color"
                    />
                  </div>
                </div>

                {/* Community Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="communityName">Community Name</Label>
                    <Input
                      id="communityName"
                      value={formData.mhDetails?.communityName || ''}
                      onChange={(e) => handleMHDetailsChange('communityName', e.target.value)}
                      placeholder="Enter community name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="propertyId">Property ID</Label>
                    <Input
                      id="propertyId"
                      value={formData.mhDetails?.propertyId || ''}
                      onChange={(e) => handleMHDetailsChange('propertyId', e.target.value)}
                      placeholder="Property identification number"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="lotSize">Lot Size</Label>
                  <Input
                    id="lotSize"
                    value={formData.mhDetails?.lotSize || ''}
                    onChange={(e) => handleMHDetailsChange('lotSize', e.target.value)}
                    placeholder="Enter lot size (e.g., 60x120)"
                  />
                </div>

                {/* Dimensions */}
                <div>
                  <h4 className="text-md font-semibold mb-2">Dimensions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div>
                      <Label htmlFor="width1">Width 1</Label>
                      <Input
                        id="width1"
                        type="number"
                        min="0"
                        value={formData.mhDetails?.width1 || ''}
                        onChange={(e) => handleMHDetailsChange('width1', parseInt(e.target.value) || undefined)}
                        placeholder="Primary width"
                      />
                    </div>

                    <div>
                      <Label htmlFor="length1">Length 1</Label>
                      <Input
                        id="length1"
                        type="number"
                        min="0"
                        value={formData.mhDetails?.length1 || ''}
                        onChange={(e) => handleMHDetailsChange('length1', parseInt(e.target.value) || undefined)}
                        placeholder="Primary length"
                      />
                    </div>

                    <div>
                      <Label htmlFor="width2">Width 2</Label>
                      <Input
                        id="width2"
                        type="number"
                        min="0"
                        value={formData.mhDetails?.width2 || ''}
                        onChange={(e) => handleMHDetailsChange('width2', parseInt(e.target.value) || undefined)}
                        placeholder="Secondary width"
                      />
                    </div>

                    <div>
                      <Label htmlFor="length2">Length 2</Label>
                      <Input
                        id="length2"
                        type="number"
                        min="0"
                        value={formData.mhDetails?.length2 || ''}
                        onChange={(e) => handleMHDetailsChange('length2', parseInt(e.target.value) || undefined)}
                        placeholder="Secondary length"
                      />
                    </div>

                    <div>
                      <Label htmlFor="width3">Width 3</Label>
                      <Input
                        id="width3"
                        type="number"
                        min="0"
                        value={formData.mhDetails?.width3 || ''}
                        onChange={(e) => handleMHDetailsChange('width3', parseInt(e.target.value) || undefined)}
                        placeholder="Tertiary width"
                      />
                    </div>

                    <div>
                      <Label htmlFor="length3">Length 3</Label>
                      <Input
                        id="length3"
                        type="number"
                        min="0"
                        value={formData.mhDetails?.length3 || ''}
                        onChange={(e) => handleMHDetailsChange('length3', parseInt(e.target.value) || undefined)}
                        placeholder="Tertiary length"
                      />
                    </div>
                  </div>
                </div>

                {/* Construction Materials */}
                <div>
                  <h4 className="text-md font-semibold mb-2">Construction Materials</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="foundation">Foundation</Label>
                      <Input
                        id="foundation"
                        value={formData.mhDetails?.foundation || ''}
                        onChange={(e) => handleMHDetailsChange('foundation', e.target.value)}
                        placeholder="Foundation type"
                      />
                    </div>

                    <div>
                      <Label htmlFor="roofType">Roof Type</Label>
                      <Input
                        id="roofType"
                        value={formData.mhDetails?.roofType || ''}
                        onChange={(e) => handleMHDetailsChange('roofType', e.target.value)}
                        placeholder="Roof type"
                      />
                    </div>

                    <div>
                      <Label htmlFor="roofMaterial">Roof Material</Label>
                      <Input
                        id="roofMaterial"
                        value={formData.mhDetails?.roofMaterial || ''}
                        onChange={(e) => handleMHDetailsChange('roofMaterial', e.target.value)}
                        placeholder="Roof material"
                      />
                    </div>

                    <div>
                      <Label htmlFor="exteriorMaterial">Exterior Material</Label>
                      <Input
                        id="exteriorMaterial"
                        value={formData.mhDetails?.exteriorMaterial || ''}
                        onChange={(e) => handleMHDetailsChange('exteriorMaterial', e.target.value)}
                        placeholder="Exterior material"
                      />
                    </div>

                    <div>
                      <Label htmlFor="ceilingMaterial">Ceiling Material</Label>
                      <Input
                        id="ceilingMaterial"
                        value={formData.mhDetails?.ceilingMaterial || ''}
                        onChange={(e) => handleMHDetailsChange('ceilingMaterial', e.target.value)}
                        placeholder="Ceiling material"
                      />
                    </div>

                    <div>
                      <Label htmlFor="wallMaterial">Wall Material</Label>
                      <Input
                        id="wallMaterial"
                        value={formData.mhDetails?.wallMaterial || ''}
                        onChange={(e) => handleMHDetailsChange('wallMaterial', e.target.value)}
                        placeholder="Wall material"
                      />
                    </div>
                  </div>
                </div>

                {/* Systems */}
                <div>
                  <h4 className="text-md font-semibold mb-2">Systems</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hvacType">HVAC Type</Label>
                      <Input
                        id="hvacType"
                        value={formData.mhDetails?.hvacType || ''}
                        onChange={(e) => handleMHDetailsChange('hvacType', e.target.value)}
                        placeholder="HVAC system type"
                      />
                    </div>

                    <div>
                      <Label htmlFor="waterHeaterType">Water Heater Type</Label>
                      <Input
                        id="waterHeaterType"
                        value={formData.mhDetails?.waterHeaterType || ''}
                        onChange={(e) => handleMHDetailsChange('waterHeaterType', e.target.value)}
                        placeholder="Water heater type"
                      />
                    </div>

                    <div>
                      <Label htmlFor="electricalSystem">Electrical System</Label>
                      <Input
                        id="electricalSystem"
                        value={formData.mhDetails?.electricalSystem || ''}
                        onChange={(e) => handleMHDetailsChange('electricalSystem', e.target.value)}
                        placeholder="Electrical system"
                      />
                    </div>

                    <div>
                      <Label htmlFor="plumbingType">Plumbing Type</Label>
                      <Input
                        id="plumbingType"
                        value={formData.mhDetails?.plumbingType || ''}
                        onChange={(e) => handleMHDetailsChange('plumbingType', e.target.value)}
                        placeholder="Plumbing type"
                      />
                    </div>

                    <div>
                      <Label htmlFor="insulationType">Insulation Type</Label>
                      <Input
                        id="insulationType"
                        value={formData.mhDetails?.insulationType || ''}
                        onChange={(e) => handleMHDetailsChange('insulationType', e.target.value)}
                        placeholder="Insulation type"
                      />
                    </div>

                    <div>
                      <Label htmlFor="windowType">Window Type</Label>
                      <Input
                        id="windowType"
                        value={formData.mhDetails?.windowType || ''}
                        onChange={(e) => handleMHDetailsChange('windowType', e.target.value)}
                        placeholder="Window type"
                      />
                    </div>

                    <div>
                      <Label htmlFor="flooringType">Flooring Type</Label>
                      <Input
                        id="flooringType"
                        value={formData.mhDetails?.flooringType || ''}
                        onChange={(e) => handleMHDetailsChange('flooringType', e.target.value)}
                        placeholder="Flooring type"
                      />
                    </div>
                  </div>
                </div>

                {/* Kitchen Appliances */}
                <div>
                  <Label>Kitchen Appliances</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newKitchenAppliance}
                      onChange={(e) => setNewKitchenAppliance(e.target.value)}
                      placeholder="Add kitchen appliance"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKitchenAppliance())}
                    />
                    <Button type="button" onClick={addKitchenAppliance}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.mhDetails?.kitchenAppliances || []).map((appliance, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {appliance}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeKitchenAppliance(index)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Boolean Features */}
                <div>
                  <h4 className="text-md font-semibold mb-4">Features & Amenities</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { key: 'garage', label: 'Garage' },
                      { key: 'carport', label: 'Carport' },
                      { key: 'centralAir', label: 'Central Air' },
                      { key: 'thermopaneWindows', label: 'Thermopane Windows' },
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
                      { key: 'laundryHookups', label: 'Laundry Hookups' },
                      { key: 'internetReady', label: 'Internet Ready' },
                      { key: 'cableReady', label: 'Cable Ready' },
                      { key: 'phoneReady', label: 'Phone Ready' }
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={formData.mhDetails?.[key as keyof MHDetails] || false}
                          onCheckedChange={(checked) => handleMHDetailsChange(key as keyof MHDetails, checked)}
                        />
                        <Label htmlFor={key}>{label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Included Appliances */}
                <div>
                  <h4 className="text-md font-semibold mb-4">Included Appliances</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { key: 'refrigeratorIncluded', label: 'Refrigerator Included' },
                      { key: 'microwaveIncluded', label: 'Microwave Included' },
                      { key: 'ovenIncluded', label: 'Oven Included' },
                      { key: 'dishwasherIncluded', label: 'Dishwasher Included' },
                      { key: 'washerIncluded', label: 'Washer Included' },
                      { key: 'dryerIncluded', label: 'Dryer Included' }
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={formData.mhDetails?.[key as keyof MHDetails] || false}
                          onCheckedChange={(checked) => handleMHDetailsChange(key as keyof MHDetails, checked)}
                        />
                        <Label htmlFor={key}>{label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                </div>

                <div>
                  <Label htmlFor="mhVillageAccountKey">MHVillage Account Key</Label>
                  <Input
                    id="mhVillageAccountKey"
                    value={formData.contactInfo?.mhVillageAccountKey || ''}
                    onChange={(e) => handleContactInfoChange('mhVillageAccountKey', e.target.value)}
                    placeholder="MHVillage account key"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.contactInfo?.firstName || ''}
                      onChange={(e) => handleContactInfoChange('firstName', e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.contactInfo?.lastName || ''}
                      onChange={(e) => handleContactInfoChange('lastName', e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.contactInfo?.companyName || ''}
                    onChange={(e) => handleContactInfoChange('companyName', e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.contactInfo?.phone || ''}
                      onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="alternatePhone">Alternate Phone</Label>
                    <Input
                      id="alternatePhone"
                      value={formData.contactInfo?.alternatePhone || ''}
                      onChange={(e) => handleContactInfoChange('alternatePhone', e.target.value)}
                      placeholder="Enter alternate phone"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contactInfo?.email || ''}
                    onChange={(e) => handleContactInfoChange('email', e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Show inventory features if selected */}
          {formData.selectedInventoryId && formData.features.length > 0 && (
            <div>
              <Label>Inventory Features</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.features.map((feature, index) => (
                  <Badge key={index} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}
                  <div>
                    <Label htmlFor="additionalEmail1">Additional Email 1</Label>
                    <Input
                      id="additionalEmail1"
                      type="email"
                      value={formData.contactInfo?.additionalEmail1 || ''}
                      onChange={(e) => handleContactInfoChange('additionalEmail1', e.target.value)}
                      placeholder="Additional email 1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="additionalEmail2">Additional Email 2</Label>
                    <Input
                      id="additionalEmail2"
                      type="email"
                      value={formData.contactInfo?.additionalEmail2 || ''}
                      onChange={(e) => handleContactInfoChange('additionalEmail2', e.target.value)}
                      placeholder="Additional email 2"
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => handleInputChange('make', e.target.value)}
                placeholder="Enter manufacturer"
              />
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="Enter model"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stockNumber">Stock Number</Label>
              <Input
                id="stockNumber"
                value={formData.stockNumber}
                onChange={(e) => handleInputChange('stockNumber', e.target.value)}
                placeholder="Enter stock number"
                disabled={!!formData.selectedInventoryId}
              />
            </div>
            <div>
              <Label htmlFor="condition">Condition</Label>
              <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                  <SelectItem value="refurbished">Refurbished</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="location">Current Location</Label>
            <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main-lot">Main Lot</SelectItem>
                <SelectItem value="overflow-lot">Overflow Lot</SelectItem>
                <SelectItem value="service-bay">Service Bay</SelectItem>
                <SelectItem value="offsite">Offsite</SelectItem>
              </SelectContent>
            </Select>
          </div>

                    />
                  </div>

                  <div>
                    <Label htmlFor="additionalEmail3">Additional Email 3</Label>
                    <Input
                      id="additionalEmail3"
                      type="email"
                      value={formData.contactInfo?.additionalEmail3 || ''}
                      onChange={(e) => handleContactInfoChange('additionalEmail3', e.target.value)}
                      placeholder="Additional email 3"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fax">Fax</Label>
                    <Input
                      id="fax"
                      value={formData.contactInfo?.fax || ''}
                      onChange={(e) => handleContactInfoChange('fax', e.target.value)}
                      placeholder="Enter fax number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.contactInfo?.website || ''}
                      onChange={(e) => handleContactInfoChange('website', e.target.value)}
                      placeholder="Enter website URL"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4 pt-6">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {listing ? 'Update Listing' : 'Create Listing'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

          {/* Show cost field for inventory items */}
          {formData.selectedInventoryId && (
            <div>
              <Label htmlFor="cost">Cost (from inventory)</Label>
              <Input
                id="cost"
                type="number"
                value={formData.cost}
                onChange={(e) => handleInputChange('cost', e.target.value)}
                placeholder="Enter cost"
                disabled
              />
              <p className="text-sm text-muted-foreground mt-1">
                This is the cost from inventory and cannot be edited here.
              </p>
            </div>
          )}