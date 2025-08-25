import React, { useState, useMemo } from 'react'
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
  Eye,
  Edit,
  Trash2,
  MapPin,
  DollarSign,
  Calendar
} from 'lucide-react'
import { useInventoryManagement } from './hooks/useInventoryManagement'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/loading-skeleton'

export default function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  
  const { 
    vehicles, 
    loading, 
    error, 
    createVehicle, 
    updateVehicle, 
    deleteVehicle 
  } = useInventoryManagement()

  // Filter vehicles based on search and filters
  const filteredVehicles = useMemo(() => {
    if (!vehicles || !Array.isArray(vehicles)) return []
    
    return vehicles.filter(vehicle => {
      const matchesSearch = searchTerm === '' || 
        vehicle.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.inventoryId?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
      const matchesType = typeFilter === 'all' || vehicle.listingType === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [vehicles, searchTerm, statusFilter, typeFilter])

  // Calculate stats
  const stats = useMemo(() => {
    if (!vehicles || !Array.isArray(vehicles)) {
      return {
        total: 0,
        available: 0,
        sold: 0,
        totalValue: 0
      }
    }

    const available = vehicles.filter(v => v.status === 'available').length
    const sold = vehicles.filter(v => v.status === 'sold').length
    const totalValue = vehicles.reduce((sum, v) => sum + (v.salePrice || 0), 0)

    return {
      total: vehicles.length,
      available,
      sold,
      totalValue
    }
  }, [vehicles])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="ri-page-header">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="ri-stats-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-20 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="ri-page-header">
          <h1 className="ri-page-title">Inventory Management</h1>
          <p className="ri-page-description">Manage your RV and manufactured home inventory</p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Inventory</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="ri-page-header">
        <h1 className="ri-page-title">Inventory Management</h1>
        <p className="ri-page-description">
          Manage your RV and manufactured home inventory
        </p>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Active inventory count
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold stat-success">{stats.available}</div>
            <p className="text-xs text-muted-foreground">
              Ready for sale/rent
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sold</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold stat-primary">{stats.sold}</div>
            <p className="text-xs text-muted-foreground">
              Completed sales
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Inventory value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="ri-search-bar">
            <Search className="ri-search-icon" />
            <Input
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ri-search-input"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="reserved">Reserved</option>
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Types</option>
            <option value="rv">RV</option>
            <option value="manufactured_home">Manufactured Home</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Unit
          </Button>
        </div>
      </div>

      {/* Inventory List */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory ({filteredVehicles.length})</CardTitle>
          <CardDescription>
            Manage your vehicle inventory and listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredVehicles.length === 0 ? (
            <EmptyState
              title="No inventory found"
              description="Get started by adding your first vehicle to inventory"
              icon={<Package className="h-12 w-12" />}
              action={{
                label: "Add Vehicle",
                onClick: () => setShowAddModal(true)
              }}
            />
          ) : (
            <div className="space-y-4">
              {filteredVehicles.map((vehicle) => (
                <div key={vehicle.id} className="ri-table-row">
                  <div className="flex items-center space-x-4 flex-1">
                    {vehicle.media?.primaryPhoto && (
                      <img 
                        src={vehicle.media.primaryPhoto} 
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-16 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium truncate">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {vehicle.listingType === 'rv' ? 'RV' : 'MH'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>ID: {vehicle.inventoryId}</span>
                        {vehicle.vin && <span>VIN: {vehicle.vin}</span>}
                        {vehicle.location?.city && (
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {vehicle.location.city}, {vehicle.location.state}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      {vehicle.salePrice && (
                        <div className="font-medium">${vehicle.salePrice.toLocaleString()}</div>
                      )}
                      {vehicle.rentPrice && (
                        <div className="text-sm text-muted-foreground">
                          ${vehicle.rentPrice}/mo
                        </div>
                      )}
                    </div>
                    
                    <Badge 
                      variant={vehicle.status === 'available' ? 'default' : 'secondary'}
                      className="ri-badge-status"
                    >
                      {vehicle.status}
                    </Badge>
                    
                    <div className="ri-action-buttons">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Vehicle Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Vehicle</CardTitle>
              <CardDescription>Add a new vehicle to your inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Vehicle form will be implemented here
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowAddModal(false)}>
                  Add Vehicle
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}