import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Home,
  Car,
  DollarSign,
  Calendar,
  Ruler,
  Bed,
  Bath,
  FileImage
} from 'lucide-react'

interface Listing {
  id: string
  companyId: string
  inventoryId: string
  listingType: 'manufactured_home' | 'rv'
  offerType: 'for_sale' | 'for_rent' | 'both'
  status: string
  title?: string
  salePrice?: number
  rentPrice?: number
  description?: string
  media?: {
    photos: string[]
    primaryPhoto?: string
  }
  location?: {
    city?: string
    state?: string
    postalCode?: string
  }
  seller?: {
    companyName?: string
    phone?: string
    emails?: string[]
    website?: string
  }
  make?: string
  model?: string
  year?: number
  bedrooms?: number
  bathrooms?: number
  dimensions?: {
    width_ft?: number
    length_ft?: number
    sections?: number
  }
  createdAt: string
  updatedAt: string
}

export function PublicListingView() {
  const { companySlug, listingId } = useParams()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchListing = async () => {
      if (!companySlug || !listingId) return

      try {
        setLoading(true)
        // In a real implementation, we would need to resolve the company slug to company ID
        // For now, we'll use a placeholder API call
        const response = await fetch(`/.netlify/functions/listings-crud?companyId=${companySlug}&listingId=${listingId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Listing not found')
          }
          throw new Error('Failed to load listing')
        }
        
        const data = await response.json()
        
        // Only show active listings on public view
        if (data.status !== 'active') {
          throw new Error('Listing not available')
        }
        
        setListing(data)
      } catch (error) {
        console.error('Error fetching listing:', error)
        setError(error instanceof Error ? error.message : 'Failed to load listing')
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [companySlug, listingId])

  const formatPrice = (price?: number) => {
    if (!price) return 'Contact for price'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const getListingTitle = (listing: Listing) => {
    if (listing.title) return listing.title
    
    const year = listing.year || 'Unknown'
    const make = listing.make || 'Unknown'
    const model = listing.model || 'Model'
    
    return `${year} ${make} ${model}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-96 bg-muted rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </div>
              <div className="h-96 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <FileImage className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Listing Not Found</h1>
          <p className="text-muted-foreground mb-4">
            {error || 'The listing you are looking for does not exist or is no longer available.'}
          </p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            {listing.listingType === 'manufactured_home' ? (
              <Home className="h-5 w-5 text-primary" />
            ) : (
              <Car className="h-5 w-5 text-primary" />
            )}
            <Badge variant="secondary">
              {listing.listingType === 'manufactured_home' ? 'Manufactured Home' : 'RV'}
            </Badge>
            {listing.location?.city && listing.location?.state && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {listing.location.city}, {listing.location.state}
                </div>
              </>
            )}
          </div>
          
          <h1 className="text-3xl font-bold mb-2">
            {getListingTitle(listing)}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-lg">
            {(listing.offerType === 'for_sale' || listing.offerType === 'both') && listing.salePrice && (
              <div className="flex items-center font-semibold text-primary">
                <DollarSign className="h-5 w-5 mr-1" />
                {formatPrice(listing.salePrice)}
                {listing.offerType === 'both' && <span className="text-muted-foreground ml-1">to buy</span>}
              </div>
            )}
            {(listing.offerType === 'for_rent' || listing.offerType === 'both') && listing.rentPrice && (
              <div className="flex items-center font-semibold text-primary">
                <DollarSign className="h-5 w-5 mr-1" />
                {formatPrice(listing.rentPrice)}/month
                {listing.offerType === 'both' && <span className="text-muted-foreground ml-1">to rent</span>}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Photos and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                  {listing.media?.primaryPhoto ? (
                    <img
                      src={listing.media.primaryPhoto}
                      alt={getListingTitle(listing)}
                      className="w-full h-full object-cover rounded-t-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <div className="text-center text-muted-foreground">
                    <FileImage className="h-16 w-16 mx-auto mb-4" />
                    <p>No photos available</p>
                  </div>
                </div>
                
                {listing.media?.photos && listing.media.photos.length > 1 && (
                  <div className="p-4">
                    <div className="grid grid-cols-4 gap-2">
                      {listing.media.photos.slice(1, 5).map((photo, index) => (
                        <div key={index} className="aspect-video bg-muted rounded overflow-hidden">
                          <img
                            src={photo}
                            alt={`${getListingTitle(listing)} - Photo ${index + 2}`}
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
            {listing.description && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{listing.description}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Specifications */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Specifications</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {listing.year && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Year</div>
                        <div className="font-medium">{listing.year}</div>
                      </div>
                    </div>
                  )}
                  
                  {listing.make && (
                    <div>
                      <div className="text-sm text-muted-foreground">Make</div>
                      <div className="font-medium">{listing.make}</div>
                    </div>
                  )}
                  
                  {listing.model && (
                    <div>
                      <div className="text-sm text-muted-foreground">Model</div>
                      <div className="font-medium">{listing.model}</div>
                    </div>
                  )}
                  
                  {listing.listingType === 'manufactured_home' && listing.bedrooms !== undefined && (
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Bedrooms</div>
                        <div className="font-medium">{listing.bedrooms}</div>
                      </div>
                    </div>
                  )}
                  
                  {listing.listingType === 'manufactured_home' && listing.bathrooms !== undefined && (
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Bathrooms</div>
                        <div className="font-medium">{listing.bathrooms}</div>
                      </div>
                    </div>
                  )}
                  
                  {listing.dimensions?.length_ft && (
                    <div className="flex items-center">
                      <Ruler className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Length</div>
                        <div className="font-medium">{listing.dimensions.length_ft} ft</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Contact Seller</h2>
                
                {listing.seller?.companyName && (
                  <div className="mb-4">
                    <h3 className="font-medium text-lg">{listing.seller.companyName}</h3>
                  </div>
                )}
                
                <div className="space-y-3">
                  {listing.seller?.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                      <a href={`tel:${listing.seller.phone}`} className="hover:underline">
                        {listing.seller.phone}
                      </a>
                    </div>
                  )}
                  
                  {listing.seller?.emails && listing.seller.emails.length > 0 && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                      <a href={`mailto:${listing.seller.emails[0]}`} className="hover:underline">
                        {listing.seller.emails[0]}
                      </a>
                    </div>
                  )}
                  
                  {listing.seller?.website && (
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-3 text-muted-foreground" />
                      <a 
                        href={listing.seller.website.startsWith('http') ? listing.seller.website : `https://${listing.seller.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                {/* Lead Form Placeholder */}
                <div className="space-y-3">
                  <h4 className="font-medium">Interested in this listing?</h4>
                  <p className="text-sm text-muted-foreground">
                    Lead form will be implemented in Phase 2
                  </p>
                  <Button className="w-full" disabled>
                    Contact Seller
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicListingView