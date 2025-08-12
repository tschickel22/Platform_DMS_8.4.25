import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Grid, 
  List, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Users, 
  Ruler,
  Share,
  Plus,
  Home,
  DollarSign,
  Eye
} from 'lucide-react'
import { mockListings } from '@/mocks/listingsMock'
import { ShareAllListingsModal } from './components/ShareAllListingsModal'

export default function PropertyListings() {
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
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.state.toLowerCase().includes(searchTerm.toLowerCase())

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
    const totalValue = filteredListings.reduce((sum, listing) => {
      return sum + (listing.salePrice || listing.rentPrice || 0)
    }, 0)
    const averagePrice = totalListings > 0 ? Math.round(totalValue / totalListings) : 0

    return {
      totalListings,
      activeListings,
      averagePrice,
      totalValue
    }
  }, [filteredListings])

  const handleListingClick = (listingId: string) => {
    navigate(`/listings/${listingId}`)
  }

  const formatPrice = (listing: any) => {
    if (listing.salePrice) {
      return `$${listing.salePrice.toLocaleString()}`
    } else if (listing.rentPrice) {
      return `$${listing.rentPrice.toLocaleString()}/mo`
    }
    return 'Price on request'
  }

  const getListingSpecs = (listing: any) => {
    const specs = []
    if (listing.bedrooms) specs.push(`${listing.bedrooms} bed`)
    if (listing.bathrooms) specs.push(`${listing.bathrooms} bath`)
    if (listing.sleeps) specs.push(`Sleeps ${listing.sleeps}`)
    if (listing.length) specs.push(`${listing.length} ft`)
    if (listing.slides) specs.push(`${listing.slides} slides`)
    return specs
  }

  return (
    <div className="space-y-6">
      {/* Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Property Listings Dashboard</h1>
          <p className="text-muted-foreground">Manage and track all your property listings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShareAllModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Share className="h-4 w-4" />
            Share All Listings
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Listing
          </Button>
        </div>
      </div>

      {/* Summary Statistics Cards */}
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
              Available for rent/sale
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
              Total value: ${summaryStats.totalValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="manufactured_home">Manufactured Home</SelectItem>
                <SelectItem value="rv">RV</SelectItem>
              </SelectContent>
            </Select>

            <Select value={offerFilter} onValueChange={setOfferFilter}>
              <SelectTrigger>
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
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />

            <Input
              placeholder="Max Price"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />

            <div className="flex items-center gap-2">
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
        </CardContent>
      </Card>

      {/* Listings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            All Listings ({filteredListings.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            All property listings in the system
          </p>
        </div>

        {/* Listings Grid */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredListings.map((listing) => (
            <Card 
              key={listing.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleListingClick(listing.id)}
            >
              <div className="relative">
                <img
                  src={listing.images[0] || '/placeholder-property.jpg'}
                  alt={listing.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant={listing.listingType === 'manufactured_home' ? 'default' : 'secondary'}>
                    {listing.listingType === 'manufactured_home' ? 'MH' : 'RV'}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="bg-white/90">
                    {listing.status === 'active' ? 'Active' : listing.status}
                  </Badge>
                </div>
                {(listing.salePrice || listing.rentPrice) && (
                  <div className="absolute bottom-2 right-2">
                    <Badge className="bg-black/80 text-white">
                      {formatPrice(listing)}
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{listing.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {listing.year} {listing.make} {listing.model}
                  </p>
                  
                  {/* Specs */}
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    {getListingSpecs(listing).map((spec, index) => (
                      <span key={index} className="flex items-center gap-1">
                        {spec.includes('bed') && <Bed className="h-3 w-3" />}
                        {spec.includes('bath') && <Bath className="h-3 w-3" />}
                        {spec.includes('Sleeps') && <Users className="h-3 w-3" />}
                        {spec.includes('ft') && <Ruler className="h-3 w-3" />}
                        {spec.includes('slides') && <Square className="h-3 w-3" />}
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {listing.location.city}, {listing.location.state}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No listings found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>

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