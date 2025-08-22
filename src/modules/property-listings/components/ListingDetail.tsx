import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MapPin, 
  DollarSign, 
  Home, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Phone,
  Mail,
  Globe,
  User,
  Building,
  Car,
  Flame,
  Droplets,
  Zap,
  Wifi,
  Camera,
  Play,
  FileText,
  Eye,
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
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const BooleanIndicator = ({ value, label }: { value?: boolean; label: string }) => (
    <div className="flex items-center gap-2">
      {value ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-gray-400" />
      )}
      <span className={value ? 'text-foreground' : 'text-muted-foreground'}>{label}</span>
    </div>
  )

  const isManufacturedHome = listing.propertyType === 'manufactured_home'

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">{listing.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 text-lg">
                <MapPin className="h-4 w-4" />
                {listing.address}
                {listing.address2 && `, ${listing.address2}`}
                {listing.city && listing.state && `, ${listing.city}, ${listing.state}`}
                {listing.zipCode && ` ${listing.zipCode}`}
              </CardDescription>
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
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="mh-details" disabled={!isManufacturedHome}>MH Details</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Price and Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="font-medium">
                        {listing.listingType === 'rent' ? 'Monthly Rent' : 'Purchase Price'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold">
                      {listing.listingType === 'rent' 
                        ? formatPrice(listing.rent || 0)
                        : formatPrice(listing.purchasePrice || 0)
                      }
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Bed className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Bedrooms</span>
                    </div>
                    <div className="text-2xl font-bold">{listing.bedrooms}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Bath className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Bathrooms</span>
                    </div>
                    <div className="text-2xl font-bold">{listing.bathrooms}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Square className="h-5 w-5 text-orange-600" />
                      <span className="font-medium">Square Feet</span>
                    </div>
                    <div className="text-2xl font-bold">{listing.squareFootage.toLocaleString()}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Pricing */}
              {(listing.lotRent || listing.hoaFees || listing.monthlyTax || listing.monthlyUtilities) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Additional Monthly Costs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {listing.lotRent && (
                        <div>
                          <span className="text-sm text-muted-foreground">Lot Rent</span>
                          <div className="font-semibold">{formatPrice(listing.lotRent)}</div>
                        </div>
                      )}
                      {listing.hoaFees && (
                        <div>
                          <span className="text-sm text-muted-foreground">HOA Fees</span>
                          <div className="font-semibold">{formatPrice(listing.hoaFees)}</div>
                        </div>
                      )}
                      {listing.monthlyTax && (
                        <div>
                          <span className="text-sm text-muted-foreground">Monthly Tax</span>
                          <div className="font-semibold">{formatPrice(listing.monthlyTax)}</div>
                        </div>
                      )}
                      {listing.monthlyUtilities && (
                        <div>
                          <span className="text-sm text-muted-foreground">Est. Utilities</span>
                          <div className="font-semibold">{formatPrice(listing.monthlyUtilities)}</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
                  {listing.termsOfSale && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Terms of Sale</h4>
                      <p className="text-muted-foreground">{listing.termsOfSale}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Status and Flags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Listing Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                      {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </Badge>
                    {listing.isRepossessed && (
                      <Badge variant="destructive">Repossessed</Badge>
                    )}
                    {listing.pendingSale && (
                      <Badge variant="outline">Pending Sale</Badge>
                    )}
                    {listing.packageType && (
                      <Badge variant="outline">{listing.packageType} Package</Badge>
                    )}
                  </div>
                  {listing.searchResultsText && (
                    <div className="mt-3">
                      <span className="text-sm text-muted-foreground">Search Results Text:</span>
                      <p className="text-sm">{listing.searchResultsText}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              {/* Property Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Property Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Property Type</span>
                      <div className="font-semibold capitalize">{listing.propertyType.replace('_', ' ')}</div>
                    </div>
                    {listing.yearBuilt && (
                      <div>
                        <span className="text-sm text-muted-foreground">Year Built</span>
                        <div className="font-semibold">{listing.yearBuilt}</div>
                      </div>
                    )}
                    {listing.preferredTerm && (
                      <div>
                        <span className="text-sm text-muted-foreground">Preferred Term</span>
                        <div className="font-semibold">{listing.preferredTerm}</div>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-muted-foreground">Pet Policy</span>
                      <div className="font-semibold">{listing.petPolicy}</div>
                    </div>
                    {listing.soldPrice && (
                      <div>
                        <span className="text-sm text-muted-foreground">Sold Price</span>
                        <div className="font-semibold">{formatPrice(listing.soldPrice)}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Location Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {listing.county && (
                      <div>
                        <span className="text-sm text-muted-foreground">County</span>
                        <div className="font-semibold">{listing.county}</div>
                      </div>
                    )}
                    {listing.township && (
                      <div>
                        <span className="text-sm text-muted-foreground">Township</span>
                        <div className="font-semibold">{listing.township}</div>
                      </div>
                    )}
                    {listing.schoolDistrict && (
                      <div>
                        <span className="text-sm text-muted-foreground">School District</span>
                        <div className="font-semibold">{listing.schoolDistrict}</div>
                      </div>
                    )}
                    {listing.latitude && listing.longitude && (
                      <>
                        <div>
                          <span className="text-sm text-muted-foreground">Latitude</span>
                          <div className="font-semibold">{listing.latitude}</div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Longitude</span>
                          <div className="font-semibold">{listing.longitude}</div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Listing Dates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Listing Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Created</span>
                      <div className="font-semibold">{formatDate(listing.createdAt)}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Last Updated</span>
                      <div className="font-semibold">{formatDate(listing.updatedAt)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              {/* Amenities */}
              {listing.amenities && listing.amenities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {listing.amenities.map((amenity, index) => (
                        <Badge key={index} variant="secondary">{amenity}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Outdoor Features */}
              {listing.outdoorFeatures && listing.outdoorFeatures.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Outdoor Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {listing.outdoorFeatures.map((feature, index) => (
                        <Badge key={index} variant="outline">{feature}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Storage Options */}
              {listing.storageOptions && listing.storageOptions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Storage Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {listing.storageOptions.map((option, index) => (
                        <Badge key={index} variant="outline">{option}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Technology Features */}
              {listing.technologyFeatures && listing.technologyFeatures.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Technology Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {listing.technologyFeatures.map((feature, index) => (
                        <Badge key={index} variant="outline">{feature}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Community Amenities */}
              {listing.communityAmenities && listing.communityAmenities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Community Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {listing.communityAmenities.map((amenity, index) => (
                        <Badge key={index} variant="outline">{amenity}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="mh-details" className="space-y-6">
              {isManufacturedHome && listing.mhDetails && (
                <>
                  {/* Basic MH Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Home className="h-5 w-5" />
                        Manufactured Home Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {listing.mhDetails.manufacturer && (
                          <div>
                            <span className="text-sm text-muted-foreground">Manufacturer</span>
                            <div className="font-semibold">{listing.mhDetails.manufacturer}</div>
                          </div>
                        )}
                        {listing.mhDetails.model && (
                          <div>
                            <span className="text-sm text-muted-foreground">Model</span>
                            <div className="font-semibold">{listing.mhDetails.model}</div>
                          </div>
                        )}
                        {listing.mhDetails.modelYear && (
                          <div>
                            <span className="text-sm text-muted-foreground">Model Year</span>
                            <div className="font-semibold">{listing.mhDetails.modelYear}</div>
                          </div>
                        )}
                        {listing.mhDetails.serialNumber && (
                          <div>
                            <span className="text-sm text-muted-foreground">Serial Number</span>
                            <div className="font-semibold">{listing.mhDetails.serialNumber}</div>
                          </div>
                        )}
                        {listing.mhDetails.color && (
                          <div>
                            <span className="text-sm text-muted-foreground">Color</span>
                            <div className="font-semibold">{listing.mhDetails.color}</div>
                          </div>
                        )}
                        {listing.mhDetails.communityName && (
                          <div>
                            <span className="text-sm text-muted-foreground">Community</span>
                            <div className="font-semibold">{listing.mhDetails.communityName}</div>
                          </div>
                        )}
                        {listing.mhDetails.propertyId && (
                          <div>
                            <span className="text-sm text-muted-foreground">Property ID</span>
                            <div className="font-semibold">{listing.mhDetails.propertyId}</div>
                          </div>
                        )}
                        {listing.mhDetails.lotSize && (
                          <div>
                            <span className="text-sm text-muted-foreground">Lot Size</span>
                            <div className="font-semibold">{listing.mhDetails.lotSize}</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dimensions */}
                  {(listing.mhDetails.width1 || listing.mhDetails.length1) && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Dimensions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                          {listing.mhDetails.width1 && (
                            <div>
                              <span className="text-sm text-muted-foreground">Width 1</span>
                              <div className="font-semibold">{listing.mhDetails.width1}'</div>
                            </div>
                          )}
                          {listing.mhDetails.length1 && (
                            <div>
                              <span className="text-sm text-muted-foreground">Length 1</span>
                              <div className="font-semibold">{listing.mhDetails.length1}'</div>
                            </div>
                          )}
                          {listing.mhDetails.width2 && (
                            <div>
                              <span className="text-sm text-muted-foreground">Width 2</span>
                              <div className="font-semibold">{listing.mhDetails.width2}'</div>
                            </div>
                          )}
                          {listing.mhDetails.length2 && (
                            <div>
                              <span className="text-sm text-muted-foreground">Length 2</span>
                              <div className="font-semibold">{listing.mhDetails.length2}'</div>
                            </div>
                          )}
                          {listing.mhDetails.width3 && (
                            <div>
                              <span className="text-sm text-muted-foreground">Width 3</span>
                              <div className="font-semibold">{listing.mhDetails.width3}'</div>
                            </div>
                          )}
                          {listing.mhDetails.length3 && (
                            <div>
                              <span className="text-sm text-muted-foreground">Length 3</span>
                              <div className="font-semibold">{listing.mhDetails.length3}'</div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Construction Materials */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Construction & Materials
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {listing.mhDetails.foundation && (
                          <div>
                            <span className="text-sm text-muted-foreground">Foundation</span>
                            <div className="font-semibold">{listing.mhDetails.foundation}</div>
                          </div>
                        )}
                        {listing.mhDetails.roofType && (
                          <div>
                            <span className="text-sm text-muted-foreground">Roof Type</span>
                            <div className="font-semibold">{listing.mhDetails.roofType}</div>
                          </div>
                        )}
                        {listing.mhDetails.roofMaterial && (
                          <div>
                            <span className="text-sm text-muted-foreground">Roof Material</span>
                            <div className="font-semibold">{listing.mhDetails.roofMaterial}</div>
                          </div>
                        )}
                        {listing.mhDetails.exteriorMaterial && (
                          <div>
                            <span className="text-sm text-muted-foreground">Exterior Material</span>
                            <div className="font-semibold">{listing.mhDetails.exteriorMaterial}</div>
                          </div>
                        )}
                        {listing.mhDetails.ceilingMaterial && (
                          <div>
                            <span className="text-sm text-muted-foreground">Ceiling Material</span>
                            <div className="font-semibold">{listing.mhDetails.ceilingMaterial}</div>
                          </div>
                        )}
                        {listing.mhDetails.wallMaterial && (
                          <div>
                            <span className="text-sm text-muted-foreground">Wall Material</span>
                            <div className="font-semibold">{listing.mhDetails.wallMaterial}</div>
                          </div>
                        )}
                        {listing.mhDetails.flooringType && (
                          <div>
                            <span className="text-sm text-muted-foreground">Flooring</span>
                            <div className="font-semibold">{listing.mhDetails.flooringType}</div>
                          </div>
                        )}
                        {listing.mhDetails.windowType && (
                          <div>
                            <span className="text-sm text-muted-foreground">Windows</span>
                            <div className="font-semibold">{listing.mhDetails.windowType}</div>
                          </div>
                        )}
                        {listing.mhDetails.insulationType && (
                          <div>
                            <span className="text-sm text-muted-foreground">Insulation</span>
                            <div className="font-semibold">{listing.mhDetails.insulationType}</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Systems */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Systems
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {listing.mhDetails.hvacType && (
                          <div>
                            <span className="text-sm text-muted-foreground">HVAC</span>
                            <div className="font-semibold">{listing.mhDetails.hvacType}</div>
                          </div>
                        )}
                        {listing.mhDetails.waterHeaterType && (
                          <div>
                            <span className="text-sm text-muted-foreground">Water Heater</span>
                            <div className="font-semibold">{listing.mhDetails.waterHeaterType}</div>
                          </div>
                        )}
                        {listing.mhDetails.electricalSystem && (
                          <div>
                            <span className="text-sm text-muted-foreground">Electrical</span>
                            <div className="font-semibold">{listing.mhDetails.electricalSystem}</div>
                          </div>
                        )}
                        {listing.mhDetails.plumbingType && (
                          <div>
                            <span className="text-sm text-muted-foreground">Plumbing</span>
                            <div className="font-semibold">{listing.mhDetails.plumbingType}</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Kitchen Appliances */}
                  {listing.mhDetails.kitchenAppliances && listing.mhDetails.kitchenAppliances.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Kitchen Appliances</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {listing.mhDetails.kitchenAppliances.map((appliance, index) => (
                            <Badge key={index} variant="secondary">{appliance}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Features & Amenities */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Home Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <BooleanIndicator value={listing.mhDetails.garage} label="Garage" />
                        <BooleanIndicator value={listing.mhDetails.carport} label="Carport" />
                        <BooleanIndicator value={listing.mhDetails.centralAir} label="Central Air" />
                        <BooleanIndicator value={listing.mhDetails.thermopaneWindows} label="Thermopane Windows" />
                        <BooleanIndicator value={listing.mhDetails.fireplace} label="Fireplace" />
                        <BooleanIndicator value={listing.mhDetails.storageShed} label="Storage Shed" />
                        <BooleanIndicator value={listing.mhDetails.gutters} label="Gutters" />
                        <BooleanIndicator value={listing.mhDetails.shutters} label="Shutters" />
                        <BooleanIndicator value={listing.mhDetails.deck} label="Deck" />
                        <BooleanIndicator value={listing.mhDetails.patio} label="Patio" />
                        <BooleanIndicator value={listing.mhDetails.cathedralCeilings} label="Cathedral Ceilings" />
                        <BooleanIndicator value={listing.mhDetails.ceilingFans} label="Ceiling Fans" />
                        <BooleanIndicator value={listing.mhDetails.skylights} label="Skylights" />
                        <BooleanIndicator value={listing.mhDetails.walkinClosets} label="Walk-in Closets" />
                        <BooleanIndicator value={listing.mhDetails.laundryRoom} label="Laundry Room" />
                        <BooleanIndicator value={listing.mhDetails.pantry} label="Pantry" />
                        <BooleanIndicator value={listing.mhDetails.sunRoom} label="Sun Room" />
                        <BooleanIndicator value={listing.mhDetails.basement} label="Basement" />
                        <BooleanIndicator value={listing.mhDetails.gardenTub} label="Garden Tub" />
                        <BooleanIndicator value={listing.mhDetails.garbageDisposal} label="Garbage Disposal" />
                        <BooleanIndicator value={listing.mhDetails.laundryHookups} label="Laundry Hookups" />
                        <BooleanIndicator value={listing.mhDetails.internetReady} label="Internet Ready" />
                        <BooleanIndicator value={listing.mhDetails.cableReady} label="Cable Ready" />
                        <BooleanIndicator value={listing.mhDetails.phoneReady} label="Phone Ready" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Included Appliances */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Included Appliances</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <BooleanIndicator value={listing.mhDetails.refrigeratorIncluded} label="Refrigerator" />
                        <BooleanIndicator value={listing.mhDetails.microwaveIncluded} label="Microwave" />
                        <BooleanIndicator value={listing.mhDetails.ovenIncluded} label="Oven" />
                        <BooleanIndicator value={listing.mhDetails.dishwasherIncluded} label="Dishwasher" />
                        <BooleanIndicator value={listing.mhDetails.washerIncluded} label="Washer" />
                        <BooleanIndicator value={listing.mhDetails.dryerIncluded} label="Dryer" />
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              {/* Images */}
              {listing.images && listing.images.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Images ({listing.images.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {listing.images.map((image, index) => (
                        <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`Property image ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                            onClick={() => window.open(image, '_blank')}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Videos */}
              {listing.videos && listing.videos.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="h-5 w-5" />
                      Videos ({listing.videos.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {listing.videos.map((video, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                          <Play className="h-4 w-4" />
                          <a
                            href={video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex-1"
                          >
                            Video {index + 1}
                          </a>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Floor Plans */}
              {listing.floorPlans && listing.floorPlans.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Floor Plans ({listing.floorPlans.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {listing.floorPlans.map((plan, index) => (
                        <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                          <img
                            src={plan}
                            alt={`Floor plan ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                            onClick={() => window.open(plan, '_blank')}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Virtual Tours */}
              {listing.virtualTours && listing.virtualTours.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Virtual Tours ({listing.virtualTours.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {listing.virtualTours.map((tour, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                          <Eye className="h-4 w-4" />
                          <a
                            href={tour}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex-1"
                          >
                            Virtual Tour {index + 1}
                          </a>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Agent Photo */}
              {listing.agentPhotoUrl && (
                <Card>
                  <CardHeader>
                    <CardTitle>Agent/Company Photo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="w-32 h-32 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={listing.agentPhotoUrl}
                        alt="Agent or company photo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {listing.contactInfo.mhVillageAccountKey && (
                        <div>
                          <span className="text-sm text-muted-foreground">MHVillage Account</span>
                          <div className="font-semibold">{listing.contactInfo.mhVillageAccountKey}</div>
                        </div>
                      )}
                      
                      {(listing.contactInfo.firstName || listing.contactInfo.lastName) && (
                        <div>
                          <span className="text-sm text-muted-foreground">Contact Name</span>
                          <div className="font-semibold">
                            {[listing.contactInfo.firstName, listing.contactInfo.lastName].filter(Boolean).join(' ')}
                          </div>
                        </div>
                      )}

                      {listing.contactInfo.companyName && (
                        <div>
                          <span className="text-sm text-muted-foreground">Company</span>
                          <div className="font-semibold">{listing.contactInfo.companyName}</div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <div>
                          <span className="text-sm text-muted-foreground">Phone</span>
                          <div className="font-semibold">{listing.contactInfo.phone}</div>
                        </div>
                      </div>

                      {listing.contactInfo.alternatePhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <div>
                            <span className="text-sm text-muted-foreground">Alternate Phone</span>
                            <div className="font-semibold">{listing.contactInfo.alternatePhone}</div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <div>
                          <span className="text-sm text-muted-foreground">Email</span>
                          <div className="font-semibold">{listing.contactInfo.email}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {listing.contactInfo.fax && (
                        <div>
                          <span className="text-sm text-muted-foreground">Fax</span>
                          <div className="font-semibold">{listing.contactInfo.fax}</div>
                        </div>
                      )}

                      {listing.contactInfo.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          <div>
                            <span className="text-sm text-muted-foreground">Website</span>
                            <div className="font-semibold">
                              <a
                                href={listing.contactInfo.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {listing.contactInfo.website}
                              </a>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Additional Emails */}
                      {[
                        listing.contactInfo.additionalEmail1,
                        listing.contactInfo.additionalEmail2,
                        listing.contactInfo.additionalEmail3
                      ].filter(Boolean).map((email, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <div>
                            <span className="text-sm text-muted-foreground">Additional Email {index + 1}</span>
                            <div className="font-semibold">{email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}