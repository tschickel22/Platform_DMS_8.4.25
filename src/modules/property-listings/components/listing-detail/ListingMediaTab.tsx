import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, Play, FileText, Eye } from 'lucide-react'
import { Listing } from '@/types/listings'

interface ListingMediaTabProps {
  listing: Listing
}

export function ListingMediaTab({ listing }: ListingMediaTabProps) {
  return (
    <div className="space-y-6">
      {/* Images */}
      {listing.images && listing.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Images ({listing.images.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {listing.images.map((image, index) => (
                <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`Property image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => window.open(image, '_blank')}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Videos */}
      {listing.videos && listing.videos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Videos ({listing.videos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {listing.videos.map((video, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <Play className="h-4 w-4" />
                  <a
                    href={video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex-1"
                  >
                    Video {index + 1}
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floor Plans */}
      {listing.floorPlans && listing.floorPlans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Floor Plans ({listing.floorPlans.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {listing.floorPlans.map((plan, index) => (
                <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img
                    src={plan}
                    alt={`Floor plan ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => window.open(plan, '_blank')}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Virtual Tours */}
      {listing.virtualTours && listing.virtualTours.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Virtual Tours ({listing.virtualTours.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {listing.virtualTours.map((tour, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <Eye className="h-4 w-4" />
                  <a
                    href={tour}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex-1"
                  >
                    Virtual Tour {index + 1}
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Agent Photo */}
      {listing.agentPhotoUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Agent/Company Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-32 h-32 bg-muted rounded-lg overflow-hidden">
              <img
                src={listing.agentPhotoUrl}
                alt="Agent or company photo"
                className="w-full h-full object-cover"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}