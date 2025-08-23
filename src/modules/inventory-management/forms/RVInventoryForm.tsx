import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RVInventoryFormProps {
  initialData?: any
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
}

export default function RVInventoryForm({ initialData = {}, onSubmit, onCancel }: RVInventoryFormProps) {
  const [formData, setFormData] = useState({
    type: 'RV',
    year: initialData.year || initialData.modelDate || new Date().getFullYear(),
    make: initialData.make || initialData.brand || '',
    model: initialData.model || '',
    vin: initialData.vin || initialData.vehicleIdentificationNumber || '',
    condition: initialData.condition || 'new',
    status: initialData.status || 'available',
    price: initialData.price || initialData.salePrice || 0,
    rentPrice: initialData.rentPrice || 0,
    offerType: initialData.offerType || 'for_sale',
    sleeps: initialData.sleeps || 4,
    slides: initialData.slides || 0,
    length: initialData.length || 0,
    fuelType: initialData.fuelType || 'gasoline',
    engine: initialData.engine || '',
    transmission: initialData.transmission || 'automatic',
    odometerMiles: initialData.odometerMiles || 0,
    description: initialData.description || '',
    city: initialData.location?.city || initialData.city || '',
    state: initialData.location?.state || initialData.state || '',
    postalCode: initialData.location?.postalCode || initialData.postalCode || '',
    ...initialData
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({
        ...formData,
        location: {
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => updateField('year', parseInt(e.target.value))}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>
              <div>
                <Label htmlFor="condition">Condition</Label>
                <Select value={formData.condition} onValueChange={(v) => updateField('condition', v)}>
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

            <div>
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => updateField('make', e.target.value)}
                placeholder="e.g., Forest River, Jayco, Thor"
              />
            </div>

            <div>
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => updateField('model', e.target.value)}
                placeholder="e.g., Cherokee, Jay Flight, Ace"
              />
            </div>

            <div>
              <Label htmlFor="vin">VIN</Label>
              <Input
                id="vin"
                value={formData.vin}
                onChange={(e) => updateField('vin', e.target.value)}
                placeholder="Vehicle Identification Number"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(v) => updateField('status', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* RV Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>RV Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sleeps">Sleeps</Label>
                <Input
                  id="sleeps"
                  type="number"
                  value={formData.sleeps}
                  onChange={(e) => updateField('sleeps', parseInt(e.target.value))}
                  min="1"
                  max="20"
                />
              </div>
              <div>
                <Label htmlFor="slides">Slides</Label>
                <Input
                  id="slides"
                  type="number"
                  value={formData.slides}
                  onChange={(e) => updateField('slides', parseInt(e.target.value))}
                  min="0"
                  max="10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="length">Length (ft)</Label>
              <Input
                id="length"
                type="number"
                step="0.1"
                value={formData.length}
                onChange={(e) => updateField('length', parseFloat(e.target.value))}
                min="10"
                max="50"
              />
            </div>

            <div>
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select value={formData.fuelType} onValueChange={(v) => updateField('fuelType', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasoline">Gasoline</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="engine">Engine</Label>
              <Input
                id="engine"
                value={formData.engine}
                onChange={(e) => updateField('engine', e.target.value)}
                placeholder="e.g., Ford V10, Cummins ISL"
              />
            </div>

            <div>
              <Label htmlFor="transmission">Transmission</Label>
              <Select value={formData.transmission} onValueChange={(v) => updateField('transmission', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="odometerMiles">Odometer (miles)</Label>
              <Input
                id="odometerMiles"
                type="number"
                value={formData.odometerMiles}
                onChange={(e) => updateField('odometerMiles', parseInt(e.target.value))}
                min="0"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing and Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="offerType">Offer Type</Label>
              <Select value={formData.offerType} onValueChange={(v) => updateField('offerType', v)}>
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

            <div>
              <Label htmlFor="price">Sale Price</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => updateField('price', parseFloat(e.target.value))}
                min="0"
                step="100"
              />
            </div>

            {(formData.offerType === 'for_rent' || formData.offerType === 'both') && (
              <div>
                <Label htmlFor="rentPrice">Rent Price (monthly)</Label>
                <Input
                  id="rentPrice"
                  type="number"
                  value={formData.rentPrice}
                  onChange={(e) => updateField('rentPrice', parseFloat(e.target.value))}
                  min="0"
                  step="50"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="City"
              />
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => updateField('state', e.target.value)}
                placeholder="State"
              />
            </div>

            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => updateField('postalCode', e.target.value)}
                placeholder="Postal Code"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Detailed description of the RV..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save RV'}
        </Button>
      </div>
    </form>
  )
}