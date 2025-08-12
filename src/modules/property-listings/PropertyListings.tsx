import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Eye, 
  Edit, 
  Trash2, 
  DollarSign, 
  Home,
  Building
} from 'lucide-react'

// robust mock fallback
import * as ListingsMock from '@/mocks/listingsMock'

type Listing = any

const asArray = (val: any): Listing[] =>
  Array.isArray(val)
    ? val
    : Array.isArray(val?.listings)
    ? val.listings
    : Array.isArray(val?.sampleListings)
    ? val.sampleListings
    : Array.isArray(val?.mockListings)
    ? val.mockListings
    : Array.isArray(val?.default)
    ? val.default
    : []

/**
 * If a shared hook exists, use it:
 *   import { usePropertyListings } from '@/hooks/usePropertyListings' (or '@/modules/property-listings/hooks/usePropertyListings')
 *   const { listings } = usePropertyListings()
 * Otherwise, keep the fallback below.
 */
const ALL_LISTINGS: Listing[] = asArray(ListingsMock)

function PropertyListingsDashboard() {
  const navigate = useNavigate()
  
  // filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'inactive'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'manufactured_home' | 'rv'>('all')
  const [priceFilter, setPriceFilter] = useState<'all' | 'under100k' | '100k-300k' | 'over300k'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // which summary tile is active (for highlight)
  const [activeTile, setActiveTile] = useState<'all' | 'active' | 'premium'>('all')

  // source of truth for data
  const listings = ALL_LISTINGS ?? []

  // price helper
  const priceOf = (l: Listing): number =>
    Number(l?.salePrice ?? l?.rentPrice ?? 0) || 0

  // Safe stats (fixes NaN and recomputes correctly)
  const stats = useMemo(() => {
    const total = listings.length
    const active = listings.filter((l) => (l?.status || '').toLowerCase() === 'active').length
    const prices = listings.map(priceOf).filter((n) => Number.isFinite(n) && n > 0)
    const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0
    return { total, active, avgPrice }
  }, [listings])

  // Wire the summary tiles → filters (add handlers)
  const activateAll = () => {
    setActiveTile('all')
    setStatusFilter('all')
    setPriceFilter('all')
  }
  const activateActive = () => {
    setActiveTile('active')
    setStatusFilter('active')
    setPriceFilter('all')
  }
  // Use "Average Price" tile as a quick premium filter (> $300k)
  const activatePremium = () => {
    setActiveTile('premium')
    setPriceFilter('over300k')
    setStatusFilter('all')
  }

  // Use listings (not mockListings) for filtering results
  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    const withinPrice = (n: number) => {
      if (priceFilter === 'under100k') return n < 100_000
      if (priceFilter === '100k-300k') return n >= 100_000 && n <= 300_000
      if (priceFilter === 'over300k') return n > 300_000
      return true
    }

    return (listings ?? []).filter((l) => {
      const title = (l?.title || '').toLowerCase()
      const desc = (l?.description || '').toLowerCase()
      const city = (l?.location?.city || '').toLowerCase()
      const make = (l?.make || '').toLowerCase()
      const model = (l?.model || '').toLowerCase()
      const matchesSearch = !q || [title, desc, city, make, model].some((s) => s.includes(q))

      const status = (l?.status || '').toLowerCase()
      const type = (l?.listingType || '').toLowerCase()

      const matchesStatus = statusFilter === 'all' || status === statusFilter
      const matchesType = typeFilter === 'all' || type === typeFilter
      const matchesPrice = withinPrice(priceOf(l))

      return matchesSearch && matchesStatus && matchesType && matchesPrice
    })
  }, [listings, searchTerm, statusFilter, typeFilter, priceFilter])

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatPrice = (listing: any) => {
    const price = priceOf(listing)
    if (price === 0) return 'Contact for Price'
    return `$${price.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Listings Dashboard</h1>
          <p className="text-gray-600">Manage your property listings and inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate('/property/listings/new')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Listing
          </Button>
        </div>
      </div>

      {/* Stats (clickable, PDI-style colors) */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Listings */}
        <Card
          onClick={activateAll}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && activateAll()}
          className={cn(
            'shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 cursor-pointer',
            activeTile === 'all' && 'ring-2 ring-blue-300'
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Listings</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            <p className="text-xs text-blue-600">All property listings</p>
          </CardContent>
        </Card>

        {/* Active Listings */}
        <Card
          onClick={activateActive}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && activateActive()}
          className={cn(
            'shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50 cursor-pointer',
            activeTile === 'active' && 'ring-2 ring-green-300'
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Active Listings</CardTitle>
            <Home className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.active}</div>
            <p className="text-xs text-green-600">Available for rent/sale</p>
          </CardContent>
        </Card>

        {/* Average Price → Premium shortcut */}
        <Card
          onClick={activatePremium}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && activatePremium()}
          className={cn(
            'shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50 cursor-pointer',
            activeTile === 'premium' && 'ring-2 ring-yellow-300'
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">${stats.avgPrice.toLocaleString()}</div>
            <p className="text-xs text-yellow-600">Click to view premium (&gt;$300k)</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by title, description, location, make, model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Filter Dropdowns */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={statusFilter} onValueChange={(v: any) => { setStatusFilter(v); setActiveTile('all') }}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={(v: any) => { setTypeFilter(v); setActiveTile('all') }}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="manufactured_home">Manufactured Home</SelectItem>
                  <SelectItem value="rv">RV</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={(v: any) => { setPriceFilter(v); setActiveTile('all') }}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under100k">Under $100k</SelectItem>
                  <SelectItem value="100k-300k">$100k - $300k</SelectItem>
                  <SelectItem value="over300k">Over $300k</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filtered.length} listing{filtered.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Listings Grid */}
      {viewMode === 'grid' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((listing) => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-100 relative">
                {listing.media?.primaryPhoto ? (
                  <img
                    src={listing.media.primaryPhoto}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Home className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge className={getStatusColor(listing.status)}>
                    {listing.status || 'Draft'}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {listing.title || `${listing.year} ${listing.make} ${listing.model}`}
                  </h3>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{listing.year} {listing.make} {listing.model}</p>
                    {listing.location?.city && (
                      <p>{listing.location.city}, {listing.location.state}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold text-green-600">
                      {formatPrice(listing)}
                    </span>
                    <Badge variant="outline">
                      {listing.listingType === 'manufactured_home' ? 'MH' : 'RV'}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filtered.map((listing) => (
                <div key={listing.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                      {listing.media?.primaryPhoto ? (
                        <img
                          src={listing.media.primaryPhoto}
                          alt={listing.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Home className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {listing.title || `${listing.year} ${listing.make} ${listing.model}`}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {listing.year} {listing.make} {listing.model}
                          </p>
                          {listing.location?.city && (
                            <p className="text-sm text-gray-500">
                              {listing.location.city}, {listing.location.state}
                            </p>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600 mb-1">
                            {formatPrice(listing)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(listing.status)}>
                              {listing.status || 'Draft'}
                            </Badge>
                            <Badge variant="outline">
                              {listing.listingType === 'manufactured_home' ? 'MH' : 'RV'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filtered.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Home className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || priceFilter !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Get started by creating your first property listing.'}
              </p>
              <Button onClick={() => navigate('/property/listings/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Listing
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function PropertyListings() {
  return <PropertyListingsDashboard />
}