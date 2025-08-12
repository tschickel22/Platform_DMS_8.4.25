import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, MapPin, Bed, Bath, Users, Ruler, Calendar, DollarSign, Phone, Mail, Globe } from 'lucide-react'

// ✅ robust import: works for named, default, or alternate keys
import * as ListingsMock from '@/mocks/listingsMock'

// Turn any plausible mock module shape into an array
const asArray = (val: any) => {
  if (Array.isArray(val)) return val
  if (Array.isArray(val?.listings)) return val.listings
  if (Array.isArray(val?.sampleListings)) return val.sampleListings
  if (Array.isArray(val?.default)) return val.default
  return []
}

  const { listingId } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    console.log('🔍 PublicListingView - Looking for listing with ID:', listingId)
    
    setLoading(true)

    // Optional: gate with env flag
    const USE_MOCKS = (import.meta as any)?.env?.VITE_USE_MOCKS !== 'false'

    if (USE_MOCKS) {
      const mock =
        (ListingsMock as any).mockListings ??
        (ListingsMock as any).listings ??
        (ListingsMock as any).sampleListings ??
        (ListingsMock as any).default

      const data = asArray(mock)
      
      console.log('📊 Available listings:', data)
      console.log('🔢 Available listing IDs:', data.map((l: any) => l.id))
      
      const foundListing = data.find((l: any) => l.id === listingId)
      
      console.log('✅ Found listing:', foundListing)
      
      setListing(foundListing || null)
    } else {
      // TODO: real API call when ready
      setListing(null)
    }
    
    setLoading(false)
  }, [listingId])

  const formatPrice = (price: number) => {
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
    // Get available IDs for debugging
    const USE_MOCKS = (import.meta as any)?.env?.VITE_USE_MOCKS !== 'false'
    let availableIds: string[] = []
    
    if (USE_MOCKS) {
      const mock =
        (ListingsMock as any).mockListings ??
        (ListingsMock as any).listings ??
        (ListingsMock as any).sampleListings ??
        (ListingsMock as any).default

      const data = asArray(mock)
      availableIds = data.map((l: any) => l.id)
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Listing Not Found</h1>
            <p className="text-gray-600 mb-6">
              The listing you're looking for doesn't exist or has been removed.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm">
              <p className="font-medium text-gray-700 mb-2">Debug Info:</p>
              <p className="text-gray-600">Listing ID: <code className="bg-white px-2 py-1 rounded">{listingId}</code></p>
              <p className="text-gray-600 mt-2">Available IDs:</p>
              {availableIds.length > 0 ? (
                <div className="mt-2 space-y-1">
                  {availableIds.map(id => (
                    <code key={id} className="block bg-white px-2 py-1 rounded text-xs">{id}</code>
                  ))}
                </div>
              ) : (
                <p className="text-red-600 mt-2">No listings found in mock data</p>
              )}
            </div>
            
            <Button onClick={() => navigate('/marketing')} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              View All Listings
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const images = listing.media?.photos || []
  const primaryImage = listing.media?.primaryPhoto || images[0]
  const allImages = primaryImage ? [primaryImage, ...images.filter((img: string) => img !== primaryImage)] : images

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => navigate('/marketing')}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Listings
            </Button>
            <div className="text-sm text-gray-500">
              {listing.listingType === 'manufactured_home' ? 'Manufactured Home' : 'RV'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Main Image */}
              <div className="aspect-video bg-gray-200">
                {allImages.length > 0 ? (
                  <img
                    src={allImages[selectedImageIndex]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No photos available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="p-4 border-t">
                  <div className="flex space-x-2 overflow-x-auto">
                    {allImages.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {listing.description || 'No description available.'}
                </p>
              </CardContent>
            </Card>

            {/* Features */}
            {listing.features && Object.keys(listing.features).length > 0 && (
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Features & Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(listing.features).map(([key, value]) => {
                      if (typeof value === 'boolean' && value) {
                        return (
                          <Badge key={key} variant="secondary" className="justify-start">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </Badge>
                        )
                      }
                      if (typeof value === 'string' || typeof value === 'number') {
                        return (
                          <div key={key} className="text-sm">
                            <span className="font-medium">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                            </span>
                            <span className="ml-1 text-gray-600">{value}</span>
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Title and Price */}
            <Card>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {listing.title}
                </h1>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{listing.location.city}, {listing.location.state}</span>
                </div>

                <div className="space-y-2">
                  {listing.salePrice && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Sale Price:</span>
                      <span className="text-2xl font-bold text-green-600">
                        {formatPrice(listing.salePrice)}
                      </span>
                    </div>
                  )}
                  {listing.rentPrice && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rent Price:</span>
                      <span className="text-xl font-semibold text-blue-600">
                        {formatPrice(listing.rentPrice)}/mo
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Key Details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Details</h2>
                <div className="space-y-3">
                  {listing.year && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">Year</span>
                      </div>
                      <span className="font-medium">{listing.year}</span>
                    </div>
                  )}
                  
                  {listing.make && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Make</span>
                      <span className="font-medium">{listing.make}</span>
                    </div>
                  )}
                  
                  {listing.model && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Model</span>
                      <span className="font-medium">{listing.model}</span>
                    </div>
                  )}

                  {listing.bedrooms !== undefined && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">Bedrooms</span>
                      </div>
                      <span className="font-medium">{listing.bedrooms}</span>
                    </div>
                  )}

                  {listing.bathrooms !== undefined && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">Bathrooms</span>
                      </div>
                      <span className="font-medium">{listing.bathrooms}</span>
                    </div>
                  )}

                  {listing.sleeps && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">Sleeps</span>
                      </div>
                      <span className="font-medium">{listing.sleeps}</span>
                    </div>
                  )}

                  {listing.length && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Ruler className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">Length</span>
                      </div>
                      <span className="font-medium">{listing.length} ft</span>
                    </div>
                  )}

                  {listing.slides && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Slide Outs</span>
                      <span className="font-medium">{listing.slides}</span>
                    </div>
                  )}

                  {listing.dimensions?.sqft && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Square Feet</span>
                      <span className="font-medium">{listing.dimensions.sqft} sq ft</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            {listing.seller && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Contact Seller</h2>
                  <div className="space-y-3">
                    {listing.seller.companyName && (
                      <div>
                        <p className="font-medium text-gray-900">{listing.seller.companyName}</p>
                      </div>
                    )}
                    
                    {listing.seller.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <a 
                          href={`tel:${listing.seller.phone}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {listing.seller.phone}
                        </a>
                      </div>
                    )}
                    
                    {listing.seller.emails && listing.seller.emails.length > 0 && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <a 
                          href={`mailto:${listing.seller.emails[0]}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {listing.seller.emails[0]}
                        </a>
                      </div>
                    )}
                    
                    {listing.seller.website && (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-gray-400" />
                        <a 
                          href={listing.seller.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 space-y-2">
                    <Button className="w-full" size="lg">
                      <Phone className="mr-2 h-4 w-4" />
                      Call Now
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      <Mail className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
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
export { PublicListingView }
export default PublicListingView