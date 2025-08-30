import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { 
  AlertCircle, 
  CheckCircle2, 
  FileImage, 
  MapPin, 
  DollarSign,
  Tag,
  Users,
  Calendar,
  Send
} from 'lucide-react'
import { apiClient } from '@/utils/apiClient'

interface ListingHandoffModalProps {
  isOpen: boolean
  onClose: () => void
  inventoryItem: any
  onSuccess?: (listingId: string) => void
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

const ListingHandoffModal: React.FC<ListingHandoffModalProps> = ({
  isOpen,
  onClose,
  inventoryItem,
  onSuccess
}) => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: false,
    errors: [],
    warnings: []
  })
  
  // Listing data state
  const [listingData, setListingData] = useState({
    // Basic Info (pre-filled from inventory)
    listingType: inventoryItem?.listingType || 'manufactured_home',
    inventoryId: inventoryItem?.id || '',
    year: inventoryItem?.year || '',
    make: inventoryItem?.make || '',
    model: inventoryItem?.model || '',
    vin: inventoryItem?.vin || inventoryItem?.serialNumber || '',
    color: inventoryItem?.color || '',
    condition: inventoryItem?.condition || 'used',
    
    // Offer Type & Pricing
    offerType: 'for_sale' as 'for_sale' | 'for_rent' | 'both',
    salePrice: inventoryItem?.salePrice || '',
    rentPrice: inventoryItem?.rentPrice || '',
    currency: 'USD',
    
    // Property Details
    bedrooms: inventoryItem?.bedrooms || '',
    bathrooms: inventoryItem?.bathrooms || '',
    sleeps: inventoryItem?.sleeps || '',
    slides: inventoryItem?.slides || '',
    length: inventoryItem?.length || '',
    
    // Marketing Content
    description: '',
    searchResultsText: '',
    features: [] as string[],
    
    // Media
    primaryPhoto: inventoryItem?.media?.primaryPhoto || '',
    photos: inventoryItem?.media?.photos || [],
    virtualTour: '',
    
    // Location (inherit from company/lot)
    location: {
      locationType: 'dealer_lot',
      address1: '',
      city: '',
      state: '',
      postalCode: '',
      latitude: '',
      longitude: ''
    },
    
    // Seller Info (inherit from company)
    seller: {
      companyName: '',
      phone: '',
      emails: [''],
      website: ''
    },
    
    // Status
    status: 'draft' as 'draft' | 'active'
  })

  // Auto-generate search results text
  useEffect(() => {
    if (listingData.year && listingData.make && listingData.model) {
      const text = `${listingData.year} ${listingData.make} ${listingData.model}${listingData.color ? ` - ${listingData.color}` : ''}`
      if (text.length <= 80) {
        setListingData(prev => ({ ...prev, searchResultsText: text }))
      }
    }
  }, [listingData.year, listingData.make, listingData.model, listingData.color])

  // Validate listing data
  useEffect(() => {
    const errors: string[] = []
    const warnings: string[] = []

    // Required fields validation
    if (!listingData.inventoryId) errors.push('Inventory ID is required')
    if (!listingData.offerType) errors.push('Offer type is required')
    
    if (listingData.offerType === 'for_sale' || listingData.offerType === 'both') {
      if (!listingData.salePrice || parseFloat(listingData.salePrice) <= 0) {
        errors.push('Sale price is required for sale listings')
      }
    }
    
    if (listingData.offerType === 'for_rent' || listingData.offerType === 'both') {
      if (!listingData.rentPrice || parseFloat(listingData.rentPrice) <= 0) {
        errors.push('Rent price is required for rental listings')
      }
    }

    // Publish gate validation (for going live)
    if (listingData.status === 'active') {
      if (!listingData.description || listingData.description.length < 50) {
        errors.push('Description must be at least 50 characters for active listings')
      }
      
      if (!listingData.searchResultsText || listingData.searchResultsText.length > 80) {
        errors.push('Search results text is required and must be 80 characters or less')
      }
      
      if (listingData.photos.length === 0) {
        errors.push('At least one photo is required for active listings')
      }
      
      if (!listingData.location.city || !listingData.location.state) {
        errors.push('City and state are required for active listings')
      }
      
      if (!listingData.seller.phone && listingData.seller.emails.filter(e => e).length === 0) {
        errors.push('At least one contact method is required for active listings')
      }
    }

    // Warnings
    if (listingData.photos.length < 5) {
      warnings.push('Consider adding more photos (5+ recommended)')
    }
    
    if (listingData.description.length < 100) {
      warnings.push('Consider adding a more detailed description (100+ characters)')
    }
    
    if (listingData.listingType === 'manufactured_home' && (!listingData.bedrooms || !listingData.bathrooms)) {
      warnings.push('Bedrooms and bathrooms help buyers find your listing')
    }

    setValidationResult({
      isValid: errors.length === 0,
      errors,
      warnings
    })
  }, [listingData])

  const handleCreateListing = async () => {
    if (!validationResult.isValid) {
      toast({
        title: "Validation Failed",
        description: "Please fix the errors before creating the listing.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await apiClient.listingsCrud.createListing('company_test', listingData)
      
      toast({
        title: "Listing Created Successfully",
        description: `Listing ${response.id} has been created${listingData.status === 'active' ? ' and published' : ' as draft'}.`,
      })
      
      onSuccess?.(response.id)
      onClose()
    } catch (error) {
      console.error('Error creating listing:', error)
      toast({
        title: "Error Creating Listing",
        description: "There was an error creating the listing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFieldChange = (field: string, value: any) => {
    setListingData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedFieldChange = (parent: string, field: string, value: any) => {
    setListingData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value
      }
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Create Listing from Inventory
          </DialogTitle>
          <DialogDescription>
            Convert inventory item "{inventoryItem?.year} {inventoryItem?.make} {inventoryItem?.model}" into a marketplace listing.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="review">Review & Publish</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="offerType">Offer Type</Label>
                <Select 
                  value={listingData.offerType} 
                  onValueChange={(value) => handleFieldChange('offerType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="for_sale">For Sale</SelectItem>
                    <SelectItem value="for_rent">For Rent</SelectItem>
                    <SelectItem value="both">Both Sale & Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="condition">Condition</Label>
                <Select 
                  value={listingData.condition} 
                  onValueChange={(value) => handleFieldChange('condition', value)}
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
            </div>

            {(listingData.offerType === 'for_sale' || listingData.offerType === 'both') && (
              <div>
                <Label htmlFor="salePrice">Sale Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="salePrice"
                    type="number"
                    placeholder="0"
                    className="pl-10"
                    value={listingData.salePrice}
                    onChange={(e) => handleFieldChange('salePrice', e.target.value)}
                  />
                </div>
              </div>
            )}

            {(listingData.offerType === 'for_rent' || listingData.offerType === 'both') && (
              <div>
                <Label htmlFor="rentPrice">Monthly Rent</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="rentPrice"
                    type="number"
                    placeholder="0"
                    className="pl-10"
                    value={listingData.rentPrice}
                    onChange={(e) => handleFieldChange('rentPrice', e.target.value)}
                  />
                </div>
              </div>
            )}

            {listingData.listingType === 'manufactured_home' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    placeholder="0"
                    value={listingData.bedrooms}
                    onChange={(e) => handleFieldChange('bedrooms', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    step="0.5"
                    placeholder="0"
                    value={listingData.bathrooms}
                    onChange={(e) => handleFieldChange('bathrooms', e.target.value)}
                  />
                </div>
              </div>
            )}

            {listingData.listingType === 'rv' && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="sleeps">Sleeps</Label>
                  <Input
                    id="sleeps"
                    type="number"
                    placeholder="0"
                    value={listingData.sleeps}
                    onChange={(e) => handleFieldChange('sleeps', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="slides">Slide-outs</Label>
                  <Input
                    id="slides"
                    type="number"
                    placeholder="0"
                    value={listingData.slides}
                    onChange={(e) => handleFieldChange('slides', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="length">Length (ft)</Label>
                  <Input
                    id="length"
                    type="number"
                    placeholder="0"
                    value={listingData.length}
                    onChange={(e) => handleFieldChange('length', e.target.value)}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="marketing" className="space-y-4">
            <div>
              <Label htmlFor="searchResultsText">Search Results Title (80 chars max)</Label>
              <Input
                id="searchResultsText"
                maxLength={80}
                placeholder="Brief title shown in search results"
                value={listingData.searchResultsText}
                onChange={(e) => handleFieldChange('searchResultsText', e.target.value)}
              />
              <div className="text-sm text-muted-foreground mt-1">
                {listingData.searchResultsText.length}/80 characters
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description (50+ chars required for publishing)</Label>
              <Textarea
                id="description"
                rows={5}
                placeholder="Detailed description of the property..."
                value={listingData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
              />
              <div className="text-sm text-muted-foreground mt-1">
                {listingData.description.length} characters
              </div>
            </div>

            <div>
              <Label>Photos</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FileImage className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600">
                  {listingData.photos.length > 0 
                    ? `${listingData.photos.length} photos selected`
                    : 'No photos selected from inventory'
                  }
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Photos will be inherited from inventory. Add more in the full listings editor.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="location" className="space-y-4">
            <div>
              <Label htmlFor="locationType">Location Type</Label>
              <Select 
                value={listingData.location.locationType} 
                onValueChange={(value) => handleNestedFieldChange('location', 'locationType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dealer_lot">Dealer Lot</SelectItem>
                  <SelectItem value="community">Community/Park</SelectItem>
                  <SelectItem value="private_property">Private Property</SelectItem>
                  <SelectItem value="storage_facility">Storage Facility</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="City name"
                  value={listingData.location.city}
                  onChange={(e) => handleNestedFieldChange('location', 'city', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="State (e.g., CA, TX, FL)"
                  maxLength={2}
                  value={listingData.location.state}
                  onChange={(e) => handleNestedFieldChange('location', 'state', e.target.value.toUpperCase())}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address1">Address (Optional)</Label>
              <Input
                id="address1"
                placeholder="Street address"
                value={listingData.location.address1}
                onChange={(e) => handleNestedFieldChange('location', 'address1', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="postalCode">ZIP Code</Label>
              <Input
                id="postalCode"
                placeholder="12345"
                value={listingData.location.postalCode}
                onChange={(e) => handleNestedFieldChange('location', 'postalCode', e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="review" className="space-y-4">
            {/* Validation Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {validationResult.isValid ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  Validation Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {validationResult.errors.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-600 mb-2">Errors (Must Fix)</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {validationResult.errors.map((error, index) => (
                        <li key={index} className="text-sm text-red-600">{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {validationResult.warnings.length > 0 && (
                  <div>
                    <h4 className="font-medium text-yellow-600 mb-2">Warnings (Recommended)</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {validationResult.warnings.map((warning, index) => (
                        <li key={index} className="text-sm text-yellow-600">{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {validationResult.isValid && validationResult.warnings.length === 0 && (
                  <div className="text-green-600">
                    ✅ All validation checks passed! Ready to create listing.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Listing Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Listing Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Title:</span>
                  <span>{listingData.searchResultsText || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Offer Type:</span>
                  <Badge>{listingData.offerType.replace('_', ' ').toUpperCase()}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Price:</span>
                  <span>
                    {listingData.salePrice && `$${parseInt(listingData.salePrice).toLocaleString()}`}
                    {listingData.salePrice && listingData.rentPrice && ' / '}
                    {listingData.rentPrice && `$${parseInt(listingData.rentPrice).toLocaleString()}/mo`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Location:</span>
                  <span>{listingData.location.city}, {listingData.location.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge variant={listingData.status === 'active' ? 'default' : 'secondary'}>
                    {listingData.status.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Status Selection */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="publishActive"
                checked={listingData.status === 'active'}
                onCheckedChange={(checked) => 
                  handleFieldChange('status', checked ? 'active' : 'draft')
                }
              />
              <Label htmlFor="publishActive" className="font-medium">
                Publish listing immediately (make it live)
              </Label>
            </div>
            {listingData.status === 'active' && !validationResult.isValid && (
              <p className="text-sm text-red-600">
                ⚠️ Cannot publish with validation errors. Fix errors above or save as draft.
              </p>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateListing}
            disabled={isLoading || !validationResult.isValid}
          >
            {isLoading ? 'Creating...' : 
              listingData.status === 'active' ? 'Create & Publish Listing' : 'Create Draft Listing'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ListingHandoffModal