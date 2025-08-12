import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { mockListings } from '@/mocks/listingsMock'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  MapPin,
  Home,
  Car,
  Bed,
  Bath,
  Ruler,
  Users,
  Grid,
  List,
  SlidersHorizontal
} from 'lucide-react'

const PublicCatalogView = () => {
  const { companySlug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [listings, setListings] = useState([])
  const [filteredListings, setFilteredListings] = useState([])
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [filterType, setFilterType] = useState(searchParams.get('type') || 'all')
  const [filterOfferType, setFilterOfferType] = useState(searchParams.get('offer') || 'all')
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || ''
  })
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    setListings(mockListings)
    setFilteredListings(mockListings)
  }, [])

  useEffect(() => {
    let filtered = listings

    if (searchQuery) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.location.state.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(listing => listing.listingType === filterType)
    }

    if (filterOfferType !== 'all') {
      filtered = filtered.filter(listing => {
        if (filterOfferType === 'for_sale') return listing.salePrice
        if (filterOfferType === 'for_rent') return listing.rentPrice
        return true
      })
    }

    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(listing => {
        const price = listing.salePrice || listing.rentPrice || 0
        const min = priceRange.min ? parseInt(priceRange.min) : 0
        const max = priceRange.max ? parseInt(priceRange.max) : Infinity
        return price >= min && price <= max
      })
    }

    setFilteredListings(filtered)
  }, [listings, searchQuery, filterType, filterOfferType, priceRange])

  const updateUrlParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    setSearchParams(newParams)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price)
  }

  const getListingTypeIcon = (type) => {
    return type === 'manufactured_home' ? Home : Car
  }

  const handleListingClick = (listingId) => {
    navigate(`/${companySlug}/listing/${listingId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-16 bg-muted rounded"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-muted rounded"></div>
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
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Property Listings</h1>
              <p className="text-muted-foreground">
                Browse available manufactured homes and RVs
              </p>
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
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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

            {/* Filters */}
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
                    const newRange = { ...priceRange, min: e.target.value }
                    setPriceRange(newRange)
                    updateUrlParams('minPrice', e.target.value)
                  }}
                  className="w-[120px]"
                />
                <Input
                  placeholder="Max Price"
                  value={priceRange.max}
                  onChange={(e) => {
                    const newRange = { ...priceRange, max: e.target.value }
                    setPriceRange(newRange)
                    updateUrlParams('maxPrice', e.target.value)
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
          <div className="text-center py-12">
            <Home className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">No listings found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse all listings
            </p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredListings.map((listing) => {
              const TypeIcon = getListingTypeIcon(listing.listingType)
              
              if (viewMode === 'list') {
                return (
                  <Card 
                    key={listing.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleListingClick(listing.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-24 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {listing.media?.primaryPhoto ? (
                            <img
                              src={listing.media.primaryPhoto}
                              alt={listing.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <TypeIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{listing.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {listing.year} {listing.make} {listing.model}
                          </p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {listing.location.city}, {listing.location.state}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          {listing.salePrice && (
                            <div className="font-bold text-green-600">
                              {formatPrice(listing.salePrice)}
                            </div>
                          )}
                          {listing.rentPrice && (
                            <div className="font-bold text-blue-600">
                              {formatPrice(listing.rentPrice)}/mo
                            </div>
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
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleListingClick(listing.id)}
                >
                  <div className="aspect-video relative overflow-hidden rounded-t-lg bg-muted">
                    {listing.media?.primaryPhoto ? (
                      <img
                        src={listing.media.primaryPhoto}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <TypeIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <Badge variant={listing.listingType === 'manufactured_home' ? 'default' : 'secondary'}>
                        {listing.listingType === 'manufactured_home' ? 'MH' : 'RV'}
                      </Badge>
                    </div>
                    {listing.media?.photos && listing.media.photos.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs">
                        +{listing.media.photos.length - 1} photos
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-1">{listing.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {listing.year} {listing.make} {listing.model}
                    </p>
                    
                    {listing.listingType === 'manufactured_home' && (
                      <div className="flex items-center space-x-4 mb-3 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Bed className="h-3 w-3 mr-1" />
                          {listing.bedrooms}
                        </span>
                        <span className="flex items-center">
                          <Bath className="h-3 w-3 mr-1" />
                          {listing.bathrooms}
                        </span>
                        <span className="flex items-center">
                          <Ruler className="h-3 w-3 mr-1" />
                          {listing.dimensions?.sqft} sqft
                        </span>
                      </div>
                    )}
                    
                    {listing.listingType === 'rv' && (
                      <div className="flex items-center space-x-4 mb-3 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          Sleeps {listing.sleeps}
                        </span>
                        <span>{listing.length}ft</span>
                        <span>{listing.slides} slides</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {listing.location.city}, {listing.location.state}
                      </div>
                      <div className="text-right">
                        {listing.salePrice && (
                          <div className="font-bold text-green-600">
                            {formatPrice(listing.salePrice)}
                          </div>
                        )}
                        {listing.rentPrice && (
                          <div className="font-bold text-blue-600 text-sm">
                            {formatPrice(listing.rentPrice)}/mo
                          </div>
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