import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, MapPin, Calendar } from 'lucide-react'
import { Listing } from '@/types/listings'

interface ListingDetailsTabProps {
  listing: Listing
}

export function ListingDetailsTab({ listing }: ListingDetailsTabProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Property Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Property Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Property Type</span>
              <div className="font-semibold capitalize">{listing.propertyType.replace('_', ' ')}</div>
            </div>
            {listing.yearBuilt && (
              <div>
                <span className="text-sm text-muted-foreground">Year Built</span>
                <div className="font-semibold">{listing.yearBuilt}</div>
              </div>
            )}
            {listing.preferredTerm && (
              <div>
                <span className="text-sm text-muted-foreground">Preferred Term</span>
                <div className="font-semibold">{listing.preferredTerm}</div>
              </div>
            )}
            <div>
              <span className="text-sm text-muted-foreground">Pet Policy</span>
              <div className="font-semibold">{listing.petPolicy}</div>
            </div>
            {listing.soldPrice && (
              <div>
                <span className="text-sm text-muted-foreground">Sold Price</span>
                <div className="font-semibold">{formatPrice(listing.soldPrice)}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Location Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {listing.county && (
              <div>
                <span className="text-sm text-muted-foreground">County</span>
                <div className="font-semibold">{listing.county}</div>
              </div>
            )}
            {listing.township && (
              <div>
                <span className="text-sm text-muted-foreground">Township</span>
                <div className="font-semibold">{listing.township}</div>
              </div>
            )}
            {listing.schoolDistrict && (
              <div>
                <span className="text-sm text-muted-foreground">School District</span>
                <div className="font-semibold">{listing.schoolDistrict}</div>
              </div>
            )}
            {listing.latitude && listing.longitude && (
              <>
                <div>
                  <span className="text-sm text-muted-foreground">Latitude</span>
                  <div className="font-semibold">{listing.latitude}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Longitude</span>
                  <div className="font-semibold">{listing.longitude}</div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Listing Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Listing Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Created</span>
              <div className="font-semibold">{formatDate(listing.createdAt)}</div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <div className="font-semibold">{formatDate(listing.updatedAt)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}