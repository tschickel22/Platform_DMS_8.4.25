import React, { useState, useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { useTasks } from '@/hooks/useTasks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Package, Plus, Upload, QrCode, TrendingUp, DollarSign } from 'lucide-react'
import { Vehicle, VehicleStatus } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { useInventoryManagement } from './hooks/useInventoryManagement'
import { InventoryTable } from './components/InventoryTable'
import { CSVImport } from './components/CSVImport'
import { BarcodeScanner } from './components/BarcodeScanner'
import AddEditHomeModal from './components/AddEditHomeModal'
import { Task, TaskModule, TaskPriority } from '@/types'
import { TaskForm } from '@/modules/task-center/components/TaskForm'

/** ---------- Helpers ---------- */
const toStatusKey = (val: unknown): 'available' | 'reserved' | 'sold' | 'pending' | 'other' => {
  const s = String(val ?? '').toLowerCase()
  if (s.startsWith('avail')) return 'available'
  if (s.startsWith('reser')) return 'reserved'
  if (s.startsWith('sold')) return 'sold'
  if (s.startsWith('pend')) return 'pending'
  return 'other'
}

const getPrice = (v: any) => {
  const n = Number(v?.price ?? v?.askingPrice ?? 0)
  return Number.isFinite(n) ? n : 0
}

/** ---------- Local Detail Dialog (fixes undefined component) ---------- */
type VehicleDetailDialogProps = {
  vehicle: Vehicle
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (vehicle: Vehicle) => void
}

function VehicleDetailDialog({ vehicle, open, onOpenChange, onEdit }: VehicleDetailDialogProps) {
  const v: any = vehicle
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {`${v?.year ?? ''} ${v?.make ?? v?.brand ?? ''} ${v?.model ?? ''}`.trim() || 'Inventory Item'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-muted-foreground">VIN</div>
              <div className="font-medium">{v?.vin || '—'}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Status</div>
              <div className="font-medium capitalize">{String(v?.status ?? '—')}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Price</div>
              <div className="font-medium">{formatCurrency(getPrice(v))}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Location</div>
              <div className="font-medium">{v?.location ?? v?.city ?? '—'}</div>
            </div>
          </div>

          {v?.description && (
            <div className="text-sm">
              <div className="text-muted-foreground mb-1">Description</div>
              <div className="whitespace-pre-wrap">{v.description}</div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
            <Button onClick={() => onEdit(vehicle)}>Edit</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/** ---------- Main List ---------- */
function InventoryList() {
  const { vehicles, createVehicle, updateVehicleStatus, deleteVehicle, updateVehicle } = useInventoryManagement() as any
  const { toast } = useToast()
  const { createTask } = useTasks()

  // UI state
  const [showVehicleDetail, setShowVehicleDetail] = useState(false)
  const [showCSVImport, setShowCSVImport] = useState(false)
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  const [showTaskForm, setShowTaskForm] = useState(false)
  const [initialTaskData, setInitialTaskData] = useState<Partial<Task> | undefined>(undefined)

  // Add/Edit Home (single button retained uses this modal)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingHome, setEditingHome] = useState<Vehicle | null>(null)

  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold' | 'reserved'>('all')

  /** Derived stats */
  const stats = useMemo(() => {
    const total = vehicles.length
    let available = 0, reserved = 0, sold = 0
    let totalValue = 0
    for (const v of vehicles) {
      const k = toStatusKey((v as any).status)
      if (k === 'available') available++
      else if (k === 'reserved') reserved++
      else if (k === 'sold') sold++
      totalValue += getPrice(v)
    }
    return { total, available, reserved, sold, totalValue }
  }, [vehicles])

  /** Actions */
  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingHome(vehicle)
    setShowEditModal(true)
  }

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setShowVehicleDetail(true)
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

  const handleStatusChange = async (vehicleId: string, status: VehicleStatus | any) => {
    try {
      await updateVehicleStatus(vehicleId, status as VehicleStatus)
      toast({ title: 'Status Updated', description: `Vehicle status changed to ${String(status)}` })
    } catch {
      toast({ title: 'Error', description: 'Failed to update vehicle status', variant: 'destructive' })
    }
  }

  const handleImportCSV = async (vehiclesToImport: Partial<Vehicle>[]) => {
    try {
      for (const vehicle of vehiclesToImport) {
        await createVehicle(vehicle)
      }
      setShowCSVImport(false)
      toast({ title: 'Import Successful', description: `Imported ${vehiclesToImport.length} vehicles` })
    } catch {
      toast({ title: 'Import Failed', description: 'There was an error importing the vehicles', variant: 'destructive' })
    }
  }

  const handleBarcodeScanned = (data: string) => {
    const existing = vehicles.find((v: any) => String(v?.vin ?? '') === data)
    if (existing) {
      setSelectedVehicle(existing)
      setShowVehicleDetail(true)
      toast({ title: 'Vehicle Found', description: `Found existing vehicle with VIN: ${data}` })
    } else {
      setShowAddModal(true)
      toast({ title: 'New VIN Scanned', description: `Creating new vehicle with VIN: ${data}` })
    }
    setShowBarcodeScanner(false)
  }

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      await createTask(taskData)
      setShowTaskForm(false)
      setInitialTaskData(undefined)
      toast({ title: 'Task Created', description: 'Task has been created successfully' })
    } catch {
      toast({ title: 'Error', description: 'Failed to create task', variant: 'destructive' })
    }
  }

  const handleCreateTaskForVehicle = (vehicle: Vehicle) => {
    const key = toStatusKey((vehicle as any).status)
    const priority = key === 'pending' ? TaskPriority.HIGH : TaskPriority.LOW
    const dueDate = key === 'pending'
      ? new Date(Date.now() + 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)

    setInitialTaskData({
      sourceId: (vehicle as any).id,
      sourceType: 'vehicle',
      module: TaskModule.CRM,
      title: `Follow up on ${(vehicle as any).year ?? (vehicle as any).modelDate} ${(vehicle as any).make ?? (vehicle as any).brand} ${(vehicle as any).model ?? ''}`.trim(),
      priority,
      dueDate,
      link: `/inventory`,
      customFields: {
        vehicleVin: (vehicle as any).vin,
        vehiclePrice: getPrice(vehicle),
        vehicleLocation: (vehicle as any).location ?? (vehicle as any).city,
        vehicleStatus: (vehicle as any).status
      }
    })
    setShowTaskForm(true)
  }

  const handleAddHome = async (homeData: any) => {
    try {
      await createVehicle(homeData)
      setShowAddModal(false)
      toast({ title: 'Home Added', description: 'New home has been added to inventory' })
    } catch {
      toast({ title: 'Error', description: 'Failed to add home', variant: 'destructive' })
    }
  }

  const handleEditHome = async (homeData: any) => {
    try {
      if (editingHome) {
        if (typeof updateVehicle === 'function') {
          await updateVehicle((editingHome as any).id, homeData)
        } else {
          await updateVehicleStatus((editingHome as any).id, homeData.status)
        }
        setShowEditModal(false)
        setEditingHome(null)
        toast({ title: 'Home Updated', description: 'Home information has been updated' })
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to update home', variant: 'destructive' })
    }
  }

  /** Filters */
  const applyTileFilter = (status: 'all' | 'available' | 'sold' | 'reserved') => {
    setStatusFilter(status)
  }

  const filteredVehicles = useMemo(() => {
    if (statusFilter === 'all') return vehicles
    return vehicles.filter((v: any) => toStatusKey(v.status) === statusFilter)
  }, [vehicles, statusFilter])

  /** Keyboard-accessible tile handlers (no className here to avoid prop collisions) */
  const tileHandlers = (handler: () => void) => ({
    role: 'button' as const,
    tabIndex: 0,
    onClick: handler,
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter') handler() },
  })

  return (
    <div className="space-y-8">
      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          initialData={initialTaskData}
          onSave={handleCreateTask}
          onCancel={() => {
            setShowTaskForm(false)
            setInitialTaskData(undefined)
          }}
        />
      )}

      {/* Vehicle Detail Modal */}
      {showVehicleDetail && selectedVehicle && (
        <VehicleDetailDialog
          vehicle={selectedVehicle}
          open={showVehicleDetail}
          onOpenChange={(open) => setShowVehicleDetail(open)}
          onEdit={handleEditVehicle}
        />
      )}

      {/* CSV Import Modal */}
      {showCSVImport && (
        <CSVImport
          onImport={handleImportCSV}
          onCancel={() => setShowCSVImport(false)}
        />
      )}

      {/* Barcode Scanner Modal */}
      {showBarcodeScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScanned}
          onClose={() => setShowBarcodeScanner(false)}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Inventory Management</h1>
            <p className="ri-page-description">
              Manage your RV and manufactured home inventory
            </p>
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
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Home
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card
          {...tileHandlers(() => applyTileFilter('all'))}
          className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring shadow-sm border-0 hover:shadow-md transition bg-gradient-to-br from-blue-50 to-blue-100/50"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Units</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5 units this month
            </p>
          </CardContent>
        </Card>

        <Card
          {...tileHandlers(() => applyTileFilter('available'))}
          className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring shadow-sm border-0 hover:shadow-md transition bg-gradient-to-br from-green-50 to-green-100/50"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Available</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.available}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Ready for sale
            </p>
          </CardContent>
        </Card>

        <Card
          {...tileHandlers(() => applyTileFilter('reserved'))}
          className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring shadow-sm border-0 hover:shadow-md transition bg-gradient-to-br from-orange-50 to-orange-100/50"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">Reserved</CardTitle>
            <Package className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{stats.reserved}</div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Pending sale
            </p>
          </CardContent>
        </Card>

        <Card
          {...tileHandlers(() => applyTileFilter('sold'))}
          className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring shadow-sm border-0 hover:shadow-md transition bg-gradient-to-br from-rose-50 to-rose-100/50"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-rose-900">Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-900">{stats.sold}</div>
            <p className="text-xs text-rose-600 flex items-center mt-1">Completed</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {formatCurrency(stats.totalValue)}
            </div>
            <p className="text-xs text-purple-600 flex items-center mt-1">Inventory value</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Indicator */}
      {statusFilter !== 'all' && (
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary">Filtered by: {statusFilter}</Badge>
          <Button variant="ghost" size="sm" onClick={() => applyTileFilter('all')}>
            Clear Filter
          </Button>
        </div>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>Click actions to view, edit, create tasks, or delete</CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryTable
            vehicles={filteredVehicles}
            onView={handleViewVehicle}
            onEdit={handleEditVehicle}
            onDelete={(arg: any) => handleDeleteVehicle(typeof arg === 'string' ? arg : arg?.id)}
            onStatusChange={handleStatusChange}
            onCreateTask={handleCreateTaskForVehicle}
          />
        </CardContent>
      </Card>

      {/* Add / Edit Home Modals */}
      <AddEditHomeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddHome}
        mode="add"
      />

      <AddEditHomeModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingHome(null)
        }}
        onSave={handleEditHome}
        editingHome={editingHome as any}
        mode="edit"
      />
    </div>
  )
}

/** ---------- Routed Wrapper ---------- */
export default function InventoryManagement() {
  return (
    <Routes>
      <Route path="/" element={<InventoryList />} />
      <Route path="/*" element={<InventoryList />} />
    </Routes>
  )
}