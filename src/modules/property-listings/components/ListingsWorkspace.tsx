import React, { useState, useEffect } from 'react'
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
  ExternalLink
} from 'lucide-react'
import { apiClient } from '@/utils/apiClient'

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

const ListingsWorkspace: React.FC = () => {
  const { toast } = useToast()
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // Validation gates for publishing listings
  const validationGates: ValidationGate[] = [
    {
      id: 'basic_info',
      name: 'Basic Information',
      description: 'Year, make, model, and pricing',
      required: true,
      validator: (listing) => {
        if (!listing.year || !listing.make || !listing.model) {
          return { isValid: false, message: 'Year, make, and model are required' }
        }
        if (listing.offerType === 'for_sale' || listing.offerType === 'both') {
          if (!listing.salePrice || listing.salePrice <= 0) {
            return { isValid: false, message: 'Sale price is required for sale listings' }
          }
        }
        if (listing.offerType === 'for_rent' || listing.offerType === 'both') {
          if (!listing.rentPrice || listing.rentPrice <= 0) {
            return { isValid: false, message: 'Rent price is required for rental listings' }
          }
        }
        return { isValid: true }
      }
    },
    {
      id: 'marketing_content',
      name: 'Marketing Content',
      description: 'Description and search text',
      required: true,
      validator: (listing) => {
        if (!listing.description || listing.description.length < 50) {
          return { isValid: false, message: 'Description must be at least 50 characters' }
        }
        if (!listing.searchResultsText || listing.searchResultsText.length > 80) {
          return { isValid: false, message: 'Search text is required (max 80 characters)' }
        }
        return { isValid: true }
      }
    },
    {
      id: 'media',
      name: 'Photos & Media',
      description: 'At least one photo required',
      required: true,
      validator: (listing) => {
        if (!listing.media?.photos || listing.media.photos.length === 0) {
          return { isValid: false, message: 'At least one photo is required' }
        }
        if (!listing.media.primaryPhoto) {
          return { isValid: false, message: 'Primary photo must be selected' }
        }
        return { isValid: true }
      }
    },
    {
      id: 'location',
      name: 'Location Details',
      description: 'City and state information',
      required: true,
      validator: (listing) => {
        if (!listing.location.city || !listing.location.state) {
          return { isValid: false, message: 'City and state are required' }
        }
        if (listing.location.state.length !== 2) {
          return { isValid: false, message: 'State must be 2-letter code (e.g., CA, TX)' }
        }
        return { isValid: true }
      }
    },
    {
      id: 'contact_info',
      name: 'Contact Information',
      description: 'Phone or email for inquiries',
      required: true,
      validator: (listing) => {
        const hasPhone = listing.seller.phone && listing.seller.phone.length > 0
        const hasEmail = listing.seller.emails.some(email => email && email.includes('@'))
        
        if (!hasPhone && !hasEmail) {
          return { isValid: false, message: 'Phone number or email is required' }
        }
        return { isValid: true }
      }
    },
    {
      id: 'property_details',
      name: 'Property Specifications',
      description: 'Type-specific details',
      required: false,
      validator: (listing) => {
        if (listing.listingType === 'manufactured_home') {
          if (!listing.bedrooms || !listing.bathrooms) {
            return { isValid: false, message: 'Bedrooms and bathrooms help buyers find your listing' }
          }
        }
        if (listing.listingType === 'rv') {
          if (!listing.sleeps && !listing.length) {
            return { isValid: false, message: 'Sleep capacity or length helps buyers find your RV' }
          }
        }
        return { isValid: true }
      }
    }
  ]

  // Load listings
  useEffect(() => {
    loadListings()
  }, [])

  // Filter listings
  useEffect(() => {
    let filtered = listings

    if (searchTerm) {
      filtered = filtered.filter(listing => 
        listing.searchResultsText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(listing => listing.status === statusFilter)
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(listing => listing.listingType === typeFilter)
    }

    setFilteredListings(filtered)
  }, [listings, searchTerm, statusFilter, typeFilter])

  const loadListings = async () => {
    setIsLoading(true)
    try {
      const data = await apiClient.listingsCrud.getListings('company_test')
      setListings(data)
    } catch (error) {
      console.error('Error loading listings:', error)
      toast({
        title: "Error Loading Listings",
        description: "Failed to load listings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const validateListing = (listing: Listing) => {
    const results = validationGates.map(gate => ({
      gate,
      result: gate.validator(listing)
    }))

    const requiredGates = results.filter(r => r.gate.required)
    const failedRequired = requiredGates.filter(r => !r.result.isValid)
    
    return {
      canPublish: failedRequired.length === 0,
      requiredIssues: failedRequired.map(r => ({ gate: r.gate, result: r.result })),
      allResults: results
    }
  }

  const handleStatusChange = async (listingId: string, newStatus: string) => {
    const listing = listings.find(l => l.id === listingId)
    if (!listing) return

    // Validate before allowing to go active
    if (newStatus === 'active') {
      const validation = validateListing(listing)
      if (!validation.canPublish) {
        toast({
          title: "Cannot Publish Listing",
          description: `Fix ${validation.requiredIssues.length} validation issue(s) before publishing.`,
          variant: "destructive",
        })
        return
      }
    }

    try {
      await apiClient.listingsCrud.updateListing('company_test', listingId, { status: newStatus })
      await loadListings()
      toast({
        title: "Status Updated",
        description: `Listing status changed to ${newStatus}.`,
      })
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        title: "Error Updating Status",
        description: "Failed to update listing status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return

    try {
      await apiClient.listingsCrud.deleteListing('company_test', listingId)
      await loadListings()
      toast({
        title: "Listing Deleted",
        description: "Listing has been permanently deleted.",
      })
    } catch (error) {
      console.error('Error deleting listing:', error)
      toast({
        title: "Error Deleting Listing",
        description: "Failed to delete listing. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'sold': return 'bg-blue-100 text-blue-800'
      case 'rented': return 'bg-purple-100 text-purple-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatPrice = (price: number | undefined, currency = 'USD') => {
    if (!price) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Loading listings...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Listings Workspace</h1>
          <p className="text-muted-foreground">
            Manage your property listings and publish to marketing channels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadListings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Listing
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search">Search Listings</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title, make, model, or ID..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="manufactured_home">Manufactured Homes</SelectItem>
                  <SelectItem value="rv">RVs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Listings</p>
                <p className="text-2xl font-bold">{listings.length}</p>
              </div>
              <FileImage className="h-8 w-8 text-blue-600" />
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
                <p className="text-sm text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold text-gray-600">
                  {listings.filter(l => l.status === 'draft').length}
                </p>
              </div>
              <Edit className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sold/Rented</p>
                <p className="text-2xl font-bold text-blue-600">
                  {listings.filter(l => ['sold', 'rented'].includes(l.status)).length}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Listings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Listings ({filteredListings.length})</CardTitle>
          <CardDescription>
            Manage your property listings and track their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Listing</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Pricing</th>
                  <th className="text-left p-2">Location</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Validation</th>
                  <th className="text-left p-2">Updated</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((listing) => {
                  const validation = validateListing(listing)
                  
                  return (
                    <tr key={listing.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div>
                          <div className="font-medium">
                            {listing.searchResultsText || `${listing.year} ${listing.make} ${listing.model}`}
                          </div>
                          <div className="text-sm text-gray-500">ID: {listing.id}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge variant="outline">
                          {listing.listingType.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="text-sm">
                          {listing.offerType === 'for_sale' && (
                            <div>Sale: {formatPrice(listing.salePrice)}</div>
                          )}
                          {listing.offerType === 'for_rent' && (
                            <div>Rent: {formatPrice(listing.rentPrice)}/mo</div>
                          )}
                          {listing.offerType === 'both' && (
                            <div>
                              <div>Sale: {formatPrice(listing.salePrice)}</div>
                              <div>Rent: {formatPrice(listing.rentPrice)}/mo</div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center text-sm">
                          <MapPin className="h-3 w-3 mr-1" />
                          {listing.location.city}, {listing.location.state}
                        </div>
                      </td>
                      <td className="p-2">
                        <Select 
                          value={listing.status} 
                          onValueChange={(value) => handleStatusChange(listing.id, value)}
                        >
                          <SelectTrigger className="w-24 h-8">
                            <Badge className={getStatusColor(listing.status)}>
                              {listing.status.toUpperCase()}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="sold">Sold</SelectItem>
                            <SelectItem value="rented">Rented</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center">
                          {validation.canPublish ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-xs ml-1">
                            {validation.requiredIssues.length === 0 
                              ? 'Ready' 
                              : `${validation.requiredIssues.length} issues`
                            }
                          </span>
                        </div>
                      </td>
                      <td className="p-2 text-sm text-gray-500">
                        {new Date(listing.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleDeleteListing(listing.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <FileImage className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your filters or search terms.'
                  : 'Get started by creating your first listing from inventory.'}
              </p>
              {(!searchTerm && statusFilter === 'all' && typeFilter === 'all') && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Listing
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ListingsWorkspace