import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  Edit, 
  Share, 
  Download, 
  Eye,
  MapPin,
  Calendar,
  DollarSign,
  Home,
  Car,
  ExternalLink,
  Trash2
} from 'lucide-react'
import { VehicleInventory } from '../types'
import { useInventoryManagement } from '../hooks/useInventoryManagement'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export default function VehicleDetail() {
  const { inventoryId } = useParams<{ inventoryId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { inventory, loading, deleteVehicle } = useInventoryManagement()
  
  const [vehicle, setVehicle] = useState<VehicleInventory | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<string>('')

  useEffect(() => {
    if (inventoryId && inventory.length > 0) {
      const found = inventory.find(v => v.id === inventoryId)
      setVehicle(found || null)
      setSelectedPhoto(found?.media.primaryPhoto || '')
    }
  }, [inventoryId, inventory])

  const handleEdit = () => {
    navigate(`/inventory/${inventoryId}/edit`)
  }

  const handleDelete = async () => {
    if (!vehicle) return
    
    if (confirm('Are you sure you want to delete this inventory item? This action cannot be undone.')) {
      try {
        await deleteVehicle(vehicle.id)
        toast({
          title: 'Success',
          description: 'Inventory item deleted successfully'
        })
        navigate('/inventory')
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete inventory item',
          variant: 'destructive'
        })
      }
    }
  }

  const handleShare = () => {
    if (!vehicle) return
    const url = `${window.location.origin}/public/demo/listing/${vehicle.id}`
    navigator.clipboard.writeText(url)
    toast({
      title: 'Link Copied',
      description: 'Public listing URL copied to clipboard'
    })
  }

  const handleCreateListing = () => {
    if (!vehicle) return
    navigate(`/property/listings/new?inventoryId=${vehicle.id}`)
  }

  const handlePreview = () => {
    if (!vehicle) return
    const url = `${window.location.origin}/public/demo/listing/${vehicle.id}`
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading inventory item...</p>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Inventory Item Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The inventory item you're looking for could not be found.
            </p>
            <Button onClick={() => navigate('/inventory')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inventory
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const TypeIcon = vehicle.listingType === 'rv' ? Car : Home

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/inventory')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inventory
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TypeIcon className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-2xl font-bold">{vehicle.title}</h1>
                <Badge className={getStatusColor(vehicle.status)}>
                  {vehicle.status}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {vehicle.inventoryId} • {vehicle.year} {vehicle.make} {vehicle.model}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" onClick={handleCreateListing}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Create Listing
            </Button>
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Gallery */}
            <Card>
              <CardContent className="p-0">
                {/* Main Photo */}
                <div className="h-96 bg-gray-100">
                  {selectedPhoto ? (
                    <img
                      src={selectedPhoto}
                      alt={vehicle.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <TypeIcon className="h-24 w-24 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                {/* Photo Thumbnails */}
                {vehicle.media.photos.length > 1 && (
                  <div className="p-4 border-t">
                    <div className="flex gap-2 overflow-x-auto">
                      {vehicle.media.photos.map((photo, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedPhoto(photo)}
                          className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                            selectedPhoto === photo ? 'border-primary' : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description & Details */}
            <Tabs defaultValue="description" className="space-y-4">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
              </TabsList>

              <TabsContent value="description">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {vehicle.description || 'No description available.'}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Year</Label>
                        <p>{vehicle.year}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Make</Label>
                        <p>{vehicle.make}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Model</Label>
                        <p>{vehicle.model}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Condition</Label>
                        <p className="capitalize">{vehicle.condition}</p>
                      </div>
                      {vehicle.vin && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">VIN</Label>
                          <p className="font-mono text-sm">{vehicle.vin}</p>
                        </div>
                      )}
                      
                      {vehicle.listingType === 'rv' && (
                        <>
                          {vehicle.sleeps && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Sleeps</Label>
                              <p>{vehicle.sleeps}</p>
                            </div>
                          )}
                          {vehicle.length && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Length</Label>
                              <p>{vehicle.length} ft</p>
                            </div>
                          )}
                          {vehicle.slides && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Slide Outs</Label>
                              <p>{vehicle.slides}</p>
                            </div>
                          )}
                        </>
                      )}
                      
                      {vehicle.listingType === 'manufactured_home' && (
                        <>
                          {vehicle.bedrooms && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Bedrooms</Label>
                              <p>{vehicle.bedrooms}</p>
                            </div>
                          )}
                          {vehicle.bathrooms && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Bathrooms</Label>
                              <p>{vehicle.bathrooms}</p>
                            </div>
                          )}
                          {vehicle.dimensions?.sqft && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Square Feet</Label>
                              <p>{vehicle.dimensions.sqft}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features">
                <Card>
                  <CardHeader>
                    <CardTitle>Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {Object.keys(vehicle.features).length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(vehicle.features).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                            <span className="text-sm text-muted-foreground">
                              {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No features listed.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {vehicle.salePrice && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Sale Price</Label>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(vehicle.salePrice)}
                    </p>
                  </div>
                )}
                {vehicle.rentPrice && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Rent Price</Label>
                    <p className="text-xl font-semibold">
                      {formatCurrency(vehicle.rentPrice)}/month
                    </p>
                  </div>
                )}
                {vehicle.cost && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Cost</Label>
                    <p>{formatCurrency(vehicle.cost)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>{vehicle.location.city}, {vehicle.location.state}</p>
                {vehicle.location.postalCode && (
                  <p className="text-sm text-muted-foreground">{vehicle.location.postalCode}</p>
                )}
              </CardContent>
            </Card>

            {/* Inventory Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Inventory Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Inventory ID</Label>
                  <p className="font-mono text-sm">{vehicle.inventoryId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                  <p>{formatDate(vehicle.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                  <p>{formatDate(vehicle.updatedAt)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                  <p className="capitalize">{vehicle.listingType.replace('_', ' ')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Offer Type</Label>
                  <p className="capitalize">{vehicle.offerType.replace('_', ' ')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Inventory
                </Button>
                <Button variant="outline" className="w-full" onClick={handleCreateListing}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Create Public Listing
                </Button>
                <Button variant="outline" className="w-full" onClick={handlePreview}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Public View
                </Button>
                <Button variant="outline" className="w-full" onClick={handleShare}>
                  <Share className="h-4 w-4 mr-2" />
                  Share Listing
                </Button>
                <Button variant="destructive" className="w-full" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Inventory
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to get status color
function getStatusColor(status: string) {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'sold':
      return 'bg-blue-100 text-blue-800'
    case 'reserved':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}