import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Share, 
  ArrowLeft,
  Package,
  DollarSign,
  MapPin,
  Calendar,
  Download,
  Upload,
  MoreHorizontal,
  Grid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { mockInventory } from '@/mocks/inventoryMock'
import { VehicleForm } from './forms/VehicleForm'
import { EmptyState } from '@/components/ui/empty-state'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

// Types
interface Vehicle {
  id: string
  listingType: 'rv' | 'manufactured_home'
  inventoryId: string
  year: number
  make: string
  model: string
  vin?: string
  serialNumber?: string
  condition: 'new' | 'used'
  salePrice?: number
  rentPrice?: number
  offerType: 'for_sale' | 'for_rent' | 'both'
  status: 'available' | 'pending' | 'sold' | 'service'
  bedrooms?: number
  bathrooms?: number
  sleeps?: number
  slides?: number
  length?: number
  squareFootage?: number
  fuelType?: string
  engine?: string
  transmission?: string
  odometerMiles?: number
  description?: string
  searchResultsText?: string
  media?: {
    primaryPhoto?: string
    photos?: string[]
  }
  location?: {
    city?: string
    state?: string
    postalCode?: string
    communityName?: string
  }
  features?: Record<string, boolean>
  createdAt: string
  updatedAt: string
}

// Main Component
export default function InventoryManagement() {
  return (
    <Routes>
      <Route path="/" element={<InventoryList />} />
      <Route path="/new" element={<NewInventoryPage />} />
      <Route path="/:vehicleId" element={<VehicleDetailPage />} />
      <Route path="/:vehicleId/edit" element={<EditVehiclePage />} />
    </Routes>
  )
}

// Inventory List Component
function InventoryList() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { handleError } = useErrorHandler()
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'rv' | 'manufactured_home'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'pending' | 'sold' | 'service'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'year' | 'price' | 'make' | 'updated'>('updated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Load inventory data
  useEffect(() => {
    loadInventory()
  }, [])

  const loadInventory = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setVehicles(mockInventory.sampleVehicles)
    } catch (error) {
      handleError(error, 'loading inventory')
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort vehicles
  const filteredVehicles = vehicles
    .filter(vehicle => {
      const matchesSearch = searchTerm === '' || 
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.inventoryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vehicle.vin && vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesType = filterType === 'all' || vehicle.listingType === filterType
      const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus

      return matchesSearch && matchesType && matchesStatus
    })
    .sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case 'year':
          aValue = a.year
          bValue = b.year
          break
        case 'price':
          aValue = a.salePrice || a.rentPrice || 0
          bValue = b.salePrice || b.rentPrice || 0
          break
        case 'make':
          aValue = a.make
          bValue = b.make
          break
        case 'updated':
          aValue = new Date(a.updatedAt).getTime()
          bValue = new Date(b.updatedAt).getTime()
          break
        default:
          aValue = a.updatedAt
          bValue = b.updatedAt
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  // Handle actions
  const handleAddInventory = () => {
    navigate('/inventory/new')
  }

  const handleViewVehicle = (vehicleId: string) => {
    navigate(`/inventory/${vehicleId}`)
  }

  const handleEditVehicle = (vehicleId: string) => {
    navigate(`/inventory/${vehicleId}/edit`)
  }

  const handleShareVehicle = async (vehicle: Vehicle) => {
    const shareUrl = `${window.location.origin}/public/demo/listing/${vehicle.id}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: 'Link Copied',
        description: 'Public listing link copied to clipboard'
      })
    } catch (error) {
      toast({
        title: 'Share Failed',
        description: 'Could not copy link to clipboard',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      setVehicles(prev => prev.filter(v => v.id !== vehicleId))
      toast({
        title: 'Vehicle Deleted',
        description: 'Vehicle has been removed from inventory'
      })
    } catch (error) {
      handleError(error, 'deleting vehicle')
    }
  }

  const handleExportCSV = () => {
    const csvData = filteredVehicles.map(vehicle => ({
      'Inventory ID': vehicle.inventoryId,
      'Type': vehicle.listingType,
      'Year': vehicle.year,
      'Make': vehicle.make,
      'Model': vehicle.model,
      'VIN/Serial': vehicle.vin || vehicle.serialNumber || '',
      'Status': vehicle.status,
      'Sale Price': vehicle.salePrice || '',
      'Rent Price': vehicle.rentPrice || '',
      'Location': vehicle.location ? `${vehicle.location.city}, ${vehicle.location.state}` : '',
      'Created': new Date(vehicle.createdAt).toLocaleDateString()
    }))

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `inventory-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: 'Export Complete',
      description: 'Inventory data exported to CSV'
    })
  }

  // Calculate stats
  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'available').length,
    pending: vehicles.filter(v => v.status === 'pending').length,
    sold: vehicles.filter(v => v.status === 'sold').length,
    totalValue: vehicles.reduce((sum, v) => sum + (v.salePrice || v.rentPrice || 0), 0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'sold': return 'bg-blue-100 text-blue-800'
      case 'service': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    return type === 'manufactured_home' ? 'Manufactured Home' : 'RV'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage your vehicle inventory and listings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleAddInventory}>
            <Plus className="h-4 w-4 mr-2" />
            Add Inventory
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.available}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sold</CardTitle>
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sold}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by make, model, VIN, or inventory ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="rv">RV</option>
                <option value="manufactured_home">Manufactured Home</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
                <option value="service">Service</option>
              </select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy('updated')}>
                    Sort by Updated
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('year')}>
                    Sort by Year
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('price')}>
                    Sort by Price
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('make')}>
                    Sort by Make
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                    {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filteredVehicles.length === 0 ? (
        <EmptyState
          title="No inventory found"
          description="No vehicles match your current filters. Try adjusting your search criteria or add new inventory."
          icon={<Package className="h-12 w-12" />}
          action={{
            label: "Add Inventory",
            onClick: handleAddInventory
          }}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredVehicles.length} of {vehicles.length} vehicles
            </p>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onView={() => handleViewVehicle(vehicle.id)}
                  onEdit={() => handleEditVehicle(vehicle.id)}
                  onShare={() => handleShareVehicle(vehicle)}
                  onDelete={() => handleDeleteVehicle(vehicle.id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVehicles.map((vehicle) => (
                <VehicleListItem
                  key={vehicle.id}
                  vehicle={vehicle}
                  onView={() => handleViewVehicle(vehicle.id)}
                  onEdit={() => handleEditVehicle(vehicle.id)}
                  onShare={() => handleShareVehicle(vehicle)}
                  onDelete={() => handleDeleteVehicle(vehicle.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Vehicle Card Component
interface VehicleCardProps {
  vehicle: Vehicle
  onView: () => void
  onEdit: () => void
  onShare: () => void
  onDelete: () => void
}

function VehicleCard({ vehicle, onView, onEdit, onShare, onDelete }: VehicleCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'sold': return 'bg-blue-100 text-blue-800'
      case 'service': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    return type === 'manufactured_home' ? 'Manufactured Home' : 'RV'
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="aspect-video bg-gray-100 relative">
        {vehicle.media?.primaryPhoto ? (
          <img
            src={vehicle.media.primaryPhoto}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge className={getStatusColor(vehicle.status)}>
            {vehicle.status}
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className="bg-white/90">
            {getTypeLabel(vehicle.listingType)}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </CardTitle>
            <CardDescription className="mt-1">
              ID: {vehicle.inventoryId}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onView}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onShare}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this vehicle? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Specs */}
        <div className="space-y-2 mb-4">
          {vehicle.listingType === 'rv' ? (
            <div className="grid grid-cols-2 gap-2 text-sm">
              {vehicle.sleeps && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sleeps:</span>
                  <span>{vehicle.sleeps}</span>
                </div>
              )}
              {vehicle.length && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Length:</span>
                  <span>{vehicle.length}ft</span>
                </div>
              )}
              {vehicle.slides && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Slides:</span>
                  <span>{vehicle.slides}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 text-sm">
              {vehicle.bedrooms && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bedrooms:</span>
                  <span>{vehicle.bedrooms}</span>
                </div>
              )}
              {vehicle.bathrooms && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bathrooms:</span>
                  <span>{vehicle.bathrooms}</span>
                </div>
              )}
              {vehicle.squareFootage && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sq Ft:</span>
                  <span>{vehicle.squareFootage}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="space-y-1 mb-4">
          {vehicle.salePrice && (
            <div className="text-lg font-bold text-green-600">
              ${vehicle.salePrice.toLocaleString()}
              {vehicle.offerType === 'both' && <span className="text-sm text-muted-foreground"> sale</span>}
            </div>
          )}
          {vehicle.rentPrice && (
            <div className="text-lg font-bold text-blue-600">
              ${vehicle.rentPrice.toLocaleString()}/mo
              {vehicle.offerType === 'both' && <span className="text-sm text-muted-foreground"> rent</span>}
            </div>
          )}
        </div>

        {/* Location */}
        {vehicle.location && (
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            {vehicle.location.city}, {vehicle.location.state}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button size="sm" onClick={onView} className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button size="sm" variant="outline" onClick={onEdit} className="flex-1">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button size="sm" variant="outline" onClick={onShare}>
            <Share className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this vehicle? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}

// Vehicle List Item Component (for list view)
function VehicleListItem({ vehicle, onView, onEdit, onShare, onDelete }: VehicleCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'sold': return 'bg-blue-100 text-blue-800'
      case 'service': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Image */}
          <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0">
            {vehicle.media?.primaryPhoto ? (
              <img
                src={vehicle.media.primaryPhoto}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h3>
                <p className="text-sm text-muted-foreground">
                  ID: {vehicle.inventoryId} • {vehicle.listingType === 'manufactured_home' ? 'Manufactured Home' : 'RV'}
                </p>
                {vehicle.location && (
                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {vehicle.location.city}, {vehicle.location.state}
                  </p>
                )}
              </div>
              <div className="text-right">
                <Badge className={getStatusColor(vehicle.status)}>
                  {vehicle.status}
                </Badge>
                <div className="mt-2">
                  {vehicle.salePrice && (
                    <div className="text-lg font-bold text-green-600">
                      ${vehicle.salePrice.toLocaleString()}
                    </div>
                  )}
                  {vehicle.rentPrice && (
                    <div className="text-sm text-blue-600">
                      ${vehicle.rentPrice.toLocaleString()}/mo
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={onView}>
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button size="sm" variant="outline" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button size="sm" variant="outline" onClick={onShare}>
              <Share className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this vehicle? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// New Inventory Page
function NewInventoryPage() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSave = async (vehicleData: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newVehicle = {
        ...vehicleData,
        id: `vh-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      toast({
        title: 'Vehicle Added',
        description: 'New vehicle has been added to inventory'
      })

      navigate(`/inventory/${newVehicle.id}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add vehicle to inventory',
        variant: 'destructive'
      })
    }
  }

  const handleCancel = () => {
    navigate('/inventory')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/inventory')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inventory
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Vehicle</h1>
          <p className="text-muted-foreground">
            Add a new vehicle to your inventory
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <VehicleForm
            mode="create"
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  )
}

// Vehicle Detail Page
function VehicleDetailPage() {
  const { vehicleId } = useParams<{ vehicleId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVehicle()
  }, [vehicleId])

  const loadVehicle = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      const found = mockInventory.sampleVehicles.find(v => v.id === vehicleId)
      setVehicle(found || null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load vehicle details',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    navigate(`/inventory/${vehicleId}/edit`)
  }

  const handleShare = async () => {
    if (!vehicle) return
    const shareUrl = `${window.location.origin}/public/demo/listing/${vehicle.id}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: 'Link Copied',
        description: 'Public listing link copied to clipboard'
      })
    } catch (error) {
      toast({
        title: 'Share Failed',
        description: 'Could not copy link to clipboard',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/inventory')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vehicle Not Found</h1>
          </div>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground">The vehicle you're looking for could not be found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/inventory')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            <p className="text-muted-foreground">
              Inventory ID: {vehicle.inventoryId}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {vehicle.media?.primaryPhoto && (
            <Card>
              <CardContent className="p-0">
                <img
                  src={vehicle.media.primaryPhoto}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {vehicle.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{vehicle.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Year</label>
                  <p>{vehicle.year}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Make</label>
                  <p>{vehicle.make}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Model</label>
                  <p>{vehicle.model}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Condition</label>
                  <p className="capitalize">{vehicle.condition}</p>
                </div>
                {vehicle.vin && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">VIN</label>
                    <p className="font-mono text-sm">{vehicle.vin}</p>
                  </div>
                )}
                {vehicle.serialNumber && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Serial Number</label>
                    <p className="font-mono text-sm">{vehicle.serialNumber}</p>
                  </div>
                )}
                {vehicle.listingType === 'rv' ? (
                  <>
                    {vehicle.sleeps && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Sleeps</label>
                        <p>{vehicle.sleeps}</p>
                      </div>
                    )}
                    {vehicle.length && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Length</label>
                        <p>{vehicle.length} ft</p>
                      </div>
                    )}
                    {vehicle.slides && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Slides</label>
                        <p>{vehicle.slides}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {vehicle.bedrooms && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Bedrooms</label>
                        <p>{vehicle.bedrooms}</p>
                      </div>
                    )}
                    {vehicle.bathrooms && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Bathrooms</label>
                        <p>{vehicle.bathrooms}</p>
                      </div>
                    )}
                    {vehicle.squareFootage && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Square Footage</label>
                        <p>{vehicle.squareFootage} sq ft</p>
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
          {/* Status & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge className={`${vehicle.status === 'available' ? 'bg-green-100 text-green-800' : 
                    vehicle.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    vehicle.status === 'sold' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                    {vehicle.status}
                  </Badge>
                </div>
              </div>
              {vehicle.salePrice && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Sale Price</label>
                  <p className="text-2xl font-bold text-green-600">
                    ${vehicle.salePrice.toLocaleString()}
                  </p>
                </div>
              )}
              {vehicle.rentPrice && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Rent Price</label>
                  <p className="text-2xl font-bold text-blue-600">
                    ${vehicle.rentPrice.toLocaleString()}/mo
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          {vehicle.location && (
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{vehicle.location.city}, {vehicle.location.state}</span>
                  </div>
                  {vehicle.location.postalCode && (
                    <p className="text-sm text-muted-foreground">
                      {vehicle.location.postalCode}
                    </p>
                  )}
                  {vehicle.location.communityName && (
                    <p className="text-sm text-muted-foreground">
                      {vehicle.location.communityName}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          {vehicle.features && Object.keys(vehicle.features).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(vehicle.features).map(([feature, enabled]) => (
                    enabled && (
                      <div key={feature} className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm capitalize">
                          {feature.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>Record Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="text-sm">{new Date(vehicle.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p className="text-sm">{new Date(vehicle.updatedAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Edit Vehicle Page
function EditVehiclePage() {
  const { vehicleId } = useParams<{ vehicleId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVehicle()
  }, [vehicleId])

  const loadVehicle = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      const found = mockInventory.sampleVehicles.find(v => v.id === vehicleId)
      setVehicle(found || null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load vehicle details',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (vehicleData: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Vehicle Updated',
        description: 'Vehicle details have been saved'
      })

      navigate(`/inventory/${vehicleId}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update vehicle',
        variant: 'destructive'
      })
    }
  }

  const handleCancel = () => {
    navigate(`/inventory/${vehicleId}`)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/inventory')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vehicle Not Found</h1>
          </div>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground">The vehicle you're looking for could not be found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(`/inventory/${vehicleId}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Details
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
          <p className="text-muted-foreground">
            Update vehicle information and settings
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <VehicleForm
            mode="edit"
            initialData={vehicle}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  )
}