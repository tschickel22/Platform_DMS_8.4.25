import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Listing } from '@/types/listings'
import { mockInventory } from '@/mocks/inventoryMock'
import { mockListings } from '@/mocks/listingsMock'

interface ListingFormBasicInfoTabProps {
  formData: Partial<Listing>
  handleInputChange: (field: keyof Listing, value: any) => void
  associatedLandId: string
  setAssociatedLandId: (value: string) => void
  associatedInventoryId: string
  setAssociatedInventoryId: (value: string) => void
}

export default function ListingFormBasicInfoTab({
  formData,
  handleInputChange,
  associatedLandId,
  setAssociatedLandId,
  associatedInventoryId,
  setAssociatedInventoryId
}: ListingFormBasicInfoTabProps) {
  // Get available land listings
  const availableLandListings = mockListings.filter(
    listing => listing.propertyType === 'land' && listing.status === 'active'
  )

  // Get available inventory items
  const availableInventoryItems = (mockInventory.sampleInventory ?? []).filter(
    item => item.status === 'available'
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="listingType">Listing Type</Label>
          <Select value={formData.listingType} onValueChange={(value: 'rent' | 'sale') => handleInputChange('listingType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rent">For Rent</SelectItem>
              <SelectItem value="sale">For Sale</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="propertyType">Property Type</Label>
          <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="manufactured_home">Manufactured Home</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
              <SelectItem value="land">Land</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter listing title"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter detailed description"
          rows={4}
          required
        />
      </div>

      {formData.listingType === 'sale' && (
        <div>
          <Label htmlFor="termsOfSale">Terms of Sale</Label>
          <Textarea
            id="termsOfSale"
            value={formData.termsOfSale || ''}
            onChange={(e) => handleInputChange('termsOfSale', e.target.value)}
            placeholder="Enter terms of sale"
            rows={2}
          />
        </div>
      )}

      <div>
        <Label htmlFor="preferredTerm">Preferred Term</Label>
        <Input
          id="preferredTerm"
          value={formData.preferredTerm || ''}
          onChange={(e) => handleInputChange('preferredTerm', e.target.value)}
          placeholder="How to describe this property (e.g., Manufactured Home, Mobile Home)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input
            id="bedrooms"
            type="number"
            min="0"
            value={formData.bedrooms}
            onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
            required
          />
        </div>

        <div>
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input
            id="bathrooms"
            type="number"
            min="0"
            step="0.5"
            value={formData.bathrooms}
            onChange={(e) => handleInputChange('bathrooms', parseFloat(e.target.value) || 0)}
            required
          />
        </div>

        <div>
          <Label htmlFor="squareFootage">Square Footage</Label>
          <Input
            id="squareFootage"
            type="number"
            min="0"
            value={formData.squareFootage}
            onChange={(e) => handleInputChange('squareFootage', parseInt(e.target.value) || 0)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="yearBuilt">Year Built</Label>
        <Input
          id="yearBuilt"
          type="number"
          min="1800"
          max={new Date().getFullYear()}
          value={formData.yearBuilt || ''}
          onChange={(e) => handleInputChange('yearBuilt', parseInt(e.target.value) || undefined)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="petPolicy">Pet Policy</Label>
          <Input
            id="petPolicy"
            value={formData.petPolicy}
            onChange={(e) => handleInputChange('petPolicy', e.target.value)}
            placeholder="e.g., Pets allowed with deposit"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="packageType">Package Type</Label>
          <Input
            id="packageType"
            value={formData.packageType || ''}
            onChange={(e) => handleInputChange('packageType', e.target.value)}
            placeholder="e.g., Premium, Standard, Basic"
          />
        </div>

        <div>
          <Label htmlFor="searchResultsText">Search Results Text</Label>
          <Input
            id="searchResultsText"
            value={formData.searchResultsText || ''}
            onChange={(e) => handleInputChange('searchResultsText', e.target.value)}
            placeholder="Short text for search results"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isRepossessed"
          checked={formData.isRepossessed || false}
          onCheckedChange={(checked) => handleInputChange('isRepossessed', checked)}
        />
        <Label htmlFor="isRepossessed">This is a repossessed home</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="pendingSale"
          checked={formData.pendingSale || false}
          onCheckedChange={(checked) => handleInputChange('pendingSale', checked)}
        />
        <Label htmlFor="pendingSale">Pending sale in progress</Label>
      </div>

      {/* Associations Section */}
      <Separator />
      <div className="space-y-4">
        <h4 className="text-md font-semibold">Property Associations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Associated Land */}
          <div className="space-y-2">
            <Label htmlFor="associatedLand">Associated Land</Label>
            <Select value={associatedLandId} onValueChange={setAssociatedLandId}>
              <SelectTrigger>
                <SelectValue placeholder="Select land parcel (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No land association</SelectItem>
                {availableLandListings.map((land) => (
                  <SelectItem key={land.id} value={land.id}>
                    {land.title} - {land.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {associatedLandId && (
              <div className="text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  Land: {availableLandListings.find(l => l.id === associatedLandId)?.title}
                </Badge>
              </div>
            )}
          </div>

          {/* Associated Inventory */}
          <div className="space-y-2">
            <Label htmlFor="associatedInventory">Associated Inventory</Label>
            <Select value={associatedInventoryId} onValueChange={setAssociatedInventoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select inventory item (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No inventory association</SelectItem>
                {availableInventoryItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.year} {item.make} {item.model} ({item.stockNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {associatedInventoryId && (
              <div className="text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  Inventory: {availableInventoryItems.find(i => i.id === associatedInventoryId)?.stockNumber}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Association Info */}
        {(associatedLandId || associatedInventoryId) && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Association Summary:</strong>
              {associatedLandId && ` This property is associated with land parcel "${availableLandListings.find(l => l.id === associatedLandId)?.title}".`}
              {associatedInventoryId && ` This property is linked to inventory item "${availableInventoryItems.find(i => i.id === associatedInventoryId)?.stockNumber}".`}
              {associatedLandId && associatedInventoryId && ' Both associations will be maintained when the listing is saved.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}