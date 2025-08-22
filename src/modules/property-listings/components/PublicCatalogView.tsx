import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, Bed, Bath, Users, Ruler, ArrowLeft } from 'lucide-react'
import { propertyListingsService } from '../services/propertyListingsService'
import { PropertyListing } from '../types'
import * as ListingsMock from '@/mocks/listingsMock'

/** ---------- helpers ---------- */

// Normalize any plausible mock module shape into an array
const asArray = (val: any) => {
  if (Array.isArray(val)) return val
  if (Array.isArray(val?.listings)) return val.listings
  if (Array.isArray(val?.sampleListings)) return val.sampleListings
  if (Array.isArray(val?.default)) return val.default
  if (Array.isArray((val as any)?.mockListings)) return (val as any).mockListings
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

/** ---------- component ---------- */

const PublicCatalogView: React.FC = () => {
  const navigate = useNavigate()

  // single declarations (prevents "already been declared")
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState<PropertyListing[]>([])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const USE_MOCKS = (import.meta as any)?.env?.VITE_USE_MOCKS !== 'false'

        if (USE_MOCKS) {
          const mockRoot =
            (ListingsMock as any).mockListings ??
            (ListingsMock as any).listings ??
            (ListingsMock as any).sampleListings ??
            (ListingsMock as any).default ??
            ListingsMock

          const data = asArray(mockRoot).map(normalize)
          if (!cancelled) setListings(data as PropertyListing[])
        } else {
          const data = await propertyListingsService.getListings()
          if (!cancelled) setListings((data ?? []) as PropertyListing[])
        }
      } catch (err) {
        console.error('Failed to load listings:', err)
        if (!cancelled) setListings([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading listings…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="text-sm text-muted-foreground">
            {listings.length} {listings.length === 1 ? 'result' : 'results'}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 py-8">
        {listings.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-2">No listings</h2>
                <p className="text-muted-foreground">
                  There are no listings to display right now.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => {
              const photos: string[] = l.media?.photos ?? []
              const primary = l.media?.primaryPhoto ?? photos[0]
              return (
                <Card
                  key={l.id}
                  className="overflow-hidden hover:shadow-lg transition"
                  onClick={() => navigate(`./${l.id}`)}
                  role="button"
                >
                  {primary ? (
                    <img
                      src={primary}
                      alt={l.title || 'Listing'}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground">
                      No photo
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{l.title || 'Untitled'}</span>
                      <Badge variant={l.listingType === 'manufactured_home' ? 'default' : 'secondary'}>
                        {l.listingType === 'manufactured_home' ? 'MH' : 'RV'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {(l.salePrice ?? l.rentPrice) != null && (
                      <div className="font-semibold">
                        {l.salePrice != null
                          ? `Sale: ${formatPrice(l.salePrice)}`
                          : `Rent: ${formatPrice(l.rentPrice!)}/mo`}
                      </div>
                    )}

                    {(l.location?.city || l.location?.state) && (
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="truncate">
                          {l.location?.city}{l.location?.city && l.location?.state ? ', ' : ''}{l.location?.state}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2 text-muted-foreground">
                      {l.year && (
                        <span className="inline-flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {l.year}
                        </span>
                      )}
                      {l.bedrooms != null && (
                        <span className="inline-flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          {l.bedrooms} bd
                        </span>
                      )}
                      {l.bathrooms != null && (
                        <span className="inline-flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          {l.bathrooms} ba
                        </span>
                      )}
                      {l.sleeps != null && (
                        <span className="inline-flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          sleeps {l.sleeps}
                        </span>
                      )}
                      {l.length != null && (
                        <span className="inline-flex items-center">
                          <Ruler className="h-4 w-4 mr-1" />
                          {l.length} ft
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicCatalogView
export { PublicCatalogView }
