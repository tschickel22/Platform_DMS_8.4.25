import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, Trash2, MapPin, Ruler, DollarSign } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function LandList({ lands, onDelete }) {
  const { toast } = useToast()

  const handleDelete = async (land) => {
    if (window.confirm(`Are you sure you want to delete "${land.name}"?`)) {
      try {
        await onDelete(land.id)
      } catch (error) {
        console.error('Error deleting land:', error)
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'sold':
        return 'bg-red-100 text-red-800'
      case 'reserved':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Residential':
        return 'bg-blue-100 text-blue-800'
      case 'Commercial':
        return 'bg-purple-100 text-purple-800'
      case 'Agricultural':
        return 'bg-green-100 text-green-800'
      case 'Industrial':
        return 'bg-orange-100 text-orange-800'
      case 'Mixed Use':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!lands || lands.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No land parcels found</h3>
        <p className="text-sm text-muted-foreground">
          Get started by adding your first land parcel to the inventory.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {lands.map((land) => (
        <Card key={land.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{land.name}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  {land.location}
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/land/edit/${land.id}`}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(land)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Badge className={getStatusColor(land.status)}>
                {land.status}
              </Badge>
              <Badge className={getTypeColor(land.type)}>
                {land.type}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <Ruler className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{land.size} acres</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>${land.price?.toLocaleString()}</span>
              </div>
            </div>

            {land.zoning && (
              <div className="text-sm">
                <span className="font-medium">Zoning:</span> {land.zoning}
              </div>
            )}

            {land.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {land.description}
              </p>
            )}

            {land.amenities && land.amenities.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Amenities:</div>
                <div className="flex flex-wrap gap-1">
                  {land.amenities.slice(0, 3).map((amenity, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {land.amenities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{land.amenities.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground pt-2 border-t">
              Updated: {new Date(land.updatedAt).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}