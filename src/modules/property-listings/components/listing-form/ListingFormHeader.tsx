import React from 'react'
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home } from 'lucide-react'
import { Listing } from '@/types/listings'

interface ListingFormHeaderProps {
  listing?: Listing
}

export default function ListingFormHeader({ listing }: ListingFormHeaderProps) {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Home className="h-5 w-5" />
        {listing ? 'Edit Listing' : 'Create New Listing'}
      </CardTitle>
      <CardDescription>
        {listing ? 'Update the listing details below' : 'Fill in the details to create a new property listing'}
      </CardDescription>
    </CardHeader>
  )
}