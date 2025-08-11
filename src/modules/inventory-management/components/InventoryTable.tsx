import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface Vehicle {
  id: string
  type: string
  subType?: string
  make: string
  model: string
  year: number
  vin: string
  price: number
  status: string
  mileage?: number
  location: string
  features: string[]
  description: string
}

interface InventoryTableProps {
  vehicles: Vehicle[]
  onEdit: (vehicle: Vehicle) => void
  onDelete: (vehicleId: string) => void
  onView: (vehicle: Vehicle) => void
  onStatusChange: (vehicleId: string, status: string) => void
  onSplit?: (vehicleId: string) => void
}

export default function InventoryTable({
  vehicles,
  onEdit,
  onDelete,
  onView,
  onStatusChange,
  onSplit
}: InventoryTableProps) {
  const { toast } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800'
      case 'Sold':
        return 'bg-blue-100 text-blue-800'
      case 'Reserved':
        return 'bg-yellow-100 text-yellow-800'
      case 'Service':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDelete = (vehicleId: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      onDelete(vehicleId)
    }
  }

  const handleStatusChange = (vehicleId: string, newStatus: string) => {
    onStatusChange(vehicleId, newStatus)
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No vehicles found</p>
        <p className="text-sm">Add your first vehicle to get started</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>VIN</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </div>
                  {vehicle.subType && (
                    <div className="text-sm text-muted-foreground">
                      {vehicle.subType}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {vehicle.type}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {vehicle.vin}
              </TableCell>
              <TableCell className="font-medium">
                {formatCurrency(vehicle.price)}
              </TableCell>
              <TableCell>
                <select
                  value={vehicle.status}
                  onChange={(e) => handleStatusChange(vehicle.id, e.target.value)}
                  className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(vehicle.status)}`}
                >
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Service">In Service</option>
                </select>
              </TableCell>
              <TableCell>{vehicle.location}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(vehicle)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(vehicle)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(vehicle.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {onSplit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSplit(vehicle.id)}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}