import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Share2, 
  MoreVertical, 
  MapPin,
  Calendar,
  DollarSign,
  Home,
  Car,
  Settings
} from 'lucide-react'
import { ShareListingModal } from './components/ShareListingModal'

// Mock data for listings
const mockListings = [
  {
    id: 'listing_001',
    listingType: 'manufactured_home',
    year: 2023,
    make: 'Clayton',
    model: 'The Edge',
    title: '2023 Clayton The Edge - 3BR/2BA',
    offerType: 'for_sale',
    salePrice: 89000,
    rentPrice: null,
    status: 'active',
    location: {
      city: 'Austin',
      state: 'TX',
      postalCode: '78701'
    },
    bedrooms: 3,
    bathrooms: 2,
    dimensions: {
      width_ft: 28,
      length_ft: 52
    },
    media: {
      primaryPhoto: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      photos: [
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'
      ]
    },
    description: 'Beautiful 3 bedroom, 2 bathroom manufactured home with modern finishes and open floor plan.',
    searchResultsText: '2023 Clayton The Edge 3BR/2BA - Move-in Ready!',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'listing_002',
    listingType: 'rv',
    year: 2022,
    make: 'Forest River',
    model: 'Cherokee',
    title: '2022 Forest River Cherokee - Travel Trailer',
    offerType: 'both',
    salePrice: 45000,
    rentPrice: 350,
    status: 'active',
    location: {
      city: 'Dallas',
      state: 'TX',
      postalCode: '75201'
    },
    sleeps: 6,
    slides: 2,
    length: 28.5,
    media: {
      primaryPhoto: 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg',
      photos: [
        'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg',
        'https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg'
      ]
    },
    description: 'Spacious travel trailer perfect for family adventures with slide-outs for extra room.',
    searchResultsText: '2022 Forest River Cherokee 28.5ft - Sleeps 6',
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-10T14:20:00Z'
  }
]

const PropertyListings = () => {
  const [listings, setListings] = useState(mockListings)
  const [filteredListings, setFilteredListings] = useState(mockListings)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterOfferType, setFilterOfferType] = useState('all')
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState(null)

  // Filter listings based on search and filters
  useEffect(() => {
    let filtered = listings

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.location.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(listing => listing.listingType === filterType)
    }

    // Apply offer type filter
    if (filterOfferType !== 'all') {
      filtered = filtered.filter(listing => 
        listing.offerType === filterOfferType || listing.offerType === 'both'
      )
    }

    setFilteredListings(filtered)
  }, [listings, searchQuery, filterType, filterOfferType])

  const handleShareListing = (listing) => {
    setSelectedListing(listing)
    setShareModalOpen(true)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const getListingTypeIcon = (type) => {
    return type === 'manufactured_home' ? Home : Car
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Property Listings</h1>
          <p className="text-muted-foreground">
            Manage your property listings and sharing options
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Listing
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="manufactured_home">Manufactured Homes</SelectItem>
                  <SelectItem value="rv">RV/Travel Trailers</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterOfferType} onValueChange={setFilterOfferType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Offer Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Offers</SelectItem>
                  <SelectItem value="for_sale">For Sale</SelectItem>
                  <SelectItem value="for_rent">For Rent</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listings.length}</div>
            <p className="text-xs text-muted-foreground">
              {listings.filter(l => l.status === 'active').length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Sale Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(listings.reduce((acc, l) => acc + (l.salePrice || 0), 0) / listings.length)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">New listings added</p>
          </CardContent>
        </Card>
      </div>

      {/* Listings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Listings ({filteredListings.length})</CardTitle>
          <CardDescription>
            View and manage all your property listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredListings.map((listing) => {
              const TypeIcon = getListingTypeIcon(listing.listingType)
              
              return (
                <div
                  key={listing.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {/* Property Image */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
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
                  </div>

                  {/* Property Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold truncate">{listing.title}</h3>
                      <Badge className={getStatusColor(listing.status)}>
                        {listing.status}
                      </Badge>
                      {listing.listingType === 'manufactured_home' ? (
                        <Badge variant="outline">MH</Badge>
                      ) : (
                        <Badge variant="outline">RV</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{listing.year} {listing.make} {listing.model}</span>
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {listing.location.city}, {listing.location.state}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(listing.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex-shrink-0 text-right">
                    {listing.salePrice && (
                      <div className="font-semibold text-green-600">
                        {formatPrice(listing.salePrice)}
                        {listing.offerType === 'both' && <span className="text-xs text-muted-foreground"> sale</span>}
                      </div>
                    )}
                    {listing.rentPrice && (
                      <div className="font-semibold text-blue-600">
                        {formatPrice(listing.rentPrice)}/mo
                        {listing.offerType === 'both' && <span className="text-xs text-muted-foreground"> rent</span>}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShareListing(listing)}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredListings.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No listings found matching your criteria</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Share Modal */}
      <ShareListingModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        listing={selectedListing}
      />
    </div>
  )
}

export default PropertyListings