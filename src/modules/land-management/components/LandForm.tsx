import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { useLandManagement } from '../hooks/useLandManagement'
import { useToast } from '@/hooks/use-toast'

export default function LandForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { addLand, updateLand, getLandById } = useLandManagement()
  const { toast } = useToast()
  
  const isEditing = Boolean(id)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    size: '',
    price: '',
    type: '',
    status: 'available',
    description: '',
    amenities: [] as string[],
    zoning: '',
    utilities: '',
    access: '',
    soilType: '',
    waterRights: '',
    restrictions: ''
  })

  const [newAmenity, setNewAmenity] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isEditing && id) {
      const land = getLandById(id)
      if (land) {
        setFormData({
          name: land.name,
          location: land.location,
          size: land.size.toString(),
          price: land.price.toString(),
          type: land.type,
          status: land.status,
          description: land.description || '',
          amenities: land.amenities || [],
          zoning: land.zoning || '',
          utilities: land.utilities || '',
          access: land.access || '',
          soilType: land.soilType || '',
          waterRights: land.waterRights || '',
          restrictions: land.restrictions || ''
        })
      }
    }
  }, [id, isEditing, getLandById])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.size.trim()) newErrors.size = 'Size is required'
    else if (isNaN(Number(formData.size)) || Number(formData.size) <= 0) {
      newErrors.size = 'Size must be a positive number'
    }
    if (!formData.price.trim()) newErrors.price = 'Price is required'
    else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number'
    }
    if (!formData.type) newErrors.type = 'Type is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const landData = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        size: Number(formData.size),
        price: Number(formData.price),
        type: formData.type,
        status: formData.status as 'available' | 'pending' | 'sold' | 'reserved',
        description: formData.description.trim(),
        amenities: formData.amenities,
        zoning: formData.zoning.trim(),
        utilities: formData.utilities.trim(),
        access: formData.access.trim(),
        soilType: formData.soilType.trim(),
        waterRights: formData.waterRights.trim(),
        restrictions: formData.restrictions.trim()
      }

      if (isEditing && id) {
        await updateLand(id, landData)
        toast({
          title: "Success",
          description: "Land parcel updated successfully.",
        })
      } else {
        await addLand(landData)
        toast({
          title: "Success",
          description: "Land parcel added successfully.",
        })
      }

      navigate('/land')
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'add'} land parcel.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/land">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Edit Land Parcel' : 'Add New Land Parcel'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update land parcel information' : 'Add a new land parcel to your inventory'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Essential details about the land parcel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Sunset Ridge Parcel A"
                />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., 123 Main St, City, State"
                />
                {errors.location && <p className="text-sm text-destructive mt-1">{errors.location}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="size">Size (acres) *</Label>
                  <Input
                    id="size"
                    type="number"
                    step="0.1"
                    value={formData.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    placeholder="2.5"
                  />
                  {errors.size && <p className="text-sm text-destructive mt-1">{errors.size}</p>}
                </div>

                <div>
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="125000"
                  />
                  {errors.price && <p className="text-sm text-destructive mt-1">{errors.price}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Agricultural">Agricultural</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                      <SelectItem value="Recreational">Recreational</SelectItem>
                      <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-destructive mt-1">{errors.type}</p>}
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the land parcel..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>
                Detailed information about the land
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="zoning">Zoning</Label>
                <Input
                  id="zoning"
                  value={formData.zoning}
                  onChange={(e) => handleInputChange('zoning', e.target.value)}
                  placeholder="e.g., R-1, C-2, A-1"
                />
              </div>

              <div>
                <Label htmlFor="utilities">Utilities</Label>
                <Input
                  id="utilities"
                  value={formData.utilities}
                  onChange={(e) => handleInputChange('utilities', e.target.value)}
                  placeholder="e.g., Electric, Water, Sewer"
                />
              </div>

              <div>
                <Label htmlFor="access">Access</Label>
                <Input
                  id="access"
                  value={formData.access}
                  onChange={(e) => handleInputChange('access', e.target.value)}
                  placeholder="e.g., Paved road, Gravel road"
                />
              </div>

              <div>
                <Label htmlFor="soilType">Soil Type</Label>
                <Input
                  id="soilType"
                  value={formData.soilType}
                  onChange={(e) => handleInputChange('soilType', e.target.value)}
                  placeholder="e.g., Clay, Sandy, Loam"
                />
              </div>

              <div>
                <Label htmlFor="waterRights">Water Rights</Label>
                <Input
                  id="waterRights"
                  value={formData.waterRights}
                  onChange={(e) => handleInputChange('waterRights', e.target.value)}
                  placeholder="e.g., Well rights, Creek access"
                />
              </div>

              <div>
                <Label htmlFor="restrictions">Restrictions</Label>
                <Textarea
                  id="restrictions"
                  value={formData.restrictions}
                  onChange={(e) => handleInputChange('restrictions', e.target.value)}
                  placeholder="Any restrictions or covenants..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
            <CardDescription>
              Add features and amenities of the land parcel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Add an amenity..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                />
                <Button type="button" onClick={addAmenity}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-1 bg-secondary px-3 py-1 rounded-full">
                      <span className="text-sm">{amenity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAmenity(amenity)}
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/land')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (isEditing ? 'Update Land Parcel' : 'Add Land Parcel')}
          </Button>
        </div>
      </form>
    </div>
  )
}