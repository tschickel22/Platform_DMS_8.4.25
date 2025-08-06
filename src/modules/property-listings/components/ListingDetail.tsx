import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Share2, 
  MapPin, 
  Home, 
  Bath, 
  Bed,
  Square,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  PawPrint
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { mockListings } from '@/mocks/listingsMock'

export default function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const listing = mockListings.sampleListings.find(l => l.id === id)

  if (!listing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/listings')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">Listing not found</h3>
              <p className="text-muted-foreground">The listing you're looking for doesn't exist.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      toast({
        title: "Success",
        description: "Listing deleted successfully",
      })
      navigate('/listings')
    }
  }

  const handleShare = () => {
    const url = `${window.location.origin}/listings/public/${listing.id}`
    navigator.clipboard.writeText(url)
    toast({
      title: "Link copied",
      description: "Public listing link copied to clipboard",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rented': return 'bg-blue-100 text-blue-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/listings')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{listing.title}</h1>
            <p className="text-muted-foreground flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {listing.address}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(listing.status)}>
            {listing.status}
          </Badge>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" onClick={() => navigate(`/listings/edit/${listing.id}`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                {listing.images && listing.images[0] ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              {listing.images && listing.images.length > 1 && (
                <div className="p-4">
                  <div className="grid grid-cols-4 gap-2">
                    {listing.images.slice(1, 5).map((image, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                        <img
                          src={image}
                          alt={`${listing.title} ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {listing.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price & Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Rental Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-3xl font-bold">${listing.rent.toLocaleString()}</div>
                <div className="text-muted-foreground">per month</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{listing.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{listing.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{listing.squareFootage} sq ft</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm capitalize">{listing.propertyType}</span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <PawPrint className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Pet Policy</span>
                </div>
                <p className="text-sm text-muted-foreground">{listing.petPolicy}</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{listing.contactInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{listing.contactInfo.email}</span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Created</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Last Updated</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(listing.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={() => navigate(`/listings/edit/${listing.id}`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Listing
              </Button>
              <Button variant="outline" className="w-full" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Listing
              </Button>
              <Button variant="outline" className="w-full">
                Generate Quote
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}