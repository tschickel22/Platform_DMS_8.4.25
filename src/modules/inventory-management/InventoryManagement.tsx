import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Search, 
  Package, 
  DollarSign, 
  TrendingUp,
  Edit,
  Trash2,
  Home,
  Truck
} from 'lucide-react'
import { useInventoryManagement } from './hooks/useInventoryManagement'
import AddEditHomeModal from './components/AddEditHomeModal'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/hooks/use-toast'

export default function InventoryManagement() {
  const {
    inventory,
    loading,
    error,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    searchInventory,
    getInventoryStats
  } = useInventoryManagement()

  const { toast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'manufactured_home' | 'rv'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'reserved' | 'sold'>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  // Get filtered inventory
  const filteredInventory = React.useMemo(() => {
    let filtered = searchTerm ? searchInventory(searchTerm) : inventory
    
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.listingType === filterType)
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus)
    }
    
    return filtered
  }, [inventory, searchTerm, filterType, filterStatus, searchInventory])

  const stats = getInventoryStats()

  const handleAddItem = async (data: any) => {
    try {
      await addInventoryItem(data)
      setShowAddModal(false)
      toast({
        title: 'Success',
        description: 'Inventory item added successfully'
      })
    } catch (error) {
      console.error('Failed to add inventory item:', error)
      toast({
        title: 'Error',
        description: 'Failed to add inventory item',
        variant: 'destructive'
      })
    }
  }

  const handleEditItem = async (data: any) => {
    try {
      if (editingItem) {
        await updateInventoryItem(editingItem.id, data)
        setEditingItem(null)
        toast({
          title: 'Success',
          description: 'Inventory item updated successfully'
        })
      }
    } catch (error) {
      console.error('Failed to update inventory item:', error)
      toast({
        title: 'Error',
        description: 'Failed to update inventory item',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteInventoryItem(id)
        toast({
          title: 'Success',
          description: 'Inventory item deleted successfully'
        })
      } catch (error) {
        console.error('Failed to delete inventory item:', error)
        toast({
          title: 'Error',
          description: 'Failed to delete inventory item',
          variant: 'destructive'
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Modals */}
      <AddEditHomeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddItem}
      />
      
      {editingItem && (
        <AddEditHomeModal
          isOpen={true}
          onClose={() => setEditingItem(null)}
          onSubmit={handleEditItem}
          initialData={editingItem}
        />
      )}

      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Inventory Management</h1>
            <p className="ri-page-description">
              Manage your RV and manufactured home inventory
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{stats.available} available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.available}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.available / stats.total) * 100) : 0}% of inventory
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.totalValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              Avg: ${Math.round(stats.averagePrice).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sold This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sold}</div>
            <p className="text-xs text-muted-foreground">
              {stats.reserved} reserved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-4">
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
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">All Types</option>
            <option value="manufactured_home">Manufactured Homes</option>
            <option value="rv">RVs</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      {/* Inventory Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Inventory</TabsTrigger>
          <TabsTrigger value="manufactured_home">Manufactured Homes</TabsTrigger>
          <TabsTrigger value="rv">RVs</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredInventory.length === 0 ? (
            <EmptyState
              title="No inventory items found"
              description="Get started by adding your first inventory item"
              icon={<Package className="h-12 w-12" />}
              action={{
                label: "Add First Item",
                onClick: () => setShowAddModal(true)
              }}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredInventory.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative">
                    {item.media?.primaryPhoto ? (
                      <img 
                        src={item.media.primaryPhoto} 
                        alt={`${item.make} ${item.model}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <Badge 
                      className="absolute top-2 right-2"
                      variant={item.status === 'available' ? 'default' : 'secondary'}
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {item.year} {item.make} {item.model}
                    </CardTitle>
                    <CardDescription>
                      {item.inventoryId} • {item.listingType === 'manufactured_home' ? 'Manufactured Home' : 'RV'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Sale Price</span>
                        <span className="font-semibold">${item.salePrice?.toLocaleString() || 'N/A'}</span>
                      </div>
                      {item.rentPrice && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Rent Price</span>
                          <span className="font-semibold">${item.rentPrice.toLocaleString()}/mo</span>
                        </div>
                      )}
                      {item.listingType === 'manufactured_home' && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Bedrooms/Baths</span>
                          <span>{item.bedrooms || 0}BR / {item.bathrooms || 0}BA</span>
                        </div>
                      )}
                      {item.listingType === 'rv' && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Sleeps/Length</span>
                          <span>{item.sleeps || 0} / {item.length || 0}ft</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingItem(item)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="manufactured_home" className="space-y-4">
          {filteredInventory.filter(item => item.listingType === 'manufactured_home').length === 0 ? (
            <EmptyState
              title="No manufactured homes found"
              description="Add manufactured homes to your inventory"
              icon={<Home className="h-12 w-12" />}
              action={{
                label: "Add Manufactured Home",
                onClick: () => setShowAddModal(true)
              }}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredInventory
                .filter(item => item.listingType === 'manufactured_home')
                .map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-video bg-gray-100 relative">
                      {item.media?.primaryPhoto ? (
                        <img 
                          src={item.media.primaryPhoto} 
                          alt={`${item.make} ${item.model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <Badge 
                        className="absolute top-2 right-2"
                        variant={item.status === 'available' ? 'default' : 'secondary'}
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        {item.year} {item.make} {item.model}
                      </CardTitle>
                      <CardDescription>
                        {item.inventoryId} • {item.bedrooms || 0}BR / {item.bathrooms || 0}BA
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Sale Price</span>
                          <span className="font-semibold">${item.salePrice?.toLocaleString() || 'N/A'}</span>
                        </div>
                        {item.rentPrice && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Rent Price</span>
                            <span className="font-semibold">${item.rentPrice.toLocaleString()}/mo</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Square Feet</span>
                          <span>{item.dimensions?.squareFeet || 'N/A'} sq ft</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingItem(item)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rv" className="space-y-4">
          {filteredInventory.filter(item => item.listingType === 'rv').length === 0 ? (
            <EmptyState
              title="No RVs found"
              description="Add RVs to your inventory"
              icon={<Truck className="h-12 w-12" />}
              action={{
                label: "Add RV",
                onClick: () => setShowAddModal(true)
              }}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredInventory
                .filter(item => item.listingType === 'rv')
                .map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-video bg-gray-100 relative">
                      {item.media?.primaryPhoto ? (
                        <img 
                          src={item.media.primaryPhoto} 
                          alt={`${item.make} ${item.model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Truck className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <Badge 
                        className="absolute top-2 right-2"
                        variant={item.status === 'available' ? 'default' : 'secondary'}
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        {item.year} {item.make} {item.model}
                      </CardTitle>
                      <CardDescription>
                        {item.inventoryId} • Sleeps {item.sleeps || 0}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Sale Price</span>
                          <span className="font-semibold">${item.salePrice?.toLocaleString() || 'N/A'}</span>
                        </div>
                        {item.rentPrice && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Rent Price</span>
                            <span className="font-semibold">${item.rentPrice.toLocaleString()}/mo</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Length</span>
                          <span>{item.length || 'N/A'} ft</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingItem(item)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}