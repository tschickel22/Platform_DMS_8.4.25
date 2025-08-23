import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
  Plus,
  CheckSquare,
  Package // 🛠️ FIX: this was missing and caused the runtime error
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface InventoryTableProps {
  vehicles: any[]
  onEdit: (vehicle: any) => void
  onView: (vehicle: any) => void
  onStatusChange: (vehicleId: string, status: string) => void
  onCreateTask: (vehicle: any) => void
  onDelete: (vehicleId: string) => void
}

export function InventoryTable({
  vehicles,
  onEdit,
  onView,
  onStatusChange, // currently unused in UI; kept for future status actions
  onCreateTask,
  onDelete
}: InventoryTableProps) {
  const getStatusColor = (status: string) => {
    switch ((status || '').toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800'
      case 'sold':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getVehicleInfo = (vehicle: any) => {
    const year = vehicle.year || vehicle.modelDate || ''
    const make = vehicle.make || vehicle.brand || ''
    const model = vehicle.model || ''
    return `${year} ${make} ${model}`.trim()
  }

  const getPrice = (vehicle: any) =>
    vehicle.price ?? vehicle.salePrice ?? vehicle.askingPrice ?? 0

  const getIdentifier = (vehicle: any) =>
    vehicle.vin || vehicle.vehicleIdentificationNumber || vehicle.serialNumber || 'N/A'

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <p className="text-lg font-medium mb-2">No inventory found</p>
        <p>Add your first home or RV to get started</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle Info</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>VIN/Serial</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle, i) => (
            <TableRow key={vehicle.id ?? i}>
              <TableCell>
                <div className="font-medium">{getVehicleInfo(vehicle)}</div>
                <div className="text-sm text-muted-foreground">
                  {vehicle.inventoryId || vehicle.stockNumber || `ID: ${vehicle.id}`}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {vehicle.type || vehicle.listingType || 'Unknown'}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {getIdentifier(vehicle)}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(vehicle.status)}>
                  {vehicle.status || 'Unknown'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {formatCurrency(getPrice(vehicle))}
                </div>
                {vehicle.rentPrice && (
                  <div className="text-sm text-muted-foreground">
                    Rent: {formatCurrency(vehicle.rentPrice)}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(vehicle)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(vehicle)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCreateTask(vehicle)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Task
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(String(vehicle.id))}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
