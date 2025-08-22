import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  Trash2,
  DollarSign,
  Ruler,
  Home
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/utils'
import { EmptyState } from '@/components/ui/empty-state'

interface LandProperty {
  id: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  zoning: string
  status: 'AVAILABLE' | 'UNDER_CONTRACT' | 'SOLD' | 'RESERVED' | 'OFF_MARKET'
  size: number
  sizeUnit: 'acres' | 'sqft' | 'hectares'
  price: number
  cost: number
  pricePerUnit?: number
  description?: string
  notes?: string
  images: string[]
  features?: string[]
  restrictions?: string[]
  utilities?: {
    water: boolean
    sewer: boolean
    electric: boolean
    gas: boolean
    internet: boolean
  }
  taxes?: {
    annual: number
    assessedValue: number
    lastAssessment: string
  }
  createdAt: string
  updatedAt: string
}

// Mock land data
const mockLandData: LandProperty[] = [
  {
    id: 'land-001',
    address: {
      street: '123 Country Road',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'USA'
    },
    zoning: 'Residential',
    status: 'AVAILABLE',
    size: 2.5,
    sizeUnit: 'acres',
    price: 85000,
    cost: 65000,
    pricePerUnit: 34000,
    description: 'Beautiful 2.5-acre lot with mature trees and utilities available.',
    features: ['Utilities Available', 'Mature Trees', 'Corner Lot', 'Paved Road Access'],
    utilities: {
      water: true,
      sewer: true,
      electric: true,
      gas: false,
      internet: true
    },
    taxes: {
      annual: 2400,
      assessedValue: 75000,
      lastAssessment: '2024-01-01'
    },
    images: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'land-002',
    address: {
      street: '456 Lake View Drive',
      city: 'Orlando',
      state: 'FL',
      zipCode: '32801',
      country: 'USA'
    },
    zoning: 'Residential',
    status: 'UNDER_CONTRACT',
    size: 1.8,
    sizeUnit: 'acres',
    price: 125000,
    cost: 95000,
    pricePerUnit: 69444,
    description: 'Waterfront lot with private dock access and stunning lake views.',
    features: ['Waterfront', 'Private Dock', 'Lake Views', 'All Utilities'],
    utilities: {
      water: true,
      sewer: true,
      electric: true,
      gas: true,
      internet: true
    },
    taxes: {
      annual: 3200,
      assessedValue: 115000,
      lastAssessment: '2024-01-01'
    },
    images: ['https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800'],
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-20T09:15:00Z'
  }
]

function LandOverview() {
  const [properties, setProperties] = useState<LandProperty[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    setProperties(mockLandData)
  }, [])

  const filteredProperties = properties.filter(property => {
    const matchesSearch = searchTerm === '' || 
      property.address.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.zoning.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || property.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: properties.length,
    available: properties.filter(p => p.status === 'AVAILABLE').length,
    underContract: properties.filter(p => p.status === 'UNDER_CONTRACT').length,
    sold: properties.filter(p => p.status === 'SOLD').length,
    totalValue: properties.reduce((sum, p) => sum + p.price, 0),
    totalAcres: properties.reduce((sum, p) => sum + (p.sizeUnit === 'acres' ? p.size : p.size / 43560), 0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800'
      case 'UNDER_CONTRACT':
        return 'bg-yellow-100 text-yellow-800'
      case 'SOLD':
        return 'bg-blue-100 text-blue-800'
      case 'RESERVED':
        return 'bg-purple-100 text-purple-800'
      case 'OFF_MARKET':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDeleteProperty = (propertyId: string) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId))
    toast({
      title: 'Property Deleted',
      description: 'The land property has been removed from inventory.'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Land Management</h1>
          <p className="text-muted-foreground">
            Manage your land inventory and property listings
          </p>
        </div>
        <Button onClick={() => navigate('/land/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Home className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Contract</CardTitle>
            <Home className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.underContract}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Acres</CardTitle>
            <Ruler className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAcres.toFixed(1)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by address, city, or zoning..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="UNDER_CONTRACT">Under Contract</option>
              <option value="SOLD">Sold</option>
              <option value="RESERVED">Reserved</option>
              <option value="OFF_MARKET">Off Market</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Properties List */}
      <Card>
        <CardHeader>
          <CardTitle>Land Properties ({filteredProperties.length})</CardTitle>
          <CardDescription>
            Manage your land inventory and property listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProperties.length === 0 ? (
            <EmptyState
              title="No properties found"
              description="No properties match your current filters. Try adjusting your search criteria."
              icon={<MapPin className="h-12 w-12" />}
              action={{
                label: "Add Property",
                onClick: () => navigate('/land/new')
              }}
            />
          ) : (
            <div className="space-y-4">
              {filteredProperties.map((property) => (
                <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    {property.images[0] && (
                      <img 
                        src={property.images[0]} 
                        alt={property.address.street}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">
                        {property.address.street}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {property.address.city}, {property.address.state} {property.address.zipCode}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {property.size} {property.sizeUnit}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(property.status)}`}>
                          {property.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {property.zoning}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right mr-4">
                      <div className="font-semibold text-green-600">
                        {formatCurrency(property.price)}
                      </div>
                      {property.pricePerUnit && (
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(property.pricePerUnit)}/{property.sizeUnit}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/land/${property.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/land/${property.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProperty(property.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function LandManagement() {
  return (
    <Routes>
      <Route path="/" element={<LandOverview />} />
      <Route path="/new" element={<div>Add New Land Property Form</div>} />
      <Route path="/:propertyId" element={<div>Land Property Detail</div>} />
      <Route path="/:propertyId/edit" element={<div>Edit Land Property Form</div>} />
    </Routes>
  )
}