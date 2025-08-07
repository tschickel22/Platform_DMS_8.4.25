import React, { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Home, 
  DollarSign, 
  MapPin, 
  Eye,
  Edit,
  Trash2,
  Share2,
  TrendingUp,
  Building,
  Calendar,
  Search,
  Filter
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import ListingOverview from './components/ListingOverview'
import ListingForm from './components/ListingForm'
import ListingDetail from './components/ListingDetail'
import { ShareAllListingsModal } from './components/ShareAllListingsModal'
import { ShareOptionsModal } from './components/ShareOptionsModal'
import { allPropertyListings } from '@/mocks/listingsMock'
import { PropertyListing, RentalListing, ManufacturedHomeListing } from '@/types/listings'

// Helper function to get display price for any listing type
const getListingPrice = (listing: PropertyListing): number => {
  if (listing.listingType === 'for_rent') {
    return (listing as RentalListing).rent
  } else {
    return (listing as ManufacturedHomeListing).askingPrice
  }
}

// Helper function to get price display text
const getPriceDisplay = (listing: PropertyListing): string => {
  if (listing.listingType === 'for_rent') {
    return `$${(listing as RentalListing).rent.toLocaleString()}/month`
  } else {
    return `$${(listing as ManufacturedHomeListing).askingPrice.toLocaleString()}`
  }
}

// Helper function to get property type display
const getPropertyTypeDisplay = (listing: PropertyListing): string => {
  if (listing.listingType === 'for_rent') {
    return (listing as RentalListing).propertyType
  } else {
    return (listing as ManufacturedHomeListing).homeType
  }
}

function PropertyListingsDashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [listings, setListings] = useState<PropertyListing[]>(allPropertyListings)
  const [showShareModal, setShowShareModal] = useState(false)
  const [selectedListingForShare, setSelectedListingForShare] = useState<PropertyListing | null>(null)
  const [shareModalListing, setShareModalListing] = useState<PropertyListing | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Filter listings based on search and filters
  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.address.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter
    
    const matchesType = typeFilter === 'all' || getPropertyTypeDisplay(listing) === typeFilter
    
    const matchesPrice = priceRange === 'all' || (() => {
      const price = getListingPrice(listing)
      switch (priceRange) {
        case 'under-50000': return price < 50000
        case '50000-100000': return price >= 50000 && price <= 100000
        case '100000-200000': return price >= 100000 && price <= 200000
        case 'over-200000': return price > 200000
        default: return true
      }
    })()
    
    return matchesSearch && matchesStatus && matchesType && matchesPrice
  })

  // Calculate stats from filtered listings
  const totalListings = filteredListings.length
  const activeListings = filteredListings.filter(l => l.status === 'active').length
  const pendingListings = filteredListings.filter(l => l.status === 'pending').length
  const rentedListings = filteredListings.filter(l => l.status === 'rented' || l.status === 'sold').length
  const totalValue = filteredListings.reduce((sum, listing) => sum + getListingPrice(listing), 0)
  const avgRent = totalListings > 0 ? Math.round(totalValue / totalListings) : 0

  const handleDeleteListing = (id: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      setListings(prev => prev.filter(l => l.id !== id))
      toast({
        title: "Success",
        description: "Listing deleted successfully",
      })
    }
  }

  const handleShareListing = (listing: PropertyListing) => {
    setSelectedListingForShare(listing)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Property Listings Dashboard</h1>
          <p className="text-muted-foreground">Manage and track all your property listings</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline" 
            onClick={() => setShowShareModal(true)}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share All Listings
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Listing
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Property Listing</DialogTitle>
              </DialogHeader>
              <ListingForm onClose={() => setIsAddModalOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
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
            <div className="text-2xl font-bold">${avgRent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total value: ${totalValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="single-wide">Single-Wide</SelectItem>
                <SelectItem value="double-wide">Double-Wide</SelectItem>
                <SelectItem value="triple-wide">Triple-Wide</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-50000">Under $50,000</SelectItem>
                <SelectItem value="50000-100000">$50,000 - $100,000</SelectItem>
                <SelectItem value="100000-200000">$100,000 - $200,000</SelectItem>
                <SelectItem value="over-200000">Over $200,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* All Listings */}
      <Card>
        <CardHeader>
          <CardTitle>All Listings ({filteredListings.length})</CardTitle>
          <CardDescription>
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || priceRange !== 'all' 
              ? 'Filtered property listings' 
              : 'All property listings in the system'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredListings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium">No listings found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredListings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative overflow-hidden">
                    {listing.images[0] ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                        onClick={() => navigate(`detail/${listing.id}`)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Home className="h-12 w-12 text-gray-400" />
                      </div>
                    )}

                    {/* status badge */}
                    <div className="absolute top-2 left-2">
                      <Badge
                        variant={
                          listing.status === 'active' ? 'default' :
                          listing.status === 'pending' ? 'outline' :
                          (listing.status === 'rented' || listing.status === 'sold') ? 'secondary' :
                          'destructive'
                        }
                        className="capitalize"
                      >
                        {listing.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    {/* price badge */}
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-black/50 text-white border-0">
                        {getPriceDisplay(listing)}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg line-clamp-1">{listing.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="line-clamp-1">{listing.address}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-3">
                          <span>{listing.bedrooms} bed</span>
                          <span>{listing.bathrooms} bath</span>
                          <span>{listing.squareFootage || 'N/A'} sq ft</span>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {getPropertyTypeDisplay(listing)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`detail/${listing.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`edit/${listing.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteListing(listing.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleShareListing(listing)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <ShareAllListingsModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        listings={filteredListings}
        baseUrl="https://nimble-longma-257ddd.netlify.app"
      />

      {/* Individual Listing Share Modal */}
      <ShareOptionsModal
        isOpen={!!selectedListingForShare}
        onClose={() => setSelectedListingForShare(null)}
        listing={selectedListingForShare}
        baseUrl="https://nimble-longma-257ddd.netlify.app"
      />
    </div>
  )
}

function PropertyListingsList() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [listings, setListings] = useState<PropertyListing[]>(allPropertyListings)

  const handleDeleteListing = (id: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      setListings(prev => prev.filter(l => l.id !== id))
      toast({
        title: "Success",
        description: "Listing deleted successfully",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rented': return 'bg-blue-100 text-blue-800'
      case 'sold': return 'bg-purple-100 text-purple-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">All Property Listings</h1>
          <p className="text-muted-foreground">Manage and view all your property listings</p>
        </div>
        <Button onClick={() => navigate('new')} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Listing
        </Button>
      </div>

      {listings.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">No listings found</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first property listing</p>
              <Button onClick={() => navigate('new')}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Listing
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                {listing.images && listing.images[0] ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge className={getStatusColor(listing.status)}>
                    {listing.status}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{listing.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {listing.address}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{getPriceDisplay(listing)}</span>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{listing.bedrooms} bed</span>
                    <span>{listing.bathrooms} bath</span>
                    <span>{listing.squareFootage || 'N/A'} sq ft</span>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`detail/${listing.id}`)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`edit/${listing.id}`)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteListing(listing.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default function PropertyListings() {
  return (
    <div className="p-6">
      <Routes>
        <Route path="/" element={<PropertyListingsDashboard />} />
        <Route path="/list" element={<PropertyListingsList />} />
        <Route path="/new" element={<ListingForm />} />
        <Route path="/edit/:id" element={<ListingForm />} />
        <Route path="/detail/:id" element={<ListingDetail />} />
        <Route path="/overview" element={<ListingOverview />} />
      </Routes>
    </div>
  )
}