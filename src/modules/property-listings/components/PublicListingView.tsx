import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Calendar,
  DollarSign,
  Phone,
  Mail,
  ArrowLeft,
  Share2,
  Heart
} from 'lucide-react'
import { mockListings } from '@/mocks/listingsMock'

export function PublicListingView() {
  const { listingId } = useParams()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('Looking for listing with ID:', listingId)
    console.log('Available listings:', mockListings?.sampleListings)
    console.log('Mock listings structure:', mockListings?.sampleListings?.map(l => ({ id: l.id, title: l.title })))
    
    // Simulate loading delay
    setTimeout(() => {
      const foundListing = (mockListings?.sampleListings || []).find(l => l.id === listingId)
      console.log('Found listing:', foundListing)
      setListing(foundListing)
      setLoading(false)
    }, 500)
  }, [listingId])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading listing...</p>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Listing Not Found</h1>
            <p className="text-gray-600 mb-6">
              The listing you're looking for doesn't exist or has been removed.
            </p>
            <div className="space-y-2 text-sm text-gray-500 mb-6">
              <p>Listing ID: {listingId}</p>
              <p>Available IDs: {(mockListings?.sampleListings || []).map(l => l.id).join(', ')}</p>
            </div>
            <Link to="/marketing">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                View All Listings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/marketing" 
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Listings
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                  {listing.media?.primaryPhoto ? (
                    <img 
                      src={listing.media.primaryPhoto} 
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No image available</p>
                      </div>
                    </div>
                  )}
                </div>
                {listing.media?.photos && listing.media.photos.length > 1 && (
                  <div className="p-4 border-t">
                    <div className="flex space-x-2 overflow-x-auto">
                      {listing.media.photos.slice(0, 6).map((photo, index) => (
                        <div key={index} className="flex-shrink-0">
                          <img 
                            src={photo} 
                            alt={`${listing.title} - ${index + 1}`}
                            className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-75"
                          />
                        </div>
                      ))}
                      {listing.media.photos.length > 6 && (
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-600">
                          +{listing.media.photos.length - 6}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Listing Details */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="mb-2">
                      {listing.listingType === 'manufactured_home' ? 'Manufactured Home' : 'RV'}
                    </Badge>
                    <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                      {listing.status}
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {listing.title || `${listing.year} ${listing.make} ${listing.model}`}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>
                      {listing.location?.city}, {listing.location?.state} {listing.location?.postalCode}
                    </span>
                  </div>
                </div>

                {/* Key Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {listing.year && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{listing.year}</span>
                    </div>
                  )}
                  {listing.bedrooms && (
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{listing.bedrooms} bed</span>
                    </div>
                  )}
                  {listing.bathrooms && (
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{listing.bathrooms} bath</span>
                    </div>
                  )}
                  {listing.sleeps && (
                    <div className="flex items-center">
                      <Car className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">Sleeps {listing.sleeps}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {listing.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {listing.description}
                    </p>
                  </div>
                )}

                {/* Features */}
                {listing.features && Object.keys(listing.features).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Features</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {Object.entries(listing.features).map(([key, value]) => (
                        value && (
                          <div key={key} className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  {listing.salePrice && (
                    <div className="mb-2">
                      <div className="text-3xl font-bold text-green-600">
                        {formatPrice(listing.salePrice)}
                      </div>
                      <div className="text-sm text-gray-600">Sale Price</div>
                    </div>
                  )}
                  {listing.rentPrice && (
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {formatPrice(listing.rentPrice)}/mo
                      </div>
                      <div className="text-sm text-gray-600">Rental Price</div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            {listing.seller && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Seller</h3>
                  <div className="space-y-3">
                    {listing.seller.companyName && (
                      <div>
                        <div className="font-medium">{listing.seller.companyName}</div>
                      </div>
                    )}
                    {listing.seller.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {listing.seller.phone}
                      </div>
                    )}
                    {listing.seller.emails && listing.seller.emails[0] && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {listing.seller.emails[0]}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location */}
            {listing.location && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Location</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    {listing.location.address1 && (
                      <div>{listing.location.address1}</div>
                    )}
                    <div>
                      {listing.location.city}, {listing.location.state} {listing.location.postalCode}
                    </div>
                    {listing.location.county && (
                      <div>{listing.location.county} County</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicListingView