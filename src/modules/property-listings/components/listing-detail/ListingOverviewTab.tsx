import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Bed, Bath, Square } from 'lucide-react'
import { Listing } from '@/types/listings'

interface ListingOverviewTabProps {
  listing: Listing
}

export function ListingOverviewTab({ listing }: ListingOverviewTabProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-6">
      {/* Price and Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="font-medium">
                {listing.listingType === 'rent' ? 'Monthly Rent' : 'Purchase Price'}
              </span>
            </div>
            <div className="text-2xl font-bold">
              {listing.listingType === 'rent' 
                ? formatPrice(listing.rent || 0)
                : formatPrice(listing.purchasePrice || 0)
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bed className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Bedrooms</span>
            </div>
            <div className="text-2xl font-bold">{listing.bedrooms}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bath className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Bathrooms</span>
            </div>
            <div className="text-2xl font-bold">{listing.bathrooms}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Square className="h-5 w-5 text-orange-600" />
              <span className="font-medium">Square Feet</span>
            </div>
            <div className="text-2xl font-bold">{listing.squareFootage.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Pricing */}
      {(listing.lotRent || listing.hoaFees || listing.monthlyTax || listing.monthlyUtilities) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Monthly Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {listing.lotRent && (
                <div>
                  <span className="text-sm text-muted-foreground">Lot Rent</span>
                  <div className="font-semibold">{formatPrice(listing.lotRent)}</div>
                </div>
              )}
              {listing.hoaFees && (
                <div>
                  <span className="text-sm text-muted-foreground">HOA Fees</span>
                  <div className="font-semibold">{formatPrice(listing.hoaFees)}</div>
                </div>
              )}
              {listing.monthlyTax && (
                <div>
                  <span className="text-sm text-muted-foreground">Monthly Tax</span>
                  <div className="font-semibold">{formatPrice(listing.monthlyTax)}</div>
                </div>
              )}
              {listing.monthlyUtilities && (
                <div>
                  <span className="text-sm text-muted-foreground">Est. Utilities</span>
                  <div className="font-semibold">{formatPrice(listing.monthlyUtilities)}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
          {listing.termsOfSale && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Terms of Sale</h4>
              <p className="text-muted-foreground">{listing.termsOfSale}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status and Flags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Listing Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
              {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
            </Badge>
            {listing.isRepossessed && (
              <Badge variant="destructive">Repossessed</Badge>
            )}
            {listing.pendingSale && (
              <Badge variant="outline">Pending Sale</Badge>
            )}
            {listing.packageType && (
              <Badge variant="outline">{listing.packageType} Package</Badge>
            )}
          </div>
          {listing.searchResultsText && (
            <div className="mt-3">
              <span className="text-sm text-muted-foreground">Search Results Text:</span>
              <p className="text-sm">{listing.searchResultsText}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}