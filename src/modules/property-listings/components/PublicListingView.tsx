import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Square, 
  Phone, 
  Mail,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Heart,
  Share2,
  ExternalLink
} from 'lucide-react'
import { mockListings } from '@/mocks/listingsMock'
import { useTenant } from '@/contexts/TenantContext'
import { Helmet } from 'react-helmet'

export default function PublicListingView() {
  const { tenant } = useTenant()
  const navigate = useNavigate()
  const { listingId } = useParams()
  const [listings, setListings] = useState(mockListings.sampleListings)
  const [selectedListing, setSelectedListing] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [favorites, setFavorites] = useState<string[]>([])
  
  // add closeModal helper
  const closeModal = () => {
    setSelectedListing(null)
    // If we're on a single listing page, navigate back to all listings
    if (listingId) {
      navigate('/public/listings')
    }
  }
  
  const [filteredListings, setFilteredListings] = useState(listings)
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState('all')
  const [propertyType, setPropertyType] = useState('all')

  // Handle direct listing URL access
  useEffect(() => {
    if (listingId) {
      const listing = listings.find(l => l.id === listingId)
      if (listing) {
        setSelectedListing(listing)
      } else {
        // If listing not found, redirect to all listings
        navigate('/public/listings')
      }
    }
  }, [listingId, listings, navigate])

  // Function to open listing details and update URL
  const openListingDetails = (listing: any) => {
    setSelectedListing(listing)
    setCurrentImageIndex(0)
    // Update URL without full navigation to maintain state
    window.history.pushState(null, '', `/public/listings/${listing.id}`)
  }
  // Filter listings based on search and filters
  useEffect(() => {
    let filtered = listings.filter(listing => listing.status === 'active')

    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number)
      filtered = filtered.filter(listing => {
        if (max) {
          return listing.rent >= min && listing.rent <= max
        } else {
          return listing.rent >= min
        }
      })
    }

    if (propertyType !== 'all') {
      filtered = filtered.filter(listing => listing.propertyType === propertyType)
    }

    setFilteredListings(filtered)
  }, [listings, searchTerm, priceRange, propertyType])

  const toggleFavorite = (listingId: string) => {
    setFavorites(prev => 
      prev.includes(listingId) 
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    )
  }

  const handleShare = (listing: any) => {
    const url = `${window.location.origin}/public/listings/${listing.id}`
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `Check out this rental property: ${listing.title}`,
        url: url
      })
    } else {
      navigator.clipboard.writeText(url)
      // You could show a toast notification here
    }
  }

  const handleContact = (listing: any, method: 'phone' | 'email') => {
    if (method === 'phone') {
      window.open(`tel:${listing.contactInfo.phone}`)
    } else {
      window.open(`mailto:${listing.contactInfo.email}?subject=Inquiry about ${listing.title}`)
    }
  }

  const prevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? selectedListing.images.length - 1 : prev - 1
    )
  }

  const nextImage = () => {
    setCurrentImageIndex(prev => 
      prev === selectedListing.images.length - 1 ? 0 : prev + 1
    )
  }

  // Compute average rent for meta tags
  const averageRent =
    filteredListings.length > 0
      ? filteredListings.reduce((sum, l) => sum + l.rent, 0) / filteredListings.length
      : 0;

  // If we're viewing a single listing, show different layout
  if (listingId && selectedListing) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Back to listings button */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/public/listings')}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to All Listings
            </Button>
          </div>

          {/* Single listing content */}
          <Card className="overflow-hidden">
            <div className="relative">
              <img
                src={selectedListing.images[currentImageIndex]}
                alt={selectedListing.title}
                className="w-full h-96 object-cover"
              />
              
              {/* Image navigation */}
              {selectedListing.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(prev => 
                      prev === 0 ? selectedListing.images.length - 1 : prev - 1
                    )}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev => 
                      prev === selectedListing.images.length - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {currentImageIndex + 1} / {selectedListing.images.length}
                  </div>
                </>
              )}
            </div>

            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Property Details */}
                <div>
                  <h1 className="text-2xl font-bold mb-2">{selectedListing.title}</h1>
                  <p className="text-muted-foreground mb-4 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {selectedListing.address}
                  </p>
                  
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      {selectedListing.bedrooms}
                    </span>
                    <span className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      {selectedListing.bathrooms}
                    </span>
                    <span className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      {selectedListing.squareFootage} sq ft
                    </span>
                  </div>

                  <div className="text-3xl font-bold text-primary mb-4">
                    ${selectedListing.rent.toLocaleString()}
                    <span className="text-base font-normal text-muted-foreground">/month</span>
                  </div>

                  <Badge variant="secondary" className="mb-4">
                    {selectedListing.status}
                  </Badge>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground mb-4">{selectedListing.description}</p>
                  
                  <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedListing.amenities.map((amenity: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {amenity}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="text-lg font-semibold mb-2">Pet Policy</h3>
                  <p className="text-muted-foreground mb-4">{selectedListing.petPolicy}</p>
                </div>
              </div>

              {/* Image thumbnails */}
              {selectedListing.images.length > 1 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Photos</h3>
                  <div className="flex gap-2 overflow-x-auto">
                    {selectedListing.images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          currentImageIndex === index ? 'border-primary' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${selectedListing.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex gap-4">
                  <Button className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href)
                      // You could add a toast notification here
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${filteredListings.length} Premium Properties Available - Renter Insight`}</title>
        <meta name="description" content={`Discover ${filteredListings.length} premium rental properties with an average rent of $${Math.round(averageRent).toLocaleString()}. From modern apartments to luxury condos - find your perfect home today!`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={`${filteredListings.length} Premium Properties Available - Renter Insight`} />
        <meta property="og:description" content={`Discover ${filteredListings.length} premium rental properties with an average rent of $${Math.round(averageRent).toLocaleString()}. From modern apartments to luxury condos - find your perfect home today!`} />
        <meta property="og:image" content={filteredListings[0]?.images[0] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Renter Insight" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />
        <meta property="twitter:title" content={`${filteredListings.length} Premium Properties Available - Renter Insight`} />
        <meta property="twitter:description" content={`Discover ${filteredListings.length} premium rental properties with an average rent of $${Math.round(averageRent).toLocaleString()}. From modern apartments to luxury condos - find your perfect home today!`} />
        <meta property="twitter:image" content={filteredListings[0]?.images[0] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop'} />
        
        {/* Additional structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            "name": "Renter Insight",
            "url": window.location.origin,
            "description": "Premium property rental listings and management",
            "offers": filteredListings.map(listing => ({
              "@type": "Offer",
              "name": listing.title,
              "description": listing.description,
              "price": listing.rent,
              "priceCurrency": "USD",
              "availability": "InStock"
            }))
          })}
        </script>
      </Helmet>
      
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">
                  {tenant?.name?.charAt(0) || 'P'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{tenant?.name || 'Property'} Listings</h1>
                <p className="text-muted-foreground">Find your perfect rental home</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {filteredListings.length} properties available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for listing details */}
      <Dialog open={!!selectedListing} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedListing && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedListing.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Image Gallery */}
                <div className="relative">
                  <div className="relative overflow-hidden rounded-lg">
                    <div 
                      className="cursor-pointer"
                      onClick={() => setSelectedListing(selectedListing)}
                    >
                      <img
                        src={selectedListing.images[currentImageIndex]}
                        alt={selectedListing.title}
                        className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                      />
                    </div>
                    
                    {/* Image Navigation */}
                    {selectedListing.images.length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                          onClick={nextImage}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                        
                        {/* Image Counter */}
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                          {currentImageIndex + 1} / {selectedListing.images.length}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Image Thumbnails */}
                  {selectedListing.images.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto">
                      {selectedListing.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className={`w-20 h-20 object-cover rounded cursor-pointer transition-opacity ${
                            index === currentImageIndex ? 'opacity-100 ring-2 ring-blue-500' : 'opacity-60 hover:opacity-80'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Property Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Property Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {selectedListing.address}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          {selectedListing.bedrooms} bed
                        </div>
                        <div className="flex items-center">
                          <Bath className="w-4 h-4 mr-1" />
                          {selectedListing.bathrooms} bath
                        </div>
                        <div className="flex items-center">
                          <Square className="w-4 h-4 mr-1" />
                          {selectedListing.squareFootage} sq ft
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-blue-600">
                        ${selectedListing.rent.toLocaleString()}
                        <span className="text-lg text-gray-500 font-normal">/month</span>
                      </div>
                      <div>
                        <Badge 
                          variant={selectedListing.status === 'active' ? 'default' : 'secondary'}
                          className={selectedListing.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {selectedListing.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Description</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedListing.description}
                    </p>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedListing.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Pet Policy */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Pet Policy</h3>
                  <p className="text-gray-600">{selectedListing.petPolicy}</p>
                </div>

                {/* Contact Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="flex-1" onClick={() => handleContact(selectedListing, 'phone')}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call {selectedListing.contactInfo.phone}
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleContact(selectedListing, 'email')}>
                      <Mail className="w-4 h-4 mr-2" />
                      Email {selectedListing.contactInfo.email}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by location, property type, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-2000">Under $2,000</SelectItem>
                  <SelectItem value="2000-3000">$2,000 - $3,000</SelectItem>
                  <SelectItem value="3000-4000">$3,000 - $4,000</SelectItem>
                  <SelectItem value="4000">$4,000+</SelectItem>
                </SelectContent>
              </Select>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <Home className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No properties found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or check back later for new listings.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                      onClick={() => toggleFavorite(listing.id)}
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          favorites.includes(listing.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-muted-foreground'
                        }`} 
                      />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                      onClick={() => handleShare(listing)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge 
                      variant={listing.status === 'active' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {listing.status}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-1">{listing.title}</CardTitle>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        ${listing.rent.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">/month</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="line-clamp-1">{listing.address}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        {listing.bedrooms}
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        {listing.bathrooms}
                      </div>
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        {listing.squareFootage} sq ft
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {listing.description}
                  </p>
                  
                  {listing.amenities.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {listing.amenities.slice(0, 3).map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {listing.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{listing.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mb-4">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleContact(listing, 'phone')}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleContact(listing, 'email')}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                  </div>

                  {/* View Details Button */}
                  <div className="mb-4">
                    <Button
                      onClick={() => setSelectedListing(listing)}
                      variant="outline"
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}