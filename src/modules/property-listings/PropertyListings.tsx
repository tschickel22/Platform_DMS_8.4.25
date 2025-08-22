import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Home, 
  DollarSign, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Share2
} from 'lucide-react'

// Mock data embedded to avoid import issues
const mockListings = {
  sampleListings: [
    {
      id: '1',
      title: 'Modern Downtown Apartment',
      description: 'Beautiful modern apartment in the heart of downtown with stunning city views.',
      address: '123 Main St, Downtown',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      listingType: 'rent',
      rent: 2500,
      purchasePrice: null,
      bedrooms: 2,
      bathrooms: 2,
      squareFootage: 1200,
      propertyType: 'apartment',
      status: 'active',
      images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'],
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Cozy Suburban House',
      description: 'Charming 3-bedroom house in quiet suburban neighborhood.',
      address: '456 Oak Ave, Suburbia',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      listingType: 'rent',
      rent: 3200,
      purchasePrice: null,
      bedrooms: 3,
      bathrooms: 2,
      squareFootage: 1800,
      propertyType: 'house',
      status: 'active',
      images: ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'],
      createdAt: '2024-01-10T14:30:00Z'
    },
    {
      id: '3',
      title: 'Luxury Waterfront Condo',
      description: 'Stunning waterfront condominium with panoramic water views.',
      address: '789 Waterfront Blvd, Marina District',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      listingType: 'sale',
      rent: null,
      purchasePrice: 850000,
      bedrooms: 2,
      bathrooms: 3,
      squareFootage: 1600,
      propertyType: 'condo',
      status: 'pending',
      images: ['https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg'],
      createdAt: '2024-01-20T09:15:00Z'
    }
  ]
}

function PropertyListingsMain() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Filter listings based on search and filters
  const filteredListings = mockListings.sampleListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter
    const matchesType = typeFilter === 'all' || listing.propertyType === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'sold': return 'bg-blue-100 text-blue-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatPrice = (listing: any) => {
    if (listing.listingType === 'rent') {
      return `$${listing.rent?.toLocaleString()}/mo`
    } else {
      return `$${listing.purchasePrice?.toLocaleString()}`
    }
  }

  // Calculate statistics
  const totalListings = mockListings.sampleListings.length
  const activeListings = mockListings.sampleListings.filter(l => l.status === 'active').length
  const pendingListings = mockListings.sampleListings.filter(l => l.status === 'pending').length
  const avgPrice = Math.round(mockListings.sampleListings.reduce((sum, l) => 
    sum + (l.rent || l.purchasePrice || 0), 0) / totalListings)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Property Listings</h1>
          <p className="text-muted-foreground">Manage your property inventory</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Listing
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalListings}</div>
            <p className="text-xs text-muted-foreground">
              All properties in system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
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
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingListings}</div>
            <p className="text-xs text-muted-foreground">
              Under contract
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgPrice.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Average listing price
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="manufactured_home">Manufactured Home</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredListings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge className={getStatusColor(listing.status)}>
                  {listing.status}
                </Badge>
              </div>
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{listing.title}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {listing.address}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    {formatPrice(listing)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  {listing.bedrooms} bed
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  {listing.bathrooms} bath
                </div>
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  {listing.squareFootage} sqft
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {listing.description}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-muted-foreground">
              <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium mb-2">No listings found</p>
              <p>Try adjusting your search criteria or add a new listing</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function PropertyListings() {
  return (
    <Routes>
      <Route path="/" element={<PropertyListingsMain />} />
      <Route path="/*" element={<PropertyListingsMain />} />
    </Routes>
  )
}