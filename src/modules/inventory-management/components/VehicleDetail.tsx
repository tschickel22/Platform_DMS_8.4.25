import React from 'react'
import { Vehicle, RVVehicle, MHVehicle } from '../state/types'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, Calendar, Package, MapPin, DollarSign, Home, Truck, Star } from 'lucide-react'
import { 
  Car, 
  Home, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Palette, 
  Fuel, 
  Settings, 
  Bed, 
  Bath,
  Phone,
  Mail,
  Globe
} from 'lucide-react'

interface VehicleDetailProps {
  vehicle: Vehicle | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const formatPrice = (vehicle: Vehicle): string => {
  if (vehicle.type === 'RV') {
    return `$${vehicle.price?.toLocaleString() || '0'}`
  } else if (vehicle.type === 'MH') {
    return `$${vehicle.askingPrice?.toLocaleString() || '0'}`
  }
  return '$0'
}

const RVDetails: React.FC<{ rv: RVVehicle }> = ({ rv }) => (
  <div className="space-y-6">
    {/* Basic Info */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Vehicle Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">VIN</p>
            <p className="font-mono">{rv.vehicleIdentificationNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Year</p>
            <p>{rv.modelDate}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Make</p>
            <p>{rv.brand}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Model</p>
            <p>{rv.model}</p>
          </div>
          {rv.bodyStyle && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Body Style</p>
              <p>{rv.bodyStyle}</p>
            </div>
          )}
          {rv.color && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Color</p>
              <p>{rv.color}</p>
            </div>
          )}
        </div>
        
        {rv.mileage && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Mileage</p>
            <p>{rv.mileage.toLocaleString()} miles</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          {rv.fuelType && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fuel Type</p>
              <p>{rv.fuelType}</p>
            </div>
          )}
          {rv.vehicleTransmission && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Transmission</p>
              <p>{rv.vehicleTransmission}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>

    {/* Pricing */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Pricing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{formatPrice(rv)}</span>
          <Badge>{rv.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Currency: {rv.priceCurrency}
        </p>
      </CardContent>
    </Card>

    {/* Seller Info */}
    {(rv.sellerName || rv.sellerPhone || rv.sellerEmail) && (
      <Card>
        <CardHeader>
          <CardTitle>Seller Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {rv.sellerName && (
            <div className="flex items-center gap-2">
              <span className="font-medium">{rv.sellerName}</span>
            </div>
          )}
          {rv.sellerPhone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{rv.sellerPhone}</span>
            </div>
          )}
          {rv.sellerEmail && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{rv.sellerEmail}</span>
            </div>
          )}
        </CardContent>
      </Card>
    )}

    {/* Description */}
    {rv.description && (
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{rv.description}</p>
        </CardContent>
      </Card>
    )}
  </div>
)

const MHDetails: React.FC<{ mh: MHVehicle }> = ({ mh }) => (
  <div className="space-y-6">
    {/* Basic Info */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Home Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Home Type</p>
            <p>{mh.homeType}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Year</p>
            <p>{mh.year}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Make</p>
            <p>{mh.make}</p>
          </div>
          {mh.model && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Model</p>
              <p>{mh.model}</p>
            </div>
          )}
        </div>
        
        {mh.serialNumber && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Serial Number</p>
            <p className="font-mono">{mh.serialNumber}</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Bed className="h-4 w-4 text-muted-foreground" />
            <span>{mh.bedrooms} Bedrooms</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="h-4 w-4 text-muted-foreground" />
            <span>{mh.bathrooms} Bathrooms</span>
          </div>
        </div>
        
        {(mh.width1 || mh.length1) && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Dimensions</p>
            <p>{mh.width1 && mh.length1 ? `${mh.width1}' × ${mh.length1}'` : 'Not specified'}</p>
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
      <CardContent>
        <div className="space-y-2">
          <p>{mh.address1}</p>
          {mh.address2 && <p>{mh.address2}</p>}
          <p>{mh.city}, {mh.state} {mh.zip9}</p>
          {mh.countyName && (
            <p className="text-sm text-muted-foreground">County: {mh.countyName}</p>
          )}
        </div>
      </CardContent>
    </Card>

    {/* Pricing */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Pricing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{formatPrice(mh)}</span>
          <Badge>{mh.status}</Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          {mh.lotRent && (
            <div>
              <p className="font-medium text-muted-foreground">Lot Rent</p>
              <p>{mh.lotRent}</p>
            </div>
          )}
          {mh.taxes && (
            <div>
              <p className="font-medium text-muted-foreground">Taxes</p>
              <p>{mh.taxes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>

    {/* Features */}
    {(mh.centralAir || mh.garage || mh.deck || mh.fireplace) && (
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {mh.centralAir === 'Yes' && <div>✓ Central Air</div>}
            {mh.garage === 'Yes' && <div>✓ Garage</div>}
            {mh.carport === 'Yes' && <div>✓ Carport</div>}
            {mh.deck === 'Yes' && <div>✓ Deck</div>}
            {mh.patio === 'Yes' && <div>✓ Patio</div>}
            {mh.fireplace === 'Yes' && <div>✓ Fireplace</div>}
            {mh.laundryRoom === 'Yes' && <div>✓ Laundry Room</div>}
            {mh.storageShed === 'Yes' && <div>✓ Storage Shed</div>}
          </div>
        </CardContent>
      </Card>
    )}

    {/* Description */}
    {mh.description && (
      <Card>
                
                {/* Type-specific fields */}
                {isManufacturedHome && vehicle.customFields && (
                  <>
                    {vehicle.customFields.bedrooms && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bedrooms:</span>
                        <span className="font-medium">{vehicle.customFields.bedrooms}</span>
                      </div>
                    )}
                    {vehicle.customFields.bathrooms && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bathrooms:</span>
                        <span className="font-medium">{vehicle.customFields.bathrooms}</span>
                      </div>
                    )}
                    {vehicle.customFields.squareFootage && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Square Footage:</span>
                        <span className="font-medium">{vehicle.customFields.squareFootage} sq ft</span>
                      </div>
                    )}
                  </>
                )}
                
                {!isManufacturedHome && vehicle.customFields && (
                  <>
                    {vehicle.customFields.sleeps && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sleeps:</span>
                        <span className="font-medium">{vehicle.customFields.sleeps}</span>
                      </div>
                    )}
                    {vehicle.customFields.length && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Length:</span>
                        <span className="font-medium">{vehicle.customFields.length} ft</span>
                      </div>
                    )}
                    {vehicle.customFields.slideOuts && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Slide Outs:</span>
                        <span className="font-medium">{vehicle.customFields.slideOuts}</span>
                      </div>
                    )}
                  </>
                )}
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{mh.description}</p>
        </CardContent>
      </Card>
    )}
  </div>
)

const VehicleDetail: React.FC<VehicleDetailProps> = ({
  vehicle,
  const isManufacturedHome = ['single_wide', 'double_wide', 'triple_wide', 'modular_home', 'park_model']
    .includes(vehicle.type.toLowerCase())

  open,
  onOpenChange
}) => {
                {vehicle.customFields?.msrp && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">MSRP:</span>
                    <span className="font-medium">{formatCurrency(parseFloat(vehicle.customFields.msrp) || 0)}</span>
                  </div>
                )}
  if (!vehicle) return null

  const getVehicleTitle = (): string => {
    if (vehicle.type === 'RV') {
      const rv = vehicle as RVVehicle
      return `${rv.modelDate || ''} ${rv.brand || ''} ${rv.model || ''}`.trim()
    } else if (vehicle.type === 'MH') {
      const mh = vehicle as MHVehicle
      return `${mh.year || ''} ${mh.make || ''} ${mh.model || ''}`.trim()
    }
    return 'Vehicle Details'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getVehicleTitle()}</DialogTitle>
            {isManufacturedHome ? (
              <Home className="h-5 w-5 text-emerald-600" />
            ) : (
              <Truck className="h-5 w-5 text-cyan-600" />
            )}
          <DialogDescription>
            {vehicle.type === 'RV' ? 'Recreational Vehicle' : 'Manufactured Home'} Details
                <Badge variant="outline">
                  {isManufacturedHome ? 'Manufactured Home' : 'RV'}
                </Badge>
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          {vehicle.type === 'RV' ? (
            <RVDetails rv={vehicle as RVVehicle} />
          ) : (
            <MHDetails mh={vehicle as MHVehicle} />
          )}
          {/* Custom Fields */}
          {vehicle.customFields && Object.keys(vehicle.customFields).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(vehicle.customFields).map(([key, value]) => {
                    if (!value || key === 'type') return null
                    
                    return (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="font-medium">
                          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

          {/* Images */}
          {vehicle.images && vehicle.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {vehicle.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`${vehicle.make} ${vehicle.model} - Image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      {index === 0 && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-primary text-primary-foreground">
                            <Star className="h-3 w-3 mr-1" />
                            Primary
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
export default VehicleDetail