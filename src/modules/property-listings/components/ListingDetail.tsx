import React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
import { ArrowLeft, Edit, Trash2, MapPin, Bed, Bath, Square, Calendar, Phone, Mail, Car, Wifi, Dumbbell, Waves, Share2 } from 'lucide-react'
  Edit, 
  MapPin, 
  DollarSign, 
  Home, 
  Bath, 
  Square, 
  Phone, 
  Mail,
  Calendar
} from 'lucide-react'
import { getListingById } from '@/mocks/listingsMock'
import ShareListingModal from './ShareListingModal'

export default function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [shareModalOpen, setShareModalOpen] = useState(false)

  if (!id) {
    navigate('/listings')
    return null
  }

  const listing = getListingById(id)

  if (!listing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/listings')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Listing not found</h3>
              <p className="text-muted-foreground mb-4">
                The listing you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate('/listings')}>
                Return to Listings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'occupied':
        return 'secondary'
      case 'maintenance':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Available'
      case 'occupied':
        return 'Occupied'
      case 'maintenance':
        return 'Under Maintenance'
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/listings')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{listing.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{listing.address}</span>
            </div>
          </div>
        </div>
          <div className="flex gap-2 flex-wrap">

      {/* Share Modal */}
      <ShareListingModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        listingUrl={`/public-listings/${id}`}
        title={`Share "${listing.title}"`}
      />
            <Button
              variant="outline"
              onClick={() => setShareModalOpen(true)}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          <Badge variant={getStatusBadgeVariant(listing.status)}>
            {getStatusLabel(listing.status)}
          </Badge>
          <Link to={`/listings/edit/${listing.id}`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Listing
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card>
            <CardContent className="p-0">
              <div className="grid gap-2">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {listing.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-2 p-4">
                    {listing.images.slice(1, 4).map((image, index) => (
                      <div key={index} className="aspect-video relative overflow-hidden rounded">
                        <img
                          src={image}
                          alt={`${listing.title} - Image ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
              <CardTitle>Amenities & Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((amenity, index) => (
                  <Badge key={index} variant="outline">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pet Policy */}
          {listing.petPolicy && (
            <Card>
              <CardHeader>
                <CardTitle>Pet Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{listing.petPolicy}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing & Details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Monthly Rent</span>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">
                    {listing.rent.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">/month</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{listing.bedrooms}</div>
                    <div className="text-xs text-muted-foreground">Bedrooms</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{listing.bathrooms}</div>
                    <div className="text-xs text-muted-foreground">Bathrooms</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Square className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{listing.squareFootage.toLocaleString()} sq ft</div>
                  <div className="text-xs text-muted-foreground">Square Footage</div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="text-sm text-muted-foreground mb-1">Property Type</div>
                <Badge variant="outline" className="capitalize">
                  {listing.propertyType.replace('-', ' ')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {listing.contactInfo.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`tel:${listing.contactInfo.phone}`}
                    className="text-primary hover:underline"
                  >
                    {listing.contactInfo.phone}
                  </a>
                </div>
              )}
              {listing.contactInfo.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`mailto:${listing.contactInfo.email}`}
                    className="text-primary hover:underline"
                  >
                    {listing.contactInfo.email}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Listing Information */}
          <Card>
            <CardHeader>
              <CardTitle>Listing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Listed</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(listing.createdAt).toLocaleDateString()}
import { ArrowLeft, Edit, Trash2, MapPin, Bed, Bath, Square, Calendar, Phone, Mail, Car, Wifi, Dumbbell, Waves, Share2 } from 'lucide-react'
                  </div>