import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Upload,
  Package,
  Home,
  Truck,
  DollarSign,
  MapPin,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  FileText
} from 'lucide-react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { mockInventory } from '@/mocks/inventoryMock'
import { GenerateBrochureModal } from '@/modules/brochures/components/GenerateBrochureModal'
import ErrorBoundary from '@/components/ErrorBoundary'

interface Vehicle {
  id: string
  listingType: 'rv' | 'manufactured_home'
  inventoryId: string
  year: number
  make: string
  model: string
  condition: string
  salePrice?: number
  rentPrice?: number
  offerType: string
  status: string
  location: {
    city: string
    state: string
    postalCode: string
  }
  media?: {
    primaryPhoto?: string
    photos?: string[]
  }
  // RV specific
  sleeps?: number
  slides?: number
  length?: number
  fuelType?: string
  engine?: string
  // MH specific
  bedrooms?: number
  bathrooms?: number
  dimensions?: {
    width_ft?: number
    length_ft?: number
    sections?: number
  }
  features?: Record<string, boolean>
  description?: string
  searchResultsText?: string
  createdAt: string
  updatedAt: string
}

function InventoryStats({ vehicles }: { vehicles: Vehicle[] }) {
  const stats = useMemo(() => {
    const total = vehicles.length
    const available = vehicles.filter(v => v.status === 'available').length
    const rvCount = vehicles.filter(v => v.listingType === 'rv').length
    const mhCount = vehicles.filter(v => v.listingType === 'manufactured_home').length
    
    const totalValue = vehicles
      .filter(v => v.status === 'available')
      .reduce((sum, v) => sum + (v.salePrice || v.rentPrice || 0), 0)

    return { total, available, rvCount, mhCount, totalValue }
  }, [vehicles])

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Units</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            {stats.available} available
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">RVs</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.rvCount}</div>
          <p className="text-xs text-muted-foreground">
            Travel trailers, motorhomes
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Manufactured Homes</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.mhCount}</div>
          <p className="text-xs text-muted-foreground">
            Single & double wide
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
            ${(stats.totalValue / 1000).toFixed(0)}K
          </div>
          <p className="text-xs text-muted-foreground">
            Available inventory
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function VehicleCard({ vehicle, onGenerateBrochure }: { 
  vehicle: Vehicle
  onGenerateBrochure: (vehicle: Vehicle) => void 
}) {
  const formatPrice = (price?: number) => {
    if (!price) return 'Contact for price'
    return `$${price.toLocaleString()}`
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'sold':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <img
          src={vehicle.media?.primaryPhoto || 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800'}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover"
        />
        <Badge 
          className={`absolute top-2 right-2 ${getStatusColor(vehicle.status)}`}
        >
          {vehicle.status}
        </Badge>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {vehicle.location.city}, {vehicle.location.state}
            </CardDescription>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                Create Listing
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onGenerateBrochure(vehicle)}>
                <FileText className="h-4 w-4 mr-2" />
                Generate Brochure
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2">
          {/* Pricing */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {vehicle.offerType === 'for_sale' ? 'Sale Price' : 
               vehicle.offerType === 'for_rent' ? 'Rent Price' : 'Price'}
            </span>
            <span className="font-semibold">
              {vehicle.offerType === 'both' 
                ? `${formatPrice(vehicle.salePrice)} / ${formatPrice(vehicle.rentPrice)}/mo`
                : formatPrice(vehicle.salePrice || vehicle.rentPrice)
              }
            </span>
          </div>
          
          {/* Key specs */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            {vehicle.listingType === 'rv' ? (
              <>
                {vehicle.sleeps && (
                  <div>
                    <span className="text-muted-foreground">Sleeps:</span> {vehicle.sleeps}
                  </div>
                )}
                {vehicle.length && (
                  <div>
                    <span className="text-muted-foreground">Length:</span> {vehicle.length}ft
                  </div>
                )}
              </>
            ) : (
              <>
                {vehicle.bedrooms && (
                  <div>
                    <span className="text-muted-foreground">Bedrooms:</span> {vehicle.bedrooms}
                  </div>
                )}
                {vehicle.bathrooms && (
                  <div>
                    <span className="text-muted-foreground">Bathrooms:</span> {vehicle.bathrooms}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function InventoryTable({ vehicles, onGenerateBrochure }: { 
  vehicles: Vehicle[]
  onGenerateBrochure: (vehicle: Vehicle) => void 
}) {
  const formatPrice = (price?: number) => {
    if (!price) return 'Contact for price'
    return `$${price.toLocaleString()}`
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'sold':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="border rounded-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Vehicle</th>
              <th className="text-left p-4 font-medium">Type</th>
              <th className="text-left p-4 font-medium">Price</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Location</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-b hover:bg-muted/50">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={vehicle.media?.primaryPhoto || 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=100'}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <div className="font-medium">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ID: {vehicle.inventoryId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant="outline">
                    {vehicle.listingType === 'rv' ? 'RV' : 'MH'}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="font-medium">
                    {formatPrice(vehicle.salePrice || vehicle.rentPrice)}
                  </div>
                  {vehicle.offerType === 'both' && (
                    <div className="text-sm text-muted-foreground">
                      Sale/Rent
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <Badge className={getStatusColor(vehicle.status)}>
                    {vehicle.status}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    {vehicle.location.city}, {vehicle.location.state}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        Create Listing
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onGenerateBrochure(vehicle)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Brochure
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [showBrochureModal, setShowBrochureModal] = useState(false)

  // Use mock data
  const vehicles = mockInventory.sampleVehicles as Vehicle[]

  // Filter vehicles based on search and filters
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      const matchesSearch = searchTerm === '' || 
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.inventoryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.location.city.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
      const matchesType = typeFilter === 'all' || vehicle.listingType === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [vehicles, searchTerm, statusFilter, typeFilter])

  const handleGenerateBrochure = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setShowBrochureModal(true)
  }

  const handleCloseBrochureModal = () => {
    setShowBrochureModal(false)
    setSelectedVehicle(null)
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
            <p className="text-muted-foreground">
              Search and filter your inventory
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        </div>

        {/* Stats */}
        <InventoryStats vehicles={vehicles} />

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by make, model, ID, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="pending">Pending</option>
                </select>
                
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">All Types</option>
                  <option value="rv">RVs</option>
                  <option value="manufactured_home">Manufactured Homes</option>
                </select>
                
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different views */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'table')}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                All ({filteredVehicles.length})
              </span>
              <span className="text-sm text-muted-foreground">
                RVs ({filteredVehicles.filter(v => v.listingType === 'rv').length})
              </span>
              <span className="text-sm text-muted-foreground">
                MH ({filteredVehicles.filter(v => v.listingType === 'manufactured_home').length})
              </span>
            </div>
          </div>

          <TabsContent value="grid" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard 
                  key={vehicle.id} 
                  vehicle={vehicle} 
                  onGenerateBrochure={handleGenerateBrochure}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="table" className="mt-6">
            <InventoryTable 
              vehicles={filteredVehicles} 
              onGenerateBrochure={handleGenerateBrochure}
            />
          </TabsContent>
        </Tabs>

        {/* Empty state */}
        {filteredVehicles.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No inventory found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Get started by adding your first vehicle to inventory'
                  }
                </p>
                {(!searchTerm && statusFilter === 'all' && typeFilter === 'all') && (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vehicle
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generate Brochure Modal */}
        {showBrochureModal && selectedVehicle && (
          <GenerateBrochureModal
            isOpen={showBrochureModal}
            onClose={handleCloseBrochureModal}
            inventoryItem={selectedVehicle}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}