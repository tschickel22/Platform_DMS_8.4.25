import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Share2, 
  MapPin, 
  Calendar, 
  Home, 
  Car,
  Bed,
  Bath,
  Square,
  DollarSign,
  Phone,
  Mail,
  Globe,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { useAuth } from '@/contexts/AuthContext'

// Mock data - replace with actual API call
const mockListing = {
  id: 'listing_1',
  companyId: 'company_1',
  listingType: 'manufactured_home',
  inventoryId: 'inv_001',
  offerType: 'for_sale',
  status: 'active',
  year: 2020,
  make: 'Clayton',
  model: 'Everest',
  vin: 'CL123456789',
  color: 'Beige',
  condition: 'new',
  salePrice: 189000,
  rentPrice: null,
  currency: 'USD',
  bedrooms: 3,
  bathrooms: 2,
  dimensions: {
    width_ft: 28,
    length_ft: 52,
    sections: 2
  },
  description: 'Beautiful 3-bedroom, 2-bathroom manufactured home featuring modern amenities and spacious living areas. This home offers an open floor plan with a large kitchen island, master suite with walk-in closet, and energy-efficient appliances throughout.',
  searchResultsText: '3BR Manufactured Home in Austin',
  location: {
    address1: '123 Oak Street',
    city: 'Austin',
    state: 'TX',
    postalCode: '78701',
    county: 'Travis',
    latitude: 30.2672,
    longitude: -97.7431,
    locationType: 'community',
    communityName: 'Sunset Village'
  },
  media: {
    photos: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'
    ],
    primaryPhoto: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
    virtualTour: null
  },
  features: {
    roofType: 'Shingle',
    sidingType: 'Vinyl',
    ceilingType: 'Drywall',
    lotRent: 450,
    taxes: 2400,
    utilities: 'Electric, Water, Sewer',
    centralAir: true,
    dishwasher: true,
    washerDryer: true,
    fireplace: false,
    deck: true,
    shed: true
  },
  seller: {
    companyName: 'Austin Mobile Homes',
    phone: '(512) 555-0123',
    emails: ['sales@austinmobilehomes.com'],
    website: 'https://austinmobilehomes.com'
  },
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T14:30:00Z'
}

export function PublicListingView() {
  const { listingId } = useParams<{ listingId: string }>()
  const navigate = useNavigate()
  const { tenant } = useTenant()
  const { user } = useAuth()
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) {
        setError('No listing ID provided')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // TODO: Replace with actual API call to netlify/functions/listings-crud.js
        // const response = await fetch(`/.netlify/functions/listings-crud?companyId=${tenant?.id}&listingId=${listingId}`)
        // if (!response.ok) {
        //   throw new Error('Failed to fetch listing')
        // }
        // const data = await response.json()
        // setListing(data)
        
        // For now, use mock data
        setTimeout(() => {
          if (listingId === mockListing.id) {
            setListing(mockListing)
          } else {
            setError('Listing not found')
          }
          setLoading(false)
        }, 500)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load listing')
        setLoading(false)
      }
    }

    fetchListing()
  }, [listingId, tenant?.id])

  const handleShare = () => {
    // TODO: Open ShareListingModal in Phase 3
    console.log('Share listing:', listingId)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatSquareFootage = () => {
    if (listing?.dimensions?.width_ft && listing?.dimensions?.length_ft) {
      return listing.dimensions.width_ft * listing.dimensions.length_ft
    }
    return null
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested listing could not be found.'}</p>
          <Button onClick={() => navigate('/property-listings')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Listings
          </Button>
        </div>
      </div>
    )
  }

  const photos = listing.media?.photos || []
  const currentPhoto = photos[currentImageIndex] || listing.media?.primaryPhoto

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/property-listings')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Listings
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {listing.searchResultsText || `${listing.year} ${listing.make} ${listing.model}`}
            </h1>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{listing.location?.city}, {listing.location?.state}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          {user && (
            <>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card>
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={currentPhoto}
                  alt={listing.searchResultsText}
                  className="w-full h-96 object-cover rounded-t-lg"
                />
                {photos.length > 1 && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex space-x-2 overflow-x-auto">
                      {photos.map((photo, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                            index === currentImageIndex ? 'border-white' : 'border-transparent'
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
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {listing.description}
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Features & Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {listing.features?.centralAir && (
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Central Air
                  </div>
                )}
                {listing.features?.dishwasher && (
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Dishwasher
                  </div>
                )}
                {listing.features?.washerDryer && (
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Washer/Dryer
                  </div>
                )}
                {listing.features?.deck && (
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Deck
                  </div>
                )}
                {listing.features?.shed && (
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Storage Shed
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price & Key Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                  {listing.status}
                </Badge>
                <Badge variant="outline">
                  {listing.listingType === 'manufactured_home' ? 'MH' : 'RV'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatPrice(listing.salePrice || listing.rentPrice)}
                  {listing.offerType === 'for_rent' && <span className="text-lg text-gray-600">/mo</span>}
                </div>
                <div className="text-sm text-gray-600">
                  {listing.offerType === 'for_sale' ? 'Sale Price' : 'Monthly Rent'}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{listing.year}</span>
                </div>
                <div className="flex items-center">
                  <Home className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{listing.condition}</span>
                </div>
                {listing.bedrooms && (
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{listing.bedrooms} bed</span>
                  </div>
                )}
                {listing.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{listing.bathrooms} bath</span>
                  </div>
                )}
                {formatSquareFootage() && (
                  <div className="flex items-center col-span-2">
                    <Square className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{formatSquareFootage()} sq ft</span>
                  </div>
                )}
              </div>

              {listing.features?.lotRent && (
                <>
                  <Separator />
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lot Rent:</span>
                      <span className="font-medium">${listing.features.lotRent}/mo</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {listing.location?.address1 && (
                <div>{listing.location.address1}</div>
              )}
              <div>
                {listing.location?.city}, {listing.location?.state} {listing.location?.postalCode}
              </div>
              {listing.location?.communityName && (
                <div className="text-gray-600">
                  Community: {listing.location.communityName}
                </div>
              )}
              {listing.location?.county && (
                <div className="text-gray-600">
                  County: {listing.location.county}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Seller</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-medium">{listing.seller?.companyName}</div>
              </div>
              
              {listing.seller?.phone && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`tel:${listing.seller.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    {listing.seller.phone}
                  </a>
                </Button>
              )}
              
              {listing.seller?.emails?.[0] && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`mailto:${listing.seller.emails[0]}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </a>
                </Button>
              )}
              
              {listing.seller?.website && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={listing.seller.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-4 h-4 mr-2" />
                    Website
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}