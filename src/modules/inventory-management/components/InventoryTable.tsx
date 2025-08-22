import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit, Eye, Trash2, MapPin } from 'lucide-react'
import { Vehicle } from '../types'
import { formatCurrency } from '@/lib/utils'

interface InventoryTableProps {
  vehicles: Vehicle[]
  onEdit: (vehicleId: string) => void
  onView: (vehicleId: string) => void
  onDelete: (vehicleId: string) => void
}

export default function InventoryTable({ vehicles, onEdit, onView, onDelete }: InventoryTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'sold':
        return 'bg-blue-100 text-blue-800'
      case 'service':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  {vehicle.media?.primaryPhoto && (
                    <img 
                      src={vehicle.media.primaryPhoto} 
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  )}
                  <div>
                    <div className="font-medium">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ID: {vehicle.inventoryId}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {vehicle.listingType === 'rv' ? 'RV' : 'Manufactured Home'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={`text-xs ${getStatusColor(vehicle.status)}`}>
                  {vehicle.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div>
                  {vehicle.salePrice && (
                    <div className="font-medium text-green-600">
                      {formatCurrency(vehicle.salePrice)}
                    </div>
                  )}
                  {vehicle.rentPrice && (
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(vehicle.rentPrice)}/mo
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {vehicle.location && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {vehicle.location.city}, {vehicle.location.state}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(vehicle.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(vehicle.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(vehicle.id)}
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
  )
}