import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter,
  MapPin,
  Calendar,
  Home,
  Car,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { apiClient } from '@/utils/apiClient'

interface Listing {
  id: string
  title: string
  listingType: 'manufactured_home' | 'rv'
  offerType: 'for_sale' | 'for_rent' | 'both'
  year: number
  make: string
  model: string
  salePrice?: number
  rentPrice?: number
  bedrooms?: number
  bathrooms?: number
  location: {
    city: string
    state: string
    postalCode: string
  }
  media: {
    primaryPhoto: string
    photos: string[]
  }
  searchResultsText: string
  status: string
}

interface CompanyBranding {
  name: string
  logo?: string
  primaryColor: string
  secondaryColor: string
  phone?: string
  email?: string
  website?: string
}

export default function PublicCatalogView() {
  const { companySlug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { toast } = useToast()
  
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [companyBranding, setCompanyBranding] = useState<CompanyBranding | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [offerFilter, setOfferFilter] = useState('all')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [bedroomsFilter, setBedroomsFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 24
  
  useEffect(() => {
    fetchListings()
    fetchCompanyBranding()
  }, [companySlug])
  
  useEffect(() => {
    applyFilters()
  }, [listings, searchQuery, typeFilter, offerFilter, priceRange, bedroomsFilter, sortBy])
  
  // Parse URL parameters for filtering
  useEffect(() => {
    const ids = searchParams.get('ids')
    const type = searchParams.get('type')
    const offer = searchParams.get('offer')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort')
    
    if (search) setSearchQuery(search)
    if (type) setTypeFilter(type)
    if (offer) setOfferFilter(offer)
    if (minPrice) setPriceRange(prev => ({ ...prev, min: minPrice }))
    if (maxPrice) setPriceRange(prev => ({ ...prev, max: maxPrice }))
    if (bedrooms) setBedroomsFilter(bedrooms)
    if (sort) setSortBy(sort)
    
    // Handle specific listing IDs (for shared selections)
    if (ids) {
      const listingIds = ids.split(',')
      setFilteredListings(prev => prev.filter(listing => listingIds.includes(listing.id)))
    }
  }, [searchParams])

  const fetchListings = async () => {
    try {
      setLoading(true)
      
      // In production, you'd get the actual company ID from the slug
      // For now, we'll mock this
      const companyId = `company_${companySlug}`
      
      const data = await apiClient.get('listings-crud', { companyId })
      
      // Only show active listings
      if (data && Array.isArray(data)) {
        const activeListings = data.filter((listing: Listing) => listing.status === 'active')
        setListings(activeListings)
      } else {
        // Handle case where API returns null/undefined (graceful fallback)
        setListings([])
      }
      
    } catch (error) {
      console.error('Error fetching listings:', error)
      setError('Failed to load listings. Please try again later.')
      setListings([]) // Ensure we have an empty array instead of undefined
      toast({
        title: "Error",
        description: "Failed to load listings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanyBranding = async () => {
    try {
      const companyId = `company_${companySlug}`
      
      // Mock company branding - in production, fetch from your API
      const mockBranding: CompanyBranding = {
        name: companySlug?.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Property Listings',
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        phone: '(555) 123-4567',
        email: 'info@example.com',
        website: 'https://example.com'
      }
      
      setCompanyBranding(mockBranding)
      
    } catch (error) {
      console.error('Error fetching company branding:', error)
    }
  }

  const applyFilters = () => {
    let filtered = [...listings]
    
    // Search query
    if (searchQuery) {
      filtered = filtered.filter(listing =>
        listing.searchResultsText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.location.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(listing => listing.listingType === typeFilter)
    }
    
    // Offer type filter
    if (offerFilter !== 'all') {
      filtered = filtered.filter(listing => 
        listing.offerType === offerFilter || listing.offerType === 'both'
      )
    }
    
    // Price range filter
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(listing => {
        const price = listing.salePrice || listing.rentPrice || 0
        const min = priceRange.min ? parseFloat(priceRange.min) : 0
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity
        return price >= min && price <= max
      })
    }
    
    // Bedrooms filter (MH only)
    if (bedroomsFilter !== 'all') {
      filtered = filtered.filter(listing => {
        if (listing.listingType !== 'manufactured_home') return true
        const bedrooms = listing.bedrooms || 0
        if (bedroomsFilter === '4+') return bedrooms >= 4
        return bedrooms === parseInt(bedroomsFilter)
      })
    }
    
    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return (a.salePrice || a.rentPrice || 0) - (b.salePrice || b.rentPrice || 0)
        case 'price_high':
          return (b.salePrice || b.rentPrice || 0) - (a.salePrice || a.rentPrice || 0)
        case 'year_new':
          return (b.year || 0) - (a.year || 0)
        case 'year_old':
          return (a.year || 0) - (b.year || 0)
        case 'newest':
        default:
          return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
      }
    })
    
    setFilteredListings(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const updateFilters = (newFilters: Record<string, any>) => {
    const newSearchParams = new URLSearchParams(searchParams)
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        newSearchParams.set(key, String(value))
      } else {
        newSearchParams.delete(key)
      }
    })
    
    setSearchParams(newSearchParams)
  }

  // Pagination
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentListings = filteredListings.slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchListings}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {companyBranding?.logo && (
                <img
                  src={companyBranding.logo}
                  alt={companyBranding.name}
                  className="h-10 w-auto"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold" style={{ color: companyBranding?.primaryColor }}>
                  {companyBranding?.name}
                </h1>
                <p className="text-gray-600">Property Listings</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {companyBranding?.phone && (
                <a href={`tel:${companyBranding.phone}`} className="hover:text-primary">
                  {companyBranding.phone}
                </a>
              )}
              {companyBranding?.website && (
                <a
                  href={companyBranding.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  updateFilters({ search: e.target.value })
                }}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value)
                updateFilters({ type: e.target.value })
              }}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">All Types</option>
              <option value="manufactured_home">Manufactured Homes</option>
              <option value="rv">RVs</option>
            </select>

            {/* Offer Filter */}
            <select
              value={offerFilter}
              onChange={(e) => {
                setOfferFilter(e.target.value)
                updateFilters({ offer: e.target.value })
              }}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">For Sale & Rent</option>
              <option value="for_sale">For Sale</option>
              <option value="for_rent">For Rent</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                updateFilters({ sort: e.target.value })
              }}
              className="w-full p-2 border rounded-md"
            >
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="year_new">Year: Newest</option>
              <option value="year_old">Year: Oldest</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-600">
                {filteredListings.length} {filteredListings.length === 1 ? 'property' : 'properties'} found
              </p>
              
              {(typeFilter !== 'all' || typeFilter === 'manufactured_home') && (
                <select
                  value={bedroomsFilter}
                  onChange={(e) => {
                    setBedroomsFilter(e.target.value)
                    updateFilters({ bedrooms: e.target.value })
                  }}
                  className="p-1 border rounded text-sm"
                >
                  <option value="all">Any Bedrooms</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4+">4+ Bedrooms</option>
                </select>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
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
        </div>

        {/* Listings Grid/List */}
        {currentListings.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {currentListings.map((listing) => (
              <Card key={listing.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {viewMode === 'grid' ? (
                    <div onClick={() => window.location.href = `/${companySlug}/listing/${listing.id}`}>
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <img
                          src={listing.media.primaryPhoto || '/placeholder-property.jpg'}
                          alt={listing.searchResultsText}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-white/90 text-gray-900">
                            {listing.listingType === 'manufactured_home' ? 'MH' : 'RV'}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {listing.year} {listing.make} {listing.model}
                        </h3>
                        <p className="text-2xl font-bold mb-2" style={{ color: companyBranding?.primaryColor }}>
                          ${(listing.salePrice || listing.rentPrice || 0).toLocaleString()}
                          {listing.offerType === 'for_rent' && <span className="text-sm font-normal">/month</span>}
                        </p>
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {listing.location.city}, {listing.location.state}
                        </div>
                        {listing.listingType === 'manufactured_home' && (listing.bedrooms || listing.bathrooms) && (
                          <div className="flex items-center text-gray-600 text-sm">
                            <Home className="h-4 w-4 mr-1" />
                            {listing.bedrooms}bd {listing.bathrooms}ba
                          </div>
                        )}
                        <div className="flex items-center text-gray-600 text-sm mt-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          {listing.year}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="flex p-4 space-x-4"
                      onClick={() => window.location.href = `/${companySlug}/listing/${listing.id}`}
                    >
                      <div className="w-48 h-32 flex-shrink-0">
                        <img
                          src={listing.media.primaryPhoto || '/placeholder-property.jpg'}
                          alt={listing.searchResultsText}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                              {listing.year} {listing.make} {listing.model}
                            </h3>
                            <p className="text-2xl font-bold mb-2" style={{ color: companyBranding?.primaryColor }}>
                              ${(listing.salePrice || listing.rentPrice || 0).toLocaleString()}
                              {listing.offerType === 'for_rent' && <span className="text-sm font-normal">/month</span>}
                            </p>
                          </div>
                          <Badge className="bg-gray-100 text-gray-900">
                            {listing.listingType === 'manufactured_home' ? 'Manufactured Home' : 'RV'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-gray-600 text-sm mb-2">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {listing.location.city}, {listing.location.state}
                          </div>
                          {listing.listingType === 'manufactured_home' && (listing.bedrooms || listing.bathrooms) && (
                            <div className="flex items-center">
                              <Home className="h-4 w-4 mr-1" />
                              {listing.bedrooms}bd {listing.bathrooms}ba
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {listing.year}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{listing.searchResultsText}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No properties found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search filters to find more properties.</p>
              <Button 
                onClick={() => {
                  setSearchQuery('')
                  setTypeFilter('all')
                  setOfferFilter('all')
                  setPriceRange({ min: '', max: '' })
                  setBedroomsFilter('all')
                  updateFilters({})
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-4 mt-8">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex items-center space-x-2">
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const pageNumber = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                if (pageNumber <= totalPages) {
                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  )
                }
                return null
              })}
            </div>
            
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              {companyBranding?.logo && (
                <img
                  src={companyBranding.logo}
                  alt={companyBranding.name}
                  className="h-8 w-auto"
                />
              )}
              <span className="font-semibold">{companyBranding?.name}</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              {companyBranding?.phone && (
                <a href={`tel:${companyBranding.phone}`} className="hover:text-primary">
                  {companyBranding.phone}
                </a>
              )}
              {companyBranding?.email && (
                <a href={`mailto:${companyBranding.email}`} className="hover:text-primary">
                  {companyBranding.email}
                </a>
              )}
              {companyBranding?.website && (
                <a
                  href={companyBranding.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} {companyBranding?.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}