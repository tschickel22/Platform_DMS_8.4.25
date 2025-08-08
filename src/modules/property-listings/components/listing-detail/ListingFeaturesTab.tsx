import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Listing } from '@/types/listings'

interface ListingFeaturesTabProps {
  listing: Listing
}

export function ListingFeaturesTab({ listing }: ListingFeaturesTabProps) {
  return (
    <div className="space-y-6">
      {/* Amenities */}
      {listing.amenities && listing.amenities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {listing.amenities.map((amenity, index) => (
                <Badge key={index} variant="secondary">{amenity}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Outdoor Features */}
      {listing.outdoorFeatures && listing.outdoorFeatures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Outdoor Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {listing.outdoorFeatures.map((feature, index) => (
                <Badge key={index} variant="outline">{feature}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Storage Options */}
      {listing.storageOptions && listing.storageOptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Storage Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {listing.storageOptions.map((option, index) => (
                <Badge key={index} variant="outline">{option}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technology Features */}
      {listing.technologyFeatures && listing.technologyFeatures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Technology Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {listing.technologyFeatures.map((feature, index) => (
                <Badge key={index} variant="outline">{feature}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Community Amenities */}
      {listing.communityAmenities && listing.communityAmenities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Community Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {listing.communityAmenities.map((amenity, index) => (
                <Badge key={index} variant="outline">{amenity}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}