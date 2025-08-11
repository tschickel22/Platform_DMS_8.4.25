import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { 
  Copy, 
  MessageSquare, 
  Mail, 
  Share2, 
  QrCode, 
  BarChart3,
  ExternalLink,
  Eye,
  Clock,
  Users
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ShareListingModalProps {
  isOpen: boolean
  onClose: () => void
  listing: any
  companySlug: string
}

export default function ShareListingModal({
  isOpen,
  onClose,
  listing,
  companySlug
}: ShareListingModalProps) {
  const { toast } = useToast()
  const [shareToken, setShareToken] = useState<string>('')
  const [shareUrls, setShareUrls] = useState<any>({})
  const [analytics, setAnalytics] = useState<any>(null)
  const [expiryDays, setExpiryDays] = useState(30)
  const [customMessage, setCustomMessage] = useState('')
  const [includeWatermark, setIncludeWatermark] = useState(false)
  const [loading, setLoading] = useState(false)

  // Generate share link on modal open
  useEffect(() => {
    if (isOpen && listing && !shareToken) {
      generateShareLink()
    }
  }, [isOpen, listing])

  // Fetch analytics when token is available
  useEffect(() => {
    if (shareToken) {
      fetchAnalytics()
    }
  }, [shareToken])

  const generateShareLink = async () => {
    try {
      setLoading(true)
      
      const expiresAt = expiryDays > 0 
        ? new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString()
        : null

      const response = await fetch('/.netlify/functions/share-link-crud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId: listing.companyId,
          type: 'single',
          title: `${listing.year} ${listing.make} ${listing.model}`,
          listingIds: [listing.id],
          watermark: includeWatermark,
          expiresAt
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate share link')
      }

      const data = await response.json()
      setShareToken(data.token)
      setShareUrls(data.urls)
    } catch (error) {
      console.error('Error generating share link:', error)
      toast({
        title: "Error",
        description: "Failed to generate share link",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(
        `/.netlify/functions/share-analytics?companyId=${listing.companyId}&token=${shareToken}`
      )

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const generateSMSLink = () => {
    const message = customMessage || 
      `Check out this ${listing.listingType === 'manufactured_home' ? 'manufactured home' : 'RV'}: ${shareUrls.shortUrl}`
    return `sms:?body=${encodeURIComponent(message)}`
  }

  const generateEmailLink = () => {
    const subject = `${listing.year} ${listing.make} ${listing.model} - Property Listing`
    const body = customMessage || 
      `Hi there!\n\nI wanted to share this ${listing.listingType === 'manufactured_home' ? 'manufactured home' : 'RV'} listing with you:\n\n${listing.year} ${listing.make} ${listing.model}\nPrice: $${(listing.salePrice || listing.rentPrice || 0).toLocaleString()}\nLocation: ${listing.location?.city || ''}, ${listing.location?.state || ''}\n\nView listing: ${shareUrls.shortUrl}\n\nBest regards!`
    
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const generateSocialLinks = () => {
    const text = `Check out this ${listing.year} ${listing.make} ${listing.model} for ${listing.offerType?.replace('_', ' ')}`
    const url = shareUrls.shortUrl

    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
    }
  }

  if (!listing) return null

  const socialLinks = shareUrls.shortUrl ? generateSocialLinks() : {}

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="h-5 w-5" />
            <span>Share Listing</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Listing Preview */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex space-x-4">
                {listing.media?.primaryPhoto && (
                  <img
                    src={listing.media.primaryPhoto}
                    alt={listing.title}
                    className="w-20 h-16 object-cover rounded-md"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">
                    {listing.year} {listing.make} {listing.model}
                  </h3>
                  <p className="text-lg font-bold text-primary">
                    ${(listing.salePrice || listing.rentPrice || 0).toLocaleString()}
                    {listing.offerType === 'for_rent' && '/month'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {listing.location?.city}, {listing.location?.state}
                  </p>
                </div>
                <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                  {listing.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="share" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="share">Share Options</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="share" className="space-y-6">
              {/* Share Settings */}
              <Card>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Link Expires In</Label>
                      <select
                        value={expiryDays}
                        onChange={(e) => setExpiryDays(Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        <option value={7}>7 days</option>
                        <option value={30}>30 days</option>
                        <option value={90}>90 days</option>
                        <option value={0}>Never</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Switch
                        id="watermark"
                        checked={includeWatermark}
                        onCheckedChange={setIncludeWatermark}
                      />
                      <Label htmlFor="watermark" className="text-sm">
                        Include watermark
                      </Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Custom Message (Optional)</Label>
                    <Textarea
                      id="message"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Add a personal message to include with the link..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <Button 
                    onClick={generateShareLink} 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Generating...' : 'Update Share Link'}
                  </Button>
                </CardContent>
              </Card>

              {/* Share Links */}
              {shareUrls.shortUrl && (
                <Card>
                  <CardContent className="pt-4 space-y-4">
                    <div>
                      <Label>Short Link</Label>
                      <div className="flex mt-1">
                        <Input
                          value={shareUrls.shortUrl}
                          readOnly
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-2"
                          onClick={() => copyToClipboard(shareUrls.shortUrl, 'Link')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Direct Link</Label>
                      <div className="flex mt-1">
                        <Input
                          value={shareUrls.canonicalUrl}
                          readOnly
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-2"
                          onClick={() => copyToClipboard(shareUrls.canonicalUrl, 'Direct link')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Quick Share Buttons */}
                    <div className="space-y-3">
                      <Label>Quick Share</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="justify-start"
                          onClick={() => window.open(generateSMSLink())}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          SMS
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="justify-start"
                          onClick={() => window.open(generateEmailLink())}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="justify-start"
                          onClick={() => window.open(socialLinks.facebook)}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Facebook
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="justify-start"
                          onClick={() => window.open(socialLinks.twitter)}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Twitter
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="justify-start"
                          onClick={() => window.open(socialLinks.whatsapp)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          WhatsApp
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="justify-start"
                          onClick={() => window.open(shareUrls.shortUrl)}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              {analytics ? (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-4 text-center">
                        <Eye className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <div className="text-2xl font-bold">{analytics.totalClicks}</div>
                        <div className="text-sm text-muted-foreground">Total Views</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-4 text-center">
                        <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <div className="text-2xl font-bold">{analytics.uniqueClicks}</div>
                        <div className="text-sm text-muted-foreground">Unique Views</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-4 text-center">
                        <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                        <div className="text-2xl font-bold">{analytics.conversionRate}%</div>
                        <div className="text-sm text-muted-foreground">Conversion</div>
                      </CardContent>
                    </Card>
                  </div>

                  {analytics.topSources.length > 0 && (
                    <Card>
                      <CardContent className="pt-4">
                        <h4 className="font-semibold mb-3">Top Sources</h4>
                        <div className="space-y-2">
                          {analytics.topSources.map((source: any, index: number) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="capitalize">{source.source}</span>
                              <Badge variant="secondary">{source.clicks} clicks</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {analytics.firstClick && (
                    <Card>
                      <CardContent className="pt-4">
                        <h4 className="font-semibold mb-3">Timeline</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              First view: {new Date(analytics.firstClick).toLocaleDateString()}
                            </span>
                          </div>
                          {analytics.lastClick && (
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                Last view: {new Date(analytics.lastClick).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="pt-4 text-center py-8">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No analytics data yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Share your link to start collecting data
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}