import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { ListingOverview } from './components/ListingOverview'
import { ListingForm } from './components/ListingForm'
import ShareListingModal from './components/ShareListingModal'
import { 
  Plus, 
  Filter, 
  Search,
  RefreshCw,
  FileImage
} from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'

interface Listing {
  id: string
  companyId: string
  inventoryId: string
  listingType: 'manufactured_home' | 'rv'
  offerType: 'for_sale' | 'for_rent' | 'both'
  status: 'active' | 'paused' | 'removed' | 'draft'
  title?: string
  salePrice?: number
  rentPrice?: number
  description?: string
  searchResultsText?: string
  media?: {
    photos: string[]
    primaryPhoto?: string
  }
  location?: {
    city?: string
    state?: string
    postalCode?: string
  }
  make?: string
  model?: string
  year?: number
  bedrooms?: number
  bathrooms?: number
  createdAt: string
  updatedAt: string
  lastExported?: string
  activePartnersCount?: number
}

export default function PropertyListings() {
  const { tenant } = useTenant()
  const { toast } = useToast()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingListing, setEditingListing] = useState<Listing | null>(null)
  const [shareModalListing, setShareModalListing] = useState<any>(null)
  const [shareAllModalOpen, setShareAllModalOpen] = useState(false)

  const fetchListings = async () => {
    if (!tenant?.id) return

    try {
      setLoading(true)
      const response = await fetch(`/.netlify/functions/listings-crud?companyId=${tenant.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch listings')
      }
      
      const data = await response.json()
      setListings(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching listings:', error)
      toast({
        title: "Error",
        description: "Failed to load listings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [tenant?.id])

  const handleAddListing = () => {
    setEditingListing(null)
    setShowAddModal(true)
  }

  const handleEditListing = (listing: Listing) => {
    setEditingListing(listing)
    setShowAddModal(true)
  }

  const handleCloneListing = async (listing: Listing) => {
    if (!tenant?.id) return

    try {
      const clonedListing = {
        ...listing,
        id: undefined, // Remove ID so a new one is generated
        status: 'draft', // Always clone as draft
        title: `${listing.title || 'Listing'} (Copy)`,
        createdAt: undefined,
        updatedAt: undefined,
        lastExported: undefined
      }

      const response = await fetch('/.netlify/functions/listings-crud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...clonedListing, companyId: tenant.id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to clone listing')
      }

      toast({
        title: "Success",
        description: "Listing cloned successfully",
      })

      fetchListings() // Refresh the list
    } catch (error) {
      console.error('Error cloning listing:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to clone listing",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (listing: Listing) => {
    if (!tenant?.id) return

    try {
      const newStatus = listing.status === 'active' ? 'paused' : 'active'
      
      const response = await fetch(`/.netlify/functions/listings-crud?companyId=${tenant.id}&listingId=${listing.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.publishGateErrors) {
          toast({
            title: "Cannot Activate Listing",
            description: "Please fix the following issues: " + errorData.errors.join(', '),
            variant: "destructive",
          })
          return
        }
        throw new Error(errorData.error || 'Failed to update listing status')
      }

      toast({
        title: "Success",
        description: `Listing ${newStatus === 'active' ? 'activated' : 'paused'} successfully`,
      })

      fetchListings() // Refresh the list
    } catch (error) {
      console.error('Error updating listing status:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update listing status",
        variant: "destructive",
      })
    }
  }

  const handleRemoveListing = async (listing: Listing) => {
    if (!tenant?.id) return

    if (!window.confirm('Are you sure you want to remove this listing? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/.netlify/functions/listings-crud?companyId=${tenant.id}&listingId=${listing.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove listing')
      }

      toast({
        title: "Success",
        description: "Listing removed successfully",
      })

      fetchListings() // Refresh the list
    } catch (error) {
      console.error('Error removing listing:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove listing",
        variant: "destructive",
      })
    }
  }

  const filteredListings = listings.filter(listing => {
    const matchesSearch = !searchQuery || 
      (listing.title?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (listing.inventoryId?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (listing.make?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (listing.model?.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter
    const matchesType = typeFilter === 'all' || listing.listingType === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Property Listings</h1>
            <p className="text-muted-foreground">Manage your property listings and syndication</p>
          </div>
          <div className="animate-pulse">
            <div className="h-10 w-32 bg-muted rounded-md"></div>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse flex space-x-4">
                  <div className="h-16 w-16 bg-muted rounded-md"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Property Listings</h1>
          <p className="text-muted-foreground">Manage your property listings and syndication</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchListings} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShareAllModalOpen(true)}
            disabled={listings.filter(l => l.status === 'active').length === 0}
          >
            Share All Active
          </Button>
          <Button onClick={handleAddListing}>
            <Plus className="h-4 w-4 mr-2" />
            Add Listing
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search listings by title, inventory ID, make, or model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="draft">Draft</option>
                <option value="removed">Removed</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="manufactured_home">Manufactured Home</option>
                <option value="rv">RV</option>
              </select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Listings */}
      {filteredListings.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <FileImage className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">
                {listings.length === 0 ? 'No listings yet' : 'No listings match your filters'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {listings.length === 0 
                  ? 'Get started by creating your first property listing' 
                  : 'Try adjusting your search or filters to find listings'
                }
              </p>
              {listings.length === 0 && (
                <Button onClick={handleAddListing}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Listing
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <ListingOverview
          listings={filteredListings}
          onEdit={handleEditListing}
          onClone={handleCloneListing}
          onToggleStatus={handleToggleStatus}
          onRemove={handleRemoveListing}
          onShareListing={(listing) => {
            setShareModalListing(listing)
          }}
        />
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <ListingForm
          listing={editingListing}
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false)
            fetchListings()
          }}
        />
      )}

      {shareModalListing && (
        <ShareListingModal
          isOpen={!!shareModalListing}
          onClose={() => setShareModalListing(null)}
          listing={shareModalListing}
          companySlug="demo-company"
        />
      )}

      {/* Share All Modal */}
      <Dialog open={shareAllModalOpen} onOpenChange={setShareAllModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share All Active Listings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create a shared catalog link containing all your active listings.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">
                <strong>{listings.filter(l => l.status === 'active').length}</strong> active listings will be included
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setShareAllModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // This would generate a catalog share link
                toast({
                  title: "Feature Coming Soon",
                  description: "Catalog sharing will be available in the next update"
                })
                setShareAllModalOpen(false)
              }}>
                Generate Catalog Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}