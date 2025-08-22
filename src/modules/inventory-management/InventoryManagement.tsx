import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
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
  List,
  ArrowLeft
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
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('all')}>
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
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTypeFilter('rv')}>
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
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTypeFilter('manufactured_home')}>
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
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('available')}>
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
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
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
            label: "Add Inventory",
            onClick: () => navigate('/inventory/new')
          }}
        />
      ) : (
        <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
          {filteredInventory.map((item) => {
            const TypeIcon = getTypeIcon(item.listingType)
            
            if (viewMode === 'table') {
              return (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          {item.media?.primaryPhoto ? (
                            <img
                              src={item.media.primaryPhoto}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <TypeIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.year} {item.make} {item.model}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                            <span className="text-sm font-medium">
                              {item.salePrice ? formatCurrency(item.salePrice) : 
                               item.rentPrice ? `${formatCurrency(item.rentPrice)}/mo` : 'Price TBD'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/inventory/${item.id}`)}
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/inventory/${item.id}/edit`)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleShare(item)}
                        >
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/inventory/${item.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/inventory/${item.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare(item)}
                        >
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            }

            return (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-100 relative">
                  {item.media?.primaryPhoto ? (
                    <img
                      src={item.media.primaryPhoto}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <TypeIcon className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.year} {item.make} {item.model}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        {item.salePrice ? formatCurrency(item.salePrice) : 
                         item.rentPrice ? `${formatCurrency(item.rentPrice)}/mo` : 'Price TBD'}
                      </span>
                      <TypeIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    {item.location && (
                      <p className="text-sm text-muted-foreground">
                        {item.location.city}, {item.location.state}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/inventory/${item.id}`)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/inventory/${item.id}/edit`)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(item)}
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

function InventoryDetail() {
  const { inventoryId } = useParams<{ inventoryId: string }>()
  const navigate = useNavigate()
  const { inventory, loading, deleteVehicle } = useInventoryManagement()
  const { toast } = useToast()
  
  const [item, setItem] = useState<VehicleInventory | null>(null)

  useEffect(() => {
    if (inventoryId && inventory.length > 0) {
      const found = inventory.find(i => i.id === inventoryId)
      setItem(found || null)
    }
  }, [inventoryId, inventory])

  const handleEdit = () => {
    navigate(`/inventory/${inventoryId}/edit`)
  }

  const handleDelete = async () => {
    if (!item) return
    
    if (confirm('Are you sure you want to delete this inventory item?')) {
      try {
        await deleteVehicle(item.id)
        toast({
          title: 'Success',
          description: 'Inventory item deleted successfully'
        })
        navigate('/inventory')
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete inventory item',
          variant: 'destructive'
        })
      }
    }
  }

  const handleShare = () => {
    if (!item) return
    const url = `${window.location.origin}/public/demo/listing/${item.id}`
    navigator.clipboard.writeText(url)
    toast({
      title: 'Link Copied',
      description: 'Public listing URL copied to clipboard'
    })
  }

  const handleCreateListing = () => {
    navigate(`/property/listings/new?inventoryId=${item?.id}`)
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
            <Button variant="outline" onClick={handleCreateListing}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Create Listing
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
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
                  {item.media?.primaryPhoto ? (
                    <img
                      src={item.media.primaryPhoto}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <TypeIcon className="h-24 w-24 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description || 'No description available.'}
                </p>
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
                {item.cost && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cost</p>
                    <p>{formatCurrency(item.cost)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Year:</span>
                    <span className="ml-2">{item.year}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Make:</span>
                    <span className="ml-2">{item.make}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Model:</span>
                    <span className="ml-2">{item.model}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Condition:</span>
                    <span className="ml-2 capitalize">{item.condition}</span>
                  </div>
                  
                  {item.listingType === 'rv' && (
                    <>
                      {(item as RVInventory).sleeps && (
                        <div>
                          <span className="text-muted-foreground">Sleeps:</span>
                          <span className="ml-2">{(item as RVInventory).sleeps}</span>
                        </div>
                      )}
                      {(item as RVInventory).length && (
                        <div>
                          <span className="text-muted-foreground">Length:</span>
                          <span className="ml-2">{(item as RVInventory).length} ft</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  {item.listingType === 'manufactured_home' && (
                    <>
                      {(item as ManufacturedHomeInventory).bedrooms && (
                        <div>
                          <span className="text-muted-foreground">Bedrooms:</span>
                          <span className="ml-2">{(item as ManufacturedHomeInventory).bedrooms}</span>
                        </div>
                      )}
                      {(item as ManufacturedHomeInventory).bathrooms && (
                        <div>
                          <span className="text-muted-foreground">Bathrooms:</span>
                          <span className="ml-2">{(item as ManufacturedHomeInventory).bathrooms}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            {item.location && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function InventoryEdit() {
  const { inventoryId } = useParams<{ inventoryId: string }>()
  const navigate = useNavigate()
  const { inventory, loading, updateVehicle } = useInventoryManagement()
  const { toast } = useToast()
  
  const [item, setItem] = useState<VehicleInventory | null>(null)

  useEffect(() => {
    if (inventoryId && inventory.length > 0) {
      const found = inventory.find(i => i.id === inventoryId)
      setItem(found || null)
    }
  }, [inventoryId, inventory])

  const handleSave = async (formData: Partial<VehicleInventory>) => {
    if (!item) return
    
    try {
      await updateVehicle(item.id, formData)
      toast({
        title: 'Success',
        description: 'Inventory item updated successfully'
      })
      navigate(`/inventory/${item.id}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update inventory item',
        variant: 'destructive'
      })
    }
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/inventory/${inventoryId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Details
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Inventory Item</h1>
            <p className="text-muted-foreground">{item.title}</p>
          </div>
        </div>

        <VehicleForm
          initialData={item}
          onSave={handleSave}
          onCancel={() => navigate(`/inventory/${inventoryId}`)}
        />
      </div>
    </div>
  )
}

function InventoryCreate() {
  const navigate = useNavigate()
  const { createVehicle } = useInventoryManagement()
  const { toast } = useToast()

  const handleSave = async (formData: Partial<VehicleInventory>) => {
    try {
      const newItem = await createVehicle(formData)
      toast({
        title: 'Success',
        description: 'Inventory item created successfully'
      })
      navigate(`/inventory/${newItem.id}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create inventory item',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/inventory')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Add New Inventory Item</h1>
            <p className="text-muted-foreground">Create a new RV or manufactured home listing</p>
          </div>
        </div>

        <VehicleForm
          onSave={handleSave}
          onCancel={() => navigate('/inventory')}
        />
      </div>
    </div>
  )
}

export default function InventoryManagement() {
  const navigate = useNavigate()
  const { createVehicle, updateVehicle } = useInventoryManagement()
  const { toast } = useToast()

  return (
    <Routes>
      <Route path="/" element={<InventoryList />} />
      <Route path="/new" element={
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Add New Inventory</h1>
              <p className="text-muted-foreground">
                Add a new RV or manufactured home to your inventory
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/inventory')}>
              Back to Inventory
            </Button>
          </div>
          <VehicleForm
            mode="create"
            onSave={async (data) => {
              try {
                const newItem = await createVehicle(data)
                toast({
                  title: 'Success',
                  description: 'Inventory item created successfully'
                })
                navigate(`/inventory/${newItem.id}`)
              } catch (error) {
                toast({
                  title: 'Error',
                  description: 'Failed to create inventory item',
                  variant: 'destructive'
                })
              }
            }}
            onCancel={() => navigate('/inventory')}
          />
        </div>
      } />
      <Route path="/:inventoryId" element={<InventoryDetail />} />
      <Route path="/:inventoryId/edit" element={
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Inventory</h1>
              <p className="text-muted-foreground">
                Update inventory item details
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/inventory')}>
              Back to Inventory
            </Button>
          </div>
          <VehicleForm
            mode="edit"
            onSave={async (data) => {
              try {
                await updateVehicle(data.id!, data)
                toast({
                  title: 'Success',
                  description: 'Inventory item updated successfully'
                })
                navigate(`/inventory/${data.id}`)
              } catch (error) {
                toast({
                  title: 'Error',
                  description: 'Failed to update inventory item',
                  variant: 'destructive'
                })
              }
            }}
            onCancel={() => navigate('/inventory')}
          />
        </div>
      } />
    </Routes>
  )
}