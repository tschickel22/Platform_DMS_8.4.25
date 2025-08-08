import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { MapPin } from 'lucide-react'
import { Listing } from '@/types/listings'

interface ListingFormLocationTabProps {
  formData: Partial<Listing>
  handleInputChange: (field: keyof Listing, value: any) => void
}

export default function ListingFormLocationTab({
  formData,
  handleInputChange
}: ListingFormLocationTabProps) {
  return (
    <div className="space-y-4">
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
    </div>
  )
}