import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Phone, 
  Mail, 
  Heart,
  Share2,
  Search,
  Filter,
  ArrowLeft,
  Car,
  Wifi,
  Dumbbell,
  Waves,
  TreePine,
  Utensils,
  Zap,
  Shield,
  PawPrint,
  Home
} from 'lucide-react'
import { mockListings } from '@/mocks/listingsMock'
import { useTenant } from '@/contexts/TenantContext'
import { Helmet } from 'react-helmet-async'

export default function PublicListingView() {
  const { listingId } = useParams()
  const navigate = useNavigate()
  const { tenant } = useTenant()
  const [searchTerm, setSearchTerm] = useState('')
  const [priceFilter, setPriceFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Get the specific listing if listingId is provided
  const selectedListing = listingId ? mockListings.find(listing => listing.id === listingId) : null

  // Filter listings for the grid view
  const filteredListings = useMemo(() => {
    return mockListings.filter(listing => {
      const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          listing.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesPrice = priceFilter === 'all' || 
                          (priceFilter === 'under-2000' && listing.rent < 2000) ||
                          (priceFilter === '2000-3000' && listing.rent >= 2000 && listing.rent <= 3000) ||
                          (priceFilter === 'over-3000' && listing.rent > 3000)
      
      const matchesType = typeFilter === 'all' || listing.propertyType === typeFilter

      return matchesSearch && matchesPrice && matchesType && listing.status === 'active'
    })
  }, [searchTerm, priceFilter, typeFilter])

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase()
    if (amenityLower.includes('parking') || amenityLower.includes('garage')) return Car
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return Wifi
    if (amenityLower.includes('gym') || amenityLower.includes('fitness')) return Dumbbell
    if (amenityLower.includes('pool')) return Waves
    if (amenityLower.includes('garden') || amenityLower.includes('yard')) return TreePine
    if (amenityLower.includes('kitchen') || amenityLower.includes('dishwasher')) return Utensils
    if (amenityLower.includes('laundry') || amenityLower.includes('washer')) return Zap
    if (amenityLower.includes('security') || amenityLower.includes('secure')) return Shield
    if (amenityLower.includes('pet') || amenityLower.includes('dog') || amenityLower.includes('cat')) return PawPrint
    return Home
  }

  const handleShare = async (listing: any) => {
    const shareUrl = `${window.location.origin}/public/listings/${listing.id}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: `Check out this property: ${listing.title}`,
          url: shareUrl,
        })
      } catch (err) {
        console.log('Error sharing:', err)
        // Fallback to clipboard
        navigator.clipboard.writeText(shareUrl)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareUrl)
    }
  }

  // If we have a specific listing ID, render the single listing view
  if (selectedListing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Helmet>
          <title>{selectedListing.title} - {tenant?.name || 'Property Listings'}</title>
          <meta name="description" content={selectedListing.description} />
          <meta property="og:title" content={selectedListing.title} />
          <meta property="og:description" content={selectedListing.description} />
          <meta property="og:image" content={selectedListing.images[0]} />
          <meta property="og:url" content={`${window.location.origin}/public/listings/${selectedListing.id}`} />
        </Helmet>

        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/public/listings')}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to All Listings</span>
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleShare(selectedListing)}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Images and Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedListing.images.map((image, index) => (
                  <div key={index} className={`${index === 0 ? 'md:col-span-2' : ''} aspect-video rounded-lg overflow-hidden`}>
                    <img 
                      src={image} 
                      alt={`${selectedListing.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>

              {/* Property Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{selectedListing.title}</CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {selectedListing.address}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">
                        ${selectedListing.rent.toLocaleString()}
                        <span className="text-sm font-normal text-muted-foreground">/month</span>
                      </div>
                      <Badge variant="secondary" className="mt-1">
                        {selectedListing.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Property Stats */}
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Bed className="h-5 w-5 text-muted-foreground" />
                      <span>{selectedListing.bedrooms} bed{selectedListing.bedrooms !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bath className="h-5 w-5 text-muted-foreground" />
                      <span>{selectedListing.bathrooms} bath{selectedListing.bathrooms !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Square className="h-5 w-5 text-muted-foreground" />
                      <span>{selectedListing.squareFootage.toLocaleString()} sq ft</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedListing.description}
                    </p>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h3 className="font-semibold mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedListing.amenities.map((amenity, index) => {
                        const IconComponent = getAmenityIcon(amenity)
                        return (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                            <IconComponent className="h-4 w-4 text-primary" />
                            <span className="text-sm">{amenity}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Pet Policy */}
                  <div>
                    <h3 className="font-semibold mb-2">Pet Policy</h3>
                    <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                      <PawPrint className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-800">{selectedListing.petPolicy}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" size="lg">
                    <Phone className="h-4 w-4 mr-2" />
                    {selectedListing.contactInfo.phone}
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Contact us to schedule a viewing or ask questions about this property.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Property Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Property Type</span>
                      <span className="font-medium capitalize">{selectedListing.propertyType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Available</span>
                      <span className="font-medium">Now</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lease Term</span>
                      <span className="font-medium">12+ months</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Otherwise, render the listings grid
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{tenant?.name || 'Demo RV Dealership'} Listings</title>
        <meta name="description" content="Find your perfect rental home" />
        <meta property="og:title" content={`${tenant?.name || 'Demo RV Dealership'} Listings`} />
        <meta property="og:description" content="Find your perfect rental home" />
        <meta property="og:image" content="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg" />
      </Helmet>

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                {tenant?.name?.charAt(0) || 'D'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{tenant?.name || 'Demo RV Dealership'} Listings</h1>
              <p className="text-muted-foreground">Find your perfect rental home</p>
            </div>
            <div className="ml-auto">
              <Badge variant="secondary" className="text-sm">
                {filteredListings.length} properties available
              </Badge>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by location, property type, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-2000">Under $2,000</SelectItem>
                <SelectItem value="2000-3000">$2,000 - $3,000</SelectItem>
                <SelectItem value="over-3000">Over $3,000</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card 
                key={listing.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => navigate(`/public/listings/${listing.id}`)}
              >
                <div className="relative">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary text-primary-foreground">
                      {listing.status}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Add to favorites logic
                      }}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleShare(listing)
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {listing.propertyType === 'house' && (
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="outline" className="bg-white/90 text-xs">
                        SVP
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {listing.title}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {listing.address}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-primary">
                        ${listing.rent.toLocaleString()}
                        <span className="text-sm font-normal text-muted-foreground">/month</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Bed className="h-4 w-4" />
                        <span>{listing.bedrooms}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Bath className="h-4 w-4" />
                        <span>{listing.bathrooms}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Square className="h-4 w-4" />
                        <span>{listing.squareFootage} sq ft</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {listing.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {listing.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
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
                </CardContent>
                
                <div className="px-4 pb-4 flex space-x-2">
                  <Button className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
                
                <div className="px-4 pb-4">
                  <Button 
                    variant="ghost" 
                    className="w-full text-primary hover:text-primary hover:bg-primary/10"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/public/listings/${listing.id}`)
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}