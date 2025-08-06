import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, X, MapPin, DollarSign, Home, Bed, Bath, Square, Star, GripVertical, Eye } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { mockListings } from '@/mocks/listingsMock'

interface ListingFormData {
  title: string
  description: string
  address: string
  rent: number
  bedrooms: number
  bathrooms: number
  squareFootage: number
  propertyType: string
  status: string
  amenities: string[]
  petPolicy: string
  images: string[]
  contactInfo: {
    phone: string
    email: string
  }
}

export default function ListingForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    description: '',
    address: '',
    rent: 0,
    bedrooms: 1,
    bathrooms: 1,
    squareFootage: 0,
    propertyType: 'apartment',
    status: 'active',
    amenities: [],
    petPolicy: '',
    images: [],
    contactInfo: {
      phone: '',
      email: ''
    }
  })

  const [newAmenity, setNewAmenity] = useState('')
  const [newImage, setNewImage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isEditing && id) {
      const listing = mockListings.sampleListings.find(l => l.id === id)
      if (listing) {
        setFormData({
          title: listing.title,
          description: listing.description,
          address: listing.address,
          rent: listing.rent,
          bedrooms: listing.bedrooms,
          bathrooms: listing.bathrooms,
          squareFootage: listing.squareFootage,
          propertyType: listing.propertyType,
          status: listing.status,
          amenities: [...listing.amenities],
          petPolicy: listing.petPolicy,
          images: [...listing.images],
          contactInfo: { ...listing.contactInfo }
        })
      }
    }
  }, [isEditing, id])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }
    if (formData.rent <= 0) {
      newErrors.rent = 'Rent must be greater than 0'
    }
    if (formData.squareFootage <= 0) {
      newErrors.squareFootage = 'Square footage must be greater than 0'
    }
    if (!formData.contactInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    if (!formData.contactInfo.email.trim()) {
      newErrors.email = 'Email is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive"
      })
      return
    }

    // In a real app, this would make an API call
    toast({
      title: "Success",
      description: isEditing ? "Listing updated successfully" : "Listing created successfully",
    })
    
    navigate('/listings')
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }))
      setNewAmenity('')
    }
  }

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }))
  }

  const addImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }))
      setNewImage('')
    }
  }

  const removeImage = (image: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== image)
    }))
  }

  const handleSetCoverImage = (index: number) => {
    const newImages = [...formData.images]
    const [coverImage] = newImages.splice(index, 1)
    newImages.unshift(coverImage)
    setFormData({ ...formData, images: newImages })
  }

  const handleMoveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...formData.images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    setFormData({ ...formData, images: newImages })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/listings')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Listings
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Edit Listing' : 'Add New Listing'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update the listing information' : 'Create a new property listing'}
          </p>
        </div>
      </div>

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
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Modern Downtown Apartment"
                />
                {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type</Label>
                <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="e.g., 123 Main St, Downtown, City 12345"
              />
              {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the property features, location, and amenities..."
                rows={4}
              />
              {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
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
                  onChange={(e) => handleInputChange('rent', parseInt(e.target.value) || 0)}
                  placeholder="2500"
                />
                {errors.rent && <p className="text-sm text-red-600">{errors.rent}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 1)}
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
                  onChange={(e) => handleInputChange('bathrooms', parseFloat(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="squareFootage">Square Footage *</Label>
                <Input
                  id="squareFootage"
                  type="number"
                  value={formData.squareFootage}
                  onChange={(e) => handleInputChange('squareFootage', parseInt(e.target.value) || 0)}
                  placeholder="1200"
                />
                {errors.squareFootage && <p className="text-sm text-red-600">{errors.squareFootage}</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
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
            <div className="flex gap-2">
              <Input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add amenity (e.g., Pool, Gym, Parking)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
              />
              <Button type="button" onClick={addAmenity}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                  <span className="text-sm">{amenity}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAmenity(amenity)}
                    className="h-4 w-4 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
            <CardDescription>Add property images (URLs)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="Add image URL"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
              />
              <Button type="button" onClick={addImage}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Image Previews with Management */}
            {formData.images.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Property Images</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.images.length} image{formData.images.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="grid gap-4">
                  {formData.images.map((image, index) => (
                    <div 
                      key={index} 
                      className={`relative group border rounded-lg overflow-hidden ${
                        index === 0 ? 'ring-2 ring-yellow-400 bg-yellow-50' : 'bg-card'
                      }`}
                    >
                      {/* Cover Image Badge */}
                      {index === 0 && (
                        <div className="absolute top-2 left-2 z-10">
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            Cover Image
                          </Badge>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3 p-3">
                        {/* Drag Handle */}
                        <div className="flex-shrink-0 cursor-move text-muted-foreground hover:text-foreground">
                          <GripVertical className="h-4 w-4" />
                        </div>
                        
                        {/* Image Preview */}
                        <div className="flex-shrink-0">
                          <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
                            <img
                              src={image}
                              alt={`Property image ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = '<div class="w-full h-full bg-muted flex items-center justify-center"><span class="text-xs text-muted-foreground">No preview</span></div>';
                                }
                              }}
                            />
                          </div>
                        </div>
                        
                        {/* Image URL */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            Image {index + 1}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {image}
                          </p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Preview Button */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(image, '_blank')}
                            title="Preview image"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {/* Set as Cover Button */}
                          {index !== 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetCoverImage(index)}
                              title="Set as cover image"
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {/* Move Up Button */}
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveImage(index, index - 1)}
                              title="Move up"
                            >
                              ↑
                            </Button>
                          )}
                          
                          {/* Move Down Button */}
                          {index < formData.images.length - 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveImage(index, index + 1)}
                              title="Move down"
                            >
                              ↓
                            </Button>
                          )}
                          
                          {/* Remove Button */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImage(image)}
                            className="text-destructive hover:text-destructive"
                            title="Remove image"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {formData.images.length > 0 && (
                  <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
                    <p className="font-medium mb-1">Image Management Tips:</p>
                    <ul className="space-y-1">
                      <li>• The first image is automatically set as the cover image</li>
                      <li>• Use the star button to set a different cover image</li>
                      <li>• Use the arrows or drag handle to reorder images</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {/* Cover Image Preview */}
            {formData.images.length > 0 && (
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="text-sm font-medium">Cover Image Preview:</div>
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                  {formData.images.length > 0 ? (
                    <img 
                      src={formData.images[0]} 
                      alt="Cover preview"
                      className="h-full w-full object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <Home className={`h-6 w-6 text-gray-400 ${formData.images.length > 0 ? 'hidden' : ''}`} />
                </div>
              </div>
            )}
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
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.contactInfo.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
                {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.contactInfo.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  placeholder="contact@example.com"
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            {isEditing ? 'Update Listing' : 'Create Listing'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/listings')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}