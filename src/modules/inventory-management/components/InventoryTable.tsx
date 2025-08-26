import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  Edit, 
  Eye, 
  Trash2, 
  MoreHorizontal,
  Package,
  Home,
  Truck,
  Calendar
} from 'lucide-react'
import { Vehicle, VehicleStatus } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface InventoryTableProps {
  vehicles: Vehicle[]
  onEdit: (vehicle: Vehicle) => void
  onView: (vehicle: Vehicle) => void
  onStatusChange: (vehicleId: string, status: VehicleStatus) => void
  onCreateTask: (vehicle: Vehicle) => void
  onDelete?: (vehicleId: string) => void
}

export function InventoryTable({ 
  vehicles, 
  onEdit, 
  onView, 
  onStatusChange, 
  onCreateTask,
  onDelete
}: InventoryTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof Vehicle>('year')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.year.toString().includes(searchTerm)
  )

  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    }
    
    return 0
  })

  const handleSort = (field: keyof Vehicle) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getVehicleTypeIcon = (vehicle: Vehicle) => {
    const mhTypes = ['single_wide', 'double_wide', 'triple_wide', 'modular_home', 'park_model']
    return mhTypes.includes(vehicle.type.toLowerCase()) ? 
      <Home className="h-4 w-4 text-emerald-600" /> : 
      <Truck className="h-4 w-4 text-cyan-600" />
  }

  const getVehicleTypeLabel = (vehicle: Vehicle) => {
    const mhTypes = ['single_wide', 'double_wide', 'triple_wide', 'modular_home', 'park_model']
    return mhTypes.includes(vehicle.type.toLowerCase()) ? 'MH' : 'RV'
  }

  const getStatusBadge = (status: VehicleStatus) => {
    const variants = {
      available: 'default',
      reserved: 'secondary',
      sold: 'outline',
      service: 'destructive',
      delivered: 'outline'
    } as const
    
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (vehicles.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No vehicles in inventory</h3>
          <p className="text-muted-foreground text-center mb-6">
            Get started by adding your first vehicle to the inventory
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Inventory ({vehicles.length} vehicles)</CardTitle>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('year')}
                >
                  Year {sortField === 'year' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('make')}
                >
                  Make {sortField === 'make' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('model')}
                >
                  Model {sortField === 'model' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>VIN</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('status')}
                >
                  Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('price')}
                >
                  Price {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedVehicles.map((vehicle) => (
                <TableRow key={vehicle.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getVehicleTypeIcon(vehicle)}
                      <span className="text-xs font-medium">{getVehicleTypeLabel(vehicle)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{vehicle.year}</TableCell>
                  <TableCell>{vehicle.make}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell className="font-mono text-sm">{vehicle.vin}</TableCell>
                  <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                  <TableCell>{formatCurrency(vehicle.price || 0)}</TableCell>
                  <TableCell>{vehicle.location}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(vehicle)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(vehicle)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Vehicle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onCreateTask(vehicle)}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Create Task
                        </DropdownMenuItem>
                        {onDelete && (
                          <DropdownMenuItem 
                            onClick={() => onDelete(vehicle.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Vehicle
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default InventoryTable