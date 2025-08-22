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
  ExternalLink
} from 'lucide-react'
import { PropertyListing } from '../types'
import { usePropertyListings } from '../hooks/usePropertyListings'
import { formatCurrency, formatDate } from '@/lib/utils'

// Helper function to get type icon
function getTypeIcon(type: string) {
  return type === 'rv' ? Car : Home
}

// Helper function to get status color
function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'draft':
      return 'bg-yellow-100 text-yellow-800'
    case 'inactive':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function ListingDetail() {
  const { listingId } = useParams<{ listingId: string }>()
  const navigate = useNavigate()
  const { listings, loading } = usePropertyListings()
  
  const [listing, setListing] = useState<PropertyListing | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<string>('')

  useEffect(() => {
    if (listingId && listings.length > 0) {
      const found = listings.find(l => l.id === listingId)
      setListing(found || null)
      setSelectedPhoto(found?.media.primaryPhoto || '')
    }
  }, [listingId, listings])

  const handleEdit = () => {
    navigate(`/property/listings/${listingId}/edit`)
  }

  const handleShare = () => {
    const url = `${window.location.origin}/public/demo/listing/${listingId}`
    navigator.clipboard.writeText(url)
    alert('Listing URL copied to clipboard!')
  }

  const handlePreview = () => {
    const url = `${window.location.origin}/public/demo/listing/${listingId}`
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading listing...</p>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Listing Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The listing you're looking for could not be found.
            </p>
            <Button onClick={() => navigate('/property/listings')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Listings
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const TypeIcon = getTypeIcon(listing.listingType)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/property/listings')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Listings
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TypeIcon className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-2xl font-bold">{listing.title}</h1>
                <Badge className={getStatusColor(listing.status)}>
                  {listing.status}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {listing.year} {listing.make} {listing.model}
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
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
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
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <TypeIcon className="h-24 w-24 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                {/* Photo Thumbnails */}
                {listing.media.photos.length > 1 && (
                  <div className="p-4 border-t">
                    <div className="flex gap-2 overflow-x-auto">
                      {listing.media.photos.map((photo, index) => (
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
                      {listing.description || 'No description available.'}
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
                        <p>{listing.year}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Make</Label>
                        <p>{listing.make}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Model</Label>
                        <p>{listing.model}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Condition</Label>
                        <p className="capitalize">{listing.condition}</p>
                      </div>
                      
                      {listing.listingType === 'rv' && (
                        <>
                          {listing.sleeps && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Sleeps</Label>
                              <p>{listing.sleeps}</p>
                            </div>
                          )}
                          {listing.length && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Length</Label>
                              <p>{listing.length} ft</p>
                            </div>
                          )}
                          {listing.slides && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Slide Outs</Label>
                              <p>{listing.slides}</p>
                            </div>
                          )}
                        </>
                      )}
                      
                      {listing.listingType === 'manufactured_home' && (
                        <>
                          {listing.bedrooms && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Bedrooms</Label>
                              <p>{listing.bedrooms}</p>
                            </div>
                          )}
                          {listing.bathrooms && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Bathrooms</Label>
                              <p>{listing.bathrooms}</p>
                            </div>
                          )}
                          {listing.dimensions?.sqft && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Square Feet</Label>
                              <p>{listing.dimensions.sqft}</p>
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
                    {Object.keys(listing.features).length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(listing.features).map(([key, value]) => (
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
                {listing.salePrice && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Sale Price</Label>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(listing.salePrice)}
                    </p>
                  </div>
                )}
                {listing.rentPrice && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Rent Price</Label>
                    <p className="text-xl font-semibold">
                      {formatCurrency(listing.rentPrice)}/month
                    </p>
                  </div>
                )}
                {listing.lotRent && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Lot Rent</Label>
                    <p>{formatCurrency(listing.lotRent)}/month</p>
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
                <p>{listing.location.city}, {listing.location.state}</p>
                {listing.location.postalCode && (
                  <p className="text-sm text-muted-foreground">{listing.location.postalCode}</p>
                )}
                {listing.location.communityName && (
                  <p className="text-sm text-muted-foreground">{listing.location.communityName}</p>
                )}
              </CardContent>
            </Card>

            {/* Listing Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Listing Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                  <p>{formatDate(listing.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                  <p>{formatDate(listing.updatedAt)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Listing Type</Label>
                  <p className="capitalize">{listing.listingType.replace('_', ' ')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Offer Type</Label>
                  <p className="capitalize">{listing.offerType.replace('_', ' ')}</p>
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
                  Edit Listing
                </Button>
                <Button variant="outline" className="w-full" onClick={handlePreview}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview Public View
                </Button>
                <Button variant="outline" className="w-full" onClick={handleShare}>
                  <Share className="h-4 w-4 mr-2" />
                  Share Listing
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}