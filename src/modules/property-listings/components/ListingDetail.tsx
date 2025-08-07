import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  PawPrint,
  Play,
  Image as ImageIcon,
  Car,
  Snowflake,
  Wrench,
  Building,
  User,
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { allPropertyListings } from '@/mocks/listingsMock'
import { PropertyListing, ManufacturedHomeListing, RentalListing } from '@/types/listings'

// Helper functions
const isManufacturedHome = (listing: PropertyListing): listing is ManufacturedHomeListing => {
  return listing.listingType === 'for_sale'
}

const isRentalListing = (listing: PropertyListing): listing is RentalListing => {
  return listing.listingType === 'for_rent'
}

const formatPrice = (listing: PropertyListing): string => {
  if (isManufacturedHome(listing)) {
    return `$${listing.askingPrice.toLocaleString()}`
  } else {
    return `$${listing.rent.toLocaleString()}/month`
  }
}

const VideoPlayer = ({ url, title }: { url: string; title: string }) => {
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}`
    } else if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      return `https://player.vimeo.com/video/${videoId}`
    }
    return url
  }

  return (
    <div className="aspect-video">
      <iframe
        src={getEmbedUrl(url)}
        title={title}
        className="w-full h-full rounded-lg"
        allowFullScreen
        frameBorder="0"
      />
    </div>
  )
}

export default function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const listing = allPropertyListings.find(l => l.id === id)

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

  const isMH = isManufacturedHome(listing)
  const isRental = isRentalListing(listing)

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
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{listing.address}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold">{formatPrice(listing)}</div>
          <Button onClick={() => navigate(`/listings/edit/${listing.id}`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Media Gallery */}
      <Tabs defaultValue="images" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="images" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Images
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Videos ({listing.videos?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="floorplans" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Floor Plans ({listing.floorPlans?.length || 0})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="images">
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video relative overflow-hidden rounded-lg">
                {listing.images && listing.images.length > 0 ? (
                  <>
                    <img
                      src={listing.images[currentImageIndex]}
                      alt={`${listing.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {listing.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {listing.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Home className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="videos">
          <div className="space-y-4">
            {listing.videos && listing.videos.length > 0 ? (
              listing.videos.map((video, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">Video {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <VideoPlayer url={video} title={`${listing.title} - Video ${index + 1}`} />
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12 text-muted-foreground">
                    <Play className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No videos available</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="floorplans">
          <div className="grid gap-4 md:grid-cols-2">
            {listing.floorPlans && listing.floorPlans.length > 0 ? (
              listing.floorPlans.map((floorPlan, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">Floor Plan {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square">
                      <img
                        src={floorPlan}
                        alt={`Floor Plan ${index + 1}`}
                        className="w-full h-full object-contain rounded-lg border"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="md:col-span-2">
                <CardContent className="pt-6">
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No floor plans available</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Property Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-muted-foreground" />
                <span>{listing.bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-4 w-4 text-muted-foreground" />
                <span>{listing.bathrooms} Bathrooms</span>
              </div>
              {listing.squareFootage && (
                <div className="flex items-center gap-2">
                  <Square className="h-4 w-4 text-muted-foreground" />
                  <span>{listing.squareFootage} sq ft</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span className="capitalize">{listing.propertyType}</span>
              </div>
            </div>
            
            {/* Manufactured Home Specific Details */}
            {isMH && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-semibold">Home Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Make:</span>
                      <span className="ml-2 font-medium">{listing.make}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Model:</span>
                      <span className="ml-2 font-medium">{listing.model}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Year:</span>
                      <span className="ml-2 font-medium">{listing.year}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Home Type:</span>
                      <span className="ml-2 font-medium capitalize">{listing.homeType.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Roof Type:</span>
                      <span className="ml-2 font-medium capitalize">{listing.roofType.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Siding:</span>
                      <span className="ml-2 font-medium capitalize">{listing.sidingType.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Serial #:</span>
                      <span className="ml-2 font-medium">{listing.serialNumber}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Title #:</span>
                      <span className="ml-2 font-medium">{listing.titleNumber}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            <div>
              <Badge
                variant={
                  listing.status === 'active' ? 'default' :
                  listing.status === 'pending' ? 'outline' :
                  listing.status === 'rented' || listing.status === 'sold' ? 'secondary' :
                  'destructive'
                }
                className="capitalize"
              >
                {listing.status.replace('_', ' ')}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Location Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              {isMH ? 'Seller Information' : 'Contact Information'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isMH ? (
              <div className="space-y-3">
                <div>
                  <span className="text-muted-foreground">Seller:</span>
                  <span className="ml-2 font-medium">{listing.sellerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{listing.sellerPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{listing.sellerEmail}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Address:</span>
                  <div className="ml-2">{listing.sellerAddress}</div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{listing.contactInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{listing.contactInfo.email}</span>
                </div>
              </>
            )}
            
            {/* Location Information for MH */}
            {isMH && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-semibold">Location Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Location Type:</span>
                      <span className="ml-2 font-medium capitalize">{listing.locationType.replace('_', ' ')}</span>
                    </div>
                    {listing.communityName && (
                      <div>
                        <span className="text-muted-foreground">Community:</span>
                        <span className="ml-2 font-medium">{listing.communityName}</span>
                      </div>
                    )}
                    {listing.lotRent && (
                      <div>
                        <span className="text-muted-foreground">Lot Rent:</span>
                        <span className="ml-2 font-medium">${listing.lotRent}/month</span>
                      </div>
                    )}
                    {listing.taxes && (
                      <div>
                        <span className="text-muted-foreground">Taxes:</span>
                        <span className="ml-2 font-medium">${listing.taxes}/year</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Listed {new Date(listing.createdAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features and Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isMH ? 'Features & Amenities' : 'Amenities'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isMH ? (
            <div className="space-y-6">
              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Garage: {listing.garage ? (
                      <CheckCircle className="h-4 w-4 inline text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 inline text-red-600" />
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Snowflake className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Central Air: {listing.centralAir ? (
                      <CheckCircle className="h-4 w-4 inline text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 inline text-red-600" />
                    )}
                  </span>
                </div>
              </div>
              
              {/* Appliances */}
              {listing.appliances && listing.appliances.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Included Appliances
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {listing.appliances.map((appliance, index) => (
                      <Badge key={index} variant="outline">
                        {appliance}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Features */}
              {listing.features && listing.features.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Home Features
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {listing.features.map((feature, index) => (
                      <Badge key={index} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Virtual Tour */}
              {listing.virtualTour && (
                <div>
                  <h4 className="font-semibold mb-3">Virtual Tour</h4>
                  <VideoPlayer url={listing.virtualTour} title={`${listing.title} - Virtual Tour`} />
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {listing.amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>
              {isRental && listing.petPolicy && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Pet Policy</h4>
                  <p className="text-sm text-muted-foreground">{listing.petPolicy}</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{listing.description}</p>
          
          {/* Additional MH Information */}
          {isMH && (
            <div className="mt-6 pt-6 border-t space-y-4">
              {listing.condition && (
                <div>
                  <h4 className="font-semibold mb-2">Condition</h4>
                  <p className="text-sm text-muted-foreground capitalize">{listing.condition}</p>
                </div>
              )}
              
              {listing.financing && (
                <div>
                  <h4 className="font-semibold mb-2">Financing Options</h4>
                  <p className="text-sm text-muted-foreground">{listing.financing}</p>
                </div>
              )}
              
              {listing.utilities && (
                <div>
                  <h4 className="font-semibold mb-2">Utilities</h4>
                  <p className="text-sm text-muted-foreground">{listing.utilities}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}