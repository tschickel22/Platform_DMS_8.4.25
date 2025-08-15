import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save } from 'lucide-react'
import { useInventoryManagement } from '../hooks/useInventoryManagement'
import { VehicleFormData } from '../types'
import { useToast } from '@/hooks/use-toast'

export function VehicleForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getVehicle, createVehicle, updateVehicle } = useInventoryManagement()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const isEditing = !!id
  const vehicle = isEditing ? getVehicle(id) : null

  const [formData, setFormData] = useState<VehicleFormData>({
    listingType: 'rv',
    year: new Date().getFullYear(),
    make: '',
    model: '',
    condition: 'new',
    offerType: 'for_sale',
    status: 'available',
    city: '',
    state: ''
  })

  // Load vehicle data for editing
  useEffect(() => {
    if (isEditing && vehicle) {
      setFormData({
        listingType: vehicle.listingType,
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        vin: vehicle.vin,
        serialNumber: vehicle.serialNumber,
        condition: vehicle.condition,
        salePrice: vehicle.salePrice,
        rentPrice: vehicle.rentPrice,
        offerType: vehicle.offerType,
        status: vehicle.status,
        sleeps: vehicle.sleeps,
        slides: vehicle.slides,
        length: vehicle.length,
        fuelType: vehicle.fuelType,
        engine: vehicle.engine,
        transmission: vehicle.transmission,
        odometerMiles: vehicle.odometerMiles,
        bedrooms: vehicle.bedrooms,
        bathrooms: vehicle.bathrooms,
        squareFeet: vehicle.dimensions?.squareFeet,
        sections: vehicle.dimensions?.sections,
        city: vehicle.location.city,
        state: vehicle.location.state,
        postalCode: vehicle.location.postalCode,
        communityName: vehicle.location.communityName,
        primaryPhoto: vehicle.media?.primaryPhoto,
        photos: vehicle.media?.photos,
        features: vehicle.features,
        description: vehicle.description,
        searchResultsText: vehicle.searchResultsText,
        notes: vehicle.notes
      })
    }
  }, [isEditing, vehicle])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEditing && id) {
        await updateVehicle(id, formData)
      } else {
        await createVehicle(formData)
      }
      
      navigate('/inventory')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save vehicle',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (updates: Partial<VehicleFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/inventory')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inventory
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? 'Edit Vehicle' : 'Add Vehicle'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update vehicle information' : 'Add a new vehicle to your inventory'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details for this vehicle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="listingType">Vehicle Type</Label>
                <select
                  id="listingType"
                  value={formData.listingType}
                  onChange={(e) => updateFormData({ listingType: e.target.value as 'rv' | 'manufactured_home' })}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  required
                >
                  <option value="rv">RV</option>
                  <option value="manufactured_home">Manufactured Home</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => updateFormData({ year: parseInt(e.target.value) })}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  value={formData.make}
                  onChange={(e) => updateFormData({ make: e.target.value })}
                  placeholder="Forest River"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => updateFormData({ model: e.target.value })}
                  placeholder="Cherokee"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="vin">VIN/Serial Number</Label>
                <Input
                  id="vin"
                  value={formData.vin || formData.serialNumber || ''}
                  onChange={(e) => {
                    if (formData.listingType === 'rv') {
                      updateFormData({ vin: e.target.value })
                    } else {
                      updateFormData({ serialNumber: e.target.value })
                    }
                  }}
                  placeholder={formData.listingType === 'rv' ? 'Enter VIN' : 'Enter serial number'}
                />
              </div>
              
              <div>
                <Label htmlFor="condition">Condition</Label>
                <select
                  id="condition"
                  value={formData.condition}
                  onChange={(e) => updateFormData({ condition: e.target.value as 'new' | 'used' })}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  required
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>
              Set the pricing and offer type for this vehicle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="offerType">Offer Type</Label>
              <select
                id="offerType"
                value={formData.offerType}
                onChange={(e) => updateFormData({ offerType: e.target.value as any })}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                required
              >
                <option value="for_sale">For Sale</option>
                <option value="for_rent">For Rent</option>
                <option value="both">Both Sale & Rent</option>
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {(formData.offerType === 'for_sale' || formData.offerType === 'both') && (
                <div>
                  <Label htmlFor="salePrice">Sale Price</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    value={formData.salePrice || ''}
                    onChange={(e) => updateFormData({ salePrice: parseFloat(e.target.value) || undefined })}
                    placeholder="45000"
                  />
                </div>
              )}
              
              {(formData.offerType === 'for_rent' || formData.offerType === 'both') && (
                <div>
                  <Label htmlFor="rentPrice">Rent Price (Monthly)</Label>
                  <Input
                    id="rentPrice"
                    type="number"
                    value={formData.rentPrice || ''}
                    onChange={(e) => updateFormData({ rentPrice: parseFloat(e.target.value) || undefined })}
                    placeholder="1200"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Type-specific fields */}
        {formData.listingType === 'rv' ? (
          <Card>
            <CardHeader>
              <CardTitle>RV Specifications</CardTitle>
              <CardDescription>
                Enter RV-specific details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="sleeps">Sleeps</Label>
                  <Input
                    id="sleeps"
                    type="number"
                    value={formData.sleeps || ''}
                    onChange={(e) => updateFormData({ sleeps: parseInt(e.target.value) || undefined })}
                    placeholder="6"
                  />
                </div>
                
                <div>
                  <Label htmlFor="length">Length (ft)</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.1"
                    value={formData.length || ''}
                    onChange={(e) => updateFormData({ length: parseFloat(e.target.value) || undefined })}
                    placeholder="28.5"
                  />
                </div>
                
                <div>
                  <Label htmlFor="slides">Slides</Label>
                  <Input
                    id="slides"
                    type="number"
                    value={formData.slides || ''}
                    onChange={(e) => updateFormData({ slides: parseInt(e.target.value) || undefined })}
                    placeholder="1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Manufactured Home Specifications</CardTitle>
              <CardDescription>
                Enter manufactured home-specific details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms || ''}
                    onChange={(e) => updateFormData({ bedrooms: parseInt(e.target.value) || undefined })}
                    placeholder="3"
                  />
                </div>
                
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    step="0.5"
                    value={formData.bathrooms || ''}
                    onChange={(e) => updateFormData({ bathrooms: parseFloat(e.target.value) || undefined })}
                    placeholder="2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="squareFeet">Square Feet</Label>
                  <Input
                    id="squareFeet"
                    type="number"
                    value={formData.squareFeet || ''}
                    onChange={(e) => updateFormData({ squareFeet: parseInt(e.target.value) || undefined })}
                    placeholder="1450"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
            <CardDescription>
              Where is this vehicle located?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateFormData({ city: e.target.value })}
                  placeholder="Austin"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => updateFormData({ state: e.target.value })}
                  placeholder="TX"
                  maxLength={2}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode || ''}
                  onChange={(e) => updateFormData({ postalCode: e.target.value })}
                  placeholder="78701"
                />
              </div>
              
              {formData.listingType === 'manufactured_home' && (
                <div>
                  <Label htmlFor="communityName">Community Name</Label>
                  <Input
                    id="communityName"
                    value={formData.communityName || ''}
                    onChange={(e) => updateFormData({ communityName: e.target.value })}
                    placeholder="Sunset Mobile Home Park"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
            <CardDescription>
              Provide a detailed description of this vehicle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => updateFormData({ description: e.target.value })}
                placeholder="Enter a detailed description of the vehicle..."
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="searchResultsText">Search Results Text</Label>
              <Input
                id="searchResultsText"
                value={formData.searchResultsText || ''}
                onChange={(e) => updateFormData({ searchResultsText: e.target.value })}
                placeholder="2024 Forest River Cherokee - 28ft Travel Trailer"
                maxLength={80}
              />
              <p className="text-xs text-muted-foreground mt-1">
                This text appears in search results (max 80 characters)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => navigate('/inventory')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : isEditing ? 'Update Vehicle' : 'Save Vehicle'}
          </Button>
        </div>
      </form>
    </div>
  )
}