import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, MapPin, Bed, Bath, Users, Ruler, ExternalLink } from 'lucide-react'
import { mockListings, type PublicListing } from '@/mocks/listingsMock'

export function PublicCatalogView() {
  const { companySlug, token } = useParams<{ companySlug: string; token?: string }>()
  const [searchParams] = useSearchParams()
  
  const [listings, setListings] = useState<PublicListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [priceFilter, setPriceFilter] = useState<string>('all')

  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load listings from local storage or use mock data as fallback
        const savedListings = localStorage.getItem(`listings:${companySlug}`)
        
        let listingsData = mockListings
        
        if (savedListings) {
          try {
            const parsed = JSON.parse(savedListings)
            if (Array.isArray(parsed) && parsed.length > 0) {
              listingsData = parsed
            }
          } catch (err) {
            console.warn('Failed to parse saved listings, using mock data:', err)
          }
        }

        setListings(listingsData)
      } catch (err) {
        console.error('Error loading listings:', err)
        setError('Failed to load listings')
        // Fallback to mock data on error
        setListings(mockListings)
      } finally {
        setLoading(false)
      }
    }

    loadListings()
  }, [companySlug, token])

  // Filter listings based on search and filters
  const filteredListings = listings.filter(listing => {
    const matchesSearch = searchTerm === '' || 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${listing.make} ${listing.model}`.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === 'all' || listing.listingType === typeFilter

    let matchesPrice = true
    if (priceFilter !== 'all') {
      const price = listing.salePrice || listing.rentPrice || 0
      switch (priceFilter) {
        case 'under_100k':
          matchesPrice = price < 100000
          break
        case '100k_300k':
          matchesPrice = price >= 100000 && price <= 300000
          break
        case 'over_300k':
          matchesPrice = price > 300000
          break
      }
    }

    return matchesSearch && matchesType && matchesPrice
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading listings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Listings</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Property Listings</h1>
              <p className="text-gray-600 mt-1">
                {companySlug ? `${companySlug} Properties` : 'Available Properties'}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {filteredListings.length} of {listings.length} listings
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="manufactured_home">Manufactured Homes</SelectItem>
                <SelectItem value="rv">RVs</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under_100k">Under $100k</SelectItem>
                <SelectItem value="100k_300k">$100k - $300k</SelectItem>
                <SelectItem value="over_300k">Over $300k</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('')
                setTypeFilter('all')
                setPriceFilter('all')
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={listing.media?.primaryPhoto || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-white/90">
                      {listing.listingType === 'manufactured_home' ? 'Manufactured Home' : 'RV'}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg">{listing.title}</CardTitle>
                  <CardDescription className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {listing.location.city}, {listing.location.state}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">
                        {listing.salePrice && `$${listing.salePrice.toLocaleString()}`}
                        {listing.rentPrice && !listing.salePrice && `$${listing.rentPrice}/mo`}
                        {listing.salePrice && listing.rentPrice && (
                          <span className="text-sm font-normal text-gray-600 ml-2">
                            or ${listing.rentPrice}/mo
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Specs */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {listing.listingType === 'manufactured_home' ? (
                        <>
                          {listing.bedrooms && (
                            <div className="flex items-center">
                              <Bed className="h-4 w-4 mr-1" />
                              {listing.bedrooms} bed
                            </div>
                          )}
                          {listing.bathrooms && (
                            <div className="flex items-center">
                              <Bath className="h-4 w-4 mr-1" />
                              {listing.bathrooms} bath
                            </div>
                          )}
                          {listing.dimensions?.sqft && (
                            <div className="flex items-center">
                              <Ruler className="h-4 w-4 mr-1" />
                              {listing.dimensions.sqft} sqft
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {listing.sleeps && (
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              Sleeps {listing.sleeps}
                            </div>
                          )}
                          {listing.length && (
                            <div className="flex items-center">
                              <Ruler className="h-4 w-4 mr-1" />
                              {listing.length}ft
                            </div>
                          )}
                          {listing.slides && (
                            <div className="flex items-center">
                              <span className="text-xs">{listing.slides} slides</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Year, Make, Model */}
                    <div className="text-sm text-gray-600">
                      {listing.year} {listing.make} {listing.model}
                    </div>

                    {/* View Details Button */}
                    <Button 
                      className="w-full mt-4"
                      onClick={() => {
                        const detailUrl = `/public/${companySlug}/listing/${listing.id}`
                        window.open(detailUrl, '_blank')
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600">
              {searchTerm || typeFilter !== 'all' || priceFilter !== 'all'
                ? 'Try adjusting your search criteria'
                : 'No properties are currently available'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}