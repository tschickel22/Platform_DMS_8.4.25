import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button' 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Package, Plus, Upload, Download, QrCode, TrendingUp, DollarSign } from 'lucide-react'
import { Vehicle, VehicleStatus, VehicleType } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { useInventoryManagement } from './hooks/useInventoryManagement'
import { useToast } from '@/hooks/use-toast'
import { InventoryTable } from './components/InventoryTable'
import VehicleForm from './components/VehicleForm'
import { VehicleDetail } from './components/VehicleDetail'
import { CSVImport } from './components/CSVImport'
import { BarcodeScanner } from './components/BarcodeScanner'
import { TagSelector } from '@/modules/tagging-engine'
import { TagType } from '@/modules/tagging-engine/types'
import { TaskForm } from '@/modules/task-center/components/TaskForm'
import { useTasks } from '@/hooks/useTasks'
import { Task, TaskModule, TaskPriority } from '@/types'

function InventoryList() {
  const { vehicles, createVehicle, updateVehicleStatus, deleteVehicle } = useInventoryManagement()
  const { toast } = useToast()
  const { createTask } = useTasks()
  const [showVehicleForm, setShowVehicleForm] = useState(false)
  const [showVehicleDetail, setShowVehicleDetail] = useState(false)
  const [showCSVImport, setShowCSVImport] = useState(false)
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [initialTaskData, setInitialTaskData] = useState<Partial<Task> | undefined>(undefined)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'analytics' | 'import'>('dashboard')
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold' | 'reserved'>('all')
  
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
    // Determine priority based on vehicle status
    const priority = vehicle.status === 'service' ? TaskPriority.HIGH :
                    TaskPriority.LOW

    // Set due date based on vehicle status
    const dueDate = vehicle.status === 'service' 
      ? new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day for service
      : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days for others

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
        // Update existing vehicle
        await updateVehicleStatus(selectedVehicle.id, vehicleData.status || selectedVehicle.status)
        toast({
          title: 'Vehicle Updated',
          description: 'Vehicle information has been updated',
        })
      } else {
        // Create new vehicle
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
      // In a real app, this would be a batch import
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
    // Check if this VIN already exists
    const existingVehicle = vehicles.find(v => v.vin === data)
    
    if (existingVehicle) {
      setSelectedVehicle(existingVehicle)
      setShowVehicleDetail(true)
      toast({
        title: 'Vehicle Found',
        description: `Found existing vehicle with VIN: ${data}`,
      })
    } else {
      // Create a new vehicle with this VIN
      setSelectedVehicle(null)
      setShowVehicleForm(true)
      
      // Pre-fill the VIN field
      setTimeout(() => {
        const vinInput = document.getElementById('vin') as HTMLInputElement
        if (vinInput) {
          vinInput.value = data
          // Trigger a change event
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

  // Helper function to apply tile filters
  const applyTileFilter = (status: 'all' | 'available' | 'sold' | 'reserved') => {
    setActiveTab('inventory')
    setStatusFilter(status)
  }

  const tileProps = (handler: () => void) => ({
    role: 'button' as const,
    tabIndex: 0,
    onClick: handler,
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter') handler() },
    className: 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring',
  })

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesStatus = statusFilter === 'all' || vehicle.status.toLowerCase() === statusFilter.toLowerCase()
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
      
      {/* Vehicle Form Modal */}
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
              Manage your RV and motorhome inventory
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
              <Dialog open={isAddHomeModalOpen} onOpenChange={setIsAddHomeModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Home
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Home</DialogTitle>
                  </DialogHeader>
                  <VehicleForm 
                    onSubmit={(data) => {
  // Filter inventory based on search and status
  const filteredInventory = mockInventory.sampleVehicles.filter(vehicle => {
    const matchesSearch = vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || vehicle.status.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

                      console.log('New home data:', data)
                      setIsAddHomeModalOpen(false)
                      // Handle form submission here
                    }}
                    onCancel={() => setIsAddHomeModalOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card 
          {...tileProps(() => applyTileFilter('all'))}
          className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50"
        >
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
        <Card 
          {...tileProps(() => applyTileFilter('available'))}
          className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50"
        >
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
        <Card 
          {...tileProps(() => applyTileFilter('sold'))}
          className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">Reserved</CardTitle>
            <Package className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
            <div className="text-2xl font-bold">{mockInventory.sampleVehicles.length}</div>
            </div>
              {mockInventory.sampleVehicles.filter(v => v.status === 'Available').length} available
              <TrendingUp className="h-3 w-3 mr-1" />
              Pending sale
            </p>
          </CardContent>
        </Card>
        <Card 
          {...tileProps(() => applyTileFilter('reserved'))}
          className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50"
        >
            <div className="text-2xl font-bold">
              {mockInventory.sampleVehicles.filter(v => v.type === 'RV').length}
            </div>
            <CardTitle className="text-sm font-medium text-purple-900">Total Value</CardTitle>
              {mockInventory.sampleVehicles.filter(v => v.type === 'RV' && v.status === 'Available').length} available
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {formatCurrency(vehicles.reduce((sum, v) => sum + v.price, 0))}
            </div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Inventory value
            </p>
            <div className="text-2xl font-bold">
              {mockInventory.sampleVehicles.filter(v => v.type === 'Manufactured Home').length}
            </div>
        </Card>
              {mockInventory.sampleVehicles.filter(v => v.type === 'Manufactured Home' && v.status === 'Available').length} available

      {/* Filter Indicator */}
      {statusFilter !== 'all' && (
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary">
            Filtered by: {statusFilter}
          </Badge>
          <Button variant="ghost" size="sm" onClick={() => applyTileFilter('all')}>
            Clear Filter
            <div className="text-2xl font-bold">
              {mockInventory.sampleVehicles.filter(v => v.status === 'Pending').length}
            </div>
        </div>
              Awaiting completion
      
      {/* Inventory Table */}
      <InventoryTable 
        vehicles={filteredVehicles}
        onEdit={handleEditVehicle}
      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by make, model, or VIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="pending">Pending</option>
        </select>
      </div>

        onView={handleViewVehicle}
      {filteredInventory.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-medium mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No matching inventory' : 'No inventory items'}
          </h3>
          <p className="mb-4">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by adding your first vehicle or manufactured home.'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <div className="flex gap-2 justify-center">
              <Button onClick={() => setIsAddVehicleModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
              <Button variant="outline" onClick={() => setIsAddHomeModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Home
              </Button>
            </div>
          )}
      <Route path="/" element={<InventoryList />} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredInventory.map((vehicle) => (
            <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </CardTitle>
                  <Badge variant={vehicle.status === 'Available' ? 'default' : 
                                vehicle.status === 'Sold' ? 'secondary' : 'outline'}>
                    {vehicle.status}
                  </Badge>
                </div>
                <CardDescription>
                  {vehicle.type} • VIN: {vehicle.vin}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Purchase Price:</span>
                    <span className="font-medium">${vehicle.purchasePrice?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Retail Price:</span>
                    <span className="font-medium">${vehicle.retailPrice?.toLocaleString() || 'N/A'}</span>
                  </div>
                  {vehicle.condition && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Condition:</span>
                      <span className="font-medium">{vehicle.condition}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Routes>
  )
}