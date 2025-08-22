import React, { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Car,
  Home,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Share,
  DollarSign,
  Grid,
  List
} from 'lucide-react'
import { VehicleInventory, RVInventory, ManufacturedHomeInventory } from './types'
import { useInventoryManagement } from './hooks/useInventoryManagement'
import VehicleForm from './forms/VehicleForm'
import { formatCurrency, formatDate } from '@/lib/utils'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/hooks/use-toast'

function InventoryList() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { 
    inventory, 
    loading, 
    createVehicle, 
    updateVehicle, 
    deleteVehicle,
    exportInventory 
  } = useInventoryManagement()

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'rv' | 'manufactured_home'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'pending' | 'sold' | 'reserved'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  // Filter inventory based on search and filters
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.inventoryId?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === 'all' || item.listingType === typeFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this inventory item?')) {
      try {
        await deleteVehicle(id)
        toast({
          title: 'Success',
          description: 'Inventory item deleted successfully'
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete inventory item',
          variant: 'destructive'
        })
      }
    }
  }

  const handleShare = (item: VehicleInventory) => {
    const url = `${window.location.origin}/public/demo/listing/${item.id}`
    navigator.clipboard.writeText(url)
    toast({
      title: 'Link Copied',
      description: 'Public listing URL copied to clipboard'
    })
  }

  const handleExport = async () => {
    try {
      await exportInventory(filteredInventory, 'csv')
      toast({
        title: 'Export Started',
        description: 'Your inventory export is being prepared'
      })
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export inventory',
        variant: 'destructive'
      })
    }
  }

  const handleCreateListing = (item: VehicleInventory) => {
    // Navigate to property listings with pre-filled data
    navigate(`/property/listings/new?inventoryId=${item.id}`)
  }

  const getTypeIcon = (type: string) => {
    return type === 'rv' ? Car : Home
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'sold':
        return 'bg-blue-100 text-blue-800'
      case 'reserved':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage your RV and manufactured home inventory
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => navigate('/inventory/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Inventory
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">
              {inventory.filter(i => i.status === 'available').length} available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RVs</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventory.filter(i => i.listingType === 'rv').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {inventory.filter(i => i.listingType === 'rv' && i.status === 'available').length} available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manufactured Homes</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventory.filter(i => i.listingType === 'manufactured_home').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {inventory.filter(i => i.listingType === 'manufactured_home' && i.status === 'available').length} available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                inventory
                  .filter(i => i.status === 'available')
                  .reduce((sum, i) => sum + (i.salePrice || i.rentPrice || 0), 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">Available inventory</p>
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
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="rv">RVs</SelectItem>
                <SelectItem value="manufactured_home">Manufactured Homes</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1 border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Grid/Table */}
      {filteredInventory.length === 0 ? (
        <EmptyState
          title="No inventory found"
          description="No inventory items match your current filters. Try adjusting your search or filters."
          icon={<Car className="h-12 w-12" />}
          action={{
            label: 'Add Inventory',
            onClick: () => navigate('/inventory/new')
          }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredInventory.map((item) => {
            const TypeIcon = getTypeIcon(item.listingType)
            return (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  {item.media.primaryPhoto ? (
                    <img
                      src={item.media.primaryPhoto}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <TypeIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <Badge className={`absolute top-2 right-2 ${getStatusColor(item.status)}`}>
                    {item.status}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.year} {item.make} {item.model}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        {item.salePrice && (
                          <p className="text-lg font-bold text-primary">
                            {formatCurrency(item.salePrice)}
                          </p>
                        )}
                        {item.rentPrice && (
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(item.rentPrice)}/mo
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/inventory/${item.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/inventory/${item.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare(item)}
                        >
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCreateListing(item)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-4 font-medium">Vehicle</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Price</th>
                    <th className="text-left p-4 font-medium">Location</th>
                    <th className="text-left p-4 font-medium">Created</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => {
                    const TypeIcon = getTypeIcon(item.listingType)
                    return (
                      <tr key={item.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                              {item.media.primaryPhoto ? (
                                <img
                                  src={item.media.primaryPhoto}
                                  alt={item.title}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <TypeIcon className="h-6 w-6 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.year} {item.make} {item.model}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="capitalize">
                            {item.listingType.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div>
                            {item.salePrice && (
                              <p className="font-medium">{formatCurrency(item.salePrice)}</p>
                            )}
                            {item.rentPrice && (
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(item.rentPrice)}/mo
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm">
                            {item.location.city}, {item.location.state}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-muted-foreground">
                            {formatDate(item.createdAt)}
                          </p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/inventory/${item.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/inventory/${item.id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCreateListing(item)}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
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
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function InventoryDetail() {
  const { inventoryId } = useParams<{ inventoryId: string }>()
  const navigate = useNavigate()
  const { inventory, loading } = useInventoryManagement()
  const { toast } = useToast()
  
  const [item, setItem] = useState<VehicleInventory | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<string>('')

  React.useEffect(() => {
    if (inventoryId && inventory.length > 0) {
      const found = inventory.find(i => i.id === inventoryId)
      setItem(found || null)
      setSelectedPhoto(found?.media.primaryPhoto || '')
    }
  }, [inventoryId, inventory])

  const handleEdit = () => {
    navigate(`/inventory/${inventoryId}/edit`)
  }

  const handleCreateListing = () => {
    navigate(`/property/listings/new?inventoryId=${inventoryId}`)
  }

  const handleShare = () => {
    const url = `${window.location.origin}/public/demo/listing/${inventoryId}`
    navigator.clipboard.writeText(url)
    toast({
      title: 'Link Copied',
      description: 'Public listing URL copied to clipboard'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading inventory item...</p>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Inventory Item Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The inventory item you're looking for could not be found.
            </p>
            <Button onClick={() => navigate('/inventory')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inventory
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const TypeIcon = getTypeIcon(item.listingType)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/inventory')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inventory
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TypeIcon className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-2xl font-bold">{item.title}</h1>
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {item.inventoryId} • {item.year} {item.make} {item.model}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleShare}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" onClick={handleCreateListing}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Create Listing
            </Button>
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="h-96 bg-gray-100">
                  {selectedPhoto ? (
                    <img
                      src={selectedPhoto}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <TypeIcon className="h-24 w-24 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                {item.media.photos.length > 1 && (
                  <div className="p-4 border-t">
                    <div className="flex gap-2 overflow-x-auto">
                      {item.media.photos.map((photo, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedPhoto(photo)}
                          className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                            selectedPhoto === photo ? 'border-primary' : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {item.listingType === 'rv' && (
                    <>
                      {item.sleeps && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Sleeps</p>
                          <p>{item.sleeps}</p>
                        </div>
                      )}
                      {item.length && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Length</p>
                          <p>{item.length} ft</p>
                        </div>
                      )}
                      {item.slides && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Slide Outs</p>
                          <p>{item.slides}</p>
                        </div>
                      )}
                    </>
                  )}
                  
                  {item.listingType === 'manufactured_home' && (
                    <>
                      {item.bedrooms && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Bedrooms</p>
                          <p>{item.bedrooms}</p>
                        </div>
                      )}
                      {item.bathrooms && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Bathrooms</p>
                          <p>{item.bathrooms}</p>
                        </div>
                      )}
                      {item.dimensions?.sqft && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Square Feet</p>
                          <p>{item.dimensions.sqft}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {item.salePrice && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sale Price</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(item.salePrice)}
                    </p>
                  </div>
                )}
                {item.rentPrice && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rent Price</p>
                    <p className="text-xl font-semibold">
                      {formatCurrency(item.rentPrice)}/month
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{item.location.city}, {item.location.state}</p>
                {item.location.postalCode && (
                  <p className="text-sm text-muted-foreground">{item.location.postalCode}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function InventoryManagement() {
  return (
    <Routes>
      <Route path="/" element={<InventoryList />} />
      <Route path="/new" element={<VehicleForm mode="create" />} />
      <Route path="/:inventoryId" element={<InventoryDetail />} />
      <Route path="/:inventoryId/edit" element={<VehicleForm mode="edit" />} />
    </Routes>
  )
}