import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Package, Plus, Upload, QrCode, TrendingUp, DollarSign, Home,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useInventoryManagement } from './hooks/useInventoryManagement'
import { useToast } from '@/hooks/use-toast'
import { InventoryTable } from './components/InventoryTable'
import VehicleForm from './components/VehicleForm'            // ✅ default export + correct props
import { VehicleDetail } from './components/VehicleDetail'
import { CSVImport } from './components/CSVImport'
import { BarcodeScanner } from './components/BarcodeScanner'
import { TaskForm } from '@/modules/task-center/components/TaskForm'
import { useTasks } from '@/hooks/useTasks'
import { Task, TaskModule, TaskPriority } from '@/types'
import { Vehicle, VehicleStatus } from '@/types'               // ✅ bring in VehicleStatus

function InventoryList() {
  const { vehicles, createVehicle, updateVehicleStatus, deleteVehicle } = useInventoryManagement()
  const { toast } = useToast()
  const { createTask } = useTasks()

  const [showVehicleForm, setShowVehicleForm] = useState(false)
  const [vehicleFormMode, setVehicleFormMode] = useState<'add' | 'edit'>('add')
  const [showVehicleDetail, setShowVehicleDetail] = useState(false)
  const [showCSVImport, setShowCSVImport] = useState(false)
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [initialTaskData, setInitialTaskData] = useState<Partial<Task> | undefined>(undefined)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'analytics' | 'import'>('dashboard')
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold' | 'reserved'>('all')
  const [isVehicleFormOpen, setIsVehicleFormOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<any>(null)

  // Handle opening the modal for adding new vehicle
  const handleAddVehicle = () => {
    console.log('Opening add vehicle modal')
    setEditingVehicle(null) // Clear any editing state
    setIsVehicleFormOpen(true)
  }

  // Handle opening the modal for editing vehicle
  const handleEditVehicle = (vehicle: any) => {
    console.log('Opening edit vehicle modal for:', vehicle)
    setEditingVehicle(vehicle)
    setIsVehicleFormOpen(true)
  }

  // Handle closing the modal
  const handleCloseModal = () => {
    console.log('Closing vehicle modal')
    setIsVehicleFormOpen(false)
    setEditingVehicle(null)
  }

  const handleCreateVehicle = () => {
    setSelectedVehicle(null)
    setVehicleFormMode('add')
    setShowVehicleForm(true)
  }

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setShowVehicleDetail(true)
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
    const priority = vehicle.status === 'service' ? TaskPriority.HIGH : TaskPriority.LOW
    const dueDate =
      vehicle.status === 'service'
        ? new Date(Date.now() + 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)

    setInitialTaskData({
      sourceId: vehicle.id,
      sourceType: 'vehicle',
      module: TaskModule.CRM,
      title: `Follow up on ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      priority,
      dueDate,
      link: `/inventory`,
      customFields: {
        vehicleVin: vehicle.vin,
        vehiclePrice: vehicle.price,
        vehicleLocation: vehicle.location,
        vehicleStatus: vehicle.status,
      },
    })
    setShowTaskForm(true)
  }

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return
    try {
      await deleteVehicle(vehicleId)
      toast({ title: 'Vehicle Deleted', description: 'The vehicle has been removed from inventory' })
    } catch {
      toast({ title: 'Error', description: 'Failed to delete vehicle' })
    }
  }

  const handleStatusChange = async (vehicleId: string, status: VehicleStatus) => {
    try {
      await updateVehicleStatus(vehicleId, status)
      toast({ title: 'Status Updated', description: `Vehicle status changed to ${status}` })
    } catch {
      toast({ title: 'Error', description: 'Failed to update vehicle status', variant: 'destructive' })
    }
  }

  const handleSubmitVehicle = async (vehicleData: Partial<Vehicle>) => {
    try {
      if (selectedVehicle) {
        // minimal "update" behavior preserved
        await updateVehicleStatus(selectedVehicle.id, vehicleData.status || selectedVehicle.status)
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
        variant: 'destructive',
      })
    }
  }

  const handleImportCSV = async (vehiclesToImport: Partial<Vehicle>[]) => {
    try {
      for (const vehicle of vehiclesToImport) await createVehicle(vehicle)
      setShowCSVImport(false)
      toast({ title: 'Import Successful', description: `Imported ${vehiclesToImport.length} vehicles` })
    } catch {
      toast({ title: 'Import Failed', description: 'There was an error importing the vehicles', variant: 'destructive' })
    }
  }

  const handleBarcodeScanned = (data: string) => {
    const existingVehicle = vehicles.find(v => v.vin === data)
    if (existingVehicle) {
      setSelectedVehicle(existingVehicle)
      setShowVehicleDetail(true)
      toast({ title: 'Vehicle Found', description: `Found existing vehicle with VIN: ${data}` })
    } else {
      setSelectedVehicle(null)
      setVehicleFormMode('add')
      setShowVehicleForm(true)
      setTimeout(() => {
        const vinInput = document.getElementById('vin') as HTMLInputElement | null
        if (vinInput) {
          vinInput.value = data
          vinInput.dispatchEvent(new Event('input', { bubbles: true }))
        }
      }, 100)
      toast({ title: 'New VIN Scanned', description: `Creating new vehicle with VIN: ${data}` })
    }
    setShowBarcodeScanner(false)
  }

  const applyTileFilter = (status: 'all' | 'available' | 'sold' | 'reserved') => {
    setActiveTab('inventory')
    setStatusFilter(status)
  }

  const tileProps = (handler: () => void) => ({
    role: 'button' as const,
    tabIndex: 0,
    onClick: handler,
    onKeyDown: (e: React.KeyboardEvent) => e.key === 'Enter' && handler(),
    className: 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring',
  })

  const filteredVehicles = vehicles.filter(v => {
    const matchesStatus =
      statusFilter === 'all' || v.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesStatus
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

      {/* Vehicle Form Modal (uses your VehicleForm signature) */}
      <VehicleForm
        isOpen={showVehicleForm}
        onClose={() => {
          setShowVehicleForm(false)
          setSelectedVehicle(null)
        }}
        onSubmit={handleSubmitVehicle}
        vehicle={selectedVehicle || undefined}
        mode={vehicleFormMode}
      />

      {/* Vehicle Detail Modal */}
      {showVehicleDetail && selectedVehicle && (
        <VehicleDetail
          vehicle={selectedVehicle}
          onClose={() => setShowVehicleDetail(false)}
          onEdit={handleEditVehicle}
          onCreateTask={handleCreateTaskForVehicle}
        />
      )}

      {/* CSV Import Modal */}
      {showCSVImport && (
        <CSVImport onImport={handleImportCSV} onCancel={() => setShowCSVImport(false)} />
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
            <p className="ri-page-description">Manage your RV and motorhome inventory</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowBarcodeScanner(true)}>
              <QrCode className="h-4 w-4 mr-2" />
              Scan Barcode
            </Button>
            <Button variant="outline" onClick={() => setShowCSVImport(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            <Button 
              onClick={handleAddVehicle}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Vehicle
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card {...tileProps(() => applyTileFilter('all'))} className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Units</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{vehicles.length}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5 units this month
            </p>
          </CardContent>
        </Card>

        <Card {...tileProps(() => applyTileFilter('available'))} className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Available</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {vehicles.filter(v => v.status === VehicleStatus.AVAILABLE).length}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Ready for sale
            </p>
          </CardContent>
        </Card>

        <Card {...tileProps(() => applyTileFilter('sold'))} className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">Reserved</CardTitle>
            <Package className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {vehicles.filter(v => v.status === VehicleStatus.RESERVED).length}
            </div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Pending sale
            </p>
          </CardContent>
        </Card>

        <Card {...tileProps(() => applyTileFilter('reserved'))} className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {formatCurrency(vehicles.reduce((sum, v) => sum + v.price, 0))}
            </div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Inventory value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Indicator */}
      {statusFilter !== 'all' && (
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary">Filtered by: {statusFilter}</Badge>
          <Button variant="ghost" size="sm" onClick={() => applyTileFilter('all')}>
            <Home className="h-4 w-4 text-muted-foreground" />
            Clear Filter
          </Button>
        </div>
      )}

      {/* Vehicle Form Modal */}
      <VehicleForm
        isOpen={isVehicleFormOpen}
        onClose={handleCloseModal}
        onSubmit={handleVehicleSubmit}
        vehicle={editingVehicle}
        mode={editingVehicle ? 'edit' : 'add'}
      />

      {/* Inventory Table */}
      <InventoryTable
        vehicles={filteredVehicles}
        onEdit={handleEditVehicle}
        onView={handleViewVehicle}
        onStatusChange={handleStatusChange}
        onCreateTask={handleCreateTaskForVehicle}
      />
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