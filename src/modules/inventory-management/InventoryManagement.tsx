import React, { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Car,
  Home,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Share
} from 'lucide-react'
import { VehicleInventory, RVInventory, ManufacturedHomeInventory } from './types'
import { useInventoryManagement } from './hooks/useInventoryManagement'
import VehicleForm from './forms/VehicleForm'
import { formatCurrency, formatDate } from '@/lib/utils'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/hooks/use-toast'

function InventoryList() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { 
    inventory, 
    loading, 
    createVehicle, 
    updateVehicle, 
    deleteVehicle,
    exportInventory 
  } = useInventoryManagement()

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'rv' | 'manufactured_home'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'pending' | 'sold' | 'reserved'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  // Filter inventory based on search and filters
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.inventoryId?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === 'all' || item.listingType === typeFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this inventory item?')) {
      try {
        await deleteVehicle(id)
        toast({
          title: 'Success',
          description: 'Inventory item deleted successfully'
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete inventory item',
          variant: 'destructive'
        })
      }
    }
  }

  const handleShare = (item: VehicleInventory) => {
    const url = `${window.location.origin}/public/demo/listing/${item.id}`
    navigator.clipboard.writeText(url)
    toast({
      title: 'Link Copied',
      description: 'Public listing URL copied to clipboard'
    })
  }

  const handleExport = async () => {
    try {
      await exportInventory(filteredInventory, 'csv')
      toast({
        title: 'Export Started',
        description: 'Your inventory export is being prepared'
      })
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export inventory',
        variant: 'destructive'
      })
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'rv' ? Car : Home
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'sold':
        return 'bg-blue-100 text-blue-800'
      case 'reserved':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
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
          <p className="text-muted-foreground">
            Manage your RV and manufactured home inventory
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => navigate('/inventory/new')}>
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
              {inventory.filter(i => i.status === 'available').length} available
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
              {inventory.filter(i => i.listingType === 'rv').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {inventory.filter(i => i.listingType === 'rv' && i.status === 'available').length} available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manufactured Homes</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventory.filter(i => i.listingType === 'manufactured_home').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {inventory.filter(i => i.listingType === 'manufactured_home' && i.status === 'available').length} available
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
                  .filter(i => i.status === 'available')
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="rv">RVs</SelectItem>
                <SelectItem value="manufactured_home">Manufactured Homes</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
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
          </div>
        </CardContent>
      </Card>

      {/* Inventory Grid */}
      {filteredInventory.length === 0 ? (
        <EmptyState
          title="No inventory found"
          description="No inventory items match your current filters. Try adjusting your search or filters."
          icon={<Car className="h-12 w-12" /