import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Share2, 
  Search, 
  Filter,
  Building2,
  Home,
  DollarSign,
  MapPin,
  Bed,
  Bath,
  Square,
  Eye,
  Edit,
  Trash2,
  Users
} from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { mockPropertyListingsData, PropertyListing } from '@/mocks/propertyListingsMock'


export default function PropertyListings() {
  const { tenant } = useTenant()
  const [listings, setListings] = useState<PropertyListing[]>(mockPropertyListingsData.sampleListings)
  const [filteredListings, setFilteredListings] = useState<PropertyListing[]>(mockPropertyListingsData.sampleListings)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priceFilter, setPriceFilter] = useState('all')

  // Calculate statistics
  const totalListings = listings.length
  const activeListings = listings.filter(listing => listing.status === 'active').length
  const totalValue = listings.reduce((sum, listing) => {
    const price = listing.salePrice || listing.rentPrice || 0
    return sum + price
  }, 0)
  const averagePrice = totalListings > 0 ? Math.round(totalValue / totalListings) : 0

  // Filter listings based on search and filters
  useEffect(() => {
    let filtered = listings

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(listing => listing.status === statusFilter)
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(listing => listing.listingType === typeFilter)
    }

    // Price filter (basic implementation)
    if (priceFilter !== 'all') {
      filtered = filtered.filter(listing => {
        const price = listing.salePrice || listing.rentPrice || 0
        switch (priceFilter) {
          case 'under_100k':
            return price < 100000
          case '100k_300k':
            return price >= 100000 && price < 300000
          case 'over_300k':
            return price >= 300000
          default:
            return true
        }
      })
    }

    setFilteredListings(filtered)
  }, [listings, searchTerm, statusFilter, typeFilter, priceFilter])

  const formatPrice = (price: number | null | undefined, isRent: boolean = false) => {
    if (!price) return 'N/A'
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
    return isRent ? `${formatted}/month` : formatted
  }

  const getListingTypeLabel = (type: string) => {
    switch (type) {
      case 'manufactured_home':
        return 'Manufactured Home'
      case 'rv':
        return 'RV'
      default:
        return type
    }
  }

  const handleEdit = (listingId: string) => {
    console.log('Edit listing:', listingId)
    // TODO: Open edit form
  }

  const handleDelete = (listingId: string) => {
    console.log('Delete listing:', listingId)
    // TODO: Show confirmation dialog and delete
  }

  const handleView = (listingId: string) => {
    console.log('View listing:', listingId)
    // TODO: Navigate to listing detail view
  }

  const handleShareAll = () => {
    console.log('Share all listings')
    // TODO: Open share all modal
  }

  const handleAddNew = () => {
    console.log('Add new listing')
    // TODO: Open new listing form
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Property Listings Dashboard</h1>
          <p className="text-muted-foreground">Manage and track all your property listings</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleShareAll}>
            <Share2 className="h-4 w-4 mr-2" />
            Share All Listings
          </Button>
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Listing
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalListings}</div>
            <p className="text-xs text-muted-foreground">
              {activeListings} active listings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeListings}</div>
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
            <div className="text-2xl font-bold">{formatPrice(averagePrice)}</div>
            <p className="text-xs text-muted-foreground">
              Total value: {formatPrice(totalValue)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
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
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="manufactured_home">Manufactured Home</SelectItem>
                <SelectItem value="rv">RV</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under_100k">Under $100K</SelectItem>
                <SelectItem value="100k_300k">$100K - $300K</SelectItem>
                <SelectItem value="over_300k">Over $300K</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            All Listings ({filteredListings.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            All property listings in the system
          </p>
        </div>

        {filteredListings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No listings found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || priceFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first property listing'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && priceFilter === 'all' && (
                <Button onClick={handleAddNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Listing
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={listing.media.primaryPhoto}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge 
                      variant={listing.status === 'active' ? 'default' : 'secondary'}
                      className={listing.status === 'active' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                    >
                      {listing.status === 'active' ? 'Active' : listing.status}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className="bg-white/90">
                      {listing.offerType === 'for_rent' 
                        ? formatPrice(listing.rentPrice, true)
                        : formatPrice(listing.salePrice)
                      }
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg leading-tight">{listing.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {listing.location.address1}, {listing.location.city}, {listing.location.state}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        {listing.bedrooms && (
                          <div className="flex items-center">
                            <Bed className="h-3 w-3 mr-1" />
                            {listing.bedrooms} bed
                          </div>
                        )}
                        {listing.bathrooms && (
                          <div className="flex items-center">
                            <Bath className="h-3 w-3 mr-1" />
                            {listing.bathrooms} bath
                          </div>
                        )}
                        {listing.squareFeet && (
                          <div className="flex items-center">
                            <Square className="h-3 w-3 mr-1" />
                            {listing.squareFeet} sq ft
                          </div>
                        )}
                        {listing.sleeps && (
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            Sleeps {listing.sleeps}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        {getListingTypeLabel(listing.listingType)}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(listing.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(listing.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(listing.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}