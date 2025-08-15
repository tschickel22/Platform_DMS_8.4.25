import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
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
  Download,
  Upload,
  BarChart3,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { mockInventory } from '@/mocks/inventoryMock'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import ErrorBoundary from '@/components/ErrorBoundary'

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
  status: 'available' | 'reserved' | 'sold' | 'service'
  bedrooms?: number
  bathrooms?: number
  sleeps?: number
  slides?: number
  length?: number
  dimensions?: {
    width_ft?: number
    length_ft?: number
    sections?: number
    squareFeet?: number
  }
  location: {
    city: string
    state: string
    postalCode?: string
  }
  media?: {
    primaryPhoto?: string
    photos?: string[]
  }
  features?: Record<string, boolean>
  description?: string
  searchResultsText?: string
  createdAt: string
  updatedAt: string
}

function InventoryStats() {
  const vehicles = mockInventory.sampleVehicles as Vehicle[]
  
  const totalUnits = vehicles.length
  const availableUnits = vehicles.filter(v => v.status === 'available').length
  const soldUnits = vehicles.filter(v => v.status === 'sold').length
  const totalValue = vehicles
    .filter(v => v.status === 'available')
    .reduce((sum, v) => sum + (v.salePrice || v.rentPrice || 0), 0)

  const stats = [
    {
      title: 'Total Units',
      value: totalUnits.toString(),
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'Available',
      value: availableUnits.toString(),
      icon: Package,
      color: 'text-green-600'
    },
    {
      title: 'Sold This Month',
      value: soldUnits.toString(),
      icon: BarChart3,
      color: 'text-purple-600'
    },
    {
      title: 'Total Value',
      value: formatCurrency(totalValue),
      icon: BarChart3,
      color: 'text-emerald-600'
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function VehicleCard({ vehicle, onView, onEdit, onDelete }: {
  vehicle: Vehicle
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800'
      case 'sold':
        return 'bg-blue-100 text-blue-800'
      case 'service':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeDisplay = (vehicle: Vehicle) => {
    if (vehicle.listingType === 'rv') {
      return `${vehicle.year} ${vehicle.make} ${vehicle.model}`
    }
    return `${vehicle.year} ${vehicle.make} ${vehicle.model} - ${vehicle.bedrooms}BR/${vehicle.bathrooms}BA`
  }

  const getPriceDisplay = (vehicle: Vehicle) => {
    if (vehicle.offerType === 'both') {
      return `${formatCurrency(vehicle.salePrice || 0)} / ${formatCurrency(vehicle.rentPrice || 0)}/mo`
    }
    if (vehicle.offerType === 'for_rent') {
      return `${formatCurrency(vehicle.rentPrice || 0)}/mo`
    }
    return formatCurrency(vehicle.salePrice || 0)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <img
          src={vehicle.media?.primaryPhoto || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400'}
          alt={getTypeDisplay(vehicle)}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className={getStatusColor(vehicle.status)}>
            {vehicle.status}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-tight">
            {getTypeDisplay(vehicle)}
          </h3>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {vehicle.inventoryId}
            </span>
            <span className="font-bold text-primary">
              {getPriceDisplay(vehicle)}
            </span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {vehicle.location.city}, {vehicle.location.state}
          </div>
          
          {vehicle.listingType === 'rv' && (
            <div className="text-sm text-muted-foreground">
              Sleeps {vehicle.sleeps} • {vehicle.length}ft • {vehicle.slides} slides
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onView(vehicle.id)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(vehicle.id)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(vehicle.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function InventoryTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const { toast } = useToast()

  const vehicles = mockInventory.sampleVehicles as Vehicle[]

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = searchTerm === '' || 
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.inventoryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle.vin && vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
    const matchesType = typeFilter === 'all' || vehicle.listingType === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const handleView = (id: string) => {
    toast({
      title: 'View Vehicle',
      description: `Opening details for vehicle ${id}`
    })
  }

  const handleEdit = (id: string) => {
    toast({
      title: 'Edit Vehicle',
      description: `Opening edit form for vehicle ${id}`
    })
  }

  const handleDelete = (id: string) => {
    toast({
      title: 'Delete Vehicle',
      description: `Vehicle ${id} would be deleted`,
      variant: 'destructive'
    })
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
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
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
            <option value="service">Service</option>
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Types</option>
            <option value="rv">RV</option>
            <option value="manufactured_home">Manufactured Home</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredVehicles.length} of {vehicles.length} vehicles
        </p>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Vehicle Grid */}
      {filteredVehicles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No vehicles found</h3>
            <p className="text-muted-foreground text-center mb-6">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first vehicle to inventory'
              }
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function InventoryDashboard() {
  const { toast } = useToast()

  const handleAddVehicle = () => {
    toast({
      title: 'Add Vehicle',
      description: 'Opening new vehicle form'
    })
  }

  const handleImport = () => {
    toast({
      title: 'Import Inventory',
      description: 'Opening import wizard'
    })
  }

  const handleExport = () => {
    toast({
      title: 'Export Inventory',
      description: 'Generating inventory export'
    })
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
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddVehicle}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Stats */}
      <InventoryStats />

      {/* Main Content */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Inventory</TabsTrigger>
          <TabsTrigger value="rv">RVs</TabsTrigger>
          <TabsTrigger value="manufactured_home">Manufactured Homes</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <InventoryTable />
        </TabsContent>

        <TabsContent value="rv" className="space-y-6">
          <InventoryTable />
        </TabsContent>

        <TabsContent value="manufactured_home" className="space-y-6">
          <InventoryTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function VehicleDetail() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicle Details</h1>
          <p className="text-muted-foreground">
            View and manage vehicle information
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Vehicle Details</h3>
          <p className="text-muted-foreground text-center">
            Select a vehicle from the inventory list to view details
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function VehicleForm() {
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Vehicle Saved',
      description: 'Vehicle information has been saved successfully'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Vehicle</h1>
          <p className="text-muted-foreground">
            Add a new vehicle to your inventory
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
          <CardDescription>
            Enter the basic information for this vehicle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Vehicle Type</label>
                <select className="w-full mt-1 px-3 py-2 border rounded-md">
                  <option value="">Select type</option>
                  <option value="rv">RV</option>
                  <option value="manufactured_home">Manufactured Home</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Year</label>
                <Input type="number" placeholder="2024" className="mt-1" />
              </div>
              
              <div>
                <label className="text-sm font-medium">Make</label>
                <Input placeholder="Forest River" className="mt-1" />
              </div>
              
              <div>
                <label className="text-sm font-medium">Model</label>
                <Input placeholder="Cherokee" className="mt-1" />
              </div>
              
              <div>
                <label className="text-sm font-medium">VIN/Serial Number</label>
                <Input placeholder="Enter VIN or serial number" className="mt-1" />
              </div>
              
              <div>
                <label className="text-sm font-medium">Condition</label>
                <select className="w-full mt-1 px-3 py-2 border rounded-md">
                  <option value="new">New</option>
                  <option value="used">Used</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">
                Save Vehicle
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
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<InventoryDashboard />} />
        <Route path="/add" element={<VehicleForm />} />
        <Route path="/edit/:id" element={<VehicleForm />} />
        <Route path="/view/:id" element={<VehicleDetail />} />
        <Route path="*" element={<InventoryDashboard />} />
      </Routes>
    </ErrorBoundary>
  )
}