import React, { useState, useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Download,
  ArrowLeft,
  Eye,
  Edit,
  Share,
  Trash2,
  MoreHorizontal
} from 'lucide-react'
import { VehicleForm } from './forms/VehicleForm'
import { mockInventory } from '@/mocks/inventoryMock'
import { useToast } from '@/hooks/use-toast'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

export default function InventoryManagement() {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  // Modal state for add inventory
  const [showAddModal, setShowAddModal] = useState(false)
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updated')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Determine current view based on URL
  const isNewPage = location.pathname === '/inventory/new'
  const isEditPage = location.pathname.includes('/edit')
  const isDetailPage = location.pathname.match(/^\/inventory\/[^\/]+$/) && !isNewPage && !isEditPage
  const isListPage = location.pathname === '/inventory' || location.pathname === '/inventory/'

  // Get vehicle ID from URL for edit/detail pages
  const vehicleId = location.pathname.split('/')[2]
  const currentVehicle = mockInventory.sampleVehicles.find(v => v.id === vehicleId)

  // Filter and sort vehicles
  const filteredVehicles = useMemo(() => {
    let filtered = mockInventory.sampleVehicles.filter(vehicle => {
      const matchesSearch = searchTerm === '' || 
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.inventoryId.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = typeFilter === 'all' || vehicle.listingType === typeFilter
      const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })

    // Sort vehicles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'year':
          return (b.year || 0) - (a.year || 0)
        case 'price':
          return (b.salePrice || 0) - (a.salePrice || 0)
        case 'make':
          return a.make.localeCompare(b.make)
        case 'updated':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })

    return filtered
  }, [searchTerm, typeFilter, statusFilter, sortBy])

  // Calculate stats
  const stats = useMemo(() => {
    const total = mockInventory.sampleVehicles.length
    const available = mockInventory.sampleVehicles.filter(v => v.status === 'available').length
    const pending = mockInventory.sampleVehicles.filter(v => v.status === 'pending').length
    const sold = mockInventory.sampleVehicles.filter(v => v.status === 'sold').length
    const totalValue = mockInventory.sampleVehicles
      .filter(v => v.status === 'available')
      .reduce((sum, v) => sum + (v.salePrice || 0), 0)

    return { total, available, pending, sold, totalValue }
  }, [])

  const handleCreateVehicle = async (vehicleData: any) => {
    try {
      // In a real app, this would call an API
      console.log('Creating vehicle:', vehicleData)
      
      toast({
        title: 'Success',
        description: 'Vehicle added to inventory successfully'
      })
      
      // Close modal and refresh the list
      setShowAddModal(false)
      // In a real app, you would refresh the data here
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add vehicle to inventory',
        variant: 'destructive'
      })
    }
  }

  const handleUpdateVehicle = async (vehicleData: any) => {
    try {
      console.log('Updating vehicle:', vehicleData)
      
      toast({
        title: 'Success',
        description: 'Vehicle updated successfully'
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

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      console.log('Deleting vehicle:', vehicleId)
      
      toast({
        title: 'Success',
        description: 'Vehicle deleted successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete vehicle',
        variant: 'destructive'
      })
    }
  }

  const handleShareVehicle = (vehicleId: string) => {
    const shareUrl = `${window.location.origin}/public/demo/listing/${vehicleId}`
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: 'Link Copied',
      description: 'Public listing link copied to clipboard'
    })
  }

  const handleExportCSV = () => {
    const csvData = filteredVehicles.map(vehicle => ({
      'Inventory ID': vehicle.inventoryId,
      'Type': vehicle.listingType,
      'Year': vehicle.year,
      'Make': vehicle.make,
      'Model': vehicle.model,
      'VIN': vehicle.vin || vehicle.serialNumber,
      'Status': vehicle.status,
      'Sale Price': vehicle.salePrice || '',
      'Rent Price': vehicle.rentPrice || '',
      'Location': `${vehicle.location.city}, ${vehicle.location.state}`,
      'Created': new Date(vehicle.createdAt).toLocaleDateString()
    }))

    const csvContent = [
      Object.keys(csvData[0] || {}).join(','),
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

  // Render vehicle card for grid view
  const renderVehicleCard = (vehicle: any) => (
    <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative">
        <img 
          src={vehicle.media?.primaryPhoto || 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=400'} 
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge variant={vehicle.status === 'available' ? 'default' : 'secondary'}>
            {vehicle.status}
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className="bg-white/90">
            {vehicle.listingType === 'rv' ? 'RV' : 'MH'}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              ID: {vehicle.inventoryId}
            </div>
            <div className="text-right">
              {vehicle.salePrice && (
                <div className="font-semibold text-lg">
                  ${vehicle.salePrice.toLocaleString()}
                </div>
              )}
              {vehicle.rentPrice && (
                <div className="text-sm text-muted-foreground">
                  ${vehicle.rentPrice}/mo
                </div>
              )}
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {vehicle.listingType === 'rv' ? (
              <div className="flex justify-between">
                <span>Sleeps: {vehicle.sleeps || 'N/A'}</span>
                <span>Length: {vehicle.length || 'N/A'}ft</span>
              </div>
            ) : (
              <div className="flex justify-between">
                <span>{vehicle.bedrooms || 0}BR/{vehicle.bathrooms || 0}BA</span>
                <span>{vehicle.dimensions?.width_ft || 'N/A'}x{vehicle.dimensions?.length_ft || 'N/A'}ft</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1">
              <Button size="sm" variant="outline" onClick={() => navigate(`/inventory/${vehicle.id}`)}>
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate(`/inventory/${vehicle.id}/edit`)}>
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleShareVehicle(vehicle.id)}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
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
                      <AlertDialogAction onClick={() => handleDeleteVehicle(vehicle.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // Render vehicle row for list view
  const renderVehicleRow = (vehicle: any) => (
    <Card key={vehicle.id} className="p-4">
      <div className="flex items-center gap-4">
        <img 
          src={vehicle.media?.primaryPhoto || 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=100'} 
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="w-16 h-16 object-cover rounded"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <Badge variant={vehicle.status === 'available' ? 'default' : 'secondary'} className="shrink-0">
              {vehicle.status}
            </Badge>
            <Badge variant="outline" className="shrink-0">
              {vehicle.listingType === 'rv' ? 'RV' : 'MH'}
            </Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            ID: {vehicle.inventoryId} • {vehicle.location.city}, {vehicle.location.state}
          </div>
          
          <div className="text-sm text-muted-foreground">
            {vehicle.listingType === 'rv' ? (
              `Sleeps: ${vehicle.sleeps || 'N/A'} • Length: ${vehicle.length || 'N/A'}ft`
            ) : (
              `${vehicle.bedrooms || 0}BR/${vehicle.bathrooms || 0}BA • ${vehicle.dimensions?.width_ft || 'N/A'}x${vehicle.dimensions?.length_ft || 'N/A'}ft`
            )}
          </div>
        </div>

        <div className="text-right">
          {vehicle.salePrice && (
            <div className="font-semibold">
              ${vehicle.salePrice.toLocaleString()}
            </div>
          )}
          {vehicle.rentPrice && (
            <div className="text-sm text-muted-foreground">
              ${vehicle.rentPrice}/mo
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button size="sm" variant="outline" onClick={() => navigate(`/inventory/${vehicle.id}`)}>
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate(`/inventory/${vehicle.id}/edit`)}>
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleShareVehicle(vehicle.id)}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
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
                    <AlertDialogAction onClick={() => handleDeleteVehicle(vehicle.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  )

  // Handle different page views
  if (isNewPage) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/inventory')}>
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
          <CardContent className="pt-6">
            <VehicleForm
              mode="create"
              onSave={handleCreateVehicle}
              onCancel={() => navigate('/inventory')}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isEditPage && currentVehicle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/inventory')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Vehicle</h1>
            <p className="text-muted-foreground">
              Update vehicle information
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <VehicleForm
              mode="edit"
              initialData={currentVehicle}
              onSave={handleUpdateVehicle}
              onCancel={() => navigate('/inventory')}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isDetailPage && currentVehicle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/inventory')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vehicle Details</h1>
            <p className="text-muted-foreground">
              View vehicle information
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <img 
                  src={currentVehicle.media?.primaryPhoto || 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=600'} 
                  alt={`${currentVehicle.year} ${currentVehicle.make} ${currentVehicle.model}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    {currentVehicle.year} {currentVehicle.make} {currentVehicle.model}
                  </h2>
                  <p className="text-muted-foreground">ID: {currentVehicle.inventoryId}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Status:</span>
                    <Badge className="ml-2">{currentVehicle.status}</Badge>
                  </div>
                  <div>
                    <span className="font-medium">Type:</span>
                    <span className="ml-2">{currentVehicle.listingType === 'rv' ? 'RV' : 'Manufactured Home'}</span>
                  </div>
                  <div>
                    <span className="font-medium">VIN:</span>
                    <span className="ml-2">{currentVehicle.vin || currentVehicle.serialNumber}</span>
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>
                    <span className="ml-2">{currentVehicle.location.city}, {currentVehicle.location.state}</span>
                  </div>
                </div>

                {currentVehicle.salePrice && (
                  <div>
                    <span className="font-medium">Sale Price:</span>
                    <span className="ml-2 text-lg font-bold">${currentVehicle.salePrice.toLocaleString()}</span>
                  </div>
                )}

                {currentVehicle.rentPrice && (
                  <div>
                    <span className="font-medium">Rent Price:</span>
                    <span className="ml-2 text-lg font-bold">${currentVehicle.rentPrice}/month</span>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button onClick={() => navigate(`/inventory/${currentVehicle.id}/edit`)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Vehicle
                  </Button>
                  <Button variant="outline" onClick={() => handleShareVehicle(currentVehicle.id)}>
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main inventory list view
  if (isListPage || location.pathname === '/inventory') {
    return (
      <div className="space-y-6">
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
            <Button onClick={() => setShowAddModal(true)}>
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
              <div className="h-2 w-2 bg-green-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold stat-success">{stats.available}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <div className="h-2 w-2 bg-yellow-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold stat-warning">{stats.pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sold</CardTitle>
              <div className="h-2 w-2 bg-blue-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold stat-primary">{stats.sold}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold stat-primary">${stats.totalValue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by make, model, VIN, or inventory ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="rv">RV</SelectItem>
                    <SelectItem value="manufactured_home">Manufactured Home</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="updated">Recently Updated</SelectItem>
                    <SelectItem value="year">Year (Newest)</SelectItem>
                    <SelectItem value="price">Price (Highest)</SelectItem>
                    <SelectItem value="make">Make (A-Z)</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredVehicles.length} of {mockInventory.sampleVehicles.length} vehicles
            </p>
          </div>

          {filteredVehicles.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold mb-2">No vehicles found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filters'
                      : 'Get started by adding your first vehicle to inventory'
                    }
                  </p>
                  <Button onClick={() => setShowAddModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Vehicle
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' 
              : 'space-y-4'
            }>
              {filteredVehicles.map(vehicle => 
                viewMode === 'grid' ? renderVehicleCard(vehicle) : renderVehicleRow(vehicle)
              )}
            </div>
          )}
        </div>

        {/* Add Inventory Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
            </DialogHeader>
            <VehicleForm
              mode="create"
              onSave={handleCreateVehicle}
              onCancel={() => setShowAddModal(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Fallback - redirect to main inventory list
  return <div>Loading...</div>
}