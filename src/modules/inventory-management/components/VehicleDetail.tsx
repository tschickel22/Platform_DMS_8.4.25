import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, ArrowLeft, MapPin, Calendar, Package } from 'lucide-react'
import { useInventoryManagement } from '../hooks/useInventoryManagement'
import { formatCurrency, formatDate } from '@/lib/utils'
import { EmptyState } from '@/components/ui/empty-state'

export default function VehicleDetail() {
  const { inventoryId } = useParams<{ inventoryId: string }>()
  const navigate = useNavigate()
  const { getVehicleById, loading } = useInventoryManagement()

  const vehicle = inventoryId ? getVehicleById(inventoryId) : null

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/inventory')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
        </div>
        <EmptyState
          title="Vehicle Not Found"
          description="The vehicle you're looking for could not be found."
          icon={<Package className="h-12 w-12" />}
          action={{
            label: "Back to Inventory",
            onClick: () => navigate('/inventory')
          }}
        />
      </div>
    )
  }

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/inventory')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            <p className="text-muted-foreground">
              Inventory ID: {vehicle.inventoryId}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(`/inventory/${vehicle.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Vehicle Details Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Year</label>
                <p className="text-sm">{vehicle.year}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Make</label>
                <p className="text-sm">{vehicle.make}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Model</label>
                <p className="text-sm">{vehicle.model}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Condition</label>
                <p className="text-sm capitalize">{vehicle.condition}</p>
              </div>
              {vehicle.vin && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">VIN</label>
                  <p className="text-sm font-mono">{vehicle.vin}</p>
                </div>
              )}
              {vehicle.serialNumber && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Serial Number</label>
                  <p className="text-sm font-mono">{vehicle.serialNumber}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Status */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {vehicle.salePrice && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Sale Price</label>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(vehicle.salePrice)}
                  </p>
                </div>
              )}
              {vehicle.rentPrice && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Rent Price</label>
                  <p className="text-lg font-semibold text-blue-600">
                    {formatCurrency(vehicle.rentPrice)}/mo
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <Badge className={getStatusColor(vehicle.status)}>
                  {vehicle.status}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Offer Type</label>
                <p className="text-sm capitalize">{vehicle.offerType.replace('_', ' ')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {vehicle.listingType === 'rv' ? (
                <>
                  {vehicle.sleeps && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Sleeps</label>
                      <p className="text-sm">{vehicle.sleeps}</p>
                    </div>
                  )}
                  {vehicle.length && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Length</label>
                      <p className="text-sm">{vehicle.length} ft</p>
                    </div>
                  )}
                  {vehicle.slides && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Slides</label>
                      <p className="text-sm">{vehicle.slides}</p>
                    </div>
                  )}
                </>
              ) : (
                <>
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
                  {vehicle.dimensions?.sqft && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Square Feet</label>
                      <p className="text-sm">{vehicle.dimensions.sqft.toLocaleString()} sq ft</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        {vehicle.location && (
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {vehicle.location.city}, {vehicle.location.state}
                    {vehicle.location.postalCode && ` ${vehicle.location.postalCode}`}
                  </span>
                </div>
                {vehicle.location.communityName && (
                  <p className="text-sm text-muted-foreground">
                    {vehicle.location.communityName}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Description */}
      {vehicle.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{vehicle.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Photos */}
      {vehicle.media?.photos && vehicle.media.photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {vehicle.media.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`${vehicle.make} ${vehicle.model} - Photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <p className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(vehicle.createdAt)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
              <p className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(vehicle.updatedAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}