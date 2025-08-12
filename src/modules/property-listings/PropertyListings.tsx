import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Share2,
  Eye,
  Edit,
  MoreHorizontal,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react'
import { ShareAllListingsModal } from './components/ShareAllListingsModal'
import { ShareListingModal } from './components/ShareListingModal'
import PublicListingView from './components/PublicListingView'
import ListingForm from './components/ListingForm'

// Import mock data robustly
import * as ListingsMock from '@/mocks/listingsMock'
const asArray = (val: any) => Array.isArray(val) ? val
  : Array.isArray(val?.listings) ? val.listings
  : Array.isArray(val?.sampleListings) ? val.sampleListings
  : Array.isArray(val?.default) ? val.default
  : []
const listings = asArray((ListingsMock as any))

function PropertyListingsDashboard() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [shareAllModalOpen, setShareAllModalOpen] = useState(false)
  const [shareListingOpen, setShareListingOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState<any>(null)
  
  // Calculate summary statistics
  const totalListings = listings.length
  const activeListings = listings.filter((l: any) => l.status === 'active').length
  const totalValue = listings.reduce((sum: number, l: any) => sum + (l.salePrice || l.rentPrice || 0), 0)
  const averagePrice = totalListings > 0 ? Math.round(totalValue / totalListings) : 0

  // Filter listings based on search
  const filteredListings = listings.filter((listing: any) => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      listing.make?.toLowerCase().includes(searchLower) ||
      listing.model?.toLowerCase().includes(searchLower) ||
      listing.location?.city?.toLowerCase().includes(searchLower) ||
      listing.location?.state?.toLowerCase().includes(searchLower)
    )
  })

  const formatPrice = (listing: any) => {
    if (listing.salePrice) {
      return `$${listing.salePrice.toLocaleString()}`
    }
    if (listing.rentPrice) {
      return `$${listing.rentPrice.toLocaleString()}/mo`
    }
    return 'Price on request'
  }

  const formatLocation = (listing: any) => {
    if (listing.location?.city && listing.location?.state) {
      return `${listing.location.city}, ${listing.location.state}`
    }
    return 'Location TBD'
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Property Listings</h1>
            <p className="text-muted-foreground">Manage your property inventory</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShareAllModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share All
            </Button>
            <Button onClick={() => navigate('/property/new')} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Listing
            </Button>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalListings}</div>
              <p className="text-xs text-muted-foreground">
                {activeListings} active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeListings}</div>
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
              <div className="text-2xl font-bold">${averagePrice.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across all listings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
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

        {/* List View */}
        <div className="space-y-4">
          {filteredListings.map((listing: any) => (
            <Card key={listing.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={listing.media?.primaryPhoto || '/api/placeholder/100/100'}
                      alt={`${listing.year} ${listing.make} ${listing.model}`}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">
                        {listing.year} {listing.make} {listing.model}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {formatLocation(listing)}
                        </span>
                        <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                          {listing.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold text-lg">
                        {formatPrice(listing)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/property/listing/${listing.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedListing(listing)
                          setShareListingOpen(true)
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modals */}
        <ShareAllListingsModal
          open={shareAllModalOpen}
          onOpenChange={setShareAllModalOpen}
          listings={listings}
          summaryStats={{ totalListings, activeListings, averagePrice }}
        />
        
        <ShareListingModal
          open={shareListingOpen}
          onOpenChange={setShareListingOpen}
          listing={selectedListing}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Property Listings</h1>
          <p className="text-muted-foreground">Manage your property inventory</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShareAllModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share All
          </Button>
          <Button onClick={() => navigate('/property/new')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Listing
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalListings}</div>
            <p className="text-xs text-muted-foreground">
              {activeListings} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeListings}</div>
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
            <div className="text-2xl font-bold">${averagePrice.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all listings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
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

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Grid View */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredListings.map((listing: any) => (
          <Card key={listing.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={listing.media?.primaryPhoto || '/api/placeholder/400/250'}
                alt={`${listing.year} ${listing.make} ${listing.model}`}
                className="w-full h-48 object-cover"
              />
              <Badge 
                className="absolute top-2 left-2"
                variant={listing.listingType === 'manufactured_home' ? 'default' : 'secondary'}
              >
                {listing.listingType === 'manufactured_home' ? 'MH' : 'RV'}
              </Badge>
              <Badge 
                className="absolute top-2 right-2"
                variant={listing.status === 'active' ? 'default' : 'secondary'}
              >
                {listing.status}
              </Badge>
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">
                  {listing.year} {listing.make} {listing.model}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {formatLocation(listing)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-lg font-bold text-green-600">
                    {formatPrice(listing)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/property/listing/${listing.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedListing(listing)
                        setShareListingOpen(true)
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
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
              <p>Try adjusting your search criteria</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <ShareAllListingsModal
        open={shareAllModalOpen}
        onOpenChange={setShareAllModalOpen}
        listings={listings}
        summaryStats={{ totalListings, activeListings, averagePrice }}
      />
      
      <ShareListingModal
        open={shareListingOpen}
        onOpenChange={setShareListingOpen}
        listing={selectedListing}
      />
    </div>
  )
}

export default function PropertyListings() {
  return (
    <Routes>
      <Route path="/" element={<PropertyListingsDashboard />} />
      <Route path="/listing/:listingId" element={<PublicListingView />} />
      <Route path="/new" element={<ListingForm />} />
    </Routes>
  )
}