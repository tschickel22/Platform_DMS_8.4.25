import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Home, 
  DollarSign, 
  MapPin, 
  Calendar,
  FileText,
  Video,
  Image as ImageIcon,
  Building
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { PropertyListing, RentalListing, ManufacturedHomeListing, ListingType, HomeType, LocationType, RoofType, SidingType } from '@/types/listings'
import { allPropertyListings } from '@/mocks/listingsMock'

interface FormData {
  // Common fields
  listingType: ListingType
  title: string
  description: string
  address: string
  bedrooms: number
  bathrooms: number
  squareFootage: number
  status: string
  amenities: string[]
  images: string[]
  videos: string[]
  floorPlans: string[]
  contactInfo: {
    phone: string
    email: string
  }
  
  // Rental-specific fields
  rent?: number
  propertyType?: string
  petPolicy?: string
  
  // Manufactured Home-specific fields
  homeType?: HomeType
  askingPrice?: number
  sellerInfo?: {
    sellerId: string
    name: string
    phone: string
    email: string
    address: string
  }
  locationType?: LocationType
  communityName?: string
  make?: string
  model?: string
  year?: number
  roofType?: RoofType
  sidingType?: SidingType
  garage?: boolean
  centralAir?: boolean
  serialNumber?: string
  titleNumber?: string
  lotRent?: number
  taxes?: number
  utilities?: number
  virtualTour?: string
  condition?: string
  financing?: string
  appliances?: string[]
  features?: string[]
}

const initialFormData: FormData = {
  listingType: 'for_rent',
  title: '',
  description: '',
  address: '',
  bedrooms: 1,
  bathrooms: 1,
  squareFootage: 0,
  status: 'active',
  amenities: [],
  images: [],
  videos: [],
  floorPlans: [],
  contactInfo: {
    phone: '',
    email: ''
  }
}

const AMENITIES_OPTIONS = [
  'Pool', 'Gym', 'Parking', 'Laundry', 'Balcony', 'Fireplace', 
  'Dishwasher', 'Air Conditioning', 'Heating', 'Pet Friendly',
  'Furnished', 'Utilities Included', 'Storage', 'Garden'
]

const APPLIANCES_OPTIONS = [
  'Refrigerator', 'Stove', 'Oven', 'Microwave', 'Dishwasher',
  'Washer', 'Dryer', 'Garbage Disposal', 'Ice Maker'
]

const FEATURES_OPTIONS = [
  'Hardwood Floors', 'Carpet', 'Tile Flooring', 'Granite Countertops',
  'Stainless Steel Appliances', 'Walk-in Closet', 'Master Suite',
  'Open Floor Plan', 'Vaulted Ceilings', 'Bay Windows', 'Skylight',
  'French Doors', 'Built-in Storage', 'Island Kitchen'
]

export default function ListingForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { toast } = useToast()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [newAmenity, setNewAmenity] = useState('')
  const [newImage, setNewImage] = useState('')
  const [newVideo, setNewVideo] = useState('')
  const [newFloorPlan, setNewFloorPlan] = useState('')

  const isEditing = !!id

  useEffect(() => {
    if (isEditing) {
      const listing = allPropertyListings.find(l => l.id === id)
      if (listing) {
        if (listing.listingType === 'for_rent') {
          const rentalListing = listing as RentalListing
          setFormData({
            listingType: 'for_rent',
            title: rentalListing.title,
            description: rentalListing.description,
            address: rentalListing.address,
            bedrooms: rentalListing.bedrooms,
            bathrooms: rentalListing.bathrooms,
            squareFootage: rentalListing.squareFootage,
            status: rentalListing.status,
            amenities: rentalListing.amenities,
            images: rentalListing.images,
            videos: rentalListing.videos || [],
            floorPlans: rentalListing.floorPlans || [],
            contactInfo: rentalListing.contactInfo,
            rent: rentalListing.rent,
            propertyType: rentalListing.propertyType,
            petPolicy: rentalListing.petPolicy
          })
        } else {
          const mhListing = listing as ManufacturedHomeListing
          setFormData({
            listingType: 'for_sale',
            title: mhListing.title,
            description: mhListing.description,
            address: mhListing.address,
            bedrooms: mhListing.bedrooms,
            bathrooms: mhListing.bathrooms,
            squareFootage: mhListing.squareFootage,
            status: mhListing.status,
            amenities: mhListing.amenities,
            images: mhListing.images,
            videos: mhListing.videos || [],
            floorPlans: mhListing.floorPlans || [],
            contactInfo: mhListing.contactInfo,
            homeType: mhListing.homeType,
            askingPrice: mhListing.askingPrice,
            sellerInfo: mhListing.sellerInfo,
            locationType: mhListing.locationType,
            communityName: mhListing.communityName,
            make: mhListing.make,
            model: mhListing.model,
            year: mhListing.year,
            roofType: mhListing.roofType,
            sidingType: mhListing.sidingType,
            garage: mhListing.garage,
            centralAir: mhListing.centralAir,
            serialNumber: mhListing.serialNumber,
            titleNumber: mhListing.titleNumber,
            lotRent: mhListing.lotRent,
            taxes: mhListing.taxes,
            utilities: mhListing.utilities,
            virtualTour: mhListing.virtualTour,
            condition: mhListing.condition,
            financing: mhListing.financing,
            appliances: mhListing.appliances || [],
            features: mhListing.features || []
          })
        }
      }
    }
  }, [id, isEditing])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof FormData] as any,
        [field]: value
      }
    }))
  }

  const handleArrayToggle = (field: 'amenities' | 'appliances' | 'features', value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] || []
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]
      
      return {
        ...prev,
        [field]: newArray
      }
    })
  }

  const addToArray = (field: 'images' | 'videos' | 'floorPlans', value: string) => {
    if (!value.trim()) return
    
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()]
    }))
    
    // Clear the input
    if (field === 'images') setNewImage('')
    if (field === 'videos') setNewVideo('')
    if (field === 'floorPlans') setNewFloorPlan('')
  }

  const removeFromArray = (field: 'images' | 'videos' | 'floorPlans', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index) || []
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.title || !formData.address) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        })
        return
      }

      if (formData.listingType === 'for_rent' && !formData.rent) {
        toast({
          title: "Validation Error",
          description: "Rent amount is required for rental listings",
          variant: "destructive"
        })
        return
      }

      if (formData.listingType === 'for_sale' && !formData.askingPrice) {
        toast({
          title: "Validation Error",
          description: "Asking price is required for sale listings",
          variant: "destructive"
        })
        return
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: `Listing ${isEditing ? 'updated' : 'created'} successfully`,
      })

      navigate(-1)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save listing. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isManufacturedHome = formData.listingType === 'for_sale'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? 'Edit Listing' : 'Create New Listing'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Update listing information' : 'Add a new property to your listings'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Listing Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Listing Type
            </CardTitle>
            <CardDescription>
              Choose whether this is a rental property or a property for sale
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.listingType === 'for_rent' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleInputChange('listingType', 'for_rent')}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="listingType"
                    value="for_rent"
                    checked={formData.listingType === 'for_rent'}
                    onChange={() => handleInputChange('listingType', 'for_rent')}
                    className="text-primary"
                  />
                  <div>
                    <h3 className="font-medium">For Rent</h3>
                    <p className="text-sm text-muted-foreground">Traditional rental property</p>
                  </div>
                </div>
              </div>
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.listingType === 'for_sale' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleInputChange('listingType', 'for_sale')}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="listingType"
                    value="for_sale"
                    checked={formData.listingType === 'for_sale'}
                    onChange={() => handleInputChange('listingType', 'for_sale')}
                    className="text-primary"
                  />
                  <div>
                    <h3 className="font-medium">For Sale</h3>
                    <p className="text-sm text-muted-foreground">Manufactured/Mobile home for sale</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter listing title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    {formData.listingType === 'for_rent' && <SelectItem value="rented">Rented</SelectItem>}
                    {formData.listingType === 'for_sale' && <SelectItem value="sold">Sold</SelectItem>}
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the property..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter property address"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="squareFootage">Square Footage</Label>
                <Input
                  id="squareFootage"
                  type="number"
                  min="0"
                  value={formData.squareFootage}
                  onChange={(e) => handleInputChange('squareFootage', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.listingType === 'for_rent' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rent">Monthly Rent *</Label>
                  <Input
                    id="rent"
                    type="number"
                    min="0"
                    value={formData.rent || ''}
                    onChange={(e) => handleInputChange('rent', parseInt(e.target.value) || 0)}
                    placeholder="Enter monthly rent"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select value={formData.propertyType || ''} onValueChange={(value) => handleInputChange('propertyType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="askingPrice">Asking Price *</Label>
                  <Input
                    id="askingPrice"
                    type="number"
                    min="0"
                    value={formData.askingPrice || ''}
                    onChange={(e) => handleInputChange('askingPrice', parseInt(e.target.value) || 0)}
                    placeholder="Enter asking price"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="homeType">Home Type</Label>
                  <Select value={formData.homeType || ''} onValueChange={(value) => handleInputChange('homeType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select home type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mobile">Mobile Home</SelectItem>
                      <SelectItem value="manufactured">Manufactured Home</SelectItem>
                      <SelectItem value="modular">Modular Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manufactured Home Specific Fields */}
        {isManufacturedHome && (
          <>
            {/* Home Details */}
            <Card>
              <CardHeader>
                <CardTitle>Home Details</CardTitle>
                <CardDescription>Specific information about the manufactured home</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="make">Make</Label>
                    <Input
                      id="make"
                      value={formData.make || ''}
                      onChange={(e) => handleInputChange('make', e.target.value)}
                      placeholder="e.g., Clayton, Fleetwood"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={formData.model || ''}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      placeholder="Enter model name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      min="1950"
                      max={new Date().getFullYear()}
                      value={formData.year || ''}
                      onChange={(e) => handleInputChange('year', parseInt(e.target.value) || 0)}
                      placeholder="Enter year"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roofType">Roof Type</Label>
                    <Select value={formData.roofType || ''} onValueChange={(value) => handleInputChange('roofType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select roof type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shingle">Shingle</SelectItem>
                        <SelectItem value="metal">Metal</SelectItem>
                        <SelectItem value="rubber">Rubber</SelectItem>
                        <SelectItem value="tile">Tile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sidingType">Siding Type</Label>
                    <Select value={formData.sidingType || ''} onValueChange={(value) => handleInputChange('sidingType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select siding type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vinyl">Vinyl</SelectItem>
                        <SelectItem value="wood">Wood</SelectItem>
                        <SelectItem value="aluminum">Aluminum</SelectItem>
                        <SelectItem value="fiber_cement">Fiber Cement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serialNumber">Serial Number</Label>
                    <Input
                      id="serialNumber"
                      value={formData.serialNumber || ''}
                      onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                      placeholder="Enter serial number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="titleNumber">Title Number</Label>
                    <Input
                      id="titleNumber"
                      value={formData.titleNumber || ''}
                      onChange={(e) => handleInputChange('titleNumber', e.target.value)}
                      placeholder="Enter title number"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="garage"
                      checked={formData.garage || false}
                      onCheckedChange={(checked) => handleInputChange('garage', checked)}
                    />
                    <Label htmlFor="garage">Garage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="centralAir"
                      checked={formData.centralAir || false}
                      onCheckedChange={(checked) => handleInputChange('centralAir', checked)}
                    />
                    <Label htmlFor="centralAir">Central Air</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="locationType">Location Type</Label>
                    <Select value={formData.locationType || ''} onValueChange={(value) => handleInputChange('locationType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="community">Mobile Home Community</SelectItem>
                        <SelectItem value="private_land">Private Land</SelectItem>
                        <SelectItem value="family_land">Family Land</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="communityName">Community Name</Label>
                    <Input
                      id="communityName"
                      value={formData.communityName || ''}
                      onChange={(e) => handleInputChange('communityName', e.target.value)}
                      placeholder="Enter community name (if applicable)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lotRent">Monthly Lot Rent</Label>
                    <Input
                      id="lotRent"
                      type="number"
                      min="0"
                      value={formData.lotRent || ''}
                      onChange={(e) => handleInputChange('lotRent', parseInt(e.target.value) || 0)}
                      placeholder="Enter lot rent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxes">Annual Taxes</Label>
                    <Input
                      id="taxes"
                      type="number"
                      min="0"
                      value={formData.taxes || ''}
                      onChange={(e) => handleInputChange('taxes', parseInt(e.target.value) || 0)}
                      placeholder="Enter annual taxes"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="utilities">Monthly Utilities</Label>
                    <Input
                      id="utilities"
                      type="number"
                      min="0"
                      value={formData.utilities || ''}
                      onChange={(e) => handleInputChange('utilities', parseInt(e.target.value) || 0)}
                      placeholder="Estimated utilities"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Information */}
            <Card>
              <CardHeader>
                <CardTitle>Seller Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sellerName">Seller Name</Label>
                    <Input
                      id="sellerName"
                      value={formData.sellerInfo?.name || ''}
                      onChange={(e) => handleNestedInputChange('sellerInfo', 'name', e.target.value)}
                      placeholder="Enter seller name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellerPhone">Seller Phone</Label>
                    <Input
                      id="sellerPhone"
                      value={formData.sellerInfo?.phone || ''}
                      onChange={(e) => handleNestedInputChange('sellerInfo', 'phone', e.target.value)}
                      placeholder="Enter seller phone"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sellerEmail">Seller Email</Label>
                    <Input
                      id="sellerEmail"
                      type="email"
                      value={formData.sellerInfo?.email || ''}
                      onChange={(e) => handleNestedInputChange('sellerInfo', 'email', e.target.value)}
                      placeholder="Enter seller email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellerAddress">Seller Address</Label>
                    <Input
                      id="sellerAddress"
                      value={formData.sellerInfo?.address || ''}
                      onChange={(e) => handleNestedInputChange('sellerInfo', 'address', e.target.value)}
                      placeholder="Enter seller address"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={formData.condition || ''} onValueChange={(value) => handleInputChange('condition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="needs_work">Needs Work</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="financing">Financing Options</Label>
                    <Input
                      id="financing"
                      value={formData.financing || ''}
                      onChange={(e) => handleInputChange('financing', e.target.value)}
                      placeholder="e.g., Owner financing available"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="virtualTour">Virtual Tour URL</Label>
                  <Input
                    id="virtualTour"
                    value={formData.virtualTour || ''}
                    onChange={(e) => handleInputChange('virtualTour', e.target.value)}
                    placeholder="Enter virtual tour URL"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appliances */}
            <Card>
              <CardHeader>
                <CardTitle>Appliances</CardTitle>
                <CardDescription>Select included appliances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {APPLIANCES_OPTIONS.map((appliance) => (
                    <div key={appliance} className="flex items-center space-x-2">
                      <Checkbox
                        id={`appliance-${appliance}`}
                        checked={(formData.appliances || []).includes(appliance)}
                        onCheckedChange={() => handleArrayToggle('appliances', appliance)}
                      />
                      <Label htmlFor={`appliance-${appliance}`} className="text-sm">
                        {appliance}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
                <CardDescription>Select home features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {FEATURES_OPTIONS.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={`feature-${feature}`}
                        checked={(formData.features || []).includes(feature)}
                        onCheckedChange={() => handleArrayToggle('features', feature)}
                      />
                      <Label htmlFor={`feature-${feature}`} className="text-sm">
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Rental-specific fields */}
        {formData.listingType === 'for_rent' && (
          <Card>
            <CardHeader>
              <CardTitle>Rental Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="petPolicy">Pet Policy</Label>
                <Textarea
                  id="petPolicy"
                  value={formData.petPolicy || ''}
                  onChange={(e) => handleInputChange('petPolicy', e.target.value)}
                  placeholder="Describe pet policy..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
            <CardDescription>Select available amenities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AMENITIES_OPTIONS.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${amenity}`}
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={() => handleArrayToggle('amenities', amenity)}
                  />
                  <Label htmlFor={`amenity-${amenity}`} className="text-sm">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Media
            </CardTitle>
            <CardDescription>Add images, videos, and floor plans</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Images */}
            <div className="space-y-3">
              <Label>Images</Label>
              <div className="flex gap-2">
                <Input
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Enter image URL"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addToArray('images', newImage)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.images.length > 0 && (
                <div className="space-y-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <span className="flex-1 text-sm truncate">{image}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromArray('images', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Videos */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Videos
              </Label>
              <div className="flex gap-2">
                <Input
                  value={newVideo}
                  onChange={(e) => setNewVideo(e.target.value)}
                  placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addToArray('videos', newVideo)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.videos.length > 0 && (
                <div className="space-y-2">
                  {formData.videos.map((video, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <span className="flex-1 text-sm truncate">{video}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromArray('videos', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Floor Plans */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Floor Plans
              </Label>
              <div className="flex gap-2">
                <Input
                  value={newFloorPlan}
                  onChange={(e) => setNewFloorPlan(e.target.value)}
                  placeholder="Enter floor plan image URL"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addToArray('floorPlans', newFloorPlan)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.floorPlans.length > 0 && (
                <div className="space-y-2">
                  {formData.floorPlans.map((floorPlan, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <span className="flex-1 text-sm truncate">{floorPlan}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromArray('floorPlans', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactInfo.phone}
                  onChange={(e) => handleNestedInputChange('contactInfo', 'phone', e.target.value)}
                  placeholder="Enter contact phone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactInfo.email}
                  onChange={(e) => handleNestedInputChange('contactInfo', 'email', e.target.value)}
                  placeholder="Enter contact email"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? 'Update Listing' : 'Create Listing'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}