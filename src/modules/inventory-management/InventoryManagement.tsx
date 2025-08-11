import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Download, Upload, BarChart3, Package, AlertTriangle, Home, Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useInventoryManagement } from './hooks/useInventoryManagement'
import { useToast } from '@/hooks/use-toast'
import VehicleForm from './components/VehicleForm'
import InventoryTable from './components/InventoryTable'

export default function InventoryManagement() {
  const { toast } = useToast()
  const {
    vehicles,
    loading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    updateVehicleStatus
  } = useInventoryManagement()

  const [showVehicleForm, setShowVehicleForm] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Calculate stats
  const totalVehicles = vehicles.length
  const availableVehicles = vehicles.filter(v => v.status === 'Available').length
  const soldVehicles = vehicles.filter(v => v.status === 'Sold').length
  const totalValue = vehicles.reduce((sum, v) => sum + (v.price || 0), 0)

  // Filter vehicles
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.vin?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddVehicle = () => {
    console.log('Opening add vehicle modal')
    setEditingVehicle(null)
    setShowVehicleForm(true)
  }

  const handleEditVehicle = (vehicle) => {
    console.log('Opening edit vehicle modal for:', vehicle)
    setEditingVehicle(vehicle)
    setShowVehicleForm(true)
  }

  const handleCloseForm = () => {
    console.log('Closing vehicle form modal')
    setShowVehicleForm(false)
    setEditingVehicle(null)
  }

  const handleSaveVehicle = async (vehicleData) => {
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, vehicleData)
        toast({
          title: "Success",
          description: "Vehicle updated successfully",
        })
      } else {
        await addVehicle(vehicleData)
        toast({
          title: "Success", 
          description: "Vehicle added successfully",
        })
      }
      handleCloseForm()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save vehicle",
        variant: "destructive",
      })
    }
  }

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await deleteVehicle(vehicleId)
      toast({
        title: "Success",
        description: "Vehicle deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to delete vehicle",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (vehicleId, newStatus) => {
    try {
      await updateVehicleStatus(vehicleId, newStatus)
      toast({
        title: "Success",
        description: "Vehicle status updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update vehicle status", 
        variant: "destructive",
      })
    }
  }

  const handleVehiclesSplit = (vehicleId) => {
    console.log('Splitting vehicle:', vehicleId)
    toast({
      title: "Feature Coming Soon",
      description: "Vehicle splitting functionality will be available soon",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <p className="text-destructive mb-2">Error loading inventory</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Manage your RV and manufactured home inventory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddVehicle} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New Vehicle
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVehicles}</div>
            <p className="text-xs text-muted-foreground">
              Total units in inventory
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableVehicles}</div>
            <p className="text-xs text-muted-foreground">
              Ready for sale
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sold</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{soldVehicles}</div>
            <p className="text-xs text-muted-foreground">
              Units sold
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Inventory value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
          <CardDescription>
            Manage your vehicle inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Search by make, model, or VIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Reserved">Reserved</option>
              <option value="Service">In Service</option>
            </select>
          </div>

          <InventoryTable
            vehicles={filteredVehicles}
            onEdit={handleEditVehicle}
            onDelete={handleDeleteVehicle}
            onView={(vehicle) => console.log('View vehicle:', vehicle)}
            onStatusChange={handleStatusChange}
            onSplit={handleVehiclesSplit}
          />
        </CardContent>
      </Card>

      {/* Vehicle Form Modal */}
      <VehicleForm
        isOpen={showVehicleForm}
        onClose={handleCloseForm}
        onSave={handleSaveVehicle}
        vehicle={editingVehicle}
        mode={editingVehicle ? 'edit' : 'add'}
      />
    </div>
  )
}