import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Play, 
  Pause, 
  Copy, 
  Trash, 
  Share, 
  Eye,
  Home,
  Car,
  DollarSign,
  Calendar
} from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import ListingForm from './ListingForm'
import ShareListingModal from './ShareListingModal'
import { mockListings } from '@/mocks/listingsMock'

interface Listing {
  id: string
  companyId: string
  title: string
  listingType: 'manufactured_home' | 'rv'
  offerType: 'for_sale' | 'for_rent' | 'both'
  status: 'draft' | 'active' | 'paused' | 'removed'
  salePrice?: number
  rentPrice?: number
  make: string
  model: string
  year: number
  location: {
    city: string
    state: string
  }
  media?: {
    primaryPhoto?: string
    photos: string[]
  }
  activePartners: string[]
  lastExported?: string
  updatedAt: string
  createdAt: string
}

export default function ListingOverview() {
  const { tenant } = useTenant()
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingListing, setEditingListing] = useState<Listing | null>(null)
  const [sharingListing, setSharingListing] = useState<Listing | null>(null)
  const [selectedListings, setSelectedListings] = useState<string[]>([])

  useEffect(() => {
    fetchListings()
  }, [])

  useEffect(() => {
    filterListings()
  }, [listings, searchQuery, selectedStatus, selectedType])

  const fetchListings = async () => {
    try {
      setLoading(true)
      // Use mock data from centralized mock file
      const listingsData = mockListings.sampleListings || []
      setListings(listingsData)
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterListings = () => {
    let filtered = listings

    if (searchQuery) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.location.state.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(listing => listing.status === selectedStatus)
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(listing => listing.listingType === selectedType)
    }

    setFilteredListings(filtered)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'manufactured_home':
        return <Home className="h-4 w-4" />
      case 'rv':
        return <Car className="h-4 w-4" />
      default:
        return <Home className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'removed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatPrice = (listing: Listing) => {
    if (listing.offerType === 'for_sale' && listing.salePrice) {
      return listing.salePrice.toLocaleString()
    }
    if (listing.offerType === 'for_rent' && listing.rentPrice) {
      return `${listing.rentPrice.toLocaleString()}/mo`
    }
    if (listing.offerType === 'both') {
      const parts = []
      if (listing.salePrice) parts.push(`$${listing.salePrice.toLocaleString()}`)
      if (listing.rentPrice) parts.push(`$${listing.rentPrice.toLocaleString()}/mo`)
      return parts.join(' / ')
    }
    return 'Contact for price'
  }

  const handleStatusToggle = (listing: Listing) => {
    const newStatus = listing.status === 'active' ? 'paused' : 'active'
    setListings(prev => prev.map(l => 
      l.id === listing.id ? { ...l, status: newStatus } : l
    ))
  }

  const handleClone = (listing: Listing) => {
    const cloned = {
      ...listing,
      id: `listing_${Date.now()}`,
      title: `${listing.title} (Copy)`,
      status: 'draft' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setListings(prev => [cloned, ...prev])
  }

  const handleDelete = async (listingId: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      setListings(prev => prev.filter(l => l.id !== listingId))
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Property Listings</h1>
            <p className="text-gray-600">Manage your property listings and syndication</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Listings</h1>
          <p className="text-gray-600">Manage your property listings and syndication</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Listing
        </Button>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="paused">Paused</option>
                <option value="removed">Removed</option>
              </select>
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="manufactured_home">Manufactured Home</option>
                <option value="rv">RV</option>
              </select>
              {selectedListings.length > 0 && (
                <>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Share Selected ({selectedListings.length})
                  </Button>
                  <Button variant="outline" size="sm">
                    Bulk Actions
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Listings Table */}
      <Card>
        <CardContent className="p-0">
          {filteredListings.length === 0 ? (
            <div className="text-center py-12">
              <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || selectedStatus !== 'all' || selectedType !== 'all' 
                  ? 'Try adjusting your filters or search query'
                  : 'Get started by creating your first property listing'
                }
              </p>
              {!searchQuery && selectedStatus === 'all' && selectedType === 'all' && (
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Listing
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input 
                      type="checkbox" 
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedListings(filteredListings.map(l => l.id))
                        } else {
                          setSelectedListings([])
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Listing</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Offer</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Partners</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Export</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredListings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>
                      <input 
                        type="checkbox"
                        checked={selectedListings.includes(listing.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedListings(prev => [...prev, listing.id])
                          } else {
                            setSelectedListings(prev => prev.filter(id => id !== listing.id))
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {listing.media?.primaryPhoto ? (
                          <img 
                            src={listing.media.primaryPhoto} 
                            alt={listing.title}
                            className="w-12 h-8 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                            {getTypeIcon(listing.listingType)}
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{listing.title}</div>
                          <div className="text-sm text-gray-600">
                            {listing.location.city}, {listing.location.state}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(listing.listingType)}
                        <span className="capitalize">
                          {listing.listingType.replace('_', ' ')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {listing.offerType.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {formatPrice(listing)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {listing.activePartners.length > 0 ? (
                          listing.activePartners.map(partner => (
                            <Badge key={partner} variant="secondary" className="text-xs">
                              {partner}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">None</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(listing.status)}>
                        {listing.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {listing.lastExported ? (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {new Date(listing.lastExported).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {new Date(listing.updatedAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingListing(listing)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusToggle(listing)}
                        >
                          {listing.status === 'active' ? (
                            <Pause className="h-3 w-3" />
                          ) : (
                            <Play className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleClone(listing)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSharingListing(listing)}
                        >
                          <Share className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(listing.id)}
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {(showAddModal || editingListing) && (
        <ListingForm
          listing={editingListing}
          open={showAddModal || !!editingListing}
          onOpenChange={(open) => {
            if (!open) {
              setShowAddModal(false)
              setEditingListing(null)
            }
          }}
          onSave={(listing) => {
            if (editingListing) {
              setListings(prev => prev.map(l => l.id === listing.id ? listing : l))
            } else {
              setListings(prev => [listing, ...prev])
            }
            setShowAddModal(false)
            setEditingListing(null)
          }}
        />
      )}

      {sharingListing && (
        <ShareListingModal
          listing={sharingListing}
          open={!!sharingListing}
          onOpenChange={(open) => !open && setSharingListing(null)}
        />
      )}
    </div>
  )
}