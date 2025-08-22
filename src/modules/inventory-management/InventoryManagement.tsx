import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2,
  Download,
  Upload,
  BarChart3,
  MapPin,
  DollarSign,
  Calendar
} from 'lucide-react'
import { mockInventory } from '@/mocks/inventoryMock'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency, formatDate } from '@/lib/utils'
import { EmptyState } from '@/components/ui/empty-state'

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
  dimensions?: {
    width_ft?: number
    length_ft?: number
    sections?: number
    sqft?: number
  }
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

function InventoryOverview() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    // Load mock inventory data
    setVehicles(mockInventory.sampleVehicles)
  }, [])

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = searchTerm === '' || 
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.inventoryId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
    const matchesType = typeFilter === 'all' || vehicle.listingType === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'available').length,
    pending: vehicles.filter(v => v.status === 'pending').length,
    sold: vehicles.filter(v => v.status === 'sold').length,
    totalValue: vehicles.reduce((sum, v) => sum + (v.salePrice || v.rentPrice || 0), 0)
  }

  const handleViewVehicle = (vehicleId: string) => {
    navigate(`/inventory/${vehicleId}`)
  }

  const handleEditVehicle = (vehicleId: string) => {
    navigate(`/inventory/${vehicleId}/edit`)
  }

  const handleDeleteVehicle = (vehicleId: string) => {
    setVehicles(prev => prev.filter(v => v.id !== vehicleId))
    toast({
      title: 'Vehicle Deleted',
      description: 'The vehicle has been removed from inventory.'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'sold':
        return 'bg-blue-100 text-blue-800'
      case 'service':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
        <Button onClick={() => navigate('/inventory/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
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
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sold</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.sold}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by make, model, or inventory ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
              <option value="service">Service</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">All Types</option>
              <option value="rv">RV</option>
              <option value="manufactured_home">Manufactured Home</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory ({filteredVehicles.length})</CardTitle>
          <CardDescription>
            Manage your vehicle inventory and listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredVehicles.length === 0 ? (
            <EmptyState
              title="No vehicles found"
              description="No vehicles match your current filters. Try adjusting your search criteria."
              icon={<Package className="h-12 w-12" />}
              action={{
                label: "Add Vehicle",
                onClick: () => navigate('/inventory/new')
              }}
            />
          ) : (
            <div className="space-y-4">
              {filteredVehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    {vehicle.media?.primaryPhoto && (
                      <img 
                        src={vehicle.media.primaryPhoto} 
                        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        ID: {vehicle.inventoryId}
                        {vehicle.vin && ` • VIN: ${vehicle.vin}`}
                        {vehicle.serialNumber && ` • Serial: ${vehicle.serialNumber}`}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {vehicle.listingType === 'rv' ? 'RV' : 'Manufactured Home'}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(vehicle.status)}`}>
                          {vehicle.status}
                        </Badge>
                        {vehicle.location && (
                          <span className="text-xs text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {vehicle.location.city}, {vehicle.location.state}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right mr-4">
                      {vehicle.salePrice && (
                        <div className="font-semibold text-green-600">
                          {formatCurrency(vehicle.salePrice)}
                        </div>
                      )}
                      {vehicle.rentPrice && (
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(vehicle.rentPrice)}/mo
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewVehicle(vehicle.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditVehicle(vehicle.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function VehicleDetail() {
  const { inventoryId } = useParams<{ inventoryId: string }>()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Find vehicle by ID
    const foundVehicle = mockInventory.sampleVehicles.find(v => v.id === inventoryId)
    setVehicle(foundVehicle || null)
    setLoading(false)
  }, [inventoryId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/inventory')}>
            ← Back to Inventory
          </Button>
        </div>
        <EmptyState
          title="Vehicle Not Found"
          description="The vehicle you're looking for could not be found."
          icon={<Package className="h-12 w-12" />}
          action={{
            label: "Back to Inventory",
            onClick: () => navigate('/inventory')
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/inventory')}>
            ← Back to Inventory
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
          <Button variant="outline" onClick={() => navigate(`/inventory/${vehicle.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Year</label>
                <p className="text-sm">{vehicle.year}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Make</label>
                <p className="text-sm">{vehicle.make}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Model</label>
                <p className="text-sm">{vehicle.model}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Condition</label>
                <p className="text-sm capitalize">{vehicle.condition}</p>
              </div>
              {vehicle.vin && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">VIN</label>
                  <p className="text-sm font-mono">{vehicle.vin}</p>
                </div>
              )}
              {vehicle.serialNumber && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Serial Number</label>
                  <p className="text-sm font-mono">{vehicle.serialNumber}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {vehicle.salePrice && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Sale Price</label>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(vehicle.salePrice)}
                  </p>
                </div>
              )}
              {vehicle.rentPrice && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Rent Price</label>
                  <p className="text-lg font-semibold text-blue-600">
                    {formatCurrency(vehicle.rentPrice)}/mo
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <Badge className={getStatusColor(vehicle.status)}>
                  {vehicle.status}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Offer Type</label>
                <p className="text-sm capitalize">{vehicle.offerType.replace('_', ' ')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {vehicle.listingType === 'rv' ? (
                <>
                  {vehicle.sleeps && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Sleeps</label>
                      <p className="text-sm">{vehicle.sleeps}</p>
                    </div>
                  )}
                  {vehicle.length && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Length</label>
                      <p className="text-sm">{vehicle.length} ft</p>
                    </div>
                  )}
                  {vehicle.slides && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Slides</label>
                      <p className="text-sm">{vehicle.slides}</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {vehicle.bedrooms && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Bedrooms</label>
                      <p className="text-sm">{vehicle.bedrooms}</p>
                    </div>
                  )}
                  {vehicle.bathrooms && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Bathrooms</label>
                      <p className="text-sm">{vehicle.bathrooms}</p>
                    </div>
                  )}
                  {vehicle.dimensions?.sqft && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Square Feet</label>
                      <p className="text-sm">{vehicle.dimensions.sqft.toLocaleString()} sq ft</p>
                    </div>
                  )}
                </>
              )}
            </div>
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
                  <span>
                    {vehicle.location.city}, {vehicle.location.state}
                    {vehicle.location.postalCode && ` ${vehicle.location.postalCode}`}
                  </span>
                </div>
                {vehicle.location.communityName && (
                  <p className="text-sm text-muted-foreground">
                    {vehicle.location.communityName}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Description */}
      {vehicle.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{vehicle.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Photos */}
      {vehicle.media?.photos && vehicle.media.photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {vehicle.media.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`${vehicle.make} ${vehicle.model} - Photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function VehicleForm() {
  const { inventoryId } = useParams<{ inventoryId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const isEdit = inventoryId !== 'new'

  const [formData, setFormData] = useState({
    listingType: 'rv' as 'rv' | 'manufactured_home',
    year: new Date().getFullYear(),
    make: '',
    model: '',
    vin: '',
    condition: 'new' as 'new' | 'used',
    salePrice: '',
    rentPrice: '',
    offerType: 'for_sale' as 'for_sale' | 'for_rent' | 'both',
    status: 'available' as 'available' | 'pending' | 'sold' | 'service',
    description: '',
    city: '',
    state: '',
    postalCode: ''
  })

  useEffect(() => {
    if (isEdit) {
      // Load existing vehicle data
      const vehicle = mockInventory.sampleVehicles.find(v => v.id === inventoryId)
      if (vehicle) {
        setFormData({
          listingType: vehicle.listingType,
          year: vehicle.year,
          make: vehicle.make,
          model: vehicle.model,
          vin: vehicle.vin || '',
          condition: vehicle.condition,
          salePrice: vehicle.salePrice?.toString() || '',
          rentPrice: vehicle.rentPrice?.toString() || '',
          offerType: vehicle.offerType,
          status: vehicle.status,
          description: vehicle.description || '',
          city: vehicle.location?.city || '',
          state: vehicle.location?.state || '',
          postalCode: vehicle.location?.postalCode || ''
        })
      }
    }
  }, [inventoryId, isEdit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.make || !formData.model) {
      toast({
        title: 'Validation Error',
        description: 'Make and model are required.',
        variant: 'destructive'
      })
      return
    }

    // Simulate save
    toast({
      title: isEdit ? 'Vehicle Updated' : 'Vehicle Added',
      description: `${formData.year} ${formData.make} ${formData.model} has been ${isEdit ? 'updated' : 'added'} to inventory.`
    })

    navigate('/inventory')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/inventory')}>
            ← Back to Inventory
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h1>
            <p className="text-muted-foreground">
              {isEdit ? 'Update vehicle information' : 'Add a new vehicle to your inventory'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
          <CardDescription>
            Enter the details for this vehicle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Listing Type</label>
                <select
                  value={formData.listingType}
                  onChange={(e) => setFormData({ ...formData, listingType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="rv">RV</option>
                  <option value="manufactured_home">Manufactured Home</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Year</label>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Make *</label>
                <Input
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  placeholder="e.g., Forest River, Clayton"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Model *</label>
                <Input
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="e.g., Cherokee, The Edge"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">VIN/Serial Number</label>
                <Input
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                  placeholder="Enter VIN or serial number"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Condition</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                </select>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Sale Price</label>
                <Input
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Rent Price (Monthly)</label>
                <Input
                  type="number"
                  value={formData.rentPrice}
                  onChange={(e) => setFormData({ ...formData, rentPrice: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Offer Type</label>
                <select
                  value={formData.offerType}
                  onChange={(e) => setFormData({ ...formData, offerType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="for_sale">For Sale</option>
                  <option value="for_rent">For Rent</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
                <option value="service">In Service</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter vehicle description..."
                rows={4}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">City</label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                />
              </div>
              <div>
                <label className="text-sm font-medium">State</label>
                <Input
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="State"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Postal Code</label>
                <Input
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="Postal Code"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4">
              <Button type="submit">
                {isEdit ? 'Update Vehicle' : 'Add Vehicle'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/inventory')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function InventoryManagement() {
  return (
    <Routes>
      <Route path="/" element={<InventoryOverview />} />
      <Route path="/new" element={<VehicleForm />} />
      <Route path="/:inventoryId" element={<VehicleDetail />} />
      <Route path="/:inventoryId/edit" element={<VehicleForm />} />
    </Routes>
  )
}