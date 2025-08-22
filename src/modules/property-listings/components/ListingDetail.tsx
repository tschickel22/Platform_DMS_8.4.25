import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  Edit, 
  Share, 
  Download, 
  Eye,
  MapPin,
  Calendar,
  DollarSign,
  Home,
  Car,
  ExternalLink,
  BarChart3,
  Copy,
  Globe
} from 'lucide-react'
import { PropertyListing, ListingAnalytics } from '../types'
import { usePropertyListings } from '../hooks/usePropertyListings'
import { propertyListingsService } from '../services/propertyListingsService'
import { ShareListingModal } from './ShareListingModal'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

// Helper function to get type icon
function getTypeIcon(type: string) {
  return type === 'rv' ? Car : Home
}

// Helper function to get status color
function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'draft':
      return 'bg-yellow-100 text-yellow-800'
    case 'inactive':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function ListingDetail() {
  const { listingId } = useParams<{ listingId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { listings, loading } = usePropertyListings()
  
  const [listing, setListing] = useState<PropertyListing | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<string>('')
  const [analytics, setAnalytics] = useState<ListingAnalytics | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    if (listingId && listings.length > 0) {
      const found = listings.find(l => l.id === listingId)
      setListing(found || null)
      setSelectedPhoto(found?.media.primaryPhoto || '')
      
      // Load analytics
      if (found) {
        loadAnalytics(listingId)
      }
    }
  }, [listingId, listings])

  const loadAnalytics = async (id: string) => {
    try {
      const analyticsData = await propertyListingsService.getListingAnalytics(id)
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    }
  }

  const handleEdit = () => {
    navigate(`/property/listings/${listingId}/edit`)
  }

  const handleQuickShare = () => {
    const url = `${window.location.origin}/public/demo/listing/${listingId}`
    navigator.clipboard.writeText(url)
    toast({
      title: 'URL Copied!',
      description: 'Listing URL copied to clipboard.'
    })
  }

  const handlePreview = () => {
    const url = `${window.location.origin}/public/demo/listing/${listingId}`
    window.open(url, '_blank')
  }

  const handleExport = async () => {
    if (!listing) return
    
    try {
      const csvData = await propertyListingsService.exportListings({
        format: 'CSV',
        includePhotos: false,
        includePrivateFields: false,
        filterBy: {
          status: [listing.status]
        }
      })
      
      // Create and download file
      const blob = new Blob([csvData], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `listing-${listing.id}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        title: 'Export Complete',
        description: 'Listing data exported successfully.'
      })
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export listing data.',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading listing...</p>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Listing Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The listing you're looking for could not be found.
            </p>
            <Button onClick={() => navigate('/property/listings')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Listings
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const TypeIcon = getTypeIcon(listing.listingType)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/property/listings')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Listings
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TypeIcon className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-2xl font-bold">{listing.title}</h1>
                <Badge className={getStatusColor(listing.status)}>
                  {listing.status}
                </Badge>
                {listing.isPublic && (
                  <Badge variant="outline">
                    <Globe className="h-3 w-3 mr-1" />
                    Public
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">
                {listing.year} {listing.make} {listing.model}
                {listing.stockNumber && ` • Stock #${listing.stockNumber}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" onClick={() => setShowShareModal(true)}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Gallery */}
            <Card>
              <CardContent className="p-0">
                {/* Main Photo */}
                <div className="h-96 bg-gray-100 relative">
                  {selectedPhoto ? (
                    <img
                      src={selectedPhoto}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <TypeIcon className="h-24 w-24 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Photo Counter */}
                  {listing.media.photos.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      {listing.media.photos.findIndex(p => p === selectedPhoto) + 1} / {listing.media.photos.length}
                    </div>
                  )}
                </div>
                
                {/* Photo Thumbnails */}
                {listing.media.photos.length > 1 && (
                  <div className="p-4 border-t">
                    <div className="flex gap-2 overflow-x-auto">
                      {listing.media.photos.map((photo, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedPhoto(photo)}
                          className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                            selectedPhoto === photo ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300'
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
              </CardContent>
            </Card>

            {/* Description & Details */}
            <Tabs defaultValue="description" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="description">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {listing.description || 'No description available.'}
                      </p>
                      
                      {listing.searchResultsText && (
                        <div>
                          <Label className="text-sm font-medium">Search Results Text</Label>
                          <p className="text-sm text-muted-foreground">{listing.searchResultsText}</p>
                        </div>
                      )}
                      
                      {listing.keywords && listing.keywords.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium">Keywords</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {listing.keywords.map((keyword, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Basic Specs */}
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Year</Label>
                        <p>{listing.year}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Make</Label>
                        <p>{listing.make}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Model</Label>
                        <p>{listing.model}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Condition</Label>
                        <p className="capitalize">{listing.condition}</p>
                      </div>
                      
                      {/* VIN/Serial */}
                      {listing.vin && (
                        <div className="col-span-2">
                          <Label className="text-sm font-medium text-muted-foreground">VIN</Label>
                          <p className="font-mono text-sm">{listing.vin}</p>
                        </div>
                      )}
                      {listing.serialNumber && (
                        <div className="col-span-2">
                          <Label className="text-sm font-medium text-muted-foreground">Serial Number</Label>
                          <p className="font-mono text-sm">{listing.serialNumber}</p>
                        </div>
                      )}
                      
                      {/* RV Specific */}
                      {listing.listingType === 'rv' && (
                        <>
                          {listing.sleeps && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Sleeps</Label>
                              <p>{listing.sleeps}</p>
                            </div>
                          )}
                          {listing.length && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Length</Label>
                              <p>{listing.length} ft</p>
                            </div>
                          )}
                          {listing.slides && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Slide Outs</Label>
                              <p>{listing.slides}</p>
                            </div>
                          )}
                          {listing.fuelType && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Fuel Type</Label>
                              <p className="capitalize">{listing.fuelType}</p>
                            </div>
                          )}
                          {listing.engine && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Engine</Label>
                              <p>{listing.engine}</p>
                            </div>
                          )}
                          {listing.odometerMiles && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Mileage</Label>
                              <p>{listing.odometerMiles.toLocaleString()} miles</p>
                            </div>
                          )}
                        </>
                      )}
                      
                      {/* Manufactured Home Specific */}
                      {listing.listingType === 'manufactured_home' && (
                        <>
                          {listing.bedrooms && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Bedrooms</Label>
                              <p>{listing.bedrooms}</p>
                            </div>
                          )}
                          {listing.bathrooms && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Bathrooms</Label>
                              <p>{listing.bathrooms}</p>
                            </div>
                          )}
                          {listing.dimensions?.sqft && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Square Feet</Label>
                              <p>{listing.dimensions.sqft.toLocaleString()}</p>
                            </div>
                          )}
                          {listing.dimensions?.width_ft && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Width</Label>
                              <p>{listing.dimensions.width_ft} ft</p>
                            </div>
                          )}
                          {listing.dimensions?.length_ft && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Length</Label>
                              <p>{listing.dimensions.length_ft} ft</p>
                            </div>
                          )}
                          {listing.dimensions?.sections && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Sections</Label>
                              <p>{listing.dimensions.sections}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features">
                <Card>
                  <CardHeader>
                    <CardTitle>Features & Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {Object.keys(listing.features).length > 0 ? (
                      <div className="space-y-4">
                        {/* Boolean Features */}
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(listing.features)
                            .filter(([_, value]) => typeof value === 'boolean')
                            .map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between">
                                <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                <Badge variant={value ? 'default' : 'outline'} className="text-xs">
                                  {value ? 'Yes' : 'No'}
                                </Badge>
                              </div>
                            ))}
                        </div>
                        
                        {/* Array Features */}
                        {Object.entries(listing.features)
                          .filter(([_, value]) => Array.isArray(value))
                          .map(([key, value]) => (
                            <div key={key}>
                              <Label className="text-sm font-medium capitalize">
                                {key.replace(/([A-Z])/g, ' $1')}
                              </Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {(value as string[]).map((item, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No features listed.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Performance Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analytics ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-primary">{analytics.views}</p>
                            <p className="text-sm text-muted-foreground">Views</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{analytics.leads}</p>
                            <p className="text-sm text-muted-foreground">Leads</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{analytics.shares}</p>
                            <p className="text-sm text-muted-foreground">Shares</p>
                          </div>
                        </div>
                        
                        {analytics.conversionRate > 0 && (
                          <div>
                            <Label className="text-sm font-medium">Conversion Rate</Label>
                            <p className="text-lg font-semibold text-green-600">
                              {analytics.conversionRate.toFixed(1)}%
                            </p>
                          </div>
                        )}
                        
                        {analytics.lastViewed && (
                          <div>
                            <Label className="text-sm font-medium">Last Viewed</Label>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(analytics.lastViewed)}
                            </p>
                          </div>
                        )}
                        
                        {analytics.topSources.length > 0 && (
                          <div>
                            <Label className="text-sm font-medium">Top Traffic Sources</Label>
                            <div className="space-y-1 mt-1">
                              {analytics.topSources.slice(0, 3).map((source, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span className="capitalize">{source.source}</span>
                                  <span className="text-muted-foreground">{source.count} views</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No analytics data available.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {listing.salePrice && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Sale Price</Label>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(listing.salePrice)}
                    </p>
                  </div>
                )}
                {listing.rentPrice && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Rent Price</Label>
                    <p className="text-xl font-semibold">
                      {formatCurrency(listing.rentPrice)}/month
                    </p>
                  </div>
                )}
                {listing.lotRent && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Lot Rent</Label>
                    <p>{formatCurrency(listing.lotRent)}/month</p>
                  </div>
                )}
                {listing.taxes && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Annual Taxes</Label>
                    <p>{formatCurrency(listing.taxes)}/year</p>
                  </div>
                )}
                {listing.hoa && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">HOA Fees</Label>
                    <p>{formatCurrency(listing.hoa)}/month</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">{listing.location.city}, {listing.location.state}</p>
                {listing.location.postalCode && (
                  <p className="text-sm text-muted-foreground">{listing.location.postalCode}</p>
                )}
                {listing.location.address && (
                  <p className="text-sm text-muted-foreground">{listing.location.address}</p>
                )}
                {listing.location.communityName && (
                  <p className="text-sm text-muted-foreground">{listing.location.communityName}</p>
                )}
                {listing.location.township && (
                  <p className="text-sm text-muted-foreground">Township: {listing.location.township}</p>
                )}
                {listing.location.schoolDistrict && (
                  <p className="text-sm text-muted-foreground">School District: {listing.location.schoolDistrict}</p>
                )}
              </CardContent>
            </Card>

            {/* Listing Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Listing Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                  <p>{formatDate(listing.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                  <p>{formatDate(listing.updatedAt)}</p>
                </div>
                {listing.publishedAt && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Published</Label>
                    <p>{formatDate(listing.publishedAt)}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Listing Type</Label>
                  <p className="capitalize">{listing.listingType.replace('_', ' ')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Offer Type</Label>
                  <p className="capitalize">{listing.offerType.replace('_', ' ')}</p>
                </div>
                
                {/* Share Info */}
                {listing.shareToken && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Share Token</Label>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-mono text-muted-foreground flex-1">{listing.shareToken}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/public/demo/l/${listing.shareToken}`)
                          toast({ title: 'Copied!', description: 'Share URL copied to clipboard.' })
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Listing
                </Button>
                <Button variant="outline" className="w-full" onClick={handlePreview}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview Public View
                </Button>
                <Button variant="outline" className="w-full" onClick={handleQuickShare}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Share URL
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setShowShareModal(true)}>
                  <Share className="h-4 w-4 mr-2" />
                  Advanced Sharing
                </Button>
                <Button variant="outline" className="w-full" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareListingModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        listingId={listing.id}
        listingTitle={listing.title}
        mode="single"
      />
    </div>
  )
}