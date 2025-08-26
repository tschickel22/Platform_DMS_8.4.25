import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button' 
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Package, Plus, Upload, Download, QrCode, TrendingUp, DollarSign, Home, Truck } from 'lucide-react'
import { Vehicle, VehicleStatus, VehicleType } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { useInventoryManagement } from './hooks/useInventoryManagement'
import { InventoryTable } from './components/InventoryTable'
import { VehicleForm } from './forms/VehicleForm'
import VehicleDetail from './components/VehicleDetail'
import { CSVImport } from './components/CSVImport'
import { BarcodeScanner } from './components/BarcodeScanner'
import { MHInventoryForm } from './forms/MHInventoryForm'
import { RVInventoryForm } from './forms/RVInventoryForm'
import { useToast } from '@/hooks/use-toast'
import { useTasks } from '@/hooks/useTasks'
import { Task, TaskModule, TaskPriority } from '@/types'
import { TaskForm } from '@/modules/task-center/components/TaskForm'

function InventoryDashboard() {
  const { vehicles, createVehicle, updateVehicleStatus, deleteVehicle } = useInventoryManagement()
  const { toast } = useToast()
  const { createTask } = useTasks()
  
  const [showVehicleForm, setShowVehicleForm] = useState(false)
  const [showVehicleDetail, setShowVehicleDetail] = useState(false)
  const [showCSVImport, setShowCSVImport] = useState(false)
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [initialTaskData, setInitialTaskData] = useState<Partial<Task> | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold' | 'reserved'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'rv' | 'manufactured_home'>('all')
  
  // Calculate stats
  const totalVehicles = vehicles.length
  const availableVehicles = vehicles.filter(v => v.status === VehicleStatus.AVAILABLE).length
  const reservedVehicles = vehicles.filter(v => v.status === VehicleStatus.RESERVED).length
  const soldVehicles = vehicles.filter(v => v.status === VehicleStatus.SOLD).length
  const totalValue = vehicles.reduce((sum, v) => sum + (v.price || 0), 0)
  
  const rvCount = vehicles.filter(v => v.type === VehicleType.RV || v.type === VehicleType.MOTORHOME || 
    v.type === VehicleType.TRAVEL_TRAILER || v.type === VehicleType.FIFTH_WHEEL || 
    v.type === VehicleType.TOY_HAULER).length
  
  const mhCount = vehicles.filter(v => v.type === VehicleType.SINGLE_WIDE || 
    v.type === VehicleType.DOUBLE_WIDE || v.type === VehicleType.TRIPLE_WIDE || 
    v.type === VehicleType.MODULAR_HOME || v.type === VehicleType.PARK_MODEL).length

  const handleCreateVehicle = () => {
    setSelectedVehicle(null)
    setShowVehicleForm(true)
  }
  
  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
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
      toast({
        title: 'Task Created',
        description: 'Task has been created successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive'
      })
    }
  }

  const handleCreateTaskForVehicle = (vehicle: Vehicle) => {
    const priority = vehicle.status === 'service' ? TaskPriority.HIGH : TaskPriority.LOW
    const dueDate = vehicle.status === 'service' 
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
        vehicleStatus: vehicle.status
      }
    })
    setShowTaskForm(true)
  }

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicle(vehicleId)
        toast({
          title: 'Vehicle Deleted',
          description: 'The vehicle has been removed from inventory',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete vehicle',
          variant: 'destructive'
        })
      }
    }
  }
  
  const handleStatusChange = async (vehicleId: string, status: VehicleStatus) => {
    try {
      await updateVehicleStatus(vehicleId, status)
      toast({
        title: 'Status Updated',
        description: `Vehicle status changed to ${status}`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update vehicle status',
        variant: 'destructive'
      })
    }
  }
  
  const handleSaveVehicle = async (vehicleData: Partial<Vehicle>) => {
    try {
      if (selectedVehicle) {
        await updateVehicleStatus(selectedVehicle.id, vehicleData.status || selectedVehicle.status)
        toast({
          title: 'Vehicle Updated',
          description: 'Vehicle information has been updated',
        })
      } else {
        await createVehicle(vehicleData)
        toast({
          title: 'Vehicle Added',
          description: 'New vehicle has been added to inventory',
        })
      }
      setShowVehicleForm(false)
      setSelectedVehicle(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${selectedVehicle ? 'update' : 'create'} vehicle`,
        variant: 'destructive'
      })
    }
  }
  
  const handleImportCSV = async (vehiclesToImport: Partial<Vehicle>[]) => {
    try {
      for (const vehicle of vehiclesToImport) {
        await createVehicle(vehicle)
      }
      
      setShowCSVImport(false)
      toast({
        title: 'Import Successful',
        description: `Imported ${vehiclesToImport.length} vehicles`,
      })
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: 'There was an error importing the vehicles',
        variant: 'destructive'
      })
    }
  }
  
  const handleBarcodeScanned = (data: string) => {
    const existingVehicle = vehicles.find(v => v.vin === data)
    
    if (existingVehicle) {
      setSelectedVehicle(existingVehicle)
      setShowVehicleDetail(true)
      toast({
        title: 'Vehicle Found',
        description: `Found existing vehicle with VIN: ${data}`,
      })
    } else {
      setSelectedVehicle(null)
      setShowVehicleForm(true)
      
      setTimeout(() => {
        const vinInput = document.getElementById('vin') as HTMLInputElement
        if (vinInput) {
          vinInput.value = data
          const event = new Event('input', { bubbles: true })
          vinInput.dispatchEvent(event)
        }
      }, 100)
      
      toast({
        title: 'New VIN Scanned',
        description: `Creating new vehicle with VIN: ${data}`,
      })
    }
    
    setShowBarcodeScanner(false)
  }

  const applyTileFilter = (status: 'all' | 'available' | 'sold' | 'reserved') => {
    setStatusFilter(status)
  }

  const applyTypeFilter = (type: 'all' | 'rv' | 'manufactured_home') => {
    setTypeFilter(type)
  }

  const tileProps = (handler: () => void) => ({
    role: 'button' as const,
    tabIndex: 0,
    onClick: handler,
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter') handler() },
    className: 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring transition-all hover:shadow-md',
  })

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesStatus = statusFilter === 'all' || vehicle.status.toLowerCase() === statusFilter.toLowerCase()
    
    let matchesType = true
    if (typeFilter === 'rv') {
      matchesType = [VehicleType.RV, VehicleType.MOTORHOME, VehicleType.TRAVEL_TRAILER, 
        VehicleType.FIFTH_WHEEL, VehicleType.TOY_HAULER].includes(vehicle.type)
    } else if (typeFilter === 'manufactured_home') {
      matchesType = [VehicleType.SINGLE_WIDE, VehicleType.DOUBLE_WIDE, VehicleType.TRIPLE_WIDE, 
        VehicleType.MODULAR_HOME, VehicleType.PARK_MODEL].includes(vehicle.type)
    }
    
    return matchesStatus && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Modals */}
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
      
      {showVehicleForm && (
        <VehicleForm
          vehicle={selectedVehicle || undefined}
          onSave={handleSaveVehicle}
          onCancel={() => {
            setShowVehicleForm(false)
            setSelectedVehicle(null)
          }}
        />
      )}
      
      {showVehicleDetail && selectedVehicle && (
        <VehicleDetail
          vehicle={selectedVehicle}
          onClose={() => setShowVehicleDetail(false)}
          onEdit={handleEditVehicle}
          onCreateTask={handleCreateTaskForVehicle}
        />
      )}
      
      {showCSVImport && (
        <CSVImport
          onImport={handleImportCSV}
          onCancel={() => setShowCSVImport(false)}
        />
      )}
      
      {showBarcodeScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScanned}
          onClose={() => setShowBarcodeScanner(false)}
        />
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage your RV and manufactured home inventory
          </p>
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
          <Button onClick={handleCreateVehicle}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Overview Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card 
              {...tileProps(() => applyTileFilter('all'))}
              className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">Total Units</CardTitle>
                <Package className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{totalVehicles}</div>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  All inventory items
                </p>
              </CardContent>
            </Card>
            
            <Card 
              {...tileProps(() => applyTileFilter('available'))}
              className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-900">Available</CardTitle>
                <Package className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">{availableVehicles}</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Ready for sale
                </p>
              </CardContent>
            </Card>
            
            <Card 
              {...tileProps(() => applyTileFilter('reserved'))}
              className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-900">Reserved</CardTitle>
                <Package className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900">{reservedVehicles}</div>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Pending sale
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-900">Total Value</CardTitle>
                <DollarSign className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">
                  {formatCurrency(totalValue)}
                </div>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Inventory value
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Type Breakdown */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card 
              {...tileProps(() => applyTypeFilter('rv'))}
              className="shadow-sm border-0 bg-gradient-to-br from-cyan-50 to-cyan-100/50"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-cyan-900">RV Units</CardTitle>
                <Truck className="h-4 w-4 text-cyan-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-cyan-900">{rvCount}</div>
                <p className="text-xs text-cyan-600">
                  Motorhomes, Travel Trailers, Fifth Wheels
                </p>
              </CardContent>
            </Card>
            
            <Card 
              {...tileProps(() => applyTypeFilter('manufactured_home'))}
              className="shadow-sm border-0 bg-gradient-to-br from-emerald-50 to-emerald-100/50"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-emerald-900">Manufactured Homes</CardTitle>
                <Home className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-900">{mhCount}</div>
                <p className="text-xs text-emerald-600">
                  Single/Double/Triple Wide, Modular
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest inventory updates and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vehicles.slice(0, 5).map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          VIN: {vehicle.vin} • {formatCurrency(vehicle.price || 0)}
                        </p>
                      </div>
                    </div>
                    <Badge variant={vehicle.status === VehicleStatus.AVAILABLE ? 'default' : 'secondary'}>
                      {vehicle.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          {/* Filter Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <div className="flex gap-1">
                <Button 
                  variant={statusFilter === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </Button>
                <Button 
                  variant={statusFilter === 'available' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setStatusFilter('available')}
                >
                  Available
                </Button>
                <Button 
                  variant={statusFilter === 'reserved' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setStatusFilter('reserved')}
                >
                  Reserved
                </Button>
                <Button 
                  variant={statusFilter === 'sold' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setStatusFilter('sold')}
                >
                  Sold
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Type:</span>
              <div className="flex gap-1">
                <Button 
                  variant={typeFilter === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setTypeFilter('all')}
                >
                  All
                </Button>
                <Button 
                  variant={typeFilter === 'rv' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setTypeFilter('rv')}
                >
                  <Truck className="h-3 w-3 mr-1" />
                  RV
                </Button>
                <Button 
                  variant={typeFilter === 'manufactured_home' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setTypeFilter('manufactured_home')}
                >
                  <Home className="h-3 w-3 mr-1" />
                  MH
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Indicators */}
          {(statusFilter !== 'all' || typeFilter !== 'all') && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {statusFilter !== 'all' && (
                <Badge variant="secondary">
                  Status: {statusFilter}
                  <button 
                    onClick={() => setStatusFilter('all')}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {typeFilter !== 'all' && (
                <Badge variant="secondary">
                  Type: {typeFilter === 'rv' ? 'RV' : 'Manufactured Home'}
                  <button 
                    onClick={() => setTypeFilter('all')}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setStatusFilter('all')
                  setTypeFilter('all')
                }}
              >
                Clear All
              </Button>
            </div>
          )}
          
          <InventoryTable 
            vehicles={filteredVehicles}
            onEdit={handleEditVehicle}
            onView={handleViewVehicle}
            onStatusChange={handleStatusChange}
            onCreateTask={handleCreateTaskForVehicle}
            onDelete={handleDeleteVehicle}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Distribution</CardTitle>
                <CardDescription>Breakdown by vehicle type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">RV Units</span>
                    <span className="font-medium">{rvCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Manufactured Homes</span>
                    <span className="font-medium">{mhCount}</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="text-sm font-medium">Total</span>
                    <span className="font-bold">{totalVehicles}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Overview</CardTitle>
                <CardDescription>Current inventory status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Available</span>
                    <Badge variant="default">{availableVehicles}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reserved</span>
                    <Badge variant="secondary">{reservedVehicles}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sold</span>
                    <Badge variant="outline">{soldVehicles}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Import Tools</CardTitle>
                <CardDescription>Import inventory from external sources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowCSVImport(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import from CSV
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowBarcodeScanner(true)}
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Scan Barcode/VIN
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Tools</CardTitle>
                <CardDescription>Export inventory data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export to CSV
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  Generate Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function InventoryManagement() {
  return (
    <Routes>
      <Route path="/" element={<InventoryDashboard />} />
      <Route path="/*" element={<InventoryDashboard />} />
    </Routes>
  )
}