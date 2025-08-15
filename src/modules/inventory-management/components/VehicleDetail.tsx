import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Edit, 
  Download, 
  Package,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react'
import { useInventoryManagement } from '../hooks/useInventoryManagement'
import { formatCurrency, formatDate } from '@/lib/utils'

export function VehicleDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getVehicle } = useInventoryManagement()

  const vehicle = id ? getVehicle(id) : null

  if (!vehicle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/inventory')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Vehicle Not Found</h3>
            <p className="text-muted-foreground text-center">
              The requested vehicle could not be found in inventory
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

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

  const getTypeDisplay = () => {
    if (vehicle.listingType === 'rv') {
      return `${vehicle.year} ${vehicle.make} ${vehicle.model}`
    }
    return `${vehicle.year} ${vehicle.make} ${vehicle.model}`
  }

  const getPriceDisplay = () => {
    if (vehicle.offerType === 'both') {
      return `${formatCurrency(vehicle.salePrice || 0)} / ${formatCurrency(vehicle.rentPrice || 0)}/mo`
    }
    if (vehicle.offerType === 'for_rent') {
      return `${formatCurrency(vehicle.rentPrice || 0)}/mo`
    }
    return formatCurrency(vehicle.salePrice || 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/inventory')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{getTypeDisplay()}</h1>
            <p className="text-muted-foreground">
              Inventory ID: {vehicle.inventoryId}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/inventory/edit/${vehicle.id}`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <img
                  src={vehicle.media?.primaryPhoto || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={getTypeDisplay()}
                  className="w-full h-full object-cover"
                />
              </div>
              {vehicle.media?.photos && vehicle.media.photos.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {vehicle.media.photos.slice(1, 5).map((photo, index) => (
                    <div key={index} className="aspect-video relative overflow-hidden rounded">
                      <img
                        src={photo}
                        alt={`Photo ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          {vehicle.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {vehicle.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          {vehicle.features && Object.keys(vehicle.features).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(vehicle.features)
                    .filter(([_, value]) => value)
                    .map(([feature, _]) => (
                      <Badge key={feature} variant="secondary" className="justify-center">
                        {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Status & Pricing
                <Badge className={getStatusColor(vehicle.status)}>
                  {vehicle.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Price</span>
                <span className="font-bold text-lg">{getPriceDisplay()}</span>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Offer Type</span>
                  <span className="text-sm font-medium">
                    {vehicle.offerType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Condition</span>
                  <span className="text-sm font-medium capitalize">{vehicle.condition}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Details */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Year</span>
                <span className="text-sm font-medium">{vehicle.year}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Make</span>
                <span className="text-sm font-medium">{vehicle.make}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Model</span>
                <span className="text-sm font-medium">{vehicle.model}</span>
              </div>
              
              {vehicle.vin && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">VIN</span>
                  <span className="text-sm font-medium font-mono">{vehicle.vin}</span>
                </div>
              )}
              
              {vehicle.serialNumber && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Serial</span>
                  <span className="text-sm font-medium font-mono">{vehicle.serialNumber}</span>
                </div>
              )}

              <Separator />

              {vehicle.listingType === 'rv' ? (
                <>
                  {vehicle.sleeps && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sleeps</span>
                      <span className="text-sm font-medium">{vehicle.sleeps}</span>
                    </div>
                  )}
                  
                  {vehicle.length && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Length</span>
                      <span className="text-sm font-medium">{vehicle.length} ft</span>
                    </div>
                  )}
                  
                  {vehicle.slides !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Slides</span>
                      <span className="text-sm font-medium">{vehicle.slides}</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {vehicle.bedrooms !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Bedrooms</span>
                      <span className="text-sm font-medium">{vehicle.bedrooms}</span>
                    </div>
                  )}
                  
                  {vehicle.bathrooms !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Bathrooms</span>
                      <span className="text-sm font-medium">{vehicle.bathrooms}</span>
                    </div>
                  )}
                  
                  {vehicle.dimensions?.squareFeet && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Square Feet</span>
                      <span className="text-sm font-medium">{vehicle.dimensions.squareFeet}</span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <div className="font-medium">{vehicle.location.city}, {vehicle.location.state}</div>
                {vehicle.location.postalCode && (
                  <div className="text-muted-foreground">{vehicle.location.postalCode}</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Record Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium">{formatDate(vehicle.createdAt)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Updated</span>
                <span className="text-sm font-medium">{formatDate(vehicle.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}