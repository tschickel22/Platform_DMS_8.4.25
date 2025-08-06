import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Edit, Trash2, Eye, Plus, ArrowLeft } from 'lucide-react'
import { useLandManagement } from '../hooks/useLandManagement'
import { useToast } from '@/hooks/use-toast'

export default function LandList() {
  const { lands, deleteLand } = useLandManagement()
  const { toast } = useToast()

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteLand(id)
        toast({
          title: "Success",
          description: `${name} has been deleted successfully.`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete land parcel.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/land">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Land Parcels</h1>
            <p className="text-muted-foreground">
              Manage your land inventory
            </p>
          </div>
        </div>
        <Button asChild>
          <Link to="/land/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Land Parcel
          </Link>
        </Button>
      </div>

      {/* Land Grid */}
      {lands.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lands.map((land) => (
            <Card key={land.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{land.name}</CardTitle>
                  </div>
                  <Badge variant={
                    land.status === 'available' ? 'default' :
                    land.status === 'pending' ? 'secondary' :
                    land.status === 'sold' ? 'destructive' : 'outline'
                  }>
                    {land.status}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {land.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Size</p>
                      <p className="font-medium">{land.size} acres</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-medium">${land.price.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium">{land.type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Per Acre</p>
                      <p className="font-medium">${Math.round(land.price / land.size).toLocaleString()}</p>
                    </div>
                  </div>

                  {land.amenities && land.amenities.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Amenities</p>
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

                  <div className="flex justify-between pt-4 border-t">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/land/detail/${land.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/land/edit/${land.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(land.id, land.name)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">No land parcels yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first land parcel to the inventory
              </p>
              <Button asChild>
                <Link to="/land/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Land Parcel
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}