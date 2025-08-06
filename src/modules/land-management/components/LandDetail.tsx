import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Edit, MapPin, Ruler, DollarSign, Calendar, Tag } from 'lucide-react'

export function LandDetail({ land, onEdit, onBack }) {
  if (!land) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Land parcel not found</p>
      </div>
    )
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{land.name}</h1>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {land.location}
            </div>
          </div>
        </div>
        <Button onClick={() => onEdit(land)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Land Details</CardTitle>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Ruler className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{land.size} acres</div>
                    <div className="text-sm text-muted-foreground">Size</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <div className="font-medium">${land.price?.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Price</div>
                  </div>
                </div>
              </div>

              {land.zoning && (
                <div className="flex items-center">
                  <Tag className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{land.zoning}</div>
                    <div className="text-sm text-muted-foreground">Zoning</div>
                  </div>
                </div>
              )}

              <Separator />

              {land.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">{land.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {land.amenities && land.amenities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {land.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                <div>
                  <div className="font-medium">Created</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(land.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                <div>
                  <div className="font-medium">Last Updated</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(land.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}