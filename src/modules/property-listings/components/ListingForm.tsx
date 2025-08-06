import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, X, Plus, Upload, Share2 } from 'lucide-react'
import { getListingById, addListing, updateListing } from '@/mocks/listingsMock'
import { useToast } from '@/hooks/use-toast'

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'rv-site', label: 'RV Site' },
  { value: 'mobile-home-lot', label: 'Mobile Home Lot' }
]

const statusOptions = [
  { value: 'active', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'maintenance', label: 'Under Maintenance' },
  { value: 'inactive', label: 'Inactive' }
]

const commonAmenities = [
  'Pool', 'Gym', 'Parking', 'Laundry', 'Balcony', 'Garage', 'Backyard', 
  'Fireplace', 'Dishwasher', 'Air Conditioning', 'Heating', 'WiFi',
  'Pet Friendly', 'Furnished', 'Utilities Included', 'Security System'
]
import ShareListingModal from './ShareListingModal'

export default function ListingForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const isEditing = Boolean(id)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    rent: '',
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    propertyType: '',
    status: 'active',
    petPolicy: '',
    amenities: [] as string[],
    images: [''],
    contactInfo: {
      phone: '',
      email: ''
    }
  })

  const [newAmenity, setNewAmenity] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEditing && id) {
      const listing = getListingById(id)
      if (listing) {
        setFormData({
          title: listing.title,
          description: listing.description,
          address: listing.address,
          rent: listing.rent.toString(),
          bedrooms: listing.bedrooms.toString(),
          bathrooms: listing.bathrooms.toString(),
          squareFootage: listing.squareFootage.toString(),
          propertyType: listing.propertyType,
          status: listing.status,
          petPolicy: listing.petPolicy,
          amenities: listing.amenities,
          images: listing.images.length > 0 ? listing.images : [''],
          contactInfo: listing.contactInfo
        })
      } else {
        toast({
          title: "Error",
          description: "Listing not found",
          variant: "destructive"
        })
        navigate('/listings')
      }
    }
  }, [id, isEditing, navigate, toast])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }))
  }

  const handleImageChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }))
  }

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }))
  }

  const removeImageField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const addAmenity = (amenity: string) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }))
    }
    setNewAmenity('')
  }

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const listingData = {
        title: formData.title,
        description: formData.description,
        address: formData.address,
        rent: parseFloat(formData.rent),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        squareFootage: parseInt(formData.squareFootage),
        propertyType: formData.propertyType,
        status: formData.status,
        petPolicy: formData.petPolicy,
        amenities: formData.amenities,
        images: formData.images.filter(img => img.trim() !== ''),
        contactInfo: formData.contactInfo
      }

      if (isEditing && id) {
        const updated = updateListing(id, listingData)
        if (updated) {
          toast({
            title: "Success",
            description: "Listing updated successfully"
          })
        } else {
          throw new Error('Failed to update listing')
        }
      } else {
        const created = addListing(listingData)
        if (created) {
          toast({
            title: "Success",
            description: "Listing created successfully"
          })
        } else {
          throw new Error('Failed to create listing')
        }
      }

      navigate('/listings')
    } catch (error) {
      toast({
        title: "Error",
        description: isEditing ? "Failed to update listing" : "Failed to create listing",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/listings')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Listings
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? 'Edit Listing' : 'Add New Listing'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update property listing details' : 'Create a new property listing'}
          </p>
        </div>
      </div>

      {/* Share Modal - Only show when editing existing listing */}
      {isEditing && (
        <ShareListingModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          listingUrl={`/public-listings/${id}`}
          title={`Share "${formData.title || 'Listing'}"`}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the basic details of the property</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Modern Downtown Apartment"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the property features and highlights..."
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="e.g., 123 Main St, City, State 12345"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
            <CardDescription>Specify the property specifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="rent">Monthly Rent ($) *</Label>
                <Input
                  id="rent"
                  type="number"
                  value={formData.rent}
                  onChange={(e) => handleInputChange('rent', e.target.value)}
                  placeholder="2500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms *</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  placeholder="2"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms *</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  placeholder="2"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="squareFootage">Square Footage *</Label>
                <Input
                  id="squareFootage"
                  type="number"
                  value={formData.squareFootage}
                  onChange={(e) => handleInputChange('squareFootage', e.target.value)}
                  placeholder="1200"
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="petPolicy">Pet Policy</Label>
                <Input
                  id="petPolicy"
                  value={formData.petPolicy}
                  onChange={(e) => handleInputChange('petPolicy', e.target.value)}
                  placeholder="e.g., Cats allowed with deposit"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
            <CardDescription>Add property amenities and features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {commonAmenities.map(amenity => (
                <Button
                  key={amenity}
                  type="button"
                  variant={formData.amenities.includes(amenity) ? "default" : "outline"}
                  size="sm"
                  onClick={() => formData.amenities.includes(amenity) ? removeAmenity(amenity) : addAmenity(amenity)}
                >
                  {amenity}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add custom amenity..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity(newAmenity))}
              />
              <Button type="button" onClick={() => addAmenity(newAmenity)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map(amenity => (
                  <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                    {amenity}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeAmenity(amenity)} />
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Property Images</CardTitle>
            <CardDescription>Add image URLs for the property</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.images.length > 1 && (
                  <Button type="button" variant="outline" size="sm" onClick={() => removeImageField(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          <div className="flex gap-2 flex-wrap">
            {isEditing && (
              <Button
                variant="outline"
                onClick={() => setShareModalOpen(true)}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            )}
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Contact details for inquiries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.contactInfo.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.contactInfo.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  placeholder="contact@example.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (isEditing ? 'Update Listing' : 'Create Listing')}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/listings')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}