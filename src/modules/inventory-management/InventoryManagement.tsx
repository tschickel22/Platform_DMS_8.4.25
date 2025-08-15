// src/modules/inventory-management/InventoryManagement.tsx
import React, { useState, lazy, Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ErrorBoundary from '@/components/ErrorBoundary'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Upload, Scan, Search, DollarSign, Package, CheckCircle, Clock, XCircle, FileText } from 'lucide-react'
import { InventoryTable } from './components/InventoryTable'
import { BarcodeScanner } from './components/BarcodeScanner'
import VehicleDetail from './components/VehicleDetail'
import CSVSmartImport from './components/CSVSmartImport'
import RVInventoryForm from './forms/RVInventoryForm'
import MHInventoryForm from './forms/MHInventoryForm'
import { InventoryErrorBoundary } from './components/InventoryErrorBoundary'
import { useInventoryManagement } from './hooks/useInventoryManagement'
import { Vehicle, RVVehicle, MHVehicle } from './state/types'

// 🚫 Do NOT import the modal eagerly; it may auto-open on mount.
// @ts-ignore - path is correct at runtime
const GenerateBrochureModal = lazy(() => import('@/modules/brochures/components/GenerateBrochureModal'))

export default function InventoryManagement() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, importVehicles } = useInventoryManagement()

  // UI state
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

  // Brochure modal (lazy-mounted, fully controlled)
  const [showBrochureModal, setShowBrochureModal] = useState(false)
  const [userRequestedBrochure, setUserRequestedBrochure] = useState(false)   // <- hard gate
  const [selectedListings, setSelectedListings] = useState<any[]>([])

  const safeVehicles = Array.isArray(vehicles) ? vehicles : []

  // filter
  const filteredVehicles = safeVehicles.filter(v => {
    const q = searchTerm.toLowerCase()
    const make = v.make?.toLowerCase() || ''
    const model = v.model?.toLowerCase() || ''
    const vin = v.type === 'RV' ? (v as RVVehicle).vin?.toLowerCase() || '' : (v as MHVehicle).serialNumber?.toLowerCase() || ''
    const matchesSearch = !q || make.includes(q) || model.includes(q) || vin.includes(q)

    const status = v.type === 'RV' ? (v as RVVehicle).availability : 'available'
    const matchesStatus = statusFilter === 'all' || status === statusFilter

    const matchesType = typeFilter === 'all' || v.type === typeFilter
    const matchesTab = activeTab === 'all' || (activeTab === 'rv' && v.type === 'RV') || (activeTab === 'mh' && v.type === 'MH')
    return matchesSearch && matchesStatus && matchesType && matchesTab
  })

  // stats
  const totalUnits = safeVehicles.length
  const availableUnits = safeVehicles.filter(v => v.type !== 'RV' || (v as RVVehicle).availability === 'InStock').length
  const reservedUnits  = safeVehicles.filter(v => v.type === 'RV' && (v as RVVehicle).availability === 'PreOrder').length
  const soldUnits      = safeVehicles.filter(v => v.type === 'RV' && (v as RVVehicle).availability === 'SoldOut').length
  const totalValue = safeVehicles.reduce((s, v) => s + (v.type === 'RV' ? (v as RVVehicle).price || 0 : (v as MHVehicle).askingPrice || 0), 0)

  // header buttons
  const handleAddRV = () => { setEditingItem(null); setShowAddRVModal(true) }
  const handleAddMH = () => { setEditingItem(null); setShowAddMHModal(true) }

  // table actions -> open modals (no inline forms)
  const handleEdit = (vehicle: Vehicle) => {
    setEditingItem(vehicle)
    vehicle.type === 'RV' ? setShowAddRVModal(true) : setShowAddMHModal(true)
  }
  const handleView = (vehicle: Vehicle) => setSelectedItem(vehicle)

  // save from modal forms
  const handleSaveRV = (rv: RVVehicle) => {
    editingItem ? updateVehicle(rv) : addVehicle(rv)
    setEditingItem(null)
    setShowAddRVModal(false)
  }
  const handleSaveMH = (mh: MHVehicle) => {
    editingItem ? updateVehicle(mh) : addVehicle(mh)
    setEditingItem(null)
    setShowAddMHModal(false)
  }

  const handleImportComplete = (imported: Vehicle[]) => { importVehicles(imported); setShowImport(false) }
  const handleScanComplete = () => setShowScanner(false)

  const handleStatClick = (key: 'available'|'reserved'|'sold'|'all'|'total') => {
    switch (key) {
      case 'available': setStatusFilter('InStock'); break
      case 'reserved':  setStatusFilter('PreOrder'); break
      case 'sold':      setStatusFilter('SoldOut'); break
      case 'all':
      case 'total':
      default:          setStatusFilter('all')
    }
  }

  const handleGenerateBrochure = (vehiclesList: any[]) => {
    setSelectedListings(vehiclesList)
    setUserRequestedBrochure(true)     // ✅ allow mounting from this point on
    setShowBrochureModal(true)
  }

  const handleCloseBrochureModal = () => {
    setShowBrochureModal(false)
    // keep userRequestedBrochure = true so the chunk stays loaded for re-open during session
  }

  return (
    <ErrorBoundary>
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
                <Button onClick={handleAddRV}><Plus className="h-4 w-4 mr-2" />Add RV</Button>
                <Button onClick={handleAddMH} variant="outline"><Plus className="h-4 w-4 mr-2" />Add MH</Button>
                <Button onClick={() => setShowImport(true)} variant="outline"><Upload className="h-4 w-4 mr-2" />Import CSV</Button>
                <Button onClick={() => setShowScanner(true)} variant="outline"><Scan className="h-4 w-4 mr-2" />Scan</Button>
                <Button onClick={() => handleGenerateBrochure(filteredVehicles)} variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Brochure
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-5">
              <Card className="cursor-pointer hover:bg-accent/50 bg-blue-50 border-blue-200" onClick={() => handleStatClick('total')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Units</CardTitle>
                  <Package className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700">{totalUnits}</div>
                  <p className="text-xs text-muted-foreground">All inventory items</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-accent/50 bg-emerald-50 border-emerald-200" onClick={() => handleStatClick('available')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available</CardTitle>
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-700">{availableUnits}</div>
                  <p className="text-xs text-muted-foreground">Ready for sale</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-accent/50 bg-amber-50 border-amber-200" onClick={() => handleStatClick('reserved')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reserved</CardTitle>
                  <Clock className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-700">{reservedUnits}</div>
                  <p className="text-xs text-muted-foreground">Pre-orders & holds</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-accent/50 bg-rose-50 border-rose-200" onClick={() => handleStatClick('sold')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sold</CardTitle>
                  <XCircle className="h-4 w-4 text-rose-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-rose-700">{soldUnits}</div>
                  <p className="text-xs text-muted-foreground">Completed sales</p>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700">
                    ${Number.isFinite(totalValue) ? totalValue.toLocaleString() : '0'}
                  </div>
                  <p className="text-xs text-muted-foreground">Inventory worth</p>
                </CardContent>
              </Card>
            </div>

            {/* Search / Filters / Table */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
                <CardDescription>Search and filter your inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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

            {/* MODALS ONLY — no inline forms */}
            <Dialog open={showAddRVModal} onOpenChange={setShowAddRVModal}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-50">
                <DialogHeader><DialogTitle>{editingItem?.type === 'RV' ? 'Edit RV' : 'Add RV'}</DialogTitle></DialogHeader>
                <RVInventoryForm
                  editingItem={editingItem?.type === 'RV' ? (editingItem as RVVehicle) : undefined}
                  onSave={handleSaveRV}
                  onCancel={() => { setEditingItem(null); setShowAddRVModal(false) }}
                />
              </DialogContent>
            </Dialog>

            <Dialog open={showAddMHModal} onOpenChange={setShowAddMHModal}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-50">
                <DialogHeader><DialogTitle>{editingItem?.type === 'MH' ? 'Edit MH' : 'Add MH'}</DialogTitle></DialogHeader>
                <MHInventoryForm
                  editingItem={editingItem?.type === 'MH' ? (editingItem as MHVehicle) : undefined}
                  onSave={handleSaveMH}
                  onCancel={() => { setEditingItem(null); setShowAddMHModal(false) }}
                />
              </DialogContent>
            </Dialog>

            <CSVSmartImport open={showImport} onOpenChange={setShowImport} onComplete={handleImportComplete} />
            <BarcodeScanner open={showScanner} onOpenChange={setShowScanner} onScanComplete={handleScanComplete} />
            <VehicleDetail open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)} vehicle={selectedItem} onEdit={handleEdit} onDelete={deleteVehicle} />
          </div>
        </InventoryErrorBoundary>

        {/* Brochure Modal — lazy mounted only after user clicks */}
        <ErrorBoundary>
          {userRequestedBrochure && (
            <Suspense fallback={null}>
              <GenerateBrochureModal
    </ErrorBoundary>
  )
}