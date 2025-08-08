import React from 'react'
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'
import { Listing } from '@/types/listings'

interface ListingDetailHeaderProps {
  listing: Listing
  onEdit?: () => void
  onClose?: () => void
}

export function ListingDetailHeader({ listing, onEdit, onClose }: ListingDetailHeaderProps) {
  return (
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-2xl mb-2">{listing.title}</CardTitle>
          <CardDescription className="flex items-center gap-2 text-lg">
            <MapPin className="h-4 w-4" />
            {listing.address}
            {listing.address2 && `, ${listing.address2}`}
            {listing.city && listing.state && `, ${listing.city}, ${listing.state}`}
            {listing.zipCode && ` ${listing.zipCode}`}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <Button onClick={onEdit}>Edit Listing</Button>
          )}
          {onClose && (
            <Button variant="outline" onClick={onClose}>Close</Button>
          )}
        </div>
      </div>
    </CardHeader>
  )
}