import React, { useState, lazy, Suspense } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Edit, Trash2, FileText } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// ⚠️ Lazy-load so it cannot run "open on mount" behavior on first paint
const GenerateBrochureModal = lazy(() => import('@/modules/brochures/components/GenerateBrochureModal'))

interface InventoryTableProps {
  vehicles: any[]
  onEdit: (vehicle: any) => void
  onDelete: (vehicleId: string) => void
  onView: (vehicle: any) => void
}

export function InventoryTable({ vehicles, onEdit, onDelete, onView }: InventoryTableProps) {
  const [selectedVehicleForBrochure, setSelectedVehicleForBrochure] = useState<any>(null)
  const [userRequestedBrochure, setUserRequestedBrochure] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'sold':      return 'bg-blue-100 text-blue-800'
      case 'reserved':  return 'bg-yellow-100 text-yellow-800'
      case 'service':   return 'bg-orange-100 text-orange-800'
      default:          return 'bg-gray-100 text-gray-800'
    }
  }

  const handleGenerateBrochure = (vehicle: any) => {
    setSelectedVehicleForBrochure(vehicle)
    setUserRequestedBrochure(true) // ✅ allow modal to mount only after click
  }

  if (!vehicles?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No inventory items found</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle: any) => (
              <TableRow key={vehicle.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    {vehicle.media?.primaryPhoto && (
                      <img
                        src={vehicle.media.primaryPhoto}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <div className="font-medium">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {vehicle.vin || vehicle.serialNumber || 'No VIN/Serial'}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {vehicle.listingType === 'rv' ? 'RV' : 'MH'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {vehicle.salePrice && (
                      <div className="text-sm">Sale: {formatCurrency(vehicle.salePrice)}</div>
                    )}
                    {vehicle.rentPrice && (
                      <div className="text-sm text-muted-foreground">
                        Rent: {formatCurrency(vehicle.rentPrice)}/mo
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(vehicle.status)}>
                    {vehicle.status || 'Unknown'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {vehicle.location?.city && vehicle.location?.state
                      ? `${vehicle.location.city}, ${vehicle.location.state}`
                      : 'Not specified'}
                  </div>
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
                      <DropdownMenuItem onClick={() => handleGenerateBrochure(vehicle)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Brochure
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(vehicle.id)}
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

      {userRequestedBrochure && selectedVehicleForBrochure && (
        <Suspense fallback={<div>Loading brochure generator...</div>}>
          <GenerateBrochureModal
            vehicle={selectedVehicleForBrochure}
            onClose={() => {
              setSelectedVehicleForBrochure(null)
              setUserRequestedBrochure(false)
            }}
          />
        </Suspense>
      )}
    </>
  )
}
