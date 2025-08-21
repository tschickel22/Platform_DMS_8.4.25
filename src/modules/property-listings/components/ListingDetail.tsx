import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, Eye, Share2, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { PropertyListing } from '@/mocks/propertyListingsMock'

export default function ListingDetail() {
  const { listingId } = useParams<{ listingId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { handleError } = useErrorHandler()
  
  const [listing, setListing] = useState<PropertyListing | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadListing()
  }, [listingId])

  const loadListing = async () => {
    if (!listingId) return
    
    try {
      setLoading(true)
      
      // For now, use local storage to simulate API call
      // In the future, this will be replaced with Rails API call
      const savedListings = localStorage.getItem('property-listings')
      if (savedListings) {
        const listings: PropertyListing[] = JSON.parse(savedListings)
        const found = listings.find(l => l.id === listingId)
        if (found) {
          setListing(found)
        } else {
          throw new Error('Listing not found')
        }
      } else {
        // Use mock data as fallback
        const { mockPropertyListings } = await import('@/mocks/propertyListingsMock')
        const found = mockPropertyListings.find(l => l.id === listingId)
        if (found) {
          setListing(found)
        } else {
          throw new Error('Listing not found')
        }
      }
    } catch (error) {
      handleError(error, 'loading listing')
      navigate('/property/listings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!listing) return
    
    try {
      setSaving(true)
      
      // Update listing in local storage
      // In the future, this will be replaced with Rails API call
      const savedListings = localStorage.getItem('property-listings')
      const listings: PropertyListing[] = savedListings ? JSON.parse(savedListings) : []
      
      const updatedListings = listings.map(l => 
        l.id === listing.id ? { ...listing, updatedAt: new Date().toISOString() } : l
      )
      
      // If listing doesn't exist in saved listings, add it
      if (!listings.find(l => l.id === listing.id)) {
        updatedListings.push({ ...listing, updatedAt: new Date().toISOString() })
      }
      
      localStorage.setItem('property-listings', JSON.stringify(updatedListings))
      
      toast({
        title: 'Success',
        description: 'Listing updated successfully'
      })
    } catch (error) {
      handleError(error, 'saving listing')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!listing || !confirm('Are you sure you want to delete this listing?')) return
    
    try {
      // Delete from local storage
      // In the future, this will be replaced with Rails API call
      const savedListings = localStorage.getItem('property-listings')
      if (savedListings) {
        const listings: PropertyListing[] = JSON.parse(savedListings)
        const filteredListings = listings.filter(l => l.id !== listing.id)
        localStorage.setItem('property-listings', JSON.stringify(filteredListings))
      }
      
      toast({
        title: 'Success',
        description: 'Listing deleted successfully'
      })
      
      navigate('/property/listings')
    } catch (error) {
      handleError(error, 'deleting listing')
    }
  }

  const handlePreview = () => {
    // Open preview in new tab using Bolt hosting URL structure
    const previewUrl = `${window.location.origin}/public/demo/listing/${listing?.id}`
    window.open(previewUrl, '_blank')
  }

  const handleShare = async () => {
    if (!listing) return
    
    try {
      const shareUrl = `${window.location.origin}/public/demo/listing/${listing.id}`
      await navigator.clipboard.writeText(shareUrl)
      
      toast({
        title: 'Link Copied',
        description: 'Listing URL copied to clipboard'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy link to clipboard',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/property/listings')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{listing.title}</h1>
            <p className="text-muted-foreground">
              {listing.location.city}, {listing.location.state}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Core listing details and pricing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={listing.title}
                onChange={(e) => setListing({ ...listing, title: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={listing.description}
                onChange={(e) => setListing({ ...listing, description: e.target.value })}
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="listingType">Listing Type</Label>
                <Select
                  value={listing.listingType}
                  onValueChange={(value: 'manufactured_home' | 'rv') => 
                    setListing({ ...listing, listingType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manufactured_home">Manufactured Home</SelectItem>
                    <SelectItem value="rv">RV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="offerType">Offer Type</Label>
                <Select
                  value={listing.offerType}
                  onValueChange={(value: 'for_sale' | 'for_rent' | 'both') => 
                    setListing({ ...listing, offerType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="for_sale">For Sale</SelectItem>
                    <SelectItem value="for_rent">For Rent</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {(listing.offerType === 'for_sale' || listing.offerType === 'both') && (
                <div>
                  <Label htmlFor="salePrice">Sale Price</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    value={listing.salePrice || ''}
                    onChange={(e) => setListing({ 
                      ...listing, 
                      salePrice: e.target.value ? Number(e.target.value) : undefined 
                    })}
                  />
                </div>
              )}
              
              {(listing.offerType === 'for_rent' || listing.offerType === 'both') && (
                <div>
                  <Label htmlFor="rentPrice">Rent Price</Label>
                  <Input
                    id="rentPrice"
                    type="number"
                    value={listing.rentPrice || ''}
                    onChange={(e) => setListing({ 
                      ...listing, 
                      rentPrice: e.target.value ? Number(e.target.value) : undefined 
                    })}
                  />
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={listing.status}
                onValueChange={(value: 'active' | 'draft' | 'inactive') => 
                  setListing({ ...listing, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle/Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
            <CardDescription>
              Specifications and features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={listing.year}
                  onChange={(e) => setListing({ ...listing, year: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  value={listing.make}
                  onChange={(e) => setListing({ ...listing, make: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={listing.model}
                  onChange={(e) => setListing({ ...listing, model: e.target.value })}
                />
              </div>
            </div>
            
            {listing.listingType === 'manufactured_home' && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={listing.bedrooms || ''}
                    onChange={(e) => setListing({ 
                      ...listing, 
                      bedrooms: e.target.value ? Number(e.target.value) : undefined 
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={listing.bathrooms || ''}
                    onChange={(e) => setListing({ 
                      ...listing, 
                      bathrooms: e.target.value ? Number(e.target.value) : undefined 
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="squareFootage">Square Footage</Label>
                  <Input
                    id="squareFootage"
                    type="number"
                    value={listing.squareFootage || ''}
                    onChange={(e) => setListing({ 
                      ...listing, 
                      squareFootage: e.target.value ? Number(e.target.value) : undefined 
                    })}
                  />
                </div>
              </div>
            )}
            
            {listing.listingType === 'rv' && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="sleeps">Sleeps</Label>
                  <Input
                    id="sleeps"
                    type="number"
                    value={listing.sleeps || ''}
                    onChange={(e) => setListing({ 
                      ...listing, 
                      sleeps: e.target.value ? Number(e.target.value) : undefined 
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="length">Length (ft)</Label>
                  <Input
                    id="length"
                    type="number"
                    value={listing.length || ''}
                    onChange={(e) => setListing({ 
                      ...listing, 
                      length: e.target.value ? Number(e.target.value) : undefined 
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="slides">Slides</Label>
                  <Input
                    id="slides"
                    type="number"
                    value={listing.slides || ''}
                    onChange={(e) => setListing({ 
                      ...listing, 
                      slides: e.target.value ? Number(e.target.value) : undefined 
                    })}
                  />
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={listing.location.city}
                  onChange={(e) => setListing({ 
                    ...listing, 
                    location: { ...listing.location, city: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={listing.location.state}
                  onChange={(e) => setListing({ 
                    ...listing, 
                    location: { ...listing.location, state: e.target.value }
                  })}
                />
              </div>
            </div>
            
            {listing.location.address && (
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={listing.location.address}
                  onChange={(e) => setListing({ 
                    ...listing, 
                    location: { ...listing.location, address: e.target.value }
                  })}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Media Section */}
      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
          <CardDescription>
            Photos and media for this listing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="primaryPhoto">Primary Photo URL</Label>
              <Input
                id="primaryPhoto"
                value={listing.media.primaryPhoto}
                onChange={(e) => setListing({ 
                  ...listing, 
                  media: { ...listing.media, primaryPhoto: e.target.value }
                })}
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            
            {listing.media.primaryPhoto && (
              <div className="mt-4">
                <img 
                  src={listing.media.primaryPhoto} 
                  alt={listing.title}
                  className="w-full max-w-md h-48 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Status:</span>
        <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
          {listing.status}
        </Badge>
      </div>
    </div>
  )
}