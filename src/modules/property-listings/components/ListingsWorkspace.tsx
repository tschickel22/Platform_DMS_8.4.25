import React, { useState, useEffect } from 'react'
import ErrorBoundary, { ModuleErrorBoundary } from '@/components/ErrorBoundary'
import { Skeleton, ListingCardSkeleton, PageHeaderSkeleton } from '@/components/ui/loading-skeleton'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { logger } from '@/utils/logger'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { 
  Plus,
  Edit,
  Trash2,
  Eye,
  Share2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  DollarSign,
  MapPin,
  FileImage,
  Filter,
  Search,
  RefreshCw,
  Download,
  Upload,
  Settings,
  MoreHorizontal,
  ExternalLink,
  Home
} from 'lucide-react'
import { ShareListingModal } from './components/ShareListingModal'
import { mockListings } from '@/mocks/listingsMock'
import { apiClient } from '@/utils/apiClient'
import { Home } from 'lucide-react'

interface Listing {
  id: string
  companyId: string
  listingType: 'manufactured_home' | 'rv'
  inventoryId: string
  year: number
  make: string
  model: string
  vin?: string
  color?: string
  condition: 'new' | 'used' | 'certified'
  offerType: 'for_sale' | 'for_rent' | 'both'
  salePrice?: number
  rentPrice?: number
  currency: string
  description: string
  searchResultsText: string
  bedrooms?: number
  bathrooms?: number
  sleeps?: number
  slides?: number
  length?: number
  media?: {
    photos: string[]
    primaryPhoto: string
    virtualTour?: string
  }
  location: {
    locationType: string
    city: string
    state: string
    postalCode?: string
    address1?: string
    latitude?: number
    longitude?: number
  }
  seller: {
    companyName: string
    phone?: string
    emails: string[]
    website?: string
  }
  status: 'draft' | 'active' | 'sold' | 'rented' | 'inactive'
  createdAt: string
  updatedAt: string
}

interface ValidationGate {
  id: string
  name: string
  description: string
  required: boolean
  validator: (listing: Listing) => { isValid: boolean; message?: string }
}

const PropertyListings = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { handleError, handleAsyncError } = useErrorHandler()
  const [listings, setListings] = useState(mockListings.sampleListings)
  const [filteredListings, setFilteredListings] = useState(mockListings.sampleListings)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterOfferType, setFilterOfferType] = useState('all')
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState(null)

  // Load listings on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        // In real implementation, this would be an API call
        setListings(mockListings.sampleListings);
      } catch (error) {
        handleError(error, 'property_listings_load');
        setError('Failed to load listings');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [handleError]);

  // Filter listings based on search and filters
  useEffect(() => {
    let filtered = listings;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(listing => 
        listing.searchResultsText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(listing => listing.listingType === filterType);
    }

    // Apply offer type filter
    if (filterOfferType !== 'all') {
      filtered = filtered.filter(listing => listing.offerType === filterOfferType);
    }

    setFilteredListings(filtered);
  }, [listings, searchQuery, filterType, filterOfferType]);

  const handleShare = (listing) => {
    setSelectedListing(listing);
    setShareModalOpen(true);
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'rented': return 'bg-purple-100 text-purple-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-2">Error loading listings</div>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ModuleErrorBoundary moduleName="PropertyListings">
      <div className="space-y-6">
        {/* Header */}
        {isLoading ? (
          <PageHeaderSkeleton />
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Property Listings</h1>
              <p className="text-muted-foreground">
                Manage and share your property listings across channels
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Listing
              </Button>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search listings..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="manufactured_home">Manufactured Homes</SelectItem>
                  <SelectItem value="rv">RVs</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterOfferType} onValueChange={setFilterOfferType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Offer Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Offers</SelectItem>
                  <SelectItem value="for_sale">For Sale</SelectItem>
                  <SelectItem value="for_rent">For Rent</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Listings</p>
                  <p className="text-2xl font-bold">{listings.length}</p>
                </div>
                <Home className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {listings.filter(l => l.status === 'active').length}
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">For Sale</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {listings.filter(l => ['for_sale', 'both'].includes(l.offerType)).length}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">For Rent</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {listings.filter(l => ['for_rent', 'both'].includes(l.offerType)).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))
          ) : filteredListings.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FileImage className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || filterType !== 'all' || filterOfferType !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'Get started by creating your first listing.'}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Listing
              </Button>
            </div>
          ) : (
            filteredListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={listing.media?.primaryPhoto || '/placeholder-property.jpg'}
                    alt={listing.searchResultsText || listing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className={getStatusColor(listing.status)}>
                      {listing.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary">
                      {listing.listingType === 'manufactured_home' ? 'Home' : 'RV'}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg line-clamp-2">
                      {listing.searchResultsText || listing.title || `${listing.year} ${listing.make} ${listing.model}`}
                    </h3>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {listing.location?.city}, {listing.location?.state}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        {listing.offerType === 'for_sale' && (
                          <div className="font-semibold text-green-600">
                            {formatPrice(listing.salePrice)}
                          </div>
                        )}
                        {listing.offerType === 'for_rent' && (
                          <div className="font-semibold text-blue-600">
                            {formatPrice(listing.rentPrice)}/mo
                          </div>
                        )}
                        {listing.offerType === 'both' && (
                          <div className="space-y-1">
                            <div className="font-semibold text-green-600 text-sm">
                              Sale: {formatPrice(listing.salePrice)}
                            </div>
                            <div className="font-semibold text-blue-600 text-sm">
                              Rent: {formatPrice(listing.rentPrice)}/mo
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {listing.listingType === 'manufactured_home' && listing.bedrooms && (
                          <span>{listing.bedrooms}BR/{listing.bathrooms}BA</span>
                        )}
                        {listing.listingType === 'rv' && listing.sleeps && (
                          <span>Sleeps {listing.sleeps}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleShare(listing)}
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Share Modal */}
        <ShareListingModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          listing={selectedListing}
        />
      </div>
    </ModuleErrorBoundary>
  );
};

export default PropertyListings;