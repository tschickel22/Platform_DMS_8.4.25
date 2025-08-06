import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Copy, 
  Mail, 
  MessageSquare, 
  Facebook, 
  Twitter, 
  Linkedin,
  Check,
  ExternalLink,
  Home,
  MapPin
} from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'

interface ShareAllListingsModalProps {
  isOpen: boolean
  onClose: () => void
  listings: any[]
}

export function ShareAllListingsModal({ isOpen, onClose, listings }: ShareAllListingsModalProps) {
  const { tenant } = useTenant()
  const [copied, setCopied] = useState(false)
  
  // Generate the public listings URL
  const baseUrl = window.location.origin
  const listingsUrl = `${baseUrl}/public/listings`
  
  // Generate social media preview data
  const activeListings = listings.filter(listing => listing.status === 'active')
  const totalValue = activeListings.reduce((sum, listing) => sum + listing.rent, 0)
  const avgRent = activeListings.length > 0 ? Math.round(totalValue / activeListings.length) : 0
  
  const previewData = {
    title: `${tenant?.name || 'Property'} Listings - ${activeListings.length} Available Properties`,
    description: `Browse ${activeListings.length} rental properties with an average rent of $${avgRent.toLocaleString()}/month. Find your perfect home today!`,
    image: activeListings[0]?.images?.[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'
  }
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(listingsUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }
  
  const handleEmailShare = () => {
    const subject = encodeURIComponent(previewData.title)
    const body = encodeURIComponent(
      `Check out these amazing rental properties!\n\n${previewData.description}\n\nView all listings: ${listingsUrl}`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }
  
  const handleSMSShare = () => {
    const message = encodeURIComponent(
      `${previewData.title}\n\n${previewData.description}\n\nView listings: ${listingsUrl}`
    )
    window.open(`sms:?body=${message}`)
  }
  
  const handleSocialShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(listingsUrl)
    const encodedTitle = encodeURIComponent(previewData.title)
    const encodedDescription = encodeURIComponent(previewData.description)
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    }
    
    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Share All Listings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Social Media Preview */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Social Media Preview</h3>
            <Card className="border-2">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <img 
                      src={previewData.image} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                      {previewData.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {previewData.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Home className="h-3 w-3" />
                      <span>{activeListings.length} properties</span>
                      <span>•</span>
                      <span>Avg. ${avgRent.toLocaleString()}/mo</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Copy Link */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Share Link</h3>
            <div className="flex gap-2">
              <Input 
                value={listingsUrl} 
                readOnly 
                className="flex-1"
              />
              <Button 
                onClick={handleCopyLink}
                variant="outline"
                className="flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Quick Share Options */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Quick Share</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleEmailShare}
                variant="outline" 
                className="justify-start"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button 
                onClick={handleSMSShare}
                variant="outline" 
                className="justify-start"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                SMS
              </Button>
            </div>
          </div>
          
          {/* Social Media */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Social Media</h3>
            <div className="grid grid-cols-3 gap-3">
              <Button 
                onClick={() => handleSocialShare('facebook')}
                variant="outline" 
                className="justify-start"
              >
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              <Button 
                onClick={() => handleSocialShare('twitter')}
                variant="outline" 
                className="justify-start"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button 
                onClick={() => handleSocialShare('linkedin')}
                variant="outline" 
                className="justify-start"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
            </div>
          </div>
          
          {/* Listing Summary */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">What's Being Shared</h3>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Listings:</span>
                  <span className="ml-2 font-medium">{listings.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Active:</span>
                  <span className="ml-2 font-medium">{activeListings.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Average Rent:</span>
                  <span className="ml-2 font-medium">${avgRent.toLocaleString()}/mo</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Value:</span>
                  <span className="ml-2 font-medium">${totalValue.toLocaleString()}/mo</span>
                </div>
              </div>
              
              {activeListings.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <div className="text-xs text-muted-foreground mb-2">Featured Properties:</div>
                  <div className="flex flex-wrap gap-1">
                    {activeListings.slice(0, 3).map((listing, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {listing.title}
                      </Badge>
                    ))}
                    {activeListings.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{activeListings.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}