import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { DollarSign } from 'lucide-react'
import { Listing } from '@/types/listings'

interface ListingFormPricingTabProps {
  formData: Partial<Listing>
  handleInputChange: (field: keyof Listing, value: any) => void
}

export default function ListingFormPricingTab({
  formData,
  handleInputChange
}: ListingFormPricingTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Pricing Information</h3>
      </div>

      {formData.listingType === 'rent' ? (
        <div>
          <Label htmlFor="rent">Monthly Rent</Label>
          <Input
            id="rent"
            type="number"
            min="0"
            value={formData.rent || ''}
            onChange={(e) => handleInputChange('rent', parseInt(e.target.value) || undefined)}
            placeholder="Enter monthly rent"
            required
          />
        </div>
      ) : (
        <div>
          <Label htmlFor="purchasePrice">Purchase Price</Label>
          <Input
            id="purchasePrice"
            type="number"
            min="0"
            value={formData.purchasePrice || ''}
            onChange={(e) => handleInputChange('purchasePrice', parseInt(e.target.value) || undefined)}
            placeholder="Enter purchase price"
            required
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="lotRent">Monthly Lot Rent</Label>
          <Input
            id="lotRent"
            type="number"
            min="0"
            value={formData.lotRent || ''}
            onChange={(e) => handleInputChange('lotRent', parseInt(e.target.value) || undefined)}
            placeholder="Enter lot rent"
          />
        </div>

        <div>
          <Label htmlFor="hoaFees">HOA Fees</Label>
          <Input
            id="hoaFees"
            type="number"
            min="0"
            value={formData.hoaFees || ''}
            onChange={(e) => handleInputChange('hoaFees', parseInt(e.target.value) || undefined)}
            placeholder="Enter HOA fees"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="monthlyTax">Monthly Tax</Label>
          <Input
            id="monthlyTax"
            type="number"
            min="0"
            value={formData.monthlyTax || ''}
            onChange={(e) => handleInputChange('monthlyTax', parseInt(e.target.value) || undefined)}
            placeholder="Enter monthly tax"
          />
        </div>

        <div>
          <Label htmlFor="monthlyUtilities">Monthly Utilities</Label>
          <Input
            id="monthlyUtilities"
            type="number"
            min="0"
            value={formData.monthlyUtilities || ''}
            onChange={(e) => handleInputChange('monthlyUtilities', parseInt(e.target.value) || undefined)}
            placeholder="Approximate monthly utilities"
          />
        </div>
      </div>

      {formData.listingType === 'sale' && (
        <div>
          <Label htmlFor="soldPrice">Sold Price</Label>
          <Input
            id="soldPrice"
            type="number"
            min="0"
            value={formData.soldPrice || ''}
            onChange={(e) => handleInputChange('soldPrice', parseInt(e.target.value) || undefined)}
            placeholder="Enter sold price (if applicable)"
          />
        </div>
      )}
    </div>
  )
}