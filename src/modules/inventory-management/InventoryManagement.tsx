import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Package, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Upload,
  BarChart3,
  MapPin,
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react'
import { useInventoryManagement } from './hooks/useInventoryManagement'
import { VehicleDetail } from './components/VehicleDetail'
import { InventoryTable } from './components/InventoryTable'
import { CSVSmartImport } from './components/CSVSmartImport'
import { BarcodeScanner } from './components/BarcodeScanner'
import { ListingHandoffModal } from './components/ListingHandoffModal'
import { RVInventoryForm } from './forms/RVInventoryForm'
import { MHInventoryForm } from './forms/MHInventoryForm'

export default function InventoryManagement() {
  const {
    vehicles,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    selectedVehicle,
    setSelectedVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    refreshInventory
  } = useInventoryManagement()

  const [showAddForm, setShowAddForm] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
  const [showListingHandoff, setShowListingHandoff] = useState(false)
  const [addFormType, setAddFormType] = useState<'rv' | 'manufactured_home'>('rv')
  const [activeTab, setActiveTab] = useState('overview')

  // Calculate stats
  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'available').length,
    sold: vehicles.filter(v => v.status === 'sold').length,
    service: vehicles.filter(v => v.status === 'service').length,
    totalValue: vehicles.reduce((sum, v) => sum + (v.salePrice || v.rentPrice || 0), 0)
  }

  const handleAddVehicle = (type: 'rv' | 'manufactured_home') => {
    setAddFormType(type)
    setShowAddForm(true)
  }

  const handleVehicleCreated = (vehicle: any) => {
    createVehicle(vehicle)
    setShowAddForm(false)
  }

  const handleVehicleUpdated = (vehicle: any) => {
    updateVehicle(vehicle.id, vehicle)
    setSelectedVehicle(null)
  }

  const handleCreateListing = (vehicle: any) => {
    setSelectedVehicle(vehicle)
    setShowListingHandoff(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading inventory: {error}</p>
        <Button onClick={refreshInventory} className="mt-4">
          Try Again
        </Button>
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
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowBarcodeScanner(true)}
          >
            <Package className="h-4 w-4 mr-2" />
            Scan Barcode
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowImportModal(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button onClick={() => handleAddVehicle('rv')}>
            <Plus className="h-4 w-4 mr-2" />
            Add RV
          </Button>
          <Button onClick={() => handleAddVehicle('manufactured_home')}>
            <Plus className="h-4 w-4 mr-2" />
            Add MH
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
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sold</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.sold}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Service</CardTitle>
            <Package className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.service}</div>
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

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by VIN, make, model..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="">All Status</option>
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="service">Service</option>
                    <option value="reserved">Reserved</option>
                  </select>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="">All Types</option>
                    <option value="rv">RV</option>
                    <option value="manufactured_home">Manufactured Home</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  {vehicle.media?.primaryPhoto ? (
                    <img
                      src={vehicle.media.primaryPhoto}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <Badge 
                    className="absolute top-2 right-2"
                    variant={vehicle.status === 'available' ? 'default' : 'secondary'}
                  >
                    {vehicle.status}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </CardTitle>
                  <CardDescription>
                    {vehicle.listingType === 'rv' ? 'RV' : 'Manufactured Home'} • 
                    {vehicle.vin || vehicle.serialNumber}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sale Price:</span>
                      <span className="font-medium">
                        ${vehicle.salePrice?.toLocaleString() || 'N/A'}
                      </span>
                    </div>
                    {vehicle.rentPrice && (
                      <div className="flex justify-between text-sm">
                        <span>Rent Price:</span>
                        <span className="font-medium">
                          ${vehicle.rentPrice.toLocaleString()}/mo
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Location:</span>
                      <span>{vehicle.location?.city}, {vehicle.location?.state}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedVehicle(vehicle)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCreateListing(vehicle)}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      List
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {vehicles.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No inventory found</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by adding your first vehicle to inventory
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => handleAddVehicle('rv')}>
                    Add RV
                  </Button>
                  <Button onClick={() => handleAddVehicle('manufactured_home')}>
                    Add Manufactured Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="table">
          <InventoryTable
            vehicles={vehicles}
            onVehicleSelect={setSelectedVehicle}
            onVehicleUpdate={updateVehicle}
            onVehicleDelete={deleteVehicle}
            onCreateListing={handleCreateListing}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Analytics</CardTitle>
                <CardDescription>
                  Performance metrics and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                  <p>Analytics dashboard coming soon</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Location Distribution</CardTitle>
                <CardDescription>
                  Inventory by location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4" />
                  <p>Location analytics coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Add {addFormType === 'rv' ? 'RV' : 'Manufactured Home'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                ×
              </Button>
            </div>
            {addFormType === 'rv' ? (
              <RVInventoryForm
                onSubmit={handleVehicleCreated}
                onCancel={() => setShowAddForm(false)}
              />
            ) : (
              <MHInventoryForm
                onSubmit={handleVehicleCreated}
                onCancel={() => setShowAddForm(false)}
              />
            )}
          </div>
        </div>
      )}

      {showImportModal && (
        <CSVSmartImport
          onClose={() => setShowImportModal(false)}
          onImportComplete={(importedVehicles) => {
            importedVehicles.forEach(vehicle => createVehicle(vehicle))
            setShowImportModal(false)
          }}
        />
      )}

      {showBarcodeScanner && (
        <BarcodeScanner
          onClose={() => setShowBarcodeScanner(false)}
          onScanComplete={(scannedData) => {
            console.log('Scanned:', scannedData)
            setShowBarcodeScanner(false)
          }}
        />
      )}

      {selectedVehicle && !showListingHandoff && (
        <VehicleDetail
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          onUpdate={handleVehicleUpdated}
          onDelete={(id) => {
            deleteVehicle(id)
            setSelectedVehicle(null)
          }}
          onCreateListing={() => {
            setShowListingHandoff(true)
          }}
        />
      )}

      {showListingHandoff && selectedVehicle && (
        <ListingHandoffModal
          vehicle={selectedVehicle}
          onClose={() => {
            setShowListingHandoff(false)
            setSelectedVehicle(null)
          }}
          onListingCreated={(listing) => {
            console.log('Listing created:', listing)
            setShowListingHandoff(false)
            setSelectedVehicle(null)
          }}
        />
      )}
    </div>
  )
}