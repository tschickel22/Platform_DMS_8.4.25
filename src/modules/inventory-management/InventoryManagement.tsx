import React, { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Search, Upload, QrCode, DollarSign } from 'lucide-react'

import { useInventoryManagement } from './hooks/useInventoryManagement'

// IMPORTANT: these imports assume default exports.
// If your files export named components, switch back to { Named } form.
import RVInventoryForm from './forms/RVInventoryForm'
import MHInventoryForm from './forms/MHInventoryForm'
import { BarcodeScanner } from './components/BarcodeScanner'
import CSVSmartImport from './components/CSVSmartImport'
import InventoryTable from './components/InventoryTable'
import VehicleDetail from './components/VehicleDetail'

export default function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null)
  const [showRVForm, setShowRVForm] = useState(false)
  const [showMHForm, setShowMHForm] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [showImport, setShowImport] = useState(false)

  const { inventory, addVehicle, updateVehicle, deleteVehicle } = useInventoryManagement()

  // -- Stats (local, no hook dependency) --------------------------------------
  const stats = useMemo(() => {
    const toLower = (v?: string) => (v || '').toLowerCase()
    const totalUnits = inventory.length
    const available = inventory.filter(i => toLower(i.status) === 'available').length
    const reserved  = inventory.filter(i => toLower(i.status) === 'reserved').length
    const sold      = inventory.filter(i => toLower(i.status) === 'sold').length
    const totalValue = inventory.reduce((sum, i) => sum + Number(i?.price ?? 0), 0)
    return { totalUnits, available, reserved, sold, totalValue }
  }, [inventory])

  // -- Filtering --------------------------------------------------------------
  const filteredInventory = useMemo(() => {
    const q = searchTerm.toLowerCase()
    return inventory.filter(v => {
      const make   = (v.make ?? '').toLowerCase()
      const model  = (v.model ?? '').toLowerCase()
      const vin    = (v.vin ?? '').toLowerCase()
      const stock  = (v.stockNumber ?? '').toLowerCase()
      const type   = (v.type ?? '').toLowerCase()
      const status = (v.status ?? '').toLowerCase()

      const matchesSearch =
        make.includes(q) || model.includes(q) || vin.includes(q) || stock.includes(q)

      const matchesStatus = statusFilter === 'all' || status === statusFilter.toLowerCase()
      const matchesType = typeFilter === 'all' || type === typeFilter.toLowerCase()

      return matchesSearch && matchesStatus && matchesType
    })
  }, [inventory, searchTerm, statusFilter, typeFilter])

  // -- CRUD handlers ----------------------------------------------------------
  const handleAddVehicle = (vehicleData: any) => {
    addVehicle(vehicleData)
    setShowRVForm(false)
    setShowMHForm(false)
  }

  const handleUpdateVehicle = (vehicleData: any) => {
    updateVehicle(vehicleData)
    setSelectedVehicle(null)
  }

  const handleDeleteVehicle = (vehicleId: string) => {
    deleteVehicle(vehicleId)
    setSelectedVehicle(null)
  }

  // -- Tools handlers ---------------------------------------------------------
  const handleScanComplete = (scannedData: any) => {
    console.log('Scanned data:', scannedData)
    setShowScanner(false)
  }

  const handleImportComplete = (importedData: any) => {
    console.log('Imported data:', importedData)
    setShowImport(false)
  }

  // -- Render -----------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Manage your RV and manufactured home inventory</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Dialog open={showRVForm} onOpenChange={setShowRVForm}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add RV
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New RV</DialogTitle>
                <DialogDescription>Add a new RV to your inventory</DialogDescription>
              </DialogHeader>
              <RVInventoryForm onSubmit={handleAddVehicle} onCancel={() => setShowRVForm(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={showMHForm} onOpenChange={setShowMHForm}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add MH
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Manufactured Home</DialogTitle>
                <DialogDescription>Add a new manufactured home to your inventory</DialogDescription>
              </DialogHeader>
              <MHInventoryForm onSubmit={handleAddVehicle} onCancel={() => setShowMHForm(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={showImport} onOpenChange={setShowImport}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Import Inventory</DialogTitle>
                <DialogDescription>Import inventory data from a CSV file</DialogDescription>
              </DialogHeader>
              <CSVSmartImport onComplete={handleImportComplete} />
            </DialogContent>
          </Dialog>

          <Dialog open={showScanner} onOpenChange={setShowScanner}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <QrCode className="h-4 w-4 mr-2" />
                Scan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Barcode Scanner</DialogTitle>
                <DialogDescription>Scan a barcode to quickly find or add inventory</DialogDescription>
              </DialogHeader>
              <BarcodeScanner onScanComplete={handleScanComplete} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUnits}</div>
            <p className="text-xs text-muted-foreground">All inventory items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.available}</div>
            <p className="text-xs text-muted-foreground">Ready for sale</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reserved</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reserved}</div>
            <p className="text-xs text-muted-foreground">Pre-orders & holds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sold</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <div className="h-2 w-2 bg-red-500 rounded-full"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sold}</div>
            <p className="text-xs text-muted-foreground">Completed sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Number(stats.totalValue || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Inventory worth</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Section */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>Search and filter your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by make, model, VIN, or stock number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="rv">RV</SelectItem>
                <SelectItem value="mh">Manufactured Home</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Inventory Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All ({filteredInventory.length})</TabsTrigger>
              <TabsTrigger value="rv">
                RVs ({filteredInventory.filter(v => (v.type ?? '').toLowerCase() === 'rv').length})
              </TabsTrigger>
              <TabsTrigger value="mh">
                MH ({filteredInventory.filter(v => (v.type ?? '').toLowerCase() === 'mh').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Inventory ({filteredInventory.length})</h3>
                  <p className="text-sm text-muted-foreground">Manage your RV and manufactured home inventory</p>
                </div>
                <InventoryTable
                  inventory={filteredInventory}
                  onViewDetails={setSelectedVehicle}
                  onEdit={setSelectedVehicle}
                  onDelete={handleDeleteVehicle}
                />
              </div>
            </TabsContent>

            <TabsContent value="rv" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    RV Inventory ({filteredInventory.filter(v => (v.type ?? '').toLowerCase() === 'rv').length})
                  </h3>
                  <p className="text-sm text-muted-foreground">Recreational vehicles in inventory</p>
                </div>
                <InventoryTable
                  inventory={filteredInventory.filter(v => (v.type ?? '').toLowerCase() === 'rv')}
                  onViewDetails={setSelectedVehicle}
                  onEdit={setSelectedVehicle}
                  onDelete={handleDeleteVehicle}
                />
              </div>
            </TabsContent>

            <TabsContent value="mh" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    MH Inventory ({filteredInventory.filter(v => (v.type ?? '').toLowerCase() === 'mh').length})
                  </h3>
                  <p className="text-sm text-muted-foreground">Manufactured homes in inventory</p>
                </div>
                <InventoryTable
                  inventory={filteredInventory.filter(v => (v.type ?? '').toLowerCase() === 'mh')}
                  onViewDetails={setSelectedVehicle}
                  onEdit={setSelectedVehicle}
                  onDelete={handleDeleteVehicle}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Vehicle Detail Modal */}
      {selectedVehicle && (
        <Dialog open={!!selectedVehicle} onOpenChange={() => setSelectedVehicle(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <VehicleDetail
              vehicle={selectedVehicle}
              onUpdate={handleUpdateVehicle}
              onDelete={handleDeleteVehicle}
              onClose={() => setSelectedVehicle(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
