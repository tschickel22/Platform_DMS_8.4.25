import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLandManagement } from '../hooks/useLandManagement'
import { LandStatus } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Plus, 
  MapPin, 
  DollarSign, 
  Ruler, 
  Eye,
  Edit,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react'

type SortField = 'price' | 'size' | 'createdAt' | 'address'
type SortDirection = 'asc' | 'desc'

export function LandList() {
  const { lands, loading, error, searchLands, getZoningTypes, getPricePerUnit } = useLandManagement()
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<LandStatus | 'all'>('all')
  const [zoningFilter, setZoningFilter] = useState<string>('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // Get unique zoning types for filter
  const zoningTypes = getZoningTypes()

  // Filter and sort lands
  const filteredAndSortedLands = useMemo(() => {
    // Apply search and filters
    const filters = {
      ...(statusFilter !== 'all' && { status: statusFilter as LandStatus }),
      ...(zoningFilter !== 'all' && { zoning: zoningFilter }),
      ...(minPrice && { minPrice: parseFloat(minPrice) }),
      ...(maxPrice && { maxPrice: parseFloat(maxPrice) })
    }

    let filtered = searchLands(searchQuery, filters)

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case 'price':
          aValue = a.price
          bValue = b.price
          break
        case 'size':
          aValue = a.size
          bValue = b.size
          break
        case 'createdAt':
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        case 'address':
          aValue = `${a.address.street}, ${a.address.city}`
          bValue = `${b.address.street}, ${b.address.city}`
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [searchQuery, statusFilter, zoningFilter, minPrice, maxPrice, sortField, sortDirection, searchLands])

  const getStatusColor = (status: LandStatus) => {
    switch (status) {
      case LandStatus.AVAILABLE:
        return 'bg-green-100 text-green-800'
      case LandStatus.UNDER_CONTRACT:
        return 'bg-yellow-100 text-yellow-800'
      case LandStatus.SOLD:
        return 'bg-gray-100 text-gray-800'
      case LandStatus.RESERVED:
        return 'bg-blue-100 text-blue-800'
      case LandStatus.OFF_MARKET:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => toggleSort(field)}
      className="h-auto p-1 font-normal"
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? <SortAsc className="ml-1 h-3 w-3" /> : <SortDesc className="ml-1 h-3 w-3" />
      )}
    </Button>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Land Management</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading land records...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Land Management</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-red-600">
              <p className="font-medium">Error loading land records</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Land Management</h1>
          <p className="text-muted-foreground">
            Manage lots, locations, and land inventory
          </p>
        </div>
        <Link to="/land/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Land
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by address, description, or zoning..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as LandStatus | 'all')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={LandStatus.AVAILABLE}>Available</SelectItem>
                  <SelectItem value={LandStatus.UNDER_CONTRACT}>Under Contract</SelectItem>
                  <SelectItem value={LandStatus.SOLD}>Sold</SelectItem>
                  <SelectItem value={LandStatus.RESERVED}>Reserved</SelectItem>
                  <SelectItem value={LandStatus.OFF_MARKET}>Off Market</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Zoning</label>
              <Select value={zoningFilter} onValueChange={setZoningFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Zoning</SelectItem>
                  {zoningTypes.map(zone => (
                    <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Min Price</label>
              <Input
                type="number"
                placeholder="$0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Max Price</label>
              <Input
                type="number"
                placeholder="No limit"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAndSortedLands.length} of {lands.length} land records
        </p>
        <div className="flex items-center space-x-2 text-sm">
          <span>Sort by:</span>
          <SortButton field="createdAt">Date</SortButton>
          <SortButton field="price">Price</SortButton>
          <SortButton field="size">Size</SortButton>
          <SortButton field="address">Location</SortButton>
        </div>
      </div>

      {/* Land Grid */}
      {filteredAndSortedLands.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="font-medium">No land records found</p>
              <p className="text-sm">Try adjusting your search criteria or add a new land record</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedLands.map((land) => (
            <Card key={land.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">
                      {land.address.street}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {land.address.city}, {land.address.state} {land.address.zipCode}
                    </p>
                  </div>
                  <Badge className={getStatusColor(land.status)}>
                    {land.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Image */}
                {land.images && land.images.length > 0 && (
                  <div className="aspect-video rounded-md overflow-hidden bg-muted">
                    <img
                      src={land.images[0]}
                      alt={`${land.address.street} land`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Description */}
                {land.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {land.description}
                  </p>
                )}

                {/* Key Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="font-medium">${land.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Ruler className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{land.size} {land.sizeUnit}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Zoning:</span> {land.zoning}
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Price per {land.sizeUnit.slice(0, -1)}:</span> ${getPricePerUnit(land).toLocaleString()}
                  </div>
                </div>

                {/* Features */}
                {land.features && land.features.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {land.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {land.features.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{land.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Link to={`/land/${land.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </Link>
                  <Link to={`/land/${land.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
export default LandList;