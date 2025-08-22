import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
// ✅ robust import: works for named, default, or alternate keys
import * as ListingsMock from '@/mocks/listingsMock'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Grid, List, MapPin, Bed, Bath, Users, Ruler, Search, Home, Car } from 'lucide-react'

// Turn any plausible mock module shape into an array
const asArray = (val: any) => {
  if (Array.isArray(val)) return val
  if (Array.isArray(val?.listings)) return val.listings
  if (Array.isArray(val?.sampleListings)) return val.sampleListings
  if (Array.isArray(val?.default)) return val.default
  return []
}

type Listing = {
  id: string
  title?: string
  make?: string
  model?: string
  year?: number | string
  listingType?: 'manufactured_home' | 'rv' | string
  salePrice?: number
  rentPrice?: number
  length?: number | string
  slides?: number | string
  bedrooms?: number | string
  bathrooms?: number | string
  sleeps?: number | string
  dimensions?: { sqft?: number | string } | null
  location?: { city?: string; state?: string } | null
  media?: {
    primaryPhoto?: string | null
    photos?: string[]
  } | null
}

const numOrUndefined = (v: string | number | undefined | null) => {
  if (v === '' || v === undefined || v === null) return undefined
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : undefined
}

const PublicCatalogView: React.FC = () => {
  const { companySlug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [listings, setListings] = useState<Listing[]>([])
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || '')
  const [filterType, setFilterType] = useState<string>(searchParams.get('type') || 'all')
  const [filterOfferType, setFilterOfferType] = useState<string>(searchParams.get('offer') || 'all')
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || '',
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Load mock data safely
  useEffect(() => {
    setLoading(true)

    // Optional: gate with env flag
    const USE_MOCKS = (import.meta as any)?.env?.VITE_USE_MOCKS !== 'false'

    if (USE_MOCKS) {
      const mock =
        (ListingsMock as any).mockListings ??
        (ListingsMock as any).listings ??
        (ListingsMock as any).sampleListings ??
        (ListingsMock as any).default

      const data = asArray(mock)
      console.log('Mock data found:', data)
      setListings(data)
      setLoading(false)
    } else {
      // TODO: real API call when ready
      setListings([])
      setLoading(false)
    }
  }, [])

  const filteredListings = useMemo(() => {
    let filtered = [...listings]

    const q = (searchQuery || '').toLowerCase().trim()
    if (q) {
      filtered = filtered.filter((l) => {
        const title = (l.title || '').toLowerCase()
        const make = (l.make || '').toLowerCase()
        const model = (l.model || '').toLowerCase()
        const city = (l.location?.city || '').toLowerCase()
        const state = (l.location?.state || '').toLowerCase()
        return (
          title.includes(q) ||
          make.includes(q) ||
          model.includes(q) ||
          city.includes(q) ||
          state.includes(q)
        )
      })
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((l) => l.listingType === filterType)
    }

    if (filterOfferType !== 'all') {
      filtered = filtered.filter((l) => {
        if (filterOfferType === 'for_sale') return !!l.salePrice
        if (filterOfferType === 'for_rent') return !!l.rentPrice
        return true
      })
    }

    const min = numOrUndefined(priceRange.min)
    const max = numOrUndefined(priceRange.max)
    if (min != null || max != null) {
      filtered = filtered.filter((l) => {
        const price = l.salePrice ?? l.rentPrice ?? 0
        if (min != null && price < min) return false
        if (max != null && price > max) return false
        return true
      })
    }

    return filtered
  }, [listings, searchQuery, filterType, filterOfferType, priceRange])

  const updateUrlParams = (key: string, value?: string) => {
    const next = new URLSearchParams(searchParams)
    if (value && value.length) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  const formatPrice = (price?: number) =>
    typeof price === 'number'
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }).format(price)
      : ''

  const getListingTypeIcon = (type?: string) => (type === 'manufactured_home' ? Home : Car)

  const handleListingClick = (listingId: string) => {
    navigate(`/${companySlug}/listing/${listingId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-16 bg-muted rounded" />
            <div className="grid gap-6 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 rounded bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Property Listings</h1>
              <p className="text-muted-foreground">Browse available manufactured homes and RVs</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                placeholder="Search by make, model, location..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  updateUrlParams('q', e.target.value)
                }}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <Select
                value={filterType}
                onValueChange={(value) => {
                  setFilterType(value)
                  updateUrlParams('type', value)
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="manufactured_home">Manufactured Homes</SelectItem>
                  <SelectItem value="rv">RV/Travel Trailers</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filterOfferType}
                onValueChange={(value) => {
                  setFilterOfferType(value)
                  updateUrlParams('offer', value)
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Offer Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Offers</SelectItem>
                  <SelectItem value="for_sale">For Sale</SelectItem>
                  <SelectItem value="for_rent">For Rent</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex space-x-2">
                <Input
                  placeholder="Min Price"
                  value={priceRange.min}
                  onChange={(e) => {
                    const v = e.target.value
                    setPriceRange((r) => ({ ...r, min: v }))
                    updateUrlParams('minPrice', v)
                  }}
                  className="w-[120px]"
                />
                <Input
                  placeholder="Max Price"
                  value={priceRange.max}
                  onChange={(e) => {
                    const v = e.target.value
                    setPriceRange((r) => ({ ...r, max: v }))
                    updateUrlParams('maxPrice', v)
                  }}
                  className="w-[120px]"
                />
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {filteredListings.length} {filteredListings.length === 1 ? 'listing' : 'listings'} found
            </span>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="container mx-auto px-4 py-8">
        {filteredListings.length === 0 ? (
          <div className="py-12 text-center">
            <Home className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">No listings found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or browse all listings</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
            {filteredListings.map((listing) => {
              const TypeIcon = getListingTypeIcon(listing.listingType)

              if (viewMode === 'list') {
                return (
                  <Card
                    key={listing.id}
                    className="cursor-pointer transition-shadow hover:shadow-md"
                    onClick={() => handleListingClick(listing.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                          {listing.media?.primaryPhoto ? (
                            <img
                              src={listing.media.primaryPhoto}
                              alt={listing.title || 'Listing'}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <TypeIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="mb-1 font-semibold">{listing.title}</h3>
                          <p className="mb-2 text-sm text-muted-foreground">
                            {listing.year} {listing.make} {listing.model}
                          </p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-3 w-3" />
                            {listing.location?.city}, {listing.location?.state}
                          </div>
                        </div>
                        <div className="text-right">
                          {typeof listing.salePrice === 'number' && (
                            <div className="font-bold text-green-600">{formatPrice(listing.salePrice)}</div>
                          )}
                          {typeof listing.rentPrice === 'number' && (
                            <div className="font-bold text-blue-600">{formatPrice(listing.rentPrice)}/mo</div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              }

              return (
                <Card
                  key={listing.id}
                  className="cursor-pointer transition-shadow hover:shadow-lg"
                  onClick={() => handleListingClick(listing.id)}
                >
                  <div className="relative aspect-video overflow-hidden rounded-t-lg bg-muted">
                    {listing.media?.primaryPhoto ? (
                      <img
                        src={listing.media.primaryPhoto}
                        alt={listing.title || 'Listing'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <TypeIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute left-3 top-3">
                      <Badge variant={listing.listingType === 'manufactured_home' ? 'default' : 'secondary'}>
                        {listing.listingType === 'manufactured_home' ? 'MH' : 'RV'}
                      </Badge>
                    </div>
                    {listing.media?.photos && listing.media.photos.length > 1 && (
                      <div className="absolute right-3 top-3 rounded bg-black/50 px-2 py-1 text-xs text-white">
                        +{listing.media.photos.length - 1} photos
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <h3 className="mb-2 line-clamp-1 font-semibold">{listing.title}</h3>
                    <p className="mb-3 text-sm text-muted-foreground">
                      {listing.year} {listing.make} {listing.model}
                    </p>

                    {listing.listingType === 'manufactured_home' && (
                      <div className="mb-3 flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Bed className="mr-1 h-3 w-3" />
                          {listing.bedrooms}
                        </span>
                        <span className="flex items-center">
                          <Bath className="mr-1 h-3 w-3" />
                          {listing.bathrooms}
                        </span>
                        <span className="flex items-center">
                          <Ruler className="mr-1 h-3 w-3" />
                          {listing.dimensions?.sqft} sqft
                        </span>
                      </div>
                    )}

                    {listing.listingType === 'rv' && (
                      <div className="mb-3 flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Users className="mr-1 h-3 w-3" />
                          Sleeps {listing.sleeps}
                        </span>
                        <span>{listing.length}ft</span>
                        <span>{listing.slides} slides</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-1 h-3 w-3" />
                        {listing.location?.city}, {listing.location?.state}
                      </div>
                      <div className="text-right">
                        {typeof listing.salePrice === 'number' && (
                          <div className="font-bold text-green-600">{formatPrice(listing.salePrice)}</div>
                        )}
                        {typeof listing.rentPrice === 'number' && (
                          <div className="text-sm font-bold text-blue-600">{formatPrice(listing.rentPrice)}/mo</div>
                        )}
                      </div>
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

export { PublicCatalogView }
