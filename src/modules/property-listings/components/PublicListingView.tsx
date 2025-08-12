import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Share2, 
  Heart, 
  Calendar,
  Home,
  Car,
  Bed,
  Bath,
  Ruler,
  Users,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Star
} from 'lucide-react'

import { mockListings } from '@/mocks/listingsMock'

export const PublicListingView = () => {
  const { companySlug, listingId } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In production, fetch listing data from API based on listingId
    // For now, find the listing from mock data
    setTimeout(() => {
      const foundListing = mockListings.sampleListings.find(l => l.id === listingId)
      setListing(foundListing || null)
      setLoading(false)
    }, 500)
  }, [companySlug, listingId])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const nextPhoto = () => {
    if (listing?.media?.photos) {
      setCurrentPhotoIndex((prev) => 
        prev === listing.media.photos.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevPhoto = () => {
    if (listing?.media?.photos) {
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? listing.media.photos.length - 1 : prev - 1
      )
    }
  }

  const handleShare = async () => {
    // Prepare share data
    const shareData = {
      title: `${listing.year} ${listing.make} ${listing.model}`,
      text: `Check out this ${listing.listingType === 'manufactured_home' ? 'manufactured home' : 'RV'} - ${listing.searchResultsText || 'Great property listing'}`,
      url: window.location.href
    };

    // Check if Web Share API is supported and available
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        // If Web Share API fails, fall back to clipboard
        console.warn('Web Share API failed:', error);
      }
    }

    // Fallback: Copy to clipboard
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        // Show success message (you might want to use a toast notification here)
        alert('Link copied to clipboard!');
        return;
      } catch (error) {
        // Fallback - copy to clipboard
        // Final fallback: Show the URL for manual copying
        console.error('Share and clipboard failed:', error);
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          alert('Link copied to clipboard!');
        } catch (copyError) {
          alert(`Please copy this link manually: ${window.location.href}`);
        }
        document.body.removeChild(textArea);
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-96 bg-muted rounded"></div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-48 bg-muted rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Listing Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The listing you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate(`/${companySlug}/listings`)}>
              View All Listings
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const TypeIcon = listing.listingType === 'manufactured_home' ? Home : Car

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate(`/${companySlug}/listings`)}
              >
                ← Back to Listings
              </Button>
              <div className="flex items-center space-x-2">
                <TypeIcon className="h-5 w-5" />
                <span className="font-semibold">{listing.seller?.companyName}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Property Photos */}
        <div className="relative mb-8">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            {listing.media?.photos?.[currentPhotoIndex] ? (
              <img
                src={listing.media.photos[currentPhotoIndex]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <TypeIcon className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>
          
          {listing.media?.photos && listing.media.photos.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 text-white hover:bg-black/40"
                onClick={prevPhoto}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 text-white hover:bg-black/40"
                onClick={nextPhoto}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
              
              {/* Photo thumbnails */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-2 bg-black/50 p-2 rounded-lg">
                  {listing.media.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`w-12 h-8 rounded overflow-hidden ${
                        index === currentPhotoIndex ? 'ring-2 ring-white' : 'opacity-60'
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
            </>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Property Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-3xl font-bold">{listing.title}</h1>
                <Badge className="bg-green-100 text-green-800">
                  {listing.status}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {listing.location.address1}, {listing.location.city}, {listing.location.state} {listing.location.postalCode}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Listed {new Date(listing.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{listing.year}</div>
                    <div className="text-sm text-muted-foreground">Year</div>
                  </div>
                  {listing.listingType === 'manufactured_home' && (
                    <>
                      <div className="text-center">
                        <div className="text-2xl font-bold flex items-center justify-center">
                          <Bed className="h-6 w-6 mr-1" />
                          {listing.bedrooms}
                        </div>
                        <div className="text-sm text-muted-foreground">Bedrooms</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold flex items-center justify-center">
                          <Bath className="h-6 w-6 mr-1" />
                          {listing.bathrooms}
                        </div>
                        <div className="text-sm text-muted-foreground">Bathrooms</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold flex items-center justify-center">
                          <Ruler className="h-6 w-6 mr-1" />
                          {listing.dimensions?.sqft || (listing.dimensions?.width_ft * listing.dimensions?.length_ft)}
                        </div>
                        <div className="text-sm text-muted-foreground">Sq Ft</div>
                      </div>
                    </>
                  )}
                  {listing.listingType === 'rv' && (
                    <>
                      <div className="text-center">
                        <div className="text-2xl font-bold flex items-center justify-center">
                          <Users className="h-6 w-6 mr-1" />
                          {listing.sleeps}
                        </div>
                        <div className="text-sm text-muted-foreground">Sleeps</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{listing.slides}</div>
                        <div className="text-sm text-muted-foreground">Slide-outs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{listing.length}ft</div>
                        <div className="text-sm text-muted-foreground">Length</div>
                      </div>
                    </>
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
                <p className="text-muted-foreground leading-relaxed">
                  {listing.description}
                </p>
              </CardContent>
            </Card>

            {/* Features & Amenities */}
            {listing.features && (
              <Card>
                <CardHeader>
                  <CardTitle>Features & Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(listing.features).map(([feature, hasFeature]) => {
                      if (!hasFeature) return null
                      const featureName = feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                      return (
                        <div key={feature} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">{featureName}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {listing.salePrice && (
                    <div>
                      <div className="text-3xl font-bold text-green-600">
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}