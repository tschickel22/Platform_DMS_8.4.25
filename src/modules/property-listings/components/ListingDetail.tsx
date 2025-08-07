import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  DollarSign, 
  Phone, 
  Mail, 
  Globe,
  Calendar,
  Home,
  Car,
  Flame,
  Droplets,
  Zap,
  Wifi,
  Phone as PhoneIcon,
  Tv,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { Listing } from '@/types/listings'

interface ListingDetailProps {
  listing: Listing
  onEdit?: () => void
  onClose?: () => void
}

export default function ListingDetail({ listing, onEdit, onClose }: ListingDetailProps) {
  const isManufacturedHome = listing.propertyType === 'manufactured_home'
  const mh = listing.mhDetails

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatAddress = () => {
    const parts = [
      listing.address,
      listing.address2,
      listing.city,
      listing.state,
      listing.zipCode
    ].filter(Boolean)
    return parts.join(', ')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{listing.title}</h1>
          <div className="flex items-center gap-2 mt-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{formatAddress()}</span>
          </div>
          {listing.preferredTerm && (
            <p className="text-sm text-muted-foreground mt-1">{listing.preferredTerm}</p>
          )}
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <Button onClick={onEdit}>Edit Listing</Button>
          )}
          {onClose && (
            <Button variant="outline" onClick={onClose}>Close</Button>
          )}
        </div>
      </div>

      {/* Status and Pricing */}
      <div className="flex items-center gap-4">
        <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
          {listing.status}
        </Badge>
        {listing.isRepossessed && (
          <Badge variant="destructive">Repossessed</Badge>
        )}
        {listing.pendingSale && (
          <Badge variant="outline">Pending Sale</Badge>
        )}
        {listing.packageType && (
          <Badge variant="outline">{listing.packageType}</Badge>
        )}
      </div>

      {/* Images */}
      {listing.images && listing.images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listing.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Property ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg border"
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <span>{listing.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <span>{listing.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="h-5 w-5 text-muted-foreground" />
                  <span>{listing.squareFootage} sq ft</span>
                </div>
                {listing.yearBuilt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>Built {listing.yearBuilt}</span>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground">{listing.description}</p>
              </div>

              {listing.termsOfSale && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <h4 className="font-medium mb-2">Terms of Sale</h4>
                    <p className="text-muted-foreground">{listing.termsOfSale}</p>
                  </div>
                </>
              )}

              {listing.amenities && listing.amenities.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <h4 className="font-medium mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {listing.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline">{amenity}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <h4 className="font-medium mb-2">Pet Policy</h4>
                <p className="text-muted-foreground">{listing.petPolicy}</p>
              </div>
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listing.county && (
                  <div>
                    <span className="font-medium">County:</span>
                    <span className="ml-2 text-muted-foreground">{listing.county}</span>
                  </div>
                )}
                {listing.township && (
                  <div>
                    <span className="font-medium">Township:</span>
                    <span className="ml-2 text-muted-foreground">{listing.township}</span>
                  </div>
                )}
                {listing.schoolDistrict && (
                  <div>
                    <span className="font-medium">School District:</span>
                    <span className="ml-2 text-muted-foreground">{listing.schoolDistrict}</span>
                  </div>
                )}
                {listing.latitude && listing.longitude && (
                  <div>
                    <span className="font-medium">Coordinates:</span>
                    <span className="ml-2 text-muted-foreground">
                      {listing.latitude.toFixed(6)}, {listing.longitude.toFixed(6)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Manufactured Home Details */}
          {isManufacturedHome && mh && (
            <Card>
              <CardHeader>
                <CardTitle>Manufactured Home Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic MH Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mh.manufacturer && (
                    <div>
                      <span className="font-medium">Manufacturer:</span>
                      <span className="ml-2 text-muted-foreground">{mh.manufacturer}</span>
                    </div>
                  )}
                  {mh.model && (
                    <div>
                      <span className="font-medium">Model:</span>
                      <span className="ml-2 text-muted-foreground">{mh.model}</span>
                    </div>
                  )}
                  {mh.modelYear && (
                    <div>
                      <span className="font-medium">Model Year:</span>
                      <span className="ml-2 text-muted-foreground">{mh.modelYear}</span>
                    </div>
                  )}
                  {mh.color && (
                    <div>
                      <span className="font-medium">Color:</span>
                      <span className="ml-2 text-muted-foreground">{mh.color}</span>
                    </div>
                  )}
                  {mh.serialNumber && (
                    <div>
                      <span className="font-medium">Serial Number:</span>
                      <span className="ml-2 text-muted-foreground">{mh.serialNumber}</span>
                    </div>
                  )}
                  {mh.communityName && (
                    <div>
                      <span className="font-medium">Community:</span>
                      <span className="ml-2 text-muted-foreground">{mh.communityName}</span>
                    </div>
                  )}
                </div>

                {/* Dimensions */}
                {(mh.width1 || mh.length1 || mh.lotSize) && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-3">Dimensions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {mh.width1 && mh.length1 && (
                          <div>
                            <span className="font-medium">Primary:</span>
                            <span className="ml-2 text-muted-foreground">{mh.width1}' × {mh.length1}'</span>
                          </div>
                        )}
                        {mh.width2 && mh.length2 && (
                          <div>
                            <span className="font-medium">Secondary:</span>
                            <span className="ml-2 text-muted-foreground">{mh.width2}' × {mh.length2}'</span>
                          </div>
                        )}
                        {mh.lotSize && (
                          <div>
                            <span className="font-medium">Lot Size:</span>
                            <span className="ml-2 text-muted-foreground">{mh.lotSize}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Construction */}
                {(mh.foundation || mh.roofType || mh.exteriorMaterial) && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-3">Construction</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mh.foundation && (
                          <div>
                            <span className="font-medium">Foundation:</span>
                            <span className="ml-2 text-muted-foreground">{mh.foundation}</span>
                          </div>
                        )}
                        {mh.roofType && (
                          <div>
                            <span className="font-medium">Roof Type:</span>
                            <span className="ml-2 text-muted-foreground">{mh.roofType}</span>
                          </div>
                        )}
                        {mh.roofMaterial && (
                          <div>
                            <span className="font-medium">Roof Material:</span>
                            <span className="ml-2 text-muted-foreground">{mh.roofMaterial}</span>
                          </div>
                        )}
                        {mh.exteriorMaterial && (
                          <div>
                            <span className="font-medium">Exterior:</span>
                            <span className="ml-2 text-muted-foreground">{mh.exteriorMaterial}</span>
                          </div>
                        )}
                        {mh.ceilingMaterial && (
                          <div>
                            <span className="font-medium">Ceiling:</span>
                            <span className="ml-2 text-muted-foreground">{mh.ceilingMaterial}</span>
                          </div>
                        )}
                        {mh.wallMaterial && (
                          <div>
                            <span className="font-medium">Walls:</span>
                            <span className="ml-2 text-muted-foreground">{mh.wallMaterial}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Systems */}
                {(mh.hvacType || mh.waterHeaterType || mh.electricalSystem) && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-3">Systems</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mh.hvacType && (
                          <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">HVAC:</span>
                            <span className="text-muted-foreground">{mh.hvacType}</span>
                          </div>
                        )}
                        {mh.waterHeaterType && (
                          <div className="flex items-center gap-2">
                            <Flame className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Water Heater:</span>
                            <span className="text-muted-foreground">{mh.waterHeaterType}</span>
                          </div>
                        )}
                        {mh.electricalSystem && (
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Electrical:</span>
                            <span className="text-muted-foreground">{mh.electricalSystem}</span>
                          </div>
                        )}
                        {mh.plumbingType && (
                          <div>
                            <span className="font-medium">Plumbing:</span>
                            <span className="ml-2 text-muted-foreground">{mh.plumbingType}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Features Grid */}
                <Separator />
                <div>
                  <h4 className="font-medium mb-3">Features & Amenities</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { key: 'garage', label: 'Garage', icon: Car },
                      { key: 'carport', label: 'Carport', icon: Home },
                      { key: 'centralAir', label: 'Central Air', icon: Droplets },
                      { key: 'fireplace', label: 'Fireplace', icon: Flame },
                      { key: 'storageShed', label: 'Storage Shed', icon: Home },
                      { key: 'deck', label: 'Deck', icon: Home },
                      { key: 'patio', label: 'Patio', icon: Home },
                      { key: 'cathedralCeilings', label: 'Cathedral Ceilings', icon: Home },
                      { key: 'ceilingFans', label: 'Ceiling Fans', icon: Home },
                      { key: 'skylights', label: 'Skylights', icon: Home },
                      { key: 'walkinClosets', label: 'Walk-in Closets', icon: Home },
                      { key: 'laundryRoom', label: 'Laundry Room', icon: Home },
                      { key: 'pantry', label: 'Pantry', icon: Home },
                      { key: 'sunRoom', label: 'Sun Room', icon: Home },
                      { key: 'basement', label: 'Basement', icon: Home },
                      { key: 'gardenTub', label: 'Garden Tub', icon: Bath },
                      { key: 'garbageDisposal', label: 'Garbage Disposal', icon: Home },
                      { key: 'internetReady', label: 'Internet Ready', icon: Wifi },
                      { key: 'cableReady', label: 'Cable Ready', icon: Tv },
                      { key: 'phoneReady', label: 'Phone Ready', icon: PhoneIcon }
                    ].map(({ key, label, icon: Icon }) => {
                      const hasFeature = mh[key as keyof typeof mh]
                      return (
                        <div key={key} className={`flex items-center gap-2 ${hasFeature ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {hasFeature ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          <span className="text-sm">{label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Included Appliances */}
                {(mh.refrigeratorIncluded || mh.microwaveIncluded || mh.ovenIncluded || 
                  mh.dishwasherIncluded || mh.washerIncluded || mh.dryerIncluded) && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-3">Included Appliances</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { key: 'refrigeratorIncluded', label: 'Refrigerator' },
                          { key: 'microwaveIncluded', label: 'Microwave' },
                          { key: 'ovenIncluded', label: 'Oven' },
                          { key: 'dishwasherIncluded', label: 'Dishwasher' },
                          { key: 'washerIncluded', label: 'Washer' },
                          { key: 'dryerIncluded', label: 'Dryer' }
                        ].map(({ key, label }) => {
                          const isIncluded = mh[key as keyof typeof mh]
                          return isIncluded ? (
                            <div key={key} className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm">{label}</span>
                            </div>
                          ) : null
                        })}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
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
              {listing.rent && (
                <div>
                  <span className="font-medium">Monthly Rent:</span>
                  <span className="ml-2 text-lg font-bold text-green-600">
                    {formatCurrency(listing.rent)}
                  </span>
                </div>
              )}
              {listing.purchasePrice && (
                <div>
                  <span className="font-medium">Purchase Price:</span>
                  <span className="ml-2 text-lg font-bold text-blue-600">
                    {formatCurrency(listing.purchasePrice)}
                  </span>
                </div>
              )}
              {listing.lotRent && (
                <div>
                  <span className="font-medium">Lot Rent:</span>
                  <span className="ml-2">{formatCurrency(listing.lotRent)}/month</span>
                </div>
              )}
              {listing.hoaFees && (
                <div>
                  <span className="font-medium">HOA Fees:</span>
                  <span className="ml-2">{formatCurrency(listing.hoaFees)}/month</span>
                </div>
              )}
              {listing.monthlyTax && (
                <div>
                  <span className="font-medium">Monthly Tax:</span>
                  <span className="ml-2">{formatCurrency(listing.monthlyTax)}</span>
                </div>
              )}
              {listing.monthlyUtilities && (
                <div>
                  <span className="font-medium">Monthly Utilities:</span>
                  <span className="ml-2">{formatCurrency(listing.monthlyUtilities)}</span>
                </div>
              )}
              {listing.soldPrice && (
                <div>
                  <span className="font-medium">Sold Price:</span>
                  <span className="ml-2 text-lg font-bold text-gray-600">
                    {formatCurrency(listing.soldPrice)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {listing.contactInfo?.firstName && listing.contactInfo?.lastName && (
                <div>
                  <span className="font-medium">Contact:</span>
                  <span className="ml-2">
                    {listing.contactInfo.firstName} {listing.contactInfo.lastName}
                  </span>
                </div>
              )}
              {listing.contactInfo?.companyName && (
                <div>
                  <span className="font-medium">Company:</span>
                  <span className="ml-2">{listing.contactInfo.companyName}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{listing.contactInfo?.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{listing.contactInfo?.email}</span>
              </div>
              {listing.contactInfo?.alternatePhone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{listing.contactInfo.alternatePhone} (Alt)</span>
                </div>
              )}
              {listing.contactInfo?.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={listing.contactInfo.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Website
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Listing Information */}
          <Card>
            <CardHeader>
              <CardTitle>Listing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {listing.sellerId && (
                <div>
                  <span className="font-medium">Seller ID:</span>
                  <span className="ml-2 text-muted-foreground">{listing.sellerId}</span>
                </div>
              )}
              {listing.companyId && (
                <div>
                  <span className="font-medium">Company ID:</span>
                  <span className="ml-2 text-muted-foreground">{listing.companyId}</span>
                </div>
              )}
              <div>
                <span className="font-medium">Created:</span>
                <span className="ml-2 text-muted-foreground">
                  {new Date(listing.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="font-medium">Updated:</span>
                <span className="ml-2 text-muted-foreground">
                  {new Date(listing.updatedAt).toLocaleDateString()}
                </span>
              </div>
              {listing.searchResultsText && (
                <div>
                  <span className="font-medium">Search Text:</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {listing.searchResultsText}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}