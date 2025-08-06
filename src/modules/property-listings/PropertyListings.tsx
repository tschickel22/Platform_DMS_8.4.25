import React, { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  Calendar
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import ListingOverview from './components/ListingOverview'
import ListingForm from './components/ListingForm'
import ListingDetail from './components/ListingDetail'
import { ShareAllListingsModal } from './components/ShareAllListingsModal'
import { mockListings } from '@/mocks/listingsMock'

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
  status: 'active' | 'pending' | 'rented' | 'inactive'
  amenities: string[]
  petPolicy: string
  images: string[]
  contactInfo: {
    phone: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

function PropertyListingsDashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [listings, setListings] = useState<Listing[]>(mockListings.sampleListings)
  const [showShareModal, setShowShareModal] = useState(false)

  // Calculate stats
  const totalListings = listings.length
  const activeListings = listings.filter(l => l.status === 'active').length
  const pendingListings = listings.filter(l => l.status === 'pending').length
  const rentedListings = listings.filter(l => l.status === 'rented').length
  const totalValue = listings.reduce((sum, listing) => sum + listing.rent, 0)
  const avgRent = totalListings > 0 ? Math.round(totalValue / totalListings) : 0

  const handleDeleteListing = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id))
    toast({
      title: "Success",
      description: "Listing deleted successfully",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rented': return 'bg-blue-100 text-blue-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Property Listings</h1>
          <p className="text-muted-foreground">Manage your rental property listings</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowShareModal(true)}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share All Listings
          </Button>
          <Button onClick={() => navigate('/listings/new')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Listing
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
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
              {pendingListings} pending approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rented Units</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rentedListings}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((rentedListings / totalListings) * 100)}% occupancy rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rent</CardTitle>
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

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/listings/new')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5 text-blue-600" />
              Add New Listing
            </CardTitle>
            <CardDescription>Create a new property listing</CardDescription>
          </CardHeader>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/listings/list')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="h-5 w-5 text-green-600" />
              View All Listings
            </CardTitle>
            <CardDescription>Browse all property listings</CardDescription>
          </CardHeader>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Analytics
            </CardTitle>
            <CardDescription>View listing performance</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Listings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Listings</CardTitle>
          <CardDescription>Latest property listings added to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {listings.slice(0, 5).map((listing) => (
              <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Home className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{listing.title}</h3>
                    <p className="text-sm text-muted-foreground">{listing.address}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(listing.status)}>
                        {listing.status}
                      </Badge>
                      <span className="text-sm font-medium">${listing.rent}/month</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/listings/detail/${listing.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/listings/edit/${listing.id}`)}
                  >
                    <Edit className="h-4 w-4" />
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
            ))}
          </div>
        </CardContent>
      </Card>
      
      <ShareAllListingsModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        listings={listings}
      />
    </div>
  )
}

function PropertyListingsList() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [listings, setListings] = useState<Listing[]>(mockListings.sampleListings)

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
        <Button onClick={() => navigate('/listings/new')} className="flex items-center gap-2">
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
              <Button onClick={() => navigate('/listings/new')}>
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
                    <span className="text-2xl font-bold">${listing.rent}/month</span>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{listing.bedrooms} bed</span>
                    <span>{listing.bathrooms} bath</span>
                    <span>{listing.squareFootage} sq ft</span>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/listings/detail/${listing.id}`)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/listings/edit/${listing.id}`)}
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