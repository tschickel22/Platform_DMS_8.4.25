import React, { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Copy, 
  Share, 
  Mail, 
  MessageSquare, 
  QrCode, 
  Facebook, 
  Twitter, 
  ExternalLink, 
  BarChart3,
  Calendar,
  Eye
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import QRCode from 'react-qr-code'

interface ShareListingModalProps {
  listing: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ShareListingModal({ listing, open, onOpenChange }: ShareListingModalProps) {
  const [shareUrl] = useState(`https://company.listings.com/listing/${listing.id}`)
  const [shortUrl] = useState(`https://short.ly/abc123`)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const urlInputRef = useRef<HTMLInputElement>(null)
  const shortUrlInputRef = useRef<HTMLInputElement>(null)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: `${label} has been copied to your clipboard`,
      })
    })
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out this ${listing.listingType.replace('_', ' ')}: ${listing.title}`)
    const body = encodeURIComponent(`Hi! I wanted to share this property listing with you:\n\n${listing.title}\n${formatPrice(listing)}\n${listing.location.city}, ${listing.location.state}\n\n${shareUrl}\n\nBest regards`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const shareViaSMS = () => {
    const message = encodeURIComponent(`Check out this property: ${listing.title} - ${formatPrice(listing)} in ${listing.location.city}, ${listing.location.state}. ${shortUrl}`)
    window.open(`sms:?body=${message}`)
  }

  const shareViaFacebook = () => {
    const url = encodeURIComponent(shareUrl)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
  }

  const shareViaTwitter = () => {
    const text = encodeURIComponent(`Check out this ${listing.listingType.replace('_', ' ')}: ${listing.title} - ${formatPrice(listing)}`)
    const url = encodeURIComponent(shareUrl)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
  }

  const formatPrice = (listing: any) => {
    if (listing.offerType === 'for_sale' && listing.salePrice) {
      return `$${listing.salePrice.toLocaleString()}`
    }
    if (listing.offerType === 'for_rent' && listing.rentPrice) {
      return `$${listing.rentPrice.toLocaleString()}/mo`
    }
    if (listing.offerType === 'both' && listing.salePrice && listing.rentPrice) {
      return `$${listing.salePrice.toLocaleString()} / $${listing.rentPrice.toLocaleString()}/mo`
    }
    return 'Price available upon request'
  }

  const mockAnalytics = {
    totalViews: 247,
    uniqueViews: 189,
    clicks: 34,
    shares: 8,
    topSources: [
      { source: 'Direct', views: 95 },
      { source: 'Facebook', views: 62 },
      { source: 'Email', views: 45 },
      { source: 'SMS', views: 28 }
    ]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="h-5 w-5" />
            Share Listing
          </DialogTitle>
          <DialogDescription>
            Share "{listing.title}" with others
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Listing Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="w-20 h-16 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {listing.media?.primaryPhoto ? (
                    <img 
                      src={listing.media.primaryPhoto} 
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400">No Image</div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{listing.title}</h4>
                  <p className="text-sm text-gray-600">{formatPrice(listing)}</p>
                  <p className="text-sm text-gray-500">{listing.location.city}, {listing.location.state}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {listing.listingType.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {listing.offerType.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="share" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="share">Share Options</TabsTrigger>
              <TabsTrigger value="qr">QR Code</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="share" className="space-y-6">
              {/* Share URLs */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="shareUrl">Direct Link</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      ref={urlInputRef}
                      id="shareUrl"
                      value={shareUrl}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(shareUrl, 'Direct link')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="shortUrl">Short Link</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      ref={shortUrlInputRef}
                      id="shortUrl"
                      value={shortUrl}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(shortUrl, 'Short link')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Trackable short link with analytics
                  </p>
                </div>
              </div>

              {/* Share Methods */}
              <div>
                <Label>Share Via</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={shareViaEmail}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={shareViaSMS}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    SMS
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={shareViaFacebook}
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={shareViaTwitter}
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                </div>
              </div>

              {/* Preview Button */}
              <div className="flex justify-center pt-4">
                <Button 
                  variant="outline"
                  onClick={() => window.open(shareUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview Listing Page
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="qr" className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg border">
                    <QRCode
                      size={200}
                      value={shareUrl}
                      viewBox={`0 0 200 200`}
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">QR Code for Quick Access</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Scan with any smartphone camera to view the listing
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Generate QR code as image and trigger download
                      toast({
                        title: "QR Code",
                        description: "Right-click the QR code to save as image",
                      })
                    }}
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Save QR Code
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Views</p>
                          <p className="text-2xl font-bold">{mockAnalytics.totalViews}</p>
                        </div>
                        <Eye className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Unique Views</p>
                          <p className="text-2xl font-bold">{mockAnalytics.uniqueViews}</p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Clicks</p>
                          <p className="text-2xl font-bold">{mockAnalytics.clicks}</p>
                        </div>
                        <ExternalLink className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Shares</p>
                          <p className="text-2xl font-bold">{mockAnalytics.shares}</p>
                        </div>
                        <Share className="h-8 w-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Traffic Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockAnalytics.topSources.map((source, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="font-medium">{source.source}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${(source.views / mockAnalytics.totalViews) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-12 text-right">{source.views}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}