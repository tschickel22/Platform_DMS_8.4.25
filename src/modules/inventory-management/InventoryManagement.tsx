import React, { useState, useEffect } from 'react'
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
import { RVInventoryForm } from './forms/RVInventoryForm'
import { MHInventoryForm } from './forms/MHInventoryForm'
import { CSVSmartImport } from './components/CSVSmartImport'
import { BarcodeScanner } from './components/BarcodeScanner'
import { ListingHandoffModal } from './components/ListingHandoffModal'

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
    showAddForm,
    setShowAddForm,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    exportToCSV,
    importFromCSV,
    getFilteredVehicles,
    getInventoryStats
  } = useInventoryManagement()

  const [showImportModal, setShowImportModal] = useState(false)
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
  const [showListingHandoff, setShowListingHandoff] = useState(false)
  const [handoffVehicle, setHandoffVehicle] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  const stats = getInventoryStats()
  const filteredVehicles = getFilteredVehicles()

  const handleAddVehicle = async (vehicleData: any) => {
    try {
      await addVehicle(vehicleData)
      setShowAddForm(false)
    } catch (error) {
      console.error('Failed to add vehicle:', error)
    }
  }

  const handleUpdateVehicle = async (vehicleData: any) => {
    try {
      await updateVehicle(selectedVehicle.id, vehicleData)
      setSelectedVehicle(null)
    } catch (error) {
      console.error('Failed to update vehicle:', error)
    }
  }

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      await deleteVehicle(vehicleId)
    } catch (error) {
      console.error('Failed to delete vehicle:', error)
    }
  }

  const handleCreateListing = (vehicle: any) => {
    setHandoffVehicle(vehicle)
    setShowListingHandoff(true)
  }

  const handleBarcodeScanned = (data: any) => {
    console.log('Barcode scanned:', data)
    setShowBarcodeScanner(false)
    // Process barcode data and potentially pre-fill form
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading inventory: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage your RV and manufactured home inventory
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowBarcodeScanner(true)}>
            <Package className="h-4 w-4 mr-2" />
            Scan Barcode
          </Button>
          <Button variant="outline" onClick={() => setShowImportModal(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUnits}</div>
            <p className="text-xs text-muted-foreground">
              {stats.availableUnits} available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Inventory value
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RV Units</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rvCount}</div>
            <p className="text-xs text-muted-foreground">
              Travel trailers & motorhomes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MH Units</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mhCount}</div>
            <p className="text-xs text-muted-foreground">
              Manufactured homes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rv">RV Inventory</TabsTrigger>
          <TabsTrigger value="mh">Manufactured Homes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="reserved">Reserved</option>
                <option value="service">In Service</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Types</option>
                <option value="rv">RV</option>
                <option value="manufactured_home">Manufactured Home</option>
              </select>
            </div>
          </div>

          {/* Inventory Table */}
          <InventoryTable
            vehicles={filteredVehicles}
            onViewDetails={setSelectedVehicle}
            onEdit={setSelectedVehicle}
            onDelete={handleDeleteVehicle}
            onCreateListing={handleCreateListing}
          />
        </TabsContent>

        <TabsContent value="rv" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">RV Inventory</h2>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add RV
            </Button>
          </div>
          <InventoryTable
            vehicles={filteredVehicles.filter(v => v.listingType === 'rv')}
            onViewDetails={setSelectedVehicle}
            onEdit={setSelectedVehicle}
            onDelete={handleDeleteVehicle}
            onCreateListing={handleCreateListing}
          />
        </TabsContent>

        <TabsContent value="mh" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Manufactured Home Inventory</h2>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Manufactured Home
            </Button>
          </div>
          <InventoryTable
            vehicles={filteredVehicles.filter(v => v.listingType === 'manufactured_home')}
            onViewDetails={setSelectedVehicle}
            onEdit={setSelectedVehicle}
            onDelete={handleDeleteVehicle}
            onCreateListing={handleCreateListing}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Distribution</CardTitle>
                <CardDescription>
                  Breakdown by vehicle type and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Available RVs</span>
                    <Badge variant="secondary">{stats.availableRVs}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Available MH</span>
                    <Badge variant="secondary">{stats.availableMH}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">In Service</span>
                    <Badge variant="outline">{stats.inService}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sold This Month</span>
                    <Badge variant="default">{stats.soldThisMonth}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Key inventory performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg Days on Lot</span>
                    <span className="font-medium">{stats.avgDaysOnLot}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Turn Rate</span>
                    <span className="font-medium">{stats.turnRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg Sale Price</span>
                    <span className="font-medium">${stats.avgSalePrice.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {selectedVehicle && !showAddForm && (
        <VehicleDetail
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          onUpdate={handleUpdateVehicle}
          onDelete={() => handleDeleteVehicle(selectedVehicle.id)}
          onCreateListing={() => handleCreateListing(selectedVehicle)}
        />
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Vehicle</h2>
              <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                ×
              </Button>
            </div>
            
            <Tabs defaultValue="rv">
              <TabsList className="mb-4">
                <TabsTrigger value="rv">RV</TabsTrigger>
                <TabsTrigger value="mh">Manufactured Home</TabsTrigger>
              </TabsList>
              
              <TabsContent value="rv">
                <RVInventoryForm
                  onSubmit={handleAddVehicle}
                  onCancel={() => setShowAddForm(false)}
                />
              </TabsContent>
              
              <TabsContent value="mh">
                <MHInventoryForm
                  onSubmit={handleAddVehicle}
                  onCancel={() => setShowAddForm(false)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {showImportModal && (
        <CSVSmartImport
          onClose={() => setShowImportModal(false)}
          onImport={importFromCSV}
        />
      )}

      {showBarcodeScanner && (
        <BarcodeScanner
          onClose={() => setShowBarcodeScanner(false)}
          onScanned={handleBarcodeScanned}
        />
      )}

      {showListingHandoff && handoffVehicle && (
        <ListingHandoffModal
          vehicle={handoffVehicle}
          onClose={() => {
            setShowListingHandoff(false)
            setHandoffVehicle(null)
          }}
          onSuccess={() => {
            setShowListingHandoff(false)
            setHandoffVehicle(null)
          }}
        />
      )}
    </div>
  )
}