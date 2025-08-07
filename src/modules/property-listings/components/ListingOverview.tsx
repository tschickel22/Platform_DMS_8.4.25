import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, Bed, Bath, Square, Eye, Edit, Trash2, 
  Home, Play, FileImage, DollarSign, Calendar,
  Share2,
  Filter,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Users,
  Building,
  Plus
} from 'lucide-react'
import { mockListings } from '@/mocks/listingsMock'
import ShareListingModal from './ShareListingModal'

interface Listing {
  id: string
  title: string
  description: string
  address: string
  rent: number
  bedrooms: number
  bathrooms: number
  squareFootage: number
  propertyType: string
  status: string
  amenities: string[]
  petPolicy: string
  images: string[]
  contactInfo: {
    phone: string
    email: string
  }
  createdAt: string
  updatedAt: string
  yearBuilt?: number
  manufacturer?: string
  model?: string
  communityName?: string
  videos?: string[]
  floorPlans?: string[]
  virtualTourUrl?: string
  purchasePrice?: number
}

type SortField = 'rent' | 'bedrooms' | 'bathrooms' | 'squareFootage' | 'updatedAt' | 'title'
type SortDirection = 'asc' | 'desc'

export default function ListingOverview() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState<SortField>('updatedAt')
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // Get unique statuses for filter dropdown
  const uniqueStatuses = useMemo(() => {
    const statuses = [...new Set(mockListings.map(listing => listing.status))]
    return statuses.sort()
  }, [])

  // Filter and sort listings
  const filteredAndSortedListings = useMemo(() => {
    let filtered = mockListings.filter(listing => {
      // Search filter
      const searchMatch = searchTerm === '' || 
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase())

      // Status filter
      const statusMatch = statusFilter === 'all' || listing.status.toLowerCase() === statusFilter.toLowerCase()

      return searchMatch && statusMatch
    })

    // Sort listings
    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      // Handle date sorting
      if (sortField === 'updatedAt') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [searchTerm, statusFilter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 text-primary" />
      : <ArrowDown className="h-4 w-4 text-primary" />
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'occupied':
      case 'rented':
        return 'bg-blue-100 text-blue-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setShareModalOpen(true)}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share All Listings
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filters
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShareModalOpen(true)}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share All Listings
              </Button>
              <Button asChild>
                <Link to="/listings/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Listing
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, address, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {uniqueStatuses.map(status => (
                    <SelectItem key={status} value={status.toLowerCase()}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Options */}
            <div className="w-full sm:w-48">
              <Select value={`${sortField}-${sortDirection}`} onValueChange={(value) => {
                const [field, direction] = value.split('-') as [SortField, SortDirection]
                setSortField(field)
                setSortDirection(direction)
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent-asc">Rent: Low to High</SelectItem>
                  <SelectItem value="rent-desc">Rent: High to Low</SelectItem>
                  <SelectItem value="bedrooms-asc">Bedrooms: Low to High</SelectItem>
                  <SelectItem value="bedrooms-desc">Bedrooms: High to Low</SelectItem>
                  <SelectItem value="squareFootage-asc">Size: Small to Large</SelectItem>
                  <SelectItem value="squareFootage-desc">Size: Large to Small</SelectItem>
                  <SelectItem value="updatedAt-desc">Recently Updated</SelectItem>
                  <SelectItem value="updatedAt-asc">Oldest Updated</SelectItem>
                  <SelectItem value="title-asc">Title: A to Z</SelectItem>
                  <SelectItem value="title-desc">Title: Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredAndSortedListings.length} of {mockListings.length} listings
            {searchTerm && ` matching "${searchTerm}"`}
            {statusFilter !== 'all' && ` with status "${statusFilter}"`}
          </div>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedListings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className={getStatusColor(listing.status)}>
                  {listing.status}
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-1">{listing.title}</CardTitle>
                <div className="text-right mb-4 space-y-1">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">
                      ${listing.rent.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>
                  
                  {listing.propertyType === 'manufactured_home' && listing.purchasePrice && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Purchase: </span>
                      <span className="font-semibold">${listing.purchasePrice.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
              <CardDescription className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="line-clamp-1">{listing.address}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {listing.description}
              </p>

              {/* Property Details */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    {listing.bedrooms}
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    {listing.bathrooms}
                  </div>
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    {listing.squareFootage.toLocaleString()} sq ft
                  </div>
                </div>
              </div>

              {listing.yearBuilt && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{listing.yearBuilt}</span>
                </div>
              )}

              {/* MH-Specific Info */}
              {listing.propertyType === 'manufactured_home' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 text-sm">
                  {listing.manufacturer && (
                    <div className="flex items-center space-x-2">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      <span>{listing.manufacturer} {listing.model}</span>
                    </div>
                  )}
                  {listing.communityName && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{listing.communityName}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Media Indicators */}
              {(listing.videos?.length > 0 || listing.floorPlans?.length > 0 || listing.virtualTourUrl) && (
                <div className="flex space-x-2 mb-4">
                  {listing.videos?.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      <Play className="h-3 w-3 mr-1" />
                      {listing.videos.length} Video{listing.videos.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                  {listing.floorPlans?.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      <FileImage className="h-3 w-3 mr-1" />
                      {listing.floorPlans.length} Floor Plan{listing.floorPlans.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                  {listing.virtualTourUrl && (
                    <Badge variant="outline" className="text-xs">
                      Virtual Tour
                    </Badge>
                  )}
                </div>
              )}

              {/* Amenities */}
              <div className="flex flex-wrap gap-1 mb-4">
                {listing.amenities.slice(0, 3).map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {listing.amenities.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{listing.amenities.length - 3} more
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button size="sm" className="flex-1">
                  Edit Listing
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedListings.length === 0 && (
        <Card 
          className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] border-2 hover:border-primary/20"
          onClick={() => handleStatusFilter('all')}
        >
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">No listings found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search criteria or filters'
                : 'Get started by adding your first property listing'
              }
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                }}
              >
                Clear Filters
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              Click to view all properties
            </p>
          </CardContent>
        </Card>
      )}

      <Card 
        className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] border-2 ${
          statusFilter === 'available' 
            ? 'border-green-200 bg-green-50/50' 
            : 'hover:border-green-200'
        }`}
        onClick={() => handleStatusFilter('available')}
      >
      </Card>

      {/* Share Modal */}
      <ShareListingModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        listingUrl="/public-listings/all"
        title="Share All Listings"
      />
    </div>
  )
}