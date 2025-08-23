import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MHInventoryFormProps {
  initialData?: any
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
}

export default function MHInventoryForm({ initialData = {}, onSubmit, onCancel }: MHInventoryFormProps) {
  const [formData, setFormData] = useState({
    type: 'MH',
    year: initialData.year || new Date().getFullYear(),
    make: initialData.make || '',
    model: initialData.model || '',
    serialNumber: initialData.serialNumber || '',
    condition: initialData.condition || 'new',
    status: initialData.status || 'available',
    askingPrice: initialData.askingPrice || initialData.price || 0,
    rentPrice: initialData.rentPrice || 0,
    offerType: initialData.offerType || 'for_sale',
    bedrooms: initialData.bedrooms || 2,
    bathrooms: initialData.bathrooms || 1,
    squareFootage: initialData.dimensions?.squareFootage || initialData.squareFootage || 0,
    width_ft: initialData.dimensions?.width_ft || initialData.width_ft || 14,
    length_ft: initialData.dimensions?.length_ft || initialData.length_ft || 60,
    sections: initialData.dimensions?.sections || initialData.sections || 1,
    description: initialData.description || '',
    city: initialData.location?.city || initialData.city || '',
    state: initialData.location?.state || initialData.state || '',
    postalCode: initialData.location?.postalCode || initialData.postalCode || '',
    communityName: initialData.location?.communityName || initialData.communityName || '',
    ...initialData
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({
        ...formData,
        price: formData.askingPrice, // Map askingPrice to price for consistency
        dimensions: {
          squareFootage: formData.squareFootage,
          width_ft: formData.width_ft,
          length_ft: formData.length_ft,
          sections: formData.sections
        },
        location: {
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          communityName: formData.communityName
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
                placeholder="e.g., Clayton, Champion, Fleetwood"
              />
            </div>

            <div>
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => updateField('model', e.target.value)}
                placeholder="e.g., The Edge, Titan, Berkshire"
              />
            </div>

            <div>
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) => updateField('serialNumber', e.target.value)}
                placeholder="Manufactured Home Serial Number"
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

        {/* Home Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Home Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => updateField('bedrooms', parseInt(e.target.value))}
                  min="1"
                  max="10"
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => updateField('bathrooms', parseFloat(e.target.value))}
                  min="1"
                  max="5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="squareFootage">Square Footage</Label>
              <Input
                id="squareFootage"
                type="number"
                value={formData.squareFootage}
                onChange={(e) => updateField('squareFootage', parseInt(e.target.value))}
                min="400"
                max="5000"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="width_ft">Width (ft)</Label>
                <Input
                  id="width_ft"
                  type="number"
                  value={formData.width_ft}
                  onChange={(e) => updateField('width_ft', parseInt(e.target.value))}
                  min="12"
                  max="32"
                />
              </div>
              <div>
                <Label htmlFor="length_ft">Length (ft)</Label>
                <Input
                  id="length_ft"
                  type="number"
                  value={formData.length_ft}
                  onChange={(e) => updateField('length_ft', parseInt(e.target.value))}
                  min="40"
                  max="100"
                />
              </div>
              <div>
                <Label htmlFor="sections">Sections</Label>
                <Select value={formData.sections.toString()} onValueChange={(v) => updateField('sections', parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Single Wide</SelectItem>
                    <SelectItem value="2">Double Wide</SelectItem>
                    <SelectItem value="3">Triple Wide</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              <Label htmlFor="askingPrice">Sale Price</Label>
              <Input
                id="askingPrice"
                type="number"
                value={formData.askingPrice}
                onChange={(e) => updateField('askingPrice', parseFloat(e.target.value))}
                min="0"
                step="1000"
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

            <div>
              <Label htmlFor="communityName">Community Name</Label>
              <Input
                id="communityName"
                value={formData.communityName}
                onChange={(e) => updateField('communityName', e.target.value)}
                placeholder="Mobile Home Community"
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
            placeholder="Detailed description of the manufactured home..."
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
          {loading ? 'Saving...' : 'Save Home'}
        </Button>
      </div>
    </form>
  )
}