import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { User } from 'lucide-react'
import { Listing, ContactInfo } from '@/types/listings'

interface ListingFormContactTabProps {
  formData: Partial<Listing>
  handleContactInfoChange: (field: keyof ContactInfo, value: any) => void
}

export default function ListingFormContactTab({
  formData,
  handleContactInfoChange
}: ListingFormContactTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Contact Information</h3>
      </div>

      <div>
        <Label htmlFor="mhVillageAccountKey">MHVillage Account Key</Label>
        <Input
          id="mhVillageAccountKey"
          value={formData.contactInfo?.mhVillageAccountKey || ''}
          onChange={(e) => handleContactInfoChange('mhVillageAccountKey', e.target.value)}
          placeholder="MHVillage account key"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.contactInfo?.firstName || ''}
            onChange={(e) => handleContactInfoChange('firstName', e.target.value)}
            placeholder="Enter first name"
          />
        </div>

        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.contactInfo?.lastName || ''}
            onChange={(e) => handleContactInfoChange('lastName', e.target.value)}
            placeholder="Enter last name"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          value={formData.contactInfo?.companyName || ''}
          onChange={(e) => handleContactInfoChange('companyName', e.target.value)}
          placeholder="Enter company name"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.contactInfo?.phone || ''}
            onChange={(e) => handleContactInfoChange('phone', e.target.value)}
            placeholder="Enter phone number"
            required
          />
        </div>

        <div>
          <Label htmlFor="alternatePhone">Alternate Phone</Label>
          <Input
            id="alternatePhone"
            value={formData.contactInfo?.alternatePhone || ''}
            onChange={(e) => handleContactInfoChange('alternatePhone', e.target.value)}
            placeholder="Enter alternate phone"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.contactInfo?.email || ''}
          onChange={(e) => handleContactInfoChange('email', e.target.value)}
          placeholder="Enter email address"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="additionalEmail1">Additional Email 1</Label>
          <Input
            id="additionalEmail1"
            type="email"
            value={formData.contactInfo?.additionalEmail1 || ''}
            onChange={(e) => handleContactInfoChange('additionalEmail1', e.target.value)}
            placeholder="Additional email 1"
          />
        </div>

        <div>
          <Label htmlFor="additionalEmail2">Additional Email 2</Label>
          <Input
            id="additionalEmail2"
            type="email"
            value={formData.contactInfo?.additionalEmail2 || ''}
            onChange={(e) => handleContactInfoChange('additionalEmail2', e.target.value)}
            placeholder="Additional email 2"
          />
        </div>

        <div>
          <Label htmlFor="additionalEmail3">Additional Email 3</Label>
          <Input
            id="additionalEmail3"
            type="email"
            value={formData.contactInfo?.additionalEmail3 || ''}
            onChange={(e) => handleContactInfoChange('additionalEmail3', e.target.value)}
            placeholder="Additional email 3"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fax">Fax</Label>
          <Input
            id="fax"
            value={formData.contactInfo?.fax || ''}
            onChange={(e) => handleContactInfoChange('fax', e.target.value)}
            placeholder="Enter fax number"
          />
        </div>

        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={formData.contactInfo?.website || ''}
            onChange={(e) => handleContactInfoChange('website', e.target.value)}
            placeholder="Enter website URL"
          />
        </div>
      </div>
    </div>
  )
}