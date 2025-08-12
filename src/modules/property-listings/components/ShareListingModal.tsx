import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Copy, 
  Mail, 
  MessageSquare, 
  QrCode, 
  Link2, 
  Share2, 
  Eye,
  Calendar,
  BarChart3,
  Check,
  ExternalLink,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react'
import QRCode from 'react-qr-code'

export const ShareListingModal = ({ open, onOpenChange, listing }) => {
  const [copiedStates, setCopiedStates] = useState({})
  const [shareSettings, setShareSettings] = useState({
    watermark: false,
    expirationDays: 30,
    requireContact: false
  })

  if (!listing) return null

  // Generate share URLs (in production, these would call your share link API)
  const baseUrl = window.location.origin
  const companySlug = 'demo-company' // In production, get from context
  
  const shareUrls = {
    direct: `${baseUrl}/${companySlug}/listing/${listing.id}`,
    short: `${baseUrl}/${companySlug}/l/abc123`, // Generated short link
    qr: `${baseUrl}/${companySlug}/l/abc123`
  }

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates({ ...copiedStates, [key]: true })
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [key]: false })
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out this property: ${listing.title}`)
    const body = encodeURIComponent(`I thought you might be interested in this property:\n\n${listing.title}\n${listing.searchResultsText}\n\nView details: ${shareUrls.direct}`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const shareViaSMS = () => {
    const message = encodeURIComponent(`Check out this property: ${listing.title} - ${shareUrls.short}`)
    window.open(`sms:?body=${message}`)
  }

  const shareViaSocial = (platform) => {
    const url = encodeURIComponent(shareUrls.direct)
    const text = encodeURIComponent(`Check out this property: ${listing.title}`)
    
    const socialUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text} ${url}`
    }
    
    if (socialUrls[platform]) {
      window.open(socialUrls[platform], '_blank', 'width=600,height=400')
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            Share Listing
          </DialogTitle>
          <DialogDescription>
            Share this property listing with potential buyers or renters
          </DialogDescription>
        </DialogHeader>

        {/* Listing Preview */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-16 rounded-lg overflow-hidden bg-muted">
                {listing.media?.primaryPhoto ? (
                  <img
                    src={listing.media.primaryPhoto}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{listing.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {listing.year} {listing.make} {listing.model}
                </p>
                <div className="flex items-center space-x-4 mt-1">
                  {listing.salePrice && (
                    <Badge className="bg-green-100 text-green-800">
                      {formatPrice(listing.salePrice)}
                    </Badge>
                  )}
                  {listing.rentPrice && (
                    <Badge className="bg-blue-100 text-blue-800">
                      {formatPrice(listing.rentPrice)}/mo
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="share" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="share">Share Links</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Share Links Tab */}
          <TabsContent value="share" className="space-y-6">
            <div className="grid gap-4">
              {/* Quick Share Buttons */}
              <div className="space-y-3">
                <Label>Quick Share</Label>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={shareViaEmail} variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button onClick={shareViaSMS} variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    SMS
                  </Button>
                  <Button onClick={() => shareViaSocial('facebook')} variant="outline" size="sm">
                    Facebook
                  </Button>
                  <Button onClick={() => shareViaSocial('twitter')} variant="outline" size="sm">
                    Twitter
                  </Button>
                  <Button onClick={() => shareViaSocial('linkedin')} variant="outline" size="sm">
                    LinkedIn
                  </Button>
                  <Button onClick={() => shareViaSocial('whatsapp')} variant="outline" size="sm">
                    WhatsApp
                  </Button>
                </div>
              </div>

              {/* Direct Link */}
              <div className="space-y-2">
                <Label>Direct Link</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={shareUrls.direct}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    onClick={() => copyToClipboard(shareUrls.direct, 'direct')}
                    variant="outline"
                    size="sm"
                  >
                    {copiedStates.direct ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Short Link */}
              <div className="space-y-2">
                <Label>Short Link</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={shareUrls.short}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    onClick={() => copyToClipboard(shareUrls.short, 'short')}
                    variant="outline"
                    size="sm"
                  >
                    {copiedStates.short ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shorter link that's easier to share and includes analytics tracking
                </p>
              </div>

              {/* Preview Button */}
              <Button variant="outline" className="w-fit">
                <Eye className="h-4 w-4 mr-2" />
                Preview Public Page
              </Button>
            </div>
          </TabsContent>

          {/* QR Code Tab */}
          <TabsContent value="qr" className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-lg border">
                <QRCode
                  size={200}
                  value={shareUrls.qr}
                  viewBox="0 0 256 256"
                />
              </div>
              <div className="text-center">
                <p className="font-medium">Scan to view listing</p>
                <p className="text-sm text-muted-foreground">
                  Perfect for print materials and in-person showings
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Download PNG
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Download SVG
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Add Watermark</Label>
                    <p className="text-sm text-muted-foreground">
                      Add your company branding to shared images
                    </p>
                  </div>
                  <Switch
                    checked={shareSettings.watermark}
                    onCheckedChange={(checked) =>
                      setShareSettings({ ...shareSettings, watermark: checked })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Link Expiration</Label>
                  <select
                    value={shareSettings.expirationDays}
                    onChange={(e) =>
                      setShareSettings({
                        ...shareSettings,
                        expirationDays: parseInt(e.target.value)
                      })
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value={7}>7 days</option>
                    <option value={30}>30 days</option>
                    <option value={90}>90 days</option>
                    <option value={365}>1 year</option>
                    <option value={0}>Never expires</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Contact Info</Label>
                    <p className="text-sm text-muted-foreground">
                      Visitors must provide contact info to view full details
                    </p>
                  </div>
                  <Switch
                    checked={shareSettings.requireContact}
                    onCheckedChange={(checked) =>
                      setShareSettings({ ...shareSettings, requireContact: checked })
                    }
                  />
                </div>
              </div>

              <Button className="w-full">
                <Link2 className="h-4 w-4 mr-2" />
                Generate Custom Share Link
              </Button>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">127</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">
                    +8% from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Contact Requests</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">14</div>
                  <p className="text-xs text-muted-foreground">
                    +5 new this week
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Direct Link</span>
                  </div>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">SMS Shares</span>
                  </div>
                  <span className="text-sm font-medium">28%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Email</span>
                  </div>
                  <span className="text-sm font-medium">18%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Social Media</span>
                  </div>
                  <span className="text-sm font-medium">9%</span>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Detailed Analytics
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}