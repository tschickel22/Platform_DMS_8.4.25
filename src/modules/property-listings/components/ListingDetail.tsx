import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ShareListingModal } from './ShareListingModal'
import { 
  ArrowLeft,
  Share, 
  MapPin, 
  Calendar, 
  Home, 
  Bed, 
  Bath, 
  Square, 
  Car,
  Share2,
  Heart,
  Phone,
  Mail,
  Globe
} from 'lucide-react'
import { mockListings } from '@/mocks/listingsMock'

interface ListingDetailProps {
  listingId?: string
}

export default function ListingDetail({ listingId: propListingId }: ListingDetailProps) {
  const { listingId: paramListingId } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  const listingId = propListingId || paramListingId

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true)
        setError(null)

        // Handle new listing case
        if (listingId === 'new') {
          setListing(null) // Will trigger form to show empty state
          return
        }
        
        // Ensure we have an array to search in
        const listings = mockListings?.sampleListings || []
        
        // First try to find in mock data
        const mockListing = listings.find(l => l.id === listingId)
        
        if (mockListing) {
          setListing(mockListing)
          setLoading(false)
          return
        }

        // If not in mock data, try API call
        // TODO: Replace with actual API call when backend is ready
        const response = await fetch(`/.netlify/functions/listings-crud?companyId=demo&listingId=${listingId}`)
        
        if (response.ok) {
          const data = await response.json()
          setListing(data)
        } else {
          throw new Error('Listing not found')
        }
      } catch (err) {
        console.error('Error fetching listing:', err)
        setError('Failed to load listing details')
      } finally {
        setLoading(false)
      }
    }

    if (listingId) {
      fetchListing()
    } else {
      setError('No listing ID provided')
      setLoading(false)
    }
  }, [listingId])

  const handleBack = () => {
    navigate(-1)
  }

  const handleShare = () => {
    // TODO: Implement share functionality in Phase 3
    console.log('Share listing:', listingId)
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
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Listings
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">Listing Not Found</h3>
              <p className="text-muted-foreground mb-4">
                {error || 'The listing you\'re looking for could not be found.'}
              </p>
              <Button onClick={handleBack}>
                Return to Listings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const primaryImage = listing.media?.photos?.[0] || listing.media?.primaryPhoto || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'

  return (
    <>
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Listings
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Heart className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShareModalOpen(true)}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image */}
          <div className="relative">
            <img
              src={primaryImage}
              alt={listing.searchResultsText || `${listing.year} ${listing.make} ${listing.model}`}
              className="w-full h-96 object-cover rounded-lg"
            />
            <div className="absolute top-4 left-4">
              <Badge variant={listing.listingType === 'manufactured_home' ? 'default' : 'secondary'}>
                {listing.listingType === 'manufactured_home' ? 'MH' : 'RV'}
              </Badge>
            </div>
            {listing.status && (
              <div className="absolute top-4 right-4">
                <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                  {listing.status}
                </Badge>
              </div>
            )}
          </div>

          {/* Title and Basic Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {listing.searchResultsText || `${listing.year} ${listing.make} ${listing.model}`}
            </h1>
            <div className="flex items-center text-muted-foreground mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span>
                {listing.location?.city && listing.location?.state 
                  ? `${listing.location.city}, ${listing.location.state}`
                  : 'Location not specified'
                }
              </span>
            </div>
            
            {/* Key Features */}
            <div className="flex flex-wrap gap-4 text-sm">
              {listing.year && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{listing.year}</span>
                </div>
              )}
              {listing.bedrooms && (
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>{listing.bedrooms} bed</span>
                </div>
              )}
              {listing.bathrooms && (
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span>{listing.bathrooms} bath</span>
                </div>
              )}
              {listing.dimensions?.length_ft && (
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  <span>{listing.dimensions.length_ft} ft</span>
                </div>
              )}
              {listing.sleeps && (
                <div className="flex items-center">
                  <Home className="h-4 w-4 mr-1" />
                  <span>Sleeps {listing.sleeps}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {listing.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Features and Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Features & Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    {listing.make && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Make:</span>
                        <span>{listing.make}</span>
                      </div>
                    )}
                    {listing.model && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Model:</span>
                        <span>{listing.model}</span>
                      </div>
                    )}
                    {listing.year && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Year:</span>
                        <span>{listing.year}</span>
                      </div>
                    )}
                    {listing.condition && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Condition:</span>
                        <span className="capitalize">{listing.condition}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Dimensions</h4>
                  <div className="space-y-2 text-sm">
                    {listing.dimensions?.length_ft && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Length:</span>
                        <span>{listing.dimensions.length_ft} ft</span>
                      </div>
                    )}
                    {listing.dimensions?.width_ft && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Width:</span>
                        <span>{listing.dimensions.width_ft} ft</span>
                      </div>
                    )}
                    {listing.slides && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Slide Outs:</span>
                        <span>{listing.slides}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Button 
            variant="outline"
            onClick={() => setShareModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {listing.salePrice && (
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatPrice(listing.salePrice)}
                    </div>
                    <div className="text-sm text-muted-foreground">Sale Price</div>
                  </div>
                )}
                {listing.rentPrice && (
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPrice(listing.rentPrice)}/mo
                    </div>
                    <div className="text-sm text-muted-foreground">Monthly Rent</div>
                  </div>
                )}
                {!listing.salePrice && !listing.rentPrice && (
                  <div className="text-muted-foreground">
                    Contact for pricing
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {listing.seller?.companyName && (
                  <div>
                    <div className="font-semibold">{listing.seller.companyName}</div>
                  </div>
                )}
                
                <div className="space-y-2">
                  {listing.seller?.phone && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={`tel:${listing.seller.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        {listing.seller.phone}
                      </a>
                    </Button>
                  )}
                  
                  {listing.seller?.emails?.[0] && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={`mailto:${listing.seller.emails[0]}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        {listing.seller.emails[0]}
                      </a>
                    </Button>
                  )}
                  
                  {listing.seller?.website && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={listing.seller.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                </div>

                <Separator />
                
                <Button className="w-full" size="lg">
                  Contact Seller
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          {listing.location && (
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {listing.location.address1 && (
                    <div>{listing.location.address1}</div>
                  )}
                  {listing.location.city && listing.location.state && (
                    <div>{listing.location.city}, {listing.location.state}</div>
                  )}
                  {listing.location.postalCode && (
                    <div>{listing.location.postalCode}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>

    {/* Share Modal */}
    <ShareListingModal
      open={shareModalOpen}
      onOpenChange={setShareModalOpen}
      listing={listing}
    />
  </>
  )
}