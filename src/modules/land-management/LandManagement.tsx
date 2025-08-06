import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, MapPin, Calendar, DollarSign, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LandForm } from './components/LandForm'
import { LandList } from './components/LandList'
import { LandDetail } from './components/LandDetail'
import { useLandManagement } from './hooks/useLandManagement'

function LandOverview() {
  const { lands, addLand, updateLand, deleteLand } = useLandManagement()
  const [showForm, setShowForm] = useState(false)
  const [selectedLand, setSelectedLand] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  // Filter and sort lands
  const filteredLands = lands
    .filter(land => {
      const matchesSearch = land.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          land.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || land.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'size':
          return b.size - a.size
        case 'price':
          return b.price - a.price
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

  const handleAddLand = (landData: any) => {
    addLand(landData)
    setShowForm(false)
  }

  const handleUpdateLand = (landData: any) => {
    updateLand(landData)
    setSelectedLand(null)
  }

  const handleDeleteLand = (landId: string) => {
    deleteLand(landId)
    setSelectedLand(null)
  }

  // Calculate stats
  const totalLands = lands.length
  const availableLands = lands.filter(land => land.status === 'available').length
  const totalValue = lands.reduce((sum, land) => sum + land.price, 0)
  const totalAcreage = lands.reduce((sum, land) => sum + land.size, 0)

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Add New Land</h1>
            <p className="text-muted-foreground">Add a new land parcel to your inventory</p>
          </div>
          <Button variant="outline" onClick={() => setShowForm(false)}>
            Cancel
          </Button>
        </div>
        <LandForm onSubmit={handleAddLand} onCancel={() => setShowForm(false)} />
      </div>
    )
  }

  if (selectedLand) {
    return (
      <LandDetail
        land={selectedLand}
        onBack={() => setSelectedLand(null)}
        onEdit={handleUpdateLand}
        onDelete={handleDeleteLand}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Land Management</h1>
          <p className="text-muted-foreground">Manage your land inventory and parcels</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Land
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parcels</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLands}</div>
            <p className="text-xs text-muted-foreground">
              {availableLands} available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Acreage</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAcreage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">acres</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">estimated value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Price/Acre</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalAcreage > 0 ? Math.round(totalValue / totalAcreage).toLocaleString() : '0'}
            </div>
            <p className="text-xs text-muted-foreground">per acre</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="size">Size</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="date">Date Added</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">
            Showing {filteredLands.length} of {totalLands} land parcels
          </p>
        </CardContent>
      </Card>

      {/* Land List */}
      <LandList 
        lands={filteredLands}
        onSelectLand={setSelectedLand}
        onEditLand={(land) => setSelectedLand(land)}
        onDeleteLand={handleDeleteLand}
      />
    </div>
  )
}

export default function LandManagement() {
  return (
    <Routes>
      <Route path="/" element={<LandOverview />} />
      <Route path="*" element={<Navigate to="/land" replace />} />
    </Routes>
  )
}