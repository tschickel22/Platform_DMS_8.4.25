import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2, MapPin, DollarSign, Calendar } from 'lucide-react'
import { useLandManagement } from '../hooks/useLandManagement'
import { useToast } from '@/hooks/use-toast'

export default function LandDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getLandById, deleteLand } = useLandManagement()
  const { toast } = useToast()

  const land = id ? getLandById(id) : null

  if (!land) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/land">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">Land parcel not found</h3>
              <p className="text-muted-foreground mb-4">
                The requested land parcel could not be found.
              </p>
              <Button asChild>
                <Link to="/land">Back to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${land.name}"?`)) {
      try {
        await deleteLand(land.id)
        toast({
          title: "Success",
          description: `${land.name} has been deleted successfully.`,
        })
        navigate('/land')
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
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/land">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold">{land.name}</h1>
              <Badge variant={
                land.status === 'available' ? 'default' :
                land.status === 'pending' ? 'secondary' :
                land.status === 'sold' ? 'destructive' : 'outline'
              }>
                {land.status}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center">
              <MapPin className="mr-1 h-4 w-4" />
              {land.location}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link to={`/land/edit/${land.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="text-2xl font-bold">{land.size}</p>
                  <p className="text-sm text-muted-foreground">acres</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-2xl font-bold">${land.price.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">total</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Per Acre</p>
                  <p className="text-2xl font-bold">${Math.round(land.price / land.size).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">per acre</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="text-2xl font-bold">{land.type}</p>
                  <p className="text-sm text-muted-foreground">category</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {land.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {land.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Amenities */}
          {land.amenities && land.amenities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Amenities & Features</CardTitle>
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

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {land.zoning && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Zoning</p>
                    <p>{land.zoning}</p>
                  </div>
                )}
                {land.utilities && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Utilities</p>
                    <p>{land.utilities}</p>
                  </div>
                )}
                {land.access && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Access</p>
                    <p>{land.access}</p>
                  </div>
                )}
                {land.soilType && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Soil Type</p>
                    <p>{land.soilType}</p>
                  </div>
                )}
                {land.waterRights && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Water Rights</p>
                    <p>{land.waterRights}</p>
                  </div>
                )}
              </div>
              {land.restrictions && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Restrictions</p>
                  <p className="text-muted-foreground">{land.restrictions}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link to={`/land/edit/${land.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Details
                </Link>
              </Button>
              <Button variant="outline" className="w-full">
                <DollarSign className="mr-2 h-4 w-4" />
                Generate Quote
              </Button>
              <Button variant="outline" className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Viewing
              </Button>
              <Button variant="destructive" className="w-full" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Parcel
              </Button>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Land Added</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(land.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {land.updatedAt && land.updatedAt !== land.createdAt && (
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 bg-muted rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(land.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}