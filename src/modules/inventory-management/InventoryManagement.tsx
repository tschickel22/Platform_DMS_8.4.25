// InventoryManagement.tsx
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Plus, 
  Upload, 
  Scan, 
  Search,
  DollarSign,
  Package,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import { InventoryTable } from './components/InventoryTable'
import { BarcodeScanner } from './components/BarcodeScanner'
import { VehicleDetail } from './components/VehicleDetail'
import { CSVSmartImport } from './components/CSVSmartImport'
import RVInventoryForm from './forms/RVInventoryForm'
import MHInventoryForm from './forms/MHInventoryForm'
import { InventoryErrorBoundary } from './components/InventoryErrorBoundary'
import { useInventoryManagement } from './hooks/useInventoryManagement'
import { Vehicle, RVVehicle, MHVehicle } from './state/types'

export default function InventoryManagement() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, importVehicles } = useInventoryManagement()
  
  const [showAddRV, setShowAddRV] = useState(false)
  const [showAddMH, setShowAddMH] = useState(false)
  const [showAddRVModal, setShowAddRVModal] = useState(false)
  const [showAddMHModal, setShowAddMHModal] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [editingItem, setEditingItem] = useState<Vehicle | null>(null)
  const [selectedItem, setSelectedItem] = useState<Vehicle | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('all')

  const safeVehicles = Array.isArray(vehicles) ? vehicles : []

  const filteredVehicles = safeVehicles.filter(vehicle => {
    const matchesSearch = !searchTerm || 
      vehicle.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle.type === 'RV' ? (vehicle as RVVehicle).vin?.toLowerCase().includes(searchTerm.toLowerCase()) : 
       (vehicle as MHVehicle).serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || 
      (vehicle.type === 'RV' ? (vehicle as RVVehicle).availability === statusFilter :
       statusFilter === 'available')

    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter

    const matchesTab = activeTab === 'all' || 
      (activeTab === 'rv' && vehicle.type === 'RV') ||
      (activeTab === 'mh' && vehicle.type === 'MH')

    return matchesSearch && matchesStatus && matchesType && matchesTab
  })

  const totalUnits = safeVehicles.length
  const availableUnits = safeVehicles.filter(v => 
    v.type === 'RV' ? (v as RVVehicle).availability === 'InStock' : true
  ).length
  const reservedUnits = safeVehicles.filter(v => 
    v.type === 'RV' ? (v as RVVehicle).availability === 'PreOrder' : false
  ).length
  const soldUnits = safeVehicles.filter(v => 
    v.type === 'RV' ? (v as RVVehicle).availability === 'SoldOut' : false
  ).length
  const totalValue = safeVehicles.reduce((sum, v) => {
    const price = v.type === 'RV' ? (v as RVVehicle).price : (v as MHVehicle).askingPrice
    return sum + (price || 0)
  }, 0)

  const handleAddRV = () => setShowAddRVModal(true)
  const handleAddMH = () => setShowAddMHModal(true)

  const handleEdit = (vehicle: Vehicle) => {
    setEditingItem(vehicle)
    if (vehicle.type === 'RV') setShowAddRV(true)
    else setShowAddMH(true)
  }

  const handleView = (vehicle: Vehicle) => setSelectedItem(vehicle)

  const handleSaveRVVehicle = (vehicle: RVVehicle) => {
    if (editingItem) updateVehicle(vehicle)
    else addVehicle(vehicle)
    setEditingItem(null)
  }

  const handleSaveMHVehicle = (vehicle: MHVehicle) => {
    if (editingItem) updateVehicle(vehicle)
    else addVehicle(vehicle)
    setEditingItem(null)
  }

  const handleImportComplete = (importedVehicles: Vehicle[]) => {
    importVehicles(importedVehicles)
    setShowImport(false)
  }

  const handleScanComplete = (scannedData: any) => {
    console.log('Scanned data:', scannedData)
    setShowScanner(false)
  }

  const handleStatClick = (filterType: string) => {
    switch (filterType) {
      case 'available': setStatusFilter('InStock'); break
      case 'reserved': setStatusFilter('PreOrder'); break
      case 'sold': setStatusFilter('SoldOut'); break
      default: setStatusFilter('all')
    }
  }

  return (
    <TooltipProvider delayDuration={200}>
      <InventoryErrorBoundary>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Inventory Management</h1>
              <p className="text-muted-foreground">Manage your RV and manufactured home inventory</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleAddRV}>
                <Plus className="h-4 w-4 mr-2" /> Add RV
              </Button>
              <Button onClick={handleAddMH} variant="outline">
                <Plus className="h-4 w-4 mr-2" /> Add MH
              </Button>
              <Button onClick={() => setShowImport(true)} variant="outline">
                <Upload className="h-4 w-4 mr-2" /> Import CSV
              </Button>
              <Button onClick={() => setShowScanner(true)} variant="outline">
                <Scan className="h-4 w-4 mr-2" /> Scan
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card onClick={() => handleStatClick('total')} className="cursor-pointer hover:bg-accent/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Units</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUnits}</div>
                <p className="text-xs text-muted-foreground">All inventory items</p>
              </CardContent>
            </Card>

            <Card onClick={() => handleStatClick('available')} className="cursor-pointer hover:bg-accent/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{availableUnits}</div>
                <p className="text-xs text-muted-foreground">Ready for sale</p>
              </CardContent>
            </Card>

            <Card onClick={() => handleStatClick('reserved')} className="cursor-pointer hover:bg-accent/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reserved</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reservedUnits}</div>
                <p className="text-xs text-muted-foreground">Pre-orders & holds</p>
              </CardContent>
            </Card>

            <Card onClick={() => handleStatClick('sold')} className="cursor-pointer hover:bg-accent/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sold</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{soldUnits}</div>
                <p className="text-xs text-muted-foreground">Completed sales</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Inventory worth</p>
              </CardContent>
            </Card>
          </div>

          {/* Search/Filters/Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>Search and filter your inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by make, model, VIN, or serial number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="InStock">Available</SelectItem>
                    <SelectItem value="PreOrder">Reserved</SelectItem>
                    <SelectItem value="SoldOut">Sold</SelectItem>
                    <SelectItem value="OutOfStock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="RV">RV</SelectItem>
                    <SelectItem value="MH">Manufactured Home</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All ({totalUnits})</TabsTrigger>
                  <TabsTrigger value="rv">RVs ({safeVehicles.filter(v => v.type === 'RV').length})</TabsTrigger>
                  <TabsTrigger value="mh">MH ({safeVehicles.filter(v => v.type === 'MH').length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                  <InventoryTable vehicles={filteredVehicles} onEdit={handleEdit} onView={handleView} onDelete={deleteVehicle} />
                </TabsContent>
                <TabsContent value="rv" className="mt-4">
                  <InventoryTable vehicles={filteredVehicles.filter(v => v.type === 'RV')} onEdit={handleEdit} onView={handleView} onDelete={deleteVehicle} />
                </TabsContent>
                <TabsContent value="mh" className="mt-4">
                  <InventoryTable vehicles={filteredVehicles.filter(v => v.type === 'MH')} onEdit={handleEdit} onView={handleView} onDelete={deleteVehicle} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Modals */}
          <Dialog open={showAddRVModal} onOpenChange={setShowAddRVModal}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-50">
              <DialogHeader><DialogTitle>Add RV</DialogTitle></DialogHeader>
              <RVInventoryForm onSubmit={() => setShowAddRVModal(false)} onCancel={() => setShowAddRVModal(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={showAddMHModal} onOpenChange={setShowAddMHModal}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-50">
              <DialogHeader><DialogTitle>Add MH</DialogTitle></DialogHeader>
              <MHInventoryForm onSubmit={() => setShowAddMHModal(false)} onCancel={() => setShowAddMHModal(false)} />
            </DialogContent>
          </Dialog>

          <RVInventoryForm open={showAddRV} onOpenChange={(open) => { setShowAddRV(open); if (!open) setEditingItem(null) }} editingItem={editingItem?.type === 'RV' ? editingItem as RVVehicle : null} onSave={handleSaveRVVehicle} />
          <MHInventoryForm open={showAddMH} onOpenChange={(open) => { setShowAddMH(open); if (!open) setEditingItem(null) }} editingItem={editingItem?.type === 'MH' ? editingItem as MHVehicle : null} onSave={handleSaveMHVehicle} />

          <CSVSmartImport open={showImport} onOpenChange={setShowImport} onComplete={handleImportComplete} />
          <BarcodeScanner open={showScanner} onOpenChange={setShowScanner} onScanComplete={handleScanComplete} />
          <VehicleDetail open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)} vehicle={selectedItem} onEdit={handleEdit} onDelete={deleteVehicle} />
        </div>
      </InventoryErrorBoundary>
    </TooltipProvider>
  )
}
