import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Home, 
  DollarSign, 
  Search, 
  Filter, 
  Share2, 
  Plus,
  MapPin,
  Bed,
  Bath,
  Square,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { mockPropertyListings } from '@/mocks/propertyListingsMock'

interface PropertyListing {
  id: string
  title: string
  description: string
  listingType: 'manufactured_home' | 'rv'
  offerType: 'for_sale' | 'for_rent' | 'both'
  status: 'active' | 'draft' | 'inactive'
  salePrice?: number
  rentPrice?: number
  year: number
  make: string
  model: string
  bedrooms?: number
  bathrooms?: number
  sleeps?: number
  slides?: number
  squareFootage?: number
  length?: number
  location: {
    city: string
    state: string
    address?: string
  }
  media: {
    primaryPhoto: string
    photos: string[]
  }
  createdAt: string
  updatedAt: string
}

export default function PropertyListings() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priceFilter, setPriceFilter] = useState('all')

  // Calculate statistics
  const stats = useMemo(() => {
    const totalListings = mockPropertyListings.length
    const activeListings = mockPropertyListings.filter(listing => listing.status === 'active').length
    
    const activePrices = mockPropertyListings
      .filter(listing => listing.status === 'active')
      .map(listing => listing.salePrice || listing.rentPrice || 0)
      .filter(price => price > 0)
    
    const averagePrice = activePrices.length > 0 
      ? Math.round(activePrices.reduce((sum, price) => sum + price, 0) / activePrices.length)
      : 0
    
    const totalValue = activePrices.reduce((sum, price) => sum + price, 0)

    return {
      totalListings,
      activeListings,
      averagePrice,
      totalValue
    }
  }, [])

  // Filter listings based on search and filters
  const filteredListings = useMemo(() => {
    return mockPropertyListings.filter(listing => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${listing.make} ${listing.model}`.toLowerCase().includes(searchTerm.toLowerCase())

      // Status filter
      const matchesStatus = statusFilter === 'all' || listing.status === statusFilter

      // Type filter
      const matchesType = typeFilter === 'all' || listing.listingType === typeFilter

      // Price filter
      let matchesPrice = true
      if (priceFilter !== 'all') {
        const price = listing.salePrice || listing.rentPrice || 0
        switch (priceFilter) {
          case 'under_100k':
            matchesPrice = price < 100000
            break
          case '100k_300k':
            matchesPrice = price >= 100000 && price <= 300000
            break
          case 'over_300k':
            matchesPrice = price > 300000
            break
        }
      }

      return matchesSearch && matchesStatus && matchesType && matchesPrice
    })
  }, [searchTerm, statusFilter, typeFilter, priceFilter])

  const formatPrice = (price: number, isRent: boolean = false) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M${isRent ? '/mo' : ''}`
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K${isRent ? '/mo' : ''}`
    }
    return `$${price.toLocaleString()}${isRent ? '/mo' : ''}`
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 text-white'
      case 'draft':
        return 'bg-yellow-500 text-white'
      case 'inactive':
        return 'bg-gray-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Property Listings Dashboard</h1>
          <p className="text-muted-foreground">Manage and track all your property listings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
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
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalListings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeListings} active listings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeListings}</div>
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
            <div className="text-2xl font-bold">{formatPrice(stats.averagePrice)}</div>
            <p className="text-xs text-muted-foreground">
              Total value: {formatPrice(stats.totalValue)}
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
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
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
              <SelectTrigger className="w-full sm:w-[180px]">
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
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="manufactured_home">Manufactured Home</SelectItem>
                <SelectItem value="rv">RV</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
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
                  <div className="absolute top-2 left-2">
                    <Badge className={getStatusBadgeColor(listing.status)}>
                      {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm font-semibold">
                    {listing.salePrice && formatPrice(listing.salePrice)}
                    {listing.rentPrice && formatPrice(listing.rentPrice, true)}
                    {listing.offerType === 'both' && listing.salePrice && listing.rentPrice && 
                      ` / ${formatPrice(listing.rentPrice, true)}`
                    }
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg leading-tight">{listing.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {listing.location.address && `${listing.location.address}, `}
                      {listing.location.city}, {listing.location.state}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      {listing.bedrooms && (
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          <span>{listing.bedrooms} bed</span>
                        </div>
                      )}
                      {listing.bathrooms && (
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4" />
                          <span>{listing.bathrooms} bath</span>
                        </div>
                      )}
                      {listing.squareFootage && (
                        <div className="flex items-center gap-1">
                          <Square className="h-4 w-4" />
                          <span>{listing.squareFootage} sq ft</span>
                        </div>
                      )}
                      {listing.sleeps && (
                        <div className="flex items-center gap-1">
                          <span>Sleeps {listing.sleeps}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Badge variant="secondary">
                        {getListingTypeLabel(listing.listingType)}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No listings found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || priceFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first property listing.'
                }
              </p>
              {(!searchTerm && statusFilter === 'all' && typeFilter === 'all' && priceFilter === 'all') && (
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Listing
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}