import React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useLandManagement } from '../hooks/useLandManagement'
import { LandStatus } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Edit, 
  MapPin, 
  DollarSign, 
  Ruler, 
  Calendar,
  FileText,
  Zap,
  AlertCircle,
  Image as ImageIcon,
  User,
  TrendingUp
} from 'lucide-react'

export function LandDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getLandById, getPricePerUnit } = useLandManagement()

  if (!id) {
    navigate('/land')
    return null
  }

  const land = getLandById(id)

  if (!land) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/land')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Land List
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="font-medium">Land record not found</p>
              <p className="text-sm">The requested land record could not be found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusColor = (status: LandStatus) => {
    switch (status) {
      case LandStatus.AVAILABLE:
        return 'bg-green-100 text-green-800'
      case LandStatus.UNDER_CONTRACT:
        return 'bg-yellow-100 text-yellow-800'
      case LandStatus.SOLD:
        return 'bg-gray-100 text-gray-800'
      case LandStatus.RESERVED:
        return 'bg-blue-100 text-blue-800'
      case LandStatus.OFF_MARKET:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const pricePerUnit = getPricePerUnit(land)
  const profitMargin = land.cost > 0 ? ((land.price - land.cost) / land.price * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/land')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Land List
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{land.address.street}</h1>
            <p className="text-muted-foreground">
              {land.address.city}, {land.address.state} {land.address.zipCode}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(land.status)}>
            {land.status.replace('_', ' ')}
          </Badge>
          <Link to={`/land/${land.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {land.images && land.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {/* Main image */}
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={land.images[0]}
                      alt={`${land.address.street} main view`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Additional images */}
                  {land.images.length > 1 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {land.images.slice(1).map((image, index) => (
                        <div key={index} className="aspect-square rounded-md overflow-hidden bg-muted">
                          <img
                            src={image}
                            alt={`${land.address.street} view ${index + 2}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {land.description && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {land.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Address Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Street Address</label>
                  <p className="font-medium">{land.address.street}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">City</label>
                  <p className="font-medium">{land.address.city}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">State</label>
                  <p className="font-medium">{land.address.state}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ZIP Code</label>
                  <p className="font-medium">{land.address.zipCode}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Country</label>
                  <p className="font-medium">{land.address.country}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Zoning</label>
                  <p className="font-medium">{land.zoning}</p>
                </div>
              </div>
              {land.address.coordinates && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Coordinates</label>
                  <p className="font-medium">
                    {land.address.coordinates.lat}, {land.address.coordinates.lng}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Utilities */}
          {land.utilities && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-4 w-4" />
                  Utilities Available
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(land.utilities).map(([utility, available]) => (
                    <div key={utility} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${available ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className={`capitalize text-sm ${available ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {utility}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          {land.features && land.features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {land.features.map((feature, index) => (
                    <Badge key={index} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Restrictions */}
          {land.restrictions && land.restrictions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Restrictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {land.restrictions.map((restriction, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{restriction}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {land.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {land.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Sale Price</label>
                <p className="text-2xl font-bold">${land.price.toLocaleString()}</p>
              </div>
              {land.cost > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cost Basis</label>
                  <p className="text-lg font-semibold">${land.cost.toLocaleString()}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Price per {land.sizeUnit.slice(0, -1)}</label>
                <p className="text-lg font-semibold">${pricePerUnit.toLocaleString()}</p>
              </div>
              {land.cost > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Profit Margin</label>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-semibold text-green-600">
                      {profitMargin.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Size Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ruler className="mr-2 h-4 w-4" />
                Size Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Size</label>
                <p className="text-xl font-bold">{land.size} {land.sizeUnit}</p>
              </div>
            </CardContent>
          </Card>

          {/* Tax Information */}
          {land.taxInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Tax Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Annual Taxes</label>
                  <p className="font-semibold">${land.taxInfo.annualTaxes.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Assessed Value</label>
                  <p className="font-semibold">${land.taxInfo.assessedValue.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Assessment</label>
                  <p className="font-semibold">
                    {new Date(land.taxInfo.lastAssessment).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Audit Trail */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Record Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="text-sm">
                  {new Date(land.createdAt).toLocaleDateString()} by {land.createdBy}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p className="text-sm">
                  {new Date(land.updatedAt).toLocaleDateString()} by {land.updatedBy}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
export default LandDetail