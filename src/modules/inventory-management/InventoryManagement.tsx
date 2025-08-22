// src/modules/inventory-management/InventoryManagement.tsx
import React, { useMemo, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Search,
  Download,
  Car,
  Home as HomeIcon,
  Eye,
  Edit,
  Trash2,
  Share as ShareIcon,
  DollarSign,
} from 'lucide-react'

import { VehicleInventory } from './types'
import { useInventoryManagement } from './hooks/useInventoryManagement'
import VehicleForm from './forms/VehicleForm'
import VehicleDetail from './components/VehicleDetail'
import InventoryTable from './components/InventoryTable'
import { formatCurrency, formatDate } from '@/lib/utils'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/hooks/use-toast'

type TypeFilter = 'all' | 'rv' | 'manufactured_home'
type StatusFilter = 'all' | 'available' | 'pending' | 'sold' | 'reserved'
type ViewMode = 'grid' | 'table'

// ---------- Index (list) screen ----------
function InventoryIndex() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const {
    inventory,
    loading,
    deleteVehicle,
    exportInventory,
  } = useInventoryManagement()

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const filteredInventory = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase()
    return inventory.filter((item) => {
      const matchesSearch =
        needle === '' ||
        item.title?.toLowerCase().includes(needle) ||
        item.make?.toLowerCase().includes(needle) ||
        item.model?.toLowerCase().includes(needle) ||
        item.inventoryId?.toLowerCase().includes(needle)

      const matchesType = typeFilter === 'all' || item.listingType === typeFilter
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      return matchesSearch && matchesType && matchesStatus
    })
  }, [inventory, searchTerm, typeFilter, statusFilter])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inventory item?')) return
    try {
      await deleteVehicle(id)
      toast({ title: 'Deleted', description: 'Inventory item removed.' })
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete inventory item',
        variant: 'destructive',
      })
    }
  }

  const handleShare = (item: VehicleInventory) => {
    const url = `${window.location.origin}/public/demo/listing/${item.id}`
    navigator.clipboard.writeText(url)
    toast({ title: 'Link Copied', description: 'Public listing URL copied to clipboard' })
  }

  const handleExport = async () => {
    try {
      await exportInventory(filteredInventory, 'csv')
      toast({ title: 'Export started', description: 'Your inventory export is being prepared' })
    } catch {
      toast({ title: 'Export failed', description: 'Failed to export inventory', variant: 'destructive' })
    }
  }

  const TypeIcon = (type: string) => (type === 'rv' ? Car : HomeIcon)
  const statusBadgeClass = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'sold': return 'bg-blue-100 text-blue-800'
      case 'reserved': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">Manage your RV and manufactured home inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {/* RELATIVE nav so it works under any mountpoint */}
          <Button onClick={() => navigate('new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Inventory
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">
              {inventory.filter((i) => i.status === 'available').length} available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RVs</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventory.filter((i) => i.listingType === 'rv').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {inventory.filter((i) => i.listingType === 'rv' && i.status === 'available').length} available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manufactured Homes</CardTitle>
            <HomeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventory.filter((i) => i.listingType === 'manufactured_home').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {inventory.filter((i) => i.listingType === 'manufactured_home' && i.status === 'available').length} available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                inventory
                  .filter((i) => i.status === 'available')
                  .reduce((sum, i) => sum + (i.salePrice || i.rentPrice || 0), 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">Available inventory</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="rv">RVs</SelectItem>
                <SelectItem value="manufactured_home">Manufactured Homes</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button variant={viewMode === 'grid' ? 'default' : 'outline'} onClick={() => setViewMode('grid')}>
                Grid
              </Button>
              <Button variant={viewMode === 'table' ? 'default' : 'outline'} onClick={() => setViewMode('table')}>
                Table
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      {filteredInventory.length === 0 ? (
        <EmptyState
          title="No inventory found"
          description="No inventory items match your current filters. Try adjusting your search or filters."
          icon={<Car className="h-12 w-12" />}
          primaryAction={{ label: 'Create your first listing', onClick: () => navigate('new') }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredInventory.map((item) => {
            const Icon = TypeIcon(item.listingType)
            return (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video bg-muted">
                  {item.photos?.[0] ? (
                    <img
                      src={item.photos[0]}
                      alt={item.title ?? `${item.make} ${item.model}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                      No photo
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">
                      {item.title || `${item.year ?? ''} ${item.make} ${item.model}`.trim()}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {item.status && <Badge className={statusBadgeClass(item.status)}>{item.status}</Badge>}
                    {item.listingType && <Badge variant="outline">{item.listingType}</Badge>}
                    {item.inventoryId && <Badge variant="secondary">ID: {item.inventoryId}</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-2xl font-semibold">
                    {item.salePrice || item.rentPrice ? formatCurrency(item.salePrice || item.rentPrice || 0) : '—'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Added {item.createdAt ? formatDate(item.createdAt) : '—'}
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`${item.id}`)}>
                      <Eye className="h-4 w-4 mr-2" /> View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate(`${item.id}/edit`)}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleShare(item)}>
                      <ShareIcon className="h-4 w-4 mr-2" /> Share
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <InventoryTable
              vehicles={filteredInventory}
              onView={(v) => navigate(`${v.id}`)}
              onEdit={(v) => navigate(`${v.id}/edit`)}
              onDelete={(id: string) => handleDelete(id)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ---------- Route wrapper ----------
export default function InventoryManagement() {
  return (
    <Routes>
      <Route index element={<InventoryIndex />} />
      <Route path="new" element={<VehicleForm mode="create" />} />
      <Route path=":id" element={<VehicleDetail />} />
      <Route path=":id/edit" element={<VehicleForm mode="edit" />} />
    </Routes>
  )
}
