import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function LandForm({ initialData, onSave, onCancel }) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    size: '',
    price: '',
    status: 'available',
    type: 'Residential',
    description: '',
    amenities: [],
    zoning: ''
  })
  const [newAmenity, setNewAmenity] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        location: initialData.location || '',
        size: initialData.size?.toString() || '',
        price: initialData.price?.toString() || '',
        status: initialData.status || 'available',
        type: initialData.type || 'Residential',
        description: initialData.description || '',
        amenities: initialData.amenities || [],
        zoning: initialData.zoning || ''
      })
    }
  }, [initialData])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }))
      setNewAmenity('')
    }
  }

  const handleRemoveAmenity = (amenityToRemove) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(amenity => amenity !== amenityToRemove)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Land name is required",
        variant: "destructive",
      })
      return
    }
    
    if (!formData.location.trim()) {
      toast({
        title: "Validation Error",
        description: "Location is required",
        variant: "destructive",
      })
      return
    }
    
    if (!formData.size || parseFloat(formData.size) <= 0) {
      toast({
        title: "Validation Error",
        description: "Valid size is required",
        variant: "destructive",
      })
      return
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast({
        title: "Validation Error",
        description: "Valid price is required",
        variant: "destructive",
      })
      return
    }

    try {
      const landData = {
        ...formData,
        size: parseFloat(formData.size),
        price: parseFloat(formData.price)
      }
      
      await onSave(landData)
    } catch (error) {
      console.error('Error saving land:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Land Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter land parcel name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="Enter location address"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="size">Size (acres) *</Label>
          <Input
            id="size"
            type="number"
            step="0.01"
            min="0"
            value={formData.size}
            onChange={(e) => handleInputChange('size', e.target.value)}
            placeholder="Enter size in acres"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($) *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            placeholder="Enter price"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select land type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Residential">Residential</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
              <SelectItem value="Agricultural">Agricultural</SelectItem>
              <SelectItem value="Industrial">Industrial</SelectItem>
              <SelectItem value="Mixed Use">Mixed Use</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zoning">Zoning</Label>
          <Input
            id="zoning"
            value={formData.zoning}
            onChange={(e) => handleInputChange('zoning', e.target.value)}
            placeholder="Enter zoning classification"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter land description"
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <Label>Amenities</Label>
        <div className="flex gap-2">
          <Input
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            placeholder="Add amenity"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddAmenity()
              }
            }}
          />
          <Button type="button" onClick={handleAddAmenity} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.amenities.map((amenity, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {amenity}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleRemoveAmenity(amenity)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit">
          {initialData ? 'Update Land Parcel' : 'Add Land Parcel'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}