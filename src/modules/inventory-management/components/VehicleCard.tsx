import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { Vehicle } from '../types'
import { formatCurrency } from '@/lib/utils'

interface VehicleCardProps {
  vehicle: Vehicle
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function VehicleCard({ vehicle, onView, onEdit, onDelete }: VehicleCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800'
      case 'sold':
        return 'bg-blue-100 text-blue-800'
      case 'service':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeDisplay = (vehicle: Vehicle) => {
    if (vehicle.listingType === 'rv') {
      return `${vehicle.year} ${vehicle.make} ${vehicle.model}`
    }
    return `${vehicle.year} ${vehicle.make} ${vehicle.model} - ${vehicle.bedrooms}BR/${vehicle.bathrooms}BA`
  }

  const getPriceDisplay = (vehicle: Vehicle) => {
    if (vehicle.offerType === 'both') {
      return `${formatCurrency(vehicle.salePrice || 0)} / ${formatCurrency(vehicle.rentPrice || 0)}/mo`
    }
    if (vehicle.offerType === 'for_rent') {
      return `${formatCurrency(vehicle.rentPrice || 0)}/mo`
    }
    return formatCurrency(vehicle.salePrice || 0)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <img
          src={vehicle.media?.primaryPhoto || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400'}
          alt={getTypeDisplay(vehicle)}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className={getStatusColor(vehicle.status)}>
            {vehicle.status}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-tight">
            {getTypeDisplay(vehicle)}
          </h3>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {vehicle.inventoryId}
            </span>
            <span className="font-bold text-primary">
              {getPriceDisplay(vehicle)}
            </span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {vehicle.location.city}, {vehicle.location.state}
          </div>
          
          {vehicle.listingType === 'rv' && (
            <div className="text-sm text-muted-foreground">
              Sleeps {vehicle.sleeps} • {vehicle.length}ft • {vehicle.slides} slides
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onView(vehicle.id)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(vehicle.id)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(vehicle.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}