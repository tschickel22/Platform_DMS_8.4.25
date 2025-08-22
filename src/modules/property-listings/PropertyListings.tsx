import React, { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Home, 
  Calendar,
  Eye,
  Edit,
  Share2,
  MoreHorizontal
} from 'lucide-react'
import { mockListings } from '@/mocks/listingsMock'
import ListingForm from './components/ListingForm'
import ListingDetail from './components/ListingDetail'
import ListingOverview from './components/ListingOverview'

function PropertyListingsDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  // Filter listings based on search and filters
  const filteredListings = mockListings.sampleListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || listing.status === selectedStatus
    const matchesType = selectedType === 'all' || listing.propertyType === selectedType
    
    return matchesSearch && matchesStatus && matchesType
  })

  // Get statistics
  const stats = {
    total: mockListings.sampleListings.length,
    active: mockListings.sampleListings.filter(l => l.status === 'active').length,
    pending: mockListings.sampleListings.filter(l => l.status === 'pending').length,
    sold: mockListings.sampleListings.filter(l => l.status === 'sold').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Property Listings</h1>
          <p className="text-muted-foreground">
            Manage your property listings and syndication
          </p>
        </div>
        <Link to="/listings/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Listing
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <div className="h-2 w-2 bg-yellow-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sold/Rented</CardTitle>
            <div className="h-2 w-2 bg-blue-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sold}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold/Rented</option>
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="manufactured_home">Manufactured Home</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredListings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={listing.images[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                  {listing.status}
                </Badge>
              </div>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{listing.title}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {listing.address}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-lg font-semibold">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {listing.listingType === 'rent' 
                      ? `$${listing.rent?.toLocaleString()}/mo`
                      : `$${listing.purchasePrice?.toLocaleString()}`
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {listing.bedrooms}bd • {listing.bathrooms}ba
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex gap-1">
                    <Link to={`/listings/${listing.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Link to={`/listings/${listing.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Home className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No listings found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedStatus !== 'all' || selectedType !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first property listing'
                }
              </p>
              {!searchTerm && selectedStatus === 'all' && selectedType === 'all' && (
                <Link to="/listings/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Listing
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function PropertyListings() {
  return (
    <div className="space-y-6">
      <Routes>
        <Route path="/" element={<PropertyListingsDashboard />} />
        <Route path="/overview" element={<ListingOverview />} />
        <Route path="/new" element={<ListingForm />} />
        <Route path="/:id" element={<ListingDetail />} />
        <Route path="/:id/edit" element={<ListingForm />} />
      </Routes>
    </div>
  )
}