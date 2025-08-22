import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ExternalLink, 
  Copy, 
  Share, 
  Settings,
  Calendar,
  Eye,
  Download
} from 'lucide-react'
import { VehicleInventory } from '../types'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface ListingHandoffModalProps {
  isOpen: boolean
  onClose: () => void
  vehicle: VehicleInventory
  onCreateListing: (vehicle: VehicleInventory, options: ListingOptions) => void
}

interface ListingOptions {
  includePhotos: boolean
  includeFeatures: boolean
  includeDescription: boolean
  customTitle?: string
  customDescription?: string
  seoKeywords?: string
  shareSettings: {
    allowPublicView: boolean
    requireLeadCapture: boolean
    expirationDate?: string
    customMessage?: string
  }
}

export default function ListingHandoffModal({ 
  isOpen, 
  onClose, 
  vehicle, 
  onCreateListing 
}: ListingHandoffModalProps) {
  const { toast } = useToast()
  const [options, setOptions] = useState<ListingOptions>({
    includePhotos: true,
    includeFeatures: true,
    includeDescription: true,
    customTitle: vehicle.title,
    customDescription: vehicle.description,
    seoKeywords: `${vehicle.year} ${vehicle.make} ${vehicle.model}, ${vehicle.listingType.replace('_', ' ')}`,
    shareSettings: {
      allowPublicView: true,
      requireLeadCapture: false,
      customMessage: `Check out this ${vehicle.year} ${vehicle.make} ${vehicle.model}!`
    }
  })

  const handleCreateListing = () => {
    onCreateListing(vehicle, options)
    onClose()
    toast({
      title: 'Listing Created',
      description: 'Your inventory item has been converted to a public listing'
    })
  }

  const handleCopyInventoryData = () => {
    const data = {
      title: vehicle.title,
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      price: vehicle.salePrice || vehicle.rentPrice,
      location: `${vehicle.location.city}, ${vehicle.location.state}`,
      features: Object.keys(vehicle.features).filter(key => vehicle.features[key])
    }
    
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    toast({
      title: 'Data Copied',
      description: 'Inventory data copied to clipboard'
    })
  }

  const previewUrl = `${window.location.origin}/public/demo/listing/${vehicle.id}`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Create Public Listing
          </DialogTitle>
          <DialogDescription>
            Convert this inventory item into a public listing that customers can view and share.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vehicle Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Inventory Item</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                  {vehicle.media.primaryPhoto ? (
                    <img
                      src={vehicle.media.primaryPhoto}
                      alt={vehicle.title}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="text-muted-foreground">
                      {vehicle.listingType === 'rv' ? '🚐' : '🏠'}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{vehicle.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{vehicle.listingType.replace('_', ' ')}</Badge>
                    <Badge className={getStatusColor(vehicle.status)}>{vehicle.status}</Badge>
                  </div>
                  {(vehicle.salePrice || vehicle.rentPrice) && (
                    <p className="text-lg font-bold text-primary mt-2">
                      {formatCurrency(vehicle.salePrice || vehicle.rentPrice || 0)}
                      {vehicle.rentPrice && !vehicle.salePrice && '/month'}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Listing Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Listing Options</h3>
            
            {/* Content Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Content to Include</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includePhotos"
                    checked={options.includePhotos}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, includePhotos: !!checked }))
                    }
                  />
                  <Label htmlFor="includePhotos">Include photos ({vehicle.media.photos.length})</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeFeatures"
                    checked={options.includeFeatures}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, includeFeatures: !!checked }))
                    }
                  />
                  <Label htmlFor="includeFeatures">
                    Include features ({Object.keys(vehicle.features).length})
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeDescription"
                    checked={options.includeDescription}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, includeDescription: !!checked }))
                    }
                  />
                  <Label htmlFor="includeDescription">Include description</Label>
                </div>
              </CardContent>
            </Card>

            {/* Custom Content */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Custom Content</CardTitle>
                <CardDescription>Override default content for the public listing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customTitle">Custom Title (optional)</Label>
                  <Input
                    id="customTitle"
                    value={options.customTitle}
                    onChange={(e) => setOptions(prev => ({ ...prev, customTitle: e.target.value }))}
                    placeholder={vehicle.title}
                  />
                </div>
                
                <div>
                  <Label htmlFor="customDescription">Custom Description (optional)</Label>
                  <Textarea
                    id="customDescription"
                    value={options.customDescription}
                    onChange={(e) => setOptions(prev => ({ ...prev, customDescription: e.target.value }))}
                    placeholder={vehicle.description || 'Enter a custom description...'}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="seoKeywords">SEO Keywords (optional)</Label>
                  <Input
                    id="seoKeywords"
                    value={options.seoKeywords}
                    onChange={(e) => setOptions(prev => ({ ...prev, seoKeywords: e.target.value }))}
                    placeholder="Keywords for search optimization"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Share Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Share Settings</CardTitle>
                <CardDescription>Configure how this listing can be shared</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allowPublicView"
                    checked={options.shareSettings.allowPublicView}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ 
                        ...prev, 
                        shareSettings: { ...prev.shareSettings, allowPublicView: !!checked }
                      }))
                    }
                  />
                  <Label htmlFor="allowPublicView">Allow public viewing</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requireLeadCapture"
                    checked={options.shareSettings.requireLeadCapture}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ 
                        ...prev, 
                        shareSettings: { ...prev.shareSettings, requireLeadCapture: !!checked }
                      }))
                    }
                  />
                  <Label htmlFor="requireLeadCapture">Require lead capture to view</Label>
                </div>
                
                <div>
                  <Label htmlFor="expirationDate">Expiration Date (optional)</Label>
                  <Input
                    id="expirationDate"
                    type="date"
                    value={options.shareSettings.expirationDate}
                    onChange={(e) => setOptions(prev => ({ 
                      ...prev, 
                      shareSettings: { ...prev.shareSettings, expirationDate: e.target.value }
                    }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="customMessage">Custom Share Message (optional)</Label>
                  <Textarea
                    id="customMessage"
                    value={options.shareSettings.customMessage}
                    onChange={(e) => setOptions(prev => ({ 
                      ...prev, 
                      shareSettings: { ...prev.shareSettings, customMessage: e.target.value }
                    }))}
                    placeholder="Custom message when sharing this listing"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preview URL */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Preview URL</CardTitle>
                <CardDescription>This will be the public URL for your listing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Input
                    value={previewUrl}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyInventoryData}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(previewUrl, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCopyInventoryData}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Data
              </Button>
              <Button onClick={handleCreateListing}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Create Listing
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Helper function to get status color
function getStatusColor(status: string) {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'sold':
      return 'bg-blue-100 text-blue-800'
    case 'reserved':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}