import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Share, 
  Eye,
  Edit,
  Copy,
  Trash2,
  Home,
  Car,
  DollarSign,
  MapPin,
  Calendar,
  BarChart3,
  Globe,
  Settings
} from 'lucide-react'
import { PropertyListing } from './types'
import { usePropertyListings } from './hooks/usePropertyListings'
import { propertyListingsService } from './services/propertyListingsService'
import { ShareListingModal } from './components/ShareListingModal'
import { ShareAllListingsModal } from './components/ShareAllListingsModal'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

// Helper function to get type icon
function getTypeIcon(type: string) {
  return type === 'rv' ? Car : Home
}

// Helper function to get status color
function getStatusColor(status: string) {
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

export default function PropertyListings() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { listings, loading, createListing, deleteListing, duplicateListing } = usePropertyListings()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priceFilter, setPriceFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [selectedListings, setSelectedListings] = useState<string[]>([])
  const [showShareModal, setShowShareModal] = useState(false)
  const [showShareAllModal, setShowShareAllModal] = useState(false)
  const [shareListingId, setShareListingId] = useState<string>('')

  // Filter listings
  const filteredListings = listings.filter(listing => {
    const matchesSearch = searchTerm === '' || 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${listing.make} ${listing.model}`.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter
    const matchesType = typeFilter === 'all' || listing.listingType === typeFilter
    
    let matchesPrice = true
    if (priceFilter !== 'all') {
      const price = listing.salePrice || listing.rentPrice || 0
      switch (priceFilter) {
        case 'under_50k':
          matchesPrice = price < 50000
          break
        case '50k_100k':
          matchesPrice = price >= 50000 && price <= 100000
          break
        case 'over_100k':
          matchesPrice = price > 100000
          break
      }
    }

    return matchesSearch && matchesStatus && matchesType && matchesPrice
  })

  // Calculate stats
  const stats = {
    total: listings.length,
    active: listings.filter(l => l.status === 'active').length,
    draft: listings.filter(l => l.status === 'draft').length,
    avgPrice: listings.length > 0 
      ? Math.round(listings.reduce((sum, l) => sum + (l.salePrice || l.rentPrice || 0), 0) / listings.length)
      : 0,
    totalViews: listings.reduce((sum, l) => sum + (l.viewCount || 0), 0),
    totalLeads: listings.reduce((sum, l) => sum + (l.leadCount || 0), 0)
  }

  const handleCreateListing = () => {
    navigate('/property/listings/new')
  }

  const handleEditListing = (id: string) => {
    navigate(`/property/listings/${id}/edit`)
  }

  const handleViewListing = (id: string) => {
    navigate(`/property/listings/${id}`)
  }

  const handleShareListing = (id: string) => {
    setShareListingId(id)
    setShowShareModal(true)
  }

  const handleQuickShare = (listing: PropertyListing) => {
    const url = `${window.location.origin}/public/demo/listing/${listing.id}`
    navigator.clipboard.writeText(url)
    toast({
      title: 'URL Copied!',
      description: `Share URL for "${listing.title}" copied to clipboard.`
    })
  }

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateListing(id)
      toast({
        title: 'Listing Duplicated',
        description: 'A copy of the listing has been created.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate listing.',
        variant: 'destructive'
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      try {
        await deleteListing(id)
        toast({
          title: 'Listing Deleted',
          description: 'The listing has been removed.'
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete listing.',
          variant: 'destructive'
        })
      }
    }
  }

  const handleExportAll = async () => {
    try {
      const csvData = await propertyListingsService.exportListings({
        format: 'CSV',
        includePhotos: false,
        includePrivateFields: false,
        filterBy: statusFilter !== 'all' ? { status: [statusFilter] } : undefined
      })
      
      // Create and download file
      const blob = new Blob([csvData], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `property-listings-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        title: 'Export Complete',
        description: 'Listings exported successfully.'
      })
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export listings.',
        variant: 'destructive'
      })
    }
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
            Manage your property inventory and public listings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowShareAllModal(true)}>
            <Share className="h-4 w-4 mr-2" />
            Share All
          </Button>
          <Button variant="outline" onClick={handleExportAll}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleCreateListing}>
            <Plus className="h-4 w-4 mr-2" />
            Add Listing
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
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
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.avgPrice)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalViews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalLeads}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
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
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="rv">RV</SelectItem>
                <SelectItem value="manufactured_home">Manufactured Home</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under_50k">Under $50k</SelectItem>
                <SelectItem value="50k_100k">$50k - $100k</SelectItem>
                <SelectItem value="over_100k">Over $100k</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1 border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-l-none"
              >
                Table
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredListings.length} of {listings.length} listings
          </p>
          {filteredListings.length > 0 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowShareAllModal(true)}>
                <Share className="h-4 w-4 mr-2" />
                Share Catalog
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportAll}>
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          )}
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing) => {
              const TypeIcon = getTypeIcon(listing.listingType)
              
              return (
                <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <div className="h-48 bg-gray-100">
                      {listing.media.primaryPhoto ? (
                        <img
                          src={listing.media.primaryPhoto}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <TypeIcon className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 left-2">
                      <Badge className={getStatusColor(listing.status)}>
                        {listing.status}
                      </Badge>
                    </div>
                    
                    {/* Photo Count */}
                    {listing.media.photos.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                        {listing.media.photos.length} photos
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg leading-tight">{listing.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {listing.year} {listing.make} {listing.model}
                        </p>
                      </div>
                      
                      {/* Pricing */}
                      <div className="flex items-center justify-between">
                        <div>
                          {listing.salePrice && (
                            <p className="text-xl font-bold text-primary">
                              {formatCurrency(listing.salePrice)}
                            </p>
                          )}
                          {listing.rentPrice && (
                            <p className="text-lg font-semibold">
                              {formatCurrency(listing.rentPrice)}/mo
                            </p>
                          )}
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {listing.location.city}, {listing.location.state}
                          </p>
                        </div>
                      </div>
                      
                      {/* Key Specs */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                            {listing.dimensions?.sqft && <span>{listing.dimensions.sqft.toLocaleString()} sqft</span>}
                          </>
                        )}
                      </div>
                      
                      {/* Analytics */}
                      {(listing.viewCount || listing.leadCount) && (
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {listing.viewCount && (
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {listing.viewCount} views
                            </span>
                          )}
                          {listing.leadCount && (
                            <span className="flex items-center gap-1">
                              <BarChart3 className="h-3 w-3" />
                              {listing.leadCount} leads
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex items-center gap-1 pt-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewListing(listing.id)}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditListing(listing.id)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleQuickShare(listing)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleShareListing(listing.id)}>
                          <Share className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDuplicate(listing.id)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(listing.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4 font-medium">Listing</th>
                      <th className="text-left p-4 font-medium">Type</th>
                      <th className="text-left p-4 font-medium">Price</th>
                      <th className="text-left p-4 font-medium">Location</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Analytics</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredListings.map((listing) => {
                      const TypeIcon = getTypeIcon(listing.listingType)
                      
                      return (
                        <tr key={listing.id} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                                {listing.media.primaryPhoto ? (
                                  <img
                                    src={listing.media.primaryPhoto}
                                    alt={listing.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <TypeIcon className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{listing.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {listing.year} {listing.make} {listing.model}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="capitalize">
                              {listing.listingType.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div>
                              {listing.salePrice && (
                                <p className="font-semibold">{formatCurrency(listing.salePrice)}</p>
                              )}
                              {listing.rentPrice && (
                                <p className="text-sm text-muted-foreground">
                                  {formatCurrency(listing.rentPrice)}/mo
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="text-sm">{listing.location.city}, {listing.location.state}</p>
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(listing.status)}>
                              {listing.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-muted-foreground">
                              {listing.viewCount && <p>{listing.viewCount} views</p>}
                              {listing.leadCount && <p>{listing.leadCount} leads</p>}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <Button variant="outline" size="sm" onClick={() => handleViewListing(listing.id)}>
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleEditListing(listing.id)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleQuickShare(listing)}>
                                <Share className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {filteredListings.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Home className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No listings found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || priceFilter !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : 'Get started by creating your first property listing.'
                }
              </p>
              {(!searchTerm && statusFilter === 'all' && typeFilter === 'all' && priceFilter === 'all') && (
                <Button onClick={handleCreateListing}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Listing
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Share Modals */}
      <ShareListingModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        listingId={shareListingId}
        listingTitle={listings.find(l => l.id === shareListingId)?.title}
        mode="single"
      />
      
      <ShareAllListingsModal
        isOpen={showShareAllModal}
        onClose={() => setShowShareAllModal(false)}
        totalListings={filteredListings.filter(l => l.status === 'active').length}
      />
    </div>
  )
}