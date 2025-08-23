import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Edit, MapPin, Calendar, DollarSign, Package, Wrench } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface VehicleDetailProps {
  vehicle: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (vehicle: any) => void
}

export default function VehicleDetail({ vehicle, open, onOpenChange, onEdit }: VehicleDetailProps) {
  if (!vehicle) return null

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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

  const getVehicleInfo = () => {
    const year = vehicle.year || vehicle.modelDate || ''
    const make = vehicle.make || vehicle.brand || ''
    const model = vehicle.model || ''
    return `${year} ${make} ${model}`.trim()
  }

  const getPrice = () => {
    return vehicle.price || vehicle.salePrice || vehicle.askingPrice || 0
  }

  const getIdentifier = () => {
    return vehicle.vin || vehicle.vehicleIdentificationNumber || vehicle.serialNumber || 'N/A'
  }

  const isRV = vehicle.type === 'rv' || vehicle.listingType === 'rv'
  const isMH = vehicle.type === 'manufactured_home' || vehicle.listingType === 'manufactured_home'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{getVehicleInfo()}</DialogTitle>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(vehicle)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Primary Image */}
          {vehicle.media?.primaryPhoto && (
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <img 
                src={vehicle.media.primaryPhoto} 
                alt={getVehicleInfo()}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <p className="text-sm">{vehicle.type || vehicle.listingType || 'Unknown'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge className={getStatusColor(vehicle.status)}>
                    {vehicle.status || 'Unknown'}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {isRV ? 'VIN' : 'Serial Number'}
                </label>
                <p className="text-sm font-mono">{getIdentifier()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Condition</label>
                <p className="text-sm">{vehicle.condition || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Inventory ID</label>
                <p className="text-sm">{vehicle.inventoryId || vehicle.stockNumber || vehicle.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="text-sm">{formatDate(vehicle.createdAt || new Date())}</p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Sale Price</label>
                <p className="text-lg font-semibold">{formatCurrency(getPrice())}</p>
              </div>
              {vehicle.rentPrice && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Rent Price</label>
                  <p className="text-lg font-semibold">{formatCurrency(vehicle.rentPrice)}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Offer Type</label>
                <p className="text-sm">{vehicle.offerType || 'For Sale'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Specifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isRV ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vehicle.sleeps && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Sleeps</label>
                      <p className="text-sm">{vehicle.sleeps}</p>
                    </div>
                  )}
                  {vehicle.slides !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Slides</label>
                      <p className="text-sm">{vehicle.slides}</p>
                    </div>
                  )}
                  {vehicle.length && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Length</label>
                      <p className="text-sm">{vehicle.length} ft</p>
                    </div>
                  )}
                  {vehicle.fuelType && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Fuel Type</label>
                      <p className="text-sm">{vehicle.fuelType}</p>
                    </div>
                  )}
                  {vehicle.engine && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Engine</label>
                      <p className="text-sm">{vehicle.engine}</p>
                    </div>
                  )}
                  {vehicle.transmission && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Transmission</label>
                      <p className="text-sm">{vehicle.transmission}</p>
                    </div>
                  )}
                  {vehicle.odometerMiles && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Odometer</label>
                      <p className="text-sm">{vehicle.odometerMiles.toLocaleString()} miles</p>
                    </div>
                  )}
                </div>
              ) : isMH ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vehicle.bedrooms && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Bedrooms</label>
                      <p className="text-sm">{vehicle.bedrooms}</p>
                    </div>
                  )}
                  {vehicle.bathrooms && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Bathrooms</label>
                      <p className="text-sm">{vehicle.bathrooms}</p>
                    </div>
                  )}
                  {vehicle.dimensions?.squareFootage && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Square Feet</label>
                      <p className="text-sm">{vehicle.dimensions.squareFootage.toLocaleString()} sq ft</p>
                    </div>
                  )}
                  {vehicle.dimensions?.width_ft && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Width</label>
                      <p className="text-sm">{vehicle.dimensions.width_ft} ft</p>
                    </div>
                  )}
                  {vehicle.dimensions?.length_ft && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Length</label>
                      <p className="text-sm">{vehicle.dimensions.length_ft} ft</p>
                    </div>
                  )}
                  {vehicle.dimensions?.sections && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Sections</label>
                      <p className="text-sm">{vehicle.dimensions.sections}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No specifications available</p>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          {vehicle.location && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">City</label>
                  <p className="text-sm">{vehicle.location.city || vehicle.city || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">State</label>
                  <p className="text-sm">{vehicle.location.state || vehicle.state || 'N/A'}</p>
                </div>
                {vehicle.location.postalCode && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Postal Code</label>
                    <p className="text-sm">{vehicle.location.postalCode}</p>
                  </div>
                )}
                {vehicle.location.communityName && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Community</label>
                    <p className="text-sm">{vehicle.location.communityName}</p>
                  </div>
                )}
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
                  {Object.entries(vehicle.features).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <CheckSquare className={`h-4 w-4 ${value ? 'text-green-600' : 'text-gray-400'}`} />
                      <span className="text-sm capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {vehicle.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {vehicle.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Additional Photos */}
          {vehicle.media?.photos && vehicle.media.photos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {vehicle.media.photos.map((photo: string, index: number) => (
                    <div key={index} className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <img 
                        src={photo} 
                        alt={`${getVehicleInfo()} - Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}