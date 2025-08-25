import React, { useMemo, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, Plus, Upload, QrCode, TrendingUp, DollarSign } from 'lucide-react'
import { Vehicle, VehicleStatus } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { useInventoryManagement } from './hooks/useInventoryManagement'
import { InventoryTable } from './components/InventoryTable'
import { VehicleForm } from './forms/VehicleForm'
import VehicleDetail from './components/VehicleDetail'
import { CSVImport } from './components/CSVImport'
import { BarcodeScanner } from './components/BarcodeScanner'
import { TaskForm } from '@/modules/task-center/components/TaskForm'
import { useTasks } from '@/hooks/useTasks'
import { Task, TaskModule, TaskPriority } from '@/types'

/** Small helpers that keep us safe even if data is undefined */
const asArray = <T,>(v: T[] | undefined | null): T[] => (Array.isArray(v) ? v : [])
const toStatusKey = (val: unknown): 'available' | 'reserved' | 'sold' | 'other' => {
  const s = String(val ?? '').toLowerCase()
  if (s.startsWith('avail')) return 'available'
  if (s.startsWith('reser')) return 'reserved'
  if (s.startsWith('sold')) return 'sold'
  return 'other'
}

function InventoryList() {
  const { vehicles, createVehicle, updateVehicleStatus, deleteVehicle } = useInventoryManagement()
  const list = asArray(vehicles)
  const { toast } = useToast()

  // Optional tasks modal (kept feature-parity with your UI)
  const { createTask } = useTasks()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [initialTaskData, setInitialTaskData] = useState<Partial<Task> | undefined>(undefined)

  // UI state
  const [showVehicleForm, setShowVehicleForm] = useState(false)
  const [showVehicleDetail, setShowVehicleDetail] = useState(false)
  const [showCSVImport, setShowCSVImport] = useState(false)
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold' | 'reserved'>('all')

  /** Derived stats (all fully guarded) */
  const stats = useMemo(() => {
    const total = list.length
    let available = 0, reserved = 0, sold = 0
    let totalValue = 0

    for (const v of list) {
      const k = toStatusKey((v as any)?.status)
      if (k === 'available') available++
      else if (k === 'reserved') reserved++
      else if (k === 'sold') sold++

      // value: supports both RV (price) and MH (askingPrice)
      const price = Number((v as any)?.price ?? (v as any)?.askingPrice ?? 0)
      if (Number.isFinite(price)) totalValue += price
    }

    return { total, available, reserved, sold, totalValue }
  }, [list])

  /** Actions */
  const handleSaveVehicle = async (vehicleData: Partial<Vehicle>) => {
    try {
      if (selectedVehicle) {
        await updateVehicleStatus(
          selectedVehicle.id,
          (vehicleData.status as VehicleStatus) ?? (selectedVehicle.status as VehicleStatus)
        )
        toast({ title: 'Vehicle Updated', description: 'Vehicle information has been updated' })
      } else {
        await createVehicle(vehicleData)
        toast({ title: 'Vehicle Added', description: 'New vehicle has been added to inventory' })
      }
      setShowVehicleForm(false)
      setSelectedVehicle(null)
    } catch {
      toast({
        title: 'Error',
        description: `Failed to ${selectedVehicle ? 'update' : 'create'} vehicle`,
        variant: 'destructive'
      })
    }
  }

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setShowVehicleDetail(true)
  }

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setShowVehicleForm(true)
  }

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return
    try {
      await deleteVehicle(vehicleId)
      toast({ title: 'Vehicle Deleted', description: 'The vehicle has been removed from inventory' })
    } catch {
      toast({ title: 'Error', description: 'Failed to delete vehicle', variant: 'destructive' })
    }
  }

  const handleImportCSV = async (vehiclesToImport: Partial<Vehicle>[]) => {
    try {
      for (const v of vehiclesToImport) await createVehicle(v)
      setShowCSVImport(false)
      toast({ title: 'Import Successful', description: `Imported ${vehiclesToImport.length} vehicles` })
    } catch {
      toast({ title: 'Import Failed', description: 'There was an error importing the vehicles', variant: 'destructive' })
    }
  }

  const handleBarcodeScanned = (vin: string) => {
    const existing = list.find(v => String((v as any)?.vin ?? '') === vin)
    if (existing) {
      setSelectedVehicle(existing)
      setShowVehicleDetail(true)
      toast({ title: 'Vehicle Found', description: `Found existing vehicle with VIN: ${vin}` })
    } else {
      setSelectedVehicle(null)
      setShowVehicleForm(true)
      toast({ title: 'New VIN Scanned', description: `Creating new vehicle with VIN: ${vin}` })
    }
    setShowBarcodeScanner(false)
  }

  const handleCreateTaskForVehicle = (vehicle: Vehicle) => {
    const k = toStatusKey((vehicle as any)?.status)
    const priority = k === 'other' ? TaskPriority.LOW : TaskPriority.LOW
    const dueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    setInitialTaskData({
      sourceId: (vehicle as any)?.id,
      sourceType: 'vehicle',
      module: TaskModule.CRM,
      title: `Follow up on ${String((vehicle as any)?.year ?? '')} ${String((vehicle as any)?.make ?? '')} ${String((vehicle as any)?.model ?? '')}`.trim(),
      priority, dueDate, link: '/inventory',
      customFields: {
        vehicleVin: (vehicle as any)?.vin,
        vehiclePrice: Number((vehicle as any)?.price ?? (vehicle as any)?.askingPrice ?? 0),
        vehicleLocation: (vehicle as any)?.location,
        vehicleStatus: (vehicle as any)?.status
      }
    })
    setShowTaskForm(true)
  }

  /** Filters (fully guarded) */
  const filteredVehicles = useMemo(() => {
    if (statusFilter === 'all') return list
    return list.filter(v =>
      String((v as any)?.status ?? '').toLowerCase() === statusFilter
    )
  }, [list, statusFilter])

  /** keyboard-friendly tile props */
  const tileProps = (handler: () => void) => ({
    role: 'button' as const,
    tabIndex: 0,
    onClick: handler,
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter') handler() },
    className: 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring'
  })

  return (
    <div className="space-y-8">
      {/* Task Form */}
      {showTaskForm && (
        <TaskForm
          initialData={initialTaskData}
          onSave={async (t) => { await createTask(t); setShowTaskForm(false); setInitialTaskData(undefined) }}
          onCancel={() => { setShowTaskForm(false); setInitialTaskData(undefined) }}
        />
      )}

      {/* Vehicle Form */}
      {showVehicleForm && (
        <VehicleForm
          vehicle={selectedVehicle || undefined}
          onSave={handleSaveVehicle}
          onCancel={() => setShowVehicleForm(false)}
        />
      )}

      {/* Vehicle Detail */}
      {showVehicleDetail && (
        <VehicleDetail
          vehicle={selectedVehicle}
          open={showVehicleDetail}
          onOpenChange={setShowVehicleDetail}
        />
      )}

      {/* CSV Import */}
      {showCSVImport && (
        <CSVImport onImport={handleImportCSV} onCancel={() => setShowCSVImport(false)} />
      )}

      {/* Barcode Scanner (correct props) */}
      {showBarcodeScanner && (
        <BarcodeScanner
          open={showBarcodeScanner}
          onOpenChange={setShowBarcodeScanner}
          onScan={handleBarcodeScanned}
        />
      )}

      {/* Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Inventory Management</h1>
            <p className="ri-page-description">Manage your RV and manufactured home inventory</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowBarcodeScanner(true)}>
              <QrCode className="h-4 w-4 mr-2" />
              Scan Barcode
            </Button>
            <Button variant="outline" onClick={() => setShowCSVImport(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            <Button onClick={() => { setSelectedVehicle(null); setShowVehicleForm(true) }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="ri-stats-grid">
        <Card {...tileProps(() => setStatusFilter('all'))} className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Units</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> Overview
            </p>
          </CardContent>
        </Card>

        <Card {...tileProps(() => setStatusFilter('available'))} className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Available</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {list.filter(v => String((v as any)?.status ?? '').toLowerCase() === VehicleStatus.AVAILABLE).length}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> Ready for sale
            </p>
          </CardContent>
        </Card>

        <Card {...tileProps(() => setStatusFilter('reserved'))} className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">Reserved</CardTitle>
            <Package className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {list.filter(v => String((v as any)?.status ?? '').toLowerCase() === VehicleStatus.RESERVED).length}
            </div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> Pending sale
            </p>
          </CardContent>
        </Card>

        <Card {...tileProps(() => setStatusFilter('sold'))} className="shadow-sm border-0 bg-gradient-to-br from-rose-50 to-rose-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-rose-900">Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-900">
              {list.filter(v => String((v as any)?.status ?? '').toLowerCase() === VehicleStatus.SOLD).length}
            </div>
            <p className="text-xs text-rose-600 flex items-center mt-1">Completed</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">Inventory value</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Badge */}
      {statusFilter !== 'all' && (
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary">Filtered by: {statusFilter}</Badge>
          <Button variant="ghost" size="sm" onClick={() => setStatusFilter('all')}>Clear Filter</Button>
        </div>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>Click actions to view, edit, or delete</CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryTable
            vehicles={filteredVehicles}
            onView={handleViewVehicle}
            onEdit={handleEditVehicle}
            onDelete={(arg: any) => handleDeleteVehicle(typeof arg === 'string' ? arg : arg?.id)}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default function InventoryManagement() {
  return (
    <Routes>
      <Route path="/" element={<InventoryList />} />
      <Route path="/*" element={<InventoryList />} />
    </Routes>
  )
}
