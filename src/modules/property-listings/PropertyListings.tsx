import React, { useState, useMemo } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  MapPin, 
  Calendar,
  Share2,
  Home,
  DollarSign,
  Eye
} from 'lucide-react'
import { mockListings } from '@/mocks/listingsMock'
import { ShareAllListingsModal } from './components/ShareAllListingsModal'
import { PublicListingView } from './components/PublicListingView'

function PropertyListingsDashboard() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [offerFilter, setOfferFilter] = useState('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [shareAllModalOpen, setShareAllModalOpen] = useState(false)

  // Filter listings based on search and filters
  const filteredListings = useMemo(() => {
    return mockListings.sampleListings.filter(listing => {
      const matchesSearch = !searchTerm || 
        listing.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location?.state?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = typeFilter === 'all' || listing.listingType === typeFilter
      const matchesOffer = offerFilter === 'all' || listing.offerType === offerFilter

      const price = listing.salePrice || listing.rentPrice || 0
      const matchesMinPrice = !minPrice || price >= parseInt(minPrice)
      const matchesMaxPrice = !maxPrice || price <= parseInt(maxPrice)

      return matchesSearch && matchesType && matchesOffer && matchesMinPrice && matchesMaxPrice
    })
  }, [searchTerm, typeFilter, offerFilter, minPrice, maxPrice])

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalListings = filteredListings.length
    const activeListings = filteredListings.filter(l => l.status === 'active').length
    const totalValue = filteredListings.reduce((sum, l) => sum + (l.salePrice || l.rentPrice || 0), 0)
    const averagePrice = totalListings > 0 ? Math.round(totalValue / totalListings) : 0

    return {
      totalListings,
      activeListings,
      averagePrice
    }
  }, [filteredListings])

  const handleListingClick = (listingId: string) => {
    navigate(`/property/listing/${listingId}`)
  }

  const formatPrice = (listing: any) => {
    if (listing.salePrice) {
      return `$${listing.salePrice.toLocaleString()}`
    }
    if (listing.rentPrice) {
      return `$${listing.rentPrice.toLocaleString()}/mo`
    }
    return 'Price on request'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Property Listings</h1>
          <p className="text-muted-foreground">Browse available manufactured homes and RVs</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShareAllModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share All Listings
          </Button>
          <Button onClick={() => navigate('/property/new')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Listing
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalListings}</div>
            <p className="text-xs text-muted-foreground">
              {summaryStats.activeListings} active listings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.activeListings}</div>
            <p className="text-xs text-muted-foreground">
              Currently available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summaryStats.averagePrice.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all listings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by make, model, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="manufactured_home">Manufactured Home</SelectItem>
                  <SelectItem value="rv">RV</SelectItem>
                </SelectContent>
              </Select>
              <Select value={offerFilter} onValueChange={setOfferFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Offers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Offers</SelectItem>
                  <SelectItem value="for_sale">For Sale</SelectItem>
                  <SelectItem value="for_rent">For Rent</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-[100px]"
                type="number"
              />
              <Input
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-[100px]"
                type="number"
              />
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
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

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Listings Grid */}
      <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
        {filteredListings.map((listing) => (
          <Card 
            key={listing.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleListingClick(listing.id)}
          >
            <div className="relative">
              <img
                src={listing.media?.primaryPhoto || '/api/placeholder/400/250'}
                alt={`${listing.year} ${listing.make} ${listing.model}`}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <Badge 
                className="absolute top-2 left-2"
                variant={listing.listingType === 'manufactured_home' ? 'default' : 'secondary'}
              >
                {listing.listingType === 'manufactured_home' ? 'MH' : 'RV'}
              </Badge>
              {listing.status === 'pending' && (
                <Badge className="absolute top-2 right-2" variant="outline">
                  Pending
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">
                  {listing.listingType === 'manufactured_home' 
                    ? `${listing.bedrooms}BR Manufactured Home in ${listing.location?.city}`
                    : `${listing.year} ${listing.make} ${listing.model}`
                  }
                </h3>
                <p className="text-sm text-muted-foreground">
                  {listing.listingType === 'manufactured_home' 
                    ? `${listing.year} ${listing.make} ${listing.model}`
                    : `${listing.year} ${listing.make} ${listing.model}`
                  }
                </p>
                
                {/* Property Details */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {listing.listingType === 'manufactured_home' ? (
                    <>
                      <span className="flex items-center gap-1">
                        🛏️ {listing.bedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        🚿 {listing.bathrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        📐 {listing.dimensions?.width_ft && listing.dimensions?.length_ft 
                          ? `${listing.dimensions.width_ft}x${listing.dimensions.length_ft} ft`
                          : 'N/A'
                        }
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="flex items-center gap-1">
                        🛏️ Sleeps {listing.sleeps}
                      </span>
                      <span className="flex items-center gap-1">
                        📏 {listing.dimensions?.length_ft}ft
                      </span>
                      <span className="flex items-center gap-1">
                        🔄 {listing.slides} slides
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {listing.location?.city}, {listing.location?.state}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {formatPrice(listing)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium">No listings found</p>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Share All Listings Modal */}
      <ShareAllListingsModal
        open={shareAllModalOpen}
        onOpenChange={setShareAllModalOpen}
        listings={filteredListings}
        summaryStats={summaryStats}
      />
    </div>
  )
}

export default function PropertyListings() {
  return (
    <Routes>
      <Route path="/" element={<PropertyListingsDashboard />} />
      <Route path="/listing/:listingId" element={<PublicListingView />} />
      <Route path="/new" element={<div>Add New Listing Form</div>} />
    </Routes>
  )
}