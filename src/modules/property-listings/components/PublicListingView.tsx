import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Users,
  Ruler,
  Calendar,
  Share2,
} from 'lucide-react'
import * as ListingsMock from '@/mocks/listingsMock'
import { ShareListingModal } from './ShareListingModal'

// Normalize any plausible mock module shape into an array
const asArray = (val: any) => {
  if (Array.isArray(val)) return val
  if (Array.isArray(val?.listings)) return val.listings
  if (Array.isArray(val?.sampleListings)) return val.sampleListings
  if (Array.isArray(val?.default)) return val.default
  return []
}

// Ensure both listingType / propertyType exist so legacy code won't crash
const normalize = (l: any) => ({
  ...l,
  listingType: l?.listingType ?? l?.propertyType ?? 'manufactured_home',
  propertyType: l?.propertyType ?? l?.listingType ?? 'manufactured_home',
})

const formatPrice = (price?: number) =>
  typeof price === 'number'
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price)
    : ''

const PublicListingView: React.FC = () => {
  const { listingId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [listing, setListing] = useState<any>(null)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const USE_MOCKS = (import.meta as any)?.env?.VITE_USE_MOCKS !== 'false'

      if (USE_MOCKS) {
        const mock =
          (ListingsMock as any).mockListings ??
          (ListingsMock as any).listings ??
          (ListingsMock as any).sampleListings ??
          (ListingsMock as any).default

        const data = asArray(mock).map(normalize)
        const found = data.find((l: any) => String(l.id) === String(listingId))
        if (!cancelled) setListing(found ?? null)
      } else {
        // TODO: wire to real API when ready
        if (!cancelled) setListing(null)
      }

      if (!cancelled) setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [listingId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading listing…</p>
        </div>
      </div>
    )
  }

  if (!listing) {
    // Graceful fallback
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">Listing not found</h2>
              <p className="text-muted-foreground mb-4">
                The listing you're looking for doesn't exist.
              </p>
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const photos: string[] = listing.media?.photos ?? []
  const primary = listing.media?.primaryPhoto ?? photos[0]
  const allImages =
    primary != null ? [primary, ...photos.filter((p: string) => p !== primary)] : photos

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant={listing.listingType === 'manufactured_home' ? 'default' : 'secondary'}>
              {listing.listingType === 'manufactured_home' ? 'MH' : 'RV'}
            </Badge>
            <Button variant="outline" onClick={() => setShareModalOpen(true)} className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Media + description */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-muted">
                {allImages.length > 0 ? (
                  <img
                    src={allImages[selectedImageIndex]}
                    alt={listing.title || 'Listing'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No photos available
                  </div>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="p-4 border-t">
                  <div className="flex gap-2 overflow-x-auto">
                    {allImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImageIndex(i)}
                        className={`w-20 h-20 rounded overflow-hidden border-2 ${
                          selectedImageIndex === i ? 'border-primary' : 'border-border'
                        }`}
                      >
                        <img src={img} className="w-full h-full object-cover" alt={`View ${i + 1}`} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            <Card className="mt-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-muted-foreground">
                  {listing.description || 'No description available.'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>
                    {listing.location?.city}, {listing.location?.state}
                  </span>
                </div>

                <div className="space-y-2">
                  {typeof listing.salePrice === 'number' && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Sale Price:</span>
                      <span className="text-2xl font-bold text-green-600">
                        {formatPrice(listing.salePrice)}
                      </span>
                    </div>
                  )}
                  {typeof listing.rentPrice === 'number' && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Rent Price:</span>
                      <span className="text-xl font-semibold text-blue-600">
                        {formatPrice(listing.rentPrice)}/mo
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Details</h2>
                <div className="space-y-3">
                  {listing.year && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Year</span>
                      </div>
                      <span className="font-medium">{listing.year}</span>
                    </div>
                  )}

                  {listing.make && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Make</span>
                      <span className="font-medium">{listing.make}</span>
                    </div>
                  )}

                  {listing.model && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Model</span>
                      <span className="font-medium">{listing.model}</span>
                    </div>
                  )}

                  {listing.bedrooms != null && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Bedrooms</span>
                      </div>
                      <span className="font-medium">{listing.bedrooms}</span>
                    </div>
                  )}

                  {listing.bathrooms != null && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Bathrooms</span>
                      </div>
                      <span className="font-medium">{listing.bathrooms}</span>
                    </div>
                  )}

                  {listing.sleeps != null && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Sleeps</span>
                      </div>
                      <span className="font-medium">{listing.sleeps}</span>
                    </div>
                  )}

                  {listing.length != null && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Ruler className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Length</span>
                      </div>
                      <span className="font-medium">{listing.length} ft</span>
                    </div>
                  )}

                  {listing.dimensions?.sqft != null && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Square Feet</span>
                      <span className="font-medium">{listing.dimensions.sqft} sq ft</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Information */}
            {(listing.status || listing.offerType || listing.location?.address1) && (
              <Card>
                <CardHeader>
                  <CardTitle>Property Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {listing.status && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                          {listing.status}
                        </Badge>
                      </div>
                    )}
                    {listing.offerType && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Offer Type</span>
                        <span className="text-sm font-medium">
                          {listing.offerType === 'for_sale'
                            ? 'For Sale'
                            : listing.offerType === 'for_rent'
                            ? 'For Rent'
                            : 'Sale or Rent'}
                        </span>
                      </div>
                    )}
                    {listing.location?.address1 && (
                      <div className="flex items-start justify-between">
                        <span className="text-sm text-muted-foreground">Address</span>
                        <span className="text-sm font-medium text-right">
                          {listing.location.address1}
                          <br />
                          {listing.location.city}, {listing.location.state}{' '}
                          {listing.location.postalCode}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <ShareListingModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        listing={listing}
      />
    </div>
  )
}

export default PublicListingView

export { PublicListingView }