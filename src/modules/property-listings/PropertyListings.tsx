import React, { useState, useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Building, 
  Home, 
  DollarSign, 
  Search, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Users,
  Ruler,
  Share,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { mockPropertyListings } from '@/mocks/propertyListingsMock'

// Dashboard Component (Main View)
function PropertyListingsDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priceFilter, setPriceFilter] = useState('all')

  // Filter listings based on current filters
  const filteredListings = useMemo(() => {
    return mockPropertyListings.sampleListings.filter(listing => {
      const matchesSearch = searchTerm === '' || 
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.model.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || listing.status === statusFilter
      const matchesType = typeFilter === 'all' || listing.listingType === typeFilter
      
      let matchesPrice = true
      if (priceFilter !== 'all') {
        const price = listing.salePrice || listing.rentPrice || 0
        switch (priceFilter) {
          case 'under100k':
            matchesPrice = price < 100000
            break
          case '100k-300k':
            matchesPrice = price >= 100000 && price <= 300000
            break
          case 'over300k':
            matchesPrice = price > 300000
            break
        }
      }

      return matchesSearch && matchesStatus && matchesType && matchesPrice
    })
  }, [searchTerm, statusFilter, typeFilter, priceFilter])

  // Calculate statistics
  const stats = useMemo(() => {
    const total = mockPropertyListings.sampleListings.length
    const active = mockPropertyListings.sampleListings.filter(l => l.status === 'active').length
    const totalPrices = mockPropertyListings.sampleListings
      .map(l => l.salePrice || l.rentPrice || 0)
      .filter(p => p > 0)
    const avgPrice = totalPrices.length > 0 
      ? Math.round(totalPrices.reduce((sum, price) => sum + price, 0) / totalPrices.length)
      : 0

    return { total, active, avgPrice }
  }, [])

  const formatPrice = (listing: any) => {
    if (listing.salePrice) {
      return `$${listing.salePrice.toLocaleString()}`
    }
    if (listing.rentPrice) {
      return `$${listing.rentPrice.toLocaleString()}/mo`
    }
    return 'Price on request'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'draft': return 'bg-yellow-500'
      case 'inactive': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'manufactured_home': return 'bg-blue-500'
      case 'rv': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Property Listings Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your manufactured home and RV listings
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Share className="h-4 w-4" />
            Share All Listings
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Listing
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All property listings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
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
            <div className="text-2xl font-bold">${stats.avgPrice.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all listings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>
            Find specific listings using the filters below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by title, description, city, make, model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Row */}
          <div className="grid gap-4 md:grid-cols-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

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

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under100k">Under $100K</SelectItem>
                <SelectItem value="100k-300k">$100K - $300K</SelectItem>
                <SelectItem value="over300k">Over $300K</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Listings Grid */}
      {filteredListings.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={listing.media.primaryPhoto}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 flex gap-2">
                  <Badge className={`${getStatusColor(listing.status)} text-white`}>
                    {listing.status}
                  </Badge>
                  <Badge className={`${getTypeColor(listing.listingType)} text-white`}>
                    {listing.listingType === 'manufactured_home' ? 'MH' : 'RV'}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-black/70 text-white">
                    {formatPrice(listing)}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{listing.title}</h3>
                  <p className="text-sm text-muted-foreground">{listing.year} {listing.make} {listing.model}</p>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {listing.location.city}, {listing.location.state}
                  </div>

                  {/* Property Details */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {listing.listingType === 'manufactured_home' ? (
                      <>
                        {listing.bedrooms && (
                          <div className="flex items-center">
                            <Bed className="h-4 w-4 mr-1" />
                            {listing.bedrooms}
                          </div>
                        )}
                        {listing.bathrooms && (
                          <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            {listing.bathrooms}
                          </div>
                        )}
                        {listing.dimensions?.squareFeet && (
                          <div className="flex items-center">
                            <Square className="h-4 w-4 mr-1" />
                            {listing.dimensions.squareFeet} sq ft
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
                        {listing.dimensions?.length && (
                          <div className="flex items-center">
                            <Ruler className="h-4 w-4 mr-1" />
                            {listing.dimensions.length}ft
                          </div>
                        )}
                        {listing.slides && (
                          <div className="flex items-center">
                            <span className="text-xs mr-1">📐</span>
                            {listing.slides} slides
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Building className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No listings found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Listing
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Main PropertyListings Component with Routing
export default function PropertyListings() {
  return (
    <Routes>
      <Route path="/" element={<PropertyListingsDashboard />} />
      <Route path="*" element={<PropertyListingsDashboard />} />
    </Routes>
  )
}