import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Download,
  Share,
  Home,
  Car
} from 'lucide-react'
import { usePropertyListings } from './hooks/usePropertyListings'
import { PropertyListing } from './types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { EmptyState } from '@/components/ui/empty-state'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default function PropertyListings() {
  const navigate = useNavigate()
  const { listings, loading, deleteListing, exportListings, filterListings } = usePropertyListings()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedListings, setSelectedListings] = useState<string[]>([])

  // Apply filters
  const filteredListings = filterListings({
    search: searchTerm,
    listingType: typeFilter === 'all' ? undefined : typeFilter,
    status: statusFilter === 'all' ? undefined : statusFilter
  })

  const handleCreateListing = () => {
    navigate('/property/listings/new')
  }

  const handleEditListing = (id: string) => {
    navigate(`/property/listings/${id}/edit`)
  }

  const handleViewListing = (id: string) => {
    navigate(`/property/listings/${id}`)
  }

  const handleDeleteListing = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      await deleteListing(id)
    }
  }

  const handleBulkExport = async () => {
    if (selectedListings.length === 0) {
      alert('Please select listings to export')
      return
    }
    
    // For now, just export to a mock partner
    await exportListings('default-partner', selectedListings)
    setSelectedListings([])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'rv' ? Car : Home
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading property listings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Property Listings</h1>
          <p className="text-muted-foreground">
            Manage your property listings and syndication
          </p>
        </div>
        <Button onClick={handleCreateListing}>
          <Plus className="h-4 w-4 mr-2" />
          New Listing
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">RV Listings</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {listings.filter(l => l.listingType === 'rv').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manufactured Homes</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {listings.filter(l => l.listingType === 'manufactured_home').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
            <span className="text-lg">$</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {listings.length > 0 
                ? formatCurrency(
                    listings.reduce((sum, l) => sum + (l.salePrice || l.rentPrice || 0), 0) / listings.length
                  ).replace('$', '')
                : '0'
              }
            </div>
          </CardContent>
        </Card>
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="rv">RV</SelectItem>
                <SelectItem value="manufactured_home">Manufactured Home</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {selectedListings.length > 0 && (
              <Button onClick={handleBulkExport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export ({selectedListings.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <EmptyState
          title="No listings found"
          description="Create your first property listing to get started"
          icon={<Home className="h-12 w-12" />}
          action={{
            label: "Create Listing",
            onClick: handleCreateListing
          }}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing) => {
            const TypeIcon = getTypeIcon(listing.listingType)
            
            return (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="relative h-48 bg-gray-100">
                  {listing.media.primaryPhoto ? (
                    <img
                      src={listing.media.primaryPhoto}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <TypeIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <Badge className={`absolute top-2 left-2 ${getStatusColor(listing.status)}`}>
                    {listing.status}
                  </Badge>
                  
                  {/* Actions Menu */}
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewListing(listing.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditListing(listing.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteListing(listing.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg leading-tight">{listing.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {listing.year} {listing.make} {listing.model}
                      </p>
                    </div>
                    
                    {/* Specs */}
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {listing.listingType === 'rv' && (
                        <>
                          {listing.sleeps && <span>Sleeps {listing.sleeps}</span>}
                          {listing.length && <span>{listing.length}ft</span>}
                          {listing.slides && <span>{listing.slides} slides</span>}
                        </>
                      )}
                      {listing.listingType === 'manufactured_home' && (
                        <>
                          {listing.bedrooms && <span>{listing.bedrooms}BR</span>}
                          {listing.bathrooms && <span>{listing.bathrooms}BA</span>}
                          {listing.dimensions?.sqft && <span>{listing.dimensions.sqft} sqft</span>}
                        </>
                      )}
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        {listing.salePrice && (
                          <div className="text-lg font-bold text-primary">
                            {formatCurrency(listing.salePrice)}
                          </div>
                        )}
                        {listing.rentPrice && (
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(listing.rentPrice)}/month
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {listing.location.city}, {listing.location.state}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}