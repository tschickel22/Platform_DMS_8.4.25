import React from 'react'
import { Vehicle, RVVehicle, MHVehicle } from '../state/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/select'

interface InventoryTableProps {
  vehicles: Vehicle[]
  onView: (vehicle: Vehicle) => void
  onEdit: (vehicle: Vehicle) => void
  onDelete: (vehicle: Vehicle) => void
  onStatusChange: (vehicle: Vehicle, newStatus: Vehicle['status']) => void
}

const getStatusColor = (status: Vehicle['status']) => {
  switch (status) {
    case 'Available':
      return 'bg-green-100 text-green-800 hover:bg-green-200'
    case 'Reserved':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
    case 'Sold':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
    case 'Pending':
      return 'bg-orange-100 text-orange-800 hover:bg-orange-200'
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
  }
}

const formatPrice = (vehicle: Vehicle): string => {
  if (vehicle.type === 'RV') {
    return `$${vehicle.price?.toLocaleString() || '0'}`
  } else if (vehicle.type === 'MH') {
    return `$${vehicle.askingPrice?.toLocaleString() || '0'}`
  }
  return '$0'
}

const getVehicleTitle = (vehicle: Vehicle): string => {
  if (vehicle.type === 'RV') {
    const rv = vehicle as RVVehicle
    return `${rv.modelDate || ''} ${rv.brand || ''} ${rv.model || ''}`.trim()
  } else if (vehicle.type === 'MH') {
    const mh = vehicle as MHVehicle
    return `${mh.year || ''} ${mh.make || ''} ${mh.model || ''}`.trim()
  }
  return 'Unknown Vehicle'
}

const getVehicleSubtitle = (vehicle: Vehicle): string => {
  if (vehicle.type === 'RV') {
    const rv = vehicle as RVVehicle
    return [rv.bodyStyle, rv.vehicleIdentificationNumber].filter(Boolean).join(' • ')
  } else if (vehicle.type === 'MH') {
    const mh = vehicle as MHVehicle
    return [mh.homeType, `${mh.bedrooms}BR/${mh.bathrooms}BA`].filter(Boolean).join(' • ')
  }
  return ''
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  vehicles,
  onView,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  if (!Array.isArray(vehicles) || vehicles.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium">No vehicles found</p>
            <p className="text-sm">Add your first vehicle to get started</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory ({vehicles.length})</CardTitle>
        <CardDescription>
          Manage your RV and manufactured home inventory
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{getVehicleTitle(vehicle)}</div>
                      <div className="text-sm text-muted-foreground">
                        {getVehicleSubtitle(vehicle)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {vehicle.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(vehicle)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(vehicle.status)}>
                      {vehicle.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {vehicle.type === 'MH' ? 
                      `${(vehicle as MHVehicle).city}, ${(vehicle as MHVehicle).state}` : 
                      'Mobile'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
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
                        onClick={() => onDelete(vehicle)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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